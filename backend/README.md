# Fall Detection Backend

This is the backend service for the fall detection application. It uses FastAPI and YOLO for fall detection.

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Place your YOLO model file (`best.pt`) in the root directory

3. Configure environment variables in `.env`

4. Run the server:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

## API Endpoints

- POST `/detect`: Detect falls in a base64-encoded image
- POST `/upload-video`: Process a video file for fall detection

## Environment Variables

- `SENDER_EMAIL`: Email address to send alerts from
- `SENDER_PASSWORD`: Email password or app-specific password
- `RECEIVER_EMAIL`: Email address to receive alerts
- `MODEL_PATH`: Path to YOLO model file (default: "best.pt")
- `CONFIDENCE_THRESHOLD`: Minimum confidence for fall detection (default: 0.8)