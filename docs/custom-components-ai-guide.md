# Custom Components Guide for AI Agents

## Quick Overview

Custom components allow you to create **React components directly in templates** for dynamic visualizations that go beyond built-in components.

**When to use:** Need animations, calculations, or interactivity that built-in components (text, image, shape, video) cannot provide.

## Core Concept

```typescript
// Built-in components: Static or simple animations
{ type: "text", props: { text: "Hello" } }  // ❌ Can't animate complex math

// Custom components: Dynamic, computed, animated
{
  type: "custom",
  customComponent: {
    name: "AnimatedCounter",
    props: { from: 0, to: 100 }  // ✅ Computes values per frame
  }
}
```

## Component Interface

Every custom component receives these props automatically:

```typescript
interface ComponentProps {
  // Animation context (automatic)
  frame: number;         // Current frame (0, 1, 2, ...)
  fps: number;           // Frames per second (30, 60)
  sceneDuration: number; // Total frames in scene
  layerSize: {
    width: number;
    height: number;
  };

  // Your custom props (from template)
  [key: string]: unknown;
}
```

## How to Develop Custom Components

### Step 1: Define the Component Logic

Think about what you need to compute per frame:

```javascript
function AnimatedCounter(props) {
  // Calculate progress (0 to 1) over 2 seconds
  const duration = 2 * props.fps;  // 2 seconds in frames
  const progress = Math.min(props.frame / duration, 1);

  // Interpolate value
  const value = Math.floor(
    props.from + (props.to - props.from) * progress
  );

  // Return React element
  return React.createElement('div', {
    style: {
      fontSize: '72px',
      fontWeight: 'bold',
      color: props.color || '#ffffff'
    }
  }, value);
}
```

### Step 2: Convert to Inline Format

For templates, write as a single-line string (no newlines):

```javascript
"function AnimatedCounter(props) { const duration = 2 * props.fps; const progress = Math.min(props.frame / duration, 1); const value = Math.floor(props.from + (props.to - props.from) * progress); return React.createElement('div', { style: { fontSize: '72px', fontWeight: 'bold', color: props.color || '#ffffff' } }, value); }"
```

### Step 3: Use in Template

```json
{
  "customComponents": {
    "AnimatedCounter": {
      "type": "inline",
      "code": "function AnimatedCounter(props) { ... }",
      "description": "Animated number counter with easing"
    }
  },
  "composition": {
    "scenes": [{
      "layers": [{
        "type": "custom",
        "customComponent": {
          "name": "AnimatedCounter",
          "props": {
            "from": 0,
            "to": 100,
            "color": "#00ffff"
          }
        }
      }]
    }]
  }
}
```

## What Custom Components Can Do

### ✅ Capabilities

1. **Dynamic Calculations**
   ```javascript
   // Calculate based on frame
   const rotation = (props.frame / props.fps) * 360;
   const scale = 1 + Math.sin(props.frame * 0.1) * 0.2;
   ```

2. **Complex Animations**
   ```javascript
   // Easing functions
   const eased = 1 - Math.pow(1 - progress, 3);  // ease-out

   // Physics simulation
   const velocity = initialVelocity - gravity * time;
   const position = initialPosition + velocity * time;
   ```

3. **SVG Graphics**
   ```javascript
   // Draw custom shapes
   return React.createElement('svg', { width, height },
     React.createElement('circle', { cx, cy, r, fill: 'red' })
   );
   ```

4. **Multiple Elements**
   ```javascript
   // Create arrays of elements
   const particles = [];
   for (let i = 0; i < 100; i++) {
     particles.push(
       React.createElement('div', { key: i, style: {...} })
     );
   }
   return React.createElement('div', {}, ...particles);
   ```

5. **Conditional Rendering**
   ```javascript
   // Show different content based on frame
   if (props.frame < 30) {
     return React.createElement('div', {}, 'Loading...');
   }
   return React.createElement('div', {}, 'Ready!');
   ```

### ❌ Restrictions

1. **No Side Effects**
   ```javascript
   // ❌ WRONG: Non-deterministic
   setTimeout(() => {}, 1000);
   setInterval(() => {}, 100);
   fetch('https://api.com/data');

   // ✅ CORRECT: Frame-based
   const isVisible = props.frame > 30;
   ```

2. **No External State**
   ```javascript
   // ❌ WRONG: External dependencies
   let counter = 0;  // State outside component

   // ✅ CORRECT: Compute from props
   const counter = Math.floor(props.frame / 10);
   ```

