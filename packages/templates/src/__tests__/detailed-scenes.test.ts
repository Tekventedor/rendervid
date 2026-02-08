/**
 * Detailed Scene Template Tests
 *
 * In-depth tests for each individual scene template covering:
 * - Input handling and defaults
 * - Layer generation for various configurations
 * - Aspect ratio adaptations
 * - Style variants
 * - Animation generation
 * - Theme integration
 */

import { describe, it, expect } from 'vitest';
import {
  TitleReveal,
  LogoReveal,
  ModernLowerThird,
  SocialPromo,
  AnimatedStats,
  TestimonialQuote,
  CallToAction,
  CountdownTimer,
  ProductShowcase,
  KineticText,
  WipeTransition,
} from '../scenes';
import { modernTheme, boldTheme, elegantTheme, techTheme } from '../themes';
import type { SceneGenerateOptions } from '../scenes';

const baseOptions: SceneGenerateOptions = {
  aspectRatio: '16:9',
  theme: modernTheme,
  fps: 30,
  duration: 5,
};

const verticalOptions: SceneGenerateOptions = {
  ...baseOptions,
  aspectRatio: '9:16',
};

const squareOptions: SceneGenerateOptions = {
  ...baseOptions,
  aspectRatio: '1:1',
};

function getLayerById(result: any, id: string) {
  return result.composition.scenes[0].layers.find((l: any) => l.id === id);
}

function getLayersByPrefix(result: any, prefix: string) {
  return result.composition.scenes[0].layers.filter((l: any) => l.id.startsWith(prefix));
}

describe('CountdownTimer - Detailed', () => {
  it('should render neon style with special background', () => {
    const result = CountdownTimer.generate(
      { ...CountdownTimer.defaults, style: 'neon' } as any,
      baseOptions
    );

    const bg = getLayerById(result, 'background');
    expect(bg).toBeDefined();
    expect(bg.props.fill).toBe('#0a0a0a');

    const glow = getLayerById(result, 'glow');
    expect(glow).toBeDefined();
    expect(glow.opacity).toBe(0.3);
  });

  it('should render headline when provided', () => {
    const result = CountdownTimer.generate(
      { ...CountdownTimer.defaults, headline: 'Launch Day' } as any,
      baseOptions
    );

    const headline = getLayerById(result, 'headline');
    expect(headline).toBeDefined();
    expect(headline.props.text).toBe('Launch Day');
  });

  it('should omit headline layer when headline is empty', () => {
    const result = CountdownTimer.generate(
      { ...CountdownTimer.defaults, headline: '' } as any,
      baseOptions
    );

    const headline = getLayerById(result, 'headline');
    expect(headline).toBeUndefined();
  });

  it('should render event name', () => {
    const result = CountdownTimer.generate(
      { ...CountdownTimer.defaults, eventName: 'Big Event' } as any,
      baseOptions
    );

    const eventName = getLayerById(result, 'event-name');
    expect(eventName).toBeDefined();
    expect(eventName.props.text).toBe('Big Event');
  });

  it('should not render event name when empty', () => {
    const result = CountdownTimer.generate(
      { ...CountdownTimer.defaults, eventName: '' } as any,
      baseOptions
    );

    const eventName = getLayerById(result, 'event-name');
    expect(eventName).toBeUndefined();
  });

  it('should render digit boxes for digital style', () => {
    const result = CountdownTimer.generate(
      { ...CountdownTimer.defaults, style: 'digital' } as any,
      baseOptions
    );

    const digitBgs = getLayersByPrefix(result, 'digit-bg-');
    expect(digitBgs.length).toBeGreaterThan(0);
  });

  it('should render labels when showLabels is true', () => {
    const result = CountdownTimer.generate(
      { ...CountdownTimer.defaults, showLabels: true } as any,
      baseOptions
    );

    const labels = getLayersByPrefix(result, 'label-');
    expect(labels.length).toBeGreaterThan(0);
  });

  it('should omit labels when showLabels is false', () => {
    const result = CountdownTimer.generate(
      { ...CountdownTimer.defaults, showLabels: false } as any,
      baseOptions
    );

    const labels = getLayersByPrefix(result, 'label-');
    expect(labels.length).toBe(0);
  });

  it('should render colons between digit groups', () => {
    const result = CountdownTimer.generate(
      CountdownTimer.defaults as any,
      baseOptions
    );

    const colons = getLayersByPrefix(result, 'colon-');
    expect(colons.length).toBe(3);
  });

  it('should use custom colors from inputs', () => {
    const result = CountdownTimer.generate(
      { ...CountdownTimer.defaults, primaryColor: '#FF0000', backgroundColor: '#000000' } as any,
      baseOptions
    );

    const bg = getLayerById(result, 'background');
    expect(bg.props.fill).toBe('#000000');
  });

  it('should adjust font sizes for vertical aspect ratio', () => {
    const result = CountdownTimer.generate(
      CountdownTimer.defaults as any,
      verticalOptions
    );

    const headline = getLayerById(result, 'headline');
    expect(headline).toBeDefined();
    expect(headline.props.fontSize).toBe(36); // vs 48 for horizontal
  });

  it('should support all style variants', () => {
    const styles = ['digital', 'flip', 'minimal', 'neon'] as const;
    styles.forEach((style) => {
      const result = CountdownTimer.generate(
        { ...CountdownTimer.defaults, style } as any,
        baseOptions
      );
      expect(result).toBeDefined();
      expect(result.composition.scenes[0].layers.length).toBeGreaterThan(0);
    });
  });
});

