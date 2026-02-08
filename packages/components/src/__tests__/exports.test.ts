import { describe, it, expect } from 'vitest';

/**
 * Tests for verifying that individual module exports are correct.
 * We import from individual sub-modules to avoid pulling in optional
 * dependencies (like lottie-web) that are not installed in dev.
 */

describe('Component Module Exports', () => {
  it('should export basic components from components module', async () => {
    const mod = await import('../components');
    expect(mod.Text).toBeDefined();
    expect(typeof mod.Text).toBe('function');
    expect(mod.GradientText).toBeDefined();
    expect(mod.Image).toBeDefined();
    expect(mod.Shape).toBeDefined();
    expect(mod.Container).toBeDefined();
    expect(mod.Counter).toBeDefined();
    expect(mod.ProgressBar).toBeDefined();
    expect(mod.Typewriter).toBeDefined();
    expect(mod.Fade).toBeDefined();
    expect(mod.Slide).toBeDefined();
    expect(mod.Scale).toBeDefined();
    expect(mod.Rotate).toBeDefined();
  });

  it('should export background components', async () => {
    const mod = await import('../backgrounds');
    expect(mod.AuroraBackground).toBeDefined();
    expect(typeof mod.AuroraBackground).toBe('function');
    expect(mod.WaveBackground).toBeDefined();
    expect(typeof mod.WaveBackground).toBe('function');
  });

  it('should export chart components', async () => {
    const mod = await import('../charts');
    expect(mod.BarChart).toBeDefined();
    expect(typeof mod.BarChart).toBe('function');
    expect(mod.LineChart).toBeDefined();
    expect(typeof mod.LineChart).toBe('function');
    expect(mod.PieChart).toBeDefined();
    expect(typeof mod.PieChart).toBe('function');
  });

  it('should export social components', async () => {
    const mod = await import('../social');
    expect(mod.SocialCard).toBeDefined();
    expect(typeof mod.SocialCard).toBe('function');
    expect(mod.QuoteCard).toBeDefined();
    expect(typeof mod.QuoteCard).toBe('function');
    expect(mod.ProductCard).toBeDefined();
    expect(typeof mod.ProductCard).toBe('function');
  });

  it('should export transition components', async () => {
    const mod = await import('../transitions');
    expect(mod.SceneTransition).toBeDefined();
    expect(typeof mod.SceneTransition).toBe('function');
    expect(mod.LowerThird).toBeDefined();
    expect(typeof mod.LowerThird).toBe('function');
    expect(mod.CallToAction).toBeDefined();
    expect(typeof mod.CallToAction).toBe('function');
  });

  it('should export utility functions', async () => {
    const mod = await import('../utils');
    expect(mod.lerp).toBeDefined();
    expect(typeof mod.lerp).toBe('function');
    expect(mod.clamp).toBeDefined();
    expect(typeof mod.clamp).toBe('function');
    expect(mod.getProgress).toBeDefined();
    expect(typeof mod.getProgress).toBe('function');
    expect(mod.easeIn).toBeDefined();
    expect(mod.easeOut).toBeDefined();
    expect(mod.easeInOut).toBeDefined();
    expect(mod.easeInOutCubic).toBeDefined();
    expect(mod.spring).toBeDefined();
    expect(mod.frameToTime).toBeDefined();
    expect(mod.timeToFrame).toBeDefined();
  });

  it('should export ComponentRegistry class', async () => {
    const mod = await import('../registry/ComponentRegistry');
    expect(mod.ComponentRegistry).toBeDefined();
    expect(typeof mod.ComponentRegistry).toBe('function');
  });
});