3. **No DOM Access**
   ```javascript
   // ❌ WRONG: Direct DOM manipulation
   document.getElementById('foo').innerHTML = 'bar';
   window.scrollTo(0, 100);

   // ✅ CORRECT: Return React elements
   return React.createElement('div', { id: 'foo' }, 'bar');
   ```

4. **No Dynamic Imports**
   ```javascript
   // ❌ WRONG: Cannot load external code
   import lodash from 'lodash';
   const _ = require('lodash');

   // ✅ CORRECT: Use vanilla JavaScript
   const sum = array.reduce((a, b) => a + b, 0);
   ```

5. **Security Restrictions**
   ```javascript
   // ❌ FORBIDDEN: Blocked by validator
   eval('malicious code');
   new Function('return dangerous')();
   element.innerHTML = userInput;
   ```

## When to Use Custom Components

### ✅ Use Custom Components When:

1. **Need Mathematical Animations**
   - Counters, timers, calculations
   - Easing functions beyond presets
   - Physics simulations

2. **Complex Visual Effects**
   - Particle systems
   - Custom charts/graphs
   - Procedural graphics

3. **Dynamic Content**
   - Frame-based text changes
   - Conditional visibility
   - Computed styles

4. **SVG Animations**
   - Custom shapes
   - Path animations
   - Dynamic graphics

### ❌ Use Built-in Components When:

1. **Static Content**
   - Fixed text: Use `type: "text"`
   - Images: Use `type: "image"`
   - Simple shapes: Use `type: "shape"`

2. **Standard Animations**
   - Fade, slide, zoom: Use `animations` array
   - Presets work: Use built-in effects

3. **Simple Requirements**
   - Don't overcomplicate
   - Built-ins are faster and tested

## How Custom Components Improve Video Quality

### 1. **Smooth Animations** (60 FPS vs 30 FPS)
```javascript
// Custom components can use high frame rates
props.fps = 60;  // Smoother than 30 FPS

// Frame-based calculations ensure smoothness
const rotation = (props.frame / props.fps) * 360;  // Always smooth
```

### 2. **Professional Effects**
```javascript
// Realistic physics
const gravity = 9.8;
const velocity = initialVel - gravity * (props.frame / props.fps);

// Natural easing
const easeOut = 1 - Math.pow(1 - progress, 3);
```

### 3. **Unique Visuals**
```javascript
// Create effects impossible with built-ins
- Particle explosions
- 3D rotations
- Custom data visualizations
- Holographic effects
```

### 4. **Precise Control**
```javascript
// Exact timing control
if (props.frame === 45) {
  // Exactly at 1.5 seconds (at 30 FPS)
}

// Pixel-perfect positioning
const x = Math.sin(props.frame * 0.1) * 100;
```

### 5. **Optimization**
```javascript
// Efficient rendering
const shouldRender = props.frame % 5 === 0;  // Only every 5 frames
if (!shouldRender) return null;
```

## Development Workflow

### 1. Prototype Locally

Create separate .jsx file for development:

```jsx
// AnimatedCounter.jsx
import React from 'react';

export default function AnimatedCounter(props) {
  const duration = 2 * props.fps;
  const progress = Math.min(props.frame / duration, 1);
  const eased = 1 - Math.pow(1 - progress, 3);
  const value = Math.floor(
    props.from + (props.to - props.from) * eased
  );

  return (
    <div style={{
      fontSize: '72px',
      fontWeight: 'bold',
      color: props.color || '#ffffff',
      textAlign: 'center'
    }}>
      {value}
    </div>
  );
}
```

### 2. Test with Mock Props

```javascript
// Test at different frames
const testFrames = [0, 15, 30, 45, 60];
testFrames.forEach(frame => {
  const props = { frame, fps: 30, from: 0, to: 100 };
  console.log(`Frame ${frame}:`, AnimatedCounter(props));
});
```

### 3. Convert to Inline

```bash
# Minify and escape for JSON
npx terser AnimatedCounter.jsx --compress --mangle \
  | jq -R -s '.'
```

### 4. Add to Template

```json
{
  "customComponents": {
    "AnimatedCounter": {
      "type": "inline",
      "code": "function AnimatedCounter(props){const duration=2*props.fps,progress=Math.min(props.frame/duration,1),eased=1-Math.pow(1-progress,3),value=Math.floor(props.from+(props.to-props.from)*eased);return React.createElement('div',{style:{fontSize:'72px',fontWeight:'bold',color:props.color||'#ffffff',textAlign:'center'}},value)}"
    }
  }
}
```

## Common Patterns

### Pattern 1: Progress-Based Animation

