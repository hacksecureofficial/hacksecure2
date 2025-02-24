import { useState, useRef, useEffect } from 'react';
import type { CSSProperties } from 'react';

type VideoPlayerProps = {
  subVideo: { videoFile: string };
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ subVideo }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isControlsVisible, setControlsVisible] = useState(true);
  const [isMouseVisible, setMouseVisible] = useState(true);
  const [mouseTimer, setMouseTimer] = useState<NodeJS.Timeout | null>(null);

  // Disable right-click and certain shortcuts
  useEffect(() => {
    const preventShortcuts = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && ['s', 'S', 'i', 'I', 'u', 'U'].includes(e.key)) ||
        (e.metaKey && ['s', 'S', 'i', 'I', 'u', 'U'].includes(e.key))
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', preventShortcuts);
    return () => window.removeEventListener('keydown', preventShortcuts);
  }, []);

  // Update video volume and mute state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  }, [isMuted, volume]);

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleMuteToggle = () => setIsMuted((prev) => !prev);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);
    if (videoRef.current) videoRef.current.currentTime = newProgress;
  };

  const handleFullscreenToggle = () => {
    if (!videoContainerRef.current) return;

    const container = videoContainerRef.current as HTMLElement & {
      webkitRequestFullscreen?: () => void;
      msRequestFullscreen?: () => void;
    };

    if (!isFullscreen) {
      container.requestFullscreen?.() ||
        container.webkitRequestFullscreen?.() ||
        container.msRequestFullscreen?.();
    } else {
      const doc = document as Document & {
        webkitExitFullscreen?: () => void;
        msExitFullscreen?: () => void;
      };

      document.exitFullscreen?.() || doc.webkitExitFullscreen?.() || doc.msExitFullscreen?.();
    }

    setIsFullscreen((prev) => !prev);
  };

  const handleRightClick = (e: React.MouseEvent) => e.preventDefault();

  // Update progress bar during playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => setProgress(video.currentTime);

    video.addEventListener('timeupdate', updateProgress);
    return () => video.removeEventListener('timeupdate', updateProgress);
  }, []);

  // Mouse movement handling for control visibility
  useEffect(() => {
    const handleMouseMove = () => {
      if (mouseTimer) clearTimeout(mouseTimer);

      setControlsVisible(true);
      setMouseVisible(true);

      setMouseTimer(
        setTimeout(() => {
          setControlsVisible(false);
          setMouseVisible(false);
        }, 3000)
      );
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseMove);
    };
  }, [mouseTimer]);

  return (
    <div
      ref={videoContainerRef}
      onContextMenu={handleRightClick}
      style={{
        ...(styles.container as CSSProperties),
        cursor: isMouseVisible ? 'auto' : 'none',
      }}
    >
      <video ref={videoRef} src={subVideo.videoFile} controls={false} style={styles.video} />

      {isControlsVisible && (
        <div style={styles.playPauseIcon} onClick={handlePlayPause}>
          {isPlaying ? '❚❚' : '▶️'}
        </div>
      )}

      {isControlsVisible && (
        <>
          <div style={styles.controls}>
            <button onClick={handleMuteToggle} style={styles.controlButton}>
              {isMuted ? 'Unmute' : 'Mute'}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              style={styles.volumeSlider}
            />
          </div>

          <div style={styles.timelineContainer}>
            <input
              type="range"
              min="0"
              max={videoRef.current?.duration ?? 100}
              value={progress}
              onChange={handleProgressChange}
              style={styles.timeline}
            />
          </div>

          <div style={styles.fullscreenButtonContainer}>
            <button onClick={handleFullscreenToggle} style={styles.controlButton}>
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const styles: Record<string, CSSProperties> = {
  container: {
    position: 'relative',
    backgroundColor: '#333',
    width: '100%',
    overflow: 'hidden',
  },
  video: {
    display: 'block',
    width: '100%',
    backgroundColor: 'black',
  },
  playPauseIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '40px',
    color: '#fff',
    cursor: 'pointer',
  },
  controls: {
    position: 'absolute',
    bottom: '40px',
    left: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  controlButton: {
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    padding: '8px',
    borderRadius: '50%',
    cursor: 'pointer',
  },
  volumeSlider: {
    width: '100px',
  },
  timelineContainer: {
    position: 'absolute',
    bottom: '10px',
    left: '20px',
    right: '20px',
  },
  timeline: {
    width: '100%',
    height: '6px',
    borderRadius: '4px',
    background: '#ddd',
  },
  fullscreenButtonContainer: {
    position: 'absolute',
    bottom: '40px',
    right: '20px',
  },
};

export default VideoPlayer;