describe('CallToAction - Detailed', () => {
  it('should render gradient background for gradient style', () => {
    const result = CallToAction.generate(
      { ...CallToAction.defaults, style: 'gradient' } as any,
      baseOptions
    );

    const bg = getLayerById(result, 'background');
    expect(bg.props.gradient).toBeDefined();
    expect(bg.props.gradient.type).toBe('linear');
  });

  it('should render accent bars for bold style', () => {
    const result = CallToAction.generate(
      { ...CallToAction.defaults, style: 'bold' } as any,
      baseOptions
    );

    const topBar = getLayerById(result, 'accent-bar-top');
    const bottomBar = getLayerById(result, 'accent-bar-bottom');
    expect(topBar).toBeDefined();
    expect(bottomBar).toBeDefined();
  });

  it('should not render accent bars for minimal style', () => {
    const result = CallToAction.generate(
      { ...CallToAction.defaults, style: 'minimal' } as any,
      baseOptions
    );

    const topBar = getLayerById(result, 'accent-bar-top');
    expect(topBar).toBeUndefined();
  });

  it('should render urgency badge when urgencyText is provided', () => {
    const result = CallToAction.generate(
      { ...CallToAction.defaults, urgencyText: 'Limited Time!' } as any,
      baseOptions
    );

    const badge = getLayerById(result, 'urgency-badge');
    const text = getLayerById(result, 'urgency-text');
    expect(badge).toBeDefined();
    expect(text).toBeDefined();
    expect(text.props.text).toBe('LIMITED TIME!');
  });

  it('should not render urgency badge when urgencyText is empty', () => {
    const result = CallToAction.generate(
      { ...CallToAction.defaults, urgencyText: '' } as any,
      baseOptions
    );

    const badge = getLayerById(result, 'urgency-badge');
    expect(badge).toBeUndefined();
  });

  it('should render subheadline when provided', () => {
    const result = CallToAction.generate(
      { ...CallToAction.defaults, subheadline: 'Great opportunity' } as any,
      baseOptions
    );

    const sub = getLayerById(result, 'subheadline');
    expect(sub).toBeDefined();
    expect(sub.props.text).toBe('Great opportunity');
  });

  it('should omit subheadline when not provided', () => {
    const result = CallToAction.generate(
      { ...CallToAction.defaults, subheadline: '' } as any,
      baseOptions
    );

    const sub = getLayerById(result, 'subheadline');
    expect(sub).toBeUndefined();
  });

  it('should render CTA button with text and arrow', () => {
    const result = CallToAction.generate(
      { ...CallToAction.defaults, ctaText: 'Buy Now' } as any,
      baseOptions
    );

    const ctaBg = getLayerById(result, 'cta-bg');
    const ctaText = getLayerById(result, 'cta-text');
    const ctaArrow = getLayerById(result, 'cta-arrow');
    expect(ctaBg).toBeDefined();
    expect(ctaText).toBeDefined();
    expect(ctaText.props.text).toBe('Buy Now');
    expect(ctaArrow).toBeDefined();
  });

  it('should have pulse animation on CTA button', () => {
    const result = CallToAction.generate(
      CallToAction.defaults as any,
      baseOptions
    );

    const ctaBg = getLayerById(result, 'cta-bg');
    const pulseAnim = ctaBg.animations.find((a: any) => a.effect === 'pulse');
    expect(pulseAnim).toBeDefined();
    expect(pulseAnim.type).toBe('emphasis');
  });

  it('should use white text on gradient style CTA', () => {
    const result = CallToAction.generate(
      { ...CallToAction.defaults, style: 'gradient' } as any,
      baseOptions
    );

    const headline = getLayerById(result, 'headline');
    expect(headline.props.color).toBe('#FFFFFF');
  });
});

