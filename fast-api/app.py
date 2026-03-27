from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI(title="Server Power Anomaly API")

model = joblib.load('../machinelearning/models/iforest_model.joblib')
scaler = joblib.load('../machinelearning/models/scaler.joblib')
threshold = joblib.load('../machinelearning/models/threshold.joblib')

class ServerMetrics(BaseModel):
    cpu_util: float
    memory_util: float
    cpu_change: float
    memory_change: float
    power_change: float
    cpu_rolling_mean: float
    power_rolling_mean: float
    cpu_deviation: float
    power_deviation: float
    hour: int
    day_of_week: int


@app.post("/predict")
def predict_anomaly(metrics: ServerMetrics):
    incoming_data = np.array([[
        metrics.cpu_util,
        metrics.memory_util,
        metrics.cpu_change,
        metrics.memory_change,
        metrics.power_change,
        metrics.cpu_rolling_mean,
        metrics.power_rolling_mean,
        metrics.cpu_deviation,
        metrics.power_deviation,
        metrics.hour,
        metrics.day_of_week
    ]])

    scaled_data = scaler.transform(incoming_data)
    
    score = model.decision_function(scaled_data)[0]

    is_anomaly = bool(score < threshold)
    
    return {
        "anomaly_score": float(score),
        "threshold": float(threshold),
        "is_anomaly": is_anomaly
    }