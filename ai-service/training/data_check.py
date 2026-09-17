import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pandas as pd

from database import get_sensor_readings


readings = get_sensor_readings()

df = pd.DataFrame(readings)

print("\n===== DATASET INFO =====")
print("Total readings:", len(df))

print("\n===== COLUMNS =====")
print(df.columns.tolist())

print("\n===== DATA TYPES =====")
print(df.dtypes)

print("\n===== MISSING VALUES =====")
print(df.isnull().sum())

print("\n===== ROOM COUNTS =====")
print(df["room_code"].value_counts())

print("\n===== TEMPERATURE =====")
print(df["temperature"].describe())

print("\n===== HUMIDITY =====")
print(df["humidity"].describe())

print("\n===== MOTION =====")
print(df["motion_detected"].value_counts())

print("\n===== LIGHT =====")
print(df["light_level"].describe())

print("\n===== FIRST 5 READINGS =====")
print(df.head())

print("\n===== LAST 5 READINGS =====")
print(df.tail())