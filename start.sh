#!/bin/bash

echo "🚀 Starting InstaChat Application..."

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "node" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
pkill -f "nodemon" 2>/dev/null || true

# Wait a moment
sleep 2

# Start backend
echo "🔧 Starting backend server..."
cd backend
node src/server.js &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "✅ Both servers are starting..."
echo "📱 Frontend will be available at: http://localhost:5173/"
echo "🔧 Backend is running on: http://localhost:5001/"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait

