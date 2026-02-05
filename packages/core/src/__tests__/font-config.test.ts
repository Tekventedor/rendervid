import { describe, it, expect } from 'vitest';
import type { Template, FontConfiguration } from '../types';

describe('Font Configuration Types', () => {
  it('should allow template without fonts (backward compatibility)', () => {
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
            layers: [],
          },
        ],
      },
    };

    expect(template.fonts).toBeUndefined();
  });

  it('should allow template with font configuration', () => {
    const fontConfig: FontConfiguration = {
      families: [
        {
          family: 'Inter',
          sources: [
            {
              url: 'https://fonts.gstatic.com/inter-regular.woff2',
              weight: 400,
              style: 'normal',
            },
            {
              url: 'https://fonts.gstatic.com/inter-bold.woff2',
              weight: 700,
              style: 'normal',
            },
          ],
          fallback: ['Arial', 'sans-serif'],
          display: 'swap',
          preload: true,
        },
      ],
    };

    const template: Template = {
      name: 'Test Template with Fonts',
      output: {
        type: 'video',
        width: 1920,
        height: 1080,
        fps: 30,
        duration: 5,
      },
      inputs: [],
      fonts: fontConfig,
      composition: {
        scenes: [
          {
            id: 'scene1',
            startFrame: 0,
            endFrame: 150,
            layers: [],
          },
        ],
      },
    };

    expect(template.fonts).toBeDefined();
    expect(template.fonts?.families).toHaveLength(1);
    expect(template.fonts?.families[0].family).toBe('Inter');
  });

  it('should allow font configuration with multiple families', () => {
    const template: Template = {
      name: 'Test Template',
      output: {
        type: 'video',
        width: 1920,
        height: 1080,
      },
      inputs: [],
      fonts: {
        families: [
          {
            family: 'Inter',
            sources: [{ url: 'inter.woff2', weight: 400 }],
          },
          {
            family: 'Roboto',
            sources: [
              { url: 'roboto-regular.woff2', weight: 400 },
              { url: 'roboto-bold.woff2', weight: 700 },
            ],
            fallback: ['Arial', 'sans-serif'],
          },
        ],
        basePath: '/fonts',
      },
      composition: {
        scenes: [
          {
            id: 'scene1',
            startFrame: 0,
            endFrame: 150,
            layers: [],
          },
        ],
      },
    };

    expect(template.fonts?.families).toHaveLength(2);
    expect(template.fonts?.basePath).toBe('/fonts');
  });

  it('should allow font sources with local fonts', () => {
    const template: Template = {
      name: 'Test Template',
      output: {
        type: 'video',
        width: 1920,
        height: 1080,
      },
      inputs: [],
      fonts: {
        families: [
          {
            family: 'System Font',
            sources: [
              {
                local: ['System Font', 'SystemFont'],
                url: 'system-font-fallback.woff2',
                weight: 400,
              },
            ],
          },
        ],
      },
      composition: {
        scenes: [
          {
            id: 'scene1',
            startFrame: 0,
            endFrame: 150,
            layers: [],
          },
        ],
      },
    };

    const source = template.fonts?.families[0].sources[0];
    expect(source?.local).toEqual(['System Font', 'SystemFont']);
  });
});
