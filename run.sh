#!/bin/bash

# Define colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting SolarOpti.ai full stack...${NC}"

# 1. Start Python FastAPI Microservice
echo -e "${BLUE}Starting ML Microservice on port 8000...${NC}"
cd ml-service
# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 &
ML_PID=$!
cd ..

# 2. Start Node.js Backend Server
echo -e "${GREEN}Starting Node.js Express server on port 5000...${NC}"
cd server
npm install
npm run dev &
NODE_PID=$!
cd ..

# 3. Start React Frontend
echo -e "${YELLOW}Starting React Frontend (Vite)...${NC}"
npm install
npm run dev &
VITE_PID=$!

# Trap SIGINT (Ctrl+C) to gracefully stop all background processes
trap "echo -e '\nStopping all servers...'; kill $ML_PID $NODE_PID $VITE_PID; exit 0" SIGINT

echo -e "${GREEN}All servers are running! Press Ctrl+C to stop.${NC}"

# Wait for all background processes
wait
