# Car Price Predictor

A machine learning-powered web application that predicts a vehicle's market price based on key details such as brand, model, year, mileage, and engine size.

This project includes:
- FastAPI backend
- Static frontend with HTML, CSS, and JavaScript
- ML model inference using a saved pickle model
- Docker support for easy local deployment

## Live Demo
You can run the app locally or deploy it to any hosting service that supports Python/FastAPI.

## Project Structure

```
car-price-predictor/
├── app.py
├── car_price_predict_model.pkl
├── requirements.txt
├── Dockerfile
├── assets/
│   ├── favicon.png
│   ├── loading.json
│   ├── profile.png
│   └── Success.json
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
└── README.md
```

## Features
- Predict car price using model inference
- Responsive frontend interface
- API endpoint for machine learning predictions
- Dockerized setup for local deployment

## Tech Stack
- Python
- FastAPI
- Pandas
- Scikit-learn
- Pickle model serialization
- HTML/CSS/JavaScript
- Docker

## Prerequisites
Make sure you have the following installed:

- Python 3.10+
- pip
- Docker (optional, only if you want containerized deployment)

## Installation

Clone the repository:

```bash
git clone https://github.com/<your-username>/car-price-predictor.git
cd car-price-predictor
```

Create and activate a virtual environment:

```bash
python -m venv .venv
source .venv/bin/activate
```

On Windows:
```bash
python -m venv .venv
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

## Run the Application Locally

Start the FastAPI server:

```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

Then open in your browser:

```bash
http://localhost:8000
```

The app serves the frontend from the `frontend/` folder and exposes the prediction API.

## Test the API

### 1. Open the frontend
Visit:
```bash
http://localhost:8000
```

### 2. Test the prediction endpoint using curl

```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "brand": "Toyota",
    "model": "Corolla",
    "year": 2019,
    "mileage": 35000,
    "engine_size": 1.8
  }'
```

Example response:
```json
{
  "predicted_price": 17800.0
}
```

## Docker Setup

Build the Docker image:

```bash
docker build -t car-price-predictor .
```

Run the container:

```bash
docker run -d -p 8000:8000 --name car-price-app car-price-predictor
```

Then open:
```bash
http://localhost:8000
```

To stop the container:
```bash
docker stop car-price-app
```

## Model File
The project expects a serialized model file named:

```bash
car_price_predict_model.pkl
```

This file should be present in the project root directory. If it is missing, the app will start but prediction requests may fail.

## Notes
- The frontend static files are served from the `frontend/` directory.
- The favicon is served from `assets/favicon.png`.
- CORS is enabled for frontend-to-backend communication.

## License
This project is for educational and portfolio use.

## Author
Malik Ahmad Rasheed

## Contact
Connect with me on [LinkedIn](https://www.linkedin.com/in/malik-ahmad-rasheed-3768902a9/) or check out my [GitHub](https://github.com/ahmaddii).