```javascript
function ProgressComponent(props) {
  // Calculate progress (0 to 1)
  const progress = Math.min(props.frame / props.sceneDuration, 1);

  // Use progress for any value
  const width = progress * 100 + '%';
  const opacity = progress;

  return React.createElement('div', {
    style: { width, opacity }
  });
}
```

### Pattern 2: Timed Delays

```javascript
function DelayedComponent(props) {
  const delayFrames = (props.delay || 0) * props.fps;
  const effectiveFrame = Math.max(0, props.frame - delayFrames);

  if (effectiveFrame === 0) return null;  // Not visible yet

  const progress = effectiveFrame / (props.fps * 2);
  return React.createElement('div', {}, 'Content');
}
```

### Pattern 3: Looping Animations

```javascript
function LoopingComponent(props) {
  const loopDuration = 60;  // frames
  const loopProgress = (props.frame % loopDuration) / loopDuration;

  const scale = 1 + Math.sin(loopProgress * Math.PI * 2) * 0.2;

  return React.createElement('div', {
    style: { transform: `scale(${scale})` }
  });
}
```

### Pattern 4: Particle Systems

```javascript
function ParticleSystem(props) {
  const particles = [];
  const count = props.particleCount || 50;

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const distance = props.frame * 5;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    particles.push(
      React.createElement('circle', {
        key: i,
        cx: x,
        cy: y,
        r: 3,
        fill: `hsl(${i * 360 / count}, 100%, 60%)`
      })
    );
  }

  return React.createElement('svg', {
    width: props.layerSize.width,
    height: props.layerSize.height
  }, ...particles);
}
```

### Pattern 5: Easing Functions

```javascript
// Common easing functions
const easings = {
  linear: t => t,
  easeInQuad: t => t * t,
  easeOutQuad: t => t * (2 - t),
  easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeOutCubic: t => 1 - Math.pow(1 - t, 3),
  easeInElastic: t => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1
      : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
  }
};

function EasedComponent(props) {
  const progress = Math.min(props.frame / (props.fps * 2), 1);
  const eased = easings.easeOutCubic(progress);

  const value = props.from + (props.to - props.from) * eased;
  return React.createElement('div', {}, Math.floor(value));
}
```

## Quick Reference

### React.createElement Syntax

```javascript
// Element with text
React.createElement('div', { style: { color: 'red' } }, 'Hello')

// Element with children
React.createElement('div', { className: 'wrapper' },
  React.createElement('span', {}, 'Child 1'),
  React.createElement('span', {}, 'Child 2')
)

// SVG elements
React.createElement('svg', { width: 100, height: 100 },
  React.createElement('circle', { cx: 50, cy: 50, r: 40, fill: 'blue' })
)

// Array of children
React.createElement('div', {}, ...arrayOfElements)
```

### Common Style Properties

```javascript
style: {
  // Positioning
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',

  // Size
  width: '100px',
  height: '100px',

  // Text
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center',
  color: '#ffffff',

  // Effects
  opacity: 0.8,
  filter: 'blur(2px)',
  boxShadow: '0 0 20px rgba(0,0,0,0.5)',

  // Animation
  transform: `rotate(${rotation}deg) scale(${scale})`,
  transition: 'all 0.3s ease'
}
```

## AI Agent Decision Tree

```
Need to create video element?
├─ Is it static content?
│  ├─ Yes → Use built-in components (text, image, shape)
│  └─ No → Continue
│
├─ Can built-in animations handle it?
│  ├─ Yes → Use animations array (fadeIn, slideUp, etc.)
│  └─ No → Continue
│
├─ Need frame-by-frame calculations?
│  ├─ Yes → Use custom component
│  │   ├─ Simple math → inline component
│  │   ├─ Complex logic → URL component
│  │   └─ Reusable → reference component
│  └─ No → Use built-in components
│
└─ Examples requiring custom components:
    ✅ Animated counters/timers
    ✅ Particle systems
    ✅ Custom charts/graphs
    ✅ Physics simulations
    ✅ Complex SVG animations
    ✅ Procedural graphics
    ✅ Dynamic color transitions
    ✅ Mathematical visualizations
```

## Summary for AI Agents

**Custom components are React functions that:**
- Receive `frame`, `fps`, `sceneDuration`, `layerSize` + custom props
- Return React elements (via `React.createElement`)
- Calculate animations based on current frame
- Must be deterministic (same frame = same output)
- Cannot use side effects, external state, or DOM access
- Improve video quality through smooth animations and unique effects

**Use when:** Built-in components cannot achieve the desired effect
**Avoid when:** Simple static content or standard animations suffice
**Format:** Single-line JavaScript function as string in template

**Key principle:** Think in frames, not time. Calculate everything from `props.frame`.
