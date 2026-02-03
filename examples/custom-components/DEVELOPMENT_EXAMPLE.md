# Custom Component Development Example

## Practical Step-by-Step Guide: Building a "Morphing Shape" Component

This guide shows the **complete workflow** from concept to finished template.

---

## Step 1: Define the Goal

**What we want:** A shape that morphs between different forms (circle → square → triangle) over time.

**Why custom component?** Built-in shapes can't smoothly morph between different types.

**Key requirements:**
- Smooth transitions
- Frame-based animation
- Configurable colors
- Deterministic rendering

---

## Step 2: Plan the Math

```javascript
// Animation timeline (assuming 60 FPS, 6 seconds total)
// 0-2s (0-120 frames): Circle → Square
// 2-4s (120-240 frames): Square → Triangle
// 4-6s (240-360 frames): Triangle → Circle

// For smooth transitions, we need:
1. Calculate which transition phase we're in
2. Calculate progress within that phase (0 to 1)
3. Interpolate between shapes
```

---

## Step 3: Prototype in Separate File

Create `MorphingShape.jsx`:

```jsx
import React from 'react';

export default function MorphingShape(props) {
  const {
    frame,
    fps,
    size = 200,
    color1 = '#ff00ff',
    color2 = '#00ffff',
    color3 = '#ffff00'
  } = props;

  // Calculate time in seconds
  const time = frame / fps;

  // Determine which transition (0, 1, or 2)
  const transitionIndex = Math.floor(time / 2) % 3;

  // Progress within current transition (0 to 1)
  const transitionProgress = (time % 2) / 2;

  // Ease the transition
  const eased = transitionProgress < 0.5
    ? 2 * transitionProgress * transitionProgress
    : 1 - Math.pow(-2 * transitionProgress + 2, 2) / 2;

  // SVG path for each shape
  const center = size / 2;
  const radius = size * 0.4;

  // Circle path
  const circlePath = `
    M ${center} ${center - radius}
    A ${radius} ${radius} 0 0 1 ${center} ${center + radius}
    A ${radius} ${radius} 0 0 1 ${center} ${center - radius}
  `;

  // Square path (as rounded rect)
  const squareSize = radius * 1.4;
  const squarePath = `
    M ${center - squareSize} ${center - squareSize}
    L ${center + squareSize} ${center - squareSize}
    L ${center + squareSize} ${center + squareSize}
    L ${center - squareSize} ${center + squareSize}
    Z
  `;

  // Triangle path
  const triHeight = radius * 1.6;
  const triBase = radius * 1.4;
  const trianglePath = `
    M ${center} ${center - triHeight}
    L ${center + triBase} ${center + triHeight * 0.5}
    L ${center - triBase} ${center + triHeight * 0.5}
    Z
  `;

  // Select paths and colors based on transition
  let currentPath, nextPath, currentColor, nextColor;

  switch (transitionIndex) {
    case 0: // Circle → Square
      currentPath = circlePath;
      nextPath = squarePath;
      currentColor = color1;
      nextColor = color2;
      break;
    case 1: // Square → Triangle
      currentPath = squarePath;
      nextPath = trianglePath;
      currentColor = color2;
      nextColor = color3;
      break;
    case 2: // Triangle → Circle
      currentPath = trianglePath;
      nextPath = circlePath;
      currentColor = color3;
      nextColor = color1;
      break;
  }

  // Interpolate between colors
  const interpolatedColor = interpolateColor(
    currentColor,
    nextColor,
    eased
  );

  return (
    <svg width={size} height={size}>
      {/* Shadow */}
      <path
        d={currentPath}
        fill="rgba(0, 0, 0, 0.2)"
        transform={`translate(5, 5)`}
        style={{ filter: 'blur(10px)' }}
      />

      {/* Main shape - interpolate between paths */}
      <path
        d={currentPath}
        fill={interpolatedColor}
        opacity={1 - eased * 0.3}
        style={{
          filter: `drop-shadow(0 0 10px ${interpolatedColor})`,
          transition: 'd 0.05s ease'
        }}
      />

      <path
        d={nextPath}
        fill={interpolatedColor}
        opacity={eased * 0.7}
        style={{
          filter: `drop-shadow(0 0 10px ${interpolatedColor})`
        }}
      />
    </svg>
  );
}

// Helper: Interpolate between hex colors
function interpolateColor(color1, color2, progress) {
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');

  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);

  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);

  const r = Math.round(r1 + (r2 - r1) * progress);
  const g = Math.round(g1 + (g2 - g1) * progress);
  const b = Math.round(b1 + (b2 - b1) * progress);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
```

