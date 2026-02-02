# 3D Graphics Examples

Examples showcasing 3D graphics capabilities using CSS 3D transforms and the ThreeScene component.

## Templates

### rotating-cube
3D rotating cube with multi-axis rotation, directional lighting, and customizable colors. Perfect for tech presentations and modern brand content.

**Features:**
- Multi-axis rotation (X, Y, Z)
- Directional lighting with shadows
- Customizable cube color
- Professional dark background
- Clean typography overlay

**Customizable Inputs:**
- `title` - Main title text
- `subtitle` - Subtitle text
- `cubeColor` - Color of the 3D cube

**Use Cases:**
- Tech product launches
- 3D visualization demos
- Modern brand intros
- Software presentations

---

### sphere-animation
Wireframe sphere with slow rotation and futuristic aesthetic. Creates a clean, technical look perfect for sci-fi and tech content.

**Features:**
- Wireframe rendering mode
- Smooth rotation animation
- Customizable wireframe color
- Gradient background for depth
- Wide letter-spaced typography

**Customizable Inputs:**
- `title` - Main title text
- `subtitle` - Subtitle text
- `wireframeColor` - Color of the wireframe
- `backgroundColor` - Background gradient color

**Use Cases:**
- Sci-fi content intros
- Technology presentations
- Futuristic branding
- Abstract visualizations

---

## Technical Details

All 3D examples use the `ThreeScene` component which renders 3D graphics using CSS 3D transforms:

- Hardware-accelerated rendering
- Frame-perfect rotation animations
- Multiple geometry types (box, sphere, torus, plane)
- Lighting options (ambient, directional, none)
- Wireframe and solid rendering modes

## Rendering

```bash
# Render with defaults
rendervid render examples/3d/rotating-cube
rendervid render examples/3d/sphere-animation

# Customize
rendervid render examples/3d/rotating-cube --title "YOUR PRODUCT" --cubeColor "#ff0080"
rendervid render examples/3d/sphere-animation --title "INNOVATION" --wireframeColor "#00ffff"
```

## Template Structure

Each template includes:
- `template.json` - Complete configuration
- `README.md` - Documentation and usage instructions

All templates are 5-6 seconds at 30fps, Full HD resolution (1920x1080).