describe('LogoReveal - Detailed', () => {
  it('should render logo image when logoUrl is provided', () => {
    const result = LogoReveal.generate(
      { ...LogoReveal.defaults, logoUrl: 'https://example.com/logo.png' } as any,
      baseOptions
    );

    const logo = getLayerById(result, 'logo');
    expect(logo).toBeDefined();
    expect(logo.type).toBe('image');
    expect(logo.props.src).toBe('https://example.com/logo.png');
  });

  it('should not render logo image when logoUrl is empty', () => {
    const result = LogoReveal.generate(
      { ...LogoReveal.defaults, logoUrl: '' } as any,
      baseOptions
    );

    const logo = getLayerById(result, 'logo');
    expect(logo).toBeUndefined();
  });

  it('should render brand name when provided', () => {
    const result = LogoReveal.generate(
      { ...LogoReveal.defaults, brandName: 'Acme Corp', logoUrl: 'test.png' } as any,
      baseOptions
    );

    const brandName = getLayerById(result, 'brand-name');
    expect(brandName).toBeDefined();
    expect(brandName.props.text).toBe('Acme Corp');
  });

  it('should render tagline when provided', () => {
    const result = LogoReveal.generate(
      { ...LogoReveal.defaults, tagline: 'Innovation first', logoUrl: 'test.png' } as any,
      baseOptions
    );

    const tagline = getLayerById(result, 'tagline');
    expect(tagline).toBeDefined();
    expect(tagline.props.text).toBe('Innovation first');
  });

  it('should not render glow for minimal style', () => {
    const result = LogoReveal.generate(
      { ...LogoReveal.defaults, style: 'minimal', logoUrl: 'test.png' } as any,
      baseOptions
    );

    const glow = getLayerById(result, 'glow');
    expect(glow).toBeUndefined();
  });

  it('should render glow for non-minimal styles', () => {
    const styles = ['particles', 'glitch', 'zoom'] as const;
    styles.forEach((style) => {
      const result = LogoReveal.generate(
        { ...LogoReveal.defaults, style, logoUrl: 'test.png' } as any,
        baseOptions
      );
      const glow = getLayerById(result, 'glow');
      expect(glow).toBeDefined();
    });
  });

  it('should use zoom animation for zoom style', () => {
    const result = LogoReveal.generate(
      { ...LogoReveal.defaults, style: 'zoom', logoUrl: 'test.png' } as any,
      baseOptions
    );

    const logo = getLayerById(result, 'logo');
    expect(logo.animations[0].effect).toBe('zoomIn');
  });

  it('should use shake animation for glitch style', () => {
    const result = LogoReveal.generate(
      { ...LogoReveal.defaults, style: 'glitch', logoUrl: 'test.png' } as any,
      baseOptions
    );

    const logo = getLayerById(result, 'logo');
    const shakeAnim = logo.animations.find((a: any) => a.effect === 'shake');
    expect(shakeAnim).toBeDefined();
  });

  it('should use elastic easing for particles style', () => {
    const result = LogoReveal.generate(
      { ...LogoReveal.defaults, style: 'particles', logoUrl: 'test.png' } as any,
      baseOptions
    );

    const logo = getLayerById(result, 'logo');
    expect(logo.animations[0].easing).toBe('easeOutElastic');
  });
});

describe('TitleReveal - Detailed', () => {
  it('should render headline with theme heading family', () => {
    const result = TitleReveal.generate(
      { headline: 'My Title', subtitle: 'Sub' },
      baseOptions
    );

    const headline = getLayerById(result, 'headline');
    expect(headline.props.fontFamily).toBe(modernTheme.typography.headingFamily);
  });

  it('should render accent line', () => {
    const result = TitleReveal.generate(
      { headline: 'Title' },
      baseOptions
    );

    const accentLine = getLayerById(result, 'accent-line');
    expect(accentLine).toBeDefined();
    expect(accentLine.type).toBe('shape');
  });

  it('should render subtitle when provided', () => {
    const result = TitleReveal.generate(
      { headline: 'Title', subtitle: 'Supporting text' },
      baseOptions
    );

    const subtitle = getLayerById(result, 'subtitle');
    expect(subtitle).toBeDefined();
    expect(subtitle.props.text).toBe('Supporting text');
  });

  it('should omit subtitle when not provided', () => {
    const result = TitleReveal.generate(
      { headline: 'Title' },
      baseOptions
    );

    const subtitle = getLayerById(result, 'subtitle');
    expect(subtitle).toBeUndefined();
  });

  it('should render tagline at bottom when provided', () => {
    const result = TitleReveal.generate(
      { headline: 'Title', tagline: 'Tagline here' },
      baseOptions
    );

    const tagline = getLayerById(result, 'tagline');
    expect(tagline).toBeDefined();
    expect(tagline.props.text).toBe('Tagline here');
  });

  it('should use custom accent color from primaryColor input', () => {
    const result = TitleReveal.generate(
      { headline: 'Title', primaryColor: '#FF6600' } as any,
      baseOptions
    );

    const accentLine = getLayerById(result, 'accent-line');
    expect(accentLine.props.fill).toBe('#FF6600');
  });

  it('should use smaller fonts for vertical aspect ratio', () => {
    const result16 = TitleReveal.generate(
      { headline: 'Title' },
      baseOptions
    );
    const result916 = TitleReveal.generate(
      { headline: 'Title' },
      verticalOptions
    );

    const headline16 = getLayerById(result16, 'headline');
    const headline916 = getLayerById(result916, 'headline');
    expect(headline916.props.fontSize).toBeLessThan(headline16.props.fontSize);
  });

  it('should have entrance animations on all text layers', () => {
    const result = TitleReveal.generate(
      { headline: 'Title', subtitle: 'Sub', tagline: 'Tag' },
      baseOptions
    );

    const headline = getLayerById(result, 'headline');
    const subtitle = getLayerById(result, 'subtitle');
    const tagline = getLayerById(result, 'tagline');

    expect(headline.animations.length).toBeGreaterThan(0);
    expect(subtitle.animations.length).toBeGreaterThan(0);
    expect(tagline.animations.length).toBeGreaterThan(0);
  });
});

