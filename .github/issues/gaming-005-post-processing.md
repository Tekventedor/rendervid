# [GAMING-005] Post-Processing Effects for Three.js

## Overview
Integrate `@react-three/postprocessing` to add cinematic post-processing effects: bloom, depth of field, motion blur, glitch, chromatic aberration, and custom shader passes.

## Motivation
Post-processing transforms basic 3D renders into cinematic, AAA-quality visuals. Essential for professional marketing videos and game-style aesthetics.

## Technical Approach

Use `@react-three/postprocessing` (based on pmndrs/postprocessing) which provides:
- Efficient multi-pass rendering
- 50+ built-in effects
- Custom shader support
- Minimal performance overhead

### Type Definitions

```typescript
// packages/core/src/types/three.ts

export interface PostProcessingConfig {
  /** Bloom effect (glow) */
  bloom?: {
    intensity?: number; // 0-10, default: 1
    threshold?: number; // 0-1, default: 0.9
    radius?: number; // 0-1, default: 0.85
    luminanceSmoothing?: number; // 0-1, default: 0.025
  };
  
  /** Depth of field (focus blur) */
  depthOfField?: {
    focusDistance?: number; // 0-1, default: 0.5
    focalLength?: number; // 0-1, default: 0.02
    bokehScale?: number; // 0-10, default: 2
    height?: number; // Resolution, default: 480
  };
  
  /** Motion blur */
  motionBlur?: {
    intensity?: number; // 0-1, default: 1
    samples?: number; // 4-32, default: 8
  };
  
  /** Chromatic aberration */
  chromaticAberration?: {
    offset?: [number, number]; // [-0.1, 0.1], default: [0.001, 0.001]
    radialModulation?: boolean; // default: false
    modulationOffset?: number; // 0-1, default: 0
  };
  
  /** Glitch effect */
  glitch?: {
    delay?: [number, number]; // Min/max delay between glitches
    duration?: [number, number]; // Min/max glitch duration
    strength?: [number, number]; // Min/max glitch strength
    mode?: 'sporadic' | 'constant';
    active?: boolean;
    ratio?: number; // 0-1, default: 0.85
  };
  
  /** Vignette (darkened edges) */
  vignette?: {
    offset?: number; // 0-1, default: 0.5
    darkness?: number; // 0-1, default: 0.5
    eskil?: boolean; // Use Eskil's vignette, default: false
  };
  
  /** Color grading */
  colorGrading?: {
    brightness?: number; // -1 to 1, default: 0
    contrast?: number; // -1 to 1, default: 0
    saturation?: number; // -1 to 1, default: 0
    hue?: number; // 0 to 360, default: 0
    temperature?: number; // -1 to 1, default: 0 (warm/cool)
  };
  
  /** Pixelation */
  pixelation?: {
    granularity?: number; // 1-20, default: 5
  };
  
  /** Scanline effect (CRT monitor) */
  scanline?: {
    density?: number; // 0-2, default: 1.25
    opacity?: number; // 0-1, default: 1
  };
  
  /** Noise/grain */
  noise?: {
    opacity?: number; // 0-1, default: 0.5
    blendFunction?: 'normal' | 'add' | 'multiply' | 'screen';
  };
  
  /** Screen space ambient occlusion */
  ssao?: {
    samples?: number; // 1-32, default: 16
    radius?: number; // 0-1, default: 0.1
    intensity?: number; // 0-2, default: 1
    bias?: number; // 0-1, default: 0.025
  };
  
  /** Screen space reflections */
  ssr?: {
    intensity?: number; // 0-1, default: 1
    maxDistance?: number; // 0-10, default: 1
    thickness?: number; // 0-1, default: 0.1
  };
  
  /** God rays (volumetric light) */
  godRays?: {
    lightPosition?: [number, number, number];
    density?: number; // 0-1, default: 0.96
    decay?: number; // 0-1, default: 0.9
    weight?: number; // 0-1, default: 0.4
    exposure?: number; // 0-1, default: 0.6
    samples?: number; // 15-100, default: 60
  };
  
  /** Custom shader pass */
  customShader?: {
    fragmentShader: string;
    uniforms?: Record<string, { value: any }>;
  };
}

export interface ThreeLayerProps {
  // ... existing properties
  
  /** Post-processing effects */
  postProcessing?: PostProcessingConfig;
}
```

### Implementation