---

## Step 4: Test Locally

```javascript
// Test at key frames
const testCases = [
  { frame: 0, expected: 'circle, color1' },
  { frame: 60, expected: 'halfway to square' },
  { frame: 120, expected: 'square, color2' },
  { frame: 240, expected: 'triangle, color3' },
  { frame: 360, expected: 'back to circle, color1' }
];

testCases.forEach(test => {
  const result = MorphingShape({
    frame: test.frame,
    fps: 60,
    size: 200,
    color1: '#ff00ff',
    color2: '#00ffff',
    color3: '#ffff00'
  });
  console.log(`Frame ${test.frame}:`, result);
});
```

---

## Step 5: Convert to Inline Format

### 5a: Combine Helper Functions

```javascript
function MorphingShape(props) {
  // Inline the interpolateColor function
  function interpolateColor(color1, color2, progress) {
    const hex1 = color1.replace('#', '');
    const hex2 = color2.replace('#', '');
    const r1 = parseInt(hex1.substring(0, 2), 16);
    const g1 = parseInt(hex1.substring(2, 4), 16);
    const b1 = parseInt(hex1.substring(4, 6), 16);
    const r2 = parseInt(hex2.substring(0, 2), 16);
    const g2 = parseInt(hex2.substring(2, 4), 16);
    const b2 = parseInt(hex2.substring(4, 6), 16);
    const r = Math.round(r1 + (r2 - r1) * progress);
    const g = Math.round(g1 + (g2 - g1) * progress);
    const b = Math.round(b1 + (b2 - b1) * progress);
    return '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
  }

  // Component code with React.createElement
  const size = props.size || 200;
  const color1 = props.color1 || '#ff00ff';
  const color2 = props.color2 || '#00ffff';
  const color3 = props.color3 || '#ffff00';
  const time = props.frame / props.fps;
  const transitionIndex = Math.floor(time / 2) % 3;
  const transitionProgress = (time % 2) / 2;
  const eased = transitionProgress < 0.5 ? 2 * transitionProgress * transitionProgress : 1 - Math.pow(-2 * transitionProgress + 2, 2) / 2;

  const center = size / 2;
  const radius = size * 0.4;

  const circlePath = 'M ' + center + ' ' + (center - radius) + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + center + ' ' + (center + radius) + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + center + ' ' + (center - radius);
  const squareSize = radius * 1.4;
  const squarePath = 'M ' + (center - squareSize) + ' ' + (center - squareSize) + ' L ' + (center + squareSize) + ' ' + (center - squareSize) + ' L ' + (center + squareSize) + ' ' + (center + squareSize) + ' L ' + (center - squareSize) + ' ' + (center + squareSize) + ' Z';
  const triHeight = radius * 1.6;
  const triBase = radius * 1.4;
  const trianglePath = 'M ' + center + ' ' + (center - triHeight) + ' L ' + (center + triBase) + ' ' + (center + triHeight * 0.5) + ' L ' + (center - triBase) + ' ' + (center + triHeight * 0.5) + ' Z';

  let currentPath, nextPath, currentColor, nextColor;
  if (transitionIndex === 0) {
    currentPath = circlePath; nextPath = squarePath; currentColor = color1; nextColor = color2;
  } else if (transitionIndex === 1) {
    currentPath = squarePath; nextPath = trianglePath; currentColor = color2; nextColor = color3;
  } else {
    currentPath = trianglePath; nextPath = circlePath; currentColor = color3; nextColor = color1;
  }

  const interpolatedColor = interpolateColor(currentColor, nextColor, eased);

  return React.createElement('svg', { width: size, height: size },
    React.createElement('path', { d: currentPath, fill: 'rgba(0, 0, 0, 0.2)', transform: 'translate(5, 5)', style: { filter: 'blur(10px)' } }),
    React.createElement('path', { d: currentPath, fill: interpolatedColor, opacity: 1 - eased * 0.3, style: { filter: 'drop-shadow(0 0 10px ' + interpolatedColor + ')' } }),
    React.createElement('path', { d: nextPath, fill: interpolatedColor, opacity: eased * 0.7, style: { filter: 'drop-shadow(0 0 10px ' + interpolatedColor + ')' } })
  );
}
```