describe('ModernLowerThird - Detailed', () => {
  it('should position panel on the left by default', () => {
    const result = ModernLowerThird.generate(
      { name: 'John', title: 'CEO', position: 'left' },
      baseOptions
    );

    const panel = getLayerById(result, 'panel-bg');
    expect(panel).toBeDefined();
    expect(panel.position.x).toBe(60);
  });

  it('should position panel on the right when specified', () => {
    const result = ModernLowerThird.generate(
      { name: 'John', title: 'CEO', position: 'right' },
      baseOptions
    );

    const panel = getLayerById(result, 'panel-bg');
    expect(panel).toBeDefined();
    expect(panel.position.x).toBeGreaterThan(60);
  });

  it('should combine title and company name', () => {
    const result = ModernLowerThird.generate(
      { name: 'John', title: 'CEO', company: 'Acme Corp' },
      baseOptions
    );

    const title = getLayerById(result, 'title');
    expect(title.props.text).toContain('CEO');
    expect(title.props.text).toContain('Acme Corp');
  });

  it('should show only title when no company provided', () => {
    const result = ModernLowerThird.generate(
      { name: 'John', title: 'CEO', company: '' },
      baseOptions
    );

    const title = getLayerById(result, 'title');
    expect(title.props.text).toBe('CEO');
  });

  it('should use slide direction matching position', () => {
    const leftResult = ModernLowerThird.generate(
      { name: 'John', title: 'CEO', position: 'left' },
      baseOptions
    );
    const rightResult = ModernLowerThird.generate(
      { name: 'John', title: 'CEO', position: 'right' },
      baseOptions
    );

    const leftPanel = getLayerById(leftResult, 'panel-bg');
    const rightPanel = getLayerById(rightResult, 'panel-bg');

    expect(leftPanel.animations[0].effect).toBe('slideInLeft');
    expect(rightPanel.animations[0].effect).toBe('slideInRight');
  });

  it('should have exit animations', () => {
    const result = ModernLowerThird.generate(
      { name: 'John', title: 'CEO' },
      baseOptions
    );

    const panel = getLayerById(result, 'panel-bg');
    const exitAnim = panel.animations.find((a: any) => a.type === 'exit');
    expect(exitAnim).toBeDefined();
  });

  it('should render accent line', () => {
    const result = ModernLowerThird.generate(
      { name: 'John', title: 'CEO' },
      baseOptions
    );

    const accentLine = getLayerById(result, 'accent-line');
    expect(accentLine).toBeDefined();
    expect(accentLine.type).toBe('shape');
  });

  it('should use right text alignment for right position', () => {
    const result = ModernLowerThird.generate(
      { name: 'John', title: 'CEO', position: 'right' },
      baseOptions
    );

    const nameLayer = getLayerById(result, 'name');
    expect(nameLayer.props.textAlign).toBe('right');
  });
});

describe('SocialPromo - Detailed', () => {
  it('should create gradient background', () => {
    const result = SocialPromo.generate(
      SocialPromo.defaults as any,
      baseOptions
    );

    const bg = getLayerById(result, 'background');
    expect(bg.props.gradient).toBeDefined();
  });

  it('should render decorative circles', () => {
    const result = SocialPromo.generate(
      SocialPromo.defaults as any,
      baseOptions
    );

    const circles = getLayersByPrefix(result, 'deco-circle-');
    expect(circles.length).toBe(2);
  });

  it('should render discount badge and text when discount is provided', () => {
    const result = SocialPromo.generate(
      { ...SocialPromo.defaults, discount: '30% OFF' } as any,
      baseOptions
    );

    const badge = getLayerById(result, 'discount-badge');
    const text = getLayerById(result, 'discount-text');
    expect(badge).toBeDefined();
    expect(badge.props.shape).toBe('ellipse');
    expect(text).toBeDefined();
    expect(text.props.text).toBe('30% OFF');
  });

  it('should not render discount when empty', () => {
    const result = SocialPromo.generate(
      { ...SocialPromo.defaults, discount: '' } as any,
      baseOptions
    );

    const badge = getLayerById(result, 'discount-badge');
    expect(badge).toBeUndefined();
  });

  it('should render product image when provided', () => {
    const result = SocialPromo.generate(
      { ...SocialPromo.defaults, productImageUrl: 'product.jpg' } as any,
      baseOptions
    );

    const img = getLayerById(result, 'product-image');
    expect(img).toBeDefined();
    expect(img.type).toBe('image');
    expect(img.props.src).toBe('product.jpg');
  });

  it('should render CTA button', () => {
    const result = SocialPromo.generate(
      { ...SocialPromo.defaults, ctaText: 'Buy Now' } as any,
      baseOptions
    );

    const ctaBg = getLayerById(result, 'cta-bg');
    const ctaText = getLayerById(result, 'cta-text');
    expect(ctaBg).toBeDefined();
    expect(ctaText).toBeDefined();
    expect(ctaText.props.text).toBe('Buy Now');
  });

  it('should use bold theme colors by default', () => {
    const boldOptions = { ...baseOptions, theme: boldTheme };
    const result = SocialPromo.generate(
      SocialPromo.defaults as any,
      boldOptions
    );

    const headline = getLayerById(result, 'headline');
    expect(headline.props.color).toBe(boldTheme.colors.text);
  });
});

