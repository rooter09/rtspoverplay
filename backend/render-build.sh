#!/usr/bin/env bash
# Render build script to install FFmpeg and SSL certificates

set -o errexit

echo "Installing system dependencies..."
apt-get update
apt-get install -y ffmpeg ca-certificates

echo "FFmpeg installed successfully"
ffmpeg -version

echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "Build complete!"

