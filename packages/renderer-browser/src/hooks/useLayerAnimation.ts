import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import type { Layer, Animation, AnimatableProperties } from '@rendervid/core';
import {
  getPropertiesAtFrame,
  generatePresetKeyframes,
  compileAnimation,
} from '@rendervid/core';

export interface UseLayerAnimationResult {
  style: CSSProperties;
  properties: AnimatableProperties;
}

/**
 * Hook to calculate animated properties for a layer at a specific frame.
 */
export function useLayerAnimation(
  layer: Layer,
  frame: number,
  fps: number,
  sceneDuration: number
): UseLayerAnimationResult {
  const animatedProperties = useMemo(() => {
    if (!layer.animations || layer.animations.length === 0) {
      return {};
    }

    let combined: AnimatableProperties = {};

    for (const animation of layer.animations) {
      const animProps = getAnimationPropertiesAtFrame(
        animation,
        frame,
        fps,
        sceneDuration,
        layer.size
      );
      combined = { ...combined, ...animProps };
    }

    return combined;
  }, [layer.animations, frame, fps, sceneDuration, layer.size]);

  const style = useMemo(() => {
    const css: CSSProperties = {};

    if (animatedProperties.opacity !== undefined) {
      css.opacity = animatedProperties.opacity;
    }
    if (animatedProperties.x !== undefined || animatedProperties.y !== undefined) {
      const x = animatedProperties.x ?? 0;
      const y = animatedProperties.y ?? 0;
      css.transform = `translate(${x}px, ${y}px)`;
    }
    if (animatedProperties.scaleX !== undefined || animatedProperties.scaleY !== undefined) {
      const scaleX = animatedProperties.scaleX ?? 1;
      const scaleY = animatedProperties.scaleY ?? 1;
      const existing = css.transform || '';
      css.transform = `${existing} scale(${scaleX}, ${scaleY})`.trim();
    }
    if (animatedProperties.rotation !== undefined) {
      const existing = css.transform || '';
      css.transform = `${existing} rotate(${animatedProperties.rotation}deg)`.trim();
    }

    return css;
  }, [animatedProperties]);

  return { style, properties: animatedProperties };
}

/**
 * Get animation properties at a specific frame.
 */
function getAnimationPropertiesAtFrame(
  animation: Animation,
  frame: number,
  fps: number,
  sceneDuration: number,
  layerSize: { width: number; height: number }
): AnimatableProperties {
  const { type, effect, duration, delay = 0, keyframes, loop = 1, alternate = false } = animation;

  // Calculate animation start and end frames
  const animStart = delay;
  const animDuration = duration;
  const animEnd = animStart + animDuration;

  // Handle looping
  let localFrame = frame - animStart;
  if (localFrame < 0) {
    // Before animation starts
    if (type === 'entrance') {
      return getAnimationStartProperties(animation, layerSize);
    }
    return {};
  }

  if (loop !== 1 && localFrame >= animDuration) {
    if (loop === -1) {
      // Infinite loop
      localFrame = localFrame % animDuration;
      if (alternate && Math.floor((frame - animStart) / animDuration) % 2 === 1) {
        localFrame = animDuration - localFrame;
      }
    } else if (loop > 1) {
      const totalDuration = animDuration * loop;
      if (localFrame >= totalDuration) {
        // Animation finished
        if (type === 'exit') {
          return getAnimationEndProperties(animation, layerSize);
        }
        return {};
      }
      localFrame = localFrame % animDuration;
      if (alternate && Math.floor((frame - animStart) / animDuration) % 2 === 1) {
        localFrame = animDuration - localFrame;
      }
    }
  }

  if (localFrame >= animDuration) {
    // After animation ends
    if (type === 'exit') {
      return getAnimationEndProperties(animation, layerSize);
    }
    return {};
  }

  // Get keyframes (either from preset or custom)
  let animKeyframes = keyframes;
  if (!animKeyframes && effect) {
    animKeyframes = generatePresetKeyframes(effect, {
      duration: animDuration,
      easing: animation.easing,
      layerSize,
    });
  }

  if (!animKeyframes || animKeyframes.length === 0) {
    return {};
  }

  return getPropertiesAtFrame(animKeyframes, localFrame);
}

/**
 * Get properties at the start of an animation.
 */
function getAnimationStartProperties(
  animation: Animation,
  layerSize: { width: number; height: number }
): AnimatableProperties {
  const { effect, keyframes, duration } = animation;

  let animKeyframes = keyframes;
  if (!animKeyframes && effect) {
    animKeyframes = generatePresetKeyframes(effect, {
      duration,
      easing: animation.easing,
      layerSize,
    });
  }

  if (!animKeyframes || animKeyframes.length === 0) {
    return {};
  }

  return getPropertiesAtFrame(animKeyframes, 0);
}

/**
 * Get properties at the end of an animation.
 */
function getAnimationEndProperties(
  animation: Animation,
  layerSize: { width: number; height: number }
): AnimatableProperties {
  const { effect, keyframes, duration } = animation;

  let animKeyframes = keyframes;
  if (!animKeyframes && effect) {
    animKeyframes = generatePresetKeyframes(effect, {
      duration,
      easing: animation.easing,
      layerSize,
    });
  }

  if (!animKeyframes || animKeyframes.length === 0) {
    return {};
  }

  return getPropertiesAtFrame(animKeyframes, duration);
}
