from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from routes.overlays import overlays_bp
from routes.stream import stream_bp
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

app.register_blueprint(overlays_bp, url_prefix="/api/overlays")
app.register_blueprint(stream_bp, url_prefix="/api/stream")

@app.route("/stream/<path:filename>")
def serve_stream(filename):
    stream_dir = os.path.join(os.getcwd(), "stream")
    return send_from_directory(stream_dir, filename)

@app.route("/api/health")
def health_check():
    return jsonify({"status": "healthy", "message": "RTSP Overlay API is running"})

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
