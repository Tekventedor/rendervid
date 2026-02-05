# Font Loading System

Rendervid provides comprehensive font loading with 100+ Google Fonts, custom font support, and automatic loading across browser and headless environments.

## Features

- ✅ **100+ Google Fonts** - Curated catalog across 4 categories
- ✅ **Custom Fonts** - Load fonts from URLs (WOFF2, WOFF, TTF, OTF)
- ✅ **Automatic Loading** - Fonts load before rendering starts
- ✅ **Fallback System** - Platform-specific fallbacks for reliability
- ✅ **Cross-Environment** - Works in browser and Node.js/Puppeteer
- ✅ **Type-Safe** - Full TypeScript support with intelligent autocomplete

## Quick Start

### Using Google Fonts

Add fonts to your template's `fonts` configuration:

```json
{
  "fonts": {
    "google": [
      {
        "family": "Roboto",
        "weights": [400, 700],
        "styles": ["normal"]
      }
    ]
  },
  "composition": {
    "scenes": [{
      "layers": [{
        "type": "text",
        "props": {
          "text": "Hello World",
          "fontFamily": "Roboto",
          "fontWeight": 700,
          "fontSize": 72
        }
      }]
    }]
  }
}
```

### Using Custom Fonts

Load fonts from external URLs:

```json
{
  "fonts": {
    "custom": [
      {
        "family": "MyBrandFont",
        "source": "https://example.com/fonts/brand.woff2",
        "weight": 700,
        "style": "normal",
        "format": "woff2"
      }
    ],
    "fallbacks": {
      "MyBrandFont": ["Arial", "sans-serif"]
    }
  }
}
```

## Font Catalog

### Sans-Serif Fonts (50)

**Modern Sans:**
Roboto, Open Sans, Lato, Montserrat, Poppins, Inter, Raleway, Nunito, Ubuntu, Work Sans, DM Sans, Plus Jakarta Sans, Outfit, Space Grotesk, Sora, Manrope, Epilogue, Figtree, Albert Sans, Sono

**Humanist Sans:**
Mulish, Quicksand, Be Vietnam Pro, Lexend, Heebo, Karla, Barlow, Red Hat Display, Archivo, Public Sans

**Grotesque Sans:**
Exo 2, Source Sans 3, Rubik, Overpass, Oxygen, Titillium Web, Abel, Asap, Josefin Sans, Noto Sans, Jost, Urbanist, Signika, IBM Plex Sans, Saira, Catamaran, Hind, Dosis, Gothic A1, Lemon

### Serif Fonts (20)

Playfair Display, Merriweather, Lora, PT Serif, Crimson Text, EB Garamond, Libre Baskerville, Bitter, Spectral, Noto Serif, Cormorant Garamond, Zilla Slab, Arvo, Vollkorn, Cardo, Neuton, Rokkitt, Alegreya, Old Standard TT, Gelasio

### Monospace Fonts (15)

Roboto Mono, JetBrains Mono, Fira Code, Source Code Pro, IBM Plex Mono, Inconsolata, Space Mono, Courier Prime, Overpass Mono, Ubuntu Mono, PT Mono, Noto Sans Mono, Anonymous Pro, VT323, Major Mono Display

### Display Fonts (15)

Bebas Neue, Oswald, Righteous, Bangers, Fredoka, Abril Fatface, Pacifico, Lobster, Dancing Script, Great Vibes, Caveat, Permanent Marker, Shadows Into Light, Satisfy, Orbitron

## Configuration Options

### Google Fonts Configuration

```typescript
{
  "fonts": {
    "google": [{
      "family": "Roboto",           // Font family name
      "weights": [400, 700],        // Available: 100-900
      "styles": ["normal", "italic"], // Default: ["normal"]
      "subsets": ["latin"],         // Character subsets
      "display": "swap"             // Font display strategy
    }]
  }
}
```

#### Font Display Strategies

