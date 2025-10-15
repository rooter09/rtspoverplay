#!/usr/bin/env python3
"""Auto-start stream script for Render deployment."""

import os
import subprocess
import time
import signal
import sys
from datetime import datetime

def start_auto_stream():
    """Start FFmpeg stream automatically on service startup"""
    
    rtsp_url = os.getenv("DEFAULT_RTSP_URL", "rtsp://8.devline.ru:9784/cameras/18/streaming/sub?authorization=Basic%20YWRtaW46&audio=0")
    stream_dir = "/tmp/stream"
    os.makedirs(stream_dir, exist_ok=True)
    
    print(f"Auto-starting FFmpeg stream...")
    print(f"RTSP URL: {rtsp_url}")
    print(f"Stream directory: {stream_dir}")
    
    try:
        subprocess.run(["ffmpeg", "-version"], capture_output=True, check=True)
        print("FFmpeg is available")
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("FFmpeg not found - skipping auto stream")
        return
    command = [
        "ffmpeg",
        "-rtsp_transport", "tcp",
        "-rtsp_flags", "prefer_tcp",
        "-timeout", "5000000",
        "-i", rtsp_url,
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-tune", "zerolatency",
        "-g", "50",
        "-sc_threshold", "0",
        "-b:v", "1000k",
        "-maxrate", "1200k",
        "-bufsize", "2000k",
        "-r", "25",
        "-c:a", "aac",
        "-b:a", "96k",
        "-ar", "44100",
        "-ac", "2",
        "-shortest",
        "-f", "hls",
        "-hls_time", "3",
        "-hls_list_size", "6",
        "-hls_flags", "delete_segments+append_list+omit_endlist",
        "-hls_segment_type", "mpegts",
        "-hls_segment_filename", os.path.join(stream_dir, "segment_%03d.ts"),
        "-start_number", "0",
        "-loglevel", "info",
        "-y",
        os.path.join(stream_dir, "out.m3u8")
    ]
    
    try:
        print(f"Starting FFmpeg process...")
        process = subprocess.Popen(
            command,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            universal_newlines=True,
            bufsize=1
        )
        
        print(f"FFmpeg started with PID: {process.pid}")
        
        time.sleep(10)
        
        playlist_path = os.path.join(stream_dir, "out.m3u8")
        if os.path.exists(playlist_path):
            print("Playlist created successfully")
        else:
            print("Playlist not created yet - stream may still be initializing")
        
        return process
        
    except Exception as e:
        print(f"Error running FFmpeg: {e}")
        return None

if __name__ == "__main__":
    if os.getenv("RENDER"):
        print("Running on Render - starting auto stream")
        start_auto_stream()
    else:
        print("Running locally - auto stream disabled")
