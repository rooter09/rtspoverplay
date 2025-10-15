#!/usr/bin/env bash
# Render build script to install FFmpeg

set -o errexit  # Exit on error

echo "📦 Installing FFmpeg..."
apt-get update
apt-get install -y ffmpeg

echo "✅ FFmpeg installed successfully"
ffmpeg -version

echo "📦 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "✅ Build complete!"