describe('AnimatedStats - Detailed', () => {
  const stats = [
    { value: 1000, label: 'Users', suffix: '+' },
    { value: 50, label: 'Countries' },
    { value: 99.9, label: 'Uptime', suffix: '%', decimals: 1 },
  ];

  it('should render stat values and labels', () => {
    const result = AnimatedStats.generate(
      { ...AnimatedStats.defaults, stats } as any,
      baseOptions
    );

    stats.forEach((stat, i) => {
      const valueLayer = getLayerById(result, `stat-value-${i}`);
      const labelLayer = getLayerById(result, `stat-label-${i}`);
      expect(valueLayer).toBeDefined();
      expect(labelLayer).toBeDefined();
      expect(labelLayer.props.text).toBe(stat.label);
    });
  });

  it('should format stat values with prefix and suffix', () => {
    const result = AnimatedStats.generate(
      { ...AnimatedStats.defaults, stats: [{ value: 100, label: 'Test', prefix: '$', suffix: 'M' }] } as any,
      baseOptions
    );

    const valueLayer = getLayerById(result, 'stat-value-0');
    expect(valueLayer.props.text).toContain('$');
    expect(valueLayer.props.text).toContain('M');
  });

  it('should render dividers in row layout', () => {
    const result = AnimatedStats.generate(
      { ...AnimatedStats.defaults, stats, layout: 'row' } as any,
      baseOptions
    );

    const dividers = getLayersByPrefix(result, 'divider-');
    expect(dividers.length).toBe(stats.length - 1);
  });

  it('should not render dividers in column layout', () => {
    const result = AnimatedStats.generate(
      { ...AnimatedStats.defaults, stats, layout: 'column' } as any,
      baseOptions
    );

    const dividers = getLayersByPrefix(result, 'divider-');
    expect(dividers.length).toBe(0);
  });

  it('should not render dividers in grid layout', () => {
    const result = AnimatedStats.generate(
      { ...AnimatedStats.defaults, stats, layout: 'grid' } as any,
      baseOptions
    );

    const dividers = getLayersByPrefix(result, 'divider-');
    expect(dividers.length).toBe(0);
  });

  it('should stagger animations for each stat', () => {
    const result = AnimatedStats.generate(
      { ...AnimatedStats.defaults, stats } as any,
      baseOptions
    );

    const delays: number[] = [];
    stats.forEach((_, i) => {
      const valueLayer = getLayerById(result, `stat-value-${i}`);
      delays.push(valueLayer.animations[0].delay);
    });

    // Each subsequent stat should have a larger delay
    for (let i = 1; i < delays.length; i++) {
      expect(delays[i]).toBeGreaterThan(delays[i - 1]);
    }
  });

  it('should render headline when provided', () => {
    const result = AnimatedStats.generate(
      { ...AnimatedStats.defaults, headline: 'Our Numbers' } as any,
      baseOptions
    );

    const headline = getLayerById(result, 'headline');
    expect(headline).toBeDefined();
    expect(headline.props.text).toBe('Our Numbers');
  });

  it('should handle empty stats array', () => {
    const result = AnimatedStats.generate(
      { ...AnimatedStats.defaults, stats: [] } as any,
      baseOptions
    );

    expect(result).toBeDefined();
    expect(result.composition.scenes).toHaveLength(1);
  });
});

