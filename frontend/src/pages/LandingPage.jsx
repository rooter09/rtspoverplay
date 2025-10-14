import React, { useState, useEffect } from "react";
import axios from "axios";
import VideoPlayer from "../components/VideoPlayer";
import OverlayControls from "../components/OverlayControls";
import OverlayManager from "../components/OverlayManager";
import StreamControls from "../components/StreamControls";
import "./LandingPage.css";

const LandingPage = () => {
  const [overlays, setOverlays] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeTab, setActiveTab] = useState("stream");

  useEffect(() => {
    fetchOverlays();
  }, []);

  const fetchOverlays = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/overlays/");
      if (response.data.success) {
        setOverlays(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching overlays:", error);
    }
  };

  const handleStreamStatusChange = (streaming) => {
    setIsStreaming(streaming);
  };

  const tabs = [
    { id: "stream", label: "Stream Control", icon: "📹" },
    { id: "overlays", label: "Add Overlay", icon: "✏️" },
    { id: "manage", label: "Manage Overlays", icon: "⚙️" }
  ];

  return (
    <div className="landing-page">
      <header className="app-header">
        <div className="header-content">
          <div className="company-logo">
            <h1 className="logo-text">LiveSitter</h1>
            <span className="logo-tagline">RTSP Professional</span>
          </div>
          <p>Real-time video streaming with dynamic text overlays</p>
        </div>
      </header>

      <main className="main-content">
        <div className="controls-section">
          <div className="tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="tab-content">
            {activeTab === "stream" && (
              <StreamControls onStreamStatusChange={handleStreamStatusChange} />
            )}

            {activeTab === "overlays" && (
              <OverlayControls
                refreshOverlays={fetchOverlays}
                isStreaming={isStreaming}
              />
            )}

            {activeTab === "manage" && (
              <OverlayManager
                overlays={overlays}
                refreshOverlays={fetchOverlays}
              />
            )}
          </div>
        </div>

        <div className="video-section">
          <div className="video-container">
            <VideoPlayer
              overlays={overlays}
              onOverlayMove={(overlayId, isDragging) => {
                console.log("Overlay drag:", overlayId, isDragging);
              }}
            />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>&copy; 2025 LiveSitter RTSP Professional</p>
          <div className="footer-links">
            <a href="#docs" target="_blank" rel="noopener noreferrer">
              Documentation
            </a>
            <a href="https://github.com/rooter09/rtspoverplay" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