describe('Individual Effect Exports', () => {
  it('should export GlitchEffect', async () => {
    const mod = await import('../effects/GlitchEffect');
    expect(mod.GlitchEffect).toBeDefined();
    expect(typeof mod.GlitchEffect).toBe('function');
  });

  it('should export ParticleSystem', async () => {
    const mod = await import('../effects/ParticleSystem');
    expect(mod.ParticleSystem).toBeDefined();
    expect(typeof mod.ParticleSystem).toBe('function');
  });

  it('should export BlurText', async () => {
    const mod = await import('../effects/BlurText');
    expect(mod.BlurText).toBeDefined();
    expect(typeof mod.BlurText).toBe('function');
  });

  it('should export WaveText', async () => {
    const mod = await import('../effects/WaveText');
    expect(mod.WaveText).toBeDefined();
    expect(typeof mod.WaveText).toBe('function');
  });

  it('should export BounceText', async () => {
    const mod = await import('../effects/BounceText');
    expect(mod.BounceText).toBeDefined();
    expect(typeof mod.BounceText).toBe('function');
  });

  it('should export StaggerText', async () => {
    const mod = await import('../effects/StaggerText');
    expect(mod.StaggerText).toBeDefined();
    expect(typeof mod.StaggerText).toBe('function');
  });

  it('should export ShinyText', async () => {
    const mod = await import('../effects/ShinyText');
    expect(mod.ShinyText).toBeDefined();
    expect(typeof mod.ShinyText).toBe('function');
  });

  it('should export RevealText', async () => {
    const mod = await import('../effects/RevealText');
    expect(mod.RevealText).toBeDefined();
    expect(typeof mod.RevealText).toBe('function');
  });

  it('should export SplitText', async () => {
    const mod = await import('../effects/SplitText');
    expect(mod.SplitText).toBeDefined();
    expect(typeof mod.SplitText).toBe('function');
  });

  it('should export ScrambleText', async () => {
    const mod = await import('../effects/ScrambleText');
    expect(mod.ScrambleText).toBeDefined();
    expect(typeof mod.ScrambleText).toBe('function');
  });

  it('should export FlipText', async () => {
    const mod = await import('../effects/FlipText');
    expect(mod.FlipText).toBeDefined();
    expect(typeof mod.FlipText).toBe('function');
  });

  it('should export FuzzyText', async () => {
    const mod = await import('../effects/FuzzyText');
    expect(mod.FuzzyText).toBeDefined();
    expect(typeof mod.FuzzyText).toBe('function');
  });

  it('should export NeonText', async () => {
    const mod = await import('../effects/NeonText');
    expect(mod.NeonText).toBeDefined();
    expect(typeof mod.NeonText).toBe('function');
  });

  it('should export TextTrail', async () => {
    const mod = await import('../effects/TextTrail');
    expect(mod.TextTrail).toBeDefined();
    expect(typeof mod.TextTrail).toBe('function');
  });

  it('should export LetterMorph', async () => {
    const mod = await import('../effects/LetterMorph');
    expect(mod.LetterMorph).toBeDefined();
    expect(typeof mod.LetterMorph).toBe('function');
  });

  it('should export MorphText', async () => {
    const mod = await import('../effects/MorphText');
    expect(mod.MorphText).toBeDefined();
    expect(typeof mod.MorphText).toBe('function');
  });

  it('should export DistortText', async () => {
    const mod = await import('../effects/DistortText');
    expect(mod.DistortText).toBeDefined();
    expect(typeof mod.DistortText).toBe('function');
  });

  it('should export SVGDrawing', async () => {
    const mod = await import('../effects/SVGDrawing');
    expect(mod.SVGDrawing).toBeDefined();
    expect(typeof mod.SVGDrawing).toBe('function');
  });

  it('should export TypewriterEffect', async () => {
    const mod = await import('../effects/TypewriterEffect');
    expect(mod.TypewriterEffect).toBeDefined();
    expect(typeof mod.TypewriterEffect).toBe('function');
  });

  it('should export MetaBalls', async () => {
    const mod = await import('../effects/MetaBalls');
    expect(mod.MetaBalls).toBeDefined();
    expect(typeof mod.MetaBalls).toBe('function');
  });

  it('should export ThreeScene', async () => {
    const mod = await import('../effects/ThreeScene');
    expect(mod.ThreeScene).toBeDefined();
    expect(typeof mod.ThreeScene).toBe('function');
  });
});
