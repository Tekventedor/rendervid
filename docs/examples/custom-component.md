# Custom Components Example

Create and use custom React components in Rendervid templates.

## Overview

Custom components allow you to create complex, reusable visual elements with full React and CSS support.

## Creating a Custom Component

### Basic Component

```tsx
// components/Callout.tsx
import React from 'react';

interface CalloutProps {
  title: string;
  message: string;
  icon?: string;
  color?: string;
  frame: number;  // Always receives current frame
}

export function Callout({
  title,
  message,
  icon = 'info',
  color = '#3B82F6',
  frame,
}: CalloutProps) {
  // Animate based on frame
  const opacity = Math.min(frame / 20, 1);
  const translateY = 20 * (1 - opacity);

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: 16,
      padding: 24,
      boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
      borderLeft: `4px solid ${color}`,
      opacity,
      transform: `translateY(${translateY}px)`,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
      }}>
        <span style={{ fontSize: 24 }}>{icon}</span>
        <h3 style={{
          margin: 0,
          fontSize: 20,
          fontWeight: 600,
          color: '#1E293B',
        }}>
          {title}
        </h3>
      </div>
      <p style={{
        margin: 0,
        fontSize: 16,
        color: '#64748B',
        lineHeight: 1.5,
      }}>
        {message}
      </p>
    </div>
  );
}
```

### Registering the Component

```typescript
import { RendervidEngine } from '@rendervid/core';
import { Callout } from './components/Callout';

const engine = new RendervidEngine();

// Register with optional schema
engine.components.register('Callout', Callout, {
  type: 'object',
  properties: {
    title: { type: 'string', description: 'Callout title' },
    message: { type: 'string', description: 'Callout message' },
    icon: { type: 'string', description: 'Icon emoji' },
    color: { type: 'string', description: 'Accent color' },
  },
  required: ['title', 'message'],
});
```

### Using in a Template

```json
{
  "name": "Callout Demo",
  "output": { "type": "video", "width": 1920, "height": 1080, "fps": 30, "duration": 5 },
  "inputs": [
    { "key": "title", "type": "string", "label": "Title", "required": true },
    { "key": "message", "type": "string", "label": "Message", "required": true }
  ],
  "composition": {
    "scenes": [{
      "id": "main",
      "startFrame": 0,
      "endFrame": 150,
      "backgroundColor": "#F8FAFC",
      "layers": [{
        "id": "callout",
        "type": "custom",
        "position": { "x": 460, "y": 340 },
        "size": { "width": 1000, "height": 400 },
        "customComponent": {
          "name": "Callout",
          "props": {
            "title": "{{title}}",
            "message": "{{message}}",
            "icon": "info",
            "color": "#3B82F6"
          }
        },
        "props": {}
      }]
    }]
  }
}
```

## Advanced: Animated Card Component

```tsx
// components/AnimatedCard.tsx
import React from 'react';

interface AnimatedCardProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  accentColor?: string;
  frame: number;
  animationDelay?: number;
}

export function AnimatedCard({
  title,
  subtitle,
  imageUrl,
  accentColor = '#8B5CF6',
  frame,
  animationDelay = 0,
}: AnimatedCardProps) {
  const adjustedFrame = frame - animationDelay;

  // Entrance animation
  const entranceProgress = Math.min(Math.max(adjustedFrame / 30, 0), 1);
  const entranceEased = 1 - Math.pow(1 - entranceProgress, 3);

  // Continuous hover effect
  const hoverPhase = adjustedFrame > 30 ? (adjustedFrame - 30) / 60 : 0;
  const hoverY = Math.sin(hoverPhase * Math.PI * 2) * 3;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      opacity: entranceEased,
      transform: `translateY(${(1 - entranceEased) * 50 + hoverY}px) scale(${0.9 + entranceEased * 0.1})`,
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: 24,
        overflow: 'hidden',
        height: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      }}>
        {imageUrl && (
          <div style={{
            height: '60%',
            backgroundColor: '#E2E8F0',
            overflow: 'hidden',
          }}>
            <img
              src={imageUrl}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `scale(${1 + (adjustedFrame / 200) * 0.1})`,
              }}
            />
          </div>
        )}

        <div style={{ padding: 32 }}>
          <div style={{
            width: 60,
            height: 4,
            backgroundColor: accentColor,
            borderRadius: 2,
            marginBottom: 16,
            transform: `scaleX(${entranceEased})`,
            transformOrigin: 'left',
          }} />

          <h2 style={{
            margin: 0,
            fontSize: 32,
            fontWeight: 700,
            color: '#1E293B',
            opacity: Math.min(Math.max((adjustedFrame - 10) / 20, 0), 1),
          }}>
            {title}
          </h2>

          {subtitle && (
            <p style={{
              margin: '12px 0 0',
              fontSize: 18,
              color: '#64748B',
              opacity: Math.min(Math.max((adjustedFrame - 20) / 20, 0), 1),
            }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
```

## Using Tailwind CSS

If Tailwind is configured, use `className`:

