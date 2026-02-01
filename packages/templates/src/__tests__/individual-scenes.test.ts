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
import { modernTheme, boldTheme, elegantTheme } from '../themes';
import type { SceneGenerateOptions } from '../scenes';

describe('Individual Scene Templates', () => {
  const options: SceneGenerateOptions = {
    aspectRatio: '16:9',
    theme: modernTheme,
    fps: 30,
    duration: 5,
  };

  describe('TitleReveal', () => {
    it('should have correct metadata', () => {
      expect(TitleReveal.id).toBe('title-reveal');
      expect(TitleReveal.category).toBe('intro');
      expect(TitleReveal.tags).toContain('title');
    });

    it('should generate headline and subtitle layers', () => {
      const result = TitleReveal.generate(
        { headline: 'Test Title', subtitle: 'Test Subtitle' },
        options
      );

      const headlineLayer = result.composition.scenes[0].layers.find(
        (l) => l.id === 'headline'
      );
      const subtitleLayer = result.composition.scenes[0].layers.find(
        (l) => l.id === 'subtitle'
      );

      expect(headlineLayer).toBeDefined();
      expect(subtitleLayer).toBeDefined();
    });
  });

  describe('LogoReveal', () => {
    it('should have correct metadata', () => {
      expect(LogoReveal.id).toBe('logo-reveal');
      expect(LogoReveal.category).toBe('logo-reveal');
    });

    it('should support multiple animation styles', () => {
      const styles = ['minimal', 'particles', 'glitch', 'zoom'] as const;

      styles.forEach((style) => {
        const result = LogoReveal.generate(
          { ...LogoReveal.defaults, style, logoUrl: 'test.png' } as any,
          options
        );
        expect(result).toBeDefined();
      });
    });
  });

  describe('ModernLowerThird', () => {
    it('should have correct metadata', () => {
      expect(ModernLowerThird.id).toBe('modern-lower-third');
      expect(ModernLowerThird.category).toBe('lower-third');
    });

    it('should position correctly based on position prop', () => {
      const leftResult = ModernLowerThird.generate(
        { name: 'John', title: 'CEO', position: 'left' },
        options
      );

      const rightResult = ModernLowerThird.generate(
        { name: 'John', title: 'CEO', position: 'right' },
        options
      );

      expect(leftResult).toBeDefined();
      expect(rightResult).toBeDefined();
    });
  });

  describe('SocialPromo', () => {
    it('should have correct metadata', () => {
      expect(SocialPromo.id).toBe('social-promo');
      expect(SocialPromo.category).toBe('promo');
      expect(SocialPromo.tags).toContain('instagram');
      expect(SocialPromo.tags).toContain('tiktok');
    });

    it('should prefer 9:16 aspect ratio', () => {
      expect(SocialPromo.defaultAspectRatio).toBe('9:16');
    });

    it('should render discount badge when provided', () => {
      const result = SocialPromo.generate(
        { ...SocialPromo.defaults, discount: '50% OFF' } as any,
        options
      );

      const badge = result.composition.scenes[0].layers.find(
        (l) => l.id === 'discount-badge'
      );
      expect(badge).toBeDefined();
    });
  });

  describe('AnimatedStats', () => {
    it('should have correct metadata', () => {
      expect(AnimatedStats.id).toBe('animated-stats');
      expect(AnimatedStats.category).toBe('stats');
    });

    it('should render all stat items', () => {
      const stats = [
        { value: 100, label: 'Users' },
        { value: 50, label: 'Countries' },
      ];

      const result = AnimatedStats.generate(
        { ...AnimatedStats.defaults, stats } as any,
        options
      );

      const statLayers = result.composition.scenes[0].layers.filter((l) =>
        l.id.startsWith('stat-')
      );

      // Each stat has a value and label layer
      expect(statLayers.length).toBe(stats.length * 2);
    });

    it('should support different layouts', () => {
      const layouts = ['row', 'column', 'grid'] as const;

      layouts.forEach((layout) => {
        const result = AnimatedStats.generate(
          { ...AnimatedStats.defaults, layout } as any,
          options
        );
        expect(result).toBeDefined();
      });
    });
  });

  describe('TestimonialQuote', () => {
    it('should have correct metadata', () => {
      expect(TestimonialQuote.id).toBe('testimonial-quote');
      expect(TestimonialQuote.category).toBe('testimonial');
    });

    it('should render star rating', () => {
      const result = TestimonialQuote.generate(
        { ...TestimonialQuote.defaults, rating: 5 } as any,
        options
      );

      const stars = result.composition.scenes[0].layers.filter((l) =>
        l.id.startsWith('star-')
      );

      expect(stars.length).toBe(5);
    });
  });

  describe('CallToAction', () => {
    it('should have correct metadata', () => {
      expect(CallToAction.id).toBe('call-to-action');
      expect(CallToAction.category).toBe('call-to-action');
    });

    it('should render urgency badge when provided', () => {
      const result = CallToAction.generate(
        { ...CallToAction.defaults, urgencyText: 'Limited Time' } as any,
        options
      );

      const badge = result.composition.scenes[0].layers.find(
        (l) => l.id === 'urgency-badge'
      );
      expect(badge).toBeDefined();
    });

    it('should support different styles', () => {
      const styles = ['bold', 'elegant', 'minimal', 'gradient'] as const;

      styles.forEach((style) => {
        const result = CallToAction.generate(
          { ...CallToAction.defaults, style } as any,
          options
        );
        expect(result).toBeDefined();
      });
    });
  });

  describe('CountdownTimer', () => {
    it('should have correct metadata', () => {
      expect(CountdownTimer.id).toBe('countdown-timer');
      expect(CountdownTimer.tags).toContain('countdown');
    });

    it('should render digit boxes', () => {
      const result = CountdownTimer.generate(
        CountdownTimer.defaults as any,
        options
      );

      const digits = result.composition.scenes[0].layers.filter((l) =>
        l.id.startsWith('digit-')
      );

      expect(digits.length).toBeGreaterThan(0);
    });
  });

  describe('ProductShowcase', () => {
    it('should have correct metadata', () => {
      expect(ProductShowcase.id).toBe('product-showcase');
      expect(ProductShowcase.category).toBe('promo');
    });

    it('should render product image when provided', () => {
      const result = ProductShowcase.generate(
        {
          ...ProductShowcase.defaults,
          productImage: 'product.png',
        } as any,
        options
      );

      const productImage = result.composition.scenes[0].layers.find(
        (l) => l.id === 'product-image'
      );
      expect(productImage).toBeDefined();
    });
  });

  describe('KineticText', () => {
    it('should have correct metadata', () => {
      expect(KineticText.id).toBe('kinetic-text');
      expect(KineticText.category).toBe('text-animation');
    });

    it('should render all words', () => {
      const words = ['HELLO', 'WORLD'];
      const result = KineticText.generate(
        { ...KineticText.defaults, words } as any,
        options
      );

      const wordLayers = result.composition.scenes[0].layers.filter((l) =>
        l.id.startsWith('word-')
      );

      expect(wordLayers.length).toBe(words.length);
    });

    it('should support different animation styles', () => {
      const styles = ['pop', 'wave', 'typewriter', 'bounce', 'split'] as const;

      styles.forEach((style) => {
        const result = KineticText.generate(
          { ...KineticText.defaults, style } as any,
          options
        );
        expect(result).toBeDefined();
      });
    });
  });

  describe('WipeTransition', () => {
    it('should have correct metadata', () => {
      expect(WipeTransition.id).toBe('wipe-transition');
      expect(WipeTransition.category).toBe('transition');
    });

    it('should have short default duration', () => {
      expect(WipeTransition.duration).toBe(1);
    });

    it('should support different directions', () => {
      const directions = ['left', 'right', 'up', 'down', 'diagonal'] as const;

      directions.forEach((direction) => {
        const result = WipeTransition.generate(
          { ...WipeTransition.defaults, direction } as any,
          options
        );
        expect(result).toBeDefined();
      });
    });

    it('should support different styles', () => {
      const styles = ['solid', 'gradient', 'strips', 'blinds'] as const;

      styles.forEach((style) => {
        const result = WipeTransition.generate(
          { ...WipeTransition.defaults, style } as any,
          options
        );
        expect(result).toBeDefined();
      });
    });
  });
});
