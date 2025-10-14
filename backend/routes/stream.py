from flask import Blueprint, jsonify, request
import os
import subprocess
import threading
import time
from datetime import datetime

stream_bp = Blueprint("stream", __name__)

streaming_status = {
    "is_streaming": False,
    "rtsp_url": None,
    "stream_url": "/stream/out.m3u8",
    "start_time": None,
    "process": None
}

@stream_bp.route("/", methods=["POST"])
def start_stream():
    global streaming_status

    try:
        data = request.get_json()

        if not data or "rtsp_url" not in data:
            return jsonify({"error": "RTSP URL is required"}), 400

        rtsp_url = data["rtsp_url"]

        if streaming_status["is_streaming"]:
            return jsonify({"error": "Stream is already running"}), 400

        success = start_ffmpeg_stream(rtsp_url)

        if success:
            streaming_status.update({
                "is_streaming": True,
                "rtsp_url": rtsp_url,
                "start_time": datetime.now().isoformat()
            })

            return jsonify({
                "success": True,
                "message": "Stream started successfully",
                "stream_url": streaming_status["stream_url"],
                "rtsp_url": rtsp_url
            })
        else:
            return jsonify({"error": "Failed to start stream"}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@stream_bp.route("/", methods=["DELETE"])
def stop_stream():
    global streaming_status

    try:
        if not streaming_status["is_streaming"]:
            return jsonify({"error": "No active stream to stop"}), 400

        success = stop_ffmpeg_stream()

        if success:
            streaming_status.update({
                "is_streaming": False,
                "rtsp_url": None,
                "start_time": None,
                "process": None
            })

            return jsonify({
                "success": True,
                "message": "Stream stopped successfully"
            })
        else:
            return jsonify({"error": "Failed to stop stream"}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@stream_bp.route("/status", methods=["GET"])
def get_stream_status():
    global streaming_status

    return jsonify({
        "success": True,
        "data": {
            "is_streaming": streaming_status["is_streaming"],
            "rtsp_url": streaming_status["rtsp_url"],
            "stream_url": streaming_status["stream_url"],
            "start_time": streaming_status["start_time"],
            "uptime": calculate_uptime() if streaming_status["is_streaming"] else None
        }
    })

def start_ffmpeg_stream(rtsp_url):
    try:
        stream_dir = os.path.join(os.getcwd(), "stream")
        os.makedirs(stream_dir, exist_ok=True)
        command = [
            "ffmpeg",
            "-i", rtsp_url,
            "-c:v", "libx264",
            "-preset", "ultrafast",
            "-tune", "zerolatency",
            "-f", "hls",
            "-hls_time", "2",
            "-hls_list_size", "5",
            "-hls_flags", "delete_segments+independent_segments",
            "-hls_segment_type", "mpegts",
            "-hls_segment_filename", os.path.join(stream_dir, "segment_%03d.ts"),
            os.path.join(stream_dir, "out.m3u8")
        ]

        process = subprocess.Popen(
            command,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            preexec_fn=os.setsid if os.name != 'nt' else None
        )

        streaming_status["process"] = process

        time.sleep(2)

        if process.poll() is None:
            return True
        else:
            stdout, stderr = process.communicate()
            print(f"FFmpeg failed: {stderr.decode()}")
            return False

    except Exception as e:
        print(f"Error starting FFmpeg: {str(e)}")
        return False

def stop_ffmpeg_stream():
    try:
        if streaming_status["process"]:
            if os.name == 'nt':
                streaming_status["process"].terminate()
            else:
                os.killpg(os.getpgid(streaming_status["process"].pid), 9)

            streaming_status["process"].wait(timeout=10)

        return True

    except Exception as e:
        print(f"Error stopping FFmpeg: {str(e)}")
        return False

def calculate_uptime():
    if not streaming_status["start_time"]:
        return None

    try:
        start_time = datetime.fromisoformat(streaming_status["start_time"])
        delta = datetime.now() - start_time
        hours, remainder = divmod(int(delta.total_seconds()), 3600)
        minutes, seconds = divmod(remainder, 60)
        return f"{hours:02d}:{minutes:02d}:{seconds:02d}"
    except Exception:
        return None
