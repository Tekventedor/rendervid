import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import {
  SceneRenderer,
  TemplateRenderer,
  calculateTotalDuration,
  calculateTotalFrames,
  getSceneAtFrame,
} from '../SceneRenderer';
import type { Scene } from '@rendervid/core';

// Mock media element play methods
beforeEach(() => {
  HTMLVideoElement.prototype.play = vi.fn().mockResolvedValue(undefined);
  HTMLVideoElement.prototype.pause = vi.fn();
  HTMLAudioElement.prototype.play = vi.fn().mockResolvedValue(undefined);
  HTMLAudioElement.prototype.pause = vi.fn();
});

describe('SceneRenderer Component', () => {
  const mockScene: Scene = {
    id: 'scene-1',
    startFrame: 0,
    endFrame: 90,
    layers: [
      {
        id: 'text-1',
        type: 'text',
        position: { x: 50, y: 50 },
        size: { width: 300, height: 100 },
        props: { text: 'Scene Text' },
      },
    ],
  };

  it('should render a scene container', () => {
    const { container } = render(
      <SceneRenderer
        scene={mockScene}
        frame={0}
        fps={30}
        width={1920}
        height={1080}
      />
    );
    const el = container.firstChild as HTMLElement;
    expect(el).toBeTruthy();
    expect(el.style.position).toBe('relative');
    expect(el.style.width).toBe('1920px');
    expect(el.style.height).toBe('1080px');
    expect(el.style.overflow).toBe('hidden');
  });

  it('should render layers within the scene', () => {
    const { container } = render(
      <SceneRenderer
        scene={mockScene}
        frame={0}
        fps={30}
        width={1920}
        height={1080}
      />
    );
    expect(container.textContent).toContain('Scene Text');
  });

  it('should apply backgroundColor', () => {
    const scene: Scene = {
      ...mockScene,
      backgroundColor: '#ff0000',
    };

    const { container } = render(
      <SceneRenderer
        scene={scene}
        frame={0}
        fps={30}
        width={1920}
        height={1080}
      />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.backgroundColor).toBe('rgb(255, 0, 0)');
  });

  it('should apply backgroundImage', () => {
    const scene: Scene = {
      ...mockScene,
      backgroundImage: 'https://example.com/bg.jpg',
    };

    const { container } = render(
      <SceneRenderer
        scene={scene}
        frame={0}
        fps={30}
        width={1920}
        height={1080}
      />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.backgroundImage).toContain('https://example.com/bg.jpg');
  });

  it('should render with empty layers', () => {
    const scene: Scene = {
      ...mockScene,
      layers: [],
    };

    const { container } = render(
      <SceneRenderer
        scene={scene}
        frame={0}
        fps={30}
        width={1920}
        height={1080}
      />
    );
    expect(container.firstChild).toBeTruthy();
  });
});

describe('TemplateRenderer Component', () => {
  const scenes: Scene[] = [
    {
      id: 'scene-1',
      startFrame: 0,
      endFrame: 90,
      layers: [
        {
          id: 'text-1',
          type: 'text',
          position: { x: 0, y: 0 },
          size: { width: 200, height: 50 },
          props: { text: 'Scene 1' },
        },
      ],
    },
    {
      id: 'scene-2',
      startFrame: 90,
      endFrame: 180,
      layers: [
        {
          id: 'text-2',
          type: 'text',
          position: { x: 0, y: 0 },
          size: { width: 200, height: 50 },
          props: { text: 'Scene 2' },
        },
      ],
    },
  ];

  it('should render the correct scene based on frame', () => {
    const { container } = render(
      <TemplateRenderer
        scenes={scenes}
        frame={0}
        fps={30}
        width={1920}
        height={1080}
      />
    );
    expect(container.textContent).toContain('Scene 1');
  });

  it('should render second scene when frame is in that range', () => {
    const { container } = render(
      <TemplateRenderer
        scenes={scenes}
        frame={100}
        fps={30}
        width={1920}
        height={1080}
      />
    );
    expect(container.textContent).toContain('Scene 2');
  });

  it('should render black screen when no scenes', () => {
    const { container } = render(
      <TemplateRenderer
        scenes={[]}
        frame={0}
        fps={30}
        width={1920}
        height={1080}
      />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.backgroundColor).toBe('rgb(0, 0, 0)');
  });

  it('should show last frame of last scene if frame exceeds duration', () => {
    const { container } = render(
      <TemplateRenderer
        scenes={scenes}
        frame={200}
        fps={30}
        width={1920}
        height={1080}
      />
    );
    expect(container.textContent).toContain('Scene 2');
  });
});

describe('calculateTotalDuration', () => {
  it('should return 0 for empty scenes', () => {
    expect(calculateTotalDuration([])).toBe(0);
  });

  it('should calculate duration from last scene endFrame', () => {
    const scenes: Scene[] = [
      { id: 's1', startFrame: 0, endFrame: 90, layers: [] },
      { id: 's2', startFrame: 90, endFrame: 150, layers: [] },
    ];
    // 150 / 30 = 5 seconds
    expect(calculateTotalDuration(scenes)).toBe(5);
  });
});

describe('calculateTotalFrames', () => {
  it('should return 0 for empty scenes', () => {
    expect(calculateTotalFrames([], 30)).toBe(0);
  });

  it('should return endFrame of last scene', () => {
    const scenes: Scene[] = [
      { id: 's1', startFrame: 0, endFrame: 90, layers: [] },
      { id: 's2', startFrame: 90, endFrame: 180, layers: [] },
    ];
    expect(calculateTotalFrames(scenes, 30)).toBe(180);
  });
});

describe('getSceneAtFrame', () => {
  const scenes: Scene[] = [
    { id: 's1', startFrame: 0, endFrame: 90, layers: [] },
    { id: 's2', startFrame: 90, endFrame: 180, layers: [] },
  ];

  it('should return the correct scene for a given frame', () => {
    const result = getSceneAtFrame(scenes, 45, 30);
    expect(result).not.toBeNull();
    expect(result!.scene.id).toBe('s1');
    expect(result!.localFrame).toBe(45);
    expect(result!.sceneIndex).toBe(0);
  });

  it('should return second scene for frame in second range', () => {
    const result = getSceneAtFrame(scenes, 100, 30);
    expect(result).not.toBeNull();
    expect(result!.scene.id).toBe('s2');
    expect(result!.localFrame).toBe(10);
    expect(result!.sceneIndex).toBe(1);
  });

  it('should return last scene for frame beyond duration', () => {
    const result = getSceneAtFrame(scenes, 200, 30);
    expect(result).not.toBeNull();
    expect(result!.scene.id).toBe('s2');
    expect(result!.sceneIndex).toBe(1);
    // localFrame should be endFrame - startFrame - 1 = 180 - 90 - 1 = 89
    expect(result!.localFrame).toBe(89);
  });

  it('should return null for empty scenes', () => {
    expect(getSceneAtFrame([], 0, 30)).toBeNull();
  });

  it('should return null for frame before first scene', () => {
    const nonZeroScenes: Scene[] = [
      { id: 's1', startFrame: 30, endFrame: 90, layers: [] },
    ];
    expect(getSceneAtFrame(nonZeroScenes, 10, 30)).toBeNull();
  });
});
