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

from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, r2_score

from database import get_sensor_readings


print("Loading sensor data...")

readings = get_sensor_readings()

df = pd.DataFrame(readings)

print("Total readings:", len(df))


# =========================
# PREPARE DATA
# =========================

df = df.sort_values("recorded_at").reset_index(drop=True)


# Use only ROOM-204 real IoT data
df = df[
    df["room_code"] == "ROOM-204"
].copy()

df = df.reset_index(drop=True)


# Time elapsed from first reading
df["elapsed_minutes"] = (
    df["recorded_at"] -
    df["recorded_at"].iloc[0]
).dt.total_seconds() / 60


# Time features
df["hour"] = df["recorded_at"].dt.hour
df["minute"] = df["recorded_at"].dt.minute


# Previous values
df["previous_temperature"] = (
    df["temperature"].shift(1)
)

df["temperature_change"] = (
    df["temperature"] -
    df["previous_temperature"]
)


df["previous_humidity"] = (
    df["humidity"].shift(1)
)

df["humidity_change"] = (
    df["humidity"] -
    df["previous_humidity"]
)


# =========================
# TARGET
# =========================

# Predict temperature 5 readings ahead
# ESP32 sends approximately every 10 seconds
prediction_steps = 5

df["target_temperature"] = (
    df["temperature"].shift(
        -prediction_steps
    )
)


# Remove incomplete rows
df = df.dropna().reset_index(
    drop=True
)


print(
    "Usable readings:",
    len(df)
)


# =========================
# FEATURES
# =========================

features = [
    "elapsed_minutes",
    "temperature",
    "temperature_change",
    "humidity",
    "humidity_change",
    "hour",
    "minute"
]

target = "target_temperature"


X = df[features]
y = df[target]


# =========================
# CHRONOLOGICAL SPLIT
# =========================

split_index = int(
    len(df) * 0.8
)

X_train = X.iloc[:split_index]
X_test = X.iloc[split_index:]

y_train = y.iloc[:split_index]
y_test = y.iloc[split_index:]


print(
    "\nTraining samples:",
    len(X_train)
)

print(
    "Testing samples:",
    len(X_test)
)


# =========================
# TRAIN MODEL
# =========================

model = LinearRegression()

print(
    "\nTraining Linear Regression model..."
)

model.fit(
    X_train,
    y_train
)


# =========================
# MODEL PREDICTION
# =========================

predictions = model.predict(
    X_test
)


# =========================
# MODEL EVALUATION
# =========================

mae = mean_absolute_error(
    y_test,
    predictions
)

r2 = r2_score(
    y_test,
    predictions
)


print(
    "\n===== ML MODEL RESULTS ====="
)

print(
    "Mean Absolute Error:",
    round(mae, 4),
    "°C"
)

print(
    "R2 Score:",
    round(r2, 4)
)


# =========================
# BASELINE
# =========================

# Baseline simply uses current
# temperature as future temperature.

baseline_predictions = X_test[
    "temperature"
]


baseline_mae = mean_absolute_error(
    y_test,
    baseline_predictions
)

baseline_r2 = r2_score(
    y_test,
    baseline_predictions
)


print(
    "\n===== BASELINE RESULTS ====="
)

print(
    "Baseline MAE:",
    round(baseline_mae, 4),
    "°C"
)

print(
    "Baseline R2:",
    round(baseline_r2, 4)
)


# =========================
# COMPARISON
# =========================

print(
    "\n===== MODEL COMPARISON ====="
)

if mae < baseline_mae:

    print(
        "ML model performs better than baseline."
    )

else:

    print(
        "Baseline performs better than ML model."
    )


# =========================
# SAMPLE PREDICTIONS
# =========================

print(
    "\n===== SAMPLE PREDICTIONS ====="
)

for actual, predicted in zip(
    y_test.head(10),
    predictions[:10]
):

    print(
        "Actual:",
        round(actual, 2),
        "°C | Predicted:",
        round(predicted, 2),
        "°C"
    )


# =========================
# SAVE MODEL
# =========================

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
    "temperature_model.joblib"
)


joblib.dump(
    model,
    model_path
)


print(
    "\nModel saved successfully:"
)

print(model_path)