### 5b: Single Line (for JSON)

```javascript
"function MorphingShape(props) { function interpolateColor(color1, color2, progress) { const hex1 = color1.replace('#', ''); const hex2 = color2.replace('#', ''); const r1 = parseInt(hex1.substring(0, 2), 16); const g1 = parseInt(hex1.substring(2, 4), 16); const b1 = parseInt(hex1.substring(4, 6), 16); const r2 = parseInt(hex2.substring(0, 2), 16); const g2 = parseInt(hex2.substring(2, 4), 16); const b2 = parseInt(hex2.substring(4, 6), 16); const r = Math.round(r1 + (r2 - r1) * progress); const g = Math.round(g1 + (g2 - g1) * progress); const b = Math.round(b1 + (b2 - b1) * progress); return '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0'); } const size = props.size || 200; const color1 = props.color1 || '#ff00ff'; const color2 = props.color2 || '#00ffff'; const color3 = props.color3 || '#ffff00'; const time = props.frame / props.fps; const transitionIndex = Math.floor(time / 2) % 3; const transitionProgress = (time % 2) / 2; const eased = transitionProgress < 0.5 ? 2 * transitionProgress * transitionProgress : 1 - Math.pow(-2 * transitionProgress + 2, 2) / 2; const center = size / 2; const radius = size * 0.4; const circlePath = 'M ' + center + ' ' + (center - radius) + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + center + ' ' + (center + radius) + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + center + ' ' + (center - radius); const squareSize = radius * 1.4; const squarePath = 'M ' + (center - squareSize) + ' ' + (center - squareSize) + ' L ' + (center + squareSize) + ' ' + (center - squareSize) + ' L ' + (center + squareSize) + ' ' + (center + squareSize) + ' L ' + (center - squareSize) + ' ' + (center + squareSize) + ' Z'; const triHeight = radius * 1.6; const triBase = radius * 1.4; const trianglePath = 'M ' + center + ' ' + (center - triHeight) + ' L ' + (center + triBase) + ' ' + (center + triHeight * 0.5) + ' L ' + (center - triBase) + ' ' + (center + triHeight * 0.5) + ' Z'; let currentPath, nextPath, currentColor, nextColor; if (transitionIndex === 0) { currentPath = circlePath; nextPath = squarePath; currentColor = color1; nextColor = color2; } else if (transitionIndex === 1) { currentPath = squarePath; nextPath = trianglePath; currentColor = color2; nextColor = color3; } else { currentPath = trianglePath; nextPath = circlePath; currentColor = color3; nextColor = color1; } const interpolatedColor = interpolateColor(currentColor, nextColor, eased); return React.createElement('svg', { width: size, height: size }, React.createElement('path', { d: currentPath, fill: 'rgba(0, 0, 0, 0.2)', transform: 'translate(5, 5)', style: { filter: 'blur(10px)' } }), React.createElement('path', { d: currentPath, fill: interpolatedColor, opacity: 1 - eased * 0.3, style: { filter: 'drop-shadow(0 0 10px ' + interpolatedColor + ')' } }), React.createElement('path', { d: nextPath, fill: interpolatedColor, opacity: eased * 0.7, style: { filter: 'drop-shadow(0 0 10px ' + interpolatedColor + ')' } })); }"
```

---

## Step 6: Create Complete Template

`morphing-shape.json`:

