import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Preview } from '../components/Preview/Preview';
import type { Template } from '@rendervid/core';

// Mock the renderer-browser module
vi.mock('@rendervid/renderer-browser', () => ({
  TemplateRenderer: (props: any) => (
    <div data-testid="template-renderer">
      Frame: {props.frame}, FPS: {props.fps}
    </div>
  ),
}));

function createTestTemplate(): Template {
  return {
    name: 'Test',
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
          layers: [],
        },
      ],
    },
  };
}

describe('Preview', () => {
  it('should be exported from the package', () => {
    expect(typeof Preview).toBe('function');
  });

  it('should render without crashing', () => {
    const { container } = render(
      <Preview
        template={createTestTemplate()}
        currentFrame={0}
        isPlaying={false}
      />
    );
    expect(container.querySelector('.rendervid-preview')).toBeTruthy();
  });

  it('should render TemplateRenderer with current frame', () => {
    render(
      <Preview
        template={createTestTemplate()}
        currentFrame={42}
        isPlaying={false}
      />
    );
    expect(screen.getByText('Frame: 42, FPS: 30')).toBeTruthy();
  });

  it('should apply custom width and height', () => {
    const { container } = render(
      <Preview
        template={createTestTemplate()}
        currentFrame={0}
        isPlaying={false}
        width={800}
        height={450}
      />
    );
    const previewInner = container.querySelector('.rendervid-preview > div') as HTMLElement;
    expect(previewInner.style.width).toBe('800px');
    expect(previewInner.style.height).toBe('450px');
  });

  it('should apply custom className', () => {
    const { container } = render(
      <Preview
        template={createTestTemplate()}
        currentFrame={0}
        isPlaying={false}
        className="my-preview"
      />
    );
    expect(container.querySelector('.my-preview')).toBeTruthy();
  });
});
