import type { Template, Layer, TextLayer, ShapeLayer } from '@rendervid/core';
import type { SceneTemplate, BaseSceneInputs, SceneGenerateOptions } from '../types';
import { getResolution } from '../types';

/**
 * Inputs for Kinetic Text scene
 */
export interface KineticTextInputs extends BaseSceneInputs {
  words: string[];
  style?: 'pop' | 'wave' | 'typewriter' | 'bounce' | 'split';
  speed?: 'slow' | 'normal' | 'fast';
}

/**
 * Kinetic Text - Dynamic word-by-word text animation
 */
export const KineticText: SceneTemplate<KineticTextInputs> = {
  id: 'kinetic-text',
  name: 'Kinetic Text',
  description: 'Dynamic word-by-word text animations for impactful messaging.',
  category: 'text-animation',
  tags: ['kinetic', 'typography', 'words', 'animation', 'dynamic'],
  aspectRatios: ['16:9', '9:16', '1:1'],
  defaultAspectRatio: '16:9',
  duration: 5,
  defaultTheme: 'bold',
  inputs: [
    {
      key: 'style',
      type: 'select',
      label: 'Animation Style',
      options: [
        { value: 'pop', label: 'Pop' },
        { value: 'wave', label: 'Wave' },
        { value: 'typewriter', label: 'Typewriter' },
        { value: 'bounce', label: 'Bounce' },
        { value: 'split', label: 'Split' },
      ],
      default: 'pop',
    },
    {
      key: 'speed',
      type: 'select',
      label: 'Speed',
      options: [
        { value: 'slow', label: 'Slow' },
        { value: 'normal', label: 'Normal' },
        { value: 'fast', label: 'Fast' },
      ],
      default: 'normal',
    },
    { key: 'primaryColor', type: 'color', label: 'Text Color' },
    { key: 'backgroundColor', type: 'color', label: 'Background Color' },
  ],
  defaults: {
    words: ['MAKE', 'YOUR', 'MESSAGE', 'STAND', 'OUT'],
    style: 'pop',
    speed: 'normal',
  },
  generate: (inputs, options) => {
    const { width, height } = getResolution(options.aspectRatio);
    const { theme, fps } = options;
    const totalFrames = (options.duration || 5) * fps;
    const isVertical = options.aspectRatio === '9:16';

    const textColor = inputs.primaryColor || theme.colors.text;
    const bgColor = inputs.backgroundColor || theme.colors.background;
    const style = inputs.style || 'pop';
    const words = inputs.words || ['MAKE', 'YOUR', 'MESSAGE', 'STAND', 'OUT'];

    // Speed settings
    const speedMultiplier = inputs.speed === 'slow' ? 1.5 : inputs.speed === 'fast' ? 0.6 : 1;
    const wordDuration = Math.floor(fps * 0.4 * speedMultiplier);
    const wordDelay = Math.floor(fps * 0.3 * speedMultiplier);

    const layers: Layer[] = [];

    // Background
    layers.push({
      id: 'background',
      type: 'shape',
      position: { x: 0, y: 0 },
      size: { width, height },
      props: { shape: 'rectangle', fill: bgColor },
    } as ShapeLayer);

    // Calculate word positions
    const fontSize = isVertical ? 64 : 96;
    const lineHeight = fontSize * 1.2;

    if (style === 'split') {
      // Words split across the screen
      words.forEach((word, i) => {
        const isEven = i % 2 === 0;
        const startX = isEven ? -width : width;
        const targetX = (width - word.length * fontSize * 0.5) / 2;
        const targetY = height / 2 - ((words.length - 1) * lineHeight) / 2 + i * lineHeight - fontSize / 2;

        layers.push({
          id: `word-${i}`,
          type: 'text',
          position: { x: targetX, y: targetY },
          size: { width: width * 0.9, height: fontSize + 20 },
          props: {
            text: word,
            fontSize,
            fontWeight: '800',
            color: i % 3 === 0 ? theme.colors.primary : textColor,
            textAlign: 'center',
            fontFamily: theme.typography.headingFamily,
          },
          animations: [
            {
              type: 'entrance',
              effect: isEven ? 'slideInLeft' : 'slideInRight',
              delay: Math.floor(fps * 0.2) + i * wordDelay,
              duration: wordDuration,
              easing: 'easeOutCubic',
            },
          ],
        } as TextLayer);
      });
    } else if (style === 'wave') {
      // Wave animation for each word
      const totalTextWidth = words.join(' ').length * fontSize * 0.5;
      let currentX = (width - totalTextWidth) / 2;

      words.forEach((word, i) => {
        const wordWidth = word.length * fontSize * 0.5;

        layers.push({
          id: `word-${i}`,
          type: 'text',
          position: { x: currentX, y: height / 2 - fontSize / 2 },
          size: { width: wordWidth + 20, height: fontSize + 20 },
          props: {
            text: word,
            fontSize,
            fontWeight: 'bold',
            color: textColor,
            textAlign: 'left',
            fontFamily: theme.typography.headingFamily,
          },
          animations: [
            {
              type: 'entrance',
              effect: 'slideInUp',
              delay: Math.floor(fps * 0.2) + i * wordDelay,
              duration: wordDuration,
              easing: 'easeOutBack',
            },
          ],
        } as TextLayer);

        currentX += wordWidth + fontSize * 0.3;
      });
    } else if (style === 'typewriter') {
      // Typewriter effect - words appear one by one
      const fullText = words.join(' ');

      words.forEach((word, i) => {
        const prevWords = words.slice(0, i).join(' ');
        const xOffset = prevWords.length * fontSize * 0.4 + (i > 0 ? fontSize * 0.4 : 0);

        layers.push({
          id: `word-${i}`,
          type: 'text',
          position: {
            x: width * 0.1 + xOffset,
            y: height / 2 - fontSize / 2,
          },
          size: { width: word.length * fontSize * 0.5 + 10, height: fontSize + 20 },
          from: Math.floor(fps * 0.3) + i * wordDelay,
          props: {
            text: word,
            fontSize: isVertical ? 48 : 72,
            fontWeight: '500',
            color: textColor,
            textAlign: 'left',
            fontFamily: 'monospace',
          },
          animations: [
            {
              type: 'entrance',
              effect: 'fadeIn',
              delay: Math.floor(fps * 0.3) + i * wordDelay,
              duration: Math.floor(fps * 0.1),
            },
          ],
        } as TextLayer);
      });

      // Cursor
      layers.push({
        id: 'cursor',
        type: 'shape',
        position: { x: width * 0.1, y: height / 2 - fontSize / 2 },
        size: { width: 4, height: fontSize },
        props: { shape: 'rectangle', fill: theme.colors.primary },
        animations: [
          {
            type: 'emphasis',
            effect: 'pulse',
            delay: 0,
            duration: fps,
          },
        ],
      } as ShapeLayer);
    } else if (style === 'bounce') {
      // Bouncy entrance
      words.forEach((word, i) => {
        const targetY = height / 2 - ((words.length - 1) * lineHeight) / 2 + i * lineHeight - fontSize / 2;

        layers.push({
          id: `word-${i}`,
          type: 'text',
          position: { x: width * 0.05, y: targetY },
          size: { width: width * 0.9, height: fontSize + 20 },
          props: {
            text: word,
            fontSize,
            fontWeight: '800',
            color: textColor,
            textAlign: 'center',
            fontFamily: theme.typography.headingFamily,
          },
          animations: [
            {
              type: 'entrance',
              effect: 'bounceIn',
              delay: Math.floor(fps * 0.2) + i * wordDelay,
              duration: wordDuration,
            },
          ],
        } as TextLayer);
      });
    } else {
      // Pop style (default)
      words.forEach((word, i) => {
        const targetY = height / 2 - ((words.length - 1) * lineHeight) / 2 + i * lineHeight - fontSize / 2;

        layers.push({
          id: `word-${i}`,
          type: 'text',
          position: { x: width * 0.05, y: targetY },
          size: { width: width * 0.9, height: fontSize + 20 },
          props: {
            text: word,
            fontSize,
            fontWeight: '800',
            color: i === Math.floor(words.length / 2) ? theme.colors.primary : textColor,
            textAlign: 'center',
            fontFamily: theme.typography.headingFamily,
          },
          animations: [
            {
              type: 'entrance',
              effect: 'scaleIn',
              delay: Math.floor(fps * 0.2) + i * wordDelay,
              duration: wordDuration,
              easing: 'easeOutBack',
            },
          ],
        } as TextLayer);
      });
    }

    return {
      name: 'Kinetic Text',
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
