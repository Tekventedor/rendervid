import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { VideoEditor } from '../components/VideoEditor';
import type { Template } from '@rendervid/core';

// Mock the renderer-browser module which uses canvas/webgl
vi.mock('@rendervid/renderer-browser', () => ({
  TemplateRenderer: (props: any) => (
    <div data-testid="template-renderer">
      Frame: {props.frame}
    </div>
  ),
}));

function createTestTemplate(): Template {
  return {
    name: 'Test Video',
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
              props: { text: 'Hello World' },
            },
          ],
        },
      ],
    },
  };
}

describe('VideoEditor', () => {
  it('should be exported from the package', () => {
    expect(typeof VideoEditor).toBe('function');
  });

  it('should render without crashing', () => {
    const template = createTestTemplate();
    const { container } = render(<VideoEditor template={template} />);
    expect(container.querySelector('.rendervid-video-editor')).toBeTruthy();
  });

  it('should display template name', () => {
    const template = createTestTemplate();
    render(<VideoEditor template={template} />);
    expect(screen.getByText('Test Video')).toBeTruthy();
  });

  it('should show undo/redo buttons', () => {
    const template = createTestTemplate();
    render(<VideoEditor template={template} />);
    expect(screen.getByText(/Undo/)).toBeTruthy();
    expect(screen.getByText(/Redo/)).toBeTruthy();
  });

  it('should show layer panel with layers heading', () => {
    const template = createTestTemplate();
    render(<VideoEditor template={template} />);
    expect(screen.getByText('Scenes & Layers')).toBeTruthy();
  });

  it('should show properties panel', () => {
    const template = createTestTemplate();
    render(<VideoEditor template={template} />);
    expect(screen.getByText('Select a layer to edit its properties')).toBeTruthy();
  });

  it('should render Save button when onSave callback provided', () => {
    const template = createTestTemplate();
    render(
      <VideoEditor
        template={template}
        callbacks={{ onSave: vi.fn() }}
      />
    );
    expect(screen.getByText('Save')).toBeTruthy();
  });

  it('should render Export button when onExport callback provided', () => {
    const template = createTestTemplate();
    render(
      <VideoEditor
        template={template}
        callbacks={{ onExport: vi.fn() }}
      />
    );
    expect(screen.getByText('Export')).toBeTruthy();
  });

  it('should not render Save button when no onSave callback', () => {
    const template = createTestTemplate();
    render(<VideoEditor template={template} />);
    expect(screen.queryByText('Save')).toBeNull();
  });

  it('should apply custom className', () => {
    const template = createTestTemplate();
    const { container } = render(
      <VideoEditor template={template} className="my-editor" />
    );
    expect(container.querySelector('.my-editor')).toBeTruthy();
  });
});
