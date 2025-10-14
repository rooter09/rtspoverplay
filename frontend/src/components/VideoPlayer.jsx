import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { API_BASE_URL } from "../config";

const VideoPlayer = ({ overlays = [], onOverlayMove }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [hls, setHls] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;

      // Cleanup previous HLS instance
      if (hls) {
        hls.destroy();
      }

      // Check if HLS is supported
      if (Hls.isSupported()) {
        const hlsInstance = new Hls({
          enableWorker: false,
          lowLatencyMode: true,
          backBufferLength: 90
        });

        hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsLoading(false);
          setError(null);
        });

        hlsInstance.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS Error:', data);
          setError(`Stream error: ${data.details}`);
          setIsLoading(false);
        });

        hlsInstance.loadSource(`${API_BASE_URL}/stream/out.m3u8`);
        hlsInstance.attachMedia(video);

        setHls(hlsInstance);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        video.src = `${API_BASE_URL}/stream/out.m3u8`;
        setIsLoading(false);
      } else {
        setError("HLS playback not supported in this browser");
        setIsLoading(false);
      }
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, []);

  const handleOverlayMouseDown = (e, overlayId) => {
    e.preventDefault();
    if (onOverlayMove) {
      onOverlayMove(overlayId, true);
    }
  };

  const handleOverlayMouseUp = (e, overlayId) => {
    e.preventDefault();
    if (onOverlayMove) {
      onOverlayMove(overlayId, false);
    }
  };

  if (error) {
    return (
      <div className="video-error">
        <div className="error-message">
          <h3>Stream Error</h3>
          <p>{error}</p>
          <p>Please ensure the RTSP stream is running on the backend.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="video-player-container" ref={containerRef}>
      <div className="video-wrapper">
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading stream...</p>
            </div>
          </div>
        )}
        <video
          ref={videoRef}
          controls
          autoPlay
          muted
          className="video-element"
          style={{ width: "100%", height: "auto" }}
        />
      </div>

      {/* Render overlays */}
      <div className="overlays-container">
        {overlays.map((overlay) => (
          <div
            key={overlay._id}
            className="overlay-item"
            style={{
              position: "absolute",
              top: overlay.top,
              left: overlay.left,
              fontSize: overlay.fontSize,
              color: overlay.color,
              backgroundColor: overlay.backgroundColor || "rgba(0,0,0,0.5)",
              padding: "4px 8px",
              borderRadius: "4px",
              cursor: "move",
              userSelect: "none",
              border: "1px solid rgba(255,255,255,0.3)",
              zIndex: 1000,
            }}
            onMouseDown={(e) => handleOverlayMouseDown(e, overlay._id)}
            onMouseUp={(e) => handleOverlayMouseUp(e, overlay._id)}
            title={`Overlay: ${overlay.text}`}
          >
            {overlay.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoPlayer;
