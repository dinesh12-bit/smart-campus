import os

import joblib
import pandas as pd


BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

MODEL_DIR = os.path.join(
    BASE_DIR,
    "model"
)

ANOMALY_MODEL_PATH = os.path.join(
    MODEL_DIR,
    "anomaly_model.joblib"
)


# Load trained anomaly model
anomaly_model = joblib.load(
    ANOMALY_MODEL_PATH
)


def detect_anomaly(
    temperature,
    humidity,
    motion_detected,
    light_level
):
    data = pd.DataFrame(
        [{
            "temperature": temperature,
            "humidity": humidity,
            "motion_detected": motion_detected,
            "light_level": light_level
        }]
    )

    prediction = anomaly_model.predict(data)[0]

    anomaly_score = anomaly_model.decision_function(data)[0]

    if prediction == -1:
        status = "ANOMALY"
    else:
        status = "NORMAL"

    return {
        "status": status,
        "anomalyScore": round(
            float(anomaly_score),
            6
        )
    }