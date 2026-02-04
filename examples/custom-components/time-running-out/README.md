# Time Running Out - Animated Clocks Example

## Overview

This example demonstrates the power of **inline custom components** in Rendervid. It features two animated analog clocks showing time running at 20x speed, positioned on both sides of the screen with a dramatic "TIME IS RUNNING OUT" message in the center.

## Preview

![Preview](preview.gif)


**Duration:** 8 seconds @ 60 FPS
**Resolution:** 1920x1080
**Total Frames:** 480

### Visual Composition

```
┌──────────────────────────────────────────────┐
│                                              │
│    🕐                            🕐          │
│   Red Clock     TIME IS          Blue       │
│   (20x speed)   RUNNING OUT      Clock      │
│                                  (20x)       │
│                                              │
│           Every second counts                │
│                                              │
└──────────────────────────────────────────────┘
```

## Key Features

### 1. **Inline Custom Component**
The `FastClock` component is defined directly in the template as React code:
- Written in plain JavaScript (no build step needed)
- Reusable across multiple layers
- Fully customizable via props

### 2. **Frame-Based Animation**
```javascript
const timeInSeconds = (props.frame / props.fps) * speedMultiplier;
```
Time calculation is deterministic based on frame number, ensuring smooth playback.

### 3. **SVG Rendering**
The clock face is rendered as SVG elements:
- 12 hour markers (thick lines)
- 60 minute markers (thin lines)
- 3 animated hands (hour, minute, second)
- Dynamic rotation based on time

### 4. **Props Customization**
Each clock instance has different props:
- **Left Clock:** Red color (`#ff6b6b`), 20x speed
- **Right Clock:** Blue color (`#6baaff`), 20x speed

### 5. **Layered Composition**
6 layers working together:
- 2 custom clock components
- 2 text layers (title + subtitle)
- 2 glow effect shapes

## Custom Component Code

The `FastClock` component accepts these props:

```typescript
interface FastClockProps {
  frame: number;          // Auto: current frame
  fps: number;            // Auto: frames per second
  sceneDuration: number;  // Auto: total frames
  layerSize: {           // Auto: layer dimensions
    width: number;
    height: number;
  };
  speed?: number;        // Custom: time multiplier (default: 10)
  color?: string;        // Custom: clock color (default: #ffffff)
}
```

### How It Works

1. **Time Calculation:**
   ```javascript
   const speedMultiplier = props.speed || 10;
   const timeInSeconds = (props.frame / props.fps) * speedMultiplier;
   ```

2. **Clock Angles:**
   ```javascript
   const secondAngle = (seconds * 6) + ((props.frame % fps) / fps) * 6;
   const minuteAngle = (minutes * 6) + (seconds / 60) * 6;
   const hourAngle = (hours * 30) + (minutes / 60) * 30;
   ```

3. **Hand Rendering:**
   ```javascript
   const createHand = (angle, length, width, color) => {
     const rad = (angle - 90) * Math.PI / 180;
     return React.createElement('line', { x1, y1, x2, y2, ... });
   };
   ```

4. **Dynamic Glow:**
   ```javascript
   const glowIntensity = Math.sin(props.frame * 0.1) * 0.3 + 0.7;
   ```

## Performance Specs

- **Frame Rate:** 60 FPS (ultra-smooth second hand movement)
- **Speed:** 20x real-time (8 seconds = 2 minutes 40 seconds of clock time)
- **Complexity:** 72 SVG elements per clock (12 hour + 60 minute markers + hands)
- **Total Elements:** 144+ SVG elements animated per frame

## Usage

### Run Demo
```bash
node examples/custom-components/demo-time-running-out.js
```

### Render Video
```bash
# Using renderer directly
pnpm --filter @rendervid/renderer-browser tsx examples/custom-components/render-time-running-out.ts

# Or using MCP server
# Use the render_video tool with this template
```

### Customize
Edit `time-running-out.json` to customize:
- **Speed:** Change `props.speed` (10 = normal, 60 = very fast)
- **Colors:** Modify `props.color` for each clock
- **Text:** Update the warning message
- **Duration:** Adjust `output.duration`
- **Layout:** Change `position` coordinates

## Learning Points

This example teaches:

1. ✅ **How to write inline custom components**
   - Function syntax with props parameter
   - React.createElement for JSX-less components
   - Return SVG elements

2. ✅ **Frame-based animation principles**
   - Deterministic calculations from frame number
   - Smooth interpolation techniques
   - Angle calculations for rotation

3. ✅ **Component reusability**
   - Same component, different instances
   - Props for customization
   - No code duplication

4. ✅ **SVG rendering in React**
   - Creating complex shapes
   - Dynamic attributes
   - Performance optimization

5. ✅ **Integration with built-in features**
   - Mixing custom and built-in layers
   - Entrance animations on custom components
   - Layering effects

## Why This Matters

This example demonstrates that custom components enable:

- **Complex Visuals:** Analog clock would be impossible with built-in components
- **Dynamic Behavior:** Time calculation changes every frame
- **Code as Data:** The entire component is JSON-serializable
- **AI Generation:** AI agents can generate this template including custom code
- **No Build Step:** Component code is plain JavaScript, no compilation needed

## Next Steps

Try modifying this example:
- Add digital time display below clocks
- Make one clock go backwards
- Add a third clock in the middle
- Change clock style (minimalist, ornate, etc.)
- Add sound effects on each second tick
- Make the background pulse with the seconds

## Related Examples

- `animated-counter.json` - Simpler custom component
- `svg-clock.json` - Static SVG clock (no custom components)
- `particle-explosion.json` - Complex particle system

---

**Pro Tip:** The clock hands use `strokeLinecap: 'round'` for smooth rounded ends. Try changing to `'square'` or `'butt'` for different styles!
