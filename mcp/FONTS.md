# Font Loading System

Rendervid supports **100+ Google Fonts** and **custom font uploads** with automatic loading and fallback handling.

## Quick Start

### Using Google Fonts

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
          "fontWeight": 700
        }
      }]
    }]
  }
}
```

### Using Custom Fonts

```json
{
  "fonts": {
    "custom": [
      {
        "family": "MyBrand",
        "source": "https://example.com/font.woff2",
        "weight": 700,
        "format": "woff2"
      }
    ]
  }
}
```

## Available Fonts

100 curated Google Fonts across categories:
- **50 Sans-Serif**: Roboto, Open Sans, Inter, Montserrat, Poppins, Lato, etc.
- **20 Serif**: Playfair Display, Merriweather, Lora, PT Serif, etc.
- **15 Monospace**: JetBrains Mono, Fira Code, Roboto Mono, etc.
- **15 Display**: Bebas Neue, Pacifico, Lobster, Oswald, etc.

## Font Configuration Options

```typescript
{
  "fonts": {
    "google": [{
      "family": "Roboto",
      "weights": [400, 700],           // Default: [400, 700]
      "styles": ["normal", "italic"],  // Default: ["normal"]
      "subsets": ["latin"],            // Default: ["latin"]
      "display": "swap"                // Default: "swap"
    }],
    "custom": [{
      "family": "MyFont",
      "source": "https://...",
      "weight": 400,
      "style": "normal",
      "format": "woff2"                // woff2, woff, ttf, otf
    }],
    "timeout": 10000                   // Font loading timeout (ms)
  }
}
```

## Features

- ✅ Automatic font loading before rendering
- ✅ Fallback fonts for graceful degradation
- ✅ Works in browser and headless environments
- ✅ 10-second timeout with error handling
- ✅ Parallel font loading for performance

## Notes

- Fonts load automatically - no manual configuration needed
- Templates without fonts work normally (backward compatible)
- Failed fonts use system fallbacks
- Custom fonts require CORS-enabled URLs
