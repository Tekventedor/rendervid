import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { AuroraBackground } from '../backgrounds/AuroraBackground';
import { WaveBackground } from '../backgrounds/WaveBackground';

describe('AuroraBackground Component', () => {
  it('should render without crashing', () => {
    const { container } = render(<AuroraBackground frame={0} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('should render with default colors', () => {
    const { container } = render(<AuroraBackground frame={0} totalFrames={300} />);
    const element = container.firstChild as HTMLElement;
    expect(element.style.position).toBe('relative');
    expect(element.style.overflow).toBe('hidden');
  });

  it('should apply custom width and height', () => {
    const { container } = render(
      <AuroraBackground frame={0} width="800px" height="600px" />
    );
    const element = container.firstChild as HTMLElement;
    expect(element.style.width).toBe('800px');
    expect(element.style.height).toBe('600px');
  });

  it('should render an aurora overlay div', () => {
    const { container } = render(
      <AuroraBackground frame={0} blur={20} />
    );
    // Container should have at least 2 divs: the wrapper and the aurora layer
    const divs = container.querySelectorAll('div');
    expect(divs.length).toBeGreaterThanOrEqual(2);
  });

  it('should render children when provided', () => {
    const { container } = render(
      <AuroraBackground frame={0}>
        <span>Overlay content</span>
      </AuroraBackground>
    );
    expect(container.textContent).toContain('Overlay content');
  });

  it('should not render content div when no children', () => {
    const { container } = render(<AuroraBackground frame={0} />);
    const divs = container.querySelectorAll('div');
    // Should have container div and aurora div, but not content div
    expect(divs.length).toBe(2);
  });

  it('should render content div when children provided', () => {
    const { container } = render(
      <AuroraBackground frame={0}>
        <span>Content</span>
      </AuroraBackground>
    );
    const divs = container.querySelectorAll('div');
    // Should have container div, aurora div, and content div
    expect(divs.length).toBe(3);
  });

  it('should apply custom style', () => {
    const { container } = render(
      <AuroraBackground frame={0} style={{ borderRadius: '10px' }} />
    );
    const element = container.firstChild as HTMLElement;
    expect(element.style.borderRadius).toBe('10px');
  });

  it('should apply custom className', () => {
    const { container } = render(
      <AuroraBackground frame={0} className="custom-aurora" />
    );
    const element = container.firstChild as HTMLElement;
    expect(element.className).toBe('custom-aurora');
  });

  it('should handle single color by using defaults (at least 2 colors)', () => {
    // Should not throw when given a single color
    const { container } = render(
      <AuroraBackground frame={0} colors={['#ff0000']} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should handle many colors', () => {
    const { container } = render(
      <AuroraBackground frame={0} colors={['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should handle different totalFrames values', () => {
    const { container } = render(
      <AuroraBackground frame={0} totalFrames={600} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should handle frame at end of animation', () => {
    const { container } = render(
      <AuroraBackground frame={300} totalFrames={300} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should apply default width and height of 100%', () => {
    const { container } = render(<AuroraBackground frame={0} />);
    const element = container.firstChild as HTMLElement;
    expect(element.style.width).toBe('100%');
    expect(element.style.height).toBe('100%');
  });
});

describe('WaveBackground Component', () => {
  it('should render without crashing', () => {
    const { container } = render(<WaveBackground frame={0} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('should render SVG element', () => {
    const { container } = render(<WaveBackground frame={0} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('should render wave paths', () => {
    const { container } = render(
      <WaveBackground frame={30} colors={['#667eea', '#764ba2']} waveCount={2} />
    );
    const paths = container.querySelectorAll('path');
    expect(paths.length).toBeGreaterThan(0);
  });

  it('should render correct number of waves (clamped to 3 max)', () => {
    const { container } = render(
      <WaveBackground frame={0} waveCount={3} colors={['#ff0000', '#00ff00', '#0000ff']} />
    );
    const paths = container.querySelectorAll('path');
    expect(paths.length).toBe(3);
  });

  it('should clamp wave count to minimum 1', () => {
    const { container } = render(
      <WaveBackground frame={0} waveCount={0} />
    );
    const paths = container.querySelectorAll('path');
    expect(paths.length).toBeGreaterThanOrEqual(1);
  });

  it('should clamp wave count to maximum 3', () => {
    const { container } = render(
      <WaveBackground frame={0} waveCount={10} colors={['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']} />
    );
    const paths = container.querySelectorAll('path');
    // max 3 waves per direction
    expect(paths.length).toBeLessThanOrEqual(6);
  });

  it('should apply custom style', () => {
    const { container } = render(
      <WaveBackground frame={0} style={{ zIndex: 10 }} />
    );
    const element = container.firstChild as HTMLElement;
    expect(element.style.zIndex).toBe('10');
  });

  it('should apply custom className', () => {
    const { container } = render(
      <WaveBackground frame={0} className="custom-wave" />
    );
    const element = container.firstChild as HTMLElement;
    expect(element.className).toBe('custom-wave');
  });

  it('should render gradients for each wave', () => {
    const { container } = render(
      <WaveBackground frame={0} colors={['#ff0000', '#00ff00']} waveCount={2} />
    );
    const gradients = container.querySelectorAll('linearGradient');
    expect(gradients.length).toBeGreaterThan(0);
  });

  it('should handle single color', () => {
    const { container } = render(
      <WaveBackground frame={0} colors={['#ff0000']} waveCount={2} />
    );
    const paths = container.querySelectorAll('path');
    expect(paths.length).toBeGreaterThan(0);
  });

  it('should apply width and height', () => {
    const { container } = render(
      <WaveBackground frame={0} width="800px" height="600px" />
    );
    const element = container.firstChild as HTMLElement;
    expect(element.style.width).toBe('800px');
    expect(element.style.height).toBe('600px');
  });

  it('should use default direction of bottom', () => {
    const { container } = render(
      <WaveBackground frame={0} waveCount={1} colors={['#ff0000']} />
    );
    const paths = container.querySelectorAll('path');
    // Bottom direction renders 1 wave
    expect(paths.length).toBe(1);
  });

  it('should position container absolutely', () => {
    const { container } = render(<WaveBackground frame={0} />);
    const element = container.firstChild as HTMLElement;
    expect(element.style.position).toBe('absolute');
    expect(element.style.top).toBe('0px');
    expect(element.style.left).toBe('0px');
  });

  it('should set overflow hidden', () => {
    const { container } = render(<WaveBackground frame={0} />);
    const element = container.firstChild as HTMLElement;
    expect(element.style.overflow).toBe('hidden');
  });
});
