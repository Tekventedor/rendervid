# @rendervid/player

React player component for previewing Rendervid templates with playback controls.

## Installation

```bash
npm install @rendervid/player @rendervid/core
```

## Quick Start

```tsx
import { Player } from '@rendervid/player';
import type { Template } from '@rendervid/core';

function App() {
  const template: Template = {
    name: 'My Video',
    output: {
      type: 'video',
      width: 1920,
      height: 1080,
      fps: 30,
    },
    inputs: [],
    composition: {
      scenes: [
        {
          id: 'scene-1',
          startFrame: 0,
          endFrame: 150,
          backgroundColor: '#000000',
          layers: [
            {
              id: 'text-1',
              type: 'text',
              name: 'Title',
              x: 960,
              y: 540,
              width: 800,
              height: 100,
              content: 'Hello World',
              fontSize: 72,
              fontFamily: 'Arial',
              color: '#ffffff',
              textAlign: 'center',
            },
          ],
        },
      ],
    },
  };

  return (
    <Player
      template={template}
      controls={true}
      autoplay={false}
      loop={false}
    />
  );
}
```

## Props

### Required

| Prop | Type | Description |
|------|------|-------------|
| `template` | `Template` | The Rendervid template to preview |

### Optional

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `inputs` | `Record<string, unknown>` | `{}` | Input values for template parameters |
| `width` | `number` | Template width | Custom player width (maintains aspect ratio) |
| `height` | `number` | Template height | Custom player height |
| `controls` | `boolean` | `true` | Show playback controls |
| `autoplay` | `boolean` | `false` | Start playing automatically |
| `loop` | `boolean` | `false` | Loop playback when complete |
| `speed` | `number` | `1.0` | Initial playback speed |
| `className` | `string` | - | Custom CSS class |
| `style` | `CSSProperties` | - | Custom inline styles |

### Callbacks

| Callback | Type | Description |
|----------|------|-------------|
| `onComplete` | `() => void` | Called when playback completes |
| `onFrameChange` | `(frame: number) => void` | Called on every frame change |
| `onPlayStateChange` | `(isPlaying: boolean) => void` | Called when play state changes |

### Advanced

| Prop | Type | Description |
|------|------|-------------|
| `renderLayer` | `(layer: Layer, frame: number) => ReactNode` | Custom layer renderer |

## Components

The package exports individual components for custom UIs:

```tsx
import { Player, Timeline, Controls, usePlayback } from '@rendervid/player';
```

### Timeline

Display and interact with the timeline separately:

```tsx
<Timeline
  currentFrame={currentFrame}
  totalFrames={totalFrames}
  scenes={scenes}
  fps={30}
  onSeek={(frame) => setCurrentFrame(frame)}
  isPlaying={isPlaying}
/>
```

### Controls

Display playback controls separately:

```tsx
<Controls
  state={playbackState}
  controls={playbackControls}
/>
```

### usePlayback Hook

Build custom player UIs:

```tsx
const { state, controls } = usePlayback({
  fps: 30,
  totalFrames: 150,
  loop: false,
  autoplay: false,
});

// state.isPlaying, state.currentFrame, etc.
// controls.play(), controls.pause(), controls.seekToFrame(), etc.
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play/Pause |
| `←` | Previous frame |
| `→` | Next frame |
| `↑` | Increase speed |
| `↓` | Decrease speed |
| `Home` | Go to start |
| `End` | Go to end |
| `M` | Mute/Unmute |
| `L` | Toggle loop |

## Playback Controls API

The `usePlayback` hook returns controls:

```typescript
interface PlaybackControls {
  play: () => void;              // Start playback
  pause: () => void;             // Pause playback
  toggle: () => void;            // Toggle play/pause
  stop: () => void;              // Stop and reset
  seekToFrame: (frame: number) => void;  // Jump to frame
  seekToTime: (time: number) => void;    // Jump to time (seconds)
  nextFrame: () => void;         // Next frame (when paused)
  prevFrame: () => void;         // Previous frame (when paused)
  setSpeed: (speed: number) => void;     // Set playback speed
  setVolume: (volume: number) => void;   // Set volume (0-1)
  toggleMute: () => void;        // Toggle mute
  setLoop: (loop: boolean) => void;      // Set loop mode
}
```

## Playback State

```typescript
interface PlaybackState {
  isPlaying: boolean;    // Currently playing
  currentFrame: number;  // Current frame number
  totalFrames: number;   // Total frames in composition
  currentTime: number;   // Current time (seconds)
  duration: number;      // Total duration (seconds)
  fps: number;           // Frames per second
  loop: boolean;         // Loop enabled
  speed: number;         // Playback speed (1.0 = normal)
  volume: number;        // Volume level (0-1)
  muted: boolean;        // Audio muted
}
```

## Custom Layer Rendering

For advanced use cases, provide a custom layer renderer:

```tsx
<Player
  template={template}
  renderLayer={(layer, frame) => {
    if (layer.type === 'custom') {
      return <MyCustomLayerComponent layer={layer} frame={frame} />;
    }
    // Return null to use default rendering
    return null;
  }}
/>
```

## Styling

The player uses inline styles by default. Customize with:

```tsx
<Player
  template={template}
  className="my-player"
  style={{
    width: '800px',
    height: '450px',
    borderRadius: '12px',
  }}
/>
```

Or target the default classes:

```css
.my-player {
  border: 2px solid #333;
}
```

## Examples

### Simple Player

```tsx
<Player template={template} />
```

### Custom Size

```tsx
<Player
  template={template}
  width={800}
  height={450}
/>
```

### Autoplay with Loop

```tsx
<Player
  template={template}
  autoplay={true}
  loop={true}
/>
```

### Without Controls

```tsx
<Player
  template={template}
  controls={false}
  autoplay={true}
/>
```

### With Callbacks

```tsx
<Player
  template={template}
  onFrameChange={(frame) => {
    console.log('Current frame:', frame);
  }}
  onComplete={() => {
    console.log('Playback complete!');
  }}
  onPlayStateChange={(isPlaying) => {
    console.log(isPlaying ? 'Playing' : 'Paused');
  }}
/>
```

### Custom Player UI

```tsx
import { usePlayback } from '@rendervid/player';

function CustomPlayer({ template }) {
  const { state, controls } = usePlayback({
    fps: template.output.fps,
    totalFrames: 150,
  });

  return (
    <div>
      <div>Frame: {state.currentFrame}</div>
      <button onClick={controls.play}>Play</button>
      <button onClick={controls.pause}>Pause</button>
      <button onClick={controls.stop}>Stop</button>

      {/* Render your template at state.currentFrame */}
    </div>
  );
}
```

## Browser Compatibility

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions

Requires ES2020 support.

## License

MIT

## Related Packages

- `@rendervid/core` - Core types and utilities
- `@rendervid/renderer-browser` - Browser-based rendering
- `@rendervid/editor` - Visual template editor
