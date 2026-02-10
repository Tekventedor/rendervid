import React, { useEffect, useRef, useMemo } from 'react';
import type { Template, ComponentRegistry } from '@rendervid/core';
import { TemplateRenderer } from '@rendervid/renderer-browser';
import { SelectionOverlay } from './SelectionOverlay';

/**
 * Compile inline component code string into a React component function.
 */
function compileInlineComponent(code: string): React.ComponentType<any> | null {
  const wrappedCode = `
    return (function(React) {
      ${code}
      var match = ${JSON.stringify(code)}.match(/function\\s+(\\w+)/);
      if (match && typeof eval(match[1]) !== 'undefined') {
        return eval(match[1]);
      }
      return null;
    });
  `;
  const factory = new Function(wrappedCode);
  const component = factory()(React);
  return typeof component === 'function' ? component : null;
}

/**
 * Build a fresh ComponentRegistry from template.customComponents.
 * Returns a new object each time so downstream useMemo deps invalidate.
 */
function buildRegistry(customComponents: Template['customComponents']): ComponentRegistry {
  const components = new Map<string, any>();

  if (customComponents) {
    for (const [name, def] of Object.entries(customComponents)) {
      if (def.type === 'inline' && def.code) {
        try {
          const comp = compileInlineComponent(def.code);
          if (comp) components.set(name, comp);
          else console.warn(`Inline component "${name}" did not produce a valid function`);
        } catch (err) {
          console.warn(`Failed to compile custom component "${name}":`, err);
        }
      }
    }
  }

  return {
    register: (name: string, comp: any) => { components.set(name, comp); },
    get: (name: string) => components.get(name),
    list: () => Array.from(components.keys()).map((name) => ({ name })),
    has: (name: string) => components.has(name),
    registerFromUrl: async () => {},
    registerFromCode: () => {},
    unregister: (name: string) => components.delete(name),
  } as ComponentRegistry;
}

export interface PreviewProps {
  template: Template;
  currentFrame: number;
  isPlaying: boolean;
  onFrameChange?: (frame: number) => void;
  onPlayingChange?: (isPlaying: boolean) => void;
  width?: number;
  height?: number;
  className?: string;
  layers?: any[];
  selectedLayerId?: string | null;
  onSelectLayer?: (id: string | null) => void;
  onUpdateLayer?: (layerId: string, updates: any) => void;
  onUpdateLayerWithoutHistory?: (layerId: string, updates: any) => void;
}

export function Preview({
  template,
  currentFrame,
  isPlaying,
  onFrameChange,
  onPlayingChange,
  width,
  height,
  className = '',
  layers,
  selectedLayerId,
  onSelectLayer,
  onUpdateLayer,
  onUpdateLayerWithoutHistory,
}: PreviewProps) {
  const { width: templateWidth, height: templateHeight, fps = 30 } = template.output;
  const displayWidth = width || templateWidth;
  const displayHeight = height || templateHeight;
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(performance.now());
  const accumulatedTimeRef = useRef<number>(0);

  // Build a fresh registry from custom components (new object triggers downstream memo invalidation)
  const registry = useMemo(
    () => buildRegistry(template.customComponents),
    [template.customComponents],
  );

  // Handle playback
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const totalFrames = getTotalFrames(template);
    const frameTime = 1000 / fps;
    lastTimeRef.current = performance.now();
    accumulatedTimeRef.current = 0;

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;
      accumulatedTimeRef.current += deltaTime;

      if (accumulatedTimeRef.current >= frameTime) {
        const framesToAdvance = Math.floor(accumulatedTimeRef.current / frameTime);
        accumulatedTimeRef.current %= frameTime;

        let nextFrame = currentFrame + framesToAdvance;
        if (nextFrame >= totalFrames) {
          nextFrame = 0; // Loop
        }

        if (onFrameChange) {
          onFrameChange(nextFrame);
        }
      }

      if (isPlaying) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, currentFrame, template, fps, onFrameChange]);

  const scale = Math.min(displayWidth / templateWidth, displayHeight / templateHeight);

  return (
    <div className={`rendervid-preview ${className}`}>
      <div
        style={{
          width: displayWidth,
          height: displayHeight,
          backgroundColor: '#000',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: templateWidth,
            height: templateHeight,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            position: 'relative',
          }}
        >
          <TemplateRenderer
            scenes={template.composition.scenes}
            frame={currentFrame}
            fps={fps}
            width={templateWidth}
            height={templateHeight}
            registry={registry}
          />
          {layers && onSelectLayer && onUpdateLayer && onUpdateLayerWithoutHistory && (
            <SelectionOverlay
              layers={layers}
              selectedLayerId={selectedLayerId ?? null}
              scale={scale}
              templateWidth={templateWidth}
              templateHeight={templateHeight}
              onSelectLayer={onSelectLayer}
              onUpdateLayer={onUpdateLayer}
              onUpdateLayerWithoutHistory={onUpdateLayerWithoutHistory}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function getTotalFrames(template: Template): number {
  const scenes = template.composition.scenes as any[];
  if (scenes.length === 0) return 0;
  return Math.max(...scenes.map((s: any) => s.endFrame || 0));
}
