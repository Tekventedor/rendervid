# Tailwind CSS Guide

Use Tailwind CSS classes in your Rendervid templates and custom components.

## Overview

Rendervid supports Tailwind CSS for styling custom components and provides a Tailwind-like style system for JSON templates.

## Setup

### With Custom Components

If you're using custom React components, install and configure Tailwind CSS:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Configure `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Import Tailwind

```css
/* styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Using in Custom Components

### Basic Usage

```tsx
import React from 'react';

interface CardProps {
  title: string;
  description: string;
  frame: number;
}

export function Card({ title, description, frame }: CardProps) {
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

### Dark Mode Support

```tsx
export function DarkModeCard({ title, isDark, frame }: Props) {
  return (
    <div className={`
      rounded-2xl p-8 shadow-xl transition-colors
      ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'}
    `}>
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
    </div>
  );
}
```

### Responsive-like Classes

While videos have fixed dimensions, you can use Tailwind's spacing and sizing utilities:

```tsx
export function ResponsiveCard({ size }: { size: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'p-4 text-sm',
    md: 'p-6 text-base',
    lg: 'p-8 text-lg',
  };

  return (
    <div className={`bg-white rounded-xl ${sizeClasses[size]}`}>
      Content
    </div>
  );
}
```

## Style System in JSON Templates

For JSON templates without custom components, use the `style` property which provides Tailwind-like utilities.

### Background Colors

```json
{
  "id": "box",
  "type": "shape",
  "style": {
    "backgroundColor": "#3B82F6"
  }
}
```

### Border Radius

```json
{
  "style": {
    "borderRadius": 16
  }
}
```

Available values: number (pixels) or string ("50%" for circles)

### Shadows

```json
{
  "style": {
    "shadow": "lg"
  }
}
```

Shadow presets:
- `sm` - Small shadow
- `md` - Medium shadow (default)
- `lg` - Large shadow
- `xl` - Extra large shadow
- `2xl` - 2X large shadow
- `none` - No shadow

### Opacity

```json
{
  "style": {
    "opacity": 0.8
  }
}
```

### Text Styling

```json
{
  "id": "title",
  "type": "text",
  "style": {
    "textColor": "#1E293B",
    "fontWeight": "bold",
    "fontSize": 48,
    "textAlign": "center"
  }
}
```

## Common Patterns

### Card Component

```tsx
export function TailwindCard({
  title,
  subtitle,
  accentColor = 'blue',
  frame,
}: Props) {
  const opacity = Math.min(frame / 20, 1);

  const accentColors = {
    blue: 'border-blue-500 bg-blue-50',
    green: 'border-green-500 bg-green-50',
    purple: 'border-purple-500 bg-purple-50',
    red: 'border-red-500 bg-red-50',
  };

  return (
    <div
      className={`
        bg-white rounded-2xl shadow-xl overflow-hidden
        border-l-4 ${accentColors[accentColor]}
      `}
      style={{ opacity }}
    >
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {title}
        </h2>
        {subtitle && (
          <p className="text-gray-600">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
```

### Stats Display

```tsx
export function StatsCard({ label, value, change, frame }: Props) {
  const isPositive = change >= 0;
  const progress = Math.min(frame / 30, 1);

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </p>
      <p
        className="text-4xl font-bold text-gray-900 mt-2"
        style={{ opacity: progress }}
      >
        {Math.round(value * progress).toLocaleString()}
      </p>
      <div className={`
        flex items-center mt-2 text-sm font-medium
        ${isPositive ? 'text-green-600' : 'text-red-600'}
      `}>
        <span>{isPositive ? '+' : ''}{change}%</span>
      </div>
    </div>
  );
}
```

### Button Component

```tsx
export function Button({
  text,
  variant = 'primary',
  size = 'md',
}: Props) {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    outline: 'border-2 border-blue-600 text-blue-600',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button className={`
      rounded-lg font-semibold transition-colors
      ${variants[variant]}
      ${sizes[size]}
    `}>
      {text}
    </button>
  );
}
```

### Gradient Background

```tsx
export function GradientBackground({ children }: Props) {
  return (
    <div className="
      bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500
      min-h-full w-full
    ">
      {children}
    </div>
  );
}
```

## Animation with Tailwind

Combine Tailwind classes with frame-based animations:

```tsx
export function AnimatedElement({ frame }: Props) {
  const progress = Math.min(frame / 30, 1);
  const translateY = (1 - progress) * 20;

  return (
    <div
      className="bg-white rounded-xl shadow-lg p-6"
      style={{
        opacity: progress,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <h2 className="text-2xl font-bold text-gray-900">
        Animated Content
      </h2>
    </div>
  );
}
```

## Custom Tailwind Configuration

Extend Tailwind for video-specific needs:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      // Video-optimized font sizes
      fontSize: {
        'video-sm': '24px',
        'video-base': '32px',
        'video-lg': '48px',
        'video-xl': '64px',
        'video-2xl': '96px',
      },
      // Safe zone spacing
      spacing: {
        'safe': '60px',
        'safe-lg': '120px',
      },
      // Video aspect ratios
      aspectRatio: {
        'video': '16 / 9',
        'story': '9 / 16',
        'square': '1 / 1',
      },
    },
  },
}
```

## Best Practices

1. **Use design tokens** - Create consistent color and spacing scales
2. **Prefer utility classes** - Keep components simple and composable
3. **Combine with inline styles** - Use Tailwind for static styles, inline for animations
4. **Test at video resolution** - Ensure text is readable at target dimensions
5. **Consider render performance** - Avoid overly complex class combinations

## Troubleshooting

### Classes not applying

Ensure your Tailwind config includes component paths:

```javascript
content: [
  './components/**/*.{js,ts,jsx,tsx}',
]
```

### JIT mode issues

For dynamic classes, use complete class names:

```tsx
// Good - complete class names
const colors = {
  blue: 'bg-blue-500',
  red: 'bg-red-500',
};

// Bad - dynamic interpolation
const color = `bg-${colorName}-500`; // Won't work with JIT
```

### Purge in production

Ensure all used classes are in content paths to avoid purging.

## Related Documentation

- [Custom Components Guide](/guides/custom-components)
- [Layer Styles Reference](/templates/styles)
- [Examples](/examples/)
