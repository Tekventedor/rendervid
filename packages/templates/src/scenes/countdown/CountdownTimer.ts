import type { Template, Layer, TextLayer, ShapeLayer } from '@rendervid/core';
import type { SceneTemplate, BaseSceneInputs, SceneGenerateOptions } from '../types';
import { getResolution } from '../types';

/**
 * Inputs for Countdown Timer scene
 */
export interface CountdownInputs extends BaseSceneInputs {
  headline?: string;
  eventName?: string;
  targetDate?: string;
  showLabels?: boolean;
  style?: 'digital' | 'flip' | 'minimal' | 'neon';
}

/**
 * Countdown Timer - Animated countdown display
 */
export const CountdownTimer: SceneTemplate<CountdownInputs> = {
  id: 'countdown-timer',
  name: 'Countdown Timer',
  description: 'Animated countdown timer for events and launches.',
  category: 'promo',
  tags: ['countdown', 'timer', 'event', 'launch', 'promotion'],
  aspectRatios: ['16:9', '9:16', '1:1'],
  defaultAspectRatio: '16:9',
  duration: 5,
  defaultTheme: 'modern',
  inputs: [
    { key: 'headline', type: 'string', label: 'Headline', default: 'Coming Soon' },
    { key: 'eventName', type: 'string', label: 'Event Name', default: 'Product Launch' },
    { key: 'targetDate', type: 'string', label: 'Target Date (YYYY-MM-DD)', default: '2025-01-01' },
    { key: 'showLabels', type: 'boolean', label: 'Show Labels', default: true },
    {
      key: 'style',
      type: 'select',
      label: 'Style',
      options: [
        { value: 'digital', label: 'Digital' },
        { value: 'flip', label: 'Flip Clock' },
        { value: 'minimal', label: 'Minimal' },
        { value: 'neon', label: 'Neon' },
      ],
      default: 'digital',
    },
    { key: 'primaryColor', type: 'color', label: 'Primary Color' },
    { key: 'backgroundColor', type: 'color', label: 'Background Color' },
  ],
  defaults: {
    headline: 'Coming Soon',
    eventName: 'Product Launch',
    targetDate: '2025-01-01',
    showLabels: true,
    style: 'digital',
  },
  generate: (inputs, options) => {
    const { width, height } = getResolution(options.aspectRatio);
    const { theme, fps } = options;
    const totalFrames = (options.duration || 5) * fps;
    const isVertical = options.aspectRatio === '9:16';

    const primaryColor = inputs.primaryColor || theme.colors.primary;
    const bgColor = inputs.backgroundColor || theme.colors.background;
    const style = inputs.style || 'digital';

    const layers: Layer[] = [];

    // Background
    if (style === 'neon') {
      layers.push({
        id: 'background',
        type: 'shape',
        position: { x: 0, y: 0 },
        size: { width, height },
        props: { shape: 'rectangle', fill: '#0a0a0a' },
      } as ShapeLayer);

      // Glow effect
      layers.push({
        id: 'glow',
        type: 'shape',
        position: { x: width / 2 - 300, y: height / 2 - 150 },
        size: { width: 600, height: 300 },
        opacity: 0.3,
        props: {
          shape: 'ellipse',
          gradient: {
            type: 'radial',
            colors: [
              { offset: 0, color: primaryColor },
              { offset: 1, color: 'transparent' },
            ],
          },
        },
      } as ShapeLayer);
    } else {
      layers.push({
        id: 'background',
        type: 'shape',
        position: { x: 0, y: 0 },
        size: { width, height },
        props: { shape: 'rectangle', fill: bgColor },
      } as ShapeLayer);
    }

    // Headline
    if (inputs.headline) {
      layers.push({
        id: 'headline',
        type: 'text',
        position: { x: width * 0.1, y: isVertical ? 100 : 80 },
        size: { width: width * 0.8, height: 60 },
        props: {
          text: inputs.headline,
          fontSize: isVertical ? 36 : 48,
          fontWeight: 'bold',
          color: style === 'neon' ? primaryColor : theme.colors.text,
          textAlign: 'center',
          fontFamily: theme.typography.headingFamily,
        },
        animations: [
          {
            type: 'entrance',
            effect: 'fadeIn',
            delay: 0,
            duration: Math.floor(fps * 0.5),
          },
        ],
      } as TextLayer);
    }

    // Countdown display - showing placeholder values (actual countdown would be dynamic)
    const countdownY = height / 2 - 50;
    const digitWidth = isVertical ? 60 : 80;
    const digitHeight = isVertical ? 80 : 100;
    const spacing = isVertical ? 10 : 20;
    const colonWidth = 20;

    const digits = ['10', ':', '15', ':', '30', ':', '45'];
    const labels = ['DAYS', '', 'HOURS', '', 'MINS', '', 'SECS'];
    const digitBoxWidth = digitWidth * 2 + spacing;
    const totalWidth = digitBoxWidth * 4 + colonWidth * 3;
    let startX = (width - totalWidth) / 2;

    digits.forEach((digit, i) => {
      const isColon = digit === ':';

      if (isColon) {
        // Colon separator
        layers.push({
          id: `colon-${i}`,
          type: 'text',
          position: { x: startX, y: countdownY + digitHeight / 2 - 30 },
          size: { width: colonWidth, height: 60 },
          props: {
            text: ':',
            fontSize: isVertical ? 48 : 64,
            fontWeight: 'bold',
            color: style === 'neon' ? primaryColor : theme.colors.textMuted,
            textAlign: 'center',
            fontFamily: style === 'digital' ? 'monospace' : theme.typography.headingFamily,
          },
          animations: [
            {
              type: 'entrance',
              effect: 'fadeIn',
              delay: Math.floor(fps * 0.3) + i * 5,
              duration: Math.floor(fps * 0.3),
            },
          ],
        } as TextLayer);
        startX += colonWidth;
      } else {
        // Digit box background
        if (style === 'digital' || style === 'flip') {
          layers.push({
            id: `digit-bg-${i}`,
            type: 'shape',
            position: { x: startX, y: countdownY },
            size: { width: digitWidth * 2 + spacing, height: digitHeight },
            props: {
              shape: 'rectangle',
              fill: theme.colors.surface,
              borderRadius: 8,
            },
            animations: [
              {
                type: 'entrance',
                effect: 'scaleIn',
                delay: Math.floor(fps * 0.2) + i * 5,
                duration: Math.floor(fps * 0.4),
                easing: 'easeOutBack',
              },
            ],
          } as ShapeLayer);
        }

        // Digit text
        layers.push({
          id: `digit-${i}`,
          type: 'text',
          position: { x: startX, y: countdownY + (digitHeight - (isVertical ? 48 : 64)) / 2 },
          size: { width: digitWidth * 2 + spacing, height: isVertical ? 60 : 80 },
          props: {
            text: digit,
            fontSize: isVertical ? 48 : 64,
            fontWeight: 'bold',
            color: style === 'neon' ? primaryColor : theme.colors.text,
            textAlign: 'center',
            fontFamily: style === 'digital' ? 'monospace' : theme.typography.headingFamily,
            letterSpacing: style === 'digital' ? 4 : 0,
          },
          animations: [
            {
              type: 'entrance',
              effect: 'fadeIn',
              delay: Math.floor(fps * 0.4) + i * 5,
              duration: Math.floor(fps * 0.3),
            },
          ],
        } as TextLayer);

        // Label below
        if (inputs.showLabels !== false && labels[i]) {
          layers.push({
            id: `label-${i}`,
            type: 'text',
            position: { x: startX, y: countdownY + digitHeight + 10 },
            size: { width: digitWidth * 2 + spacing, height: 24 },
            props: {
              text: labels[i],
              fontSize: 12,
              fontWeight: '500',
              color: theme.colors.textMuted,
              textAlign: 'center',
              fontFamily: theme.typography.fontFamily,
              letterSpacing: 2,
            },
            animations: [
              {
                type: 'entrance',
                effect: 'fadeIn',
                delay: Math.floor(fps * 0.6) + i * 5,
                duration: Math.floor(fps * 0.3),
              },
            ],
          } as TextLayer);
        }

        startX += digitWidth * 2 + spacing + spacing;
      }
    });

    // Event name
    if (inputs.eventName) {
      layers.push({
        id: 'event-name',
        type: 'text',
        position: { x: width * 0.1, y: height * 0.75 },
        size: { width: width * 0.8, height: 40 },
        props: {
          text: inputs.eventName,
          fontSize: isVertical ? 24 : 28,
          fontWeight: '600',
          color: theme.colors.text,
          textAlign: 'center',
          fontFamily: theme.typography.fontFamily,
        },
        animations: [
          {
            type: 'entrance',
            effect: 'slideInUp',
            delay: Math.floor(fps * 0.8),
            duration: Math.floor(fps * 0.4),
            easing: 'easeOutCubic',
          },
        ],
      } as TextLayer);
    }

    return {
      name: 'Countdown Timer',
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
