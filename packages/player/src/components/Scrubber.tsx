import React, { useCallback, useRef, useState } from 'react';
import type { ScrubberProps } from '../types';

const defaultStyles = {
  container: {
    position: 'relative' as const,
    height: '24px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  track: {
    position: 'absolute' as const,
    left: 0,
    right: 0,
    height: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '2px',
  },
  progress: {
    position: 'absolute' as const,
    left: 0,
    height: '4px',
    backgroundColor: '#3b82f6',
    borderRadius: '2px',
    transition: 'width 0.05s linear',
  },
  thumb: {
    position: 'absolute' as const,
    width: '12px',
    height: '12px',
    backgroundColor: '#3b82f6',
    borderRadius: '50%',
    transform: 'translateX(-50%)',
    transition: 'transform 0.1s ease',
  },
  thumbActive: {
    transform: 'translateX(-50%) scale(1.2)',
  },
};

/**
 * Scrubber component for seeking through the video
 */
export function Scrubber({
  value,
  onChange,
  isScrubbing: externalScrubbing,
  onScrubStart,
  onScrubEnd,
  className,
}: ScrubberProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const [internalScrubbing, setInternalScrubbing] = useState(false);

  const isScrubbing = externalScrubbing ?? internalScrubbing;

  const calculateValue = useCallback((clientX: number): number => {
    if (!containerRef.current) return value;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    return percentage;
  }, [value]);

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setInternalScrubbing(true);
    onScrubStart?.();

    const newValue = calculateValue(event.clientX);
    onChange(newValue);
  }, [calculateValue, onChange, onScrubStart]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!internalScrubbing) return;

    const newValue = calculateValue(event.clientX);
    onChange(newValue);
  }, [internalScrubbing, calculateValue, onChange]);

  const handleMouseUp = useCallback(() => {
    if (internalScrubbing) {
      setInternalScrubbing(false);
      onScrubEnd?.();
    }
  }, [internalScrubbing, onScrubEnd]);

  // Global mouse event listeners for drag
  React.useEffect(() => {
    if (internalScrubbing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [internalScrubbing, handleMouseMove, handleMouseUp]);

  const progressWidth = `${value * 100}%`;

  return (
    <div
      ref={containerRef}
      className={className}
      style={defaultStyles.container}
      onMouseDown={handleMouseDown}
    >
      <div style={defaultStyles.track} />
      <div
        style={{
          ...defaultStyles.progress,
          width: progressWidth,
        }}
      />
      <div
        style={{
          ...defaultStyles.thumb,
          left: progressWidth,
          ...(isScrubbing ? defaultStyles.thumbActive : {}),
        }}
      />
    </div>
  );
}
