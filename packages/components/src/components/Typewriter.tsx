import React from 'react';
import type { TypewriterProps } from '../types';

/**
 * Typewriter text effect component
 */
export function Typewriter({
  text,
  speed = 10, // characters per second
  showCursor = true,
  cursor = '|',
  startDelay = 0,
  fontSize = 16,
  color = '#ffffff',
  frame,
  fps = 30,
  className,
  style,
}: TypewriterProps): React.ReactElement {
  // Calculate which characters to show based on current frame
  const effectiveFrame = Math.max(0, frame - startDelay);
  const charactersPerFrame = speed / fps;
  const numChars = Math.min(
    text.length,
    Math.floor(effectiveFrame * charactersPerFrame)
  );

  const displayText = text.slice(0, numChars);
  const isComplete = numChars >= text.length;

  // Cursor blinks when typing is complete
  const showCursorNow = showCursor && (!isComplete || (frame % fps) < fps / 2);

  const typewriterStyle: React.CSSProperties = {
    fontSize,
    color,
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    ...style,
  };

  const cursorStyle: React.CSSProperties = {
    opacity: showCursorNow ? 1 : 0,
  };

  return (
    <span className={className} style={typewriterStyle}>
      {displayText}
      {showCursor && <span style={cursorStyle}>{cursor}</span>}
    </span>
  );
}
