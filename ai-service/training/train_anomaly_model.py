import sys
import os

sys.path.append(
    os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )
)

import pandas as pd
import joblib

from sklearn.ensemble import IsolationForest

from database import get_sensor_readings


print("Loading sensor data...")

readings = get_sensor_readings()

df = pd.DataFrame(readings)

print("Total readings:", len(df))


# Sort readings by time
df = df.sort_values("recorded_at").reset_index(drop=True)


# Features used for anomaly detection
features = [
    "temperature",
    "humidity",
    "motion_detected",
    "light_level"
]

X = df[features].copy()


# Train Isolation Forest
print("\nTraining Isolation Forest model...")

model = IsolationForest(
    n_estimators=200,
    contamination=0.05,
    random_state=42
)

model.fit(X)


# Predict anomalies
df["prediction"] = model.predict(X)

df["anomaly_score"] = model.decision_function(X)


# Convert prediction:
# 1  = normal
# -1 = anomaly
df["status"] = df["prediction"].apply(
    lambda value: "ANOMALY" if value == -1 else "NORMAL"
)


# Statistics
normal_count = (
    df["status"] == "NORMAL"
).sum()

anomaly_count = (
    df["status"] == "ANOMALY"
).sum()


print("\n===== ANOMALY RESULTS =====")

print("Normal readings:", normal_count)
print("Anomalous readings:", anomaly_count)

print(
    "Anomaly percentage:",
    round(
        (anomaly_count / len(df)) * 100,
        2
    ),
    "%"
)


# Show anomalies
print("\n===== DETECTED ANOMALIES =====")

anomalies = df[
    df["status"] == "ANOMALY"
]

if len(anomalies) == 0:

    print("No anomalies detected.")

else:

    print(
        anomalies[
            [
                "id",
                "room_code",
                "temperature",
                "humidity",
                "motion_detected",
                "light_level",
                "recorded_at",
                "anomaly_score"
            ]
        ].to_string(index=False)
    )


# Show latest readings with AI status
print("\n===== LATEST READINGS =====")

print(
    df[
        [
            "room_code",
            "temperature",
            "humidity",
            "motion_detected",
            "light_level",
            "status"
        ]
    ].tail(10).to_string(index=False)
)


# Save model
project_directory = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

model_directory = os.path.join(
    project_directory,
    "model"
)

os.makedirs(
    model_directory,
    exist_ok=True
)


model_path = os.path.join(
    model_directory,
    "anomaly_model.joblib"
)


joblib.dump(
    model,
    model_path
)


print("\nModel saved successfully:")
print(model_path)