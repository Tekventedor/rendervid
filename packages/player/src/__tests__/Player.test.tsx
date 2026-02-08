import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Player } from '../components/Player';
import type { Template } from '@rendervid/core';

// Mock @rendervid/core functions
vi.mock('@rendervid/core', async () => {
  const actual = await vi.importActual('@rendervid/core');
  return {
    ...actual,
    getCompositionDuration: vi.fn().mockReturnValue(300),
    getSceneAtFrame: vi.fn().mockImplementation((_comp: any, frame: number) => {
      return {
        id: 'scene-1',
        startFrame: 0,
        endFrame: 300,
        layers: [
          {
            id: 'layer-1',
            type: 'text',
            position: { x: 0, y: 0 },
            size: { width: 200, height: 100 },
            props: { text: 'Test Layer' },
          },
        ],
      };
    }),
  };
});

function createMockTemplate(): Template {
  return {
    name: 'Test Template',
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
          endFrame: 300,
          layers: [
            {
              id: 'layer-1',
              type: 'text',
              position: { x: 0, y: 0 },
              size: { width: 200, height: 100 },
              props: { text: 'Test Layer' },
            },
          ],
        },
      ],
    },
  };
}

describe('Player', () => {
  it('should be exported from the package', () => {
    expect(typeof Player).toBe('function');
  });

  it('should render without crashing', () => {
    const template = createMockTemplate();
    const { container } = render(<Player template={template} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('should render controls by default', () => {
    const template = createMockTemplate();
    render(<Player template={template} />);
    // Controls render Play button
    expect(screen.getByTitle('Play (Space)')).toBeTruthy();
  });

  it('should hide controls when controls prop is false', () => {
    const template = createMockTemplate();
    render(<Player template={template} controls={false} />);
    expect(screen.queryByTitle('Play (Space)')).toBeNull();
  });

  it('should apply custom className', () => {
    const template = createMockTemplate();
    const { container } = render(
      <Player template={template} className="my-player" />
    );
    expect(container.querySelector('.my-player')).toBeTruthy();
  });

  it('should apply custom style', () => {
    const template = createMockTemplate();
    const { container } = render(
      <Player template={template} style={{ border: '1px solid red' }} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.border).toBe('1px solid red');
  });

  it('should render visible layers', () => {
    const template = createMockTemplate();
    render(<Player template={template} />);
    expect(screen.getByText('Test Layer')).toBeTruthy();
  });
});