```tsx
// components/TailwindCard.tsx
import React from 'react';

interface TailwindCardProps {
  title: string;
  description: string;
  frame: number;
}

export function TailwindCard({ title, description, frame }: TailwindCardProps) {
  const opacity = Math.min(frame / 20, 1);

  return (
    <div
      className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
      style={{ opacity }}
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        {title}
      </h2>
      <p className="text-lg text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
```

## Interactive Elements

Components can respond to frame changes for animations:

```tsx
// components/Typewriter.tsx
import React from 'react';

interface TypewriterProps {
  text: string;
  speed?: number;  // characters per frame
  frame: number;
  color?: string;
  fontSize?: number;
}

export function Typewriter({
  text,
  speed = 0.5,
  frame,
  color = '#FFFFFF',
  fontSize = 48,
}: TypewriterProps) {
  const charactersToShow = Math.floor(frame * speed);
  const displayText = text.slice(0, charactersToShow);
  const showCursor = frame % 30 < 15;

  return (
    <div style={{
      fontFamily: 'monospace',
      fontSize,
      color,
      whiteSpace: 'pre-wrap',
    }}>
      {displayText}
      {charactersToShow < text.length && (
        <span style={{ opacity: showCursor ? 1 : 0 }}>|</span>
      )}
    </div>
  );
}
```

## Complex Data Visualization

```tsx
// components/RadialProgress.tsx
import React from 'react';

interface RadialProgressProps {
  value: number;
  max: number;
  label: string;
  color?: string;
  frame: number;
  animationDuration?: number;
}

export function RadialProgress({
  value,
  max,
  label,
  color = '#3B82F6',
  frame,
  animationDuration = 60,
}: RadialProgressProps) {
  const progress = Math.min(frame / animationDuration, 1);
  const eased = 1 - Math.pow(1 - progress, 3);
  const percentage = (value / max) * eased;
  const circumference = 2 * Math.PI * 90;
  const offset = circumference * (1 - percentage);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16,
    }}>
      <svg width="220" height="220" viewBox="0 0 220 220">
        {/* Background circle */}
        <circle
          cx="110"
          cy="110"
          r="90"
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="12"
        />
        {/* Progress circle */}
        <circle
          cx="110"
          cy="110"
          r="90"
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 110 110)"
        />
        {/* Value text */}
        <text
          x="110"
          y="110"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="48"
          fontWeight="bold"
          fill="#1E293B"
        >
          {Math.round(value * eased)}%
        </text>
      </svg>
      <span style={{ fontSize: 24, color: '#64748B' }}>{label}</span>
    </div>
  );
}
```

## Complete Example

```typescript
import { RendervidEngine } from '@rendervid/core';
import { createBrowserRenderer } from '@rendervid/renderer-browser';
import { Callout } from './components/Callout';
import { AnimatedCard } from './components/AnimatedCard';
import { Typewriter } from './components/Typewriter';
import { RadialProgress } from './components/RadialProgress';

// Setup engine
const engine = new RendervidEngine();

// Register all components
engine.components.register('Callout', Callout);
engine.components.register('AnimatedCard', AnimatedCard);
engine.components.register('Typewriter', Typewriter);
engine.components.register('RadialProgress', RadialProgress);

// Create renderer with component registry
const renderer = createBrowserRenderer({
  componentRegistry: engine.components,
});

// Template using custom components
const template = {
  name: 'Custom Components Demo',
  output: { type: 'video', width: 1920, height: 1080, fps: 30, duration: 8 },
  inputs: [],
  composition: {
    scenes: [{
      id: 'main',
      startFrame: 0,
      endFrame: 240,
      backgroundColor: '#F8FAFC',
      layers: [
        {
          id: 'card',
          type: 'custom',
          position: { x: 100, y: 200 },
          size: { width: 500, height: 600 },
          customComponent: {
            name: 'AnimatedCard',
            props: {
              title: 'Welcome',
              subtitle: 'Custom components in action',
              imageUrl: 'https://example.com/image.jpg',
              accentColor: '#8B5CF6',
            },
          },
          props: {},
        },
        {
          id: 'progress',
          type: 'custom',
          position: { x: 700, y: 300 },
          size: { width: 300, height: 300 },
          customComponent: {
            name: 'RadialProgress',
            props: {
              value: 75,
              max: 100,
              label: 'Completion',
              color: '#22C55E',
            },
          },
          props: {},
        },
      ],
    }],
  },
};

// Render
const result = await renderer.renderVideo({ template, inputs: {} });
```

## Best Practices

1. **Use the `frame` prop** - Always animate based on frame number for consistency
2. **Implement easing** - Use easing functions for smooth animations
3. **Keep components pure** - No side effects, same frame = same output
4. **Define prop schemas** - Helps with validation and AI generation
5. **Test independently** - Preview components in isolation before using in templates

## Related Documentation

- [Custom Components Guide](/guides/custom-components)
- [Component Registry API](/api/core/engine#components)
- [Tailwind CSS Guide](/guides/tailwind)
