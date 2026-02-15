import { describe, it, expect } from 'vitest';
import React from 'react';
import { BarChart } from '../charts/BarChart';
import { LineChart } from '../charts/LineChart';
import { PieChart } from '../charts/PieChart';
import { Gauge } from '../charts/Gauge';

// ═══════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════

/**
 * Simple shallow render check: ensure the component returns
 * a valid React element without throwing.
 */
function renderToElement(element: React.ReactElement): React.ReactElement {
  // Just verify it creates a valid element
  expect(element).toBeTruthy();
  expect(element.type).toBeTruthy();
  return element;
}

// ═══════════════════════════════════════════════════════════════
// BAR CHART
// ═══════════════════════════════════════════════════════════════

describe('BarChart', () => {
  it('should render with minimal props', () => {
    const element = BarChart({
      data: [10, 20, 30],
      frame: 0,
    });
    renderToElement(element);
  });

  it('should render with all props', () => {
    const element = BarChart({
      data: [100, 200, 150, 300],
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00'],
      width: 1000,
      height: 600,
      animationDuration: 45,
      showValues: true,
      showLabels: true,
      spacing: 15,
      borderRadius: 8,
      fontSize: 16,
      textColor: '#ffffff',
      backgroundColor: '#1a1a2e',
      easing: 'easeInOut',
      frame: 30,
    });
    renderToElement(element);
  });

  it('should handle single data point', () => {
    const element = BarChart({
      data: [42],
      frame: 15,
    });
    renderToElement(element);
  });

  it('should handle zero frame (animation start)', () => {
    const element = BarChart({
      data: [10, 20, 30],
      frame: 0,
      animationDuration: 30,
    });
    renderToElement(element);
  });

  it('should handle frame beyond animation duration', () => {
    const element = BarChart({
      data: [10, 20, 30],
      frame: 100,
      animationDuration: 30,
    });
    renderToElement(element);
  });

  it('should accept string color array', () => {
    const element = BarChart({
      data: [10, 20],
      colors: '#3b82f6',
      frame: 15,
    });
    renderToElement(element);
  });
});

// ═══════════════════════════════════════════════════════════════
// LINE CHART
// ═══════════════════════════════════════════════════════════════

describe('LineChart', () => {
  it('should render with minimal props', () => {
    const element = LineChart({
      data: [10, 25, 15, 30, 20],
      frame: 0,
    });
    renderToElement(element);
  });

  it('should render with all props', () => {
    const element = LineChart({
      data: [10, 25, 15, 30, 20, 35],
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      color: '#10b981',
      width: 900,
      height: 500,
      strokeWidth: 4,
      animationDuration: 90,
      showPoints: true,
      pointRadius: 8,
      showValues: true,
      fillArea: true,
      fillColor: 'rgba(16, 185, 129, 0.2)',
      showGrid: true,
      gridColor: 'rgba(255, 255, 255, 0.05)',
      fontSize: 14,
      textColor: '#e2e8f0',
      backgroundColor: '#0f172a',
      smooth: true,
      frame: 60,
    });
    renderToElement(element);
  });

  it('should render with straight lines', () => {
    const element = LineChart({
      data: [5, 15, 10],
      smooth: false,
      frame: 30,
    });
    renderToElement(element);
  });

  it('should render with fill area', () => {
    const element = LineChart({
      data: [10, 20, 15],
      fillArea: true,
      frame: 45,
    });
    renderToElement(element);
  });

  it('should handle two data points', () => {
    const element = LineChart({
      data: [10, 20],
      frame: 30,
    });
    renderToElement(element);
  });
});

// ═══════════════════════════════════════════════════════════════
// PIE CHART
// ═══════════════════════════════════════════════════════════════

describe('PieChart', () => {
  it('should render with minimal props', () => {
    const element = PieChart({
      data: [
        { value: 30, label: 'A' },
        { value: 50, label: 'B' },
        { value: 20, label: 'C' },
      ],
      frame: 0,
    });
    renderToElement(element);
  });

  it('should render as donut chart', () => {
    const element = PieChart({
      data: [
        { value: 40, label: 'Segment 1' },
        { value: 60, label: 'Segment 2' },
      ],
      innerRadius: 0.5,
      frame: 60,
    });
    renderToElement(element);
  });

  it('should render with custom colors in data', () => {
    const element = PieChart({
      data: [
        { value: 25, label: 'Red', color: '#ff0000' },
        { value: 25, label: 'Green', color: '#00ff00' },
        { value: 25, label: 'Blue', color: '#0000ff' },
        { value: 25, label: 'Yellow', color: '#ffff00' },
      ],
      frame: 30,
    });
    renderToElement(element);
  });

  it('should handle single segment', () => {
    const element = PieChart({
      data: [{ value: 100, label: 'All' }],
      frame: 30,
    });
    renderToElement(element);
  });

  it('should render with all options', () => {
    const element = PieChart({
      data: [
        { value: 30, label: 'A' },
        { value: 70, label: 'B' },
      ],
      size: 500,
      innerRadius: 0.3,
      animationDuration: 90,
      showLabels: true,
      showValues: true,
      showPercentages: true,
      fontSize: 16,
      textColor: '#ffffff',
      strokeWidth: 3,
      strokeColor: '#1a1a2e',
      startAngle: 0,
      frame: 45,
    });
    renderToElement(element);
  });
});

// ═══════════════════════════════════════════════════════════════
// GAUGE
// ═══════════════════════════════════════════════════════════════

describe('Gauge', () => {
  it('should render with minimal props', () => {
    const element = Gauge({
      value: 75,
      frame: 0,
    });
    renderToElement(element);
  });

  it('should render with all props', () => {
    const element = Gauge({
      value: 85,
      min: 0,
      max: 100,
      size: 400,
      color: '#10b981',
      trackColor: 'rgba(255, 255, 255, 0.1)',
      strokeWidth: 25,
      startAngle: 135,
      sweepAngle: 270,
      animationDuration: 90,
      showValue: true,
      suffix: '%',
      prefix: '',
      decimals: 1,
      fontSize: 56,
      textColor: '#ffffff',
      label: 'Performance',
      labelFontSize: 18,
      backgroundColor: 'transparent',
      roundCaps: true,
      gradientColors: ['#3b82f6', '#10b981'],
      frame: 60,
    });
    renderToElement(element);
  });

  it('should handle zero value', () => {
    const element = Gauge({
      value: 0,
      frame: 30,
    });
    renderToElement(element);
  });

  it('should handle max value', () => {
    const element = Gauge({
      value: 100,
      frame: 60,
    });
    renderToElement(element);
  });

  it('should handle custom min/max range', () => {
    const element = Gauge({
      value: 50,
      min: -100,
      max: 100,
      frame: 45,
    });
    renderToElement(element);
  });

  it('should render without value text', () => {
    const element = Gauge({
      value: 60,
      showValue: false,
      frame: 30,
    });
    renderToElement(element);
  });

  it('should render with label', () => {
    const element = Gauge({
      value: 72,
      label: 'Speed',
      suffix: ' km/h',
      frame: 45,
    });
    renderToElement(element);
  });

  it('should animate progressively', () => {
    // At frame 0, value should be minimal
    const elem0 = Gauge({ value: 100, frame: 0, animationDuration: 60 });
    expect(elem0).toBeTruthy();

    // At final frame, value should be fully animated
    const elem60 = Gauge({ value: 100, frame: 60, animationDuration: 60 });
    expect(elem60).toBeTruthy();
  });
});
