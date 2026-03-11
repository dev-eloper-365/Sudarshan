#!/bin/bash

echo "========================================================"
echo "          Starting Sudarshan Services Locally           "
echo "========================================================"

# Function to cleanly stop all background processes on Ctrl+C (SIGINT/SIGTERM)
cleanup() {
    echo ""
    echo "Stopping all servers..."
    kill $BLOCKCHAIN_PID $OCR_PID $FRONTEND_PID 2>/dev/null
    exit
}
trap cleanup SIGINT SIGTERM

# 1. Start the Blockchain Backend (Node.js)
echo "[1/3] Starting Blockchain Backend on port 6000..."
cd sudarshan-blockchain
node server.js &
BLOCKCHAIN_PID=$!
cd ..

# 2. Start the OCR API Server (Python/FastAPI)
echo "[2/3] Starting OCR Backend on port 8000..."
cd sudarshan-ocr-apiserver
# Assuming python virtualenv is handling uvicorn, or global uvicorn is available
uvicorn app.main:app --reload --port 8000 &
OCR_PID=$!
cd ..

# 3. Start the Webserver (React/Vite/CRA)
echo "[3/3] Starting React Frontend on port 3000..."
cd sudarshan-webserver
pnpm run dev &
FRONTEND_PID=$!
cd ..

echo "========================================================"
echo "All servers are launching in the background!"
echo "Blockchain PID: $BLOCKCHAIN_PID"
echo "OCR PID: $OCR_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "Press Ctrl+C to stop all servers."
echo "========================================================"

# Wait indefinitely so the script doesn't exit and the trap stays active
wait 
