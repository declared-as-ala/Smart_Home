import os
import base64
import logging
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, UploadFile, File, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import cv2
from ultralytics import YOLO
import yagmail

# Load configuration
load_dotenv()
SENDER_EMAIL = os.getenv("SENDER_EMAIL")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD")
RECEIVER_EMAIL = os.getenv("RECEIVER_EMAIL")
MODEL_PATH = os.getenv("MODEL_PATH", "best.pt")
CONFIDENCE_THRESHOLD = float(os.getenv("CONFIDENCE_THRESHOLD", 0.8))

if not all([SENDER_EMAIL, SENDER_PASSWORD, RECEIVER_EMAIL]):
    raise RuntimeError(
        "Please set SENDER_EMAIL, SENDER_PASSWORD, RECEIVER_EMAIL in .env"
    )

# Logging setup
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
)

# Load YOLO model
logging.info("Loading YOLO model from %s", MODEL_PATH)
model = YOLO(MODEL_PATH)

# Email client setup
yag = yagmail.SMTP(SENDER_EMAIL, SENDER_PASSWORD)

# FastAPI app setup
app = FastAPI(title="Fall Detection Service")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ImagePayload(BaseModel):
    image: str  # Base64-encoded JPEG


# Store active WebSocket connections
active_connections: set[WebSocket] = set()


@app.websocket("/camera-stream")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.add(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Broadcast the frame to all connected mobile clients
            for connection in active_connections:
                if connection != websocket:
                    await connection.send_text(data)
    except Exception as e:
        logging.error(f"WebSocket error: {e}")
    finally:
        active_connections.remove(websocket)


@app.post("/detect")
async def detect(payload: ImagePayload):
    try:
        # Decode base64 image
        img_data = base64.b64decode(payload.image)
        nparr = np.frombuffer(img_data, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    except Exception:
        logging.exception("Image decode failed")
        return {"fall": False, "error": "invalid image"}

    logging.info("📷 Frame received from frontend")
    results = model(frame)

    for res in results:
        for conf, cls in zip(res.boxes.conf, res.boxes.cls):
            label = model.names[int(cls)].lower()
            confidence = float(conf)
            logging.info(f"Result: {label}, confidence: {confidence:.2f}")

            if label == "falling" and confidence >= CONFIDENCE_THRESHOLD:
                # Send email alert
                yag.send(
                    to=RECEIVER_EMAIL,
                    subject="Fall Alert",
                    contents=f"Fall detected with confidence {confidence:.2f}",
                )
                return {"fall": True, "confidence": confidence}

    return {"fall": False}


@app.post("/upload-video")
async def upload_video(file: UploadFile = File(...)):
    filepath = f"temp_{file.filename}"
    try:
        with open(filepath, "wb") as f:
            f.write(await file.read())

        logging.info(f"🎥 Video uploaded: {filepath}")
        cap = cv2.VideoCapture(filepath)
        frame_count = 0

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            results = model(frame)
            for res in results:
                for conf, cls in zip(res.boxes.conf, res.boxes.cls):
                    label = model.names[int(cls)].lower()
                    confidence = float(conf)
                    logging.info(f"[Frame {frame_count}] {label}: {confidence:.2f}")

                    if label == "falling" and confidence >= CONFIDENCE_THRESHOLD:
                        yag.send(
                            to=RECEIVER_EMAIL,
                            subject="Fall Alert from Video",
                            contents=f"Frame {frame_count} fall with confidence {confidence:.2f}",
                        )
            frame_count += 1

        cap.release()
        return {"message": "Video processed", "frames": frame_count}

    except Exception as e:
        logging.exception("Video processing failed")
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if os.path.exists(filepath):
            os.remove(filepath)
