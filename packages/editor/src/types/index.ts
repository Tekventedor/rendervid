import type { Template } from '@rendervid/core';

/**
 * Editor state management types
 */
export interface EditorState {
  template: Template;
  selectedLayerId: string | null;
  selectedSceneId: string | null;
  currentFrame: number;
  isPlaying: boolean;
  zoom: number;
  history: HistoryState;
}

export interface HistoryState {
  past: Template[];
  present: Template;
  future: Template[];
}

/**
 * Editor actions
 */
export type EditorAction =
  | { type: 'SET_TEMPLATE'; payload: Template }
  | { type: 'UPDATE_TEMPLATE'; payload: Partial<Template> }
  | { type: 'SELECT_LAYER'; payload: string | null }
  | { type: 'SELECT_SCENE'; payload: string | null }
  | { type: 'SET_CURRENT_FRAME'; payload: number }
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_ZOOM'; payload: number }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'ADD_LAYER'; payload: { sceneId: string; layer: any } }
  | { type: 'UPDATE_LAYER'; payload: { layerId: string; updates: any } }
  | { type: 'DELETE_LAYER'; payload: string }
  | { type: 'REORDER_LAYERS'; payload: { sceneId: string; layerIds: string[] } }
  | { type: 'ADD_SCENE'; payload: any }
  | { type: 'UPDATE_SCENE'; payload: { sceneId: string; updates: any } }
  | { type: 'DELETE_SCENE'; payload: string };

/**
 * Timeline types
 */
export interface TimelineMarker {
  frame: number;
  label?: string;
  color?: string;
}

export interface TimelineProps {
  totalFrames: number;
  fps: number;
  currentFrame: number;
  onFrameChange: (frame: number) => void;
  markers?: TimelineMarker[];
  zoom?: number;
  onZoomChange?: (zoom: number) => void;
}

/**
 * Layer panel types
 */
export interface LayerPanelProps {
  sceneId: string;
  layers: any[];
  selectedLayerId: string | null;
  onSelectLayer: (layerId: string | null) => void;
  onAddLayer: (type: string) => void;
  onDeleteLayer: (layerId: string) => void;
  onReorderLayers: (layerIds: string[]) => void;
  onDuplicateLayer: (layerId: string) => void;
}

/**
 * Property panel types
 */
export interface PropertyPanelProps {
  selectedLayer: any | null;
  onUpdateLayer: (updates: any) => void;
}

/**
 * Preview types
 */
export interface PreviewProps {
  template: Template;
  currentFrame: number;
  isPlaying: boolean;
  onFrameChange: (frame: number) => void;
  onPlayingChange: (isPlaying: boolean) => void;
  width?: number;
  height?: number;
}

/**
 * Editor configuration
 */
export interface EditorConfig {
  /** Enable undo/redo */
  enableHistory?: boolean;
  /** Maximum history states */
  maxHistorySize?: number;
  /** Auto-save interval in ms */
  autoSaveInterval?: number;
  /** Custom layer types */
  customLayerTypes?: Record<string, any>;
  /** Theme */
  theme?: 'light' | 'dark';
}

/**
 * Editor callbacks
 */
export interface EditorCallbacks {
  onSave?: (template: Template) => void | Promise<void>;
  onExport?: (template: Template) => void | Promise<void>;
  onChange?: (template: Template) => void;
  onError?: (error: Error) => void;
}
