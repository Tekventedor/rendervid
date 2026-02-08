import { describe, it, expect, beforeEach } from 'vitest';
import { useEditorStore } from '../context/EditorStore';
import type { Template } from '@rendervid/core';

function createTestTemplate(name = 'Test'): Template {
  return {
    name,
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
          layers: [
            {
              id: 'layer-1',
              type: 'text',
              position: { x: 0, y: 0 },
              size: { width: 200, height: 100 },
              props: { text: 'Hello' },
            },
          ],
        },
        {
          id: 'scene-2',
          startFrame: 150,
          endFrame: 300,
          layers: [],
        },
      ],
    },
  };
}

describe('EditorStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    const store = useEditorStore.getState();
    useEditorStore.setState({
      template: {
        name: 'Untitled',
        output: { type: 'video', width: 1920, height: 1080, fps: 30 },
        inputs: [],
        composition: { scenes: [] },
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
          output: { type: 'video', width: 1920, height: 1080, fps: 30 },
          inputs: [],
          composition: { scenes: [] },
        },
        future: [],
      },
    });
  });

  it('should be exported', () => {
    expect(typeof useEditorStore).toBe('function');
  });

  it('should have default state', () => {
    const state = useEditorStore.getState();
    expect(state.template.name).toBe('Untitled');
    expect(state.selectedLayerId).toBeNull();
    expect(state.selectedSceneId).toBeNull();
    expect(state.currentFrame).toBe(0);
    expect(state.isPlaying).toBe(false);
    expect(state.zoom).toBe(1);
  });

  describe('setTemplate', () => {
    it('should set a new template', () => {
      const template = createTestTemplate('My Video');
      useEditorStore.getState().setTemplate(template);
      expect(useEditorStore.getState().template.name).toBe('My Video');
    });

    it('should add to history', () => {
      const template = createTestTemplate();
      useEditorStore.getState().setTemplate(template);
      const state = useEditorStore.getState();
      expect(state.history.past.length).toBe(1);
      expect(state.history.future.length).toBe(0);
    });
  });

  describe('Selection', () => {
    it('should select a layer', () => {
      useEditorStore.getState().selectLayer('layer-1');
      expect(useEditorStore.getState().selectedLayerId).toBe('layer-1');
    });

    it('should deselect layer with null', () => {
      useEditorStore.getState().selectLayer('layer-1');
      useEditorStore.getState().selectLayer(null);
      expect(useEditorStore.getState().selectedLayerId).toBeNull();
    });

    it('should select a scene', () => {
      useEditorStore.getState().selectScene('scene-1');
      expect(useEditorStore.getState().selectedSceneId).toBe('scene-1');
    });
  });

  describe('Playback', () => {
    it('should set current frame', () => {
      useEditorStore.getState().setCurrentFrame(50);
      expect(useEditorStore.getState().currentFrame).toBe(50);
    });

    it('should set playing state', () => {
      useEditorStore.getState().setPlaying(true);
      expect(useEditorStore.getState().isPlaying).toBe(true);
    });

    it('should play', () => {
      useEditorStore.getState().play();
      expect(useEditorStore.getState().isPlaying).toBe(true);
    });

    it('should pause', () => {
      useEditorStore.getState().play();
      useEditorStore.getState().pause();
      expect(useEditorStore.getState().isPlaying).toBe(false);
    });

    it('should toggle play', () => {
      useEditorStore.getState().togglePlay();
      expect(useEditorStore.getState().isPlaying).toBe(true);
      useEditorStore.getState().togglePlay();
      expect(useEditorStore.getState().isPlaying).toBe(false);
    });
  });

  describe('Zoom', () => {
    it('should set zoom', () => {
      useEditorStore.getState().setZoom(2);
      expect(useEditorStore.getState().zoom).toBe(2);
    });
  });

  describe('Undo/Redo', () => {
    it('should undo template change', () => {
      const original = useEditorStore.getState().template;
      const template = createTestTemplate('Changed');
      useEditorStore.getState().setTemplate(template);
      expect(useEditorStore.getState().template.name).toBe('Changed');

      useEditorStore.getState().undo();
      expect(useEditorStore.getState().template.name).toBe('Untitled');
    });

    it('should redo after undo', () => {
      const template = createTestTemplate('Changed');
      useEditorStore.getState().setTemplate(template);
      useEditorStore.getState().undo();
      useEditorStore.getState().redo();
      expect(useEditorStore.getState().template.name).toBe('Changed');
    });

    it('should report canUndo correctly', () => {
      expect(useEditorStore.getState().canUndo()).toBe(false);
      useEditorStore.getState().setTemplate(createTestTemplate());
      expect(useEditorStore.getState().canUndo()).toBe(true);
    });

    it('should report canRedo correctly', () => {
      expect(useEditorStore.getState().canRedo()).toBe(false);
      useEditorStore.getState().setTemplate(createTestTemplate());
      useEditorStore.getState().undo();
      expect(useEditorStore.getState().canRedo()).toBe(true);
    });

    it('should clear future on new template change', () => {
      useEditorStore.getState().setTemplate(createTestTemplate('V1'));
      useEditorStore.getState().setTemplate(createTestTemplate('V2'));
      useEditorStore.getState().undo();
      expect(useEditorStore.getState().canRedo()).toBe(true);

      useEditorStore.getState().setTemplate(createTestTemplate('V3'));
      expect(useEditorStore.getState().canRedo()).toBe(false);
    });
  });

  describe('Layer actions', () => {
    beforeEach(() => {
      useEditorStore.getState().setTemplate(createTestTemplate());
    });

    it('should add a layer', () => {
      const newLayer = {
        id: 'layer-new',
        type: 'shape',
        position: { x: 10, y: 10 },
        size: { width: 100, height: 100 },
        props: { shape: 'rectangle' },
      };
      useEditorStore.getState().addLayer('scene-1', newLayer);
      const scene = useEditorStore.getState().template.composition.scenes[0] as any;
      expect(scene.layers.length).toBe(2);
      expect(scene.layers[1].id).toBe('layer-new');
    });

    it('should select added layer', () => {
      const newLayer = {
        id: 'layer-new',
        type: 'shape',
        position: { x: 10, y: 10 },
        size: { width: 100, height: 100 },
        props: {},
      };
      useEditorStore.getState().addLayer('scene-1', newLayer);
      expect(useEditorStore.getState().selectedLayerId).toBe('layer-new');
    });

    it('should update a layer', () => {
      useEditorStore.getState().updateLayer('layer-1', { opacity: 0.5 });
      const scene = useEditorStore.getState().template.composition.scenes[0] as any;
      expect(scene.layers[0].opacity).toBe(0.5);
    });

    it('should delete a layer', () => {
      useEditorStore.getState().deleteLayer('layer-1');
      const scene = useEditorStore.getState().template.composition.scenes[0] as any;
      expect(scene.layers.length).toBe(0);
    });

    it('should deselect deleted layer if it was selected', () => {
      useEditorStore.getState().selectLayer('layer-1');
      useEditorStore.getState().deleteLayer('layer-1');
      expect(useEditorStore.getState().selectedLayerId).toBeNull();
    });

    it('should duplicate a layer', () => {
      useEditorStore.getState().duplicateLayer('layer-1');
      const scene = useEditorStore.getState().template.composition.scenes[0] as any;
      expect(scene.layers.length).toBe(2);
      expect(scene.layers[1].props.text).toBe('Hello');
      // Duplicated layer should be offset
      expect(scene.layers[1].position.x).toBe(10);
      expect(scene.layers[1].position.y).toBe(10);
    });

    it('should reorder layers', () => {
      const newLayer = {
        id: 'layer-2',
        type: 'shape',
        position: { x: 0, y: 0 },
        size: { width: 100, height: 100 },
        props: {},
      };
      useEditorStore.getState().addLayer('scene-1', newLayer);
      useEditorStore.getState().reorderLayers('scene-1', ['layer-2', 'layer-1']);
      const scene = useEditorStore.getState().template.composition.scenes[0] as any;
      expect(scene.layers[0].id).toBe('layer-2');
      expect(scene.layers[1].id).toBe('layer-1');
    });
  });

  describe('Scene actions', () => {
    beforeEach(() => {
      useEditorStore.getState().setTemplate(createTestTemplate());
    });

    it('should add a scene', () => {
      const newScene = {
        id: 'scene-3',
        startFrame: 300,
        endFrame: 450,
        layers: [],
      };
      useEditorStore.getState().addScene(newScene);
      expect(useEditorStore.getState().template.composition.scenes.length).toBe(3);
    });

    it('should select newly added scene', () => {
      const newScene = {
        id: 'scene-3',
        startFrame: 300,
        endFrame: 450,
        layers: [],
      };
      useEditorStore.getState().addScene(newScene);
      expect(useEditorStore.getState().selectedSceneId).toBe('scene-3');
    });

    it('should update a scene', () => {
      useEditorStore.getState().updateScene('scene-1', { endFrame: 200 });
      const scene = useEditorStore.getState().template.composition.scenes[0] as any;
      expect(scene.endFrame).toBe(200);
    });

    it('should delete a scene', () => {
      useEditorStore.getState().deleteScene('scene-2');
      expect(useEditorStore.getState().template.composition.scenes.length).toBe(1);
    });

    it('should deselect deleted scene if it was selected', () => {
      useEditorStore.getState().selectScene('scene-2');
      useEditorStore.getState().deleteScene('scene-2');
      expect(useEditorStore.getState().selectedSceneId).toBeNull();
    });
  });

  describe('Utility functions', () => {
    beforeEach(() => {
      useEditorStore.getState().setTemplate(createTestTemplate());
    });

    it('should get selected layer', () => {
      useEditorStore.getState().selectLayer('layer-1');
      const layer = useEditorStore.getState().getSelectedLayer();
      expect(layer).toBeTruthy();
      expect(layer.id).toBe('layer-1');
    });

    it('should return null when no layer selected', () => {
      const layer = useEditorStore.getState().getSelectedLayer();
      expect(layer).toBeNull();
    });

    it('should get selected scene', () => {
      useEditorStore.getState().selectScene('scene-1');
      const scene = useEditorStore.getState().getSelectedScene();
      expect(scene).toBeTruthy();
      expect((scene as any).id).toBe('scene-1');
    });

    it('should return null when no scene selected', () => {
      const scene = useEditorStore.getState().getSelectedScene();
      expect(scene).toBeNull();
    });

    it('should get total frames', () => {
      const totalFrames = useEditorStore.getState().getTotalFrames();
      expect(totalFrames).toBe(300);
    });

    it('should return 0 total frames for empty composition', () => {
      useEditorStore.getState().setTemplate({
        name: 'Empty',
        output: { type: 'video', width: 1920, height: 1080, fps: 30 },
        inputs: [],
        composition: { scenes: [] },
      });
      expect(useEditorStore.getState().getTotalFrames()).toBe(0);
    });
  });
});
