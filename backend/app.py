from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from routes.overlays import overlays_bp
from routes.stream import stream_bp
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Configure CORS to support both localhost and production deployments
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
# Add wildcard for Vercel previews if needed
allowed_origins = cors_origins + ["https://*.vercel.app"]
CORS(app, origins=allowed_origins, supports_credentials=True)

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
