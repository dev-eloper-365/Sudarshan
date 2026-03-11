FROM python:3.9-slim

# Install system dependencies including Tesseract
RUN apt-get update && \
    apt-get install -y \
    tesseract-ocr \
    libtesseract-dev \
    libleptonica-dev \
    pkg-config \
    poppler-utils \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set work directory
WORKDIR /app

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your code
COPY . .

# Expose the port
EXPOSE 8000

# Start the server using $PORT (Render sets this); fallback to 8000 locally
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}