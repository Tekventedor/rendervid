# TextTrail Component - Pattern Consistency

This document shows how TextTrail follows the established Rendervid component patterns.

## Pattern Compliance Checklist

### ✅ File Structure
- [x] Main component file: `TextTrail.tsx`
- [x] Example file: `TextTrail.example.tsx`
- [x] Exports in `index.ts`
- [x] Types match naming convention

### ✅ Imports
```typescript
import React from 'react';
import type { CSSProperties } from 'react';
import type { AnimatedProps } from '../types';
```
Same as WaveText, StaggerText, and other text components.

### ✅ Type Definitions
```typescript
export type TrailDirection = 'left' | 'right' | 'up' | 'down' | ...;
export interface TextTrailProps extends AnimatedProps { ... }
```
- Extends `AnimatedProps` (provides frame, fps, className, style)
- Custom types exported for external use
- Props interface exported

### ✅ Component Structure
```typescript
export function TextTrail({
  // Text props
  text,
  // Animation props
  frame = 0,
  fps = 30,
  // Component-specific props
  trailLength = 5,
  trailSpacing = 8,
  // Typography props
  fontSize = 24,
  color = '#ffffff',
  // ...
}: TextTrailProps): React.ReactElement {
  // Implementation
}
```

### ✅ Props Pattern

**Required Props:**
- `text: string` (like all text components)
- `frame: number` (from AnimatedProps)

**Optional Props:**
- Default values for all optional props
- Destructured with defaults in function signature
- Standard typography props (fontSize, color, fontFamily, etc.)

### ✅ Calculation Pattern
```typescript
const time = frame / fps;
```
Consistent with WaveText and other animated components.

### ✅ Style Pattern
```typescript
const containerStyle: CSSProperties = {
  fontSize,
  color,
  fontFamily,
  fontWeight,
  lineHeight,
  textAlign,
  letterSpacing: letterSpacing !== undefined ? `${letterSpacing}px` : undefined,
  textShadow,
  display: 'inline-block',
  ...style,
};
```
Same style composition pattern as other text components.

### ✅ Rendering Pattern
```typescript
return (
  <div className={className} style={containerStyle}>
    {items.map((item, index) => (
      <span key={index} style={itemStyle}>
        {content}
      </span>
    ))}
  </div>
);
```
Consistent container + mapped children pattern.

### ✅ Documentation
- JSDoc comments on component
- Examples showing features
- TypeScript interfaces documented
- @example blocks in JSDoc

## Comparison with WaveText

### Similarities
1. Both extend `AnimatedProps`
2. Both use frame-based animation
3. Both split/iterate over content
4. Both use CSSProperties for typing
5. Both have direction props
6. Both have similar typography props
7. Both export types and component

### Differences (By Design)
1. WaveText: Sine wave motion → TextTrail: Linear offset
2. WaveText: Single character per span → TextTrail: Multiple text copies
3. WaveText: Transform-based → TextTrail: Position-based + opacity
4. WaveText: 2 directions → TextTrail: 8 directions

## Example File Pattern

Both follow same structure:
```typescript
/**
 * Example usage of [Component] component
 */

import React from 'react';
import { Component } from './Component';

export function BasicExample() {
  const currentFrame = 30;
  return (
    <div style={{ padding: 40, backgroundColor: '#000', ... }}>
      <Component {...props} />
    </div>
  );
}

// Multiple examples...
```

## Export Pattern

```typescript
// In effects/index.ts
export { TextTrail } from './TextTrail';
export type { TextTrailProps, TrailDirection } from './TextTrail';
```

Follows exact same pattern as:
- `WaveText` + `WaveTextProps` + `WaveDirection`
- `StaggerText` + `StaggerTextProps` + `StaggerAnimation`
- `BlurText` + `BlurTextProps` + `BlurMode`

## Integration Pattern

Can be used identically to other components:

```tsx
import { TextTrail, WaveText, StaggerText } from '@rendervid/components';

// All follow same prop pattern
<TextTrail text="..." frame={frame} fps={30} {...props} />
<WaveText text="..." frame={frame} fps={30} {...props} />
<StaggerText text="..." frame={frame} fps={30} {...props} />
```

## Frame-Aware Rendering

All components use same pattern:
```typescript
frame = 0,
fps = 30,

const time = frame / fps;
// Use time for calculations
```

This ensures:
- Consistent timing across components
- Deterministic rendering (same frame = same output)
- Video export compatibility
- Remotion integration

## Typography Props

Standard set across all text components:
- fontSize
- color
- fontFamily
- fontWeight
- lineHeight
- textAlign
- letterSpacing
- textShadow

This allows consistent styling and easy switching between components.

## Summary

TextTrail maintains 100% pattern consistency with existing Rendervid text components while adding unique trail effect functionality. It can be used as a drop-in replacement for other text components by simply changing the import and component-specific props.
