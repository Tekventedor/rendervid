import React from 'react';
import type { AnimatedProps } from '../types';

export interface CallToActionProps extends AnimatedProps {
  /** Main CTA text */
  text: string;
  /** Secondary text/description */
  subtitle?: string;
  /** Button text */
  buttonText?: string;
  /** Position */
  position?: 'top' | 'center' | 'bottom';
  /** Horizontal alignment */
  align?: 'left' | 'center' | 'right';
  /** Background color */
  backgroundColor?: string;
  /** Text color */
  textColor?: string;
  /** Button background color */
  buttonColor?: string;
  /** Button text color */
  buttonTextColor?: string;
  /** Font size */
  fontSize?: number;
  /** Font family */
  fontFamily?: string;
  /** Width */
  width?: number;
  /** Add urgency indicator */
  urgent?: boolean;
  /** Urgency color */
  urgencyColor?: string;
  /** Animation duration in frames */
  animationDuration?: number;
  /** Animation type */
  animation?: 'fade' | 'slide-up' | 'slide-down' | 'bounce' | 'pulse';
}

/**
 * Call-to-action component with button and text
 */
export function CallToAction({
  text,
  subtitle,
  buttonText = 'Learn More',
  position = 'center',
  align = 'center',
  backgroundColor = 'rgba(0, 0, 0, 0.85)',
  textColor = '#ffffff',
  buttonColor = '#3b82f6',
  buttonTextColor = '#ffffff',
  fontSize = 36,
  fontFamily = 'Arial, sans-serif',
  width = 600,
  urgent = false,
  urgencyColor = '#ef4444',
  animationDuration = 30,
  animation = 'slide-up',
  frame = 0,
  style,
  className,
}: CallToActionProps): React.ReactElement {
  // Calculate animation progress
  const progress = Math.min(frame / animationDuration, 1);
  const easedProgress = easeOutCubic(progress);

  const getPositionStyle = (): React.CSSProperties => {
    switch (position) {
      case 'top':
        return { top: 100 };
      case 'bottom':
        return { bottom: 100 };
      case 'center':
      default:
        return {
          top: '50%',
          transform: 'translateY(-50%)',
        };
    }
  };

  const getAlignmentStyle = (): React.CSSProperties => {
    switch (align) {
      case 'left':
        return { left: 50, alignItems: 'flex-start', textAlign: 'left' };
      case 'right':
        return { right: 50, alignItems: 'flex-end', textAlign: 'right' };
      case 'center':
      default:
        return {
          left: '50%',
          transform: position === 'center' ? 'translate(-50%, -50%)' : 'translateX(-50%)',
          alignItems: 'center',
          textAlign: 'center',
        };
    }
  };

  const getAnimationStyle = (): React.CSSProperties => {
    switch (animation) {
      case 'fade':
        return { opacity: easedProgress };
      case 'slide-up':
        return {
          opacity: easedProgress,
          transform: `translateY(${(1 - easedProgress) * 50}px)`,
        };
      case 'slide-down':
        return {
          opacity: easedProgress,
          transform: `translateY(-${(1 - easedProgress) * 50}px)`,
        };
      case 'bounce':
        return {
          opacity: easedProgress,
          transform: `scale(${0.8 + easedProgress * 0.2})`,
        };
      case 'pulse':
        const pulse = Math.sin(frame * 0.1) * 0.05 + 1;
        return {
          opacity: easedProgress,
          transform: `scale(${easedProgress * pulse})`,
        };
      default:
        return {};
    }
  };

  // Button pulse animation for urgency
  const buttonPulse = urgent ? Math.sin(frame * 0.15) * 0.05 + 1 : 1;

  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        ...getPositionStyle(),
        ...getAlignmentStyle(),
        ...style,
      }}
    >
      <div
        style={{
          backgroundColor,
          padding: '40px 60px',
          borderRadius: 16,
          maxWidth: width,
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          ...getAnimationStyle(),
        }}
      >
        {/* Urgent Banner */}
        {urgent && (
          <div
            style={{
              backgroundColor: urgencyColor,
              color: '#ffffff',
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: fontSize * 0.4,
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              alignSelf: align === 'center' ? 'center' : 'flex-start',
            }}
          >
            ⚡ Limited Time Offer
          </div>
        )}

        {/* Main Text */}
        <div
          style={{
            fontSize,
            fontWeight: 'bold',
            color: textColor,
            fontFamily,
            lineHeight: 1.2,
          }}
        >
          {text}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <div
            style={{
              fontSize: fontSize * 0.5,
              color: `${textColor}cc`,
              fontFamily,
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </div>
        )}

        {/* CTA Button */}
        <button
          style={{
            backgroundColor: buttonColor,
            color: buttonTextColor,
            border: 'none',
            padding: '18px 48px',
            borderRadius: 12,
            fontSize: fontSize * 0.5,
            fontWeight: 'bold',
            fontFamily,
            cursor: 'pointer',
            transform: `scale(${buttonPulse})`,
            transition: 'transform 0.3s ease',
            alignSelf: align === 'center' ? 'center' : 'flex-start',
            boxShadow: `0 4px 12px ${buttonColor}66`,
          }}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