```json
{
  "name": "Morphing Shape Animation",
  "description": "Shape that smoothly morphs between circle, square, and triangle",
  "version": "1.0.0",
  "tags": ["animation", "shapes", "morphing", "custom-component"],
  "output": {
    "type": "video",
    "width": 1920,
    "height": 1080,
    "fps": 60,
    "duration": 6,
    "backgroundColor": "#1a1a2e"
  },
  "inputs": [
    {
      "key": "primaryColor",
      "type": "string",
      "label": "Primary Color (Circle)",
      "defaultValue": "#ff00ff"
    },
    {
      "key": "secondaryColor",
      "type": "string",
      "label": "Secondary Color (Square)",
      "defaultValue": "#00ffff"
    },
    {
      "key": "tertiaryColor",
      "type": "string",
      "label": "Tertiary Color (Triangle)",
      "defaultValue": "#ffff00"
    },
    {
      "key": "shapeSize",
      "type": "number",
      "label": "Shape Size",
      "defaultValue": 300
    }
  ],
  "customComponents": {
    "MorphingShape": {
      "type": "inline",
      "code": "function MorphingShape(props) { function interpolateColor(color1, color2, progress) { const hex1 = color1.replace('#', ''); const hex2 = color2.replace('#', ''); const r1 = parseInt(hex1.substring(0, 2), 16); const g1 = parseInt(hex1.substring(2, 4), 16); const b1 = parseInt(hex1.substring(4, 6), 16); const r2 = parseInt(hex2.substring(0, 2), 16); const g2 = parseInt(hex2.substring(2, 4), 16); const b2 = parseInt(hex2.substring(4, 6), 16); const r = Math.round(r1 + (r2 - r1) * progress); const g = Math.round(g1 + (g2 - g1) * progress); const b = Math.round(b1 + (b2 - b1) * progress); return '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0'); } const size = props.size || 200; const color1 = props.color1 || '#ff00ff'; const color2 = props.color2 || '#00ffff'; const color3 = props.color3 || '#ffff00'; const time = props.frame / props.fps; const transitionIndex = Math.floor(time / 2) % 3; const transitionProgress = (time % 2) / 2; const eased = transitionProgress < 0.5 ? 2 * transitionProgress * transitionProgress : 1 - Math.pow(-2 * transitionProgress + 2, 2) / 2; const center = size / 2; const radius = size * 0.4; const circlePath = 'M ' + center + ' ' + (center - radius) + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + center + ' ' + (center + radius) + ' A ' + radius + ' ' + radius + ' 0 0 1 ' + center + ' ' + (center - radius); const squareSize = radius * 1.4; const squarePath = 'M ' + (center - squareSize) + ' ' + (center - squareSize) + ' L ' + (center + squareSize) + ' ' + (center - squareSize) + ' L ' + (center + squareSize) + ' ' + (center + squareSize) + ' L ' + (center - squareSize) + ' ' + (center + squareSize) + ' Z'; const triHeight = radius * 1.6; const triBase = radius * 1.4; const trianglePath = 'M ' + center + ' ' + (center - triHeight) + ' L ' + (center + triBase) + ' ' + (center + triHeight * 0.5) + ' L ' + (center - triBase) + ' ' + (center + triHeight * 0.5) + ' Z'; let currentPath, nextPath, currentColor, nextColor; if (transitionIndex === 0) { currentPath = circlePath; nextPath = squarePath; currentColor = color1; nextColor = color2; } else if (transitionIndex === 1) { currentPath = squarePath; nextPath = trianglePath; currentColor = color2; nextColor = color3; } else { currentPath = trianglePath; nextPath = circlePath; currentColor = color3; nextColor = color1; } const interpolatedColor = interpolateColor(currentColor, nextColor, eased); return React.createElement('svg', { width: size, height: size }, React.createElement('path', { d: currentPath, fill: 'rgba(0, 0, 0, 0.2)', transform: 'translate(5, 5)', style: { filter: 'blur(10px)' } }), React.createElement('path', { d: currentPath, fill: interpolatedColor, opacity: 1 - eased * 0.3, style: { filter: 'drop-shadow(0 0 10px ' + interpolatedColor + ')' } }), React.createElement('path', { d: nextPath, fill: interpolatedColor, opacity: eased * 0.7, style: { filter: 'drop-shadow(0 0 10px ' + interpolatedColor + ')' } })); }",
      "description": "Morphing shape that transitions between circle, square, and triangle with color interpolation"
    }
  },
  "composition": {
    "scenes": [
      {
        "id": "morphing-scene",
        "startFrame": 0,
        "endFrame": 360,
        "backgroundColor": "#1a1a2e",
        "layers": [
          {
            "id": "background-glow",
            "type": "shape",
            "position": {
              "x": 960,
              "y": 540
            },
            "size": {
              "width": 800,
              "height": 800
            },
            "props": {
              "shapeType": "ellipse",
              "fill": "radial-gradient(circle, rgba(138,43,226,0.2) 0%, rgba(138,43,226,0) 70%)"
            }
          },
          {
            "id": "morphing-shape",
            "type": "custom",
            "position": {
              "x": 960,
              "y": 540
            },
            "size": {
              "width": 300,
              "height": 300
            },
            "customComponent": {
              "name": "MorphingShape",
              "props": {
                "size": "{{shapeSize}}",
                "color1": "{{primaryColor}}",
                "color2": "{{secondaryColor}}",
                "color3": "{{tertiaryColor}}"
              }
            },
            "animations": [
              {
                "type": "entrance",
                "effect": "zoomIn",
                "duration": 40
              }
            ]
          },
          {
            "id": "title",
            "type": "text",
            "position": {
              "x": 960,
              "y": 150
            },
            "size": {
              "width": 1600,
              "height": 80
            },
            "props": {
              "text": "MORPHING SHAPES",
              "fontSize": 52,
              "color": "#ffffff",
              "textAlign": "center",
              "fontWeight": "bold",
              "letterSpacing": "8px"
            },
            "animations": [
              {
                "type": "entrance",
                "effect": "fadeInDown",
                "duration": 30,
                "delay": 10
              }
            ]
          },
          {
            "id": "subtitle",
            "type": "text",
            "position": {
              "x": 960,
              "y": 900
            },
            "size": {
              "width": 1600,
              "height": 60
            },
            "props": {
              "text": "Circle → Square → Triangle",
              "fontSize": 28,
              "color": "rgba(255, 255, 255, 0.7)",
              "textAlign": "center",
              "letterSpacing": "4px"
            },
            "animations": [
              {
                "type": "entrance",
                "effect": "fadeInUp",
                "duration": 30,
                "delay": 20
              }
            ]
          }
        ]
      }
    ]
  }
}
```

