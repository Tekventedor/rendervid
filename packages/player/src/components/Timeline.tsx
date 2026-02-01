import React, { useMemo } from 'react';
import type { TimelineProps, SceneInfo } from '../types';
import { Scrubber } from './Scrubber';

const defaultStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: '8px',
  },
  timeDisplay: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'monospace',
  },
  scrubberContainer: {
    position: 'relative' as const,
  },
  sceneMarkers: {
    position: 'absolute' as const,
    top: '50%',
    left: 0,
    right: 0,
    height: '100%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none' as const,
  },
  sceneMarker: {
    position: 'absolute' as const,
    top: 0,
    bottom: 0,
    borderLeft: '1px solid rgba(255, 255, 255, 0.3)',
  },
  sceneName: {
    position: 'absolute' as const,
    top: '-16px',
    fontSize: '10px',
    color: 'rgba(255, 255, 255, 0.5)',
    whiteSpace: 'nowrap' as const,
    transform: 'translateX(-50%)',
  },
};

/**
 * Format time as MM:SS.ff (minutes:seconds.frames)
 */
function formatTime(seconds: number, fps: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const frames = Math.floor((seconds % 1) * fps);

  return `${minutes.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}.${frames.toString().padStart(2, '0')}`;
}

/**
 * Timeline component showing playback progress and scene markers
 */
export function Timeline({
  currentFrame,
  totalFrames,
  scenes,
  fps,
  onSeek,
  isPlaying,
  className,
  showSceneMarkers = true,
  showTimeLabels = true,
}: TimelineProps): React.ReactElement {
  const currentTime = currentFrame / fps;
  const duration = totalFrames / fps;
  const progress = totalFrames > 0 ? currentFrame / totalFrames : 0;

  const sceneInfos: SceneInfo[] = useMemo(() => {
    return scenes.map((scene) => ({
      id: scene.id,
      name: scene.name,
      startFrame: scene.startFrame,
      endFrame: scene.endFrame,
      duration: scene.endFrame - scene.startFrame,
      isActive: currentFrame >= scene.startFrame && currentFrame < scene.endFrame,
    }));
  }, [scenes, currentFrame]);

  const handleSeek = (value: number) => {
    const frame = Math.round(value * totalFrames);
    onSeek(frame);
  };

  return (
    <div className={className} style={defaultStyles.container}>
      {showTimeLabels && (
        <div style={defaultStyles.timeDisplay}>
          <span>{formatTime(currentTime, fps)}</span>
          <span>Frame: {currentFrame} / {totalFrames}</span>
          <span>{formatTime(duration, fps)}</span>
        </div>
      )}

      <div style={defaultStyles.scrubberContainer}>
        <Scrubber
          value={progress}
          onChange={handleSeek}
        />

        {showSceneMarkers && scenes.length > 1 && (
          <div style={defaultStyles.sceneMarkers}>
            {sceneInfos.slice(1).map((scene) => {
              const position = `${(scene.startFrame / totalFrames) * 100}%`;
              return (
                <div
                  key={scene.id}
                  style={{
                    ...defaultStyles.sceneMarker,
                    left: position,
                  }}
                >
                  {scene.name && (
                    <span style={defaultStyles.sceneName}>{scene.name}</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
