import React from 'react';
import type { ControlsProps } from '../types';

const defaultStyles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '12px 16px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: '8px',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    padding: 0,
    border: 'none',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonHover: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  playButton: {
    width: '44px',
    height: '44px',
    backgroundColor: '#3b82f6',
  },
  controlGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  label: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.7)',
    minWidth: '40px',
    textAlign: 'center' as const,
  },
  select: {
    padding: '4px 8px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    borderRadius: '4px',
    color: 'white',
    fontSize: '12px',
    cursor: 'pointer',
  },
  volumeSlider: {
    width: '60px',
    height: '4px',
    appearance: 'none' as const,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '2px',
    cursor: 'pointer',
  },
  spacer: {
    flex: 1,
  },
  frameCounter: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'monospace',
  },
};

// Simple SVG icons
const PlayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);

const StopIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 6h12v12H6z" />
  </svg>
);

const PrevFrameIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z" />
  </svg>
);

const NextFrameIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
  </svg>
);

const VolumeIcon = ({ muted, volume }: { muted: boolean; volume: number }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    {muted || volume === 0 ? (
      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
    ) : volume < 0.5 ? (
      <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
    ) : (
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    )}
  </svg>
);

const LoopIcon = ({ active }: { active: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{ opacity: active ? 1 : 0.5 }}
  >
    <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
  </svg>
);

const SPEED_OPTIONS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 4];

/**
 * Playback controls component
 */
export function Controls({
  state,
  controls,
  className,
  showSpeedControl = true,
  showVolumeControl = true,
  showFrameCounter = true,
}: ControlsProps): React.ReactElement {
  return (
    <div className={className} style={defaultStyles.container}>
      {/* Main playback controls */}
      <div style={defaultStyles.controlGroup}>
        <button
          style={defaultStyles.button}
          onClick={controls.stop}
          title="Stop"
        >
          <StopIcon />
        </button>

        <button
          style={defaultStyles.button}
          onClick={controls.prevFrame}
          title="Previous frame (,)"
        >
          <PrevFrameIcon />
        </button>

        <button
          style={{ ...defaultStyles.button, ...defaultStyles.playButton }}
          onClick={controls.toggle}
          title={state.isPlaying ? 'Pause (Space)' : 'Play (Space)'}
        >
          {state.isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>

        <button
          style={defaultStyles.button}
          onClick={controls.nextFrame}
          title="Next frame (.)"
        >
          <NextFrameIcon />
        </button>
      </div>

      {/* Loop toggle */}
      <button
        style={defaultStyles.button}
        onClick={() => controls.setLoop(!state.loop)}
        title={`Loop: ${state.loop ? 'On' : 'Off'} (R)`}
      >
        <LoopIcon active={state.loop} />
      </button>

      {/* Spacer */}
      <div style={defaultStyles.spacer} />

      {/* Speed control */}
      {showSpeedControl && (
        <div style={defaultStyles.controlGroup}>
          <span style={defaultStyles.label}>Speed:</span>
          <select
            style={defaultStyles.select}
            value={state.speed}
            onChange={(e) => controls.setSpeed(parseFloat(e.target.value))}
          >
            {SPEED_OPTIONS.map((speed) => (
              <option key={speed} value={speed}>
                {speed}x
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Volume control */}
      {showVolumeControl && (
        <div style={defaultStyles.controlGroup}>
          <button
            style={defaultStyles.button}
            onClick={controls.toggleMute}
            title={state.muted ? 'Unmute (M)' : 'Mute (M)'}
          >
            <VolumeIcon muted={state.muted} volume={state.volume} />
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={state.muted ? 0 : state.volume}
            onChange={(e) => controls.setVolume(parseFloat(e.target.value))}
            style={defaultStyles.volumeSlider}
          />
        </div>
      )}

      {/* Frame counter */}
      {showFrameCounter && (
        <div style={defaultStyles.frameCounter}>
          {state.currentFrame} / {state.totalFrames}
        </div>
      )}
    </div>
  );
}
