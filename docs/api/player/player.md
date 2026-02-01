# Player Component

React component for real-time template preview.

## Import

```typescript
import {
  Player,
  Timeline,
  Controls,
  usePlayback,
  type PlayerProps,
  type PlaybackState,
} from '@rendervid/player';
```

## Player Component

The main preview component.

```tsx
<Player
  template={template}
  inputs={inputs}
  autoPlay={true}
  loop={true}
  showControls={true}
  onFrameChange={(frame) => console.log('Frame:', frame)}
/>
```

### Props

```typescript
interface PlayerProps {
  // Required
  template: Template;
  inputs: Record<string, unknown>;

  // Playback
  autoPlay?: boolean;              // Auto-start playback (default: false)
  loop?: boolean;                  // Loop playback (default: true)
  initialFrame?: number;           // Starting frame (default: 0)
  playbackRate?: number;           // Speed multiplier (default: 1)

  // UI
  showControls?: boolean;          // Show control bar (default: true)
  showTimeline?: boolean;          // Show timeline (default: false)
  showFps?: boolean;               // Show FPS counter (default: false)

  // Styling
  className?: string;
  style?: React.CSSProperties;
  width?: number | string;
  height?: number | string;
  aspectRatio?: string;            // e.g., '16/9'

  // Component registry
  componentRegistry?: ComponentRegistry;

  // Events
  onFrameChange?: (frame: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: (error: Error) => void;
}
```

### Basic Example

```tsx
import { Player } from '@rendervid/player';

function Preview() {
  const template = {
    name: 'Demo',
    output: { type: 'video', width: 1920, height: 1080, fps: 30, duration: 5 },
    inputs: [{ key: 'title', type: 'string', label: 'Title', required: true }],
    composition: {
      scenes: [{
        id: 'main',
        startFrame: 0,
        endFrame: 150,
        backgroundColor: '#1a1a2e',
        layers: [{
          id: 'title',
          type: 'text',
          position: { x: 160, y: 440 },
          size: { width: 1600, height: 200 },
          inputKey: 'title',
          props: { fontSize: 96, fontWeight: 'bold', color: '#ffffff', textAlign: 'center' },
          animations: [{ type: 'entrance', effect: 'fadeInUp', duration: 30 }]
        }]
      }]
    }
  };

  return (
    <Player
      template={template}
      inputs={{ title: 'Hello World!' }}
      autoPlay={true}
      loop={true}
      showControls={true}
    />
  );
}
```

## usePlayback Hook

Hook for programmatic playback control.

```typescript
const {
  state,
  play,
  pause,
  stop,
  seek,
  setPlaybackRate,
} = usePlayback(options?: UsePlaybackOptions);
```

### PlaybackState

```typescript
interface PlaybackState {
  playing: boolean;
  currentFrame: number;
  totalFrames: number;
  currentTime: number;      // seconds
  duration: number;         // seconds
  fps: number;
  playbackRate: number;
  loop: boolean;
}
```

### PlaybackControls

```typescript
interface PlaybackControls {
  play: () => void;
  pause: () => void;
  stop: () => void;
  seek: (frame: number) => void;
  seekToTime: (seconds: number) => void;
  setPlaybackRate: (rate: number) => void;
  setLoop: (loop: boolean) => void;
  nextFrame: () => void;
  prevFrame: () => void;
}
```

### Example

```tsx
import { Player, usePlayback } from '@rendervid/player';

function CustomPlayer({ template, inputs }) {
  const { state, play, pause, seek, setPlaybackRate } = usePlayback({
    template,
    inputs,
  });

  return (
    <div>
      <Player
        template={template}
        inputs={inputs}
        showControls={false}
      />

      <div className="custom-controls">
        <button onClick={state.playing ? pause : play}>
          {state.playing ? 'Pause' : 'Play'}
        </button>

        <input
          type="range"
          min={0}
          max={state.totalFrames}
          value={state.currentFrame}
          onChange={(e) => seek(Number(e.target.value))}
        />

        <span>
          {state.currentTime.toFixed(1)}s / {state.duration.toFixed(1)}s
        </span>

        <select
          value={state.playbackRate}
          onChange={(e) => setPlaybackRate(Number(e.target.value))}
        >
          <option value={0.5}>0.5x</option>
          <option value={1}>1x</option>
          <option value={2}>2x</option>
        </select>
      </div>
    </div>
  );
}
```

## Timeline Component

Visual timeline with scene markers.

```tsx
<Timeline
  template={template}
  currentFrame={currentFrame}
  onSeek={(frame) => seek(frame)}
  showSceneMarkers={true}
  showLayerTracks={false}
/>
```

### TimelineProps

