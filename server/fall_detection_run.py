from ultralytics import YOLO
import cv2
import paho.mqtt.client as mqtt
import yagmail
import time

# === Configuration Email et MQTT ===
SENDER_EMAIL = "bhmoha158@gmail.com"
SENDER_PASSWORD = "hkwu sifb bsim btht"
RECEIVER_EMAIL = "alamissaoui.dev@gmail.com"
MQTT_BROKER = "mqtt.eclipseprojects.io"
MQTT_PORT = 1883
MQTT_TOPIC = "maison/intelligente/chute"

# === YOLO et caméra ===
MODEL_PATH = "best.pt"  # Ton modèle YOLO entraîné
CONFIDENCE_THRESHOLD = 0.8
FRAME_DELAY = 0.1
CAMERA_INDEX = 0  # 0 = webcam intégrée

# === Initialisation ===
model = YOLO(MODEL_PATH)
mqtt_client = mqtt.Client()
yag = yagmail.SMTP(SENDER_EMAIL, SENDER_PASSWORD)

falling_state = {"detected": False}


def connect_mqtt():
    try:
        mqtt_client.connect(MQTT_BROKER, MQTT_PORT, 60)
        mqtt_client.loop_start()
        print("📡 MQTT connecté")
    except Exception as e:
        print(f"❌ Erreur MQTT : {e}")


def send_email(subject, body):
    try:
        print("📨 Envoi d'email...")
        yag.send(to=RECEIVER_EMAIL, subject=subject, contents=body)
        print("📧 Email envoyé à", RECEIVER_EMAIL)
    except Exception as e:
        print(f"❌ Erreur Email : {e}")


def detect_and_alert(frame):
    results = model(frame)
    for result in results:
        boxes = result.boxes.xyxy
        confidences = result.boxes.conf
        classes = result.boxes.cls

        for i, box in enumerate(boxes):
            label = model.names[int(classes[i])]
            confidence = confidences[i].item()

            x1, y1, x2, y2 = map(int, box)
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)
            cv2.putText(
                frame,
                f"{label} {confidence:.2f}",
                (x1, y1 - 10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (0, 0, 255),
                2,
            )

            print(f"[INFO] {label} détecté - confiance: {confidence:.2f}")

            if label.lower() == "falling":
                if not falling_state["detected"]:
                    mqtt_client.publish(MQTT_TOPIC, f"Falling ({confidence:.2f})")
                    send_email("🚨 Chute détectée", f"Confiance: {confidence:.2f}")
                    falling_state["detected"] = True
                else:
                    mqtt_client.publish(MQTT_TOPIC, "Fallen")
                    send_email("❗ Chute confirmée", "La personne est tombée !")
                    falling_state["detected"] = False

    return frame


def main():
    connect_mqtt()
    cap = cv2.VideoCapture(CAMERA_INDEX)

    if not cap.isOpened():
        print("❌ Erreur ouverture caméra.")
        return

    print("🎥 Surveillance activée. Appuyez sur Q pour quitter.")

    while True:
        ret, frame = cap.read()
        if not ret:
            print("❌ Problème de lecture caméra.")
            break

        frame = detect_and_alert(frame)
        cv2.imshow("Détection de Chute", frame)

        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

        time.sleep(FRAME_DELAY)

    cap.release()
    cv2.destroyAllWindows()
    mqtt_client.loop_stop()
    mqtt_client.disconnect()
    print("🛑 Surveillance arrêtée.")


if __name__ == "__main__":
    main()