describe('TestimonialQuote - Detailed', () => {
  it('should render card background for card style', () => {
    const result = TestimonialQuote.generate(
      { ...TestimonialQuote.defaults, style: 'card' } as any,
      baseOptions
    );

    const card = getLayerById(result, 'card');
    expect(card).toBeDefined();
    expect(card.props.borderRadius).toBe(24);
  });

  it('should not render card for minimal style', () => {
    const result = TestimonialQuote.generate(
      { ...TestimonialQuote.defaults, style: 'minimal' } as any,
      baseOptions
    );

    const card = getLayerById(result, 'card');
    expect(card).toBeUndefined();
  });

  it('should render quote mark', () => {
    const result = TestimonialQuote.generate(
      TestimonialQuote.defaults as any,
      baseOptions
    );

    const quoteMark = getLayerById(result, 'quote-mark');
    expect(quoteMark).toBeDefined();
    expect(quoteMark.props.text).toBe('"');
  });

  it('should render quote text', () => {
    const result = TestimonialQuote.generate(
      { ...TestimonialQuote.defaults, quote: 'Amazing product!' } as any,
      baseOptions
    );

    const quoteText = getLayerById(result, 'quote-text');
    expect(quoteText).toBeDefined();
    expect(quoteText.props.text).toBe('Amazing product!');
  });

  it('should render exactly 5 stars for rating of 5', () => {
    const result = TestimonialQuote.generate(
      { ...TestimonialQuote.defaults, rating: 5 } as any,
      baseOptions
    );

    const stars = getLayersByPrefix(result, 'star-');
    expect(stars.length).toBe(5);
  });

  it('should render 5 stars with correct colors for partial rating', () => {
    const result = TestimonialQuote.generate(
      { ...TestimonialQuote.defaults, rating: 3 } as any,
      baseOptions
    );

    const stars = getLayersByPrefix(result, 'star-');
    expect(stars.length).toBe(5);

    // First 3 should be gold, last 2 should be muted
    const goldStars = stars.filter((s: any) => s.props.color === '#FFD700');
    expect(goldStars.length).toBe(3);
  });

  it('should not render stars when rating is 0', () => {
    const result = TestimonialQuote.generate(
      { ...TestimonialQuote.defaults, rating: 0 } as any,
      baseOptions
    );

    const stars = getLayersByPrefix(result, 'star-');
    expect(stars.length).toBe(0);
  });

  it('should render author name', () => {
    const result = TestimonialQuote.generate(
      { ...TestimonialQuote.defaults, authorName: 'Jane Smith' } as any,
      baseOptions
    );

    const authorName = getLayerById(result, 'author-name');
    expect(authorName).toBeDefined();
    expect(authorName.props.text).toBe('Jane Smith');
  });

  it('should render author title when provided', () => {
    const result = TestimonialQuote.generate(
      { ...TestimonialQuote.defaults, authorTitle: 'CTO' } as any,
      baseOptions
    );

    const authorTitle = getLayerById(result, 'author-title');
    expect(authorTitle).toBeDefined();
    expect(authorTitle.props.text).toBe('CTO');
  });

  it('should render author image when provided', () => {
    const result = TestimonialQuote.generate(
      { ...TestimonialQuote.defaults, authorImage: 'avatar.jpg' } as any,
      baseOptions
    );

    const authorImage = getLayerById(result, 'author-image');
    expect(authorImage).toBeDefined();
    expect(authorImage.type).toBe('image');
  });

  it('should use bold font weight for bold style quotes', () => {
    const result = TestimonialQuote.generate(
      { ...TestimonialQuote.defaults, style: 'bold' } as any,
      baseOptions
    );

    const quoteText = getLayerById(result, 'quote-text');
    expect(quoteText.props.fontWeight).toBe('600');
  });
});

describe('ProductShowcase - Detailed', () => {
  it('should render product image layer', () => {
    const result = ProductShowcase.generate(
      { ...ProductShowcase.defaults, productImage: 'product.png' } as any,
      baseOptions
    );

    const img = getLayerById(result, 'product-image');
    expect(img).toBeDefined();
    expect(img.type).toBe('image');
  });

  it('should not render product image when empty', () => {
    const result = ProductShowcase.generate(
      { ...ProductShowcase.defaults, productImage: '' } as any,
      baseOptions
    );

    const img = getLayerById(result, 'product-image');
    expect(img).toBeUndefined();
  });

  it('should render product shadow for non-minimal styles', () => {
    const result = ProductShowcase.generate(
      { ...ProductShowcase.defaults, productImage: 'product.png', style: 'elegant' } as any,
      baseOptions
    );

    const shadow = getLayerById(result, 'product-shadow');
    expect(shadow).toBeDefined();
  });

  it('should not render product shadow for minimal style', () => {
    const result = ProductShowcase.generate(
      { ...ProductShowcase.defaults, productImage: 'product.png', style: 'minimal' } as any,
      baseOptions
    );

    const shadow = getLayerById(result, 'product-shadow');
    expect(shadow).toBeUndefined();
  });

  it('should render price when provided', () => {
    const result = ProductShowcase.generate(
      { ...ProductShowcase.defaults, price: '$199.99' } as any,
      baseOptions
    );

    const price = getLayerById(result, 'price');
    expect(price).toBeDefined();
    expect(price.props.text).toBe('$199.99');
  });

  it('should render features list', () => {
    const result = ProductShowcase.generate(
      {
        ...ProductShowcase.defaults,
        features: ['Fast', 'Reliable', 'Secure'],
      } as any,
      baseOptions
    );

    const features = getLayersByPrefix(result, 'feature-');
    expect(features.length).toBe(3);
    expect(features[0].props.text).toContain('Fast');
  });

  it('should limit features to 3', () => {
    const result = ProductShowcase.generate(
      {
        ...ProductShowcase.defaults,
        features: ['A', 'B', 'C', 'D', 'E'],
      } as any,
      baseOptions
    );

    const features = getLayersByPrefix(result, 'feature-');
    expect(features.length).toBe(3);
  });

  it('should use tech style with grid pattern', () => {
    const result = ProductShowcase.generate(
      { ...ProductShowcase.defaults, style: 'tech' } as any,
      baseOptions
    );

    const gridLines = getLayersByPrefix(result, 'grid-');
    expect(gridLines.length).toBeGreaterThan(0);
  });

  it('should render gradient overlay for elegant style', () => {
    const result = ProductShowcase.generate(
      { ...ProductShowcase.defaults, style: 'elegant' } as any,
      baseOptions
    );

    const overlay = getLayerById(result, 'gradient-overlay');
    expect(overlay).toBeDefined();
    expect(overlay.opacity).toBe(0.1);
  });

  it('should use zoomIn for bold style product image', () => {
    const result = ProductShowcase.generate(
      { ...ProductShowcase.defaults, productImage: 'product.png', style: 'bold' } as any,
      baseOptions
    );

    const img = getLayerById(result, 'product-image');
    expect(img.animations[0].effect).toBe('zoomIn');
  });
});

