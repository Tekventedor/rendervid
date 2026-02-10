import React, { useRef, useEffect, useCallback } from 'react';

export interface SelectionOverlayProps {
  layers: any[];
  selectedLayerId: string | null;
  scale: number;
  templateWidth: number;
  templateHeight: number;
  onSelectLayer: (id: string | null) => void;
  onUpdateLayer: (layerId: string, updates: any) => void;
  onUpdateLayerWithoutHistory: (layerId: string, updates: any) => void;
}

type HandlePosition = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

interface DragState {
  type: 'move' | 'resize';
  handle?: HandlePosition;
  layerId: string;
  startMouseX: number;
  startMouseY: number;
  startX: number;
  startY: number;
  startW: number;
  startH: number;
}

const HANDLE_CURSORS: Record<HandlePosition, string> = {
  nw: 'nwse-resize',
  n: 'ns-resize',
  ne: 'nesw-resize',
  e: 'ew-resize',
  se: 'nwse-resize',
  s: 'ns-resize',
  sw: 'nesw-resize',
  w: 'ew-resize',
};

const HANDLE_POSITIONS: { pos: HandlePosition; x: number; y: number }[] = [
  { pos: 'nw', x: 0, y: 0 },
  { pos: 'n', x: 0.5, y: 0 },
  { pos: 'ne', x: 1, y: 0 },
  { pos: 'e', x: 1, y: 0.5 },
  { pos: 'se', x: 1, y: 1 },
  { pos: 's', x: 0.5, y: 1 },
  { pos: 'sw', x: 0, y: 1 },
  { pos: 'w', x: 0, y: 0.5 },
];

const MIN_SIZE = 10;

function computeResize(
  handle: HandlePosition,
  dx: number,
  dy: number,
  startX: number,
  startY: number,
  startW: number,
  startH: number,
) {
  let x = startX;
  let y = startY;
  let w = startW;
  let h = startH;

  switch (handle) {
    case 'nw':
      x = startX + dx; y = startY + dy; w = startW - dx; h = startH - dy;
      break;
    case 'n':
      y = startY + dy; h = startH - dy;
      break;
    case 'ne':
      y = startY + dy; w = startW + dx; h = startH - dy;
      break;
    case 'e':
      w = startW + dx;
      break;
    case 'se':
      w = startW + dx; h = startH + dy;
      break;
    case 's':
      h = startH + dy;
      break;
    case 'sw':
      x = startX + dx; w = startW - dx; h = startH + dy;
      break;
    case 'w':
      x = startX + dx; w = startW - dx;
      break;
  }

  // Enforce minimum size
  if (w < MIN_SIZE) {
    if (handle === 'nw' || handle === 'w' || handle === 'sw') {
      x = startX + startW - MIN_SIZE;
    }
    w = MIN_SIZE;
  }
  if (h < MIN_SIZE) {
    if (handle === 'nw' || handle === 'n' || handle === 'ne') {
      y = startY + startH - MIN_SIZE;
    }
    h = MIN_SIZE;
  }

  return { x, y, w, h };
}

