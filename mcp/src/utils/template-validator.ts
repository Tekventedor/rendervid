/**
 * Pre-render template validation to catch common issues before rendering
 * Provides actionable feedback to AI agents
 */

export interface ValidationIssue {
  severity: 'error' | 'warning';
  code: string;
  message: string;
  fix: string;
  location?: string;
}

export interface TemplateValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

export function validateTemplateForRendering(template: any): TemplateValidationResult {
  const issues: ValidationIssue[] = [];

  // Check if template exists
  if (!template) {
    issues.push({
      severity: 'error',
      code: 'NO_TEMPLATE',
      message: 'Template is null or undefined',
      fix: 'Provide a valid template object',
    });
    return { valid: false, issues };
  }

  // Check required fields
  if (!template.output) {
    issues.push({
      severity: 'error',
      code: 'MISSING_OUTPUT',
      message: 'Template is missing "output" field',
      fix: 'Add output configuration: { "output": { "type": "video", "width": 1920, "height": 1080, "fps": 30, "duration": 5 } }',
    });
  }

  if (!template.composition) {
    issues.push({
      severity: 'error',
      code: 'MISSING_COMPOSITION',
      message: 'Template is missing "composition" field',
      fix: 'Add composition with scenes: { "composition": { "scenes": [...] } }',
    });
  }

  if (!template.composition?.scenes || template.composition.scenes.length === 0) {
    issues.push({
      severity: 'error',
      code: 'NO_SCENES',
      message: 'Template has no scenes defined',
      fix: 'Add at least one scene to composition.scenes array',
    });
  }

  // Validate scenes
  if (template.composition?.scenes) {
    const canvasWidth = template.output?.width || 1920;
    const canvasHeight = template.output?.height || 1080;

    template.composition.scenes.forEach((scene: any, sceneIndex: number) => {
      const sceneId = scene.id || `scene-${sceneIndex}`;

      // Check scene timing
      if (scene.startFrame === undefined || scene.endFrame === undefined) {
        issues.push({
          severity: 'error',
          code: 'INVALID_SCENE_TIMING',
          message: `Scene "${sceneId}" is missing startFrame or endFrame`,
          fix: 'Add startFrame and endFrame to scene (e.g., startFrame: 0, endFrame: 150)',
          location: `scenes[${sceneIndex}]`,
        });
      }

      if (scene.endFrame <= scene.startFrame) {
        issues.push({
          severity: 'error',
          code: 'INVALID_SCENE_DURATION',
          message: `Scene "${sceneId}" has endFrame (${scene.endFrame}) <= startFrame (${scene.startFrame})`,
          fix: 'Ensure endFrame > startFrame (e.g., startFrame: 0, endFrame: 150 for 5 seconds at 30fps)',
          location: `scenes[${sceneIndex}]`,
        });
      }

      // Validate layers
      if (!scene.layers || scene.layers.length === 0) {
        issues.push({
          severity: 'warning',
          code: 'EMPTY_SCENE',
          message: `Scene "${sceneId}" has no layers`,
          fix: 'Add at least one layer to the scene',
          location: `scenes[${sceneIndex}]`,
        });
      }

      scene.layers?.forEach((layer: any, layerIndex: number) => {
        const layerId = layer.id || `layer-${layerIndex}`;
        const location = `scenes[${sceneIndex}].layers[${layerIndex}]`;

        // Check positioning
        if (!layer.position) {
          issues.push({
            severity: 'error',
            code: 'MISSING_POSITION',
            message: `Layer "${layerId}" is missing position`,
            fix: 'Add position: { x: 0, y: 0 } to layer',
            location,
          });
        } else {
          // Check if position is out of bounds
          if (layer.position.x < 0 || layer.position.y < 0) {
            issues.push({
              severity: 'error',
              code: 'NEGATIVE_POSITION',
              message: `Layer "${layerId}" has negative position (x: ${layer.position.x}, y: ${layer.position.y})`,
              fix: `Use positive coordinates within canvas bounds (0-${canvasWidth}px width, 0-${canvasHeight}px height)`,
              location,
            });
          }

          if (layer.position.x >= canvasWidth || layer.position.y >= canvasHeight) {
            issues.push({
              severity: 'error',
              code: 'OUT_OF_BOUNDS_POSITION',
              message: `Layer "${layerId}" is positioned outside canvas (x: ${layer.position.x}, y: ${layer.position.y})`,
              fix: `Position must be within canvas bounds (0-${canvasWidth}px width, 0-${canvasHeight}px height). Layer will not be visible!`,
              location,
            });
          }
        }

        // Check size
        if (!layer.size) {
          issues.push({
            severity: 'error',
            code: 'MISSING_SIZE',
            message: `Layer "${layerId}" is missing size`,
            fix: 'Add size: { width: 100, height: 100 } to layer',
            location,
          });
        } else {
          // Check if layer extends beyond canvas
          if (layer.position && (layer.position.x + layer.size.width > canvasWidth)) {
            issues.push({
              severity: 'warning',
              code: 'EXTENDS_BEYOND_WIDTH',
              message: `Layer "${layerId}" extends beyond canvas width (x: ${layer.position.x} + width: ${layer.size.width} = ${layer.position.x + layer.size.width}px > ${canvasWidth}px)`,
              fix: `Adjust position or size so x + width <= ${canvasWidth}`,
              location,
            });
          }

          if (layer.position && (layer.position.y + layer.size.height > canvasHeight)) {
            issues.push({
              severity: 'warning',
              code: 'EXTENDS_BEYOND_HEIGHT',
              message: `Layer "${layerId}" extends beyond canvas height (y: ${layer.position.y} + height: ${layer.size.height} = ${layer.position.y + layer.size.height}px > ${canvasHeight}px)`,
              fix: `Adjust position or size so y + height <= ${canvasHeight}. Content may be cut off!`,
              location,
            });
          }
        }

        // Check for unsupported animations
        if (layer.animations) {
          layer.animations.forEach((animation: any, animIndex: number) => {
            if (animation.type === 'custom') {
              issues.push({
                severity: 'error',
                code: 'UNSUPPORTED_ANIMATION',
                message: `Layer "${layerId}" uses unsupported custom animation`,
                fix: 'Replace with standard animation: { "type": "entrance", "effect": "fadeIn" } or { "type": "exit", "effect": "fadeOut" }. Custom keyframe animations cause black scenes!',
                location: `${location}.animations[${animIndex}]`,
              });
            }

            if (animation.keyframes) {
              issues.push({
                severity: 'error',
                code: 'KEYFRAMES_NOT_SUPPORTED',
                message: `Layer "${layerId}" uses keyframes which are not supported`,
                fix: 'Use standard entrance/exit animations instead: fadeIn, fadeOut, slideInUp, slideInDown, scaleIn, scaleOut',
                location: `${location}.animations[${animIndex}]`,
              });
            }

            // Check for valid animation effects
            const validEffects = [
              // Entrance - Basic
              'fadeIn', 'fadeInUp', 'fadeInDown', 'fadeInLeft', 'fadeInRight',
              'slideInUp', 'slideInDown', 'slideInLeft', 'slideInRight',
              'scaleIn', 'zoomIn', 'rotateIn', 'bounceIn',
              // Entrance - Advanced
              'flipInX', 'flipInY', 'rollIn', 'lightSpeedIn', 'swingIn',
              'backIn', 'elasticIn',
              'slideInFromTopLeft', 'slideInFromTopRight',
              'slideInFromBottomLeft', 'slideInFromBottomRight',
              // Exit - Basic
              'fadeOut', 'fadeOutUp', 'fadeOutDown', 'fadeOutLeft', 'fadeOutRight',
              'slideOutUp', 'slideOutDown', 'slideOutLeft', 'slideOutRight',
              'scaleOut', 'zoomOut',
              // Exit - Advanced
              'flipOutX', 'flipOutY', 'rollOut', 'lightSpeedOut', 'swingOut',
              'backOut', 'elasticOut',
              // Emphasis
              'pulse', 'shake', 'bounce', 'spin', 'heartbeat', 'float',
              'wobble', 'flash', 'jello', 'rubberBand', 'tada', 'swing'
            ];

            if (animation.effect && !validEffects.includes(animation.effect)) {
              issues.push({
                severity: 'error',
                code: 'INVALID_ANIMATION_EFFECT',
                message: `Layer "${layerId}" uses invalid animation effect "${animation.effect}"`,
                fix: `Use one of the supported effects: ${validEffects.join(', ')}`,
                location: `${location}.animations[${animIndex}]`,
              });
            }
          });
        }

        // Check video layer duration vs scene duration
        if (layer.type === 'video' && layer.props?.src) {
          const sceneDuration = (scene.endFrame - scene.startFrame) / (template.output?.fps || 30);
          if (layer.props.loop) {
            issues.push({
              severity: 'warning',
              code: 'VIDEO_LOOP_FLASH_RISK',
              message: `Layer "${layerId}" uses video with loop:true. If video is shorter than scene (${sceneDuration}s), it will cause visible flash when looping.`,
              fix: 'Make scene duration exactly match video duration to avoid loop flash. Remove "loop": true if duration matches.',
              location,
            });
          }
        }

        // Check for missing props
        if (!layer.props) {
          issues.push({
            severity: 'error',
            code: 'MISSING_PROPS',
            message: `Layer "${layerId}" is missing props object`,
            fix: 'Add props object with layer-specific properties',
            location,
          });
        }
      });
    });
  }

  // Check for gradient syntax errors
  const templateStr = JSON.stringify(template);
  if (templateStr.includes('linear-gradient') || templateStr.includes('radial-gradient')) {
    // Basic gradient syntax check
    const gradientRegex = /(linear|radial)-gradient\s*\(/g;
    const matches = templateStr.match(gradientRegex);
    if (matches) {
      // Just warn about gradients being sensitive to syntax
      issues.push({
        severity: 'warning',
        code: 'GRADIENT_SYNTAX_CHECK',
        message: 'Template uses CSS gradients - ensure proper syntax',
        fix: 'Format: "linear-gradient(135deg, #color1 0%, #color2 100%)" or "radial-gradient(circle, #color1, #color2)"',
      });
    }
  }

  const hasErrors = issues.some(issue => issue.severity === 'error');

  return {
    valid: !hasErrors,
    issues,
  };
}
