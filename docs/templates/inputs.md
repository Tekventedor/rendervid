# Input Definitions

Inputs make templates customizable at render time.

## Input Structure

```typescript
interface InputDefinition {
  key: string;                     // Unique identifier
  type: InputType;                 // Data type
  label: string;                   // Display label
  description: string;             // Description for users/AI
  required: boolean;               // Whether input is required
  default?: unknown;               // Default value
  validation?: InputValidation;    // Validation rules
  ui?: InputUI;                    // UI hints
}
```

## Input Types

### String

Text input for titles, descriptions, etc.

```json
{
  "key": "title",
  "type": "string",
  "label": "Title",
  "description": "The main headline text",
  "required": true,
  "default": "Hello World",
  "validation": {
    "minLength": 1,
    "maxLength": 100
  }
}
```

### Number

Numeric input for quantities, values, etc.

```json
{
  "key": "price",
  "type": "number",
  "label": "Price",
  "description": "Product price in dollars",
  "required": true,
  "validation": {
    "min": 0,
    "max": 10000,
    "step": 0.01
  }
}
```

For integers:

```json
{
  "key": "quantity",
  "type": "number",
  "label": "Quantity",
  "description": "Number of items",
  "required": true,
  "validation": {
    "min": 1,
    "max": 100,
    "integer": true
  }
}
```

### Boolean

Toggle for on/off options.

```json
{
  "key": "showPrice",
  "type": "boolean",
  "label": "Show Price",
  "description": "Whether to display the price",
  "required": false,
  "default": true
}
```

### Color

Color picker input.

```json
{
  "key": "brandColor",
  "type": "color",
  "label": "Brand Color",
  "description": "Primary brand color",
  "required": false,
  "default": "#3B82F6"
}
```

Supported formats:
- Hex: `#FF5500`, `#F50`
- RGB: `rgb(255, 85, 0)`
- RGBA: `rgba(255, 85, 0, 0.5)`
- Named: `red`, `blue`, etc.

### URL

URL input for images, videos, etc.

```json
{
  "key": "productImage",
  "type": "url",
  "label": "Product Image",
  "description": "URL to product image",
  "required": true,
  "validation": {
    "allowedTypes": ["image"]
  }
}
```

Allowed types: `image`, `video`, `audio`, `font`

### Enum

Select from predefined options.

```json
{
  "key": "style",
  "type": "enum",
  "label": "Style",
  "description": "Visual style preset",
  "required": true,
  "default": "modern",
  "validation": {
    "options": [
      { "value": "modern", "label": "Modern" },
      { "value": "classic", "label": "Classic" },
      { "value": "minimal", "label": "Minimal" },
      { "value": "bold", "label": "Bold" }
    ]
  }
}
```

### Rich Text

Formatted text with HTML/Markdown support.

```json
{
  "key": "description",
  "type": "richtext",
  "label": "Description",
  "description": "Product description with formatting",
  "required": false,
  "ui": {
    "rows": 4
  }
}
```

### Date

Date input.

```json
{
  "key": "eventDate",
  "type": "date",
  "label": "Event Date",
  "description": "Date of the event",
  "required": true
}
```

### Array

List of values.

```json
{
  "key": "features",
  "type": "array",
  "label": "Features",
  "description": "List of product features",
  "required": true,
  "validation": {
    "minItems": 1,
    "maxItems": 5,
    "itemType": {
      "type": "string"
    }
  }
}
```

For complex items:

```json
{
  "key": "testimonials",
  "type": "array",
  "label": "Testimonials",
  "description": "Customer testimonials",
  "required": true,
  "validation": {
    "minItems": 1,
    "maxItems": 3,
    "itemType": {
      "type": "object",
      "properties": {
        "quote": { "type": "string" },
        "author": { "type": "string" },
        "avatar": { "type": "url" }
      }
    }
  }
}
```

## Validation Rules

### String Validation

```typescript
interface StringValidation {
  minLength?: number;    // Minimum length
  maxLength?: number;    // Maximum length
  pattern?: string;      // Regex pattern
}
```

Example with pattern:

```json
{
  "key": "hashtag",
  "type": "string",
  "label": "Hashtag",
  "validation": {
    "pattern": "^#[a-zA-Z0-9]+$"
  }
}
```

### Number Validation

```typescript
interface NumberValidation {
  min?: number;          // Minimum value
  max?: number;          // Maximum value
  step?: number;         // Step increment
  integer?: boolean;     // Must be integer
}
```

### URL Validation

```typescript
interface URLValidation {
  allowedTypes?: ('image' | 'video' | 'audio' | 'font')[];
}
```

### Array Validation

