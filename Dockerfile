FROM python:3.11-slim

WORKDIR /app

# Copy requirements file
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy machine learning model pickle file
COPY car_price_predict_model.pkl .

# Copy backend app and frontend static files
COPY app.py .
COPY assets ./assets
COPY frontend ./frontend

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
