import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

const StreamControls = ({ onStreamStatusChange }) => {
  const [rtspUrl, setRtspUrl] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [streamStatus, setStreamStatus] = useState({
    is_streaming: false,
    rtsp_url: null,
    start_time: null,
    uptime: null
  });
  const [message, setMessage] = useState("");

  // RTSP URL presets for testing
  const rtspPresets = [
    { name: "RTSP.ME Test Stream", url: "rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov" },
    { name: "DevLine Test Stream", url: "rtsp://8.devline.ru:9784/cameras/18/streaming/sub?authorization=Basic%20YWRtaW46&audio=0" },
    { name: "Custom URL", url: "" }
  ];

  const checkStreamStatus = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/stream/status`);
      if (response.data.success) {
        setStreamStatus(response.data.data);
        if (onStreamStatusChange) {
          onStreamStatusChange(response.data.data.is_streaming);
        }
      }
    } catch (error) {
      console.error("Error checking stream status:", error);
    }
  }, [onStreamStatusChange]);

  useEffect(() => {
    // Check stream status on component mount
    checkStreamStatus();

    // Set up periodic status checking
    const interval = setInterval(checkStreamStatus, 5000);

    return () => clearInterval(interval);
  }, [checkStreamStatus]);

  const validateRtspUrl = (url) => {
    // Check if URL starts with rtsp:// or rtsp://
    return url.toLowerCase().startsWith('rtsp://');
  };

  const handleStartStream = async () => {
    if (!rtspUrl.trim()) {
      setMessage("Please enter an RTSP URL");
      return;
    }

    if (!validateRtspUrl(rtspUrl)) {
      setMessage("Please enter a valid RTSP URL (must start with rtsp://)");
      return;
    }

    setIsStarting(true);
    setMessage("");

    try {
      const response = await axios.post(`${API_BASE_URL}/api/stream/`, {
        rtsp_url: rtspUrl.trim()
      });

      if (response.data.success) {
        setMessage("Stream started successfully!");
        setStreamStatus({
          is_streaming: true,
          rtsp_url: rtspUrl,
          start_time: new Date().toISOString(),
          uptime: "00:00:00"
        });
        if (onStreamStatusChange) {
          onStreamStatusChange(true);
        }
      }
    } catch (error) {
      console.error("Error starting stream:", error);
      setMessage(
        error.response?.data?.error ||
        "Failed to start stream. Please check the RTSP URL and try again."
      );
    } finally {
      setIsStarting(false);
    }
  };

  const handleTestConnection = async () => {
    if (!rtspUrl.trim()) {
      setMessage("Please enter an RTSP URL to test");
      return;
    }

    if (!validateRtspUrl(rtspUrl)) {
      setMessage("Please enter a valid RTSP URL (must start with rtsp://)");
      return;
    }

    setIsTesting(true);
    setMessage("Testing connection...");

    try {
      const response = await axios.post(`${API_BASE_URL}/api/stream/test`, {
        rtsp_url: rtspUrl.trim()
      });
      
      if (response.data.success) {
        setMessage("Connection test successful! RTSP URL is valid.");
      } else {
        setMessage(`Connection test failed: ${response.data.error}`);
      }
    } catch (error) {
      console.error("Error testing connection:", error);
      setMessage(`Connection test failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  const handleStopStream = async () => {
    setIsStopping(true);
    setMessage("");

    try {
      const response = await axios.delete(`${API_BASE_URL}/api/stream/`);

      if (response.data.success) {
        setMessage("Stream stopped successfully!");
        setStreamStatus({
          is_streaming: false,
          rtsp_url: null,
          start_time: null,
          uptime: null
        });
        if (onStreamStatusChange) {
          onStreamStatusChange(false);
        }
      }
    } catch (error) {
      console.error("Error stopping stream:", error);
      setMessage(
        error.response?.data?.error ||
        "Failed to stop stream. Please try again."
      );
    } finally {
      setIsStopping(false);
    }
  };

  const handlePresetSelect = (presetUrl) => {
    setRtspUrl(presetUrl);
  };

  return (
    <div className="stream-controls">
      <div className="controls-header">
        <h3>RTSP Stream Control</h3>
        <div className={`status-indicator ${streamStatus.is_streaming ? 'active' : 'inactive'}`}>
          {streamStatus.is_streaming ? '🟢 Streaming' : '🔴 Stopped'}
        </div>
      </div>

      {streamStatus.is_streaming && (
        <div className="stream-info">
          <div className="info-item">
            <strong>RTSP URL:</strong> {streamStatus.rtsp_url}
          </div>
          <div className="info-item">
            <strong>Stream URL:</strong> {API_BASE_URL}{streamStatus.stream_url}
          </div>
          <div className="info-item">
            <strong>Started:</strong> {new Date(streamStatus.start_time).toLocaleString()}
          </div>
          <div className="info-item">
            <strong>Uptime:</strong> {streamStatus.uptime || "00:00:00"}
          </div>
        </div>
      )}

      <div className="url-input-section">
        <label htmlFor="rtsp-url">RTSP URL:</label>
        <input
          id="rtsp-url"
          type="text"
          value={rtspUrl}
          onChange={(e) => setRtspUrl(e.target.value)}
          placeholder="rtsp://your-camera-ip:port/stream"
          className="url-input"
        />

        <div className="presets-section">
          <label>Test URLs:</label>
          <div className="presets-list">
            {rtspPresets.map((preset, index) => (
              <button
                key={index}
                type="button"
                className={`preset-url ${rtspUrl === preset.url ? 'active' : ''}`}
                onClick={() => handlePresetSelect(preset.url)}
                title={preset.url}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {message && (
        <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="control-buttons">
        {!streamStatus.is_streaming ? (
          <button
            onClick={handleStartStream}
            disabled={isStarting || !rtspUrl.trim()}
            className="start-button"
          >
            {isStarting ? "Starting..." : "▶️ Start Stream"}
          </button>
        ) : (
          <button
            onClick={handleStopStream}
            disabled={isStopping}
            className="stop-button"
          >
            {isStopping ? "Stopping..." : "⏹️ Stop Stream"}
          </button>
        )}
      </div>

      <div className="stream-help">
        <details>
          <summary>Need help with RTSP URLs?</summary>
          <div className="help-content">
            <p><strong>Format:</strong> rtsp://username:password@camera-ip:port/stream</p>
            <p><strong>Common issues:</strong></p>
            <ul>
              <li>Ensure the RTSP stream is accessible from this server</li>
              <li>Check firewall settings and port forwarding</li>
              <li>Verify camera credentials if authentication is required</li>
            </ul>
          </div>
        </details>
      </div>
    </div>
  );
};

export default StreamControls;
