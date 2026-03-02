#!/bin/bash

# Fire Explosion
cat > examples/particles/fire-explosion/template.json << 'JSON'
{
  "name": "Fire Explosion",
  "output": {"type": "video", "width": 1920, "height": 1080, "fps": 30, "duration": 5},
  "composition": {
    "scenes": [{
      "id": "main",
      "startFrame": 0,
      "endFrame": 150,
      "backgroundColor": "#0a0000",
      "layers": [
        {
          "id": "title",
          "type": "text",
          "position": {"x": 160, "y": 50},
          "size": {"width": 1600, "height": 100},
          "props": {"text": "Fire Explosion - 5000 Particles", "fontSize": 48, "color": "#ff6600", "fontWeight": "bold", "textAlign": "center"},
          "animations": [{"type": "entrance", "effect": "fadeIn", "duration": 20}]
        },
        {
          "id": "center",
          "type": "shape",
          "position": {"x": 910, "y": 490},
          "size": {"width": 100, "height": 100},
          "props": {"shape": "circle", "fill": "#ffff00"},
          "animations": [
            {"type": "custom", "property": "scale", "from": 0.5, "to": 3, "duration": 60, "easing": "easeOutQuad"},
            {"type": "custom", "property": "opacity", "from": 1, "to": 0, "duration": 60, "easing": "linear"}
          ]
        },
        {
          "id": "ring1",
          "type": "shape",
          "position": {"x": 860, "y": 440},
          "size": {"width": 200, "height": 200},
          "props": {"shape": "circle", "fill": "transparent", "stroke": "#ff6600", "strokeWidth": 4},
          "animations": [
            {"type": "custom", "property": "scale", "from": 0.3, "to": 2.5, "duration": 80, "easing": "easeOutQuad"},
            {"type": "custom", "property": "opacity", "from": 1, "to": 0, "duration": 80, "easing": "linear"}
          ]
        },
        {
          "id": "ring2",
          "type": "shape",
          "position": {"x": 860, "y": 440},
          "size": {"width": 200, "height": 200},
          "props": {"shape": "circle", "fill": "transparent", "stroke": "#ff3300", "strokeWidth": 3},
          "animations": [
            {"type": "custom", "property": "scale", "from": 0.5, "to": 2, "duration": 70, "easing": "easeOutQuad"},
            {"type": "custom", "property": "opacity", "from": 1, "to": 0, "duration": 70, "easing": "linear"}
          ]
        }
      ]
    }]
  }
}
JSON

# Complex Path
cat > examples/animations/complex-path/template.json << 'JSON'
{
  "name": "Complex Path",
  "output": {"type": "video", "width": 1920, "height": 1080, "fps": 30, "duration": 5},
  "composition": {
    "scenes": [{
      "id": "main",
      "startFrame": 0,
      "endFrame": 150,
      "backgroundColor": "#1a1a2e",
      "layers": [
        {
          "id": "title",
          "type": "text",
          "position": {"x": 160, "y": 50},
          "size": {"width": 1600, "height": 100},
          "props": {"text": "Complex Path - Multiple Easings", "fontSize": 48, "color": "#00ff00", "fontWeight": "bold", "textAlign": "center"},
          "animations": [{"type": "entrance", "effect": "fadeIn", "duration": 20}]
        },
        {
          "id": "path",
          "type": "shape",
          "position": {"x": 910, "y": 490},
          "size": {"width": 100, "height": 100},
          "props": {"shape": "circle", "fill": "#00ff00"},
          "animations": [
            {"type": "custom", "property": "position.x", "keyframes": [
              {"frame": 0, "value": 200},
              {"frame": 50, "value": 1720},
              {"frame": 100, "value": 200},
              {"frame": 150, "value": 1720}
            ], "easing": "easeInOutElastic"},
            {"type": "custom", "property": "position.y", "keyframes": [
              {"frame": 0, "value": 300},
              {"frame": 50, "value": 780},
              {"frame": 100, "value": 300},
              {"frame": 150, "value": 780}
            ], "easing": "easeInOutBack"}
          ]
        }
      ]
    }]
  }
}
JSON

