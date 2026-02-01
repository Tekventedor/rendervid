import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import {
  Text,
  GradientText,
  Image,
  Shape,
  Container,
  Counter,
  ProgressBar,
  Typewriter,
  Fade,
  Slide,
  Scale,
  Rotate,
} from '../components';

describe('Text Component', () => {
  it('should render text content', () => {
    render(<Text text="Hello World" />);
    expect(screen.getByText('Hello World')).toBeTruthy();
  });

  it('should apply font size', () => {
    const { container } = render(<Text text="Test" fontSize={24} />);
    const element = container.firstChild as HTMLElement;
    expect(element.style.fontSize).toBe('24px');
  });

  it('should apply text color', () => {
    const { container } = render(<Text text="Test" color="#ff0000" />);
    const element = container.firstChild as HTMLElement;
    expect(element.style.color).toBe('rgb(255, 0, 0)');
  });

  it('should apply text alignment', () => {
    const { container } = render(<Text text="Test" textAlign="center" />);
    const element = container.firstChild as HTMLElement;
    expect(element.style.textAlign).toBe('center');
  });
});

describe('GradientText Component', () => {
  it('should render text with gradient', () => {
    render(<GradientText text="Gradient" colors={['#ff0000', '#0000ff']} />);
    expect(screen.getByText('Gradient')).toBeTruthy();
  });

  it('should apply gradient background', () => {
    const { container } = render(
      <GradientText text="Test" colors={['#ff0000', '#0000ff']} angle={45} />
    );
    const element = container.firstChild as HTMLElement;
    expect(element.style.background).toContain('linear-gradient');
  });
});

describe('Image Component', () => {
  it('should render image with src', () => {
    render(<Image src="https://example.com/image.jpg" alt="Test image" />);
    const img = screen.getByAltText('Test image') as HTMLImageElement;
    expect(img.src).toBe('https://example.com/image.jpg');
  });

  it('should apply object-fit', () => {
    render(<Image src="test.jpg" fit="contain" alt="test" />);
    const img = screen.getByAltText('test') as HTMLImageElement;
    expect(img.style.objectFit).toBe('contain');
  });
});

describe('Shape Component', () => {
  it('should render rectangle', () => {
    const { container } = render(<Shape shape="rectangle" fill="#3b82f6" />);
    const element = container.firstChild as HTMLElement;
    expect(element.style.backgroundColor).toBe('rgb(59, 130, 246)');
  });

  it('should render circle', () => {
    const { container } = render(<Shape shape="circle" fill="#3b82f6" />);
    const element = container.firstChild as HTMLElement;
    expect(element.style.borderRadius).toBe('50%');
  });

  it('should render triangle as SVG', () => {
    const { container } = render(<Shape shape="triangle" fill="#3b82f6" />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
  });

  it('should render star as SVG', () => {
    const { container } = render(
      <Shape shape="star" fill="#3b82f6" points={5} />
    );
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
  });
});

describe('Container Component', () => {
  it('should render children', () => {
    render(
      <Container>
        <span>Child content</span>
      </Container>
    );
    expect(screen.getByText('Child content')).toBeTruthy();
  });

  it('should apply flexbox properties', () => {
    const { container } = render(
      <Container
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        gap={16}
      >
        <span>Item</span>
      </Container>
    );
    const element = container.firstChild as HTMLElement;
    expect(element.style.flexDirection).toBe('row');
    expect(element.style.justifyContent).toBe('center');
    expect(element.style.alignItems).toBe('center');
    expect(element.style.gap).toBe('16px');
  });
});

describe('Counter Component', () => {
  it('should show starting value at frame 0', () => {
    render(<Counter from={0} to={100} frame={0} totalFrames={30} />);
    expect(screen.getByText('0')).toBeTruthy();
  });

  it('should show ending value at final frame', () => {
    render(<Counter from={0} to={100} frame={30} totalFrames={30} />);
    expect(screen.getByText('100')).toBeTruthy();
  });

  it('should show intermediate value', () => {
    const { container } = render(
      <Counter from={0} to={100} frame={15} totalFrames={30} />
    );
    const text = container.textContent;
    // Should be somewhere between 0 and 100
    const value = parseInt(text || '0');
    expect(value).toBeGreaterThan(0);
    expect(value).toBeLessThan(100);
  });

  it('should apply prefix and suffix', () => {
    render(
      <Counter from={0} to={100} frame={30} totalFrames={30} prefix="$" suffix="k" />
    );
    expect(screen.getByText('$100k')).toBeTruthy();
  });

  it('should handle decimals', () => {
    render(
      <Counter from={0} to={100} frame={30} totalFrames={30} decimals={2} />
    );
    expect(screen.getByText('100.00')).toBeTruthy();
  });
});

describe('ProgressBar Component', () => {
  it('should render with correct structure', () => {
    const { container } = render(
      <ProgressBar value={0.5} frame={30} totalFrames={30} animated={false} />
    );
    // Find the inner bar - it's the nested div
    const bars = container.querySelectorAll('div');
    expect(bars.length).toBeGreaterThanOrEqual(2);
  });

  it('should apply custom colors', () => {
    const { container } = render(
      <ProgressBar
        value={0.5}
        frame={30}
        totalFrames={30}
        color="#ff0000"
        backgroundColor="#000000"
        animated={false}
      />
    );
    const outerBar = container.firstChild as HTMLElement;
    expect(outerBar.style.backgroundColor).toBe('rgb(0, 0, 0)');
  });
});

describe('Typewriter Component', () => {
  it('should show cursor at frame 0', () => {
    const { container } = render(
      <Typewriter text="Hello World" frame={0} fps={30} speed={10} />
    );
    // Just cursor visible
    expect(container.textContent).toBe('|');
  });

  it('should show partial text during animation', () => {
    const { container } = render(
      <Typewriter text="Hello World" frame={15} fps={30} speed={10} showCursor={false} />
    );
    const text = container.textContent || '';
    expect(text.length).toBeGreaterThan(0);
    expect(text.length).toBeLessThan('Hello World'.length);
  });

  it('should show full text when complete', () => {
    const { container } = render(
      <Typewriter text="Hello World" frame={100} fps={30} speed={10} showCursor={false} />
    );
    expect(container.textContent).toBe('Hello World');
  });
});

describe('Fade Component', () => {
  it('should be invisible at frame 0 for fade in', () => {
    const { container } = render(
      <Fade direction="in" frame={0} duration={30}>
        <span>Content</span>
      </Fade>
    );
    const element = container.firstChild as HTMLElement;
    expect(element.style.opacity).toBe('0');
  });

  it('should be fully visible after fade in duration', () => {
    const { container } = render(
      <Fade direction="in" frame={30} duration={30}>
        <span>Content</span>
      </Fade>
    );
    const element = container.firstChild as HTMLElement;
    expect(element.style.opacity).toBe('1');
  });

  it('should be invisible after fade out', () => {
    const { container } = render(
      <Fade direction="out" frame={30} duration={30}>
        <span>Content</span>
      </Fade>
    );
    const element = container.firstChild as HTMLElement;
    expect(element.style.opacity).toBe('0');
  });
});

describe('Slide Component', () => {
  it('should be offset at frame 0', () => {
    const { container } = render(
      <Slide from="left" frame={0} distance={100}>
        <span>Content</span>
      </Slide>
    );
    const element = container.firstChild as HTMLElement;
    expect(element.style.transform).toContain('-100px');
  });

  it('should be at position after animation', () => {
    const { container } = render(
      <Slide from="left" frame={30} duration={30} distance={100}>
        <span>Content</span>
      </Slide>
    );
    const element = container.firstChild as HTMLElement;
    expect(element.style.transform).toBe('translate(0px, 0px)');
  });
});

describe('Scale Component', () => {
  it('should be scaled down at frame 0', () => {
    const { container } = render(
      <Scale from={0} to={1} frame={0}>
        <span>Content</span>
      </Scale>
    );
    const element = container.firstChild as HTMLElement;
    expect(element.style.transform).toBe('scale(0)');
  });

  it('should be full scale after animation', () => {
    const { container } = render(
      <Scale from={0} to={1} frame={30} duration={30}>
        <span>Content</span>
      </Scale>
    );
    const element = container.firstChild as HTMLElement;
    expect(element.style.transform).toBe('scale(1)');
  });
});

describe('Rotate Component', () => {
  it('should be at initial rotation at frame 0', () => {
    const { container } = render(
      <Rotate from={0} to={360} frame={0}>
        <span>Content</span>
      </Rotate>
    );
    const element = container.firstChild as HTMLElement;
    expect(element.style.transform).toBe('rotate(0deg)');
  });

  it('should be at final rotation after animation', () => {
    const { container } = render(
      <Rotate from={0} to={360} frame={30} duration={30}>
        <span>Content</span>
      </Rotate>
    );
    const element = container.firstChild as HTMLElement;
    expect(element.style.transform).toBe('rotate(360deg)');
  });
});
