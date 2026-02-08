import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { TextLayer } from '../TextLayer';
import type { TextLayer as TextLayerType } from '@rendervid/core';

describe('TextLayer Component', () => {
  const baseLayer: TextLayerType = {
    id: 'text-1',
    type: 'text',
    position: { x: 50, y: 50 },
    size: { width: 400, height: 100 },
    props: {
      text: 'Hello World',
    },
  };

  it('should render text content', () => {
    const { container } = render(
      <TextLayer layer={baseLayer} frame={0} fps={30} sceneDuration={100} />
    );
    expect(container.textContent).toBe('Hello World');
  });

  it('should apply position styles', () => {
    const { container } = render(
      <TextLayer layer={baseLayer} frame={0} fps={30} sceneDuration={100} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.position).toBe('absolute');
    expect(el.style.left).toBe('50px');
    expect(el.style.top).toBe('50px');
    expect(el.style.width).toBe('400px');
    expect(el.style.height).toBe('100px');
  });

  it('should apply font properties', () => {
    const layer: TextLayerType = {
      ...baseLayer,
      props: {
        text: 'Styled Text',
        fontFamily: 'Roboto',
        fontSize: 24,
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: '#ff0000',
      },
    };

    const { container } = render(
      <TextLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    // The text container is the inner div inside the outer positioned div
    const allDivs = container.querySelectorAll('div');
    const textDiv = allDivs[allDivs.length - 1] as HTMLElement;
    expect(textDiv.style.fontFamily).toBe('Roboto');
    expect(textDiv.style.fontSize).toBe('24px');
    expect(textDiv.style.fontWeight).toBe('bold');
    expect(textDiv.style.fontStyle).toBe('italic');
    // jsdom normalizes hex to rgb
    expect(textDiv.style.color).toBe('rgb(255, 0, 0)');
  });

  it('should apply text alignment', () => {
    const layer: TextLayerType = {
      ...baseLayer,
      props: {
        text: 'Centered',
        textAlign: 'center',
      },
    };

    const { container } = render(
      <TextLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.justifyContent).toBe('center');
  });

  it('should apply vertical alignment', () => {
    const layer: TextLayerType = {
      ...baseLayer,
      props: {
        text: 'Middle',
        verticalAlign: 'middle',
      },
    };

    const { container } = render(
      <TextLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.alignItems).toBe('center');
  });

  it('should apply line height and letter spacing', () => {
    const layer: TextLayerType = {
      ...baseLayer,
      props: {
        text: 'Spaced',
        lineHeight: 2.0,
        letterSpacing: 3,
      },
    };

    const { container } = render(
      <TextLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    const allDivs = container.querySelectorAll('div');
    const textDiv = allDivs[allDivs.length - 1] as HTMLElement;
    expect(textDiv.style.lineHeight).toBe('2');
    expect(textDiv.style.letterSpacing).toBe('3px');
  });

  it('should apply text transform and decoration', () => {
    const layer: TextLayerType = {
      ...baseLayer,
      props: {
        text: 'decorated',
        textTransform: 'uppercase',
        textDecoration: 'underline',
      },
    };

    const { container } = render(
      <TextLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    const allDivs = container.querySelectorAll('div');
    const textDiv = allDivs[allDivs.length - 1] as HTMLElement;
    expect(textDiv.style.textTransform).toBe('uppercase');
    expect(textDiv.style.textDecoration).toBe('underline');
  });

  it('should apply opacity', () => {
    const layer: TextLayerType = {
      ...baseLayer,
      opacity: 0.5,
    };

    const { container } = render(
      <TextLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.opacity).toBe('0.5');
  });

  it('should apply rotation', () => {
    const layer: TextLayerType = {
      ...baseLayer,
      rotation: 15,
    };

    const { container } = render(
      <TextLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.transform).toContain('rotate(15deg)');
  });

  it('should apply anchor point offset', () => {
    const layer: TextLayerType = {
      ...baseLayer,
      anchor: { x: 0.5, y: 0.5 },
    };

    const { container } = render(
      <TextLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    const el = container.firstChild as HTMLElement;
    // left = 50 - 400 * 0.5 = -150
    expect(el.style.left).toBe('-150px');
    // top = 50 - 100 * 0.5 = 0
    expect(el.style.top).toBe('0px');
  });

  it('should apply className', () => {
    const layer: TextLayerType = {
      ...baseLayer,
      className: 'my-text-layer',
    };

    const { container } = render(
      <TextLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toBe('my-text-layer');
  });

  it('should apply numeric padding', () => {
    const layer: TextLayerType = {
      ...baseLayer,
      props: {
        text: 'Padded',
        padding: 16,
      },
    };

    const { container } = render(
      <TextLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    const allDivs = container.querySelectorAll('div');
    const textDiv = allDivs[allDivs.length - 1] as HTMLElement;
    expect(textDiv.style.padding).toBe('16px');
  });

  it('should apply directional padding', () => {
    const layer: TextLayerType = {
      ...baseLayer,
      props: {
        text: 'Padded',
        padding: { top: 10, right: 20, bottom: 30, left: 40 },
      },
    };

    const { container } = render(
      <TextLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    const allDivs = container.querySelectorAll('div');
    const textDiv = allDivs[allDivs.length - 1] as HTMLElement;
    expect(textDiv.style.paddingTop).toBe('10px');
    expect(textDiv.style.paddingRight).toBe('20px');
    expect(textDiv.style.paddingBottom).toBe('30px');
    expect(textDiv.style.paddingLeft).toBe('40px');
  });

  it('should render text with background color', () => {
    const layer: TextLayerType = {
      ...baseLayer,
      props: {
        text: 'Badge',
        backgroundColor: '#333',
        borderRadius: 8,
      },
    };

    const { container } = render(
      <TextLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    // Just verify it renders without error
    expect(container.textContent).toBe('Badge');
  });

  it('should handle maxLines=1', () => {
    const layer: TextLayerType = {
      ...baseLayer,
      props: {
        text: 'Single line only',
        maxLines: 1,
      },
    };

    const { container } = render(
      <TextLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    // Verify component renders the text
    expect(container.textContent).toBe('Single line only');
  });

  it('should handle overflow ellipsis', () => {
    const layer: TextLayerType = {
      ...baseLayer,
      props: {
        text: 'Overflow text',
        overflow: 'ellipsis',
      },
    };

    const { container } = render(
      <TextLayer layer={layer} frame={0} fps={30} sceneDuration={100} />
    );
    // Verify text renders
    expect(container.textContent).toBe('Overflow text');
  });
});