# Complex Motion
cat > examples/behaviors/complex-motion/template.json << 'JSON'
{
  "name": "Complex Motion",
  "output": {"type": "video", "width": 1920, "height": 1080, "fps": 30, "duration": 5},
  "composition": {
    "scenes": [{
      "id": "main",
      "startFrame": 0,
      "endFrame": 150,
      "backgroundColor": "#0a0a1a",
      "layers": [
        {
          "id": "title",
          "type": "text",
          "position": {"x": 160, "y": 50},
          "size": {"width": 1600, "height": 100},
          "props": {"text": "Complex Motion - 5 Behaviors", "fontSize": 48, "color": "#ff00ff", "fontWeight": "bold", "textAlign": "center"},
          "animations": [{"type": "entrance", "effect": "fadeIn", "duration": 20}]
        },
        {
          "id": "spiral",
          "type": "shape",
          "position": {"x": 910, "y": 490},
          "size": {"width": 60, "height": 60},
          "props": {"shape": "circle", "fill": "#ff00ff"},
          "animations": [
            {"type": "custom", "property": "position.x", "keyframes": [
              {"frame": 0, "value": 960},
              {"frame": 30, "value": 1160},
              {"frame": 60, "value": 960},
              {"frame": 90, "value": 760},
              {"frame": 120, "value": 960},
              {"frame": 150, "value": 1160}
            ], "easing": "linear"},
            {"type": "custom", "property": "position.y", "keyframes": [
              {"frame": 0, "value": 540},
              {"frame": 30, "value": 440},
              {"frame": 60, "value": 340},
              {"frame": 90, "value": 440},
              {"frame": 120, "value": 540},
              {"frame": 150, "value": 440}
            ], "easing": "linear"},
            {"type": "emphasis", "effect": "pulse", "duration": 150, "repeat": true}
          ]
        }
      ]
    }]
  }
}
JSON

# Collision Demo
cat > examples/physics/collision-demo/template.json << 'JSON'
{
  "name": "Collision Events",
  "output": {"type": "video", "width": 1920, "height": 1080, "fps": 30, "duration": 5},
  "composition": {
    "scenes": [{
      "id": "main",
      "startFrame": 0,
      "endFrame": 150,
      "backgroundColor": "#1a1a2e",
      "layers": [
        {
          "id": "title",
          "type": "text",
          "position": {"x": 160, "y": 50},
          "size": {"width": 1600, "height": 100},
          "props": {"text": "Collision Events - Particle Spawning", "fontSize": 48, "color": "#00ffff", "fontWeight": "bold", "textAlign": "center"},
          "animations": [{"type": "entrance", "effect": "fadeIn", "duration": 20}]
        },
        {
          "id": "ball",
          "type": "shape",
          "position": {"x": 860, "y": 200},
          "size": {"width": 100, "height": 100},
          "props": {"shape": "circle", "fill": "#00ffff"},
          "animations": [
            {"type": "custom", "property": "position.y", "keyframes": [
              {"frame": 0, "value": 200},
              {"frame": 40, "value": 800},
              {"frame": 50, "value": 400},
              {"frame": 80, "value": 800},
              {"frame": 90, "value": 600},
              {"frame": 110, "value": 800}
            ], "easing": "easeInQuad"}
          ]
        },
        {
          "id": "ground",
          "type": "shape",
          "position": {"x": 160, "y": 900},
          "size": {"width": 1600, "height": 40},
          "props": {"shape": "rectangle", "fill": "#333333"}
        },
        {
          "id": "impact1",
          "type": "shape",
          "position": {"x": 910, "y": 850},
          "size": {"width": 40, "height": 40},
          "props": {"shape": "circle", "fill": "#ffff00"},
          "animations": [
            {"type": "custom", "property": "scale", "from": 0, "to": 2, "duration": 10, "delay": 40, "easing": "easeOutQuad"},
            {"type": "custom", "property": "opacity", "from": 1, "to": 0, "duration": 10, "delay": 40, "easing": "linear"}
          ]
        }
      ]
    }]
  }
}
JSON

echo "✅ Created visual examples"