- **`swap`** (default) - Show fallback immediately, swap when loaded
- **`block`** - Wait for font (max 3s), show fallback if timeout
- **`fallback`** - Show fallback after 100ms
- **`optional`** - Show fallback if font not loaded in first render

### Custom Fonts Configuration

```typescript
{
  "fonts": {
    "custom": [{
      "family": "MyFont",           // Font family name
      "source": "https://...",      // Font file URL
      "weight": 400,                // Font weight (100-900)
      "style": "normal",            // normal | italic
      "format": "woff2",            // woff2, woff, ttf, otf
      "unicodeRange": "U+0000-00FF" // Optional: character range
    }]
  }
}
```

### Global Options

```typescript
{
  "fonts": {
    "timeout": 10000,               // Loading timeout (ms), default: 10000
    "fallbacks": {                  // Custom fallback stacks
      "MyFont": ["Arial", "sans-serif"]
    }
  }
}
```

## Programmatic API

### FontManager

```typescript
import { FontManager } from '@rendervid/core';

const fontManager = new FontManager();

// Load fonts
const result = await fontManager.loadFonts({
  google: [
    { family: 'Roboto', weights: [400, 700] }
  ]
});

console.log(result.loaded);  // Successfully loaded fonts
console.log(result.failed);  // Failed fonts (if any)

// Wait for fonts to be ready
await fontManager.waitForFontsReady();

// Verify specific font is loaded
const isLoaded = fontManager.verifyFontsLoaded([
  { family: 'Roboto', weight: 700, style: 'normal' }
]);

// Get fallback stack
const fallback = fontManager.getFallbackStack('Roboto');
// Returns: "'Roboto', Arial, Helvetica Neue, sans-serif"
```

### Font Catalog Queries

```typescript
import {
  getFontCatalog,
  getFontsByCategory,
  getFontMetadata,
  getPopularFonts,
  searchFonts
} from '@rendervid/core';

// Get all 100 fonts
const allFonts = getFontCatalog();

// Filter by category
const sansFonts = getFontsByCategory('sans-serif');  // 50 fonts

// Get specific font metadata
const roboto = getFontMetadata('Roboto');
console.log(roboto.weights);  // [100, 300, 400, 500, 700, 900]
console.log(roboto.variable);  // false

// Get 50 most popular fonts
const popular = getPopularFonts();

// Search fonts
const monospaced = searchFonts('mono');  // JetBrains Mono, Roboto Mono, etc.
```

### Fallback Font System

```typescript
import {
  getFallbackStack,
  getFallbackFonts,
  getPlatformOptimizedStack
} from '@rendervid/core';

// Get CSS font-family string with fallbacks
const stack = getFallbackStack('Roboto');
// "'Roboto', Arial, Helvetica Neue, sans-serif"

// Get array of fallback fonts
const fallbacks = getFallbackFonts('Roboto');
// ['Arial', 'Helvetica Neue', 'Helvetica', 'sans-serif']

// Get platform-optimized stack
const macStack = getPlatformOptimizedStack('Roboto', 'macos');
// "'Roboto', -apple-system, BlinkMacSystemFont, Arial, sans-serif"
```

## How It Works

### Font Loading Flow

1. **Template Parsing** - Extract fonts from template configuration
2. **Font Resolution** - Determine Google Fonts vs custom fonts
3. **Parallel Loading** - Load all fonts simultaneously for speed
4. **Verification** - Use `document.fonts.check()` to verify loading
5. **Timeout Handling** - 10-second timeout with fallback to system fonts
6. **Rendering** - Begin video/image rendering after fonts ready

### In Browser Environment

```typescript
// BrowserRenderer automatically loads fonts
const renderer = new BrowserRenderer();
await renderer.renderVideo({
  template: {
    fonts: {
      google: [{ family: 'Roboto', weights: [700] }]
    },
    composition: { /* ... */ }
  }
});
// Fonts load before first frame renders
```

### In Headless Environment (Puppeteer)

