import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { GroupLayer } from '../GroupLayer';
import type { GroupLayer as GroupLayerType } from '@rendervid/core';

describe('GroupLayer Component', () => {
  const baseLayer: GroupLayerType = {
    id: 'group-1',
    type: 'group',
    position: { x: 50, y: 50 },
    size: { width: 600, height: 400 },
    props: {},
    children: [],
  };

  it('should render a div container', () => {
    const { container } = render(
      <GroupLayer layer={baseLayer} frame={0} fps={30} sceneDuration={100} />
    );
    expect(container.firstChild).toBeTruthy();
    const el = container.firstChild as HTMLElement;
    expect(el.tagName).toBe('DIV');
  });

  it('should apply position and size', () => {
    const { container } = render(
      <GroupLayer layer={baseLayer} frame={0} fps={30} sceneDuration={100} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.position).toBe('absolute');
    expect(el.style.left).toBe('50px');
    expect(el.style.top).toBe('50px');
    expect(el.style.width).toBe('600px');
    expect(el.style.height).toBe('400px');
  });

  it('should apply opacity', () => {
    const layer: GroupLayerType = {
      ...baseLayer,
      opacity: 0.5,
    };

    const { container } = render(
      <GroupLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.opacity).toBe('0.5');
  });

  it('should apply rotation', () => {
    const layer: GroupLayerType = {
      ...baseLayer,
      rotation: 45,
    };

    const { container } = render(
      <GroupLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.transform).toContain('rotate(45deg)');
  });

  it('should apply className', () => {
    const layer: GroupLayerType = {
      ...baseLayer,
      className: 'my-group',
    };

    const { container } = render(
      <GroupLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toBe('my-group');
  });

  it('should clip overflow when clip=true', () => {
    const layer: GroupLayerType = {
      ...baseLayer,
      props: { clip: true },
    };

    const { container } = render(
      <GroupLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.overflow).toBe('hidden');
  });

  it('should not clip overflow by default', () => {
    const { container } = render(
      <GroupLayer layer={baseLayer} frame={0} fps={30} sceneDuration={100} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.overflow).toBe('visible');
  });

  it('should render child layers', () => {
    const layer: GroupLayerType = {
      ...baseLayer,
      children: [
        {
          id: 'child-text',
          type: 'text',
          position: { x: 10, y: 10 },
          size: { width: 200, height: 50 },
          props: { text: 'Child Text' },
        },
      ],
    };

    const { container } = render(
      <GroupLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    expect(container.textContent).toContain('Child Text');
  });

  it('should render multiple children', () => {
    const layer: GroupLayerType = {
      ...baseLayer,
      children: [
        {
          id: 'child-1',
          type: 'text',
          position: { x: 0, y: 0 },
          size: { width: 100, height: 30 },
          props: { text: 'First' },
        },
        {
          id: 'child-2',
          type: 'text',
          position: { x: 0, y: 40 },
          size: { width: 100, height: 30 },
          props: { text: 'Second' },
        },
      ],
    };

    const { container } = render(
      <GroupLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    expect(container.textContent).toContain('First');
    expect(container.textContent).toContain('Second');
  });
});
