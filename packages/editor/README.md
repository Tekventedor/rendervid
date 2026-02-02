# @rendervid/editor

Visual editor component for Rendervid templates.

## Installation

```bash
npm install @rendervid/editor @rendervid/core @rendervid/renderer-browser
```

## Usage

```typescript
import { VideoEditor } from '@rendervid/editor';
import '@rendervid/editor/styles.css';

function MyApp() {
  const template = {
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
          layers: [],
        },
      ],
    },
  };

  return (
    <VideoEditor
      template={template}
      callbacks={{
        onSave: async (template) => {
          console.log('Saving template:', template);
          // Save to backend
        },
        onExport: async (template) => {
          console.log('Exporting video:', template);
          // Trigger video export
        },
        onChange: (template) => {
          console.log('Template changed:', template);
        },
      }}
    />
  );
}
```

## Features

- **Timeline Editor**: Visual timeline with playback controls
- **Layer Management**: Add, remove, reorder, and duplicate layers
- **Property Panel**: Edit layer properties (position, size, text, colors, etc.)
- **Preview**: Real-time browser preview using `@rendervid/renderer-browser`
- **Undo/Redo**: Built-in history management
- **Keyboard Shortcuts**:
  - `Space`: Play/Pause
  - `Cmd/Ctrl+Z`: Undo
  - `Cmd/Ctrl+Shift+Z` or `Cmd/Ctrl+Y`: Redo
  - `Delete/Backspace`: Delete selected layer

## API

### VideoEditor Props

```typescript
interface VideoEditorProps {
  /** Initial template */
  template: Template;

  /** Editor configuration */
  config?: {
    enableHistory?: boolean;
    maxHistorySize?: number;
    autoSaveInterval?: number;
    theme?: 'light' | 'dark';
  };

  /** Callbacks */
  callbacks?: {
    onSave?: (template: Template) => void | Promise<void>;
    onExport?: (template: Template) => void | Promise<void>;
    onChange?: (template: Template) => void;
    onError?: (error: Error) => void;
  };

  /** Editor dimensions */
  width?: number | string;
  height?: number | string;

  /** Additional CSS class */
  className?: string;
}
```

### Individual Components

You can also use individual components separately:

```typescript
import {
  Preview,
  Timeline,
  LayerPanel,
  PropertyPanel,
  useEditorStore,
} from '@rendervid/editor';
```

## State Management

The editor uses [Zustand](https://zustand-demo.pmnd.rs/) for state management. You can access the editor store directly:

```typescript
import { useEditorStore } from '@rendervid/editor';

function MyComponent() {
  const {
    template,
    selectedLayerId,
    currentFrame,
    isPlaying,
    setCurrentFrame,
    togglePlay,
    addLayer,
    updateLayer,
    // ... more actions
  } = useEditorStore();

  // Use the store
}
```

## Examples

### Custom Export Handler

```typescript
<VideoEditor
  template={template}
  callbacks={{
    onExport: async (template) => {
      // Call backend API to render video
      const response = await fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template }),
      });

      const { jobId } = await response.json();

      // Poll for completion
      const video = await pollForVideo(jobId);

      // Download video
      window.location.href = video.url;
    },
  }}
/>
```

### Auto-save

```typescript
<VideoEditor
  template={template}
  config={{
    autoSaveInterval: 5000, // Auto-save every 5 seconds
  }}
  callbacks={{
    onChange: (template) => {
      // Debounce and save
      debouncedSave(template);
    },
  }}
/>
```

### Custom Theme

```typescript
<VideoEditor
  template={template}
  config={{
    theme: 'dark',
  }}
  className="my-custom-editor"
/>
```

## Browser Compatibility

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions

Requires ES2020 support and Canvas API.

## License

MIT
