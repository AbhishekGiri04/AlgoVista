#!/bin/bash

# Kill any existing processes on ports 3000 and 8000
echo "Stopping existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:8000 | xargs kill -9 2>/dev/null

echo "Starting backend server..."
cd "$(dirname "$0")/backend" && npm start &
BACKEND_PID=$!

echo "Starting frontend server..."
cd "$(dirname "$0")/frontend" && npm start &
FRONTEND_PID=$!

echo "Backend running on http://localhost:8000"
echo "Frontend running on http://localhost:3000"
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID