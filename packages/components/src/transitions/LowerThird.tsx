import React from 'react';
import type { AnimatedProps } from '../types';

export interface LowerThirdProps extends AnimatedProps {
  /** Main title text */
  title: string;
  /** Subtitle text */
  subtitle?: string;
  /** Position from bottom */
  bottomOffset?: number;
  /** Background color */
  backgroundColor?: string;
  /** Title color */
  titleColor?: string;
  /** Subtitle color */
  subtitleColor?: string;
  /** Accent color for decorative elements */
  accentColor?: string;
  /** Title font size */
  titleFontSize?: number;
  /** Subtitle font size */
  subtitleFontSize?: number;
  /** Font family */
  fontFamily?: string;
  /** Width (if not full width) */
  width?: number;
  /** Position: left, center, right */
  align?: 'left' | 'center' | 'right';
  /** Animation duration in frames */
  animationDuration?: number;
  /** Show duration in frames (how long to stay visible) */
  showDuration?: number;
  /** Animation type */
  animation?: 'slide' | 'fade' | 'grow';
}

/**
 * Lower third overlay component for video titles and captions
 */
export function LowerThird({
  title,
  subtitle,
  bottomOffset = 100,
  backgroundColor = 'rgba(0, 0, 0, 0.8)',
  titleColor = '#ffffff',
  subtitleColor = '#cccccc',
  accentColor = '#3b82f6',
  titleFontSize = 32,
  subtitleFontSize = 20,
  fontFamily = 'Arial, sans-serif',
  width,
  align = 'left',
  animationDuration = 20,
  showDuration = 100,
  animation = 'slide',
  frame = 0,
  style,
  className,
}: LowerThirdProps): React.ReactElement {
  // Calculate animation phases
  const animateIn = Math.min(frame / animationDuration, 1);
  const hold = frame >= animationDuration && frame < animationDuration + showDuration;
  const animateOut = frame >= animationDuration + showDuration
    ? Math.min((frame - animationDuration - showDuration) / animationDuration, 1)
    : 0;

  // Current progress: 0 (hidden) to 1 (visible)
  const progress = animateOut > 0 ? 1 - animateOut : animateIn;

  const getAnimationStyle = (): React.CSSProperties => {
    switch (animation) {
      case 'slide':
        return {
          transform: `translateX(${align === 'right' ? '' : '-'}${(1 - progress) * 100}%)`,
          opacity: 1,
        };
      case 'fade':
        return {
          opacity: progress,
        };
      case 'grow':
        return {
          transform: `scaleX(${progress})`,
          transformOrigin: align === 'right' ? 'right' : 'left',
        };
      default:
        return {};
    }
  };

  const getAlignmentStyle = (): React.CSSProperties => {
    switch (align) {
      case 'center':
        return {
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
        };
      case 'right':
        return {
          right: 0,
          textAlign: 'right',
        };
      case 'left':
      default:
        return {
          left: 0,
          textAlign: 'left',
        };
    }
  };

  // Don't render if completely hidden
  if (progress === 0) {
    return <></>;
  }

  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        bottom: bottomOffset,
        width: width || 'auto',
        maxWidth: width ? undefined : '80%',
        ...getAlignmentStyle(),
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        style={{
          backgroundColor,
          padding: '20px 40px',
          borderLeft: `4px solid ${accentColor}`,
          ...getAnimationStyle(),
        }}
      >
        {/* Title */}
        <div
          style={{
            fontSize: titleFontSize,
            fontWeight: 'bold',
            color: titleColor,
            fontFamily,
            marginBottom: subtitle ? 8 : 0,
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <div
            style={{
              fontSize: subtitleFontSize,
              color: subtitleColor,
              fontFamily,
              lineHeight: 1.3,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}
