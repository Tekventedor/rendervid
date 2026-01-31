/**
 * Filter types available for layers.
 */
export type FilterType =
  | 'blur'
  | 'brightness'
  | 'contrast'
  | 'grayscale'
  | 'hue-rotate'
  | 'invert'
  | 'opacity'
  | 'saturate'
  | 'sepia'
  | 'drop-shadow';

/**
 * Filter animation configuration.
 */
export interface FilterAnimation {
  /** Starting value */
  from: number;
  /** Ending value */
  to: number;
  /** Duration in frames */
  duration: number;
  /** Easing function */
  easing?: string;
}

/**
 * CSS filter definition.
 *
 * @example Blur filter:
 * ```typescript
 * { type: 'blur', value: 5 }  // 5px blur
 * ```
 *
 * @example Animated filter:
 * ```typescript
 * {
 *   type: 'brightness',
 *   value: 1,
 *   animate: {
 *     from: 0.5,
 *     to: 1.5,
 *     duration: 60,
 *     easing: 'easeInOutSine',
 *   },
 * }
 * ```
 */
export interface Filter {
  /**
   * Filter type
   */
  type: FilterType;

  /**
   * Filter value.
   * - blur: pixels
   * - brightness: multiplier (1 = normal)
   * - contrast: multiplier (1 = normal)
   * - grayscale: percentage (0-100)
   * - hue-rotate: degrees (0-360)
   * - invert: percentage (0-100)
   * - opacity: multiplier (0-1)
   * - saturate: multiplier (1 = normal)
   * - sepia: percentage (0-100)
   * - drop-shadow: CSS shadow string
   */
  value: number | string;

  /**
   * Animate filter over time
   */
  animate?: FilterAnimation;
}

/**
 * Convert filter to CSS filter function string.
 */
export function filterToCSS(filter: Filter): string {
  const { type, value } = filter;

  switch (type) {
    case 'blur':
      return `blur(${value}px)`;
    case 'brightness':
      return `brightness(${value})`;
    case 'contrast':
      return `contrast(${value})`;
    case 'grayscale':
      return `grayscale(${value}%)`;
    case 'hue-rotate':
      return `hue-rotate(${value}deg)`;
    case 'invert':
      return `invert(${value}%)`;
    case 'opacity':
      return `opacity(${value})`;
    case 'saturate':
      return `saturate(${value})`;
    case 'sepia':
      return `sepia(${value}%)`;
    case 'drop-shadow':
      return `drop-shadow(${value})`;
    default:
      return '';
  }
}

/**
 * Convert multiple filters to CSS filter string.
 */
export function filtersToCSS(filters: Filter[]): string {
  return filters.map(filterToCSS).filter(Boolean).join(' ');
}
