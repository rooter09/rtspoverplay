import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { API_BASE_URL } from "../config";

const VideoPlayer = ({ overlays = [], isStreaming = false, onOverlayMove }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const hlsRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;

      // Cleanup previous HLS instance
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }

      // If not streaming, don't load any video
      if (!isStreaming) {
        setIsLoading(false);
        setError(null);
        return;
      }

      // Check if HLS is supported
      if (Hls.isSupported()) {
        const hlsInstance = new Hls({
          enableWorker: false,
          lowLatencyMode: true,
          backBufferLength: 60,  // Reduced buffer for stability
          liveSyncDurationCount: 3,  // Live stream settings
          liveMaxLatencyDurationCount: 8,  // Reduced for stability
          liveDurationInfinity: true,  // Treat as infinite live stream
          maxBufferLength: 20,  // Smaller buffer for live streaming
          maxMaxBufferLength: 40,  // Reduced max buffer
          liveBackBufferLength: 0,  // Don't keep old segments
          maxBufferSize: 60 * 1000 * 1000,  // 60MB max buffer
          maxBufferHole: 0.5,  // Smaller buffer hole tolerance
          highBufferWatchdogPeriod: 2,  // Check buffer every 2 seconds
          nudgeOffset: 0.1,  // Nudge offset for live sync
          nudgeMaxRetry: 3,  // Max retry attempts
          maxFragLookUpTolerance: 0.2,  // Fragment lookup tolerance
          liveBackBufferLength: 0  // Don't keep old segments
        });

        hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsLoading(false);
          setError(null);
          
          // Ensure video controls are properly initialized
          video.volume = 0.5; // Set to 50% volume
          video.muted = false; // Ensure not muted
          video.controls = true; // Ensure controls are enabled
          
          // Try to play with proper error handling
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              console.log('Video started playing successfully');
              setMessage(""); // Clear any previous messages
            }).catch((error) => {
              console.log('Autoplay blocked, trying muted:', error);
              // If autoplay is blocked, try muted
              video.muted = true;
              video.play().then(() => {
                console.log('Video started playing muted');
                // Show user a message to click to unmute
                setMessage('Click the video to unmute');
              }).catch((mutedError) => {
                console.log('Even muted autoplay failed:', mutedError);
                setMessage('Click the video to start playback');
              });
            });
          }
        });

        hlsInstance.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS Error:', data);
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log('Fatal network error, trying to recover...');
                hlsInstance.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log('Fatal media error, trying to recover...');
                hlsInstance.recoverMediaError();
                break;
              default:
                console.log('Fatal error, destroying and recreating...');
                setError(`Stream error: ${data.details}`);
                setIsLoading(false);
                break;
            }
          } else {
            // Non-fatal errors - log but don't show to user
            console.warn('Non-fatal HLS error:', data);
          }
        });

        // Add fragment loading error handler
        hlsInstance.on(Hls.Events.FRAG_LOAD_ERROR, (event, data) => {
          console.warn('Fragment load error:', data);
          // Don't treat as fatal - let HLS.js handle retry
        });

        // Add level switching handler
        hlsInstance.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
          console.log('Level switched to:', data.level);
        });

        // Add buffer stalled handler
        hlsInstance.on(Hls.Events.BUFFER_STALLED, () => {
          console.warn('Buffer stalled - trying to recover');
          hlsInstance.startLoad();
        });

        // Load the stream
        hlsInstance.loadSource(`${API_BASE_URL}/stream/out.m3u8`);
        hlsInstance.attachMedia(video);

        hlsRef.current = hlsInstance;

      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        video.src = `${API_BASE_URL}/stream/out.m3u8`;
        video.volume = 0.5; // Set to 50% volume
        video.muted = false; // Ensure not muted
        video.controls = true; // Ensure controls are enabled
        setIsLoading(false);
        
        // Try to play with proper error handling for Safari
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            console.log('Safari video started playing successfully');
            setMessage(""); // Clear any previous messages
          }).catch((error) => {
            console.log('Safari autoplay blocked, trying muted:', error);
            video.muted = true;
            video.play().then(() => {
              console.log('Safari video started playing muted');
              setMessage('Click the video to unmute');
            }).catch((mutedError) => {
              console.log('Safari even muted autoplay failed:', mutedError);
              setMessage('Click the video to start playback');
            });
          });
        }
      } else {
        setError("HLS playback not supported in this browser");
        setIsLoading(false);
      }
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [isStreaming]);

  // Ensure controls are always visible
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Simply ensure controls attribute is set, let browser handle the rest
      video.controls = true;
    }
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

  const handleVideoClick = async () => {
    const video = videoRef.current;
    if (video) {
      try {
        // Toggle play/pause
        if (video.paused) {
          await video.play();
          setMessage("");
          console.log('Video started playing after user interaction');
        } else {
          video.pause();
          console.log('Video paused after user interaction');
        }
        
        // If video was muted, try to unmute it
        if (video.muted) {
          video.muted = false;
          video.volume = 0.5; // Set volume to 50%
          setMessage("");
          console.log('Video unmuted after user interaction');
        }
      } catch (error) {
        console.log('Error handling video click:', error);
        setMessage('Unable to start video playback');
      }
    }
  };

  const handleVolumeChange = (e) => {
    const video = videoRef.current;
    if (video) {
      const newVolume = parseFloat(e.target.value);
      video.volume = newVolume;
      video.muted = newVolume === 0;
      console.log('Volume changed to:', newVolume);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
      if (!video.muted && video.volume === 0) {
        video.volume = 0.5; // Set default volume when unmuting
      }
      console.log('Mute toggled:', video.muted);
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

  if (!isStreaming) {
    return (
      <div className="video-player-container">
        <div className="placeholder-container">
          <div className="placeholder-content">
            <div className="placeholder-icon">📹</div>
            <h3>No Stream Active</h3>
            <p>Please add the URL and start streaming</p>
          </div>
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
          playsInline
          muted={false}
          className="video-element"
          style={{ width: "100%", height: "auto" }}
          onLoadedMetadata={() => {
            const video = videoRef.current;
            if (video) {
              video.volume = 0.5;
              video.muted = false;
              // Let browser handle controls naturally
            }
          }}
        />
        

        {/* User interaction message */}
        {message && (
          <div className="video-message" onClick={handleVideoClick}>
            <p>{message}</p>
          </div>
        )}
        
        {/* LIVE indicator */}
        {isStreaming && (
          <div className="live-indicator">
            <span className="live-dot"></span>
            <span className="live-text">LIVE</span>
          </div>
        )}
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
