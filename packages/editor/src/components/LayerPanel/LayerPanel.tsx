import React from 'react';
import type { LayerPanelProps } from '../../types';

export function LayerPanel({
  sceneId,
  layers,
  selectedLayerId,
  onSelectLayer,
  onAddLayer,
  onDeleteLayer,
  onReorderLayers,
  onDuplicateLayer,
}: LayerPanelProps) {
  const layerTypes = [
    { type: 'text', label: 'Text', icon: 'T' },
    { type: 'shape', label: 'Shape', icon: '▢' },
    { type: 'image', label: 'Image', icon: '🖼' },
    { type: 'video', label: 'Video', icon: '🎬' },
  ];

  const handleDragStart = (e: React.DragEvent, layerId: string) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', layerId);
  };

  const handleDrop = (e: React.DragEvent, targetLayerId: string) => {
    e.preventDefault();
    const draggedLayerId = e.dataTransfer.getData('text/plain');

    if (draggedLayerId === targetLayerId) return;

    const draggedIndex = layers.findIndex(l => l.id === draggedLayerId);
    const targetIndex = layers.findIndex(l => l.id === targetLayerId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newLayerIds = [...layers.map(l => l.id)];
    newLayerIds.splice(draggedIndex, 1);
    newLayerIds.splice(targetIndex, 0, draggedLayerId);

    onReorderLayers(newLayerIds);
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

  return (
    <div className="rendervid-layer-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#2a2a2a', color: '#fff' }}>
      {/* Header */}
      <div style={{ padding: '12px', borderBottom: '1px solid #444' }}>
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Layers</h3>
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

      {/* Layer list */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {layers.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666', fontSize: '13px' }}>
            No layers. Add a layer to get started.
          </div>
        ) : (
          <div>
            {layers.map((layer) => (
              <div
                key={layer.id}
                draggable
                onDragStart={(e) => handleDragStart(e, layer.id)}
                onDrop={(e) => handleDrop(e, layer.id)}
                onDragOver={handleDragOver}
                onClick={() => onSelectLayer(layer.id)}
                style={{
                  padding: '10px 12px',
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
