import { create } from 'zustand';
import type { Template } from '@rendervid/core';
import type { EditorState, EditorConfig } from '../types';

interface EditorStore extends EditorState {
  config: EditorConfig;

  // Template actions
  setTemplate: (template: Template) => void;
  updateTemplate: (updates: Partial<Template>) => void;

  // Selection actions
  selectLayer: (layerId: string | null) => void;
  selectScene: (sceneId: string | null) => void;

  // Playback actions
  setCurrentFrame: (frame: number) => void;
  setPlaying: (isPlaying: boolean) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;

  // View actions
  setZoom: (zoom: number) => void;

  // History actions
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Layer actions
  addLayer: (sceneId: string, layer: any) => void;
  updateLayer: (layerId: string, updates: any) => void;
  deleteLayer: (layerId: string) => void;
  duplicateLayer: (layerId: string) => void;
  reorderLayers: (sceneId: string, layerIds: string[]) => void;

  // Scene actions
  addScene: (scene: any) => void;
  updateScene: (sceneId: string, updates: any) => void;
  deleteScene: (sceneId: string) => void;

  // Utility
  getSelectedLayer: () => any | null;
  getSelectedScene: () => any | null;
  getTotalFrames: () => number;
}

const MAX_HISTORY_SIZE = 50;

export const useEditorStore = create<EditorStore>((set, get) => ({
  // Initial state
  template: {
    name: 'Untitled',
    output: {
      type: 'video',
      width: 1920,
      height: 1080,
      fps: 30,
    },
    inputs: [],
    composition: {
      scenes: [],
    },
  },
  selectedLayerId: null,
  selectedSceneId: null,
  currentFrame: 0,
  isPlaying: false,
  zoom: 1,
  history: {
    past: [],
    present: {
      name: 'Untitled',
      output: {
        type: 'video',
        width: 1920,
        height: 1080,
        fps: 30,
      },
      inputs: [],
      composition: {
        scenes: [],
      },
    },
    future: [],
  },
  config: {
    enableHistory: true,
    maxHistorySize: MAX_HISTORY_SIZE,
    theme: 'light',
  },

  // Template actions
  setTemplate: (template) => set((state) => {
    if (state.config.enableHistory) {
      return {
        template,
        history: {
          past: [...state.history.past, state.history.present].slice(-MAX_HISTORY_SIZE),
          present: template,
          future: [],
        },
      };
    }
    return { template };
  }),

  updateTemplate: (updates) => set((state) => {
    const newTemplate = { ...state.template, ...updates };
    if (state.config.enableHistory) {
      return {
        template: newTemplate,
        history: {
          past: [...state.history.past, state.history.present].slice(-MAX_HISTORY_SIZE),
          present: newTemplate,
          future: [],
        },
      };
    }
    return { template: newTemplate };
  }),

  // Selection actions
  selectLayer: (layerId) => set({ selectedLayerId: layerId }),
  selectScene: (sceneId) => set({ selectedSceneId: sceneId }),

  // Playback actions
  setCurrentFrame: (frame) => set({ currentFrame: frame }),
  setPlaying: (isPlaying) => set({ isPlaying }),
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  // View actions
  setZoom: (zoom) => set({ zoom }),

  // History actions
  undo: () => set((state) => {
    if (!state.config.enableHistory || state.history.past.length === 0) {
      return state;
    }
    const previous = state.history.past[state.history.past.length - 1];
    const newPast = state.history.past.slice(0, -1);
    return {
      template: previous,
      history: {
        past: newPast,
        present: previous,
        future: [state.history.present, ...state.history.future],
      },
    };
  }),

  redo: () => set((state) => {
    if (!state.config.enableHistory || state.history.future.length === 0) {
      return state;
    }
    const next = state.history.future[0];
    const newFuture = state.history.future.slice(1);
    return {
      template: next,
      history: {
        past: [...state.history.past, state.history.present],
        present: next,
        future: newFuture,
      },
    };
  }),

  canUndo: () => {
    const state = get();
    return !!(state.config.enableHistory && state.history.past.length > 0);
  },

  canRedo: () => {
    const state = get();
    return !!(state.config.enableHistory && state.history.future.length > 0);
  },

  // Layer actions
  addLayer: (sceneId, layer) => set((state) => {
    const newScenes = state.template.composition.scenes.map((scene: any) => {
      if (scene.id === sceneId) {
        return {
          ...scene,
          layers: [...(scene.layers || []), layer],
        };
      }
      return scene;
    });
    const newTemplate = {
      ...state.template,
      composition: {
        ...state.template.composition,
        scenes: newScenes,
      },
    };
    return {
      template: newTemplate,
      selectedLayerId: layer.id,
      history: state.config.enableHistory ? {
        past: [...state.history.past, state.history.present].slice(-MAX_HISTORY_SIZE),
        present: newTemplate,
        future: [],
      } : state.history,
    };
  }),

  updateLayer: (layerId, updates) => set((state) => {
    const newScenes = state.template.composition.scenes.map((scene: any) => ({
      ...scene,
      layers: scene.layers?.map((layer: any) =>
        layer.id === layerId ? { ...layer, ...updates } : layer
      ),
    }));
    const newTemplate = {
      ...state.template,
      composition: {
        ...state.template.composition,
        scenes: newScenes,
      },
    };
    return {
      template: newTemplate,
      history: state.config.enableHistory ? {
        past: [...state.history.past, state.history.present].slice(-MAX_HISTORY_SIZE),
        present: newTemplate,
        future: [],
      } : state.history,
    };
  }),

  deleteLayer: (layerId) => set((state) => {
    const newScenes = state.template.composition.scenes.map((scene: any) => ({
      ...scene,
      layers: scene.layers?.filter((layer: any) => layer.id !== layerId),
    }));
    const newTemplate = {
      ...state.template,
      composition: {
        ...state.template.composition,
        scenes: newScenes,
      },
    };
    return {
      template: newTemplate,
      selectedLayerId: state.selectedLayerId === layerId ? null : state.selectedLayerId,
      history: state.config.enableHistory ? {
        past: [...state.history.past, state.history.present].slice(-MAX_HISTORY_SIZE),
        present: newTemplate,
        future: [],
      } : state.history,
    };
  }),

  duplicateLayer: (layerId) => set((state) => {
    let duplicatedLayer: any = null;
    const newScenes = state.template.composition.scenes.map((scene: any) => {
      const layerIndex = scene.layers?.findIndex((l: any) => l.id === layerId);
      if (layerIndex !== -1) {
        const originalLayer = scene.layers[layerIndex];
        duplicatedLayer = {
          ...originalLayer,
          id: `${originalLayer.id}-copy-${Date.now()}`,
          position: {
            x: originalLayer.position.x + 10,
            y: originalLayer.position.y + 10,
          },
        };
        return {
          ...scene,
          layers: [
            ...scene.layers.slice(0, layerIndex + 1),
            duplicatedLayer,
            ...scene.layers.slice(layerIndex + 1),
          ],
        };
      }
      return scene;
    });
    const newTemplate = {
      ...state.template,
      composition: {
        ...state.template.composition,
        scenes: newScenes,
      },
    };
    return {
      template: newTemplate,
      selectedLayerId: duplicatedLayer?.id || state.selectedLayerId,
      history: state.config.enableHistory ? {
        past: [...state.history.past, state.history.present].slice(-MAX_HISTORY_SIZE),
        present: newTemplate,
        future: [],
      } : state.history,
    };
  }),

  reorderLayers: (sceneId, layerIds) => set((state) => {
    const newScenes = state.template.composition.scenes.map((scene: any) => {
      if (scene.id === sceneId) {
        const reorderedLayers = layerIds.map((id) =>
          scene.layers.find((l: any) => l.id === id)
        ).filter(Boolean);
        return { ...scene, layers: reorderedLayers };
      }
      return scene;
    });
    const newTemplate = {
      ...state.template,
      composition: {
        ...state.template.composition,
        scenes: newScenes,
      },
    };
    return {
      template: newTemplate,
      history: state.config.enableHistory ? {
        past: [...state.history.past, state.history.present].slice(-MAX_HISTORY_SIZE),
        present: newTemplate,
        future: [],
      } : state.history,
    };
  }),

  // Scene actions
  addScene: (scene) => set((state) => {
    const newTemplate = {
      ...state.template,
      composition: {
        ...state.template.composition,
        scenes: [...state.template.composition.scenes, scene],
      },
    };
    return {
      template: newTemplate,
      selectedSceneId: scene.id,
      history: state.config.enableHistory ? {
        past: [...state.history.past, state.history.present].slice(-MAX_HISTORY_SIZE),
        present: newTemplate,
        future: [],
      } : state.history,
    };
  }),

  updateScene: (sceneId, updates) => set((state) => {
    const newScenes = state.template.composition.scenes.map((scene: any) =>
      scene.id === sceneId ? { ...scene, ...updates } : scene
    );
    const newTemplate = {
      ...state.template,
      composition: {
        ...state.template.composition,
        scenes: newScenes,
      },
    };
    return {
      template: newTemplate,
      history: state.config.enableHistory ? {
        past: [...state.history.past, state.history.present].slice(-MAX_HISTORY_SIZE),
        present: newTemplate,
        future: [],
      } : state.history,
    };
  }),

  deleteScene: (sceneId) => set((state) => {
    const newTemplate = {
      ...state.template,
      composition: {
        ...state.template.composition,
        scenes: state.template.composition.scenes.filter((s: any) => s.id !== sceneId),
      },
    };
    return {
      template: newTemplate,
      selectedSceneId: state.selectedSceneId === sceneId ? null : state.selectedSceneId,
      history: state.config.enableHistory ? {
        past: [...state.history.past, state.history.present].slice(-MAX_HISTORY_SIZE),
        present: newTemplate,
        future: [],
      } : state.history,
    };
  }),

  // Utility
  getSelectedLayer: () => {
    const state = get();
    if (!state.selectedLayerId) return null;
    for (const scene of state.template.composition.scenes) {
      const layer = (scene as any).layers?.find((l: any) => l.id === state.selectedLayerId);
      if (layer) return layer;
    }
    return null;
  },

  getSelectedScene: () => {
    const state = get();
    if (!state.selectedSceneId) return null;
    return state.template.composition.scenes.find((s: any) => s.id === state.selectedSceneId) || null;
  },

  getTotalFrames: () => {
    const state = get();
    const scenes = state.template.composition.scenes as any[];
    if (scenes.length === 0) return 0;
    return Math.max(...scenes.map(s => s.endFrame || 0));
  },
}));