describe('KineticText - Detailed', () => {
  it('should render all words', () => {
    const words = ['HELLO', 'WORLD', 'TEST'];
    const result = KineticText.generate(
      { ...KineticText.defaults, words } as any,
      baseOptions
    );

    const wordLayers = getLayersByPrefix(result, 'word-');
    expect(wordLayers.length).toBe(3);
  });

  it('should use pop style animations by default', () => {
    const result = KineticText.generate(
      { ...KineticText.defaults, style: 'pop' } as any,
      baseOptions
    );

    const word = getLayerById(result, 'word-0');
    expect(word.animations[0].effect).toBe('scaleIn');
  });

  it('should use bounce animation for bounce style', () => {
    const result = KineticText.generate(
      { ...KineticText.defaults, style: 'bounce' } as any,
      baseOptions
    );

    const word = getLayerById(result, 'word-0');
    expect(word.animations[0].effect).toBe('bounceIn');
  });

  it('should use slide animations for split style', () => {
    const result = KineticText.generate(
      { ...KineticText.defaults, words: ['A', 'B'], style: 'split' } as any,
      baseOptions
    );

    const word0 = getLayerById(result, 'word-0');
    const word1 = getLayerById(result, 'word-1');
    // Even index slides from left, odd from right
    expect(word0.animations[0].effect).toBe('slideInLeft');
    expect(word1.animations[0].effect).toBe('slideInRight');
  });

  it('should use slideInUp for wave style', () => {
    const result = KineticText.generate(
      { ...KineticText.defaults, style: 'wave' } as any,
      baseOptions
    );

    const word = getLayerById(result, 'word-0');
    expect(word.animations[0].effect).toBe('slideInUp');
  });

  it('should add cursor for typewriter style', () => {
    const result = KineticText.generate(
      { ...KineticText.defaults, style: 'typewriter' } as any,
      baseOptions
    );

    const cursor = getLayerById(result, 'cursor');
    expect(cursor).toBeDefined();
    expect(cursor.type).toBe('shape');
  });

  it('should use monospace font for typewriter style', () => {
    const result = KineticText.generate(
      { ...KineticText.defaults, style: 'typewriter' } as any,
      baseOptions
    );

    const word = getLayerById(result, 'word-0');
    expect(word.props.fontFamily).toBe('monospace');
  });

  it('should adjust speed with slow multiplier', () => {
    const normalResult = KineticText.generate(
      { ...KineticText.defaults, speed: 'normal' } as any,
      baseOptions
    );
    const slowResult = KineticText.generate(
      { ...KineticText.defaults, speed: 'slow' } as any,
      baseOptions
    );

    const normalWord = getLayerById(normalResult, 'word-1');
    const slowWord = getLayerById(slowResult, 'word-1');
    // Slow should have later delay than normal
    expect(slowWord.animations[0].delay).toBeGreaterThan(normalWord.animations[0].delay);
  });

  it('should adjust speed with fast multiplier', () => {
    const normalResult = KineticText.generate(
      { ...KineticText.defaults, speed: 'normal' } as any,
      baseOptions
    );
    const fastResult = KineticText.generate(
      { ...KineticText.defaults, speed: 'fast' } as any,
      baseOptions
    );

    const normalWord = getLayerById(normalResult, 'word-1');
    const fastWord = getLayerById(fastResult, 'word-1');
    expect(fastWord.animations[0].delay).toBeLessThan(normalWord.animations[0].delay);
  });

  it('should highlight middle word in pop style with primary color', () => {
    const words = ['A', 'B', 'C', 'D', 'E'];
    const result = KineticText.generate(
      { ...KineticText.defaults, words, style: 'pop' } as any,
      baseOptions
    );

    const middleWord = getLayerById(result, 'word-2');
    expect(middleWord.props.color).toBe(modernTheme.colors.primary);
  });
});

