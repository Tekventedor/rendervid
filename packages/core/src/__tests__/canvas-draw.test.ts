import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';

// Mock Path2D which is not available in Node.js
class MockPath2D {
  constructor(public pathData?: string) {}
}
beforeAll(() => {
  (globalThis as any).Path2D = MockPath2D;
});

import {
  drawPath,
  drawGradient,
  drawTextOnPath,
  createPattern,
  applyClipPath,
  createCanvasGradient,
  drawCircle,
  drawRoundedRect,
  type GradientConfig,
  type DrawPathOptions,
} from '../utils/canvas-draw';

// ═══════════════════════════════════════════════════════════════
// MOCK CANVAS CONTEXT
// ═══════════════════════════════════════════════════════════════

function createMockContext(): CanvasRenderingContext2D {
  const mockGradient = {
    addColorStop: vi.fn(),
  } as unknown as CanvasGradient;

  const mockPattern = {} as CanvasPattern;

  const ctx = {
    save: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    closePath: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    clip: vi.fn(),
    arc: vi.fn(),
    rect: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    arcTo: vi.fn(),
    fillRect: vi.fn(),
    fillText: vi.fn(),
    strokeText: vi.fn(),
    measureText: vi.fn().mockReturnValue({ width: 10 }),
    translate: vi.fn(),
    rotate: vi.fn(),
    setLineDash: vi.fn(),
    createLinearGradient: vi.fn().mockReturnValue(mockGradient),
    createRadialGradient: vi.fn().mockReturnValue(mockGradient),
    createConicGradient: vi.fn().mockReturnValue(mockGradient),
    createPattern: vi.fn().mockReturnValue(mockPattern),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    lineCap: 'butt' as CanvasLineCap,
    lineJoin: 'miter' as CanvasLineJoin,
    globalAlpha: 1,
    font: '',
    textBaseline: 'alphabetic' as CanvasTextBaseline,
  } as unknown as CanvasRenderingContext2D;

  return ctx;
}