```typescript
// NodeRenderer injects FontManager into Puppeteer page
const renderer = new NodeRenderer();
await renderer.renderVideo({
  template: {
    fonts: {
      google: [{ family: 'Roboto', weights: [700] }]
    },
    composition: { /* ... */ }
  }
});
// FontManager injected into page context
// Fonts load before frame capture begins
```

## Error Handling

### Timeout Handling

If fonts don't load within 10 seconds:
- ✅ Warning logged to console
- ✅ Rendering continues with system fallback fonts
- ✅ No errors thrown - graceful degradation

```typescript
// Custom timeout
{
  "fonts": {
    "timeout": 5000,  // 5 seconds
    "google": [{ "family": "Roboto" }]
  }
}
```

### Failed Font Loading

If a font fails to load:
- ✅ Other fonts continue loading
- ✅ Failed font reported in result
- ✅ Fallback fonts used automatically

```typescript
const result = await fontManager.loadFonts(config);
if (result.failed.length > 0) {
  console.warn('Failed fonts:', result.failed);
  // Rendering still proceeds with fallbacks
}
```

## Performance

### Font Loading Speed

- **Parallel Loading** - All fonts load simultaneously
- **WOFF2 Format** - Smallest file size (30-60% smaller than TTF)
- **Google Fonts CDN** - Global edge network for fast delivery
- **Browser Caching** - Fonts cached for 1 year

### Optimization Tips

1. **Load only needed weights** - Don't load all 9 weights if you only use 2
2. **Specify subsets** - Use `["latin"]` instead of loading all character sets
3. **Use WOFF2** - Smallest format with best compression
4. **Preload critical fonts** - Use `display: "block"` for above-the-fold text

```json
{
  "fonts": {
    "google": [{
      "family": "Roboto",
      "weights": [400, 700],        // Only 2 weights instead of 9
      "subsets": ["latin"],         // Only Latin characters
      "display": "block"            // Don't show fallback for critical text
    }]
  }
}
```

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Google Fonts | ✅ | ✅ | ✅ | ✅ |
| Custom Fonts | ✅ | ✅ | ✅ | ✅ |
| WOFF2 | ✅ | ✅ | ✅ | ✅ |
| document.fonts API | ✅ | ✅ | ✅ | ✅ |

### Headless Chrome

- ✅ Full font support in Puppeteer
- ✅ Hardware acceleration flags for quality
- ✅ Font verification before capture
- ✅ System fonts available in Docker

## Troubleshooting

### Fonts Not Loading in Headless

**Problem:** Fonts don't appear in Puppeteer renders

**Solution:**
```bash
# Install system fonts in Docker
RUN apt-get install -y \
  fonts-liberation \
  fonts-noto-cjk \
  fontconfig

RUN fc-cache -f -v
```

### CORS Errors with Custom Fonts

**Problem:** Custom font fails with CORS error

**Solution:**
- Ensure font server sends `Access-Control-Allow-Origin: *` header
- Or use data URLs: `"source": "data:font/woff2;base64,..."`

### Font Not Rendering Correctly

**Problem:** Font appears but looks wrong

**Solution:**
```typescript
// Check if correct weight/style loaded
const isLoaded = document.fonts.check('700 16px Roboto');
console.log(isLoaded);  // Should be true
```

## Examples

See complete examples in:
- `examples/showcase/all-fonts/` - Showcase of all 100 fonts
- `mcp/FONTS.md` - MCP server font usage guide
- `packages/core/src/fonts/FontManager.example.ts` - Programmatic API examples
- `packages/core/src/fonts/catalog.example.ts` - Catalog query examples

## API Reference

- **FontManager** - Main orchestrator class
- **FontConfiguration** - Template font configuration interface
- **GoogleFontDefinition** - Google Font specification
- **CustomFontDefinition** - Custom font specification
- **Font Catalog Functions** - Query available fonts
- **Fallback Functions** - Generate fallback font stacks

See TypeScript definitions in `@rendervid/core` for complete API documentation.
