/**
 * FontManager Usage Examples
 *
 * This file demonstrates various usage patterns for the FontManager class.
 */

import { FontManager } from './FontManager';
import type { FontConfiguration } from './types';
import type { Template } from '../types';

// ============================================================================
// Example 1: Basic Google Fonts Loading
// ============================================================================

async function example1_BasicGoogleFonts() {
  const fontManager = new FontManager();

  const result = await fontManager.loadFonts({
    google: [
      {
        family: 'Roboto',
        weights: [400, 700],
        styles: ['normal', 'italic'],
      },
    ],
  });

  console.log(`Loaded ${result.loaded.length} font variants`);
  console.log(`Time taken: ${result.loadTime}ms`);
}

// ============================================================================
// Example 2: Loading Multiple Font Families
// ============================================================================

async function example2_MultipleFamilies() {
  const fontManager = new FontManager();

  const config: FontConfiguration = {
    google: [
      {
        family: 'Roboto',
        weights: [400, 700],
        styles: ['normal'],
      },
      {
        family: 'Playfair Display',
        weights: [400, 700],
        styles: ['normal', 'italic'],
      },
      {
        family: 'Roboto Mono',
        weights: [400],
        styles: ['normal'],
      },
    ],
  };

  const result = await fontManager.loadFonts(config);

  if (result.failed.length > 0) {
    console.warn('Some fonts failed to load:', result.failed);
  }

  console.log('Successfully loaded fonts:', result.loaded);
}

// ============================================================================
// Example 3: Loading Custom Fonts
// ============================================================================

async function example3_CustomFonts() {
  const fontManager = new FontManager();

  const config: FontConfiguration = {
    custom: [
      {
        family: 'MyBrandFont',
        source: 'https://cdn.example.com/fonts/mybrand-regular.woff2',
        weight: 400,
        style: 'normal',
        format: 'woff2',
        display: 'swap',
      },
      {
        family: 'MyBrandFont',
        source: 'https://cdn.example.com/fonts/mybrand-bold.woff2',
        weight: 700,
        style: 'normal',
        format: 'woff2',
        display: 'swap',
      },
    ],
  };

  const result = await fontManager.loadFonts(config);
  console.log('Custom fonts loaded:', result.loaded);
}

// ============================================================================
// Example 4: Extracting Fonts from Template
// ============================================================================

async function example4_ExtractFromTemplate() {
  const fontManager = new FontManager();

  const template: Template = {
    name: 'Product Showcase',
    output: {
      type: 'video',
      width: 1920,
      height: 1080,
      fps: 30,
      duration: 10,
    },
    inputs: [],
    composition: {
      scenes: [
        {
          id: 'intro',
          startFrame: 0,
          endFrame: 150,
          layers: [
            {
              id: 'title',
              type: 'text',
              position: { x: 960, y: 200 },
              size: { width: 1200, height: 150 },
              props: {
                text: 'Product Showcase',
                fontFamily: 'Roboto',
                fontWeight: '700',
                fontSize: 72,
              },
            },
            {
              id: 'subtitle',
              type: 'text',
              position: { x: 960, y: 400 },
              size: { width: 1000, height: 100 },
              props: {
                text: 'The best product ever',
                fontFamily: 'Playfair Display',
                fontWeight: '400',
                fontStyle: 'italic',
                fontSize: 36,
              },
            },
          ],
        },
      ],
    },
  };

  // Extract all fonts used in the template
  const fonts = fontManager.extractFontsFromTemplate(template);

  console.log(`Template uses ${fonts.size} unique fonts:`);
  fonts.forEach(font => {
    console.log(`  - ${font.family} ${font.weight} ${font.style}`);
  });

  // Build configuration from extracted fonts
  const uniqueFamilies = new Map<string, Set<number>>();
  fonts.forEach(font => {
    if (!uniqueFamilies.has(font.family)) {
      uniqueFamilies.set(font.family, new Set());
    }
    if (font.weight) {
      uniqueFamilies.get(font.family)!.add(font.weight);
    }
  });

  const config: FontConfiguration = {
    google: Array.from(uniqueFamilies.entries()).map(([family, weights]) => ({
      family,
      weights: Array.from(weights) as (100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900)[],
    })),
  };

  const result = await fontManager.loadFonts(config);
  console.log('Loaded fonts:', result.loaded);
}

// ============================================================================
// Example 5: Using Fallback Stacks
// ============================================================================

function example5_FallbackStacks() {
  const fontManager = new FontManager();

  // Get default fallback for known font
  const robotoStack = fontManager.getFallbackStack('Roboto');
  console.log('Roboto fallback:', robotoStack);
  // Output: "'Roboto', Arial, Helvetica, sans-serif"

  // Get fallback for serif font
  const playfairStack = fontManager.getFallbackStack('Playfair Display');
  console.log('Playfair Display fallback:', playfairStack);
  // Output: "'Playfair Display', Georgia, Times New Roman, serif"

  // Use custom fallback
  const customStack = fontManager.getFallbackStack('MyCustomFont', [
    'Arial',
    'sans-serif',
  ]);
  console.log('Custom font fallback:', customStack);
  // Output: "'MyCustomFont', Arial, sans-serif"
}

