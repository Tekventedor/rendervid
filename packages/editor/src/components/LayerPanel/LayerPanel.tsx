import React, { useState } from 'react';
import type { LayerPanelProps } from '../../types';

export function LayerPanel({
  scenes,
  selectedSceneId,
  selectedLayerId,
  onSelectScene,
  onSelectLayer,
  onAddLayer,
  onDeleteLayer,
  onReorderLayers,
  onDuplicateLayer,
  onAddScene,
  onDeleteScene,
}: LayerPanelProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const layerTypes = [
    { type: 'text', label: 'Text', icon: 'T' },
    { type: 'shape', label: 'Shape', icon: '▢' },
    { type: 'image', label: 'Image', icon: '🖼' },
    { type: 'video', label: 'Video', icon: '🎬' },
    { type: 'audio', label: 'Audio', icon: '🔊' },
  ];

  const handleDragStart = (e: React.DragEvent, layerId: string, sceneId: string) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify({ layerId, sceneId }));
  };

  const handleDrop = (e: React.DragEvent, targetLayerId: string, scene: any) => {
    e.preventDefault();
    let data: { layerId: string; sceneId: string };
    try {
      data = JSON.parse(e.dataTransfer.getData('text/plain'));
    } catch {
      return;
    }

    if (data.sceneId !== scene.id) return;
    if (data.layerId === targetLayerId) return;

    const layers: any[] = scene.layers || [];
    const draggedIndex = layers.findIndex((l: any) => l.id === data.layerId);
    const targetIndex = layers.findIndex((l: any) => l.id === targetLayerId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newLayerIds = layers.map((l: any) => l.id);
    newLayerIds.splice(draggedIndex, 1);
    newLayerIds.splice(targetIndex, 0, data.layerId);

    onReorderLayers(scene.id, newLayerIds);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const getLayerIcon = (type: string): string => {
    switch (type) {
      case 'text': return 'T';
      case 'shape': return '▢';
      case 'image': return '🖼';
      case 'video': return '🎬';
      case 'audio': return '🔊';
      default: return '◆';
    }
  };

  const toggleCollapsed = (sceneId: string) => {
    setCollapsed((prev) => ({ ...prev, [sceneId]: !prev[sceneId] }));
  };

  return (
    <div className="rendervid-layer-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#2a2a2a', color: '#fff' }}>
      {/* Header */}
      <div style={{ padding: '12px', borderBottom: '1px solid #444', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Scenes &amp; Layers</h3>
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
          title="Add Scene"
        >
          + Scene
        </button>
      </div>

      {/* Add layer buttons */}
      <div style={{ padding: '8px', borderBottom: '1px solid #444', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {layerTypes.map((lt) => (
          <button
            key={lt.type}
            onClick={() => onAddLayer(lt.type)}
            style={{
              padding: '6px 12px',
              fontSize: '11px',
              backgroundColor: '#444',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            title={`Add ${lt.label}`}
          >
            {lt.icon} {lt.label}
          </button>
        ))}
      </div>

      {/* Scene tree */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {scenes.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666', fontSize: '13px' }}>
            No scenes. Add a scene to get started.
          </div>
        ) : (
          scenes.map((scene: any, index: number) => {
            const isSelected = scene.id === selectedSceneId;
            const isCollapsed = collapsed[scene.id] ?? false;
            const layers: any[] = scene.layers || [];

            return (
              <div key={scene.id}>
                {/* Scene header */}
                <div
                  onClick={() => {
                    onSelectScene(scene.id);
                    onSelectLayer(null);
                  }}
                  style={{
                    padding: '8px 12px',
                    borderBottom: '1px solid #444',
                    cursor: 'pointer',
                    backgroundColor: isSelected && !selectedLayerId ? '#3a3a3a' : isSelected ? '#333' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCollapsed(scene.id);
                    }}
                    style={{
                      fontSize: '10px',
                      cursor: 'pointer',
                      userSelect: 'none',
                      width: '14px',
                      textAlign: 'center',
                    }}
                  >
                    {isCollapsed ? '▶' : '▼'}
                  </span>
                  <span style={{ flex: 1, fontSize: '13px', fontWeight: 600 }}>
                    {scene.name || `Scene ${index + 1}`}
                  </span>
                  <span style={{ fontSize: '10px', color: '#888', backgroundColor: '#333', padding: '1px 6px', borderRadius: '8px' }}>
                    {layers.length}
                  </span>
                  {scenes.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteScene(scene.id);
                      }}
                      style={{
                        padding: '2px 6px',
                        fontSize: '11px',
                        backgroundColor: '#d44',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                      }}
                      title="Delete Scene"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Layers (when expanded) */}
                {!isCollapsed && (
                  <div>
                    {layers.length === 0 ? (
                      <div style={{ padding: '10px 12px 10px 28px', color: '#666', fontSize: '12px' }}>
                        No layers
                      </div>
                    ) : (
                      layers.map((layer: any) => (
                        <div
                          key={layer.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, layer.id, scene.id)}
                          onDrop={(e) => handleDrop(e, layer.id, scene)}
                          onDragOver={handleDragOver}
                          onClick={() => {
                            onSelectScene(scene.id);
                            onSelectLayer(layer.id);
                          }}
                          style={{
                            padding: '10px 12px 10px 28px',
                            borderBottom: '1px solid #444',
                            cursor: 'pointer',
                            backgroundColor: selectedLayerId === layer.id ? '#444' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <span style={{ fontSize: '16px' }}>{getLayerIcon(layer.type)}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '13px', fontWeight: 500 }}>
                              {layer.id}
                            </div>
                            <div style={{ fontSize: '11px', color: '#999' }}>
                              {layer.type}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDuplicateLayer(layer.id);
                              }}
                              style={{
                                padding: '4px 8px',
                                fontSize: '11px',
                                backgroundColor: '#555',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '3px',
                                cursor: 'pointer',
                              }}
                              title="Duplicate"
                            >
                              ⧉
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteLayer(layer.id);
                              }}
                              style={{
                                padding: '4px 8px',
                                fontSize: '11px',
                                backgroundColor: '#d44',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '3px',
                                cursor: 'pointer',
                              }}
                              title="Delete"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
