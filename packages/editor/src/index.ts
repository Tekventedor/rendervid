// Main component
export { VideoEditor } from './components/VideoEditor';
export type { VideoEditorProps } from './components/VideoEditor';

// Individual components
export { Preview } from './components/Preview/Preview';
export type { PreviewProps } from './components/Preview/Preview';

export { Timeline } from './components/Timeline/Timeline';
export { LayerPanel } from './components/LayerPanel/LayerPanel';
export { PropertyPanel } from './components/PropertyPanel/PropertyPanel';

// Store
export { useEditorStore } from './context/EditorStore';

// Types
export type {
  EditorState,
  EditorAction,
  EditorConfig,
  EditorCallbacks,
  TimelineMarker,
  TimelineProps,
  LayerPanelProps,
  PropertyPanelProps,
} from './types';