// ============================================================================
// Example 6: Font Verification and Ready State
// ============================================================================

async function example6_VerificationAndReady() {
  const fontManager = new FontManager();

  // Load fonts
  await fontManager.loadFonts({
    google: [
      { family: 'Roboto', weights: [400, 700] },
    ],
  });

  // Wait for fonts to be ready
  await fontManager.waitForFontsReady();

  // Verify specific fonts are loaded
  const fontsToVerify = [
    { family: 'Roboto', weight: 400 as const, style: 'normal' as const },
    { family: 'Roboto', weight: 700 as const, style: 'normal' as const },
  ];

  const allLoaded = fontManager.verifyFontsLoaded(fontsToVerify);

  if (allLoaded) {
    console.log('All fonts verified and ready for rendering');
  } else {
    console.warn('Some fonts not loaded, will use fallbacks');
  }
}

// ============================================================================
// Example 7: Error Handling
// ============================================================================

async function example7_ErrorHandling() {
  const fontManager = new FontManager({ timeout: 5000 });

  try {
    const result = await fontManager.loadFonts({
      google: [
        { family: 'Roboto', weights: [400, 700] },
        { family: 'NonExistentFont', weights: [400] }, // This will fail
      ],
    });

    console.log('Successfully loaded:', result.loaded.length);
    console.log('Failed to load:', result.failed.length);

    if (result.failed.length > 0) {
      console.warn('Failed fonts:');
      result.failed.forEach(font => {
        console.warn(`  - ${font.family}`);
      });
    }
  } catch (error) {
    console.error('Font loading error:', error);
  }
}

// ============================================================================
// Example 8: Template with Font Configuration
// ============================================================================

async function example8_TemplateWithFonts() {
  const fontManager = new FontManager();

  const template: Template = {
    name: 'Marketing Video',
    output: {
      type: 'video',
      width: 1920,
      height: 1080,
      fps: 30,
      duration: 15,
    },
    inputs: [],
    fonts: {
      google: [
        {
          family: 'Roboto',
          weights: [400, 700],
          styles: ['normal', 'italic'],
        },
        {
          family: 'Playfair Display',
          weights: [400, 700],
        },
      ],
      fallbacks: {
        'Roboto': ['Arial', 'Helvetica', 'sans-serif'],
        'Playfair Display': ['Georgia', 'Times New Roman', 'serif'],
      },
      strategy: 'eager',
    },
    composition: {
      scenes: [
        {
          id: 'main',
          startFrame: 0,
          endFrame: 450,
          layers: [
            {
              id: 'heading',
              type: 'text',
              position: { x: 960, y: 300 },
              size: { width: 1400, height: 200 },
              props: {
                text: 'Amazing Product',
                fontFamily: 'Playfair Display',
                fontWeight: '700',
                fontSize: 96,
              },
            },
            {
              id: 'body',
              type: 'text',
              position: { x: 960, y: 600 },
              size: { width: 1200, height: 300 },
              props: {
                text: 'Experience the difference with our innovative solution',
                fontFamily: 'Roboto',
                fontWeight: '400',
                fontSize: 36,
              },
            },
          ],
        },
      ],
    },
  };

  // Load fonts from template configuration
  if (template.fonts) {
    const result = await fontManager.loadFonts(template.fonts);
    console.log(`Template fonts loaded: ${result.loaded.length}`);
    console.log(`Load time: ${result.loadTime}ms`);
  }
}

// ============================================================================
// Example 9: Performance Optimization
// ============================================================================

async function example9_PerformanceOptimization() {
  const fontManager = new FontManager();

  // Only load specific subsets for better performance
  const config: FontConfiguration = {
    google: [
      {
        family: 'Roboto',
        weights: [400, 700],
        subsets: ['latin'], // Only Latin characters
        display: 'swap', // Show fallback immediately
      },
    ],
  };

  const startTime = Date.now();
  const result = await fontManager.loadFonts(config);
  const endTime = Date.now();

  console.log(`Performance metrics:`);
  console.log(`  - Total fonts: ${result.loaded.length}`);
  console.log(`  - Load time: ${endTime - startTime}ms`);
  console.log(`  - Average per font: ${(endTime - startTime) / result.loaded.length}ms`);
}

// ============================================================================
// Example 10: Custom Timeout Configuration
// ============================================================================

async function example10_CustomTimeout() {
  // Create FontManager with custom timeout (3 seconds instead of default 10)
  const fontManager = new FontManager({ timeout: 3000 });

  const result = await fontManager.loadFonts({
    google: [
      { family: 'Roboto', weights: [400] },
    ],
  });

  console.log('Fonts loaded with custom timeout:', result.loaded);
}

// Export examples for documentation
export {
  example1_BasicGoogleFonts,
  example2_MultipleFamilies,
  example3_CustomFonts,
  example4_ExtractFromTemplate,
  example5_FallbackStacks,
  example6_VerificationAndReady,
  example7_ErrorHandling,
  example8_TemplateWithFonts,
  example9_PerformanceOptimization,
  example10_CustomTimeout,
};
