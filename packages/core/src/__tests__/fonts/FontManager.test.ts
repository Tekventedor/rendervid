import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { FontManager } from '../../fonts/FontManager';
import type { FontConfiguration, GoogleFontDefinition, CustomFontDefinition } from '../../fonts/types';
import type { Template } from '../../types/template';

// Mock document.fonts API
class MockFontFace {
  family: string;
  source: string;
  weight: string;
  style: string;

  constructor(family: string, source: string, options: { weight?: string; style?: string } = {}) {
    this.family = family;
    this.source = source;
    this.weight = options.weight ?? '400';
    this.style = options.style ?? 'normal';
  }

  async load(): Promise<MockFontFace> {
    // Simulate async loading
    await new Promise(resolve => setTimeout(resolve, 10));
    return this;
  }
}

class MockFontFaceSet {
  private fonts: Set<MockFontFace> = new Set();
  ready: Promise<void> = Promise.resolve();

  add(font: MockFontFace): void {
    this.fonts.add(font);
  }

  check(font: string): boolean {
    // Simple check - just return true for testing
    return true;
  }

  clear(): void {
    this.fonts.clear();
  }
}

describe('FontManager', () => {
  let fontManager: FontManager;
  let mockFontFaceSet: MockFontFaceSet;

  beforeEach(() => {
    fontManager = new FontManager();
    mockFontFaceSet = new MockFontFaceSet();

    // Setup global mocks
    global.FontFace = MockFontFace as any;
    global.document = {
      fonts: mockFontFaceSet,
      head: {
        appendChild: vi.fn(),
      },
      createElement: vi.fn(() => ({
        textContent: '',
      })),
    } as any;
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('extractFontsFromTemplate', () => {
    it('should extract fonts from text layers', () => {
      const template: Template = {
        name: 'Test Template',
        output: {
          type: 'video',
          width: 1920,
          height: 1080,
          fps: 30,
          duration: 5,
        },
        inputs: [],
        composition: {
          scenes: [
            {
              id: 'scene1',
              startFrame: 0,
              endFrame: 150,
              layers: [
                {
                  id: 'text1',
                  type: 'text',
                  position: { x: 0, y: 0 },
                  size: { width: 100, height: 100 },
                  props: {
                    text: 'Hello',
                    fontFamily: 'Roboto',
                    fontWeight: '700',
                    fontStyle: 'normal',
                  },
                },
                {
                  id: 'text2',
                  type: 'text',
                  position: { x: 0, y: 0 },
                  size: { width: 100, height: 100 },
                  props: {
                    text: 'World',
                    fontFamily: 'Playfair Display',
                    fontWeight: '400',
                    fontStyle: 'italic',
                  },
                },
              ],
            },
          ],
        },
      };

      const fonts = fontManager.extractFontsFromTemplate(template);

      expect(fonts.size).toBe(2);

      const fontArray = Array.from(fonts);
      expect(fontArray).toContainEqual({
        family: 'Roboto',
        weight: 700,
        style: 'normal',
      });
      expect(fontArray).toContainEqual({
        family: 'Playfair Display',
        weight: 400,
        style: 'italic',
      });
    });

    it('should handle text layers without font family', () => {
      const template: Template = {
        name: 'Test Template',
        output: {
          type: 'video',
          width: 1920,
          height: 1080,
        },
        inputs: [],
        composition: {
          scenes: [
            {
              id: 'scene1',
              startFrame: 0,
              endFrame: 150,
              layers: [
                {
                  id: 'text1',
                  type: 'text',
                  position: { x: 0, y: 0 },
                  size: { width: 100, height: 100 },
                  props: {
                    text: 'Hello',
                  },
                },
              ],
            },
          ],
        },
      };

      const fonts = fontManager.extractFontsFromTemplate(template);
      expect(fonts.size).toBe(0);
    });

    it('should extract fonts from nested group layers', () => {
      const template: Template = {
        name: 'Test Template',
        output: {
          type: 'video',
          width: 1920,
          height: 1080,
        },
        inputs: [],
        composition: {
          scenes: [
            {
              id: 'scene1',
              startFrame: 0,
              endFrame: 150,
              layers: [
                {
                  id: 'group1',
                  type: 'group',
                  position: { x: 0, y: 0 },
                  size: { width: 100, height: 100 },
                  props: {},
                  children: [
                    {
                      id: 'text1',
                      type: 'text',
                      position: { x: 0, y: 0 },
                      size: { width: 100, height: 100 },
                      props: {
                        text: 'Nested',
                        fontFamily: 'Inter',
                        fontWeight: '600',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      };

      const fonts = fontManager.extractFontsFromTemplate(template);

      expect(fonts.size).toBe(1);
      const fontArray = Array.from(fonts);
      expect(fontArray).toContainEqual({
        family: 'Inter',
        weight: 600,
        style: 'normal',
      });
    });

    it('should deduplicate identical font references', () => {
      const template: Template = {
        name: 'Test Template',
        output: {
          type: 'video',
          width: 1920,
          height: 1080,
        },
        inputs: [],
        composition: {
          scenes: [
            {
              id: 'scene1',
              startFrame: 0,
              endFrame: 150,
              layers: [
                {
                  id: 'text1',
                  type: 'text',
                  position: { x: 0, y: 0 },
                  size: { width: 100, height: 100 },
                  props: {
                    text: 'Hello',
                    fontFamily: 'Roboto',
                    fontWeight: '400',
                  },
                },
                {
                  id: 'text2',
                  type: 'text',
                  position: { x: 0, y: 0 },
                  size: { width: 100, height: 100 },
                  props: {
                    text: 'World',
                    fontFamily: 'Roboto',
                    fontWeight: '400',
                  },
                },
              ],
            },
          ],
        },
      };

      const fonts = fontManager.extractFontsFromTemplate(template);
      expect(fonts.size).toBe(1);
    });

    it('should handle bold font weight string', () => {
      const template: Template = {
        name: 'Test Template',
        output: {
          type: 'video',
          width: 1920,
          height: 1080,
        },
        inputs: [],
        composition: {
          scenes: [
            {
              id: 'scene1',
              startFrame: 0,
              endFrame: 150,
              layers: [
                {
                  id: 'text1',
                  type: 'text',
                  position: { x: 0, y: 0 },
                  size: { width: 100, height: 100 },
                  props: {
                    text: 'Bold Text',
                    fontFamily: 'Roboto',
                    fontWeight: 'bold',
                  },
                },
              ],
            },
          ],
        },
      };

      const fonts = fontManager.extractFontsFromTemplate(template);
      const fontArray = Array.from(fonts);

      expect(fontArray[0].weight).toBe(700);
    });
  });

  describe('getFallbackStack', () => {
    it('should return fallback stack for known font', () => {
      const stack = fontManager.getFallbackStack('Roboto');
      expect(stack).toBe("'Roboto', Arial, Helvetica, sans-serif");
    });

    it('should return generic fallback for unknown font', () => {
      const stack = fontManager.getFallbackStack('UnknownFont');
      expect(stack).toBe("'UnknownFont', Arial, Helvetica, sans-serif");
    });

    it('should use custom fallbacks when provided', () => {
      const stack = fontManager.getFallbackStack('MyFont', ['Georgia', 'serif']);
      expect(stack).toBe("'MyFont', Georgia, serif");
    });

    it('should return serif fallback for serif fonts', () => {
      const stack = fontManager.getFallbackStack('Playfair Display');
      expect(stack).toBe("'Playfair Display', Georgia, Times New Roman, serif");
    });

    it('should return monospace fallback for monospace fonts', () => {
      const stack = fontManager.getFallbackStack('Roboto Mono');
      expect(stack).toBe("'Roboto Mono', Consolas, Monaco, Courier New, monospace");
    });
  });

  describe('verifyFontsLoaded', () => {
    it('should return true when all fonts are loaded', () => {
      const fonts = [
        { family: 'Roboto', weight: 400 as const, style: 'normal' as const },
        { family: 'Roboto', weight: 700 as const, style: 'normal' as const },
      ];

      const result = fontManager.verifyFontsLoaded(fonts);
      expect(result).toBe(true);
    });

    it('should use default weight and style when not specified', () => {
      const fonts = [{ family: 'Roboto' }];
      const result = fontManager.verifyFontsLoaded(fonts);
      expect(result).toBe(true);
    });
  });

  describe('waitForFontsReady', () => {
    it('should wait for document.fonts.ready', async () => {
      await expect(fontManager.waitForFontsReady()).resolves.toBeUndefined();
    });

    it('should timeout if fonts take too long', async () => {
      const slowFontManager = new FontManager({ timeout: 100 });

      // Make fonts.ready take longer than timeout
      mockFontFaceSet.ready = new Promise(resolve => setTimeout(resolve, 200));

      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      await slowFontManager.waitForFontsReady();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('timeout')
      );

      consoleWarnSpy.mockRestore();
    });

    it('should handle custom timeout parameter', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      mockFontFaceSet.ready = new Promise(resolve => setTimeout(resolve, 200));

      await fontManager.waitForFontsReady(50);

      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });
  });

  describe('loadFonts', () => {
    it('should load Google Fonts successfully', async () => {
      const mockResponse = new Response('@font-face { font-family: "Roboto"; }');
      (global.fetch as any).mockResolvedValue(mockResponse);

      const config: FontConfiguration = {
        google: [
          {
            family: 'Roboto',
            weights: [400, 700],
            styles: ['normal'],
          },
        ],
      };

      const result = await fontManager.loadFonts(config);

      expect(result.loaded.length).toBe(2); // 2 weights × 1 style
      expect(result.failed.length).toBe(0);
      expect(result.loadTime).toBeGreaterThanOrEqual(0);
    });

    it('should load custom fonts successfully', async () => {
      const config: FontConfiguration = {
        custom: [
          {
            family: 'MyFont',
            source: 'https://example.com/myfont.woff2',
            weight: 400,
            style: 'normal',
          },
        ],
      };

      const result = await fontManager.loadFonts(config);

      expect(result.loaded.length).toBe(1);
      expect(result.loaded[0]).toEqual({
        family: 'MyFont',
        weight: 400,
        style: 'normal',
      });
    });

    it('should handle font loading failures gracefully', async () => {
      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const config: FontConfiguration = {
        google: [
          {
            family: 'NonExistentFont',
            weights: [400],
          },
        ],
      };

      const result = await fontManager.loadFonts(config);

      expect(result.failed.length).toBe(1);
      expect(result.failed[0].family).toBe('NonExistentFont');
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should load multiple Google Fonts with different styles', async () => {
      const mockResponse = new Response('@font-face {}');
      (global.fetch as any).mockResolvedValue(mockResponse);

      const config: FontConfiguration = {
        google: [
          {
            family: 'Roboto',
            weights: [400],
            styles: ['normal', 'italic'],
          },
        ],
      };

      const result = await fontManager.loadFonts(config);

      expect(result.loaded.length).toBe(2); // 1 weight × 2 styles
    });

    it('should use default values when weights and styles are not specified', async () => {
      const mockResponse = new Response('@font-face {}');
      (global.fetch as any).mockResolvedValue(mockResponse);

      const config: FontConfiguration = {
        google: [
          {
            family: 'Roboto',
          },
        ],
      };

      const result = await fontManager.loadFonts(config);

      expect(result.loaded.length).toBe(1); // default: 1 weight × 1 style
      expect(result.loaded[0]).toEqual({
        family: 'Roboto',
        weight: 400,
        style: 'normal',
      });
    });

    it('should measure load time correctly', async () => {
      const mockResponse = new Response('@font-face {}');
      (global.fetch as any).mockResolvedValue(mockResponse);

      const config: FontConfiguration = {
        google: [{ family: 'Roboto' }],
      };

      const result = await fontManager.loadFonts(config);

      expect(result.loadTime).toBeGreaterThanOrEqual(0);
      expect(typeof result.loadTime).toBe('number');
    });
  });

  describe('Font Manager Configuration', () => {
    it('should use custom timeout', async () => {
      const customFontManager = new FontManager({ timeout: 5000 });

      const mockResponse = new Response('@font-face {}');
      (global.fetch as any).mockResolvedValue(mockResponse);

      const config: FontConfiguration = {
        google: [{ family: 'Roboto' }],
      };

      const result = await customFontManager.loadFonts(config);
      expect(result.loaded.length).toBeGreaterThanOrEqual(0);
    });

    it('should use default timeout when not specified', () => {
      const defaultFontManager = new FontManager();
      expect(defaultFontManager).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty font configuration', async () => {
      const result = await fontManager.loadFonts({});

      expect(result.loaded.length).toBe(0);
      expect(result.failed.length).toBe(0);
    });

    it('should handle template with no text layers', () => {
      const template: Template = {
        name: 'Test',
        output: { type: 'video', width: 1920, height: 1080 },
        inputs: [],
        composition: {
          scenes: [
            {
              id: 'scene1',
              startFrame: 0,
              endFrame: 150,
              layers: [
                {
                  id: 'shape1',
                  type: 'shape',
                  position: { x: 0, y: 0 },
                  size: { width: 100, height: 100 },
                  props: { shape: 'rectangle' },
                },
              ],
            },
          ],
        },
      };

      const fonts = fontManager.extractFontsFromTemplate(template);
      expect(fonts.size).toBe(0);
    });

    it('should handle template with empty scenes', () => {
      const template: Template = {
        name: 'Test',
        output: { type: 'video', width: 1920, height: 1080 },
        inputs: [],
        composition: {
          scenes: [],
        },
      };

      const fonts = fontManager.extractFontsFromTemplate(template);
      expect(fonts.size).toBe(0);
    });
  });
});
