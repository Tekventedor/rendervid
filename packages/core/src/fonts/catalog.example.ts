/**
 * Font Catalog Usage Examples
 *
 * This file demonstrates various ways to use the font catalog API.
 */

import {
  getFontCatalog,
  getFontsByCategory,
  getFontMetadata,
  getPopularFonts,
  getVariableFonts,
  searchFonts,
  getFontsByWeight,
  getFontsWithItalic,
  getCatalogStats,
  isFontAvailable,
  getRandomFonts,
  type FontMetadata,
} from './catalog';

// Example 1: Get all fonts
function example1() {
  console.log('=== Example 1: Get All Fonts ===');
  const allFonts = getFontCatalog();
  console.log(`Total fonts in catalog: ${allFonts.length}`);
  console.log(`First 5 fonts:`, allFonts.slice(0, 5).map(f => f.family));
}

// Example 2: Filter by category
function example2() {
  console.log('\n=== Example 2: Filter by Category ===');
  const categories = ['sans-serif', 'serif', 'monospace', 'display'] as const;

  categories.forEach(category => {
    const fonts = getFontsByCategory(category);
    console.log(`${category}: ${fonts.length} fonts`);
    console.log(`  Examples: ${fonts.slice(0, 3).map(f => f.family).join(', ')}`);
  });
}

// Example 3: Get specific font metadata
function example3() {
  console.log('\n=== Example 3: Get Specific Font ===');
  const fontName = 'Roboto';
  const font = getFontMetadata(fontName);

  if (font) {
    console.log(`Font: ${font.family}`);
    console.log(`Category: ${font.category}`);
    console.log(`Weights: ${font.weights.join(', ')}`);
    console.log(`Styles: ${font.styles.join(', ')}`);
    console.log(`Variable: ${font.variable}`);
    console.log(`Popularity: #${font.popularity}`);
  }
}

// Example 4: Get popular fonts
function example4() {
  console.log('\n=== Example 4: Top 10 Popular Fonts ===');
  const popular = getPopularFonts();

  popular.slice(0, 10).forEach((font, index) => {
    console.log(`${index + 1}. ${font.family} (${font.category}${font.variable ? ', Variable' : ''})`);
  });
}

// Example 5: Search for fonts
function example5() {
  console.log('\n=== Example 5: Search Fonts ===');

  const searches = ['mono', 'sans', 'display'];
  searches.forEach(query => {
    const results = searchFonts(query);
    console.log(`Search "${query}": ${results.length} results`);
    console.log(`  ${results.slice(0, 3).map(f => f.family).join(', ')}`);
  });
}

// Example 6: Get variable fonts
function example6() {
  console.log('\n=== Example 6: Variable Fonts ===');
  const variableFonts = getVariableFonts();
  console.log(`Variable fonts: ${variableFonts.length}`);
  console.log(`Examples: ${variableFonts.slice(0, 5).map(f => f.family).join(', ')}`);
}

// Example 7: Filter by weight
function example7() {
  console.log('\n=== Example 7: Filter by Weight ===');

  // Fonts that have both 400 and 700 weights
  const standard = getFontsByWeight([400, 700], true);
  console.log(`Fonts with 400 & 700 weights: ${standard.length}`);

  // Fonts with extreme weights
  const extremes = getFontsByWeight([100, 900], false);
  console.log(`Fonts with 100 or 900 weight: ${extremes.length}`);
}

// Example 8: Get fonts with italic
function example8() {
  console.log('\n=== Example 8: Fonts with Italic ===');
  const italicFonts = getFontsWithItalic();
  console.log(`Fonts with italic support: ${italicFonts.length}`);
  console.log(`Examples: ${italicFonts.slice(0, 5).map(f => f.family).join(', ')}`);
}

// Example 9: Catalog statistics
function example9() {
  console.log('\n=== Example 9: Catalog Statistics ===');
  const stats = getCatalogStats();
  console.log(`Total fonts: ${stats.total}`);
  console.log('By category:');
  Object.entries(stats.byCategory).forEach(([category, count]) => {
    console.log(`  ${category}: ${count}`);
  });
  console.log(`Variable fonts: ${stats.variable}`);
  console.log(`Fonts with italic: ${stats.withItalic}`);
}

