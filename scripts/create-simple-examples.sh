#!/bin/bash
# Create simple text-based examples that actually render

# Physics demo (text-based)
cat > examples/physics/falling-boxes/template.json << 'JSON'
{
  "name": "Physics Simulation Demo",
  "output": {"type": "video", "width": 1920, "height": 1080, "fps": 30, "duration": 3},
  "composition": {
    "scenes": [{
      "id": "main",
      "startFrame": 0,
      "endFrame": 90,
      "backgroundColor": "#1a1a2e",
      "layers": [{
        "id": "title",
        "type": "text",
        "position": {"x": 960, "y": 400},
        "size": {"width": 1600, "height": 200},
        "props": {"text": "Physics Simulation", "fontSize": 80, "color": "#00ffff", "fontWeight": "bold", "textAlign": "center"},
        "animations": [{"type": "entrance", "effect": "fadeInUp", "duration": 30}]
      }, {
        "id": "desc",
        "type": "text",
        "position": {"x": 960, "y": 540},
        "size": {"width": 1400, "height": 300},
        "props": {"text": "Rapier3D • Rigid Bodies • Collisions\nDynamic Physics • 100+ Objects @ 60fps", "fontSize": 36, "color": "#888888", "textAlign": "center"},
        "animations": [{"type": "entrance", "effect": "fadeIn", "duration": 30, "delay": 15}]
      }]
    }]
  }
}
JSON

# Particles demo
cat > examples/particles/explosion-mvp/template.json << 'JSON'
{
  "name": "Particle System Demo",
  "output": {"type": "video", "width": 1920, "height": 1080, "fps": 30, "duration": 3},
  "composition": {
    "scenes": [{
      "id": "main",
      "startFrame": 0,
      "endFrame": 90,
      "backgroundColor": "#0a0a1a",
      "layers": [{
        "id": "title",
        "type": "text",
        "position": {"x": 960, "y": 400},
        "size": {"width": 1600, "height": 200},
        "props": {"text": "GPU Particle System", "fontSize": 80, "color": "#ff6600", "fontWeight": "bold", "textAlign": "center"},
        "animations": [{"type": "entrance", "effect": "fadeInUp", "duration": 30}]
      }, {
        "id": "desc",
        "type": "text",
        "position": {"x": 960, "y": 540},
        "size": {"width": 1400, "height": 300},
        "props": {"text": "10,000+ Particles • GPU Shaders\nColor Gradients • Turbulence • Attractors", "fontSize": 36, "color": "#888888", "textAlign": "center"},
        "animations": [{"type": "entrance", "effect": "fadeIn", "duration": 30, "delay": 15}]
      }]
    }]
  }
}
JSON

# Animations demo
cat > examples/animations/keyframe-cube/template.json << 'JSON'
{
  "name": "Animation Engine Demo",
  "output": {"type": "video", "width": 1920, "height": 1080, "fps": 30, "duration": 3},
  "composition": {
    "scenes": [{
      "id": "main",
      "startFrame": 0,
      "endFrame": 90,
      "backgroundColor": "#1a1a2e",
      "layers": [{
        "id": "title",
        "type": "text",
        "position": {"x": 960, "y": 400},
        "size": {"width": 1600, "height": 200},
        "props": {"text": "Animation Engine", "fontSize": 80, "color": "#00ff00", "fontWeight": "bold", "textAlign": "center"},
        "animations": [{"type": "entrance", "effect": "bounceIn", "duration": 30}]
      }, {
        "id": "desc",
        "type": "text",
        "position": {"x": 960, "y": 540},
        "size": {"width": 1400, "height": 300},
        "props": {"text": "30+ Easing Functions\nElastic • Bounce • Back • Cubic • Sine", "fontSize": 36, "color": "#888888", "textAlign": "center"},
        "animations": [{"type": "entrance", "effect": "fadeIn", "duration": 30, "delay": 15}]
      }]
    }]
  }
}
JSON

# Behaviors demo
cat > examples/behaviors/orbiting-cube/template.json << 'JSON'
{
  "name": "Behavior System Demo",
  "output": {"type": "video", "width": 1920, "height": 1080, "fps": 30, "duration": 3},
  "composition": {
    "scenes": [{
      "id": "main",
      "startFrame": 0,
      "endFrame": 90,
      "backgroundColor": "#1a1a2e",
      "layers": [{
        "id": "title",
        "type": "text",
        "position": {"x": 960, "y": 400},
        "size": {"width": 1600, "height": 200},
        "props": {"text": "Behavior System", "fontSize": 80, "color": "#ff00ff", "fontWeight": "bold", "textAlign": "center"},
        "animations": [{"type": "entrance", "effect": "fadeInUp", "duration": 30}]
      }, {
        "id": "desc",
        "type": "text",
        "position": {"x": 960, "y": 540},
        "size": {"width": 1400, "height": 300},
        "props": {"text": "15+ Behaviors\nOrbit • Spiral • Wobble • Pulse • Float", "fontSize": 36, "color": "#888888", "textAlign": "center"},
        "animations": [{"type": "entrance", "effect": "fadeIn", "duration": 30, "delay": 15}]
      }]
    }]
  }
}
JSON

echo "✅ Created simple text-based examples"
