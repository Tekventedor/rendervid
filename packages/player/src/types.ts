import type { Template, Scene, Layer } from '@rendervid/core';

/**
 * Playback state for the player
 */
export interface PlaybackState {
  /** Whether the video is currently playing */
  isPlaying: boolean;
  /** Current frame number */
  currentFrame: number;
  /** Total number of frames */
  totalFrames: number;
  /** Current time in seconds */
  currentTime: number;
  /** Total duration in seconds */
  duration: number;
  /** Frames per second */
  fps: number;
  /** Whether the video is looping */
  loop: boolean;
  /** Current playback speed (1.0 = normal) */
  speed: number;
  /** Volume level (0-1) */
  volume: number;
  /** Whether audio is muted */
  muted: boolean;
}

/**
 * Controls for the player
 */
export interface PlaybackControls {
  /** Start playback */
  play: () => void;
  /** Pause playback */
  pause: () => void;
  /** Toggle play/pause */
  toggle: () => void;
  /** Stop and reset to beginning */
  stop: () => void;
  /** Seek to a specific frame */
  seekToFrame: (frame: number) => void;
  /** Seek to a specific time in seconds */
  seekToTime: (time: number) => void;
  /** Go to next frame (when paused) */
  nextFrame: () => void;
  /** Go to previous frame (when paused) */
  prevFrame: () => void;
  /** Set playback speed */
  setSpeed: (speed: number) => void;
  /** Set volume */
  setVolume: (volume: number) => void;
  /** Toggle mute */
  toggleMute: () => void;
  /** Set loop mode */
  setLoop: (loop: boolean) => void;
}

/**
 * Options for the usePlayback hook
 */
export interface UsePlaybackOptions {
  /** Frames per second (default: 30) */
  fps?: number;
  /** Total number of frames */
  totalFrames: number;
  /** Whether to loop playback (default: false) */
  loop?: boolean;
  /** Initial playback speed (default: 1.0) */
  initialSpeed?: number;
  /** Whether to autoplay (default: false) */
  autoplay?: boolean;
  /** Callback when playback completes */
  onComplete?: () => void;
  /** Callback when frame changes */
  onFrameChange?: (frame: number) => void;
}

/**
 * Player component props
 */
export interface PlayerProps {
  /** The template to preview */
  template: Template;
  /** Input values for the template */
  inputs?: Record<string, unknown>;
  /** Custom width (overrides template width) */
  width?: number;
  /** Custom height (overrides template height) */
  height?: number;
  /** Whether to show playback controls (default: true) */
  controls?: boolean;
  /** Whether to autoplay (default: false) */
  autoplay?: boolean;
  /** Whether to loop playback (default: false) */
  loop?: boolean;
  /** Initial playback speed (default: 1.0) */
  speed?: number;
  /** Custom CSS class name */
  className?: string;
  /** Custom inline styles */
  style?: React.CSSProperties;
  /** Callback when playback completes */
  onComplete?: () => void;
  /** Callback when frame changes */
  onFrameChange?: (frame: number) => void;
  /** Callback when play state changes */
  onPlayStateChange?: (isPlaying: boolean) => void;
  /** Render function for custom layer rendering */
  renderLayer?: (layer: Layer, frame: number) => React.ReactNode;
  /** Callback when export button is clicked (shows export button when provided) */
  onExport?: (template: Template) => void;
}

/**
 * Timeline component props
 */
export interface TimelineProps {
  /** Current frame */
  currentFrame: number;
  /** Total frames */
  totalFrames: number;
  /** Scenes in the composition */
  scenes: Scene[];
  /** Frames per second */
  fps: number;
  /** Callback when seeking */
  onSeek: (frame: number) => void;
  /** Whether the player is playing */
  isPlaying: boolean;
  /** Custom CSS class name */
  className?: string;
  /** Whether to show scene markers (default: true) */
  showSceneMarkers?: boolean;
  /** Whether to show time labels (default: true) */
  showTimeLabels?: boolean;
}

/**
 * Controls component props
 */
export interface ControlsProps {
  /** Playback state */
  state: PlaybackState;
  /** Playback controls */
  controls: PlaybackControls;
  /** Custom CSS class name */
  className?: string;
  /** Whether to show speed control (default: true) */
  showSpeedControl?: boolean;
  /** Whether to show volume control (default: true) */
  showVolumeControl?: boolean;
  /** Whether to show frame counter (default: true) */
  showFrameCounter?: boolean;
  /** Export callback (shows export button when provided) */
  onExport?: () => void;
}

/**
 * Scene information for display
 */
export interface SceneInfo {
  id: string;
  name?: string;
  startFrame: number;
  endFrame: number;
  duration: number;
  isActive: boolean;
}

/**
 * Scrubber/progress bar props
 */
export interface ScrubberProps {
  /** Current value (0-1) */
  value: number;
  /** Callback when value changes */
  onChange: (value: number) => void;
  /** Whether scrubbing is in progress */
  isScrubbing?: boolean;
  /** Callback when scrubbing starts */
  onScrubStart?: () => void;
  /** Callback when scrubbing ends */
  onScrubEnd?: () => void;
  /** Custom CSS class name */
  className?: string;
}
