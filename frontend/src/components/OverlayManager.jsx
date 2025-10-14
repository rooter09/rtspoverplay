import React, { useState } from "react";
import axios from "axios";

const OverlayManager = ({ overlays, refreshOverlays }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [message, setMessage] = useState("");

  const handleEdit = (overlay) => {
    setEditingId(overlay._id);
    setEditForm({ ...overlay });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/overlays/${editingId}`,
        editForm
      );

      if (response.data.success) {
        setMessage("Overlay updated successfully!");
        setEditingId(null);
        setEditForm({});
        if (refreshOverlays) {
          refreshOverlays();
        }
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error updating overlay:", error);
      setMessage(
        error.response?.data?.error ||
        "Failed to update overlay. Please try again."
      );
    }
  };

  const handleDelete = async (overlayId) => {
    if (!window.confirm("Are you sure you want to delete this overlay?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/overlays/${overlayId}`
      );

      if (response.data.success) {
        setMessage("Overlay deleted successfully!");
        if (refreshOverlays) {
          refreshOverlays();
        }
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error deleting overlay:", error);
      setMessage(
        error.response?.data?.error ||
        "Failed to delete overlay. Please try again."
      );
    }
  };

  if (overlays.length === 0) {
    return (
      <div className="overlay-manager">
        <h3>Overlay Manager</h3>
        <p className="no-overlays">No overlays created yet. Add some overlays using the controls above.</p>
      </div>
    );
  }

  return (
    <div className="overlay-manager">
      <div className="manager-header">
        <h3>Overlay Manager</h3>
        <span className="overlay-count">({overlays.length} overlay{overlays.length !== 1 ? 's' : ''})</span>
      </div>

      {message && (
        <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="overlays-list">
        {overlays.map((overlay) => (
          <div key={overlay._id} className="overlay-item">
            {editingId === overlay._id ? (
              <div className="edit-form">
                <div className="form-group">
                  <label>Text:</label>
                  <input
                    type="text"
                    value={editForm.text || ""}
                    onChange={(e) => handleInputChange("text", e.target.value)}
                    placeholder="Overlay text"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Top:</label>
                    <input
                      type="text"
                      value={editForm.top || ""}
                      onChange={(e) => handleInputChange("top", e.target.value)}
                      placeholder="10px"
                    />
                  </div>
                  <div className="form-group">
                    <label>Left:</label>
                    <input
                      type="text"
                      value={editForm.left || ""}
                      onChange={(e) => handleInputChange("left", e.target.value)}
                      placeholder="10px"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Font Size:</label>
                    <select
                      value={editForm.fontSize || ""}
                      onChange={(e) => handleInputChange("fontSize", e.target.value)}
                    >
                      <option value="12px">Small (12px)</option>
                      <option value="16px">Medium (16px)</option>
                      <option value="20px">Large (20px)</option>
                      <option value="24px">Extra Large (24px)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Color:</label>
                    <input
                      type="color"
                      value={editForm.color || "#ffffff"}
                      onChange={(e) => handleInputChange("color", e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Background:</label>
                  <input
                    type="color"
                    value={editForm.backgroundColor || "rgba(0,0,0,0.5)"}
                    onChange={(e) => handleInputChange("backgroundColor", e.target.value)}
                  />
                </div>

                <div className="edit-buttons">
                  <button
                    onClick={handleUpdate}
                    className="save-button"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="cancel-button"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="overlay-display">
                <div className="overlay-preview">
                  <div
                    className="preview-text"
                    style={{
                      fontSize: overlay.fontSize,
                      color: overlay.color,
                      backgroundColor: overlay.backgroundColor || "rgba(0,0,0,0.5)",
                      padding: "2px 4px",
                      borderRadius: "2px",
                      display: "inline-block"
                    }}
                  >
                    {overlay.text}
                  </div>
                </div>

                <div className="overlay-info">
                  <div className="position-info">
                    <small>Position: {overlay.top}, {overlay.left}</small>
                  </div>
                </div>

                <div className="overlay-actions">
                  <button
                    onClick={() => handleEdit(overlay)}
                    className="edit-button"
                    title="Edit overlay"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(overlay._id)}
                    className="delete-button"
                    title="Delete overlay"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverlayManager;
