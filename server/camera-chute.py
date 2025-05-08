from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ultralytics import YOLO
import cv2
import numpy as np
import base64

# === Initialisation FastAPI ===
app = FastAPI()

# === Configuration CORS ===
# En prod, remplace "*" par tes domaines autorisés
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],  # inclut GET, POST, OPTIONS, etc.
    allow_headers=["*"],
)

# === Chargement du modèle YOLO ===
model = YOLO("best.pt")


# === Schéma de la requête ===
class ImagePayload(BaseModel):
    image: str  # base64-encoded image (avec ou sans "data:image/...;base64,")


# === Une seule route qui gère OPTIONS & POST ===
@app.api_route("/detect", methods=["OPTIONS", "POST"])
async def detect(request: Request):
    # 1) Préflight CORS
    if request.method == "OPTIONS":
        return Response(status_code=200)

    # 2) POST : décoder, détecter et répondre
    body = await request.json()
    data_b64 = body.get("image", "")
    if "," in data_b64:
        data_b64 = data_b64.split(",")[1]

    try:
        decoded = base64.b64decode(data_b64)
        np_arr = np.frombuffer(decoded, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        results = model(frame)
        fall = False
        best_conf = 0.0

        for res in results:
            for i in range(len(res.boxes)):
                lbl = model.names[int(res.boxes.cls[i])]
                conf = float(res.boxes.conf[i])
                if lbl.lower() == "falling" and conf > best_conf:
                    fall = True
                    best_conf = conf

        return {"fall": fall, "confidence": round(best_conf, 2)}

    except Exception as e:
        return {"error": str(e)}
