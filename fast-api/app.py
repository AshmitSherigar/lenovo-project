from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
import os

app = FastAPI(title="Server Power Anomaly API")

BASE_MODEL_PATH = "/Users/ayushmishra06/Desktop/Lenovo/lenovo-project/models"

models_cache = {}

class ServerMetrics(BaseModel):
    server_id: str   # "s1", "s2", "s3"

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


def load_server_model(server_id: str):
    if server_id in models_cache:
        return models_cache[server_id]

    server_path = os.path.join(BASE_MODEL_PATH, server_id)

    try:
        model = joblib.load(os.path.join(server_path, "model.joblib"))
        scaler = joblib.load(os.path.join(server_path, "scaler.joblib"))
        threshold = joblib.load(os.path.join(server_path, "threshold.joblib"))
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Model for {server_id} not found")

    models_cache[server_id] = {
        "model": model,
        "scaler": scaler,
        "threshold": threshold
    }

    return models_cache[server_id]


@app.post("/predict")
def predict_anomaly(metrics: ServerMetrics):

    server_model = load_server_model(metrics.server_id)

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

    scaled_data = server_model["scaler"].transform(incoming_data)

    score = server_model["model"].decision_function(scaled_data)[0]
    threshold = server_model["threshold"]

    is_anomaly = bool(score < threshold)

    return {
        "server": metrics.server_id,
        "anomaly_score": float(score),
        "threshold": float(threshold),
        "is_anomaly": is_anomaly
    }

@app.get("/")
def health_check():
    return {"status": "API is running"}