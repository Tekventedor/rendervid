import React, { useRef, useState, useEffect, useCallback } from 'react';
import type { TimelineProps } from '../../types';

const LABEL_WIDTH = 150;
const ROW_HEIGHT = 28;
const RULER_HEIGHT = 24;

const LAYER_COLORS: Record<string, string> = {
  text: '#4a9eff',
  shape: '#ff6b4a',
  image: '#4aff6b',
  video: '#ff4aef',
  audio: '#ffaa4a',
  custom: '#999',
};

const LAYER_TYPE_ICONS: Record<string, string> = {
  text: 'T',
  shape: '◆',
  image: '🖼',
  video: '▶',
  audio: '♪',
  custom: '⚙',
};

const LAYER_TYPES = ['text', 'shape', 'image', 'video', 'audio'];

export function Timeline({
  totalFrames,
  fps,
  currentFrame,
  onFrameChange,
  zoom = 1,
  onZoomChange,
  scenes,
  selectedSceneId,
  selectedLayerId,
  onSelectScene,
  onSelectLayer,
  onUpdateLayer,
  onDeleteLayer,
  onDuplicateLayer,
  onDeleteScene,
  onAddLayer,
  onAddScene,
  onReorderLayers,
  onMoveLayerToScene,
  onUpdateScene,
}: TimelineProps) {
  const trackAreaRef = useRef<HTMLDivElement>(null);
  const labelListRef = useRef<HTMLDivElement>(null);
  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);
  const [rowDrag, setRowDrag] = useState<{
    layerId: string;
    fromSceneId: string;
    startY: number;
  } | null>(null);
  const [dropTarget, setDropTarget] = useState<{
    rowIndex: number;
    position: 'above' | 'below';
  } | null>(null);
  const [dragState, setDragState] = useState<{
    type: 'move' | 'resize-left' | 'resize-right';
    layerId: string;
    startX: number;
    originalFrom: number;
    originalDuration: number;
    sceneStartFrame: number;
    sceneDuration: number;
  } | null>(null);
  const [showAddLayerDropdown, setShowAddLayerDropdown] = useState(false);
  const [collapsedScenes, setCollapsedScenes] = useState<Set<string>>(new Set());
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    type: 'layer' | 'scene';
    id: string;
  } | null>(null);

  const effectiveTotal = totalFrames || 300;
  const timelineZoom = zoom;

  const formatTime = (frame: number): string => {
    const totalSeconds = frame / fps;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const frameToPixel = useCallback(
    (frame: number): number => {
      if (!trackAreaRef.current) return 0;
      const trackWidth = trackAreaRef.current.clientWidth;
      return (frame / effectiveTotal) * trackWidth * timelineZoom;
    },
    [effectiveTotal, timelineZoom],
  );

  const pixelToFrame = useCallback(
    (px: number): number => {
      if (!trackAreaRef.current) return 0;
      const trackWidth = trackAreaRef.current.clientWidth;
      return Math.round((px / (trackWidth * timelineZoom)) * effectiveTotal);
    },
    [effectiveTotal, timelineZoom],
  );

  // Playhead scrubbing
  const handleTrackMouseDown = (e: React.MouseEvent) => {
    if (dragState) return;
    if ((e.target as HTMLElement).closest('.timeline-bar')) return;
    setIsDraggingPlayhead(true);
    scrubPlayhead(e);
  };

  const scrubPlayhead = (e: React.MouseEvent | MouseEvent) => {
    if (!trackAreaRef.current) return;
    const rect = trackAreaRef.current.getBoundingClientRect();
    const scrollLeft = trackAreaRef.current.scrollLeft;
    const x = e.clientX - rect.left + scrollLeft;
    const frame = pixelToFrame(x);
    onFrameChange(Math.max(0, Math.min(frame, effectiveTotal - 1)));
  };

  useEffect(() => {
    if (!isDraggingPlayhead) return;
    const handleMove = (e: MouseEvent) => scrubPlayhead(e);
    const handleUp = () => setIsDraggingPlayhead(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [isDraggingPlayhead]);

  // Layer bar drag (move/resize)
  useEffect(() => {
    if (!dragState) return;
    const handleMove = (e: MouseEvent) => {
      if (!trackAreaRef.current) return;
      const rect = trackAreaRef.current.getBoundingClientRect();
      const scrollLeft = trackAreaRef.current.scrollLeft;
      const currentX = e.clientX - rect.left + scrollLeft;
      const deltaFrames = pixelToFrame(currentX - dragState.startX + (trackAreaRef.current.getBoundingClientRect().left - rect.left));
      const dx = pixelToFrame(currentX) - pixelToFrame(dragState.startX);

      if (dragState.type === 'move') {
        let newFrom = dragState.originalFrom + dx;
        newFrom = Math.max(0, Math.min(newFrom, dragState.sceneDuration - dragState.originalDuration));
        onUpdateLayer(dragState.layerId, { from: newFrom });
      } else if (dragState.type === 'resize-left') {
        let newFrom = dragState.originalFrom + dx;
        const maxFrom = dragState.originalFrom + dragState.originalDuration - 1;
        newFrom = Math.max(0, Math.min(newFrom, maxFrom));
        const newDuration = dragState.originalDuration - (newFrom - dragState.originalFrom);
        onUpdateLayer(dragState.layerId, { from: newFrom, duration: newDuration });
      } else if (dragState.type === 'resize-right') {
        let newDuration = dragState.originalDuration + dx;
        newDuration = Math.max(1, Math.min(newDuration, dragState.sceneDuration - dragState.originalFrom));
        onUpdateLayer(dragState.layerId, { duration: newDuration });
      }
    };
    const handleUp = () => setDragState(null);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [dragState, pixelToFrame, onUpdateLayer]);

  // Close context menu on click
  useEffect(() => {
    if (!contextMenu) return;
    const close = () => setContextMenu(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [contextMenu]);

  // Close add-layer dropdown on outside click
  useEffect(() => {
    if (!showAddLayerDropdown) return;
    const close = () => setShowAddLayerDropdown(false);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [showAddLayerDropdown]);

  const handleLayerBarMouseDown = (
    e: React.MouseEvent,
    layerId: string,
    from: number,
    duration: number,
    sceneDuration: number,
    sceneStartFrame: number,
    edge: 'left' | 'right' | 'body',
  ) => {
    e.stopPropagation();
    if (!trackAreaRef.current) return;
    const rect = trackAreaRef.current.getBoundingClientRect();
    const scrollLeft = trackAreaRef.current.scrollLeft;
    const startX = e.clientX - rect.left + scrollLeft;

    onSelectLayer(layerId);

    setDragState({
      type: edge === 'left' ? 'resize-left' : edge === 'right' ? 'resize-right' : 'move',
      layerId,
      startX,
      originalFrom: from,
      originalDuration: duration,
      sceneStartFrame,
      sceneDuration,
    });
  };

  const handleContextMenu = (e: React.MouseEvent, type: 'layer' | 'scene', id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, type, id });
  };

  const toggleSceneCollapse = (sceneId: string) => {
    setCollapsedScenes((prev) => {
      const next = new Set(prev);
      if (next.has(sceneId)) {
        next.delete(sceneId);
      } else {
        next.add(sceneId);
      }
      return next;
    });
  };

  // Build row data
  const rows: Array<{
    type: 'scene' | 'layer';
    id: string;
    label: string;
    layerType?: string;
    sceneId?: string;
    startFrame: number;
    endFrame: number;
    from?: number;
    duration?: number;
    sceneStartFrame?: number;
    sceneDuration?: number;
    collapsed?: boolean;
    hasLayers?: boolean;
    hidden?: boolean;
  }> = [];

  for (let si = 0; si < scenes.length; si++) {
    const s = scenes[si] as any;
    const sceneId = s.id || `scene-${si}`;
    const sceneStart = s.startFrame ?? 0;
    const sceneEnd = s.endFrame ?? sceneStart + 150;
    const sceneDuration = sceneEnd - sceneStart;
    const isCollapsed = collapsedScenes.has(sceneId);
    const layers = s.layers || [];
    rows.push({
      type: 'scene',
      id: sceneId,
      label: s.name || sceneId,
      startFrame: sceneStart,
      endFrame: sceneEnd,
      collapsed: isCollapsed,
      hasLayers: layers.length > 0,
      hidden: !!s.hidden,
    });
    if (!isCollapsed) {
      for (let li = 0; li < layers.length; li++) {
        const l = layers[li] as any;
        const layerId = l.id || `${sceneId}-layer-${li}`;
        const from = l.from ?? 0;
        const dur = l.duration ?? sceneDuration;
        rows.push({
          type: 'layer',
          id: layerId,
          label: (l.name || l.id || l.type || `layer-${li}`).replace('layer-', '').slice(0, 12),
          layerType: l.type || 'custom',
          sceneId,
          startFrame: sceneStart + from,
          endFrame: sceneStart + from + dur,
          from,
          duration: dur,
          sceneStartFrame: sceneStart,
          sceneDuration,
          hidden: !!l.hidden,
        });
      }
    }
  }

  // Row drag-and-drop (reorder / move between scenes)
  useEffect(() => {
    if (!rowDrag) return;
    const handleMove = (e: MouseEvent) => {
      if (!labelListRef.current) return;
      const listRect = labelListRef.current.getBoundingClientRect();
      const y = e.clientY - listRect.top + labelListRef.current.scrollTop;
      const rowIdx = Math.floor(y / ROW_HEIGHT);
      const withinRow = y - rowIdx * ROW_HEIGHT;
      const position = withinRow < ROW_HEIGHT / 2 ? 'above' : 'below';
      setDropTarget({ rowIndex: Math.max(0, Math.min(rowIdx, rows.length - 1)), position });
    };
    const handleUp = () => {
      if (dropTarget && rowDrag) {
        const targetRow = rows[dropTarget.rowIndex];
        if (targetRow) {
          let targetSceneId: string;
          let insertIndex: number;

          if (targetRow.type === 'scene') {
            targetSceneId = targetRow.id;
            if (dropTarget.position === 'above') {
              const sceneIdx = scenes.findIndex((s: any) => s.id === targetRow.id);
              if (sceneIdx > 0) {
                const prevScene = scenes[sceneIdx - 1] as any;
                targetSceneId = prevScene.id;
                insertIndex = (prevScene.layers || []).length;
                if (targetSceneId === rowDrag.fromSceneId) {
                  const currentLayers = (prevScene.layers || []) as any[];
                  insertIndex = currentLayers.filter((l: any) => l.id !== rowDrag.layerId).length;
                }
              } else {
                targetSceneId = targetRow.id;
                insertIndex = 0;
              }
            } else {
              insertIndex = 0;
            }
          } else {
            targetSceneId = targetRow.sceneId!;
            const scene = scenes.find((s: any) => s.id === targetSceneId) as any;
            const sceneLayers = (scene?.layers || []) as any[];
            const targetLayerIdx = sceneLayers.findIndex((l: any) => l.id === targetRow.id);
            insertIndex = dropTarget.position === 'above' ? targetLayerIdx : targetLayerIdx + 1;

            if (targetSceneId === rowDrag.fromSceneId) {
              const dragIdx = sceneLayers.findIndex((l: any) => l.id === rowDrag.layerId);
              if (dragIdx !== -1 && dragIdx < insertIndex) {
                insertIndex--;
              }
            }
          }

          if (targetSceneId === rowDrag.fromSceneId) {
            const scene = scenes.find((s: any) => s.id === targetSceneId) as any;
            const layerIds = ((scene?.layers || []) as any[])
              .map((l: any) => l.id)
              .filter((id: string) => id !== rowDrag.layerId);
            layerIds.splice(insertIndex, 0, rowDrag.layerId);
            onReorderLayers(targetSceneId, layerIds);
          } else {
            onMoveLayerToScene(rowDrag.layerId, rowDrag.fromSceneId, targetSceneId, insertIndex);
          }
        }
      }
      setRowDrag(null);
      setDropTarget(null);
      document.body.style.cursor = '';
    };
    document.body.style.cursor = 'grabbing';
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      document.body.style.cursor = '';
    };
  }, [rowDrag, dropTarget, rows, scenes, onReorderLayers, onMoveLayerToScene]);

  // Ruler ticks
  const rulerTicks: Array<{ frame: number; label: string; major: boolean }> = [];
  const secondsTotal = effectiveTotal / fps;
  const tickInterval = secondsTotal > 30 ? 5 : secondsTotal > 10 ? 2 : 1;
  for (let s = 0; s <= secondsTotal; s += tickInterval) {
    rulerTicks.push({
      frame: Math.round(s * fps),
      label: `${s}s`,
      major: true,
    });
  }

  const totalTrackWidth = trackAreaRef.current ? trackAreaRef.current.clientWidth * timelineZoom : 1000;

  return (
    <div className="rendervid-timeline" style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#1e1e1e', userSelect: 'none' }}>
      {/* Toolbar row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          backgroundColor: '#2a2a2a',
          borderBottom: '1px solid #444',
          flexShrink: 0,
        }}
      >
        <button
          onClick={onAddScene}
          style={{
            padding: '4px 10px',
            fontSize: '11px',
            backgroundColor: '#444',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          + Add Scene
        </button>

        <div style={{ position: 'relative' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowAddLayerDropdown(!showAddLayerDropdown);
            }}
            style={{
              padding: '4px 10px',
              fontSize: '11px',
              backgroundColor: '#444',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            + Add Layer ▾
          </button>
          {showAddLayerDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '4px',
                backgroundColor: '#333',
                border: '1px solid #555',
                borderRadius: '4px',
                zIndex: 100,
                minWidth: '120px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
              }}
            >
              {LAYER_TYPES.map((t) => (
                <div
                  key={t}
                  onClick={() => {
                    onAddLayer(t);
                    setShowAddLayerDropdown(false);
                  }}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#fff',
                  }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.backgroundColor = '#444')}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.backgroundColor = 'transparent')}
                >
                  <span style={{ color: LAYER_COLORS[t], fontWeight: 'bold' }}>{LAYER_TYPE_ICONS[t]}</span>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ flex: 1 }} />

        <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#aaa' }}>
          {formatTime(currentFrame)} / {formatTime(effectiveTotal)} &middot; {effectiveTotal} frames @ {fps}fps
        </span>

        {onZoomChange && (
          <>
            <button
              onClick={() => onZoomChange(Math.max(0.5, timelineZoom - 0.25))}
              style={{ padding: '2px 6px', fontSize: '11px', backgroundColor: '#444', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
            >
              −
            </button>
            <span style={{ fontSize: '11px', color: '#aaa', minWidth: '32px', textAlign: 'center' }}>
              {timelineZoom.toFixed(1)}x
            </span>
            <button
              onClick={() => onZoomChange(Math.min(5, timelineZoom + 0.25))}
              style={{ padding: '2px 6px', fontSize: '11px', backgroundColor: '#444', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
            >
              +
            </button>
          </>
        )}
      </div>

      {/* Timeline body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        {/* Label column */}
        <div
          style={{
            width: `${LABEL_WIDTH}px`,
            flexShrink: 0,
            borderRight: '1px solid #444',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Ruler spacer */}
          <div style={{ height: `${RULER_HEIGHT}px`, borderBottom: '1px solid #444', backgroundColor: '#252525' }} />

          {/* Row labels */}
          <div ref={labelListRef} style={{ flex: 1, overflowY: 'auto' }}>
            {rows.map((row, rowIndex) => {
              const isSelected =
                (row.type === 'scene' && row.id === selectedSceneId && !selectedLayerId) ||
                (row.type === 'layer' && row.id === selectedLayerId);
              const showDropAbove = rowDrag && dropTarget?.rowIndex === rowIndex && dropTarget.position === 'above' && row.id !== rowDrag.layerId;
              const showDropBelow = rowDrag && dropTarget?.rowIndex === rowIndex && dropTarget.position === 'below' && row.id !== rowDrag.layerId;
              return (
                <div
                  key={row.id}
                  style={{ position: 'relative' }}
                >
                  {showDropAbove && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', backgroundColor: '#4a9eff', zIndex: 5 }} />
                  )}
                <div
                  onClick={() => {
                    if (row.type === 'scene') {
                      onSelectScene(row.id);
                      onSelectLayer(null);
                    } else {
                      if (row.sceneId) onSelectScene(row.sceneId);
                      onSelectLayer(row.id);
                    }
                  }}
                  onContextMenu={(e) => handleContextMenu(e, row.type, row.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.querySelectorAll('.timeline-row-action').forEach((el) => {
                      (el as HTMLElement).style.opacity = '1';
                    });
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.querySelectorAll('.timeline-row-action').forEach((el) => {
                      (el as HTMLElement).style.opacity = (el as HTMLElement).dataset.alwaysShow === 'true' ? '1' : '0';
                    });
                  }}
                  style={{
                    height: `${ROW_HEIGHT}px`,
                    display: 'flex',
                    alignItems: 'center',
                    padding: row.type === 'layer' ? '0 4px 0 20px' : '0 4px 0 8px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    opacity: rowDrag && rowDrag.layerId === row.id ? 0.4 : 1,
                    backgroundColor: isSelected ? '#3a3a5a' : 'transparent',
                    borderBottom: '1px solid #333',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    color: row.type === 'scene' ? '#ddd' : '#bbb',
                    fontWeight: row.type === 'scene' ? 600 : 400,
                  }}
                >
                  {row.type === 'scene' && row.hasLayers && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSceneCollapse(row.id);
                      }}
                      style={{
                        marginRight: '4px',
                        fontSize: '8px',
                        color: '#888',
                        width: '12px',
                        textAlign: 'center',
                        flexShrink: 0,
                        lineHeight: '28px',
                      }}
                    >
                      {row.collapsed ? '▶' : '▼'}
                    </span>
                  )}
                  {row.type === 'scene' && !row.hasLayers && (
                    <span style={{ width: '16px', flexShrink: 0 }} />
                  )}
                  {row.type === 'layer' && (
                    <span
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setRowDrag({
                          layerId: row.id,
                          fromSceneId: row.sceneId!,
                          startY: e.clientY,
                        });
                        onSelectLayer(row.id);
                      }}
                      style={{
                        marginRight: '3px',
                        fontSize: '8px',
                        color: '#555',
                        cursor: 'grab',
                        flexShrink: 0,
                        letterSpacing: '1px',
                      }}
                      title="Drag to reorder"
                    >
                      ⠿
                    </span>
                  )}
                  {row.type === 'layer' && (
                    <span style={{ marginRight: '4px', color: LAYER_COLORS[row.layerType || 'custom'], fontSize: '10px' }}>
                      {LAYER_TYPE_ICONS[row.layerType || 'custom']}
                    </span>
                  )}
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', flex: 1, opacity: row.hidden ? 0.4 : 1 }}>
                    {row.type === 'scene' ? row.label : `${row.layerType}`}
                  </span>
                  <span
                    className="timeline-row-action"
                    data-always-show={row.hidden ? 'true' : 'false'}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (row.type === 'scene') {
                        onUpdateScene(row.id, { hidden: !row.hidden });
                      } else {
                        onUpdateLayer(row.id, { hidden: !row.hidden });
                      }
                    }}
                    style={{
                      marginLeft: '2px',
                      fontSize: '11px',
                      color: row.hidden ? '#666' : '#888',
                      width: '16px',
                      height: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '3px',
                      flexShrink: 0,
                      opacity: row.hidden ? 1 : 0,
                      transition: 'opacity 0.1s',
                      cursor: 'pointer',
                    }}
                    title={row.hidden ? 'Show' : 'Hide'}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = '#444';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                    }}
                  >
                    {row.hidden ? '⚫' : '👁'}
                  </span>
                  <span
                    className="timeline-row-action"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (row.type === 'scene') {
                        onDeleteScene(row.id);
                      } else {
                        onDeleteLayer(row.id);
                      }
                    }}
                    style={{
                      marginLeft: '4px',
                      fontSize: '10px',
                      color: '#666',
                      width: '16px',
                      height: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '3px',
                      flexShrink: 0,
                      opacity: 0,
                      transition: 'opacity 0.1s',
                    }}
                    title={row.type === 'scene' ? 'Delete scene' : 'Delete layer'}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = '#ff6b6b';
                      (e.currentTarget as HTMLElement).style.backgroundColor = '#444';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = '#666';
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                    }}
                  >
                    ✕
                  </span>
                </div>
                  {showDropBelow && (
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', backgroundColor: '#4a9eff', zIndex: 5 }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Track area */}
        <div
          ref={trackAreaRef}
          style={{
            flex: 1,
            position: 'relative',
            overflowX: 'auto',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
          onMouseDown={handleTrackMouseDown}
        >
          {/* Ruler */}
          <div
            style={{
              height: `${RULER_HEIGHT}px`,
              position: 'sticky',
              top: 0,
              zIndex: 5,
              backgroundColor: '#252525',
              borderBottom: '1px solid #444',
              minWidth: `${totalTrackWidth}px`,
              flexShrink: 0,
            }}
          >
            {rulerTicks.map((tick) => (
              <div
                key={tick.frame}
                style={{
                  position: 'absolute',
                  left: `${(tick.frame / effectiveTotal) * 100 * timelineZoom}%`,
                  top: 0,
                  bottom: 0,
                  borderLeft: '1px solid #555',
                  fontSize: '9px',
                  color: '#888',
                  paddingLeft: '3px',
                  paddingTop: '2px',
                  pointerEvents: 'none',
                }}
              >
                {tick.label}
              </div>
            ))}
          </div>

          {/* Track rows */}
          <div style={{ position: 'relative', minWidth: `${totalTrackWidth}px` }}>
            {rows.map((row, idx) => {
              const isSelected =
                (row.type === 'scene' && row.id === selectedSceneId && !selectedLayerId) ||
                (row.type === 'layer' && row.id === selectedLayerId);

              const barLeft = (row.startFrame / effectiveTotal) * 100 * timelineZoom;
              const barWidth = ((row.endFrame - row.startFrame) / effectiveTotal) * 100 * timelineZoom;

              const color =
                row.type === 'scene'
                  ? '#555'
                  : LAYER_COLORS[row.layerType || 'custom'] || '#999';

              const trackDropAbove = rowDrag && dropTarget?.rowIndex === idx && dropTarget.position === 'above' && row.id !== rowDrag.layerId;
              const trackDropBelow = rowDrag && dropTarget?.rowIndex === idx && dropTarget.position === 'below' && row.id !== rowDrag.layerId;

              return (
                <div
                  key={row.id}
                  style={{
                    height: `${ROW_HEIGHT}px`,
                    position: 'relative',
                    borderBottom: '1px solid #333',
                    backgroundColor: isSelected ? '#2a2a3a' : 'transparent',
                    opacity: rowDrag && rowDrag.layerId === row.id ? 0.4 : 1,
                  }}
                >
                  {trackDropAbove && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', backgroundColor: '#4a9eff', zIndex: 5 }} />
                  )}
                  {trackDropBelow && (
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', backgroundColor: '#4a9eff', zIndex: 5 }} />
                  )}
                  {/* Bar */}
                  <div
                    className="timeline-bar"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (row.type === 'scene') {
                        onSelectScene(row.id);
                        onSelectLayer(null);
                      } else {
                        if (row.sceneId) onSelectScene(row.sceneId);
                        onSelectLayer(row.id);
                      }
                    }}
                    onContextMenu={(e) => handleContextMenu(e, row.type, row.id)}
                    style={{
                      position: 'absolute',
                      left: `${barLeft}%`,
                      width: `${barWidth}%`,
                      top: '3px',
                      bottom: '3px',
                      backgroundColor: row.type === 'scene' ? 'rgba(100,100,120,0.3)' : color,
                      opacity: row.hidden ? 0.25 : row.type === 'scene' ? 1 : 0.8,
                      borderRadius: '3px',
                      border: isSelected ? '1px solid #fff' : row.type === 'scene' ? '1px solid #666' : '1px solid transparent',
                      cursor: row.type === 'layer' ? 'grab' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      overflow: 'hidden',
                    }}
                    onMouseDown={
                      row.type === 'layer'
                        ? (e) =>
                            handleLayerBarMouseDown(
                              e,
                              row.id,
                              row.from ?? 0,
                              row.duration ?? row.endFrame - row.startFrame,
                              row.sceneDuration ?? 150,
                              row.sceneStartFrame ?? 0,
                              'body',
                            )
                        : undefined
                    }
                  >
                    {/* Resize handle left */}
                    {row.type === 'layer' && (
                      <div
                        onMouseDown={(e) =>
                          handleLayerBarMouseDown(
                            e,
                            row.id,
                            row.from ?? 0,
                            row.duration ?? row.endFrame - row.startFrame,
                            row.sceneDuration ?? 150,
                            row.sceneStartFrame ?? 0,
                            'left',
                          )
                        }
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: '6px',
                          cursor: 'ew-resize',
                          borderRadius: '3px 0 0 3px',
                        }}
                      />
                    )}

                    <span
                      style={{
                        fontSize: '9px',
                        color: '#fff',
                        paddingLeft: '8px',
                        pointerEvents: 'none',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {row.type === 'scene' ? row.label : row.layerType}
                    </span>

                    {/* Resize handle right */}
                    {row.type === 'layer' && (
                      <div
                        onMouseDown={(e) =>
                          handleLayerBarMouseDown(
                            e,
                            row.id,
                            row.from ?? 0,
                            row.duration ?? row.endFrame - row.startFrame,
                            row.sceneDuration ?? 150,
                            row.sceneStartFrame ?? 0,
                            'right',
                          )
                        }
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          bottom: 0,
                          width: '6px',
                          cursor: 'ew-resize',
                          borderRadius: '0 3px 3px 0',
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })}

            {/* Playhead */}
            <div
              style={{
                position: 'absolute',
                left: `${(currentFrame / effectiveTotal) * 100 * timelineZoom}%`,
                top: 0,
                bottom: 0,
                width: '2px',
                backgroundColor: '#ff4444',
                pointerEvents: 'none',
                zIndex: 10,
              }}
            />
          </div>
        </div>
      </div>

      {/* Context menu */}
      {contextMenu && (
        <div
          style={{
            position: 'fixed',
            left: contextMenu.x,
            top: contextMenu.y,
            backgroundColor: '#333',
            border: '1px solid #555',
            borderRadius: '4px',
            zIndex: 200,
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            minWidth: '120px',
          }}
        >
          {contextMenu.type === 'layer' && (
            <>
              <div
                onClick={() => {
                  onDuplicateLayer(contextMenu.id);
                  setContextMenu(null);
                }}
                style={{ padding: '6px 12px', fontSize: '12px', color: '#fff', cursor: 'pointer' }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.backgroundColor = '#444')}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.backgroundColor = 'transparent')}
              >
                Duplicate
              </div>
              <div
                onClick={() => {
                  onDeleteLayer(contextMenu.id);
                  setContextMenu(null);
                }}
                style={{ padding: '6px 12px', fontSize: '12px', color: '#ff6b6b', cursor: 'pointer' }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.backgroundColor = '#444')}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.backgroundColor = 'transparent')}
              >
                Delete
              </div>
            </>
          )}
          {contextMenu.type === 'scene' && (
            <div
              onClick={() => {
                onDeleteScene(contextMenu.id);
                setContextMenu(null);
              }}
              style={{ padding: '6px 12px', fontSize: '12px', color: '#ff6b6b', cursor: 'pointer' }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.backgroundColor = '#444')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.backgroundColor = 'transparent')}
            >
              Delete Scene
            </div>
          )}
        </div>
      )}
    </div>
  );
}
