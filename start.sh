#!/bin/bash

# Kill any existing processes on ports 3000 and 8000
echo "Stopping existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:8000 | xargs kill -9 2>/dev/null

echo "Starting backend server..."
cd "$(dirname "$0")/backend" && npm start > /dev/null 2>&1 &
BACKEND_PID=$!

echo "Starting frontend server..."
cd "$(dirname "$0")/frontend" && DISABLE_ESLINT_PLUGIN=true npm start &
FRONTEND_PID=$!

echo ""
echo "✅ Backend running on http://localhost:8000"
echo "✅ Frontend running on http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Trap Ctrl+C to kill both processes
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID