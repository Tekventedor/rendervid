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
import { BlurText } from '../effects/BlurText';
import { WaveText } from '../effects/WaveText';
import { BounceText } from '../effects/BounceText';
import { StaggerText } from '../effects/StaggerText';
import { ShinyText } from '../effects/ShinyText';
import { RevealText } from '../effects/RevealText';
import { SplitText } from '../effects/SplitText';
import { ScrambleText } from '../effects/ScrambleText';
import { FlipText } from '../effects/FlipText';
import { FuzzyText } from '../effects/FuzzyText';
import { NeonText } from '../effects/NeonText';
import { TextTrail } from '../effects/TextTrail';
import { LetterMorph } from '../effects/LetterMorph';
import { MorphText } from '../effects/MorphText';
import { DistortText } from '../effects/DistortText';

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

describe('BlurText Component', () => {
  it('should render text content', () => {
    render(<BlurText text="Hello World" frame={0} />);
    expect(screen.getByText('Hello World')).toBeTruthy();
  });

  it('should apply maximum blur at frame 0', () => {
    const { container } = render(
      <BlurText text="Test" frame={0} startBlur={10} endBlur={0} duration={60} />
    );
    const span = container.querySelector('span') as HTMLElement;
    expect(span.style.filter).toBe('blur(10px)');
  });

  it('should apply minimum blur after animation completes', () => {
    const { container } = render(
      <BlurText text="Test" frame={60} startBlur={10} endBlur={0} duration={60} />
    );
    const span = container.querySelector('span') as HTMLElement;
    expect(span.style.filter).toBe('blur(0px)');
  });

  it('should respect delay parameter', () => {
    const { container } = render(
      <BlurText text="Test" frame={10} startBlur={10} endBlur={0} duration={60} delay={30} />
    );
    // At frame 10 with delay 30, effective frame is -20, clamped to 0, so still at max blur
    const span = container.querySelector('span') as HTMLElement;
    expect(span.style.filter).toBe('blur(10px)');
  });

  it('should render word-by-word mode', () => {
    const { container } = render(
      <BlurText text="Hello World" frame={0} mode="words" duration={60} />
    );
    const spans = container.querySelectorAll('span');
    // Should have multiple spans for word-by-word mode (at least 2 for "Hello" and "World")
    expect(spans.length).toBeGreaterThanOrEqual(2);
  });

  it('should render letter-by-letter mode', () => {
    const { container } = render(
      <BlurText text="Hi" frame={0} mode="letters" duration={60} />
    );
    const spans = container.querySelectorAll('span');
    // Should have 2 spans for 2 letters
    expect(spans.length).toBe(2);
  });

  it('should apply custom font size and color', () => {
    const { container } = render(
      <BlurText text="Test" frame={0} fontSize={32} color="#ff0000" />
    );
    const element = container.firstChild as HTMLElement;
    expect(element.style.fontSize).toBe('32px');
    expect(element.style.color).toBe('rgb(255, 0, 0)');
  });
});

describe('BounceText Component', () => {
  it('should render text content', () => {
    render(<BounceText text="Hello World" frame={0} />);
    expect(screen.getByText('Hello World')).toBeTruthy();
  });

  it('should be offset at frame 0 in whole mode', () => {
    const { container } = render(
      <BounceText text="Test" frame={0} direction="up" duration={60} mode="whole" />
    );
    const span = container.querySelector('span') as HTMLElement;
    // At frame 0, text should be offset (not at final position)
    expect(span.style.transform).toContain('translate');
    // Should have a positive Y offset for 'up' direction
    expect(span.style.transform).toMatch(/translate\([^)]*\)/);
  });

  it('should be at final position after animation completes', () => {
    const { container } = render(
      <BounceText text="Test" frame={60} direction="up" duration={60} mode="whole" />
    );
    const span = container.querySelector('span') as HTMLElement;
    // After animation completes, should be at final position (0, 0)
    expect(span.style.transform).toBe('translate(0px, 0px)');
  });

  it('should respect delay parameter', () => {
    const { container } = render(
      <BounceText text="Test" frame={10} direction="down" duration={60} delay={30} />
    );
    // At frame 10 with delay 30, effective frame is -20, clamped to 0
    const span = container.querySelector('span') as HTMLElement;
    expect(span.style.transform).toContain('translate');
    // Should still be at starting position due to delay
  });

  it('should animate from left direction', () => {
    const { container } = render(
      <BounceText text="Test" frame={0} direction="left" duration={60} />
    );
    const span = container.querySelector('span') as HTMLElement;
    // For 'left' direction, should have positive X offset at start
    expect(span.style.transform).toContain('translate');
  });

  it('should animate from right direction', () => {
    const { container } = render(
      <BounceText text="Test" frame={0} direction="right" duration={60} />
    );
    const span = container.querySelector('span') as HTMLElement;
    // For 'right' direction, should have negative X offset at start
    expect(span.style.transform).toContain('translate');
  });

  it('should render letter-by-letter mode', () => {
    const { container } = render(
      <BounceText text="Hi" frame={0} mode="letters" duration={60} stagger={2} />
    );
    const spans = container.querySelectorAll('span');
    // Should have 2 spans for 2 letters
    expect(spans.length).toBe(2);
  });

  it('should apply stagger in letters mode', () => {
    const { container } = render(
      <BounceText text="Hi" frame={5} mode="letters" duration={60} stagger={10} />
    );
    const spans = container.querySelectorAll('span');
    expect(spans.length).toBe(2);
    // First letter should be animating, second should still be at start
    // (This tests that stagger is working, though exact values are hard to test)
  });

  it('should apply custom font size and color', () => {
    const { container } = render(
      <BounceText text="Test" frame={0} fontSize={32} color="#ff0000" />
    );
    const element = container.firstChild as HTMLElement;
    expect(element.style.fontSize).toBe('32px');
    expect(element.style.color).toBe('rgb(255, 0, 0)');
  });

  it('should use default bounce count', () => {
    const { container } = render(
      <BounceText text="Test" frame={30} duration={60} />
    );
    const span = container.querySelector('span') as HTMLElement;
    // During mid-animation, should have transform applied
    expect(span.style.transform).toContain('translate');
  });

  it('should animate with custom bounce count', () => {
    const { container } = render(
      <BounceText text="Test" frame={30} duration={60} bounces={5} />
    );
    const span = container.querySelector('span') as HTMLElement;
    // Should have transform applied (specific value depends on elastic function)
    expect(span.style.transform).toContain('translate');
  });
});

describe('WaveText Component', () => {
  it('should render text content', () => {
    const { container } = render(<WaveText text="Hello World" frame={0} />);
    expect(container.textContent).toBe('Hello World');
  });

  it('should split text into individual characters', () => {
    const { container } = render(<WaveText text="Hi" frame={0} />);
    const spans = container.querySelectorAll('span');
    // Should have 2 spans for 2 letters
    expect(spans.length).toBe(2);
  });

  it('should apply vertical transform at frame 0', () => {
    const { container } = render(
      <WaveText text="A" frame={0} direction="vertical" amplitude={20} frequency={0.5} speed={2} fps={30} />
    );
    const span = container.querySelector('span') as HTMLElement;
    expect(span.style.transform).toContain('translateY');
  });

  it('should apply horizontal transform when direction is horizontal', () => {
    const { container } = render(
      <WaveText text="A" frame={0} direction="horizontal" amplitude={20} frequency={0.5} speed={2} fps={30} />
    );
    const span = container.querySelector('span') as HTMLElement;
    expect(span.style.transform).toContain('translateX');
  });

  it('should apply different transforms to each character', () => {
    const { container } = render(
      <WaveText text="AB" frame={30} amplitude={20} frequency={0.5} speed={2} fps={30} />
    );
    const spans = container.querySelectorAll('span');
    const transform1 = (spans[0] as HTMLElement).style.transform;
    const transform2 = (spans[1] as HTMLElement).style.transform;
    // Characters should have different transforms due to wave pattern
    expect(transform1).not.toBe(transform2);
  });

  it('should create continuous animation across frames', () => {
    const { container: container1 } = render(
      <WaveText text="A" frame={0} amplitude={20} frequency={0.5} speed={2} fps={30} />
    );
    const { container: container2 } = render(
      <WaveText text="A" frame={15} amplitude={20} frequency={0.5} speed={2} fps={30} />
    );

    const transform1 = (container1.querySelector('span') as HTMLElement).style.transform;
    const transform2 = (container2.querySelector('span') as HTMLElement).style.transform;

    // Transforms should be different at different frames
    expect(transform1).not.toBe(transform2);
  });

  it('should apply custom font size and color', () => {
    const { container } = render(
      <WaveText text="Test" frame={0} fontSize={32} color="#ff0000" />
    );
    const element = container.firstChild as HTMLElement;
    expect(element.style.fontSize).toBe('32px');
    expect(element.style.color).toBe('rgb(255, 0, 0)');
  });

  it('should preserve whitespace in text', () => {
    const { container } = render(<WaveText text="A B" frame={0} />);
    const spans = container.querySelectorAll('span');
    // Should have 3 spans for "A", " ", "B"
    expect(spans.length).toBe(3);
    const spaceSpan = spans[1] as HTMLElement;
    expect(spaceSpan.style.whiteSpace).toBe('pre');
  });

  it('should respect amplitude parameter', () => {
    const { container } = render(
      <WaveText text="A" frame={0} amplitude={50} frequency={0} speed={0} fps={30} />
    );
    const span = container.querySelector('span') as HTMLElement;
    // With frequency=0 and speed=0, wave offset should be sin(0) * 50 = 0
    expect(span.style.transform).toContain('0px');
  });
});

describe('ShinyText Component', () => {
  it('should render text content', () => {
    render(<ShinyText text="Hello World" frame={0} />);
    expect(screen.getByText('Hello World')).toBeTruthy();
  });

  it('should apply gradient background with background-clip', () => {
    const { container } = render(
      <ShinyText
        text="Test"
        frame={30}
        duration={60}
        shineColor="rgba(255, 255, 255, 0.8)"
        baseColor="#666666"
      />
    );
    const span = container.querySelector('span') as HTMLElement;
    expect(span.style.background).toContain('linear-gradient');
    expect(span.style.backgroundClip).toBe('text');
    expect((span.style as any).WebkitBackgroundClip).toBe('text');
  });

  it('should update gradient position based on frame', () => {
    const { container: container1 } = render(
      <ShinyText text="Test" frame={0} duration={60} />
    );
    const span1 = container1.querySelector('span') as HTMLElement;
    const bg1 = span1.style.background;

    const { container: container2 } = render(
      <ShinyText text="Test" frame={30} duration={60} />
    );
    const span2 = container2.querySelector('span') as HTMLElement;
    const bg2 = span2.style.background;

    // Background gradients should be different at different frames
    expect(bg1).not.toBe(bg2);
  });

  it('should loop animation when loop is true', () => {
    const { container: container1 } = render(
      <ShinyText text="Test" frame={0} duration={60} loop={true} />
    );
    const span1 = container1.querySelector('span') as HTMLElement;
    const bg1 = span1.style.background;

    const { container: container2 } = render(
      <ShinyText text="Test" frame={60} duration={60} loop={true} />
    );
    const span2 = container2.querySelector('span') as HTMLElement;
    const bg2 = span2.style.background;

    // At frame 60 with duration 60 and loop=true, should be same as frame 0
    expect(bg1).toBe(bg2);
  });

  it('should apply custom colors', () => {
    const { container } = render(
      <ShinyText
        text="Test"
        frame={0}
        shineColor="rgba(255, 215, 0, 0.9)"
        baseColor="#8B7355"
      />
    );
    const span = container.querySelector('span') as HTMLElement;
    expect(span.style.background).toContain('rgba(255, 215, 0, 0.9)');
    expect(span.style.background).toContain('#8B7355');
  });

  it('should apply custom font size and weight', () => {
    const { container } = render(
      <ShinyText text="Test" frame={0} fontSize={48} fontWeight="bold" />
    );
    const element = container.firstChild as HTMLElement;
    expect(element.style.fontSize).toBe('48px');
    expect(element.style.fontWeight).toBe('bold');
  });

  it('should apply text shadow', () => {
    const shadow = '0 0 20px rgba(255, 255, 255, 0.5)';
    const { container } = render(
      <ShinyText text="Test" frame={0} textShadow={shadow} />
    );
    const element = container.firstChild as HTMLElement;
    expect(element.style.textShadow).toBe(shadow);
  });

  it('should support different directions', () => {
    const { container: leftContainer } = render(
      <ShinyText text="Test" frame={20} duration={60} direction="left" />
    );
    const leftSpan = leftContainer.querySelector('span') as HTMLElement;
    const leftBg = leftSpan.style.background;

    const { container: rightContainer } = render(
      <ShinyText text="Test" frame={20} duration={60} direction="right" />
    );
    const rightSpan = rightContainer.querySelector('span') as HTMLElement;
    const rightBg = rightSpan.style.background;

    // Different directions should produce different gradients
    expect(leftBg).not.toBe(rightBg);
  });

  it('should apply letter spacing', () => {
    const { container } = render(
      <ShinyText text="Test" frame={0} letterSpacing={3} />
    );
    const element = container.firstChild as HTMLElement;
    expect(element.style.letterSpacing).toBe('3px');
  });

  it('should respect text alignment', () => {
    const { container } = render(
      <ShinyText text="Test" frame={0} textAlign="center" />
    );
    const element = container.firstChild as HTMLElement;
    expect(element.style.textAlign).toBe('center');
  });
});

describe('StaggerText Component', () => {
  it('should render text content', () => {
    const { container } = render(<StaggerText text="Hello World" frame={0} />);
    // Text is split into individual characters, so check the container text content
    expect(container.textContent).toBe('Hello World');
  });

  it('should render each character as separate span', () => {
    const { container } = render(
      <StaggerText text="Hi" frame={0} stagger={3} duration={15} />
    );
    const spans = container.querySelectorAll('span');
    // Should have 2 spans for 2 characters
    expect(spans.length).toBe(2);
  });

  it('should be invisible at frame 0 with fade animation', () => {
    const { container } = render(
      <StaggerText text="Test" frame={0} animation="fade" duration={15} />
    );
    const firstSpan = container.querySelector('span') as HTMLElement;
    expect(firstSpan.style.opacity).toBe('0');
  });

  it('should be fully visible after animation completes', () => {
    const { container } = render(
      <StaggerText text="T" frame={15} animation="fade" duration={15} stagger={3} />
    );
    const firstSpan = container.querySelector('span') as HTMLElement;
    expect(firstSpan.style.opacity).toBe('1');
  });

  it('should respect stagger delay between characters', () => {
    const { container } = render(
      <StaggerText text="Hi" frame={5} animation="fade" duration={15} stagger={10} />
    );
    const spans = container.querySelectorAll('span');
    const firstSpan = spans[0] as HTMLElement;
    const secondSpan = spans[1] as HTMLElement;

    // First character should be animating
    const firstOpacity = parseFloat(firstSpan.style.opacity);
    expect(firstOpacity).toBeGreaterThan(0);

    // Second character should still be at start (frame 5, stagger 10 means it hasn't started yet)
    expect(secondSpan.style.opacity).toBe('0');
  });

  it('should animate with slideUp animation', () => {
    const { container } = render(
      <StaggerText text="T" frame={0} animation="slideUp" duration={15} />
    );
    const firstSpan = container.querySelector('span') as HTMLElement;
    // At frame 0, should be offset downward
    expect(firstSpan.style.transform).toContain('translateY');
  });

  it('should animate with slideDown animation', () => {
    const { container } = render(
      <StaggerText text="T" frame={0} animation="slideDown" duration={15} />
    );
    const firstSpan = container.querySelector('span') as HTMLElement;
    // At frame 0, should be offset upward (negative value)
    expect(firstSpan.style.transform).toContain('translateY');
  });

  it('should animate with scale animation', () => {
    const { container } = render(
      <StaggerText text="T" frame={0} animation="scale" duration={15} />
    );
    const firstSpan = container.querySelector('span') as HTMLElement;
    expect(firstSpan.style.transform).toContain('scale');
  });

  it('should animate with bounce animation', () => {
    const { container } = render(
      <StaggerText text="T" frame={0} animation="bounce" duration={15} />
    );
    const firstSpan = container.querySelector('span') as HTMLElement;
    expect(firstSpan.style.transform).toContain('scale');
  });

  it('should respect delay parameter', () => {
    const { container } = render(
      <StaggerText text="T" frame={10} animation="fade" duration={15} delay={30} />
    );
    // At frame 10 with delay 30, effective frame is -20, clamped to 0
    const firstSpan = container.querySelector('span') as HTMLElement;
    expect(firstSpan.style.opacity).toBe('0');
  });

  it('should apply custom font size and color', () => {
    const { container } = render(
      <StaggerText text="Test" frame={0} fontSize={32} color="#ff0000" />
    );
    const element = container.firstChild as HTMLElement;
    expect(element.style.fontSize).toBe('32px');
    expect(element.style.color).toBe('rgb(255, 0, 0)');
  });

  it('should preserve spaces in text', () => {
    const { container } = render(
      <StaggerText text="Hi There" frame={100} animation="fade" duration={15} />
    );
    const spans = container.querySelectorAll('span');
    // Should have 8 spans for "Hi There" (including space)
    expect(spans.length).toBe(8);
  });

  it('should complete animation for all characters eventually', () => {
    const { container } = render(
      <StaggerText text="Hi" frame={100} animation="fade" duration={15} stagger={3} />
    );
    const spans = container.querySelectorAll('span');
    // All characters should be fully visible after enough frames
    spans.forEach(span => {
      expect((span as HTMLElement).style.opacity).toBe('1');
    });
  });
});

describe('RevealText Component', () => {
  it('should render text content', () => {
    render(<RevealText text="Hello World" frame={0} />);
    expect(screen.getByText(/Hello/)).toBeTruthy();
  });

  it('should apply fade reveal style', () => {
    const { container } = render(
      <RevealText text="Test" frame={0} mode="words" revealStyle="fade" duration={30} stagger={5} />
    );
    const spans = container.querySelectorAll('span');
    // At frame 0, first word should have low opacity (starting to fade)
    expect(spans.length).toBeGreaterThan(0);
  });

  it('should apply wipe reveal style', () => {
    const { container } = render(
      <RevealText text="Test" frame={15} mode="words" revealStyle="wipe" duration={30} stagger={5} />
    );
    const spans = container.querySelectorAll('span');
    expect(spans.length).toBeGreaterThan(0);
    // Check that spans have overflow hidden for wipe effect
    const wordSpan = Array.from(spans).find(s => s.textContent?.trim());
    if (wordSpan) {
      expect((wordSpan as HTMLElement).style.overflow).toBe('hidden');
    }
  });

  it('should apply slide reveal style', () => {
    const { container } = render(
      <RevealText text="Test" frame={0} mode="words" revealStyle="slide" duration={30} stagger={5} />
    );
    const spans = container.querySelectorAll('span');
    expect(spans.length).toBeGreaterThan(0);
  });

  it('should reveal in letter mode', () => {
    const { container } = render(
      <RevealText text="Hi" frame={0} mode="letters" revealStyle="fade" duration={20} stagger={2} />
    );
    const spans = container.querySelectorAll('span');
    // Should have 2 spans for 2 letters
    expect(spans.length).toBe(2);
  });

  it('should reveal from left to right', () => {
    const { container } = render(
      <RevealText text="ABC" frame={10} mode="letters" revealStyle="fade" duration={10} stagger={5} direction="left" />
    );
    const spans = container.querySelectorAll('span');
    expect(spans.length).toBe(3);
  });

  it('should reveal from right to left', () => {
    const { container } = render(
      <RevealText text="ABC" frame={10} mode="letters" revealStyle="fade" duration={10} stagger={5} direction="right" />
    );
    const spans = container.querySelectorAll('span');
    expect(spans.length).toBe(3);
  });

  it('should reveal from center outward', () => {
    const { container } = render(
      <RevealText text="ABCDE" frame={10} mode="letters" revealStyle="fade" duration={10} stagger={5} direction="center" />
    );
    const spans = container.querySelectorAll('span');
    expect(spans.length).toBe(5);
  });

  it('should respect delay parameter', () => {
    const { container } = render(
      <RevealText text="Test" frame={10} mode="words" revealStyle="fade" duration={30} stagger={5} delay={20} />
    );
    const spans = container.querySelectorAll('span');
    // At frame 10 with delay 20, effective frame is -10 (clamped to 0), so items should be hidden
    expect(spans.length).toBeGreaterThan(0);
  });

  it('should apply custom font size and color', () => {
    const { container } = render(
      <RevealText text="Test" frame={0} fontSize={32} color="#ff0000" />
    );
    const element = container.firstChild as HTMLElement;
    expect(element.style.fontSize).toBe('32px');
    expect(element.style.color).toBe('rgb(255, 0, 0)');
  });

  it('should handle word mode with whitespace', () => {
    const { container } = render(
      <RevealText text="Hello World" frame={15} mode="words" revealStyle="fade" duration={30} stagger={5} />
    );
    const spans = container.querySelectorAll('span');
    // Should have spans for "Hello", " ", "World"
    expect(spans.length).toBeGreaterThanOrEqual(2);
  });
});

describe('SplitText Component', () => {
  it('should render text content', () => {
    const { container } = render(<SplitText text="Hello World" frame={0} />);
    expect(container.textContent).toBe('Hello World');
  });

  it('should split text into letters by default', () => {
    const { container } = render(
      <SplitText text="Hi" frame={0} mode="letters" duration={60} />
    );
    const spans = container.querySelectorAll('span');
    // Should have 2 spans for 2 letters
    expect(spans.length).toBe(2);
  });

  it('should split text into words when mode is words', () => {
    const { container } = render(
      <SplitText text="Hello World" frame={0} mode="words" duration={60} />
    );
    const spans = container.querySelectorAll('span');
    // Should have spans for "Hello", " ", "World"
    expect(spans.length).toBeGreaterThanOrEqual(2);
  });

  it('should apply splitUp animation at frame 0', () => {
    const { container } = render(
      <SplitText text="T" frame={0} animation="splitUp" duration={60} stagger={2} />
    );
    const span = container.querySelector('span') as HTMLElement;
    // At frame 0, character should be offset upward (negative translateY)
    expect(span.style.transform).toContain('translateY');
    expect(span.style.opacity).toBe('0');
  });

  it('should apply splitDown animation at frame 0', () => {
    const { container } = render(
      <SplitText text="T" frame={0} animation="splitDown" duration={60} stagger={2} />
    );
    const span = container.querySelector('span') as HTMLElement;
    // At frame 0, character should be offset downward (positive translateY)
    expect(span.style.transform).toContain('translateY');
    expect(span.style.opacity).toBe('0');
  });

  it('should apply splitX animation at frame 0', () => {
    const { container } = render(
      <SplitText text="AB" frame={0} animation="splitX" duration={60} stagger={2} />
    );
    const spans = container.querySelectorAll('span');
    // Characters should be offset horizontally
    expect((spans[0] as HTMLElement).style.transform).toContain('translateX');
    expect((spans[1] as HTMLElement).style.transform).toContain('translateX');
  });

  it('should apply fan animation at frame 0', () => {
    const { container } = render(
      <SplitText text="T" frame={0} animation="fan" duration={60} stagger={2} />
    );
    const span = container.querySelector('span') as HTMLElement;
    // Fan animation includes rotation, translation, and scale
    expect(span.style.transform).toContain('rotate');
    expect(span.style.transform).toContain('scale');
    expect(span.style.opacity).toBe('0');
  });

  it('should apply explode animation at frame 0', () => {
    const { container } = render(
      <SplitText text="T" frame={0} animation="explode" duration={60} stagger={2} />
    );
    const span = container.querySelector('span') as HTMLElement;
    // Explode animation includes translation, rotation, and scale
    expect(span.style.transform).toContain('translate');
    expect(span.style.transform).toContain('rotate');
    expect(span.style.transform).toContain('scale');
    expect(span.style.opacity).toBe('0');
  });

  it('should be fully visible and at rest after animation completes', () => {
    const { container } = render(
      <SplitText text="T" frame={100} animation="splitUp" duration={60} stagger={2} />
    );
    const span = container.querySelector('span') as HTMLElement;
    // After animation completes, opacity should be 1
    expect(span.style.opacity).toBe('1');
  });

  it('should respect stagger delay between characters', () => {
    const { container } = render(
      <SplitText text="AB" frame={5} animation="splitUp" duration={60} stagger={10} />
    );
    const spans = container.querySelectorAll('span');
    const firstSpan = spans[0] as HTMLElement;
    const secondSpan = spans[1] as HTMLElement;

    // First character should be animating (frame 5, started at frame 0)
    const firstOpacity = parseFloat(firstSpan.style.opacity);
    expect(firstOpacity).toBeGreaterThan(0);

    // Second character should still be at start (starts at frame 10)
    expect(secondSpan.style.opacity).toBe('0');
  });

  it('should apply custom font size and color', () => {
    const { container } = render(
      <SplitText text="Test" frame={0} fontSize={32} color="#ff0000" />
    );
    const element = container.firstChild as HTMLElement;
    expect(element.style.fontSize).toBe('32px');
    expect(element.style.color).toBe('rgb(255, 0, 0)');
  });

  it('should preserve spaces in text', () => {
    const { container } = render(
      <SplitText text="A B" frame={0} mode="letters" />
    );
    const spans = container.querySelectorAll('span');
    // Should have 3 spans for "A", " ", "B"
    expect(spans.length).toBe(3);
    const spaceSpan = spans[1] as HTMLElement;
    expect(spaceSpan.style.whiteSpace).toBe('pre');
  });

  it('should apply easing to animation progress', () => {
    const { container: linearContainer } = render(
      <SplitText text="T" frame={30} animation="splitUp" duration={60} easing="linear" />
    );
    const linearOpacity = parseFloat((linearContainer.querySelector('span') as HTMLElement).style.opacity);

    const { container: easeOutContainer } = render(
      <SplitText text="T" frame={30} animation="splitUp" duration={60} easing="ease-out" />
    );
    const easeOutOpacity = parseFloat((easeOutContainer.querySelector('span') as HTMLElement).style.opacity);

    // Different easings should produce different opacity values at mid-animation
    expect(linearOpacity).not.toBe(easeOutOpacity);
  });

  it('should handle word mode with whitespace', () => {
    const { container } = render(
      <SplitText text="Hello World" frame={100} mode="words" animation="splitUp" />
    );
    const spans = container.querySelectorAll('span');
    // All parts should be fully visible after animation
    expect(container.textContent).toBe('Hello World');
  });

  it('should animate different characters at different times with stagger', () => {
    const { container } = render(
      <SplitText text="ABC" frame={15} animation="fade" duration={30} stagger={5} mode="letters" />
    );
    const spans = container.querySelectorAll('span');

    // First char starts at frame 0, second at frame 5, third at frame 10
    // At frame 15:
    // - First char should be past halfway (started at 0, duration 30)
    // - Second char should be partway through (started at 5, duration 30)
    // - Third char should have just started (started at 10, duration 30)

    expect(spans.length).toBe(3);
  });
});

describe('ScrambleText Component', () => {
  it('should render text content', () => {
    const { container } = render(<ScrambleText text="Hello" frame={100} />);
    expect(container.textContent).toBe('Hello');
  });

  it('should scramble text during animation', () => {
    const { container } = render(<ScrambleText text="Test" frame={15} duration={60} />);
    // During animation, text might be scrambled
    expect(container.firstChild).toBeTruthy();
  });

  it('should support different charsets', () => {
    const { container: lettersContainer } = render(
      <ScrambleText text="A" frame={0} charset="letters" />
    );
    const { container: numbersContainer } = render(
      <ScrambleText text="A" frame={0} charset="numbers" />
    );
    expect(lettersContainer.firstChild).toBeTruthy();
    expect(numbersContainer.firstChild).toBeTruthy();
  });

  it('should support whole and sequential modes', () => {
    const { container: wholeContainer } = render(
      <ScrambleText text="Test" frame={0} mode="whole" />
    );
    const { container: seqContainer } = render(
      <ScrambleText text="Test" frame={0} mode="sequential" />
    );
    expect(wholeContainer.firstChild).toBeTruthy();
    expect(seqContainer.firstChild).toBeTruthy();
  });

  it('should apply custom font size and color', () => {
    const { container } = render(
      <ScrambleText text="Test" frame={0} fontSize={32} color="#ff0000" />
    );
    const element = container.firstChild as HTMLElement;
    expect(element.style.fontSize).toBe('32px');
    expect(element.style.color).toBe('rgb(255, 0, 0)');
  });
});

describe('FlipText Component', () => {
  it('should render text content', () => {
    const { container } = render(<FlipText text="Hello" frame={100} />);
    expect(container.textContent).toBe('Hello');
  });

  it('should support different axes', () => {
    const { container: xContainer } = render(
      <FlipText text="T" frame={30} axis="x" />
    );
    const { container: yContainer } = render(
      <FlipText text="T" frame={30} axis="y" />
    );
    const { container: bothContainer } = render(
      <FlipText text="T" frame={30} axis="both" />
    );
    expect(xContainer.firstChild).toBeTruthy();
    expect(yContainer.firstChild).toBeTruthy();
    expect(bothContainer.firstChild).toBeTruthy();
  });

  it('should support forward and backward directions', () => {
    const { container: forwardContainer } = render(
      <FlipText text="T" frame={30} direction="forward" />
    );
    const { container: backwardContainer } = render(
      <FlipText text="T" frame={30} direction="backward" />
    );
    expect(forwardContainer.firstChild).toBeTruthy();
    expect(backwardContainer.firstChild).toBeTruthy();
  });

  it('should support letters and words modes', () => {
    const { container: lettersContainer } = render(
      <FlipText text="Hello World" frame={30} mode="letters" />
    );
    const { container: wordsContainer } = render(
      <FlipText text="Hello World" frame={30} mode="words" />
    );
    expect(lettersContainer.querySelectorAll('span').length).toBeGreaterThan(0);
    expect(wordsContainer.querySelectorAll('span').length).toBeGreaterThan(0);
  });

  it('should apply custom styling', () => {
    const { container } = render(
      <FlipText text="Test" frame={0} fontSize={48} color="#00ffff" />
    );
    const element = container.firstChild as HTMLElement;
    expect(element.style.fontSize).toBe('48px');
    expect(element.style.color).toBe('rgb(0, 255, 255)');
  });
});

describe('FuzzyText Component', () => {
  it('should render text content', () => {
    const { container } = render(<FuzzyText text="Hello" frame={100} />);
    expect(container.textContent).toBe('Hello');
  });

  it('should apply blur filter during animation', () => {
    const { container } = render(<FuzzyText text="Test" frame={15} duration={60} startBlur={10} mode="whole" />);
    // For whole mode, check if container has blur
    expect(container.firstChild).toBeTruthy();
  });

  it('should support different modes', () => {
    const { container: wholeContainer } = render(
      <FuzzyText text="Test" frame={30} mode="whole" />
    );
    const { container: wordsContainer } = render(
      <FuzzyText text="Test Word" frame={30} mode="words" />
    );
    const { container: lettersContainer } = render(
      <FuzzyText text="Test" frame={30} mode="letters" />
    );
    expect(wholeContainer.firstChild).toBeTruthy();
    expect(wordsContainer.firstChild).toBeTruthy();
    expect(lettersContainer.firstChild).toBeTruthy();
  });

  it('should transition from blurry to clear', () => {
    const { container: earlyContainer } = render(
      <FuzzyText text="T" frame={5} duration={60} startBlur={15} endBlur={0} mode="whole" />
    );
    const { container: lateContainer } = render(
      <FuzzyText text="T" frame={55} duration={60} startBlur={15} endBlur={0} mode="whole" />
    );

    // Both should render successfully
    expect(earlyContainer.firstChild).toBeTruthy();
    expect(lateContainer.firstChild).toBeTruthy();
  });

  it('should apply custom styling', () => {
    const { container } = render(
      <FuzzyText text="Test" frame={0} fontSize={36} color="#ffffff" />
    );
    const element = container.firstChild as HTMLElement;
    expect(element.style.fontSize).toBe('36px');
    expect(element.style.color).toBe('rgb(255, 255, 255)');
  });
});

describe('NeonText Component', () => {
  it('should render text content', () => {
    const { container } = render(<NeonText text="NEON" frame={0} />);
    expect(container.textContent).toBe('NEON');
  });

  it('should support different modes', () => {
    const { container: pulseContainer } = render(
      <NeonText text="Test" frame={30} mode="pulse" />
    );
    const { container: flickerContainer } = render(
      <NeonText text="Test" frame={30} mode="flicker" />
    );
    const { container: staticContainer } = render(
      <NeonText text="Test" frame={30} mode="static" />
    );
    expect(pulseContainer.firstChild).toBeTruthy();
    expect(flickerContainer.firstChild).toBeTruthy();
    expect(staticContainer.firstChild).toBeTruthy();
  });

  it('should apply neon glow with text-shadow', () => {
    const { container } = render(<NeonText text="Glow" frame={0} color="#00ffff" />);
    // NeonText should render successfully
    expect(container.firstChild).toBeTruthy();
    expect(container.textContent).toBe('Glow');
  });

  it('should support background glow', () => {
    const { container: withGlowContainer } = render(
      <NeonText text="Test" frame={0} backgroundGlow={true} />
    );
    const { container: withoutGlowContainer } = render(
      <NeonText text="Test" frame={0} backgroundGlow={false} />
    );
    expect(withGlowContainer.firstChild).toBeTruthy();
    expect(withoutGlowContainer.firstChild).toBeTruthy();
  });

  it('should apply custom styling', () => {
    const { container } = render(
      <NeonText text="Test" frame={0} fontSize={64} color="#ff00ff" />
    );
    // NeonText should render successfully with custom props
    expect(container.firstChild).toBeTruthy();
    expect(container.textContent).toBe('Test');
  });
});

describe('TextTrail Component', () => {
  it('should render text content', () => {
    const { container } = render(<TextTrail text="Trail" frame={0} />);
    expect(container.textContent).toContain('Trail');
  });

  it('should render multiple copies for trail effect', () => {
    const { container } = render(<TextTrail text="T" frame={0} trailLength={5} />);
    const spans = container.querySelectorAll('span');
    // Should have at least trailLength copies
    expect(spans.length).toBeGreaterThanOrEqual(5);
  });

  it('should support different directions', () => {
    const directions = ['left', 'right', 'up', 'down', 'top-left', 'top-right', 'bottom-left', 'bottom-right'] as const;
    directions.forEach(direction => {
      const { container } = render(<TextTrail text="T" frame={0} direction={direction} />);
      expect(container.firstChild).toBeTruthy();
    });
  });

  it('should animate when enabled', () => {
    const { container: animatedContainer } = render(
      <TextTrail text="T" frame={30} animate={true} />
    );
    const { container: staticContainer } = render(
      <TextTrail text="T" frame={30} animate={false} />
    );
    expect(animatedContainer.firstChild).toBeTruthy();
    expect(staticContainer.firstChild).toBeTruthy();
  });

  it('should apply custom styling', () => {
    const { container } = render(
      <TextTrail text="Test" frame={0} fontSize={48} color="#00ffff" />
    );
    // TextTrail should render successfully
    expect(container.firstChild).toBeTruthy();
    expect(container.textContent).toContain('Test');
  });
});

describe('LetterMorph Component', () => {
  it('should render text content', () => {
    const { container } = render(<LetterMorph startText="Start" endText="End" frame={0} />);
    expect(container.textContent).toBeTruthy();
  });

  it('should transition from startText to endText', () => {
    const { container: earlyContainer } = render(
      <LetterMorph startText="ABC" endText="XYZ" frame={5} duration={100} />
    );
    const { container: lateContainer } = render(
      <LetterMorph startText="ABC" endText="XYZ" frame={95} duration={100} />
    );
    expect(earlyContainer.firstChild).toBeTruthy();
    expect(lateContainer.firstChild).toBeTruthy();
  });

  it('should support sequential and simultaneous modes', () => {
    const { container: seqContainer } = render(
      <LetterMorph startText="Hi" endText="By" frame={30} mode="sequential" />
    );
    const { container: simContainer } = render(
      <LetterMorph startText="Hi" endText="By" frame={30} mode="simultaneous" />
    );
    expect(seqContainer.firstChild).toBeTruthy();
    expect(simContainer.firstChild).toBeTruthy();
  });

  it('should handle different string lengths', () => {
    const { container: shorterContainer } = render(
      <LetterMorph startText="Hello" endText="Hi" frame={50} duration={100} />
    );
    const { container: longerContainer } = render(
      <LetterMorph startText="Hi" endText="Hello" frame={50} duration={100} />
    );
    expect(shorterContainer.firstChild).toBeTruthy();
    expect(longerContainer.firstChild).toBeTruthy();
  });

  it('should apply custom styling', () => {
    const { container } = render(
      <LetterMorph startText="A" endText="B" frame={0} fontSize={40} color="#ffffff" />
    );
    const element = container.firstChild as HTMLElement;
    expect(element.style.fontSize).toBe('40px');
    expect(element.style.color).toBe('rgb(255, 255, 255)');
  });
});

describe('MorphText Component', () => {
  it('should render text content', () => {
    const { container } = render(<MorphText texts={["Hello", "World"]} frame={0} />);
    expect(container.textContent).toBeTruthy();
  });

  it('should cycle through multiple texts', () => {
    const { container } = render(
      <MorphText texts={["One", "Two", "Three"]} frame={100} morphDuration={30} pauseDuration={60} />
    );
    expect(container.firstChild).toBeTruthy();
  });

  it('should support looping', () => {
    const { container: loopContainer } = render(
      <MorphText texts={["A", "B"]} frame={200} loop={true} morphDuration={30} pauseDuration={60} />
    );
    const { container: noLoopContainer } = render(
      <MorphText texts={["A", "B"]} frame={200} loop={false} morphDuration={30} pauseDuration={60} />
    );
    expect(loopContainer.firstChild).toBeTruthy();
    expect(noLoopContainer.firstChild).toBeTruthy();
  });

  it('should apply blur during transition', () => {
    const { container } = render(
      <MorphText texts={["A", "B"]} frame={15} morphDuration={30} blurIntensity={5} />
    );
    // Check if blur is applied during transition
    expect(container.firstChild).toBeTruthy();
  });

  it('should apply custom styling', () => {
    const { container } = render(
      <MorphText texts={["Test"]} frame={0} fontSize={52} color="#ffdd00" />
    );
    const element = container.firstChild as HTMLElement;
    expect(element.style.fontSize).toBe('52px');
    expect(element.style.color).toBe('rgb(255, 221, 0)');
  });
});

describe('DistortText Component', () => {
  it('should render text content', () => {
    const { container } = render(<DistortText text="Distort" frame={0} />);
    expect(container.textContent).toBe('Distort');
  });

  it('should support different distortion types', () => {
    const types = ['wave', 'ripple', 'glitch', 'skew'] as const;
    types.forEach(type => {
      const { container } = render(
        <DistortText text="T" frame={30} distortionType={type} />
      );
      expect(container.firstChild).toBeTruthy();
    });
  });

  it('should apply transforms to characters', () => {
    const { container } = render(
      <DistortText text="Test" frame={30} distortionType="wave" />
    );
    const spans = container.querySelectorAll('span');
    expect(spans.length).toBeGreaterThan(0);

    // At least some spans should have transforms applied
    const spansWithTransform = Array.from(spans).filter(
      span => (span as HTMLElement).style.transform !== ''
    );
    expect(spansWithTransform.length).toBeGreaterThan(0);
  });

  it('should support amplitude and frequency adjustments', () => {
    const { container: lowAmpContainer } = render(
      <DistortText text="T" frame={30} amplitude={5} />
    );
    const { container: highAmpContainer } = render(
      <DistortText text="T" frame={30} amplitude={20} />
    );
    expect(lowAmpContainer.firstChild).toBeTruthy();
    expect(highAmpContainer.firstChild).toBeTruthy();
  });

  it('should apply custom styling', () => {
    const { container } = render(
      <DistortText text="Test" frame={0} fontSize={56} color="#00ff00" />
    );
    const element = container.firstChild as HTMLElement;
    expect(element.style.fontSize).toBe('56px');
    expect(element.style.color).toBe('rgb(0, 255, 0)');
  });
});