describe('WipeTransition - Detailed', () => {
  it('should render blinds for blinds style', () => {
    const result = WipeTransition.generate(
      { ...WipeTransition.defaults, style: 'blinds' } as any,
      baseOptions
    );

    const blinds = getLayersByPrefix(result, 'blind-');
    expect(blinds.length).toBe(10);
  });

  it('should render strips for strips style', () => {
    const result = WipeTransition.generate(
      { ...WipeTransition.defaults, style: 'strips' } as any,
      baseOptions
    );

    const strips = getLayersByPrefix(result, 'strip-');
    expect(strips.length).toBe(8);
  });

  it('should render single wipe layer for solid style', () => {
    const result = WipeTransition.generate(
      { ...WipeTransition.defaults, style: 'solid' } as any,
      baseOptions
    );

    const wipe = getLayerById(result, 'wipe');
    expect(wipe).toBeDefined();
  });

  it('should use gradient for gradient style', () => {
    const result = WipeTransition.generate(
      { ...WipeTransition.defaults, style: 'gradient' } as any,
      baseOptions
    );

    const wipe = getLayerById(result, 'wipe');
    expect(wipe.props.gradient).toBeDefined();
  });

  it('should use correct slide direction for left', () => {
    const result = WipeTransition.generate(
      { ...WipeTransition.defaults, direction: 'left', style: 'solid' } as any,
      baseOptions
    );

    const wipe = getLayerById(result, 'wipe');
    expect(wipe.animations[0].effect).toBe('slideInLeft');
    expect(wipe.animations[1].effect).toBe('slideOutRight');
  });

  it('should use correct slide direction for right', () => {
    const result = WipeTransition.generate(
      { ...WipeTransition.defaults, direction: 'right', style: 'solid' } as any,
      baseOptions
    );

    const wipe = getLayerById(result, 'wipe');
    expect(wipe.animations[0].effect).toBe('slideInRight');
    expect(wipe.animations[1].effect).toBe('slideOutLeft');
  });

  it('should use correct slide direction for up', () => {
    const result = WipeTransition.generate(
      { ...WipeTransition.defaults, direction: 'up', style: 'solid' } as any,
      baseOptions
    );

    const wipe = getLayerById(result, 'wipe');
    expect(wipe.animations[0].effect).toBe('slideInUp');
    expect(wipe.animations[1].effect).toBe('slideOutDown');
  });

  it('should use correct slide direction for down', () => {
    const result = WipeTransition.generate(
      { ...WipeTransition.defaults, direction: 'down', style: 'solid' } as any,
      baseOptions
    );

    const wipe = getLayerById(result, 'wipe');
    expect(wipe.animations[0].effect).toBe('slideInDown');
    expect(wipe.animations[1].effect).toBe('slideOutUp');
  });

  it('should have both entrance and exit animations for blinds', () => {
    const result = WipeTransition.generate(
      { ...WipeTransition.defaults, style: 'blinds' } as any,
      baseOptions
    );

    const blind = getLayerById(result, 'blind-0');
    expect(blind.animations.length).toBe(2);
    expect(blind.animations[0].type).toBe('entrance');
    expect(blind.animations[1].type).toBe('exit');
  });

  it('should stagger blind animations', () => {
    const result = WipeTransition.generate(
      { ...WipeTransition.defaults, style: 'blinds' } as any,
      baseOptions
    );

    const blind0 = getLayerById(result, 'blind-0');
    const blind5 = getLayerById(result, 'blind-5');
    expect(blind5.animations[0].delay).toBeGreaterThan(blind0.animations[0].delay);
  });

  it('should use custom wipe color', () => {
    const result = WipeTransition.generate(
      { ...WipeTransition.defaults, color: '#FF0000', style: 'solid' } as any,
      baseOptions
    );

    const wipe = getLayerById(result, 'wipe');
    expect(wipe.props.fill).toBe('#FF0000');
  });
});

describe('Cross-cutting: Theme integration', () => {
  const themes = [modernTheme, boldTheme, elegantTheme, techTheme];

  themes.forEach((theme) => {
    it(`should generate valid templates with ${theme.name} theme`, () => {
      const options = { ...baseOptions, theme };

      const result = TitleReveal.generate(
        { headline: 'Test' },
        options
      );

      expect(result.output.type).toBe('video');
      expect(result.composition.scenes.length).toBeGreaterThan(0);
    });
  });
});

describe('Cross-cutting: Aspect ratio adaptations', () => {
  const aspectRatios: SceneGenerateOptions['aspectRatio'][] = ['16:9', '9:16', '1:1'];

  aspectRatios.forEach((aspectRatio) => {
    it(`should generate valid template for ${aspectRatio}`, () => {
      const options = { ...baseOptions, aspectRatio };

      const result = CallToAction.generate(
        CallToAction.defaults as any,
        options
      );

      expect(result.output.width).toBeGreaterThan(0);
      expect(result.output.height).toBeGreaterThan(0);
      expect(result.composition.scenes[0].layers.length).toBeGreaterThan(0);
    });
  });
});

describe('Cross-cutting: Duration handling', () => {
  it('should respect custom duration for all scenes', () => {
    const scenes = [
      { template: TitleReveal, defaults: { headline: 'Test' } },
      { template: CountdownTimer, defaults: CountdownTimer.defaults },
      { template: CallToAction, defaults: CallToAction.defaults },
    ];

    scenes.forEach(({ template, defaults }) => {
      const result = template.generate(defaults as any, {
        ...baseOptions,
        duration: 12,
      });

      expect(result.output.duration).toBe(12);
      expect(result.composition.scenes[0].endFrame).toBe(12 * 30); // duration * fps
    });
  });
});