```typescript
// packages/renderer-browser/src/layers/three/PostProcessing.tsx

import { EffectComposer } from '@react-three/postprocessing';
import {
  Bloom,
  DepthOfField,
  ChromaticAberration,
  Glitch,
  Vignette,
  Noise,
  SSAO,
  GodRays,
  // ... other effects
} from '@react-three/postprocessing';
import { BlendFunction, GlitchMode } from 'postprocessing';

export function PostProcessing({ config }: { config: PostProcessingConfig }) {
  if (!config || Object.keys(config).length === 0) {
    return null;
  }
  
  return (
    <EffectComposer>
      {config.bloom && (
        <Bloom
          intensity={config.bloom.intensity ?? 1}
          luminanceThreshold={config.bloom.threshold ?? 0.9}
          luminanceSmoothing={config.bloom.luminanceSmoothing ?? 0.025}
          radius={config.bloom.radius ?? 0.85}
        />
      )}
      
      {config.depthOfField && (
        <DepthOfField
          focusDistance={config.depthOfField.focusDistance ?? 0.5}
          focalLength={config.depthOfField.focalLength ?? 0.02}
          bokehScale={config.depthOfField.bokehScale ?? 2}
          height={config.depthOfField.height ?? 480}
        />
      )}
      
      {config.chromaticAberration && (
        <ChromaticAberration
          offset={config.chromaticAberration.offset ?? [0.001, 0.001]}
          radialModulation={config.chromaticAberration.radialModulation ?? false}
          modulationOffset={config.chromaticAberration.modulationOffset ?? 0}
        />
      )}
      
      {config.glitch && (
        <Glitch
          delay={config.glitch.delay ?? [1.5, 3.5]}
          duration={config.glitch.duration ?? [0.6, 1.0]}
          strength={config.glitch.strength ?? [0.3, 1.0]}
          mode={config.glitch.mode === 'constant' ? GlitchMode.CONSTANT_WILD : GlitchMode.SPORADIC}
          active={config.glitch.active ?? true}
          ratio={config.glitch.ratio ?? 0.85}
        />
      )}
      
      {config.vignette && (
        <Vignette
          offset={config.vignette.offset ?? 0.5}
          darkness={config.vignette.darkness ?? 0.5}
          eskil={config.vignette.eskil ?? false}
        />
      )}
      
      {config.noise && (
        <Noise
          opacity={config.noise.opacity ?? 0.5}
          blendFunction={getBlendFunction(config.noise.blendFunction)}
        />
      )}
      
      {config.ssao && (
        <SSAO
          samples={config.ssao.samples ?? 16}
          radius={config.ssao.radius ?? 0.1}
          intensity={config.ssao.intensity ?? 1}
          bias={config.ssao.bias ?? 0.025}
        />
      )}
      
      {config.godRays && config.godRays.lightPosition && (
        <GodRays
          sun={new Vector3(...config.godRays.lightPosition)}
          density={config.godRays.density ?? 0.96}
          decay={config.godRays.decay ?? 0.9}
          weight={config.godRays.weight ?? 0.4}
          exposure={config.godRays.exposure ?? 0.6}
          samples={config.godRays.samples ?? 60}
        />
      )}
      
      {config.customShader && (
        <CustomShaderEffect
          fragmentShader={config.customShader.fragmentShader}
          uniforms={config.customShader.uniforms}
        />
      )}
    </EffectComposer>
  );
}
```

### Color Grading Implementation

```typescript
// Custom color grading effect
import { Effect } from 'postprocessing';

const colorGradingShader = `
uniform float brightness;
uniform float contrast;
uniform float saturation;
uniform float hue;
uniform float temperature;

vec3 adjustBrightness(vec3 color, float value) {
  return color + value;
}

vec3 adjustContrast(vec3 color, float value) {
  return (color - 0.5) * (1.0 + value) + 0.5;
}

vec3 adjustSaturation(vec3 color, float value) {
  float gray = dot(color, vec3(0.299, 0.587, 0.114));
  return mix(vec3(gray), color, 1.0 + value);
}

vec3 adjustHue(vec3 color, float value) {
  // RGB to HSV and back with hue shift
  // ... implementation
}

