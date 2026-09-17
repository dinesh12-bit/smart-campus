import os

import joblib
import pandas as pd

from database import get_sensor_readings


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


# Load trained anomaly detection model
anomaly_model = joblib.load(
    ANOMALY_MODEL_PATH
)


def get_room_prediction(room_code):
    readings = get_sensor_readings()

    df = pd.DataFrame(readings)

    if df.empty:
        raise ValueError(
            "No sensor readings available."
        )


    # Filter requested room
    room_df = df[
        df["room_code"] == room_code
    ].copy()


    if room_df.empty:
        raise ValueError(
            f"No sensor readings found for {room_code}."
        )


    # Sort latest first
    room_df = room_df.sort_values(
        "recorded_at"
    ).reset_index(drop=True)


    # =========================
    # LATEST READING
    # =========================

    latest = room_df.iloc[-1]


    current_temperature = float(
        latest["temperature"]
    )

    current_humidity = float(
        latest["humidity"]
    )

    current_motion = int(
        latest["motion_detected"]
    )

    current_light = int(
        latest["light_level"]
    )

    recorded_at = latest[
        "recorded_at"
    ]


    # =========================
    # RECENT READINGS
    # =========================

    recent = room_df.tail(6)


    # Temperature trend
    temperature_values = (
        recent["temperature"]
        .astype(float)
        .tolist()
    )


    humidity_values = (
        recent["humidity"]
        .astype(float)
        .tolist()
    )


    if len(temperature_values) >= 2:

        temperature_change = (
            temperature_values[-1]
            -
            temperature_values[0]
        ) / (
            len(temperature_values) - 1
        )

    else:

        temperature_change = 0.0


    if len(humidity_values) >= 2:

        humidity_change = (
            humidity_values[-1]
            -
            humidity_values[0]
        ) / (
            len(humidity_values) - 1
        )

    else:

        humidity_change = 0.0


    # =========================
    # SHORT-TERM FORECAST
    # =========================

    # Forecast approximately 5 readings ahead.
    # ESP32 sends readings approximately
    # every 10 seconds.

    prediction_steps = 5


    predicted_temperature = (
        current_temperature
        +
        temperature_change
        *
        prediction_steps
    )


    predicted_humidity = (
        current_humidity
        +
        humidity_change
        *
        prediction_steps
    )


    # Keep values within practical sensor ranges
    predicted_temperature = max(
        -20.0,
        min(
            predicted_temperature,
            60.0
        )
    )


    predicted_humidity = max(
        0.0,
        min(
            predicted_humidity,
            100.0
        )
    )


    # =========================
    # TREND DIRECTION
    # =========================

    if temperature_change > 0.02:

        temperature_trend = "RISING"

    elif temperature_change < -0.02:

        temperature_trend = "FALLING"

    else:

        temperature_trend = "STABLE"


    if humidity_change > 0.05:

        humidity_trend = "RISING"

    elif humidity_change < -0.05:

        humidity_trend = "FALLING"

    else:

        humidity_trend = "STABLE"


    # =========================
    # ML ANOMALY DETECTION
    # =========================

    anomaly_input = pd.DataFrame(
        [{
            "temperature":
                current_temperature,

            "humidity":
                current_humidity,

            "motion_detected":
                current_motion,

            "light_level":
                current_light
        }]
    )


    anomaly_prediction = (
        anomaly_model.predict(
            anomaly_input
        )[0]
    )


    anomaly_score = (
        anomaly_model.decision_function(
            anomaly_input
        )[0]
    )


    if anomaly_prediction == -1:

        anomaly_status = "ANOMALY"

    else:

        anomaly_status = "NORMAL"


    # =========================
    # RESPONSE
    # =========================

    return {

        "roomCode":
            room_code,

        "current": {

            "temperature":
                round(
                    current_temperature,
                    2
                ),

            "humidity":
                round(
                    current_humidity,
                    2
                ),

            "motionDetected":
                current_motion,

            "lightLevel":
                current_light,

            "recordedAt":
                recorded_at.isoformat()
        },


        "prediction": {

            "temperature":
                round(
                    predicted_temperature,
                    2
                ),

            "humidity":
                round(
                    predicted_humidity,
                    2
                ),

            "temperatureTrend":
                temperature_trend,

            "humidityTrend":
                humidity_trend,

            "predictionSteps":
                prediction_steps,

            "approximateSecondsAhead":
                prediction_steps * 10
        },


        "anomaly": {

            "status":
                anomaly_status,

            "score":
                round(
                    float(anomaly_score),
                    6
                )
        }

    }