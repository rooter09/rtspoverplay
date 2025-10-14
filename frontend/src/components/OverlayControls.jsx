import React, { useState } from "react";
import axios from "axios";

const OverlayControls = ({ refreshOverlays, isStreaming }) => {
  const [formData, setFormData] = useState({
    text: "",
    top: "20px",
    left: "20px",
    color: "#ffffff",
    fontSize: "16px",
    backgroundColor: "rgba(0,0,0,0.5)"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.text.trim()) {
      setMessage("Please enter overlay text");
      return;
    }

    if (!isStreaming) {
      setMessage("Please start the RTSP stream first");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await axios.post("http://localhost:5000/api/overlays/", {
        text: formData.text.trim(),
        top: formData.top,
        left: formData.left,
        color: formData.color,
        fontSize: formData.fontSize,
        backgroundColor: formData.backgroundColor
      });

      if (response.data.success) {
        setMessage("Overlay added successfully!");
        setFormData({
          text: "",
          top: "20px",
          left: "20px",
          color: "#ffffff",
          fontSize: "16px",
          backgroundColor: "rgba(0,0,0,0.5)"
        });

        if (refreshOverlays) {
          refreshOverlays();
        }
      }
    } catch (error) {
      console.error("Error creating overlay:", error);
      setMessage(
        error.response?.data?.error ||
        "Failed to create overlay. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const presets = [
    { name: "Top Left", top: "10px", left: "10px" },
    { name: "Top Center", top: "10px", left: "50%", transform: "translateX(-50%)" },
    { name: "Top Right", top: "10px", right: "10px", left: "auto" },
    { name: "Bottom Left", bottom: "10px", left: "10px", top: "auto" },
    { name: "Bottom Center", bottom: "10px", left: "50%", top: "auto", transform: "translateX(-50%)" },
    { name: "Bottom Right", bottom: "10px", right: "10px", left: "auto", top: "auto" }
  ];

  const applyPreset = (preset) => {
    setFormData(prev => ({
      ...prev,
      top: preset.top || "20px",
      left: preset.left || "20px"
    }));
  };

  return (
    <div className="overlay-controls">
      <div className="controls-header">
        <h3>Add New Overlay</h3>
        {!isStreaming && (
          <div className="warning-message">
            ⚠️ Start the RTSP stream first to see overlays
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="overlay-form">
        <div className="form-group">
          <label htmlFor="overlay-text">Text:</label>
          <input
            id="overlay-text"
            type="text"
            value={formData.text}
            onChange={(e) => handleInputChange("text", e.target.value)}
            placeholder="Enter overlay text"
            maxLength={50}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="top-position">Top:</label>
            <input
              id="top-position"
              type="text"
              value={formData.top}
              onChange={(e) => handleInputChange("top", e.target.value)}
              placeholder="10px"
            />
          </div>
          <div className="form-group">
            <label htmlFor="left-position">Left:</label>
            <input
              id="left-position"
              type="text"
              value={formData.left}
              onChange={(e) => handleInputChange("left", e.target.value)}
              placeholder="10px"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="font-size">Font Size:</label>
            <select
              id="font-size"
              value={formData.fontSize}
              onChange={(e) => handleInputChange("fontSize", e.target.value)}
            >
              <option value="12px">Small (12px)</option>
              <option value="16px">Medium (16px)</option>
              <option value="20px">Large (20px)</option>
              <option value="24px">Extra Large (24px)</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="text-color">Color:</label>
            <input
              id="text-color"
              type="color"
              value={formData.color}
              onChange={(e) => handleInputChange("color", e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="background-color">Background:</label>
          <input
            id="background-color"
            type="color"
            value={formData.backgroundColor}
            onChange={(e) => handleInputChange("backgroundColor", e.target.value)}
          />
        </div>

        <div className="presets-section">
          <label>Quick Positions:</label>
          <div className="presets-grid">
            {presets.map((preset, index) => (
              <button
                key={index}
                type="button"
                className="preset-button"
                onClick={() => applyPreset(preset)}
                title={`${preset.name}: ${preset.top || 'auto'}, ${preset.left || preset.right || 'auto'}`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {message && (
          <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          className="submit-button"
          disabled={isSubmitting || !isStreaming}
        >
          {isSubmitting ? "Adding..." : "Add Overlay"}
        </button>
      </form>
    </div>
  );
};

export default OverlayControls;
