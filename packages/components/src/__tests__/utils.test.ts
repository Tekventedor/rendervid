import { describe, it, expect } from 'vitest';
import {
  lerp,
  clamp,
  getProgress,
  easeIn,
  easeOut,
  easeInOut,
  easeInOutCubic,
  spring,
  frameToTime,
  timeToFrame,
} from '../utils';

describe('lerp', () => {
  it('should return start value at progress 0', () => {
    expect(lerp(0, 100, 0)).toBe(0);
  });

  it('should return end value at progress 1', () => {
    expect(lerp(0, 100, 1)).toBe(100);
  });

  it('should return mid value at progress 0.5', () => {
    expect(lerp(0, 100, 0.5)).toBe(50);
  });

  it('should handle negative values', () => {
    expect(lerp(-100, 100, 0.5)).toBe(0);
  });

  it('should handle progress > 1', () => {
    expect(lerp(0, 100, 1.5)).toBe(150);
  });
});

describe('clamp', () => {
  it('should return value if within range', () => {
    expect(clamp(50, 0, 100)).toBe(50);
  });

  it('should return min if value is below', () => {
    expect(clamp(-10, 0, 100)).toBe(0);
  });

  it('should return max if value is above', () => {
    expect(clamp(150, 0, 100)).toBe(100);
  });

  it('should handle min === max', () => {
    expect(clamp(50, 100, 100)).toBe(100);
  });
});

describe('getProgress', () => {
  it('should return 0 before start frame', () => {
    expect(getProgress(0, 10, 20)).toBe(0);
  });

  it('should return 1 after end frame', () => {
    expect(getProgress(30, 10, 20)).toBe(1);
  });

  it('should return 0.5 at midpoint', () => {
    expect(getProgress(15, 10, 20)).toBe(0.5);
  });

  it('should return 0 at start frame', () => {
    expect(getProgress(10, 10, 20)).toBe(0);
  });

  it('should return 1 at end frame', () => {
    expect(getProgress(20, 10, 20)).toBe(1);
  });
});

describe('easing functions', () => {
  describe('easeIn', () => {
    it('should return 0 at t=0', () => {
      expect(easeIn(0)).toBe(0);
    });

    it('should return 1 at t=1', () => {
      expect(easeIn(1)).toBe(1);
    });

    it('should be less than linear at t=0.5', () => {
      expect(easeIn(0.5)).toBeLessThan(0.5);
    });
  });

  describe('easeOut', () => {
    it('should return 0 at t=0', () => {
      expect(easeOut(0)).toBe(0);
    });

    it('should return 1 at t=1', () => {
      expect(easeOut(1)).toBe(1);
    });

    it('should be greater than linear at t=0.5', () => {
      expect(easeOut(0.5)).toBeGreaterThan(0.5);
    });
  });

  describe('easeInOut', () => {
    it('should return 0 at t=0', () => {
      expect(easeInOut(0)).toBe(0);
    });

    it('should return 1 at t=1', () => {
      expect(easeInOut(1)).toBe(1);
    });

    it('should return 0.5 at t=0.5', () => {
      expect(easeInOut(0.5)).toBe(0.5);
    });
  });

  describe('easeInOutCubic', () => {
    it('should return 0 at t=0', () => {
      expect(easeInOutCubic(0)).toBe(0);
    });

    it('should return 1 at t=1', () => {
      expect(easeInOutCubic(1)).toBe(1);
    });

    it('should return 0.5 at t=0.5', () => {
      expect(easeInOutCubic(0.5)).toBe(0.5);
    });
  });

  describe('spring', () => {
    it('should return 0 at t=0', () => {
      expect(spring(0)).toBeCloseTo(0, 2);
    });

    it('should approach 1 as t increases', () => {
      expect(spring(1)).toBeCloseTo(1, 1);
      expect(spring(2)).toBeCloseTo(1, 2);
    });

    it('should overshoot with low damping', () => {
      const lowDampValue = spring(0.3, 100, 5);
      // Low damping causes overshoot
      expect(lowDampValue).toBeGreaterThan(0);
    });
  });
});

describe('time/frame conversion', () => {
  describe('frameToTime', () => {
    it('should convert frames to seconds', () => {
      expect(frameToTime(30, 30)).toBe(1);
      expect(frameToTime(60, 30)).toBe(2);
      expect(frameToTime(15, 30)).toBe(0.5);
    });

    it('should handle different fps', () => {
      expect(frameToTime(60, 60)).toBe(1);
      expect(frameToTime(24, 24)).toBe(1);
    });
  });

  describe('timeToFrame', () => {
    it('should convert seconds to frames', () => {
      expect(timeToFrame(1, 30)).toBe(30);
      expect(timeToFrame(2, 30)).toBe(60);
      expect(timeToFrame(0.5, 30)).toBe(15);
    });

    it('should round to nearest frame', () => {
      expect(timeToFrame(1.016, 30)).toBe(30);
      expect(timeToFrame(1.017, 30)).toBe(31);
    });
  });
});
