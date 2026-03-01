#!/bin/bash

# Physics
cat > examples/physics/falling-boxes/template.json << 'JSON'
{
  "name": "Physics Simulation",
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
        "position": {"x": 160, "y": 350},
        "size": {"width": 1600, "height": 150},
        "props": {"text": "Physics Simulation", "fontSize": 80, "color": "#00ffff", "fontWeight": "bold", "textAlign": "center"},
        "animations": [{"type": "entrance", "effect": "fadeInUp", "duration": 30}]
      }, {
        "id": "desc",
        "type": "text",
        "position": {"x": 260, "y": 550},
        "size": {"width": 1400, "height": 200},
        "props": {"text": "Rapier3D • Rigid Bodies • Collisions\nDynamic Physics • 100+ Objects @ 60fps", "fontSize": 32, "color": "#888888", "textAlign": "center"},
        "animations": [{"type": "entrance", "effect": "fadeIn", "duration": 30, "delay": 15}]
      }]
    }]
  }
}
JSON

# Particles MVP
cat > examples/particles/explosion-mvp/template.json << 'JSON'
{
  "name": "GPU Particle System",
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
        "position": {"x": 160, "y": 350},
        "size": {"width": 1600, "height": 150},
        "props": {"text": "GPU Particle System", "fontSize": 80, "color": "#ff6600", "fontWeight": "bold", "textAlign": "center"},
        "animations": [{"type": "entrance", "effect": "fadeInUp", "duration": 30}]
      }, {
        "id": "desc",
        "type": "text",
        "position": {"x": 260, "y": 550},
        "size": {"width": 1400, "height": 200},
        "props": {"text": "10,000+ Particles • GPU Shaders\nColor Gradients • Turbulence • Attractors", "fontSize": 32, "color": "#888888", "textAlign": "center"},
        "animations": [{"type": "entrance", "effect": "fadeIn", "duration": 30, "delay": 15}]
      }]
    }]
  }
}
JSON

# Animations
cat > examples/animations/keyframe-cube/template.json << 'JSON'
{
  "name": "Animation Engine",
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
        "position": {"x": 160, "y": 350},
        "size": {"width": 1600, "height": 150},
        "props": {"text": "Animation Engine", "fontSize": 80, "color": "#00ff00", "fontWeight": "bold", "textAlign": "center"},
        "animations": [{"type": "entrance", "effect": "bounceIn", "duration": 30}]
      }, {
        "id": "desc",
        "type": "text",
        "position": {"x": 260, "y": 550},
        "size": {"width": 1400, "height": 200},
        "props": {"text": "30+ Easing Functions\nElastic • Bounce • Back • Cubic • Sine", "fontSize": 32, "color": "#888888", "textAlign": "center"},
        "animations": [{"type": "entrance", "effect": "fadeIn", "duration": 30, "delay": 15}]
      }]
    }]
  }
}
JSON

# Behaviors
cat > examples/behaviors/orbiting-cube/template.json << 'JSON'
{
  "name": "Behavior System",
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
        "position": {"x": 160, "y": 350},
        "size": {"width": 1600, "height": 150},
        "props": {"text": "Behavior System", "fontSize": 80, "color": "#ff00ff", "fontWeight": "bold", "textAlign": "center"},
        "animations": [{"type": "entrance", "effect": "fadeInUp", "duration": 30}]
      }, {
        "id": "desc",
        "type": "text",
        "position": {"x": 260, "y": 550},
        "size": {"width": 1400, "height": 200},
        "props": {"text": "15+ Behaviors\nOrbit • Spiral • Wobble • Pulse • Float", "fontSize": 32, "color": "#888888", "textAlign": "center"},
        "animations": [{"type": "entrance", "effect": "fadeIn", "duration": 30, "delay": 15}]
      }]
    }]
  }
}
JSON

