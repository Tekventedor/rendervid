import type { Layer, Animation } from '@rendervid/core';

/**
 * Assert that a layer has an animation on a given property.
 * For preset animations, the property name is checked against the animation effect name.
 * For keyframe animations, the property name is checked in keyframe properties.
 */
export function expectAnimationProperty(layer: Layer, property: string): void {
  if (!layer.animations || layer.animations.length === 0) {
    throw new Error(
      `Expected layer "${layer.id}" to have animations, but it has none`
    );
  }

  const hasProperty = layer.animations.some((anim) => {
    // For keyframe animations, check if any keyframe contains the property
    if (anim.type === 'keyframe' && anim.keyframes) {
      return anim.keyframes.some(
        (kf) => property in kf.properties && kf.properties[property] !== undefined
      );
    }
    // For preset animations, they animate standard properties
    // Check if the effect name implies this property
    return hasAnimatedProperty(anim, property);
  });

  if (!hasProperty) {
    throw new Error(
      `Expected layer "${layer.id}" to have an animation on property "${property}", but none was found`
    );
  }
}

/**
 * Assert that a layer has a specific number of keyframes for a given property.
 */
export function expectKeyframeCount(
  layer: Layer,
  property: string,
  count: number
): void {
  if (!layer.animations || layer.animations.length === 0) {
    throw new Error(
      `Expected layer "${layer.id}" to have animations, but it has none`
    );
  }

  let totalKeyframes = 0;
  for (const anim of layer.animations) {
    if (anim.keyframes) {
      totalKeyframes += anim.keyframes.filter(
        (kf) => property in kf.properties && kf.properties[property] !== undefined
      ).length;
    }
  }

  if (totalKeyframes !== count) {
    throw new Error(
      `Expected ${count} keyframe(s) for property "${property}" on layer "${layer.id}", but found ${totalKeyframes}`
    );
  }
}

/**
 * Assert that an animation produces an expected value at a specific frame.
 * Only works with keyframe animations that have explicit keyframe data.
 */
export function expectValueAtFrame(
  animation: Animation,
  frame: number,
  expected: unknown
): void {
  if (!animation.keyframes || animation.keyframes.length === 0) {
    throw new Error(
      'Cannot evaluate value at frame: animation has no keyframes'
    );
  }

  // Find the two surrounding keyframes
  const sortedKf = [...animation.keyframes].sort((a, b) => a.frame - b.frame);

  // Find the keyframe at or closest before the target frame
  let beforeKf = sortedKf[0];
  let afterKf = sortedKf[sortedKf.length - 1];

  for (let i = 0; i < sortedKf.length; i++) {
    if (sortedKf[i].frame <= frame) {
      beforeKf = sortedKf[i];
    }
    if (sortedKf[i].frame >= frame) {
      afterKf = sortedKf[i];
      break;
    }
  }

  // If the frame exactly matches a keyframe, compare directly
  const exactMatch = sortedKf.find((kf) => kf.frame === frame);
  if (exactMatch) {
    const actual = exactMatch.properties;
    if (typeof expected === 'object' && expected !== null) {
      for (const [key, value] of Object.entries(expected as Record<string, unknown>)) {
        if (actual[key] !== value) {
          throw new Error(
            `Expected property "${key}" to be ${value} at frame ${frame}, but got ${actual[key]}`
          );
        }
      }
    } else {
      throw new Error(
        'Expected value must be an object with property names and values'
      );
    }
    return;
  }

  // For frames between keyframes, we report the bounding keyframes
  throw new Error(
    `Frame ${frame} falls between keyframes at frame ${beforeKf.frame} and frame ${afterKf.frame}. ` +
    `Use @rendervid/core's getValueAtFrame() for interpolated values.`
  );
}

/**
 * Check if a preset animation implies animating a specific property.
 */
function hasAnimatedProperty(anim: Animation, property: string): boolean {
  if (!anim.effect) return false;

  const effect = anim.effect.toLowerCase();

  const propertyEffectMap: Record<string, string[]> = {
    opacity: ['fade', 'flash'],
    x: ['slide', 'slideleft', 'slideright', 'shake', 'wobble', 'lightspeed', 'roll', 'push', 'back'],
    y: ['slide', 'slideup', 'slidedown', 'bounce', 'float'],
    scaleX: ['scale', 'zoom', 'pulse', 'heartbeat', 'rubberband', 'jello'],
    scaleY: ['scale', 'zoom', 'pulse', 'heartbeat', 'rubberband', 'jello'],
    rotation: ['rotate', 'spin', 'swing', 'tada', 'roll', 'flip'],
  };

  const patterns = propertyEffectMap[property];
  if (!patterns) return false;

  return patterns.some((pattern) => effect.includes(pattern));
}