```typescript
interface ArrayValidation {
  minItems?: number;
  maxItems?: number;
  itemType?: InputDefinition;
}
```

## UI Hints

```typescript
interface InputUI {
  placeholder?: string;  // Placeholder text
  helpText?: string;     // Help text below input
  group?: string;        // Group name
  order?: number;        // Display order
  hidden?: boolean;      // Hide from UI
  rows?: number;         // Rows for multiline
  accept?: string;       // File accept attribute
}
```

Example:

```json
{
  "key": "description",
  "type": "string",
  "label": "Description",
  "description": "Product description",
  "required": false,
  "ui": {
    "placeholder": "Enter a brief description...",
    "helpText": "Keep it under 200 characters for best results",
    "group": "Content",
    "order": 2,
    "rows": 3
  }
}
```

## Input Binding

### Binding to Layer Properties

Use `inputKey` to bind inputs to layers:

```json
{
  "inputs": [
    { "key": "headline", "type": "string", "label": "Headline", "required": true }
  ],
  "composition": {
    "scenes": [{
      "layers": [{
        "id": "title",
        "type": "text",
        "inputKey": "headline",
        "props": {
          "fontSize": 64,
          "color": "#FFFFFF"
        }
      }]
    }]
  }
}
```

The `inputKey` automatically binds to the primary property:
- `text` layers: binds to `props.text`
- `image` layers: binds to `props.src`
- `video` layers: binds to `props.src`
- `audio` layers: binds to `props.src`

### Binding to Specific Properties

Use `inputProperty` to bind to a specific property:

```json
{
  "inputKey": "backgroundColor",
  "inputProperty": "props.backgroundColor"
}
```

### Template Variables

Use `{{variable}}` syntax for inline binding:

```json
{
  "props": {
    "text": "Hello, {{userName}}!",
    "color": "{{textColor}}"
  }
}
```

## Complete Example

```json
{
  "inputs": [
    {
      "key": "productName",
      "type": "string",
      "label": "Product Name",
      "description": "Name of the product",
      "required": true,
      "validation": {
        "minLength": 1,
        "maxLength": 50
      },
      "ui": {
        "placeholder": "Enter product name",
        "group": "Product Info"
      }
    },
    {
      "key": "productImage",
      "type": "url",
      "label": "Product Image",
      "description": "Product image URL",
      "required": true,
      "validation": {
        "allowedTypes": ["image"]
      },
      "ui": {
        "group": "Product Info"
      }
    },
    {
      "key": "price",
      "type": "number",
      "label": "Price",
      "description": "Product price",
      "required": true,
      "validation": {
        "min": 0,
        "max": 10000,
        "step": 0.01
      },
      "ui": {
        "group": "Product Info"
      }
    },
    {
      "key": "showPrice",
      "type": "boolean",
      "label": "Show Price",
      "description": "Display price on video",
      "required": false,
      "default": true,
      "ui": {
        "group": "Display Options"
      }
    },
    {
      "key": "accentColor",
      "type": "color",
      "label": "Accent Color",
      "description": "Brand accent color",
      "required": false,
      "default": "#3B82F6",
      "ui": {
        "group": "Branding"
      }
    },
    {
      "key": "style",
      "type": "enum",
      "label": "Style",
      "description": "Visual style preset",
      "required": true,
      "default": "modern",
      "validation": {
        "options": [
          { "value": "modern", "label": "Modern" },
          { "value": "classic", "label": "Classic" },
          { "value": "minimal", "label": "Minimal" }
        ]
      },
      "ui": {
        "group": "Branding"
      }
    },
    {
      "key": "features",
      "type": "array",
      "label": "Features",
      "description": "Product features (up to 5)",
      "required": false,
      "validation": {
        "minItems": 0,
        "maxItems": 5,
        "itemType": {
          "type": "string"
        }
      },
      "ui": {
        "group": "Product Info"
      }
    }
  ],
  "defaults": {
    "productName": "New Product",
    "price": 99.99,
    "showPrice": true,
    "accentColor": "#3B82F6",
    "style": "modern",
    "features": []
  }
}
```

## Using Inputs at Render Time

```typescript
const result = await renderer.renderVideo({
  template,
  inputs: {
    productName: 'Amazing Widget',
    productImage: 'https://example.com/widget.png',
    price: 49.99,
    showPrice: true,
    accentColor: '#FF5500',
    style: 'modern',
    features: ['Fast', 'Reliable', 'Easy to use']
  }
});
```

## Related Documentation

- [Template Schema](/templates/schema) - Complete template reference
- [Layers](/templates/layers) - Layer types
- [Validation](/api/core/validation) - Input validation