// Example 10: Check font availability
function example10() {
  console.log('\n=== Example 10: Check Availability ===');
  const fontsToCheck = ['Roboto', 'Comic Sans', 'Inter', 'Arial'];

  fontsToCheck.forEach(font => {
    const available = isFontAvailable(font);
    console.log(`${font}: ${available ? '✓ Available' : '✗ Not available'}`);
  });
}

// Example 11: Get random fonts
function example11() {
  console.log('\n=== Example 11: Random Fonts ===');
  const random = getRandomFonts(5);
  console.log('5 random fonts:');
  random.forEach(font => {
    console.log(`  - ${font.family} (${font.category})`);
  });
}

// Example 12: Build a font picker
function example12() {
  console.log('\n=== Example 12: Font Picker Data ===');

  interface FontPickerOption {
    label: string;
    value: string;
    category: string;
    preview: string;
  }

  // Get popular fonts for the picker
  const popularFonts = getPopularFonts().slice(0, 20);

  const pickerOptions: FontPickerOption[] = popularFonts.map(font => ({
    label: font.family,
    value: font.family,
    category: font.category,
    preview: font.preview,
  }));

  console.log('Font picker options (top 20):');
  pickerOptions.forEach((opt, index) => {
    console.log(`${index + 1}. ${opt.label} - ${opt.category}`);
  });
}

// Example 13: Font recommendations based on use case
function example13() {
  console.log('\n=== Example 13: Font Recommendations ===');

  interface UseCase {
    name: string;
    category: string;
    requiresItalic: boolean;
    minWeights: number[];
  }

  const useCases: UseCase[] = [
    {
      name: 'Body Text',
      category: 'sans-serif',
      requiresItalic: true,
      minWeights: [400, 700],
    },
    {
      name: 'Code Blocks',
      category: 'monospace',
      requiresItalic: false,
      minWeights: [400],
    },
    {
      name: 'Headings',
      category: 'display',
      requiresItalic: false,
      minWeights: [700],
    },
  ];

  useCases.forEach(useCase => {
    let fonts = getFontsByCategory(useCase.category as any);

    if (useCase.requiresItalic) {
      fonts = fonts.filter(f => f.styles.includes('italic'));
    }

    fonts = fonts.filter(f =>
      useCase.minWeights.every(w => f.weights.includes(w))
    );

    console.log(`\n${useCase.name}:`);
    console.log(`  Recommended: ${fonts.slice(0, 3).map(f => f.family).join(', ')}`);
  });
}

// Example 14: Font pairing suggestions
function example14() {
  console.log('\n=== Example 14: Font Pairing Suggestions ===');

  // Common pairing: Sans-serif for headings, Serif for body
  const headingFonts = getFontsByCategory('sans-serif')
    .filter(f => f.weights.includes(700))
    .slice(0, 3);

  const bodyFonts = getFontsByCategory('serif')
    .filter(f => f.styles.includes('italic'))
    .slice(0, 3);

  console.log('Suggested pairings:');
  headingFonts.forEach((heading, i) => {
    const body = bodyFonts[i % bodyFonts.length];
    console.log(`  ${heading.family} + ${body.family}`);
  });
}

// Example 15: Export font configuration
function example15() {
  console.log('\n=== Example 15: Export Font Configuration ===');

  const selectedFont = getFontMetadata('Inter');

  if (selectedFont) {
    const config = {
      family: selectedFont.family,
      weights: selectedFont.weights,
      styles: selectedFont.styles,
      subsets: selectedFont.subsets,
      display: 'swap',
    };

    console.log('Font configuration:');
    console.log(JSON.stringify(config, null, 2));
  }
}

// Run all examples
export function runAllExamples() {
  example1();
  example2();
  example3();
  example4();
  example5();
  example6();
  example7();
  example8();
  example9();
  example10();
  example11();
  example12();
  example13();
  example14();
  example15();
}

// Uncomment to run examples:
// runAllExamples();
