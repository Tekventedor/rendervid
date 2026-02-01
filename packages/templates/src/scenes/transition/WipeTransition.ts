import type { Template, Layer, ShapeLayer } from '@rendervid/core';
import type { SceneTemplate, BaseSceneInputs, SceneGenerateOptions } from '../types';
import { getResolution } from '../types';

/**
 * Inputs for Wipe Transition scene
 */
export interface WipeTransitionInputs extends BaseSceneInputs {
  direction?: 'left' | 'right' | 'up' | 'down' | 'diagonal';
  color?: string;
  style?: 'solid' | 'gradient' | 'strips' | 'blinds';
}

/**
 * Wipe Transition - Smooth wipe transition effect
 */
export const WipeTransition: SceneTemplate<WipeTransitionInputs> = {
  id: 'wipe-transition',
  name: 'Wipe Transition',
  description: 'Smooth wipe transition between scenes.',
  category: 'transition',
  tags: ['transition', 'wipe', 'effect', 'animation'],
  aspectRatios: ['16:9', '9:16', '1:1'],
  defaultAspectRatio: '16:9',
  duration: 1,
  defaultTheme: 'modern',
  inputs: [
    {
      key: 'direction',
      type: 'select',
      label: 'Direction',
      options: [
        { value: 'left', label: 'Left to Right' },
        { value: 'right', label: 'Right to Left' },
        { value: 'up', label: 'Bottom to Top' },
        { value: 'down', label: 'Top to Bottom' },
        { value: 'diagonal', label: 'Diagonal' },
      ],
      default: 'left',
    },
    {
      key: 'style',
      type: 'select',
      label: 'Style',
      options: [
        { value: 'solid', label: 'Solid' },
        { value: 'gradient', label: 'Gradient' },
        { value: 'strips', label: 'Strips' },
        { value: 'blinds', label: 'Blinds' },
      ],
      default: 'solid',
    },
    { key: 'color', type: 'color', label: 'Wipe Color' },
    { key: 'backgroundColor', type: 'color', label: 'Background Color' },
  ],
  defaults: {
    direction: 'left',
    style: 'solid',
  },
  generate: (inputs, options) => {
    const { width, height } = getResolution(options.aspectRatio);
    const { theme, fps } = options;
    const totalFrames = (options.duration || 1) * fps;

    const wipeColor = inputs.color || theme.colors.primary;
    const bgColor = inputs.backgroundColor || theme.colors.background;
    const direction = inputs.direction || 'left';
    const style = inputs.style || 'solid';

    const layers: Layer[] = [];

    // Background (represents the outgoing scene)
    layers.push({
      id: 'background',
      type: 'shape',
      position: { x: 0, y: 0 },
      size: { width, height },
      props: { shape: 'rectangle', fill: bgColor },
    } as ShapeLayer);

    if (style === 'blinds') {
      // Venetian blind effect
      const blindCount = 10;
      const blindHeight = height / blindCount;

      for (let i = 0; i < blindCount; i++) {
        layers.push({
          id: `blind-${i}`,
          type: 'shape',
          position: { x: 0, y: i * blindHeight },
          size: { width, height: blindHeight },
          props: { shape: 'rectangle', fill: wipeColor },
          animations: [
            {
              type: 'entrance',
              effect: direction === 'left' || direction === 'right' ? 'slideInLeft' : 'slideInUp',
              delay: Math.floor(i * (totalFrames * 0.5) / blindCount),
              duration: Math.floor(totalFrames * 0.6),
              easing: 'easeOutCubic',
            },
            {
              type: 'exit',
              effect: direction === 'left' || direction === 'right' ? 'slideOutRight' : 'slideOutDown',
              delay: Math.floor(totalFrames * 0.5) + Math.floor(i * (totalFrames * 0.4) / blindCount),
              duration: Math.floor(totalFrames * 0.5),
              easing: 'easeInCubic',
            },
          ],
        } as ShapeLayer);
      }
    } else if (style === 'strips') {
      // Vertical strips
      const stripCount = 8;
      const stripWidth = width / stripCount;

      for (let i = 0; i < stripCount; i++) {
        layers.push({
          id: `strip-${i}`,
          type: 'shape',
          position: { x: i * stripWidth, y: 0 },
          size: { width: stripWidth, height },
          props: { shape: 'rectangle', fill: wipeColor },
          animations: [
            {
              type: 'entrance',
              effect: 'scaleIn',
              delay: Math.floor(i * (totalFrames * 0.3) / stripCount),
              duration: Math.floor(totalFrames * 0.4),
              easing: 'easeOutCubic',
            },
            {
              type: 'exit',
              effect: 'scaleOut',
              delay: Math.floor(totalFrames * 0.6) + Math.floor(i * (totalFrames * 0.3) / stripCount),
              duration: Math.floor(totalFrames * 0.4),
              easing: 'easeInCubic',
            },
          ],
        } as ShapeLayer);
      }
    } else {
      // Solid or gradient wipe
      const wipeLayer: ShapeLayer = {
        id: 'wipe',
        type: 'shape',
        position: { x: 0, y: 0 },
        size: { width: width * 2, height: height * 2 },
        props: {
          shape: 'rectangle',
          fill: style === 'gradient' ? undefined : wipeColor,
          gradient: style === 'gradient'
            ? {
                type: 'linear',
                colors: [
                  { offset: 0, color: wipeColor },
                  { offset: 1, color: theme.colors.secondary || bgColor },
                ],
                angle: direction === 'diagonal' ? 45 : 0,
              }
            : undefined,
        },
        animations: [],
      };

      // Set entrance animation based on direction
      let entrancePreset: string;
      let exitPreset: string;

      switch (direction) {
        case 'right':
          entrancePreset = 'slideInRight';
          exitPreset = 'slideOutLeft';
          break;
        case 'up':
          entrancePreset = 'slideInUp';
          exitPreset = 'slideOutDown';
          break;
        case 'down':
          entrancePreset = 'slideInDown';
          exitPreset = 'slideOutUp';
          break;
        case 'diagonal':
          entrancePreset = 'slideInLeft';
          exitPreset = 'slideOutRight';
          break;
        default: // left
          entrancePreset = 'slideInLeft';
          exitPreset = 'slideOutRight';
      }

      wipeLayer.animations = [
        {
          type: 'entrance',
          effect: entrancePreset,
          delay: 0,
          duration: Math.floor(totalFrames * 0.5),
          easing: 'easeInOutCubic',
        },
        {
          type: 'exit',
          effect: exitPreset,
          delay: Math.floor(totalFrames * 0.5),
          duration: Math.floor(totalFrames * 0.5),
          easing: 'easeInOutCubic',
        },
      ];

      layers.push(wipeLayer);
    }

    return {
      name: 'Wipe Transition',
      output: {
        type: 'video',
        width,
        height,
        fps,
        duration: options.duration || 1,
      },
      inputs: [],
      composition: {
        scenes: [
          {
            id: 'main',
            startFrame: 0,
            endFrame: totalFrames,
            layers,
          },
        ],
      },
    };
  },
};
