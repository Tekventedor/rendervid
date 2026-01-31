import type { AnimatableProperties, Keyframe, CompiledAnimation } from '../types';
import { parseEasing } from './easings';

/**
 * Interpolate between two values using an easing function.
 */
export function interpolate(
  from: number,
  to: number,
  progress: number,
  easing: string = 'linear'
): number {
  const easingFn = parseEasing(easing);
  const easedProgress = easingFn(progress);
  return from + (to - from) * easedProgress;
}

/**
 * Get value at a specific frame from keyframes.
 */
export function getValueAtFrame(
  keyframes: Keyframe[],
  property: string,
  frame: number
): number | undefined {
  if (keyframes.length === 0) return undefined;

  // Find surrounding keyframes
  let prevKeyframe: Keyframe | null = null;
  let nextKeyframe: Keyframe | null = null;

  for (const kf of keyframes) {
    if (kf.properties[property] === undefined) continue;

    if (kf.frame <= frame) {
      prevKeyframe = kf;
    }
    if (kf.frame > frame && nextKeyframe === null) {
      nextKeyframe = kf;
    }
  }

  // Before first keyframe
  if (prevKeyframe === null) {
    if (nextKeyframe !== null) {
      return nextKeyframe.properties[property];
    }
    return undefined;
  }

  // After last keyframe or at exact keyframe
  if (nextKeyframe === null || prevKeyframe.frame === frame) {
    return prevKeyframe.properties[property];
  }

  // Interpolate between keyframes
  const fromValue = prevKeyframe.properties[property];
  const toValue = nextKeyframe.properties[property];

  if (fromValue === undefined || toValue === undefined) {
    return fromValue ?? toValue;
  }

  const duration = nextKeyframe.frame - prevKeyframe.frame;
  const elapsed = frame - prevKeyframe.frame;
  const progress = elapsed / duration;

  return interpolate(fromValue, toValue, progress, prevKeyframe.easing);
}

/**
 * Get all properties at a specific frame.
 */
export function getPropertiesAtFrame(
  keyframes: Keyframe[],
  frame: number
): AnimatableProperties {
  const result: AnimatableProperties = {};

  // Collect all property names from all keyframes
  const propertyNames = new Set<string>();
  for (const kf of keyframes) {
    for (const key of Object.keys(kf.properties)) {
      propertyNames.add(key);
    }
  }

  // Get value for each property
  for (const prop of propertyNames) {
    const value = getValueAtFrame(keyframes, prop, frame);
    if (value !== undefined) {
      result[prop] = value;
    }
  }

  return result;
}

/**
 * Compile an animation for efficient playback.
 * Pre-calculates values for each frame.
 */
export function compileAnimation(
  keyframes: Keyframe[],
  totalFrames: number
): CompiledAnimation {
  // Pre-compute all frames
  const frameCache: AnimatableProperties[] = new Array(totalFrames);

  for (let frame = 0; frame < totalFrames; frame++) {
    frameCache[frame] = getPropertiesAtFrame(keyframes, frame);
  }

  return {
    totalFrames,
    getPropertiesAtFrame: (frame: number) => {
      if (frame < 0) return frameCache[0];
      if (frame >= totalFrames) return frameCache[totalFrames - 1];
      return frameCache[Math.floor(frame)];
    },
  };
}

/**
 * Merge multiple property sets, later values override earlier.
 */
export function mergeProperties(
  ...propertySets: (AnimatableProperties | undefined)[]
): AnimatableProperties {
  const result: AnimatableProperties = {};

  for (const props of propertySets) {
    if (props) {
      for (const [key, value] of Object.entries(props)) {
        if (value !== undefined) {
          result[key] = value;
        }
      }
    }
  }

  return result;
}

/**
 * Apply animated properties to base values.
 */
export function applyAnimatedProperties(
  base: AnimatableProperties,
  animated: AnimatableProperties
): AnimatableProperties {
  return mergeProperties(base, animated);
}