describe('Canvas Drawing Utilities', () => {
  let ctx: CanvasRenderingContext2D;

  beforeEach(() => {
    ctx = createMockContext();
  });

  // ═══════════════════════════════════════════════════════════════
  // drawPath
  // ═══════════════════════════════════════════════════════════════

  describe('drawPath', () => {
    it('should save and restore context', () => {
      drawPath(ctx, 'M 0 0 L 100 100', { fill: '#ff0000' });
      expect(ctx.save).toHaveBeenCalled();
      expect(ctx.restore).toHaveBeenCalled();
    });

    it('should fill path when fill option is provided', () => {
      drawPath(ctx, 'M 0 0 L 100 100', { fill: '#ff0000' });
      expect(ctx.fill).toHaveBeenCalled();
    });

    it('should stroke path when stroke option is provided', () => {
      drawPath(ctx, 'M 0 0 L 100 100', { stroke: '#00ff00', strokeWidth: 3 });
      expect(ctx.stroke).toHaveBeenCalled();
    });

    it('should apply stroke dash when provided', () => {
      drawPath(ctx, 'M 0 0 L 100 100', {
        stroke: '#000',
        strokeDash: [5, 3],
      });
      expect(ctx.setLineDash).toHaveBeenCalledWith([5, 3]);
    });

    it('should set opacity when provided', () => {
      drawPath(ctx, 'M 0 0 L 100 100', { fill: '#000', opacity: 0.5 });
      expect(ctx.globalAlpha).toBe(0.5);
    });

    it('should handle empty options', () => {
      drawPath(ctx, 'M 0 0 L 100 100');
      expect(ctx.save).toHaveBeenCalled();
      expect(ctx.restore).toHaveBeenCalled();
      expect(ctx.fill).not.toHaveBeenCalled();
      expect(ctx.stroke).not.toHaveBeenCalled();
    });

    it('should set line cap and join', () => {
      drawPath(ctx, 'M 0 0 L 100 100', {
        stroke: '#000',
        lineCap: 'round',
        lineJoin: 'round',
      });
      expect(ctx.lineCap).toBe('round');
      expect(ctx.lineJoin).toBe('round');
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // createCanvasGradient / drawGradient
  // ═══════════════════════════════════════════════════════════════

  describe('createCanvasGradient', () => {
    it('should create a linear gradient', () => {
      const config: GradientConfig = {
        type: 'linear',
        stops: [
          { offset: 0, color: '#ff0000' },
          { offset: 1, color: '#0000ff' },
        ],
        x0: 0,
        y0: 0,
        x1: 200,
        y1: 0,
      };

      const gradient = createCanvasGradient(ctx, config, {
        x: 0,
        y: 0,
        width: 200,
        height: 200,
      });

      expect(ctx.createLinearGradient).toHaveBeenCalledWith(0, 0, 200, 0);
      expect(gradient).toBeTruthy();
    });

    it('should create a radial gradient', () => {
      const config: GradientConfig = {
        type: 'radial',
        stops: [
          { offset: 0, color: '#ffffff' },
          { offset: 1, color: '#000000' },
        ],
      };

      createCanvasGradient(ctx, config, {
        x: 0,
        y: 0,
        width: 200,
        height: 200,
      });

      expect(ctx.createRadialGradient).toHaveBeenCalled();
    });

    it('should create a conic gradient', () => {
      const config: GradientConfig = {
        type: 'conic',
        stops: [
          { offset: 0, color: '#ff0000' },
          { offset: 0.5, color: '#00ff00' },
          { offset: 1, color: '#0000ff' },
        ],
        startAngle: 90,
      };

      createCanvasGradient(ctx, config, {
        x: 0,
        y: 0,
        width: 200,
        height: 200,
      });

      expect(ctx.createConicGradient).toHaveBeenCalled();
    });

    it('should add color stops to gradient', () => {
      const config: GradientConfig = {
        type: 'linear',
        stops: [
          { offset: 0, color: '#ff0000' },
          { offset: 0.5, color: '#00ff00' },
          { offset: 1, color: '#0000ff' },
        ],
      };

      const gradient = createCanvasGradient(ctx, config, {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      });

      expect((gradient as any).addColorStop).toHaveBeenCalledTimes(3);
    });

    it('should clamp offset values to [0, 1]', () => {
      const config: GradientConfig = {
        type: 'linear',
        stops: [
          { offset: -0.5, color: '#ff0000' },
          { offset: 1.5, color: '#0000ff' },
        ],
      };

      const gradient = createCanvasGradient(ctx, config, {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      });

      expect((gradient as any).addColorStop).toHaveBeenCalledWith(0, '#ff0000');
      expect((gradient as any).addColorStop).toHaveBeenCalledWith(1, '#0000ff');
    });
  });

  describe('drawGradient', () => {
    it('should fill rectangle with gradient', () => {
      const config: GradientConfig = {
        type: 'linear',
        stops: [
          { offset: 0, color: '#ff0000' },
          { offset: 1, color: '#0000ff' },
        ],
      };

      drawGradient(ctx, config, { x: 10, y: 20, width: 300, height: 200 });

      expect(ctx.fillRect).toHaveBeenCalledWith(10, 20, 300, 200);
      expect(ctx.save).toHaveBeenCalled();
      expect(ctx.restore).toHaveBeenCalled();
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // drawTextOnPath
  // ═══════════════════════════════════════════════════════════════

  describe('drawTextOnPath', () => {
    it('should set font properties', () => {
      drawTextOnPath(ctx, 'Hello', 'M 0 0 L 200 0', {
        fontSize: 24,
        fontFamily: 'Arial',
        fontWeight: 'bold',
        fill: '#ffffff',
      });

      expect(ctx.font).toBe('bold 24px Arial');
    });

    it('should save and restore context', () => {
      drawTextOnPath(ctx, 'Hi', 'M 0 0 L 200 0', { fill: '#000' });
      expect(ctx.save).toHaveBeenCalled();
      expect(ctx.restore).toHaveBeenCalled();
    });

    it('should handle empty text', () => {
      drawTextOnPath(ctx, '', 'M 0 0 L 200 0', { fill: '#000' });
      expect(ctx.fillText).not.toHaveBeenCalled();
    });

    it('should handle invalid path gracefully', () => {
      // An empty path should not crash
      drawTextOnPath(ctx, 'Test', '', { fill: '#000' });
      expect(ctx.save).toHaveBeenCalled();
      expect(ctx.restore).toHaveBeenCalled();
    });

    it('should fill and stroke text when both are provided', () => {
      drawTextOnPath(ctx, 'AB', 'M 0 0 L 200 0', {
        fill: '#ff0000',
        stroke: '#000000',
        strokeWidth: 2,
      });

      // Both fill and stroke should be called for each character
      expect(ctx.fillText).toHaveBeenCalled();
      expect(ctx.strokeText).toHaveBeenCalled();
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // createPattern
  // ═══════════════════════════════════════════════════════════════

  describe('createPattern', () => {
    it('should create pattern with default repetition', () => {
      const source = {} as CanvasImageSource;
      createPattern(ctx, source);
      expect(ctx.createPattern).toHaveBeenCalledWith(source, 'repeat');
    });

    it('should create pattern with specified repetition', () => {
      const source = {} as CanvasImageSource;
      createPattern(ctx, source, 'repeat-x');
      expect(ctx.createPattern).toHaveBeenCalledWith(source, 'repeat-x');
    });

    it('should support no-repeat', () => {
      const source = {} as CanvasImageSource;
      createPattern(ctx, source, 'no-repeat');
      expect(ctx.createPattern).toHaveBeenCalledWith(source, 'no-repeat');
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // applyClipPath
  // ═══════════════════════════════════════════════════════════════

  describe('applyClipPath', () => {
    it('should call clip on context', () => {
      applyClipPath(ctx, 'M 0 0 L 100 0 L 100 100 L 0 100 Z');
      expect(ctx.clip).toHaveBeenCalled();
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // drawCircle
  // ═══════════════════════════════════════════════════════════════

  describe('drawCircle', () => {
    it('should draw a filled circle', () => {
      drawCircle(ctx, 50, 50, 25, { fill: '#ff0000' });
      expect(ctx.arc).toHaveBeenCalledWith(50, 50, 25, 0, Math.PI * 2);
      expect(ctx.fill).toHaveBeenCalled();
    });

    it('should draw a stroked circle', () => {
      drawCircle(ctx, 50, 50, 25, { stroke: '#00ff00', strokeWidth: 2 });
      expect(ctx.arc).toHaveBeenCalled();
      expect(ctx.stroke).toHaveBeenCalled();
    });

    it('should apply opacity', () => {
      drawCircle(ctx, 50, 50, 25, { fill: '#000', opacity: 0.3 });
      expect(ctx.globalAlpha).toBe(0.3);
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // drawRoundedRect
  // ═══════════════════════════════════════════════════════════════

  describe('drawRoundedRect', () => {
    it('should draw a rectangle without border radius', () => {
      drawRoundedRect(ctx, 10, 20, 100, 50, 0, { fill: '#ff0000' });
      expect(ctx.rect).toHaveBeenCalledWith(10, 20, 100, 50);
      expect(ctx.fill).toHaveBeenCalled();
    });

    it('should draw a rounded rectangle', () => {
      drawRoundedRect(ctx, 10, 20, 100, 50, 8, { fill: '#ff0000' });
      expect(ctx.arcTo).toHaveBeenCalled();
      expect(ctx.fill).toHaveBeenCalled();
    });

    it('should stroke when stroke is provided', () => {
      drawRoundedRect(ctx, 0, 0, 100, 100, 5, {
        stroke: '#000',
        strokeWidth: 2,
      });
      expect(ctx.stroke).toHaveBeenCalled();
    });

    it('should clamp border radius to half of smallest dimension', () => {
      // borderRadius 100 on a 50x50 rect should clamp to 25
      drawRoundedRect(ctx, 0, 0, 50, 50, 100, { fill: '#000' });
      expect(ctx.arcTo).toHaveBeenCalled();
    });
  });
});
