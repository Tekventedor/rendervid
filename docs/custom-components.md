# Custom Components Guide

Rendervid allows you to use custom React components in your templates. This enables you to create reusable, dynamic visualizations that go beyond the built-in components.

## Table of Contents

- [Overview](#overview)
- [Component Types](#component-types)
- [Component Interface](#component-interface)
- [Using Custom Components](#using-custom-components)
- [Input Variable Binding](#input-variable-binding)
- [Security Considerations](#security-considerations)
- [Best Practices](#best-practices)
- [Examples](#examples)

## Overview

Custom components are React components that receive animation context (frame, fps, etc.) and user-defined props. They can be:

1. **Referenced** - Pre-registered components from your registry
2. **URL-based** - Loaded dynamically from HTTPS URLs
3. **Inline** - Defined directly in the template (use with caution)

## Component Types

### 1. Reference Components (Recommended)

Reference pre-registered components by name. This is the most secure and performant option.

```json
{
  "customComponents": {
    "MyChart": {
      "type": "reference",
      "reference": "AnimatedChart",
      "description": "Reference to pre-registered chart component"
    }
  }
}
```

**Pros:**
- ✅ Most secure - components are trusted and validated
- ✅ Best performance - no loading overhead
- ✅ Type-safe when using TypeScript
- ✅ Can be version controlled with your code

**Use when:** You have components in your own codebase

### 2. URL Components

Load components dynamically from HTTPS URLs. Useful for sharing components across projects.

```json
{
  "customComponents": {
    "ExternalChart": {
      "type": "url",
      "url": "https://cdn.example.com/components/Chart.js",
      "description": "Chart component from CDN"
    }
  }
}
```

**Pros:**
- ✅ Share components across projects
- ✅ Update components without code changes
- ✅ Load components on-demand

**Cons:**
- ⚠️ Requires network access
- ⚠️ Must trust the URL source
- ⚠️ Can be blocked by domain allowlist

**Use when:** You want to share components across multiple projects or load components from a trusted CDN

### 3. Inline Components (Development Only)

Define component code directly in the template. **Not recommended for production.**

```json
{
  "customComponents": {
    "Counter": {
      "type": "inline",
      "code": "function Counter(props) { const value = Math.floor(props.from + (props.to - props.from) * Math.min(props.frame / (props.fps * 2), 1)); return React.createElement('div', { style: { fontSize: '72px', fontWeight: 'bold' } }, value); }",
      "description": "Simple animated counter"
    }
  }
}
```

**Pros:**
- ✅ No external dependencies
- ✅ Quick prototyping

**Cons:**
- ❌ Security risk - code is not validated
- ❌ Hard to maintain - code in JSON string
- ❌ No syntax highlighting or IDE support
- ❌ May be blocked by security policies

**Use when:** Rapid prototyping or testing. Never in production.

## Component Interface

All custom components receive a standardized set of props:

```typescript
interface CustomComponentProps {
  // Animation Context (provided automatically)
  frame: number;           // Current frame number (0-based)
  fps: number;             // Frames per second
  sceneDuration: number;   // Scene duration in frames
  layerSize: {            // Layer dimensions
    width: number;
    height: number;
  };

  // User-defined props (from layer.customComponent.props)
  [key: string]: unknown;
}
```

### Animation Context

- **frame**: Current frame being rendered (0-based). Use this for frame-based animations.
- **fps**: Frames per second (e.g., 30). Use to calculate time-based values.
- **sceneDuration**: Total scene duration in frames. Useful for progress calculations.
- **layerSize**: Width and height of the layer container.

### Example Component

```typescript
interface CounterProps {
  frame: number;
  fps: number;
  from: number;
  to: number;
}

function Counter(props: CounterProps) {
  // Calculate progress (0 to 1) over 2 seconds
  const progress = Math.min(props.frame / (props.fps * 2), 1);

  // Interpolate between from and to
  const value = Math.floor(
    props.from + (props.to - props.from) * progress
  );

  return (
    <div style={{ fontSize: '72px', fontWeight: 'bold' }}>
      {value}
    </div>
  );
}
```

## Using Custom Components

### Step 1: Define Custom Components

In your template, add a `customComponents` object:

```json
{
  "name": "My Video Template",
  "customComponents": {
    "AnimatedCounter": {
      "type": "url",
      "url": "https://cdn.example.com/Counter.js"
    },
    "ProgressRing": {
      "type": "reference",
      "reference": "CircularProgress"
    }
  },
  "composition": {
    "scenes": [...]
  }
}
```

### Step 2: Use in Layers

Reference custom components in your scene layers:

```json
{
  "scenes": [
    {
      "id": "main",
      "layers": [
        {
          "type": "custom",
          "customComponent": {
            "name": "AnimatedCounter",
            "props": {
              "from": 0,
              "to": 100,
              "color": "#ff0000"
            }
          },
          "position": { "x": 100, "y": 100 },
          "size": { "width": 300, "height": 200 }
        }
      ]
    }
  ]
}
```

### Step 3: Render

The renderer automatically:
1. Loads all custom components
2. Registers them in the component registry
3. Passes props and animation context during rendering

```typescript
const renderer = new BrowserRenderer();

await renderer.renderVideo({
  template: myTemplate,
  inputs: { /* ... */ }
});
```

## Input Variable Binding

Use `{{variableName}}` syntax to bind template inputs to component props:

```json
{
  "name": "Dynamic Chart",
  "inputs": [
    {
      "key": "chartTitle",
      "type": "string",
      "label": "Chart Title"
    },
    {
      "key": "chartData",
      "type": "array",
      "label": "Chart Data"
    }
  ],
  "composition": {
    "scenes": [{
      "layers": [{
        "type": "custom",
        "customComponent": {
          "name": "Chart",
          "props": {
            "title": "{{chartTitle}}",
            "data": "{{chartData}}",
            "animated": true
          }
        }
      }]
    }]
  }
}
```

When rendering:

```typescript
await renderer.renderVideo({
  template: chartTemplate,
  inputs: {
    chartTitle: "Sales 2024",
    chartData: [10, 20, 30, 40, 50]
  }
});
```

The `{{chartTitle}}` placeholder will be replaced with `"Sales 2024"` and `{{chartData}}` with the array.

### Variable Resolution

- Variables are **case-sensitive**
- Missing variables are **left unchanged**
- Variables work in **all string fields** (props, text, colors, etc.)
- Nested objects and arrays are processed recursively

## Security Considerations

### URL Component Security

When loading components from URLs:

1. **HTTPS Only** - HTTP URLs are rejected
2. **Domain Allowlist** - Optional allowlist for trusted domains
3. **Component Caching** - URLs are loaded once and cached

Configure allowed domains:

```typescript
const registry = new ComponentRegistry();
registry.setAllowedDomains(['cdn.example.com', 'components.example.com']);

const renderer = new BrowserRenderer({ registry });
```

### Inline Component Security

Inline components are validated against dangerous patterns:

- ❌ `eval()`
- ❌ `Function()`
- ❌ `innerHTML` / `outerHTML`
- ❌ `<script>` tags
- ❌ `import` / `require()`
- ❌ `window.` / `document.` / `globalThis`

**Recommendation:** Avoid inline components in production. Use URL or reference types instead.

### Best Practices

1. **Use reference type for trusted components** (most secure)
2. **Use URL type for shared components** from trusted CDNs only
3. **Avoid inline type in production** (development/testing only)
4. **Configure domain allowlist** in production environments
5. **Review component code** before using in templates
6. **Validate user inputs** before passing to components

## Best Practices

### Performance

1. **Keep components lightweight**
   - Avoid heavy computations in render
   - Use memoization for expensive calculations
   - Minimize DOM elements

2. **Use frame-based animation**
   ```typescript
   // Good: Deterministic, frame-based
   const rotation = (props.frame / props.fps) * 360;

   // Bad: Time-based (non-deterministic)
   const rotation = Date.now() / 1000 * 360;
   ```

3. **Avoid side effects**
   - No `setTimeout`, `setInterval`, `fetch`, etc.
   - Components should be pure functions of props

### Maintainability

1. **Add descriptions to components**
   ```json
   {
     "type": "url",
     "url": "https://...",
     "description": "Displays animated progress ring with percentage"
   }
   ```

2. **Document expected props**
   ```json
   {
     "propsSchema": {
       "type": "object",
       "properties": {
         "progress": { "type": "number", "min": 0, "max": 100 },
         "color": { "type": "string" }
       }
     }
   }
   ```

3. **Use TypeScript for components**
   ```typescript
   interface ProgressRingProps {
     frame: number;
     fps: number;
     progress: number;
     color: string;
   }

   export default function ProgressRing(props: ProgressRingProps) {
     // ...
   }
   ```

### Reusability

1. **Keep components generic**
   - Accept customization through props
   - Don't hardcode values

2. **Support multiple use cases**
   ```typescript
   // Good: Flexible
   function Chart(props: { type: 'bar' | 'line', data: number[] }) {
     if (props.type === 'bar') return <BarChart {...props} />;
     if (props.type === 'line') return <LineChart {...props} />;
   }
   ```

3. **Export as default**
   ```typescript
   // Component must be default export for URL loading
   export default function MyComponent(props) {
     return <div>...</div>;
   }
   ```

## Examples

### Example 1: Animated Counter

```typescript
interface CounterProps {
  frame: number;
  fps: number;
  from: number;
  to: number;
  duration?: number; // seconds
}

export default function AnimatedCounter(props: CounterProps) {
  const duration = props.duration || 2;
  const totalFrames = duration * props.fps;
  const progress = Math.min(props.frame / totalFrames, 1);

  // Easing function (ease-out)
  const eased = 1 - Math.pow(1 - progress, 3);

  const value = Math.floor(
    props.from + (props.to - props.from) * eased
  );

  return (
    <div style={{
      fontSize: '72px',
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#ffffff'
    }}>
      {value}
    </div>
  );
}
```

Template usage:

```json
{
  "customComponents": {
    "Counter": {
      "type": "url",
      "url": "https://cdn.example.com/AnimatedCounter.js"
    }
  },
  "composition": {
    "scenes": [{
      "layers": [{
        "type": "custom",
        "customComponent": {
          "name": "Counter",
          "props": {
            "from": 0,
            "to": 100,
            "duration": 3
          }
        }
      }]
    }]
  }
}
```

### Example 2: Progress Ring

```typescript
interface ProgressRingProps {
  frame: number;
  fps: number;
  sceneDuration: number;
  color?: string;
  strokeWidth?: number;
}

export default function ProgressRing(props: ProgressRingProps) {
  const progress = props.frame / props.sceneDuration;
  const color = props.color || '#3b82f6';
  const strokeWidth = props.strokeWidth || 8;

  const size = 200;
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <svg width={size} height={size}>
      {/* Background circle */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={strokeWidth}
      />
      {/* Progress circle */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${center} ${center})`}
      />
      {/* Percentage text */}
      <text
        x={center}
        y={center}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="32"
        fontWeight="bold"
        fill={color}
      >
        {Math.floor(progress * 100)}%
      </text>
    </svg>
  );
}
```

### Example 3: Typewriter Effect

```typescript
interface TypewriterProps {
  frame: number;
  fps: number;
  text: string;
  speed?: number; // characters per second
  fontSize?: string;
  color?: string;
}

export default function Typewriter(props: TypewriterProps) {
  const speed = props.speed || 10;
  const charsPerFrame = speed / props.fps;
  const visibleChars = Math.floor(props.frame * charsPerFrame);
  const displayText = props.text.substring(0, visibleChars);

  return (
    <div style={{
      fontSize: props.fontSize || '24px',
      color: props.color || '#ffffff',
      fontFamily: 'monospace',
      whiteSpace: 'pre-wrap'
    }}>
      {displayText}
      {visibleChars < props.text.length && (
        <span style={{ opacity: 0.5 }}>|</span>
      )}
    </div>
  );
}
```

### Example 4: Multiple Components in One Request

```json
{
  "name": "Dashboard Video",
  "customComponents": {
    "Counter": {
      "type": "inline",
      "code": "function Counter(props) { const value = Math.floor(props.from + (props.to - props.from) * Math.min(props.frame / (props.fps * 2), 1)); return React.createElement('div', { style: { fontSize: '48px', fontWeight: 'bold', color: props.color } }, value); }"
    },
    "ProgressBar": {
      "type": "inline",
      "code": "function ProgressBar(props) { const progress = Math.min(props.frame / props.sceneDuration, 1); return React.createElement('div', { style: { width: '100%', height: '20px', backgroundColor: '#e0e0e0', borderRadius: '10px' } }, React.createElement('div', { style: { width: (progress * 100) + '%', height: '100%', backgroundColor: props.color, borderRadius: '10px', transition: 'width 0.3s' } })); }"
    },
    "Badge": {
      "type": "inline",
      "code": "function Badge(props) { return React.createElement('div', { style: { padding: '10px 20px', backgroundColor: props.color, color: 'white', borderRadius: '20px', fontSize: '18px', fontWeight: 'bold' } }, props.text); }"
    }
  },
  "composition": {
    "scenes": [{
      "id": "dashboard",
      "layers": [
        {
          "type": "custom",
          "customComponent": {
            "name": "Counter",
            "props": { "from": 0, "to": 1000, "color": "#ff6b6b" }
          },
          "position": { "x": 100, "y": 100 }
        },
        {
          "type": "custom",
          "customComponent": {
            "name": "Counter",
            "props": { "from": 0, "to": 500, "color": "#4ecdc4" }
          },
          "position": { "x": 400, "y": 100 }
        },
        {
          "type": "custom",
          "customComponent": {
            "name": "ProgressBar",
            "props": { "color": "#95e1d3" }
          },
          "position": { "x": 100, "y": 250 }
        },
        {
          "type": "custom",
          "customComponent": {
            "name": "Badge",
            "props": { "text": "Live", "color": "#ff6b6b" }
          },
          "position": { "x": 700, "y": 100 }
        }
      ]
    }]
  }
}
```

## Troubleshooting

### Component not found

**Error:** `Custom component "MyComponent" not found`

**Solutions:**
1. Check component name matches exactly (case-sensitive)
2. Ensure component is in `customComponents` object
3. For reference type, verify component is pre-registered
4. For URL type, check URL is accessible

### URL loading fails

**Error:** `Failed to load component from https://...`

**Solutions:**
1. Verify URL is HTTPS (HTTP not allowed)
2. Check domain is in allowlist (if configured)
3. Ensure component exports default
4. Check network connectivity

### Inline code errors

**Error:** `Code contains forbidden construct`

**Solutions:**
1. Remove dangerous patterns (eval, innerHTML, etc.)
2. Remove import/require statements
3. Avoid accessing window/document
4. Use reference or URL type instead

### Component doesn't animate

**Problem:** Component shows static content

**Solutions:**
1. Ensure component uses `props.frame` for animation
2. Check animation calculation is correct
3. Verify props are passed to component
4. Test with simple frame-based value: `props.frame % 60`

## Further Reading

- [Rendervid Core Documentation](../README.md)
- [Template Schema](./template-schema.md)
- [Animation System](./animation.md)
- [Component Registry API](./component-registry.md)
