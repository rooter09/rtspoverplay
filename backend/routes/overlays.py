from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from bson import ObjectId
import os

overlays_bp = Blueprint("overlays", __name__)

# Try to connect to MongoDB with timeout
try:
    client = MongoClient(
        os.getenv("MONGO_URI", "mongodb://localhost:27017"),
        serverSelectionTimeoutMS=5000  # 5 second timeout
    )
    # Test the connection
    client.admin.command('ping')
    db = client["rtsp_overlay_app"]
    collection = db["overlays"]
    MONGODB_AVAILABLE = True
    print("✅ MongoDB connected successfully")
except (ConnectionFailure, ServerSelectionTimeoutError) as e:
    MONGODB_AVAILABLE = False
    collection = None
    print(f"⚠️  MongoDB not available: {e}")
    print("⚠️  Overlay persistence disabled. Configure MONGO_URI environment variable to enable.")

@overlays_bp.route("/", methods=["POST"])
def create_overlay():
    try:
        if not MONGODB_AVAILABLE:
            return jsonify({
                "error": "MongoDB not configured. Please configure MONGO_URI environment variable to enable overlay persistence.",
                "success": False
            }), 503

        data = request.get_json()

        if not data:
            return jsonify({"error": "No data provided"}), 400

        required_fields = ["text", "top", "left", "color", "fontSize"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        overlay = {
            "text": data["text"],
            "top": data["top"],
            "left": data["left"],
            "color": data["color"],
            "fontSize": data["fontSize"]
        }

        result = collection.insert_one(overlay)
        overlay["_id"] = str(result.inserted_id)

        return jsonify({
            "success": True,
            "message": "Overlay created successfully",
            "data": overlay
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@overlays_bp.route("/", methods=["GET"])
def get_overlays():
    try:
        if not MONGODB_AVAILABLE:
            return jsonify({
                "success": True,
                "data": [],
                "count": 0,
                "warning": "MongoDB not configured. Overlays will not persist."
            })
        
        overlays = []
        for overlay in collection.find():
            overlay["_id"] = str(overlay["_id"])
            overlays.append(overlay)

        return jsonify({
            "success": True,
            "data": overlays,
            "count": len(overlays)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@overlays_bp.route("/<overlay_id>", methods=["PUT"])
def update_overlay(overlay_id):
    try:
        if not MONGODB_AVAILABLE:
            return jsonify({
                "error": "MongoDB not configured.",
                "success": False
            }), 503

        data = request.get_json()

        if not data:
            return jsonify({"error": "No data provided"}), 400

        # Validate ObjectId
        if not ObjectId.is_valid(overlay_id):
            return jsonify({"error": "Invalid overlay ID"}), 400

        update_data = {}
        allowed_fields = ["text", "top", "left", "color", "fontSize"]

        for field in allowed_fields:
            if field in data:
                update_data[field] = data[field]

        if not update_data:
            return jsonify({"error": "No valid fields to update"}), 400

        result = collection.update_one(
            {"_id": ObjectId(overlay_id)},
            {"$set": update_data}
        )

        if result.matched_count == 0:
            return jsonify({"error": "Overlay not found"}), 404

        return jsonify({
            "success": True,
            "message": "Overlay updated successfully"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@overlays_bp.route("/<overlay_id>", methods=["DELETE"])
def delete_overlay(overlay_id):
    try:
        if not MONGODB_AVAILABLE:
            return jsonify({
                "error": "MongoDB not configured.",
                "success": False
            }), 503

        # Validate ObjectId
        if not ObjectId.is_valid(overlay_id):
            return jsonify({"error": "Invalid overlay ID"}), 400

        result = collection.delete_one({"_id": ObjectId(overlay_id)})

        if result.deleted_count == 0:
            return jsonify({"error": "Overlay not found"}), 404

        return jsonify({
            "success": True,
            "message": "Overlay deleted successfully"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
