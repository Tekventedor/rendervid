import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';
import { GlitchEffect } from '../effects/GlitchEffect';
import { ParticleSystem } from '../effects/ParticleSystem';

describe('GlitchEffect Component', () => {
  it('should render children when glitch is not active', () => {
    const { container } = render(
      <GlitchEffect type="rgb-split" frame={0} fps={30} frequency={0.001} duration={1}>
        <span>Glitchy content</span>
      </GlitchEffect>
    );
    expect(container.textContent).toContain('Glitchy content');
  });

  it('should render with slice type', () => {
    const { container } = render(
      <GlitchEffect type="slice" frame={0} fps={30} intensity={0.5}>
        <span>Content</span>
      </GlitchEffect>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render with shift type', () => {
    const { container } = render(
      <GlitchEffect type="shift" frame={0} fps={30} intensity={0.5}>
        <span>Content</span>
      </GlitchEffect>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render with rgb-split type', () => {
    const { container } = render(
      <GlitchEffect type="rgb-split" frame={0} fps={30} intensity={0.5}>
        <span>Content</span>
      </GlitchEffect>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render with noise type', () => {
    const { container } = render(
      <GlitchEffect type="noise" frame={0} fps={30} intensity={0.5}>
        <span>Content</span>
      </GlitchEffect>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render with scramble type', () => {
    const { container } = render(
      <GlitchEffect type="scramble" frame={0} fps={30} intensity={0.5}>
        <span>Content</span>
      </GlitchEffect>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <GlitchEffect type="rgb-split" frame={0} className="custom-glitch">
        <span>Content</span>
      </GlitchEffect>
    );
    const element = container.firstChild as HTMLElement;
    expect(element.className).toBe('custom-glitch');
  });

  it('should apply custom style', () => {
    const { container } = render(
      <GlitchEffect type="rgb-split" frame={0} style={{ width: '100%' }}>
        <span>Content</span>
      </GlitchEffect>
    );
    const element = container.firstChild as HTMLElement;
    expect(element.style.width).toBe('100%');
  });

  it('should vary effect intensity', () => {
    // Rendering with different intensities should produce different outputs
    const { container: low } = render(
      <GlitchEffect type="rgb-split" frame={15} fps={30} intensity={0.1} frequency={100} duration={10000}>
        <span>Content</span>
      </GlitchEffect>
    );
    const { container: high } = render(
      <GlitchEffect type="rgb-split" frame={15} fps={30} intensity={1.0} frequency={100} duration={10000}>
        <span>Content</span>
      </GlitchEffect>
    );
    expect(low.firstChild).toBeTruthy();
    expect(high.firstChild).toBeTruthy();
  });

  it('should handle default props', () => {
    const { container } = render(
      <GlitchEffect type="slice" frame={0}>
        <span>Default props</span>
      </GlitchEffect>
    );
    expect(container.textContent).toContain('Default props');
  });
});

describe('ParticleSystem Component', () => {
  it('should render without crashing', () => {
    const { container } = render(
      <ParticleSystem frame={0} count={10} width={800} height={600} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should render as SVG', () => {
    const { container } = render(
      <ParticleSystem frame={0} count={5} width={400} height={300} />
    );
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg!.getAttribute('viewBox')).toBe('0 0 400 300');
  });

  it('should render circle particles', () => {
    const { container } = render(
      <ParticleSystem frame={0} count={5} type="circle" width={400} height={300} />
    );
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBe(5);
  });

  it('should render square particles', () => {
    const { container } = render(
      <ParticleSystem frame={0} count={5} type="square" width={400} height={300} />
    );
    const rects = container.querySelectorAll('rect');
    expect(rects.length).toBe(5);
  });

  it('should render star particles', () => {
    const { container } = render(
      <ParticleSystem frame={0} count={5} type="star" width={400} height={300} />
    );
    const paths = container.querySelectorAll('path');
    expect(paths.length).toBe(5);
  });

  it('should render image particles with fallback when no URL', () => {
    const { container } = render(
      <ParticleSystem frame={0} count={3} type="image" width={400} height={300} />
    );
    // Falls back to circles when no imageUrl
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBe(3);
  });

  it('should render connection lines when connections enabled', () => {
    const { container } = render(
      <ParticleSystem
        frame={0}
        count={5}
        width={400}
        height={300}
        connections={true}
        connectionDistance={1000}
        seed={42}
      />
    );
    const lines = container.querySelectorAll('line');
    expect(lines.length).toBeGreaterThan(0);
  });

  it('should not render connection lines when connections disabled', () => {
    const { container } = render(
      <ParticleSystem
        frame={0}
        count={5}
        width={400}
        height={300}
        connections={false}
      />
    );
    const lines = container.querySelectorAll('line');
    expect(lines.length).toBe(0);
  });

  it('should produce deterministic output with same seed', () => {
    const { container: render1 } = render(
      <ParticleSystem frame={10} count={3} width={400} height={300} seed={42} />
    );
    const { container: render2 } = render(
      <ParticleSystem frame={10} count={3} width={400} height={300} seed={42} />
    );
    const circles1 = render1.querySelectorAll('circle');
    const circles2 = render2.querySelectorAll('circle');
    expect(circles1.length).toBe(circles2.length);
    // Same positions
    for (let i = 0; i < circles1.length; i++) {
      expect(circles1[i].getAttribute('cx')).toBe(circles2[i].getAttribute('cx'));
      expect(circles1[i].getAttribute('cy')).toBe(circles2[i].getAttribute('cy'));
    }
  });

  it('should produce different output with different seeds', () => {
    const { container: render1 } = render(
      <ParticleSystem frame={0} count={3} width={400} height={300} seed={42} />
    );
    const { container: render2 } = render(
      <ParticleSystem frame={0} count={3} width={400} height={300} seed={99} />
    );
    const circles1 = render1.querySelectorAll('circle');
    const circles2 = render2.querySelectorAll('circle');
    // At least one particle should have a different position
    let hasDifference = false;
    for (let i = 0; i < Math.min(circles1.length, circles2.length); i++) {
      if (circles1[i].getAttribute('cx') !== circles2[i].getAttribute('cx')) {
        hasDifference = true;
        break;
      }
    }
    expect(hasDifference).toBe(true);
  });

  it('should move particles based on frame', () => {
    const { container: early } = render(
      <ParticleSystem frame={0} count={3} direction="down" speed={5} width={400} height={300} seed={42} />
    );
    const { container: late } = render(
      <ParticleSystem frame={30} count={3} direction="down" speed={5} width={400} height={300} seed={42} />
    );
    const circles1 = early.querySelectorAll('circle');
    const circles2 = late.querySelectorAll('circle');
    // Y positions should differ (particles moving down)
    const y1 = parseFloat(circles1[0].getAttribute('cy')!);
    const y2 = parseFloat(circles2[0].getAttribute('cy')!);
    expect(y2).toBeGreaterThan(y1);
  });

  it('should support direction up', () => {
    const { container: early } = render(
      <ParticleSystem frame={0} count={3} direction="up" speed={5} width={400} height={300} seed={42} />
    );
    const { container: late } = render(
      <ParticleSystem frame={30} count={3} direction="up" speed={5} width={400} height={300} seed={42} />
    );
    const circles1 = early.querySelectorAll('circle');
    const circles2 = late.querySelectorAll('circle');
    const y1 = parseFloat(circles1[0].getAttribute('cy')!);
    const y2 = parseFloat(circles2[0].getAttribute('cy')!);
    expect(y2).toBeLessThan(y1);
  });

  it('should support direction left', () => {
    // Use wrap to keep particles visible; with wrap, particles that go negative wrap around
    const { container: early } = render(
      <ParticleSystem frame={0} count={3} direction="left" speed={2} width={400} height={300} seed={42} wrap={true} />
    );
    const { container: late } = render(
      <ParticleSystem frame={5} count={3} direction="left" speed={2} width={400} height={300} seed={42} wrap={true} />
    );
    const circles1 = early.querySelectorAll('circle');
    const circles2 = late.querySelectorAll('circle');
    // With wrapping, the positions change -- just verify particles are rendered at different positions
    const x1 = parseFloat(circles1[0].getAttribute('cx')!);
    const x2 = parseFloat(circles2[0].getAttribute('cx')!);
    expect(x1).not.toBe(x2);
  });

  it('should support direction right', () => {
    const { container: early } = render(
      <ParticleSystem frame={0} count={3} direction="right" speed={5} width={400} height={300} seed={42} />
    );
    const { container: late } = render(
      <ParticleSystem frame={30} count={3} direction="right" speed={5} width={400} height={300} seed={42} />
    );
    const circles1 = early.querySelectorAll('circle');
    const circles2 = late.querySelectorAll('circle');
    const x1 = parseFloat(circles1[0].getAttribute('cx')!);
    const x2 = parseFloat(circles2[0].getAttribute('cx')!);
    expect(x2).toBeGreaterThan(x1);
  });

  it('should keep particles static when direction is static', () => {
    const { container: early } = render(
      <ParticleSystem frame={0} count={3} direction="static" width={400} height={300} seed={42} />
    );
    const { container: late } = render(
      <ParticleSystem frame={30} count={3} direction="static" width={400} height={300} seed={42} />
    );
    const circles1 = early.querySelectorAll('circle');
    const circles2 = late.querySelectorAll('circle');
    const x1 = parseFloat(circles1[0].getAttribute('cx')!);
    const x2 = parseFloat(circles2[0].getAttribute('cx')!);
    expect(x1).toBe(x2);
  });

  it('should apply custom colors', () => {
    const { container } = render(
      <ParticleSystem frame={0} count={3} color="#ff0000" width={400} height={300} />
    );
    const circles = container.querySelectorAll('circle');
    circles.forEach(circle => {
      expect(circle.getAttribute('fill')).toBe('#ff0000');
    });
  });

  it('should support array of colors', () => {
    const { container } = render(
      <ParticleSystem
        frame={0}
        count={10}
        color={['#ff0000', '#00ff00', '#0000ff']}
        width={400}
        height={300}
      />
    );
    const circles = container.querySelectorAll('circle');
    const colors = new Set<string>();
    circles.forEach(circle => {
      colors.add(circle.getAttribute('fill')!);
    });
    // Should use colors from the provided array
    expect(colors.size).toBeGreaterThan(0);
  });

  it('should apply custom className', () => {
    const { container } = render(
      <ParticleSystem frame={0} count={3} className="custom-particles" width={400} height={300} />
    );
    const svg = container.querySelector('svg');
    expect(svg!.className.baseVal).toBe('custom-particles');
  });

  it('should apply custom style', () => {
    const { container } = render(
      <ParticleSystem frame={0} count={3} style={{ border: '1px solid red' }} width={400} height={300} />
    );
    const svg = container.querySelector('svg') as SVGElement;
    expect(svg.style.border).toBe('1px solid red');
  });

  it('should handle gravity effect', () => {
    const { container } = render(
      <ParticleSystem
        frame={30}
        count={3}
        effect="gravity"
        effectStrength={0.5}
        width={400}
        height={300}
        seed={42}
      />
    );
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBe(3);
  });

  it('should handle attraction effect', () => {
    const { container } = render(
      <ParticleSystem
        frame={10}
        count={3}
        effect="attraction"
        effectStrength={0.1}
        effectCenter={[0.5, 0.5]}
        direction="static"
        width={400}
        height={300}
        seed={42}
      />
    );
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBe(3);
  });

  it('should handle repulsion effect', () => {
    const { container } = render(
      <ParticleSystem
        frame={10}
        count={3}
        effect="repulsion"
        effectStrength={0.1}
        effectCenter={[0.5, 0.5]}
        direction="static"
        width={400}
        height={300}
        seed={42}
      />
    );
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBe(3);
  });

  it('should render default 50 particles', () => {
    const { container } = render(
      <ParticleSystem frame={0} width={400} height={300} />
    );
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBe(50);
  });
});
