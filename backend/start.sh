#!/bin/bash
# Startup script for Render deployment

echo "Starting RTSP Overlay Service..."

# Create stream directory
mkdir -p /tmp/stream

# Start FFmpeg stream in background
echo "Starting FFmpeg stream..."
python auto_start_stream.py &

# Wait a moment for FFmpeg to initialize
sleep 5

# Start Flask app
echo "Starting Flask app..."
exec gunicorn app:app --bind 0.0.0.0:$PORT --workers 1 --threads 2 --timeout 120
