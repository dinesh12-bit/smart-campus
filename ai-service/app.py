from fastapi import FastAPI
from pydantic import BaseModel

from database import get_tables
from ai_model import detect_anomaly
from prediction import get_room_prediction


app = FastAPI(
    title="Smart Campus AI Service",
    version="1.0.0"
)


class SensorData(BaseModel):
    temperature: float
    humidity: float
    motionDetected: int
    lightLevel: int


@app.get("/")
def home():
    return {
        "service": "Smart Campus AI/ML Service",
        "status": "running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.get("/database")
def database_test():

    try:

        tables = get_tables()

        return {
            "database": "smart_campus_db",
            "status": "connected",
            "tables": tables
        }

    except Exception as e:

        return {
            "database": "smart_campus_db",
            "status": "connection_failed",
            "error": str(e)
        }


@app.post("/predict/anomaly")
def predict_anomaly(data: SensorData):

    result = detect_anomaly(
        temperature=data.temperature,
        humidity=data.humidity,
        motion_detected=data.motionDetected,
        light_level=data.lightLevel
    )

    return {
        "roomCode": "ROOM-204",
        "temperature": data.temperature,
        "humidity": data.humidity,
        "motionDetected": data.motionDetected,
        "lightLevel": data.lightLevel,
        "ai": result
    }


@app.get("/predict/room/{room_code}")
def predict_room(room_code: str):

    try:

        return get_room_prediction(
            room_code
        )

    except ValueError as e:

        return {
            "status": "error",
            "message": str(e)
        }

    except Exception as e:

        return {
            "status": "error",
            "message": "Prediction service failed.",
            "error": str(e)
        }