export function SelectionOverlay({
  layers,
  selectedLayerId,
  scale,
  templateWidth,
  templateHeight,
  onSelectLayer,
  onUpdateLayer,
  onUpdateLayerWithoutHistory,
}: SelectionOverlayProps) {
  const dragRef = useRef<DragState | null>(null);

  const handleSize = 10 / scale;
  const borderWidth = 2 / scale;

  const visibleLayers = layers.filter(
    (l: any) => l.type !== 'audio' && !l.hidden,
  );

  const selectedLayer = visibleLayers.find((l: any) => l.id === selectedLayerId);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const drag = dragRef.current;
      if (!drag) return;

      const dx = (e.clientX - drag.startMouseX) / scale;
      const dy = (e.clientY - drag.startMouseY) / scale;

      if (drag.type === 'move') {
        onUpdateLayerWithoutHistory(drag.layerId, {
          position: {
            x: Math.round(drag.startX + dx),
            y: Math.round(drag.startY + dy),
          },
        });
      } else if (drag.type === 'resize' && drag.handle) {
        const { x, y, w, h } = computeResize(
          drag.handle,
          dx,
          dy,
          drag.startX,
          drag.startY,
          drag.startW,
          drag.startH,
        );
        onUpdateLayerWithoutHistory(drag.layerId, {
          position: { x: Math.round(x), y: Math.round(y) },
          size: { width: Math.round(w), height: Math.round(h) },
        });
      }
    },
    [scale, onUpdateLayerWithoutHistory],
  );

  const handleMouseUp = useCallback(
    (_e: MouseEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      dragRef.current = null;
      document.body.style.cursor = '';

      // Find the layer's current state and commit to history
      const layer = layers.find((l: any) => l.id === drag.layerId);
      if (layer) {
        onUpdateLayer(drag.layerId, {
          position: { ...layer.position },
          size: { ...layer.size },
        });
      }
    },
    [layers, onUpdateLayer],
  );

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const startMove = (e: React.MouseEvent, layer: any) => {
    e.stopPropagation();
    dragRef.current = {
      type: 'move',
      layerId: layer.id,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startX: layer.position.x,
      startY: layer.position.y,
      startW: layer.size.width,
      startH: layer.size.height,
    };
    document.body.style.cursor = 'move';
  };

  const startResize = (e: React.MouseEvent, layer: any, handle: HandlePosition) => {
    e.stopPropagation();
    dragRef.current = {
      type: 'resize',
      handle,
      layerId: layer.id,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startX: layer.position.x,
      startY: layer.position.y,
      startW: layer.size.width,
      startH: layer.size.height,
    };
    document.body.style.cursor = HANDLE_CURSORS[handle];
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Only deselect if clicking directly on the overlay background
    if (e.target === e.currentTarget) {
      onSelectLayer(null);
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: templateWidth,
        height: templateHeight,
        zIndex: 10,
      }}
      onClick={handleOverlayClick}
    >
      {/* Hit targets for each visible layer */}
      {visibleLayers.map((layer: any) => {
        const isSelected = layer.id === selectedLayerId;
        return (
          <div
            key={layer.id}
            style={{
              position: 'absolute',
              left: layer.position.x,
              top: layer.position.y,
              width: layer.size.width,
              height: layer.size.height,
              cursor: isSelected ? 'move' : 'pointer',
              outline: isSelected ? undefined : 'none',
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (!isSelected) {
                onSelectLayer(layer.id);
              }
            }}
            onMouseDown={(e) => {
              if (isSelected) {
                startMove(e, layer);
              }
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                (e.currentTarget as HTMLDivElement).style.outline =
                  `${borderWidth}px solid rgba(59, 130, 246, 0.5)`;
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                (e.currentTarget as HTMLDivElement).style.outline = 'none';
              }
            }}
          />
        );
      })}

      {/* Selection box + resize handles for selected layer */}
      {selectedLayer && (
        <>
          {/* Selection border */}
          <div
            style={{
              position: 'absolute',
              left: selectedLayer.position.x,
              top: selectedLayer.position.y,
              width: selectedLayer.size.width,
              height: selectedLayer.size.height,
              border: `${borderWidth}px solid #3b82f6`,
              backgroundColor: 'rgba(59, 130, 246, 0.05)',
              pointerEvents: 'none',
              boxSizing: 'border-box',
            }}
          />

          {/* Resize handles */}
          {HANDLE_POSITIONS.map(({ pos, x, y }) => (
            <div
              key={pos}
              style={{
                position: 'absolute',
                left:
                  selectedLayer.position.x +
                  selectedLayer.size.width * x -
                  handleSize / 2,
                top:
                  selectedLayer.position.y +
                  selectedLayer.size.height * y -
                  handleSize / 2,
                width: handleSize,
                height: handleSize,
                backgroundColor: '#fff',
                border: `${borderWidth}px solid #3b82f6`,
                borderRadius: 2 / scale,
                cursor: HANDLE_CURSORS[pos],
                boxSizing: 'border-box',
              }}
              onMouseDown={(e) => startResize(e, selectedLayer, pos)}
            />
          ))}
        </>
      )}
    </div>
  );
}
