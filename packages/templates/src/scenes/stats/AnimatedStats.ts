import type { Template, Layer, TextLayer, ShapeLayer } from '@rendervid/core';
import type { SceneTemplate, BaseSceneInputs, SceneGenerateOptions } from '../types';
import { getResolution } from '../types';

/**
 * Single stat item
 */
export interface StatItem {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

/**
 * Inputs for Animated Stats scene
 */
export interface AnimatedStatsInputs extends BaseSceneInputs {
  headline?: string;
  stats: StatItem[];
  layout?: 'row' | 'grid' | 'column';
}

/**
 * Animated Stats - Display statistics with animated counters
 */
export const AnimatedStats: SceneTemplate<AnimatedStatsInputs> = {
  id: 'animated-stats',
  name: 'Animated Stats',
  description: 'Display impressive statistics with animated counting numbers.',
  category: 'stats',
  tags: ['stats', 'numbers', 'counter', 'data', 'infographic'],
  aspectRatios: ['16:9', '9:16', '1:1'],
  defaultAspectRatio: '16:9',
  duration: 5,
  defaultTheme: 'modern',
  inputs: [
    { key: 'headline', type: 'string', label: 'Headline', default: 'Our Impact' },
    {
      key: 'layout',
      type: 'select',
      label: 'Layout',
      options: [
        { value: 'row', label: 'Row' },
        { value: 'grid', label: 'Grid' },
        { value: 'column', label: 'Column' },
      ],
      default: 'row',
    },
    { key: 'primaryColor', type: 'color', label: 'Accent Color' },
    { key: 'backgroundColor', type: 'color', label: 'Background Color' },
  ],
  defaults: {
    headline: 'Our Impact',
    stats: [
      { value: 10000, label: 'Happy Customers', suffix: '+' },
      { value: 50, label: 'Countries', suffix: '+' },
      { value: 99.9, label: 'Uptime', suffix: '%', decimals: 1 },
      { value: 24, label: 'Support', suffix: '/7' },
    ],
    layout: 'row',
  },
  generate: (inputs, options) => {
    const { width, height } = getResolution(options.aspectRatio);
    const { theme, fps } = options;
    const totalFrames = (options.duration || 5) * fps;
    const isVertical = options.aspectRatio === '9:16';

    const accentColor = inputs.primaryColor || theme.colors.primary;
    const bgColor = inputs.backgroundColor || theme.colors.background;
    const stats = inputs.stats || [];
    const layout = inputs.layout || (isVertical ? 'column' : 'row');

    const layers: Layer[] = [];

    // Background
    layers.push({
      id: 'background',
      type: 'shape',
      position: { x: 0, y: 0 },
      size: { width, height },
      props: { shape: 'rectangle', fill: bgColor },
    } as ShapeLayer);

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
          color: theme.colors.text,
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

    // Calculate stat positions
    const statCount = stats.length;
    const contentStartY = inputs.headline ? (isVertical ? 200 : 180) : 100;
    const contentHeight = height - contentStartY - 100;

    let positions: { x: number; y: number; width: number }[] = [];

    if (layout === 'row') {
      const statWidth = (width - 100) / statCount;
      positions = stats.map((_, i) => ({
        x: 50 + i * statWidth,
        y: contentStartY + contentHeight / 2 - 50,
        width: statWidth - 20,
      }));
    } else if (layout === 'column') {
      const statHeight = contentHeight / statCount;
      positions = stats.map((_, i) => ({
        x: width * 0.15,
        y: contentStartY + i * statHeight + statHeight / 2 - 40,
        width: width * 0.7,
      }));
    } else {
      // Grid layout (2x2)
      const cols = 2;
      const rows = Math.ceil(statCount / cols);
      const cellWidth = (width - 100) / cols;
      const cellHeight = contentHeight / rows;
      positions = stats.map((_, i) => ({
        x: 50 + (i % cols) * cellWidth,
        y: contentStartY + Math.floor(i / cols) * cellHeight + cellHeight / 2 - 40,
        width: cellWidth - 20,
      }));
    }

    // Render stats
    stats.forEach((stat, i) => {
      const pos = positions[i];
      const staggerDelay = i * 8;

      // Value (counter animation uses keyframes)
      const valueFontSize = isVertical ? 48 : 64;
      layers.push({
        id: `stat-value-${i}`,
        type: 'text',
        position: { x: pos.x, y: pos.y },
        size: { width: pos.width, height: valueFontSize + 20 },
        props: {
          text: `${stat.prefix || ''}${stat.value.toLocaleString()}${stat.suffix || ''}`,
          fontSize: valueFontSize,
          fontWeight: 'bold',
          color: accentColor,
          textAlign: 'center',
          fontFamily: theme.typography.headingFamily,
        },
        animations: [
          {
            type: 'entrance',
            effect: 'scaleIn',
            delay: Math.floor(fps * 0.3) + staggerDelay,
            duration: Math.floor(fps * 0.5),
            easing: 'easeOutBack',
          },
        ],
      } as TextLayer);

      // Label
      layers.push({
        id: `stat-label-${i}`,
        type: 'text',
        position: { x: pos.x, y: pos.y + valueFontSize + 10 },
        size: { width: pos.width, height: 30 },
        props: {
          text: stat.label,
          fontSize: isVertical ? 16 : 18,
          fontWeight: '500',
          color: theme.colors.textMuted,
          textAlign: 'center',
          fontFamily: theme.typography.fontFamily,
        },
        animations: [
          {
            type: 'entrance',
            effect: 'fadeIn',
            delay: Math.floor(fps * 0.5) + staggerDelay,
            duration: Math.floor(fps * 0.3),
          },
        ],
      } as TextLayer);

      // Divider line (for row layout)
      if (layout === 'row' && i < statCount - 1) {
        layers.push({
          id: `divider-${i}`,
          type: 'shape',
          position: { x: pos.x + pos.width + 5, y: pos.y - 20 },
          size: { width: 2, height: 100 },
          opacity: 0.2,
          props: {
            shape: 'rectangle',
            fill: theme.colors.textMuted,
          },
          animations: [
            {
              type: 'entrance',
              effect: 'scaleIn',
              delay: Math.floor(fps * 0.6),
              duration: Math.floor(fps * 0.4),
            },
          ],
        } as ShapeLayer);
      }
    });

    return {
      name: 'Animated Stats',
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