---

## Step 7: Test and Refine

```typescript
import { createBrowserRenderer } from '@rendervid/renderer-browser';
import template from './morphing-shape.json';

const renderer = createBrowserRenderer();

// Test with different inputs
const result = await renderer.renderVideo({
  template,
  inputs: {
    primaryColor: '#ff1744',    // Red
    secondaryColor: '#00e676',  // Green
    tertiaryColor: '#2979ff',   // Blue
    shapeSize: 350
  }
});

// Download or preview
const url = URL.createObjectURL(result.blob);
```

---

## Development Tips

### 1. **Start Simple**
Begin with basic functionality, add complexity gradually.

### 2. **Test at Key Frames**
Test at: frame 0, middle frames, end frame, transition points.

### 3. **Use Helper Functions**
Break complex logic into reusable functions.

### 4. **Comment Your Math**
Explain calculations for future reference.

### 5. **Think in Frames**
Always calculate based on `frame`, not time or random values.

### 6. **Optimize Last**
Get it working first, optimize performance later.

### 7. **Version Control**
Keep separate .jsx files for complex components.

---

## Common Pitfalls

### ❌ Wrong: Using Time
```javascript
// This will break - Date.now() changes each render
const rotation = Date.now() / 1000 * 360;
```

### ✅ Correct: Using Frames
```javascript
// Deterministic - same frame = same result
const rotation = (props.frame / props.fps) * 360;
```

### ❌ Wrong: External State
```javascript
let counter = 0;  // State outside component
function Component() {
  counter++;  // Changes each call
}
```

### ✅ Correct: Computed from Props
```javascript
function Component(props) {
  const counter = Math.floor(props.frame / 10);  // From frame
}
```

---

## Summary

**Development workflow:**
1. ✅ Define goal and requirements
2. ✅ Plan the mathematics
3. ✅ Prototype in .jsx file
4. ✅ Test with mock props
5. ✅ Convert to inline format
6. ✅ Create complete template
7. ✅ Test and refine

**Key principles:**
- Frame-based calculations
- Deterministic output
- No side effects
- No external state
- Pure functions only

**This workflow ensures:**
- ✅ Components work correctly
- ✅ Animations are smooth
- ✅ Output is deterministic
- ✅ Code is maintainable