```typescript
interface TimelineProps {
  template: Template;
  currentFrame: number;
  onSeek: (frame: number) => void;
  showSceneMarkers?: boolean;
  showLayerTracks?: boolean;
  height?: number;
  className?: string;
}
```

## Controls Component

Playback control bar.

```tsx
<Controls
  state={playbackState}
  onPlay={play}
  onPause={pause}
  onSeek={seek}
  onRateChange={setPlaybackRate}
  showTimecode={true}
  showFps={true}
/>
```

### ControlsProps

```typescript
interface ControlsProps {
  state: PlaybackState;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (frame: number) => void;
  onRateChange?: (rate: number) => void;
  showTimecode?: boolean;
  showFps?: boolean;
  showVolumeControl?: boolean;
  className?: string;
}
```

## Scrubber Component

Frame scrubber/slider.

```tsx
<Scrubber
  currentFrame={currentFrame}
  totalFrames={totalFrames}
  onSeek={seek}
  showThumbnails={true}
/>
```

### ScrubberProps

```typescript
interface ScrubberProps {
  currentFrame: number;
  totalFrames: number;
  onSeek: (frame: number) => void;
  onScrubStart?: () => void;
  onScrubEnd?: () => void;
  showThumbnails?: boolean;
  className?: string;
}
```

## useKeyboardControls Hook

Add keyboard shortcuts for playback.

```tsx
import { useKeyboardControls } from '@rendervid/player';

function PlayerWithKeyboard({ template, inputs }) {
  const { state, play, pause, seek } = usePlayback({ template, inputs });

  useKeyboardControls({
    onPlay: play,
    onPause: pause,
    onSeek: seek,
    state,
    enabled: true,
  });

  return <Player template={template} inputs={inputs} />;
}
```

### Default Shortcuts

| Key | Action |
|-----|--------|
| Space | Play/Pause |
| Left Arrow | Previous frame |
| Right Arrow | Next frame |
| Home | Go to start |
| End | Go to end |
| 1-9 | Seek to 10%-90% |
| < | Slower playback |
| > | Faster playback |

### UseKeyboardControlsOptions

```typescript
interface UseKeyboardControlsOptions {
  onPlay: () => void;
  onPause: () => void;
  onSeek: (frame: number) => void;
  state: PlaybackState;
  enabled?: boolean;
  customKeys?: Record<string, () => void>;
}
```

## LayerRenderer Component

Low-level layer rendering component.

```tsx
import { LayerRenderer } from '@rendervid/player';

<LayerRenderer
  layer={layer}
  frame={currentFrame}
  canvasSize={{ width: 1920, height: 1080 }}
  inputs={inputs}
  componentRegistry={registry}
/>
```

### LayerRendererProps

```typescript
interface LayerRendererProps {
  layer: Layer;
  frame: number;
  canvasSize: { width: number; height: number };
  inputs: Record<string, unknown>;
  componentRegistry?: ComponentRegistry;
}
```

## Complete Example

```tsx
import { useState } from 'react';
import {
  Player,
  Timeline,
  Controls,
  usePlayback,
  useKeyboardControls,
} from '@rendervid/player';

function VideoEditor({ template }) {
  const [inputs, setInputs] = useState({ title: 'Hello World' });

  const playback = usePlayback({
    template,
    inputs,
    autoPlay: false,
    loop: true,
  });

  useKeyboardControls({
    ...playback,
    enabled: true,
  });

  return (
    <div className="editor">
      {/* Preview */}
      <div className="preview">
        <Player
          template={template}
          inputs={inputs}
          showControls={false}
          style={{ width: '100%' }}
        />
      </div>

      {/* Timeline */}
      <Timeline
        template={template}
        currentFrame={playback.state.currentFrame}
        onSeek={playback.seek}
        showSceneMarkers={true}
      />

      {/* Controls */}
      <Controls
        state={playback.state}
        onPlay={playback.play}
        onPause={playback.pause}
        onSeek={playback.seek}
        onRateChange={playback.setPlaybackRate}
        showTimecode={true}
        showFps={true}
      />

      {/* Input form */}
      <div className="inputs">
        <input
          type="text"
          value={inputs.title}
          onChange={(e) => setInputs({ ...inputs, title: e.target.value })}
        />
      </div>
    </div>
  );
}
```

## Styling

The player components use CSS classes that can be overridden:

```css
/* Player container */
.rendervid-player {
  /* styles */
}

/* Controls bar */
.rendervid-controls {
  /* styles */
}

/* Timeline */
.rendervid-timeline {
  /* styles */
}

/* Scrubber */
.rendervid-scrubber {
  /* styles */
}
```

Or use the `className` prop to add custom classes.

## Related Documentation

- [RendervidEngine](/api/core/engine) - Core engine
- [BrowserRenderer](/api/renderer-browser/renderer) - Full rendering
- [Template Schema](/templates/schema) - Template reference
