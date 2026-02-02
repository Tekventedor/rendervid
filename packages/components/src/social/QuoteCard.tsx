import React from 'react';
import type { AnimatedProps } from '../types';

export interface QuoteCardProps extends AnimatedProps {
  /** Quote text */
  quote: string;
  /** Author name */
  author?: string;
  /** Author title/description */
  authorTitle?: string;
  /** Author image URL */
  authorImage?: string;
  /** Card width */
  width?: number;
  /** Card height */
  height?: number;
  /** Background color or gradient */
  backgroundColor?: string;
  /** Text color */
  textColor?: string;
  /** Accent color for quote marks and decorations */
  accentColor?: string;
  /** Font size for quote */
  fontSize?: number;
  /** Font family */
  fontFamily?: string;
  /** Border radius */
  borderRadius?: number;
  /** Show quote marks */
  showQuoteMarks?: boolean;
  /** Quote mark style */
  quoteMarkStyle?: 'standard' | 'curly' | 'decorative';
  /** Animation duration in frames */
  animationDuration?: number;
}

/**
 * Quote card component for displaying quotes with author information
 */
export function QuoteCard({
  quote,
  author,
  authorTitle,
  authorImage,
  width = 800,
  height = 500,
  backgroundColor = '#1a1a1a',
  textColor = '#ffffff',
  accentColor = '#3b82f6',
  fontSize = 32,
  fontFamily = 'Georgia, serif',
  borderRadius = 16,
  showQuoteMarks = true,
  quoteMarkStyle = 'curly',
  animationDuration = 40,
  frame = 0,
  style,
  className,
}: QuoteCardProps): React.ReactElement {
  // Calculate animation progress
  const progress = Math.min(frame / animationDuration, 1);
  const quoteOpacity = Math.max(0, Math.min(1, (progress - 0.2) * 2));
  const authorOpacity = Math.max(0, Math.min(1, (progress - 0.6) * 2.5));

  const getQuoteMark = (isOpening: boolean): string => {
    switch (quoteMarkStyle) {
      case 'curly':
        return isOpening ? '"' : '"';
      case 'decorative':
        return isOpening ? '❝' : '❞';
      case 'standard':
      default:
        return '"';
    }
  };

  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        width,
        height,
        backgroundColor,
        borderRadius,
        padding: 60,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        ...style,
      }}
    >
      {/* Opening Quote Mark */}
      {showQuoteMarks && (
        <div
          style={{
            fontSize: fontSize * 2,
            color: accentColor,
            fontFamily,
            lineHeight: 1,
            marginBottom: 20,
            opacity: quoteOpacity,
          }}
        >
          {getQuoteMark(true)}
        </div>
      )}

      {/* Quote Text */}
      <div
        style={{
          fontSize,
          color: textColor,
          fontFamily,
          lineHeight: 1.6,
          fontStyle: 'italic',
          maxWidth: width * 0.8,
          marginBottom: 20,
          opacity: quoteOpacity,
        }}
      >
        {quote}
      </div>

      {/* Closing Quote Mark */}
      {showQuoteMarks && (
        <div
          style={{
            fontSize: fontSize * 2,
            color: accentColor,
            fontFamily,
            lineHeight: 1,
            marginBottom: 40,
            opacity: quoteOpacity,
          }}
        >
          {getQuoteMark(false)}
        </div>
      )}

      {/* Author Section */}
      {author && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            opacity: authorOpacity,
          }}
        >
          {/* Author Image */}
          {authorImage && (
            <img
              src={authorImage}
              alt={author}
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                objectFit: 'cover',
                border: `3px solid ${accentColor}`,
              }}
            />
          )}

          {/* Author Info */}
          <div style={{ textAlign: 'left' }}>
            <div
              style={{
                fontSize: fontSize * 0.7,
                fontWeight: 'bold',
                color: textColor,
                marginBottom: 4,
              }}
            >
              {author}
            </div>
            {authorTitle && (
              <div
                style={{
                  fontSize: fontSize * 0.5,
                  color: `${textColor}cc`,
                }}
              >
                {authorTitle}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Decorative Line */}
      {!authorImage && author && (
        <div
          style={{
            width: 60,
            height: 3,
            backgroundColor: accentColor,
            borderRadius: 2,
            marginBottom: 16,
            opacity: authorOpacity,
          }}
        />
      )}
    </div>
  );
}
