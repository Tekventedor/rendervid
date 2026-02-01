import type { Template, Layer, TextLayer, ShapeLayer } from '@rendervid/core';
import type { SceneTemplate, BaseSceneInputs, SceneGenerateOptions } from '../types';
import { getResolution } from '../types';

/**
 * Inputs for Modern Lower Third scene
 */
export interface LowerThirdInputs extends BaseSceneInputs {
  name: string;
  title: string;
  company?: string;
  position?: 'left' | 'right';
}

/**
 * Modern Lower Third - Clean name/title overlay
 */
export const ModernLowerThird: SceneTemplate<LowerThirdInputs> = {
  id: 'modern-lower-third',
  name: 'Modern Lower Third',
  description: 'Clean, professional lower third for interviews and presentations.',
  category: 'lower-third',
  tags: ['lower-third', 'name', 'title', 'interview', 'professional'],
  aspectRatios: ['16:9', '9:16', '1:1'],
  defaultAspectRatio: '16:9',
  duration: 5,
  defaultTheme: 'modern',
  inputs: [
    { key: 'name', type: 'string', label: 'Name', required: true, default: 'John Doe' },
    { key: 'title', type: 'string', label: 'Title/Role', required: true, default: 'CEO & Founder' },
    { key: 'company', type: 'string', label: 'Company', default: '' },
    {
      key: 'position',
      type: 'select',
      label: 'Position',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'right', label: 'Right' },
      ],
      default: 'left',
    },
    { key: 'primaryColor', type: 'color', label: 'Accent Color' },
  ],
  defaults: {
    name: 'John Doe',
    title: 'CEO & Founder',
    company: '',
    position: 'left',
  },
  generate: (inputs, options) => {
    const { width, height } = getResolution(options.aspectRatio);
    const { theme, fps } = options;
    const totalFrames = (options.duration || 5) * fps;

    const accentColor = inputs.primaryColor || theme.colors.primary;
    const position = inputs.position || 'left';
    const isRight = position === 'right';

    // Position calculations
    const containerWidth = width * 0.4;
    const containerHeight = 100;
    const containerX = isRight ? width - containerWidth - 60 : 60;
    const containerY = height - containerHeight - 80;

    const layers: Layer[] = [];

    // Background panel with blur effect simulation
    layers.push({
      id: 'panel-bg',
      type: 'shape',
      position: { x: containerX, y: containerY },
      size: { width: containerWidth, height: containerHeight },
      opacity: 0.85,
      props: {
        shape: 'rectangle',
        fill: theme.colors.surface,
        borderRadius: 8,
      },
      animations: [
        {
          type: 'entrance',
          effect: isRight ? 'slideInRight' : 'slideInLeft',
          delay: 0,
          duration: Math.floor(fps * 0.4),
          easing: 'easeOutCubic',
        },
        {
          type: 'exit',
          effect: isRight ? 'slideOutRight' : 'slideOutLeft',
          delay: totalFrames - Math.floor(fps * 0.4),
          duration: Math.floor(fps * 0.4),
          easing: 'easeInCubic',
        },
      ],
    } as ShapeLayer);

    // Accent line
    layers.push({
      id: 'accent-line',
      type: 'shape',
      position: { x: isRight ? containerX + containerWidth - 4 : containerX, y: containerY },
      size: { width: 4, height: containerHeight },
      props: {
        shape: 'rectangle',
        fill: accentColor,
      },
      animations: [
        {
          type: 'entrance',
          effect: 'scaleIn',
          delay: Math.floor(fps * 0.2),
          duration: Math.floor(fps * 0.3),
          easing: 'easeOutCubic',
        },
      ],
    } as ShapeLayer);

    // Name text
    layers.push({
      id: 'name',
      type: 'text',
      position: {
        x: isRight ? containerX + 20 : containerX + 20,
        y: containerY + 20,
      },
      size: { width: containerWidth - 40, height: 36 },
      props: {
        text: inputs.name || 'John Doe',
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.text,
        textAlign: isRight ? 'right' : 'left',
        fontFamily: theme.typography.headingFamily,
      },
      animations: [
        {
          type: 'entrance',
          effect: 'fadeIn',
          delay: Math.floor(fps * 0.3),
          duration: Math.floor(fps * 0.3),
        },
      ],
    } as TextLayer);

    // Title text
    const titleText = inputs.company
      ? `${inputs.title} · ${inputs.company}`
      : inputs.title;

    layers.push({
      id: 'title',
      type: 'text',
      position: {
        x: isRight ? containerX + 20 : containerX + 20,
        y: containerY + 56,
      },
      size: { width: containerWidth - 40, height: 28 },
      props: {
        text: titleText,
        fontSize: 16,
        fontWeight: '500',
        color: theme.colors.textMuted,
        textAlign: isRight ? 'right' : 'left',
        fontFamily: theme.typography.fontFamily,
      },
      animations: [
        {
          type: 'entrance',
          effect: 'fadeIn',
          delay: Math.floor(fps * 0.4),
          duration: Math.floor(fps * 0.3),
        },
      ],
    } as TextLayer);

    return {
      name: 'Modern Lower Third',
      output: {
        type: 'video',
        width,
        height,
        fps,
        duration: options.duration || 5,
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
