#!/bin/bash

echo "Starting RTSP Overlay Service..."

mkdir -p /tmp/stream

echo "Starting FFmpeg stream..."
python auto_start_stream.py &

sleep 5

echo "Starting Flask app..."
exec gunicorn app:app --bind 0.0.0.0:$PORT --workers 1 --threads 2 --timeout 120
