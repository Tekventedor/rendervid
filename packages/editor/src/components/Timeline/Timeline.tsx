import React, { useRef, useState, useEffect } from 'react';
import type { TimelineProps } from '../../types';

export function Timeline({
  totalFrames,
  fps,
  currentFrame,
  onFrameChange,
  markers = [],
  zoom = 1,
  onZoomChange,
}: TimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const frame = Math.floor(percentage * totalFrames);

    onFrameChange(Math.max(0, Math.min(frame, totalFrames - 1)));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleTimelineClick(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    handleTimelineClick(e);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseUp = () => setIsDragging(false);
      window.addEventListener('mouseup', handleGlobalMouseUp);
      return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }
  }, [isDragging]);

  const formatTime = (frame: number): string => {
    const totalSeconds = frame / fps;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const frames = frame % fps;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
  };

  const playheadPosition = (currentFrame / totalFrames) * 100;

  return (
    <div className="rendervid-timeline">
      {/* Time display */}
      <div className="timeline-header" style={{ padding: '8px', backgroundColor: '#2a2a2a', borderBottom: '1px solid #444' }}>
        <span style={{ fontFamily: 'monospace', fontSize: '14px', color: '#ccc' }}>
          {formatTime(currentFrame)} / {formatTime(totalFrames)} ({totalFrames} frames @ {fps}fps)
        </span>
      </div>

      {/* Timeline track */}
      <div
        ref={timelineRef}
        className="timeline-track"
        style={{
          position: 'relative',
          height: '60px',
          backgroundColor: '#2a2a2a',
          cursor: 'pointer',
          userSelect: 'none',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Frame markers */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '20px', display: 'flex' }}>
          {Array.from({ length: Math.min(totalFrames, 100) }, (_, i) => {
            const frame = Math.floor((i / 100) * totalFrames);
            const isMajor = frame % (fps * 5) === 0; // Major tick every 5 seconds
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  borderLeft: `1px solid ${isMajor ? '#666' : '#444'}`,
                  fontSize: isMajor ? '10px' : '0',
                  color: '#999',
                  paddingLeft: '2px',
                }}
              >
                {isMajor && Math.floor(frame / fps)}s
              </div>
            );
          })}
        </div>

        {/* Custom markers */}
        {markers.map((marker, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: `${(marker.frame / totalFrames) * 100}%`,
              top: '20px',
              bottom: 0,
              width: '2px',
              backgroundColor: marker.color || '#ff0',
              pointerEvents: 'none',
            }}
            title={marker.label}
          />
        ))}

        {/* Playhead */}
        <div
          className="timeline-playhead"
          style={{
            position: 'absolute',
            left: `${playheadPosition}%`,
            top: 0,
            bottom: 0,
            width: '2px',
            backgroundColor: '#ff4444',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-4px',
              left: '-6px',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '8px solid #ff4444',
            }}
          />
        </div>
      </div>

      {/* Zoom controls */}
      {onZoomChange && (
        <div className="timeline-controls" style={{ padding: '8px', backgroundColor: '#2a2a2a', borderTop: '1px solid #444' }}>
          <label style={{ marginRight: '8px', fontSize: '12px', color: '#ccc' }}>Zoom:</label>
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.1"
            value={zoom}
            onChange={(e) => onZoomChange(parseFloat(e.target.value))}
            style={{ width: '150px' }}
          />
          <span style={{ marginLeft: '8px', fontSize: '12px', color: '#ccc' }}>{zoom.toFixed(1)}x</span>
        </div>
      )}
    </div>
  );
}