vec3 adjustTemperature(vec3 color, float value) {
  // Warm: increase red/yellow, Cool: increase blue
  if (value > 0.0) {
    color.r += value * 0.3;
    color.g += value * 0.1;
  } else {
    color.b += abs(value) * 0.3;
  }
  return color;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec3 color = inputColor.rgb;
  
  color = adjustBrightness(color, brightness);
  color = adjustContrast(color, contrast);
  color = adjustSaturation(color, saturation);
  color = adjustHue(color, hue);
  color = adjustTemperature(color, temperature);
  
  outputColor = vec4(color, inputColor.a);
}
`;

export class ColorGradingEffect extends Effect {
  constructor(config: ColorGradingConfig) {
    super('ColorGradingEffect', colorGradingShader, {
      uniforms: new Map([
        ['brightness', new Uniform(config.brightness ?? 0)],
        ['contrast', new Uniform(config.contrast ?? 0)],
        ['saturation', new Uniform(config.saturation ?? 0)],
        ['hue', new Uniform(config.hue ?? 0)],
        ['temperature', new Uniform(config.temperature ?? 0)],
      ])
    });
  }
}
```

## Implementation Checklist

### Phase 1: Package Setup
- [ ] Add `@react-three/postprocessing` dependency
- [ ] Add `postprocessing` peer dependency
- [ ] Update TypeScript types

### Phase 2: Core Effects
- [ ] Implement Bloom
- [ ] Implement Depth of Field
- [ ] Implement Motion Blur
- [ ] Implement Chromatic Aberration
- [ ] Implement Glitch
- [ ] Implement Vignette
- [ ] Implement Noise

### Phase 3: Advanced Effects
- [ ] Implement SSAO
- [ ] Implement SSR
- [ ] Implement God Rays
- [ ] Implement Color Grading (custom)
- [ ] Implement Pixelation
- [ ] Implement Scanline

### Phase 4: Custom Shaders
- [ ] Support custom fragment shaders
- [ ] Support uniform passing
- [ ] Support texture inputs
- [ ] Add shader validation

### Phase 5: Integration
- [ ] Integrate with `ThreeLayer`
- [ ] Add to scene rendering pipeline
- [ ] Support effect ordering
- [ ] Add performance monitoring

### Phase 6: Testing
- [ ] Unit tests for each effect
- [ ] Visual regression tests
- [ ] Performance tests
- [ ] Test effect combinations
- [ ] Test in browser and Node.js

### Phase 7: Documentation & Examples
- [ ] Post-processing guide
- [ ] Effect reference documentation
- [ ] Example: Cinematic bloom
- [ ] Example: Glitch effect
- [ ] Example: Depth of field product shot
- [ ] Example: God rays dramatic lighting
- [ ] Example: Custom shader effect

## API Design

```json
{
  "type": "three",
  "props": {
    "meshes": [
      {
        "id": "product",
        "geometry": { "type": "sphere", "radius": 1 },
        "material": { "type": "physical", "metalness": 1, "roughness": 0.2 }
      }
    ],
    "postProcessing": {
      "bloom": {
        "intensity": 2,
        "threshold": 0.8,
        "radius": 0.9
      },
      "depthOfField": {
        "focusDistance": 0.5,
        "focalLength": 0.02,
        "bokehScale": 3
      },
      "chromaticAberration": {
        "offset": [0.002, 0.002]
      },
      "vignette": {
        "offset": 0.3,
        "darkness": 0.7
      },
      "colorGrading": {
        "brightness": 0.1,
        "contrast": 0.2,
        "saturation": 0.3,
        "temperature": 0.1
      }
    }
  }
}
```

### Glitch Effect Example

```json
{
  "postProcessing": {
    "glitch": {
      "delay": [0.5, 1.5],
      "duration": [0.1, 0.3],
      "strength": [0.5, 1.0],
      "mode": "sporadic",
      "active": true
    },
    "chromaticAberration": {
      "offset": [0.005, 0.005]
    }
  }
}
```

### Custom Shader Example

```json
{
  "postProcessing": {
    "customShader": {
      "fragmentShader": "void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) { vec3 color = inputColor.rgb; color = vec3(1.0) - color; outputColor = vec4(color, inputColor.a); }",
      "uniforms": {
        "intensity": { "value": 1.0 }
      }
    }
  }
}
```

## Dependencies
- #GAMING-002 (Three.js integration)

## Acceptance Criteria
- [ ] All listed effects work correctly
- [ ] Effects can be combined
- [ ] Custom shaders supported
- [ ] No significant performance impact (<5ms per frame)
- [ ] Works in browser and Node.js
- [ ] All tests pass
- [ ] Documentation complete
- [ ] At least 5 example templates

## Related Issues
- #GAMING-002 (Three.js integration)

## Notes
- Consider effect presets (cinematic, retro, cyberpunk, etc.)
- Add effect intensity animation over time
- Support selective effects (per-object masking)
- Consider LUT (Look-Up Table) support for color grading
