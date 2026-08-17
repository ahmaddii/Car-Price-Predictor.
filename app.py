import os
import pickle
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from contextlib import asynccontextmanager

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "car_price_predict_model.pkl")
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")

model = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global model
    if os.path.exists(MODEL_PATH):
        with open(MODEL_PATH, "rb") as file:
            model = pickle.load(file)
        print("Car price prediction model loaded successfully once at startup.")
    else:
        print(f"Warning: Model file not found at {MODEL_PATH}")
    yield


app = FastAPI(title="Car Price Prediction API", lifespan=lifespan)

# Allow frontend to communicate with API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Input data schema
class CarData(BaseModel):
    brand: str
    model: str
    year: float
    mileage: float
    engine_size: float


@app.post("/predict")
def predict_price(car: CarData):
    if model is None:
        raise HTTPException(status_code=500, detail="Model file is not loaded on server.")

    print("Received request:", car.dict())

    data = pd.DataFrame([{
        "brand": car.brand,
        "model": car.model,
        "year": car.year,
        "mileage": car.mileage,
        "engine_size": car.engine_size
    }])

    prediction = model.predict(data)[0]
    predicted_val = max(0.0, float(prediction))
    print("Predicted price:", predicted_val)

    return {
        "predicted_price": round(predicted_val, 2)
    }


ASSETS_DIR = os.path.join(BASE_DIR, "assets")

# Mount assets directory if exists
if os.path.exists(ASSETS_DIR):
    app.mount("/assets", StaticFiles(directory=ASSETS_DIR), name="assets")

# Mount static frontend files if directory exists
if os.path.exists(FRONTEND_DIR):
    app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")