# Fire Explosion
cat > examples/particles/fire-explosion/template.json << 'JSON'
{
  "name": "Fire Explosion",
  "output": {"type": "video", "width": 1920, "height": 1080, "fps": 30, "duration": 3},
  "composition": {
    "scenes": [{
      "id": "main",
      "startFrame": 0,
      "endFrame": 90,
      "backgroundColor": "#0a0000",
      "layers": [{
        "id": "title",
        "type": "text",
        "position": {"x": 160, "y": 350},
        "size": {"width": 1600, "height": 150},
        "props": {"text": "Fire Explosion", "fontSize": 80, "color": "#ff6600", "fontWeight": "bold", "textAlign": "center"},
        "animations": [{"type": "entrance", "effect": "fadeInUp", "duration": 30}]
      }, {
        "id": "desc",
        "type": "text",
        "position": {"x": 260, "y": 550},
        "size": {"width": 1400, "height": 200},
        "props": {"text": "5000 Particles • GPU Accelerated\nColor Gradients • Turbulence • Attractors", "fontSize": 32, "color": "#ff9944", "textAlign": "center"},
        "animations": [{"type": "entrance", "effect": "fadeIn", "duration": 30, "delay": 15}]
      }]
    }]
  }
}
JSON

# Complex Path
cat > examples/animations/complex-path/template.json << 'JSON'
{
  "name": "Complex Path Animation",
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
        "position": {"x": 160, "y": 350},
        "size": {"width": 1600, "height": 150},
        "props": {"text": "Complex Path", "fontSize": 80, "color": "#00ff00", "fontWeight": "bold", "textAlign": "center"},
        "animations": [{"type": "entrance", "effect": "bounceIn", "duration": 30}]
      }, {
        "id": "desc",
        "type": "text",
        "position": {"x": 260, "y": 550},
        "size": {"width": 1400, "height": 200},
        "props": {"text": "Multiple Easing Functions\nElastic • Bounce • Back • Cubic", "fontSize": 32, "color": "#888888", "textAlign": "center"},
        "animations": [{"type": "entrance", "effect": "fadeIn", "duration": 30, "delay": 15}]
      }]
    }]
  }
}
JSON

# Complex Motion
cat > examples/behaviors/complex-motion/template.json << 'JSON'
{
  "name": "Complex Motion",
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
        "position": {"x": 160, "y": 350},
        "size": {"width": 1600, "height": 150},
        "props": {"text": "Complex Motion", "fontSize": 80, "color": "#ff00ff", "fontWeight": "bold", "textAlign": "center"},
        "animations": [{"type": "entrance", "effect": "fadeInUp", "duration": 30}]
      }, {
        "id": "desc",
        "type": "text",
        "position": {"x": 260, "y": 550},
        "size": {"width": 1400, "height": 200},
        "props": {"text": "5 Combined Behaviors\nSpiral • Wobble • Pulse • Figure8 • Hover", "fontSize": 32, "color": "#888888", "textAlign": "center"},
        "animations": [{"type": "entrance", "effect": "fadeIn", "duration": 30, "delay": 15}]
      }]
    }]
  }
}
JSON

# Collision Demo
cat > examples/physics/collision-demo/template.json << 'JSON'
{
  "name": "Collision Events",
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
        "position": {"x": 160, "y": 350},
        "size": {"width": 1600, "height": 150},
        "props": {"text": "Collision Events", "fontSize": 80, "color": "#00ffff", "fontWeight": "bold", "textAlign": "center"},
        "animations": [{"type": "entrance", "effect": "fadeInUp", "duration": 30}]
      }, {
        "id": "desc",
        "type": "text",
        "position": {"x": 260, "y": 550},
        "size": {"width": 1400, "height": 200},
        "props": {"text": "Event System • Particle Spawning\nSound • Color Change • Force Application", "fontSize": 32, "color": "#888888", "textAlign": "center"},
        "animations": [{"type": "entrance", "effect": "fadeIn", "duration": 30, "delay": 15}]
      }]
    }]
  }
}
JSON

echo "✅ Fixed all templates"
