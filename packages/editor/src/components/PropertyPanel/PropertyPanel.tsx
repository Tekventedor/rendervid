import React from 'react';
import type { PropertyPanelProps } from '../../types';

export function PropertyPanel({ selectedLayer, onUpdateLayer }: PropertyPanelProps) {
  if (!selectedLayer) {
    return (
      <div className="rendervid-property-panel" style={{ padding: '20px', backgroundColor: '#2a2a2a', color: '#999', height: '100%' }}>
        <p style={{ textAlign: 'center', fontSize: '13px' }}>
          Select a layer to edit its properties
        </p>
      </div>
    );
  }

  const handleChange = (key: string, value: any) => {
    onUpdateLayer({ [key]: value });
  };

  const handlePropChange = (propKey: string, value: any) => {
    onUpdateLayer({
      props: {
        ...selectedLayer.props,
        [propKey]: value,
      },
    });
  };

  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    onUpdateLayer({
      position: {
        ...selectedLayer.position,
        [axis]: value,
      },
    });
  };

  const handleSizeChange = (dimension: 'width' | 'height', value: number) => {
    onUpdateLayer({
      size: {
        ...selectedLayer.size,
        [dimension]: value,
      },
    });
  };

  return (
    <div className="rendervid-property-panel" style={{ padding: '12px', backgroundColor: '#2a2a2a', color: '#fff', height: '100%', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #444' }}>
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Properties</h3>
        <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#999' }}>
          {selectedLayer.type} • {selectedLayer.id}
        </p>
      </div>

      {/* Transform */}
      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 600, color: '#aaa' }}>Transform</h4>

        <div style={{ marginBottom: '8px' }}>
          <label style={{ display: 'block', fontSize: '11px', marginBottom: '4px', color: '#999' }}>Position X</label>
          <input
            type="number"
            value={selectedLayer.position?.x || 0}
            onChange={(e) => handlePositionChange('x', parseInt(e.target.value))}
            style={{
              width: '100%',
              padding: '6px',
              backgroundColor: '#1a1a1a',
              color: '#fff',
              border: '1px solid #444',
              borderRadius: '4px',
              fontSize: '12px',
            }}
          />
        </div>

        <div style={{ marginBottom: '8px' }}>
          <label style={{ display: 'block', fontSize: '11px', marginBottom: '4px', color: '#999' }}>Position Y</label>
          <input
            type="number"
            value={selectedLayer.position?.y || 0}
            onChange={(e) => handlePositionChange('y', parseInt(e.target.value))}
            style={{
              width: '100%',
              padding: '6px',
              backgroundColor: '#1a1a1a',
              color: '#fff',
              border: '1px solid #444',
              borderRadius: '4px',
              fontSize: '12px',
            }}
          />
        </div>

        <div style={{ marginBottom: '8px' }}>
          <label style={{ display: 'block', fontSize: '11px', marginBottom: '4px', color: '#999' }}>Width</label>
          <input
            type="number"
            value={selectedLayer.size?.width || 0}
            onChange={(e) => handleSizeChange('width', parseInt(e.target.value))}
            style={{
              width: '100%',
              padding: '6px',
              backgroundColor: '#1a1a1a',
              color: '#fff',
              border: '1px solid #444',
              borderRadius: '4px',
              fontSize: '12px',
            }}
          />
        </div>

        <div style={{ marginBottom: '8px' }}>
          <label style={{ display: 'block', fontSize: '11px', marginBottom: '4px', color: '#999' }}>Height</label>
          <input
            type="number"
            value={selectedLayer.size?.height || 0}
            onChange={(e) => handleSizeChange('height', parseInt(e.target.value))}
            style={{
              width: '100%',
              padding: '6px',
              backgroundColor: '#1a1a1a',
              color: '#fff',
              border: '1px solid #444',
              borderRadius: '4px',
              fontSize: '12px',
            }}
          />
        </div>
      </div>

      {/* Layer-specific properties */}
      {selectedLayer.type === 'text' && (
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 600, color: '#aaa' }}>Text</h4>

          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'block', fontSize: '11px', marginBottom: '4px', color: '#999' }}>Content</label>
            <textarea
              value={selectedLayer.props?.text || ''}
              onChange={(e) => handlePropChange('text', e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: '6px',
                backgroundColor: '#1a1a1a',
                color: '#fff',
                border: '1px solid #444',
                borderRadius: '4px',
                fontSize: '12px',
                resize: 'vertical',
              }}
            />
          </div>

          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'block', fontSize: '11px', marginBottom: '4px', color: '#999' }}>Font Size</label>
            <input
              type="number"
              value={selectedLayer.props?.fontSize || 16}
              onChange={(e) => handlePropChange('fontSize', parseInt(e.target.value))}
              style={{
                width: '100%',
                padding: '6px',
                backgroundColor: '#1a1a1a',
                color: '#fff',
                border: '1px solid #444',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            />
          </div>

          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'block', fontSize: '11px', marginBottom: '4px', color: '#999' }}>Color</label>
            <input
              type="color"
              value={selectedLayer.props?.color || '#ffffff'}
              onChange={(e) => handlePropChange('color', e.target.value)}
              style={{
                width: '100%',
                height: '32px',
                padding: '0',
                backgroundColor: '#1a1a1a',
                border: '1px solid #444',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            />
          </div>
        </div>
      )}

      {selectedLayer.type === 'shape' && (
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 600, color: '#aaa' }}>Shape</h4>

          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'block', fontSize: '11px', marginBottom: '4px', color: '#999' }}>Fill Color</label>
            <input
              type="color"
              value={selectedLayer.props?.fill || '#ffffff'}
              onChange={(e) => handlePropChange('fill', e.target.value)}
              style={{
                width: '100%',
                height: '32px',
                padding: '0',
                backgroundColor: '#1a1a1a',
                border: '1px solid #444',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            />
          </div>

          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'block', fontSize: '11px', marginBottom: '4px', color: '#999' }}>Border Radius</label>
            <input
              type="number"
              value={selectedLayer.props?.borderRadius || 0}
              onChange={(e) => handlePropChange('borderRadius', parseInt(e.target.value))}
              style={{
                width: '100%',
                padding: '6px',
                backgroundColor: '#1a1a1a',
                color: '#fff',
                border: '1px solid #444',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            />
          </div>
        </div>
      )}

      {selectedLayer.type === 'image' && (
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 600, color: '#aaa' }}>Image</h4>

          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'block', fontSize: '11px', marginBottom: '4px', color: '#999' }}>Source URL</label>
            <input
              type="text"
              value={selectedLayer.props?.src || ''}
              onChange={(e) => handlePropChange('src', e.target.value)}
              placeholder="https://..."
              style={{
                width: '100%',
                padding: '6px',
                backgroundColor: '#1a1a1a',
                color: '#fff',
                border: '1px solid #444',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            />
          </div>

          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'block', fontSize: '11px', marginBottom: '4px', color: '#999' }}>Object Fit</label>
            <select
              value={selectedLayer.props?.fit || 'cover'}
              onChange={(e) => handlePropChange('fit', e.target.value)}
              style={{
                width: '100%',
                padding: '6px',
                backgroundColor: '#1a1a1a',
                color: '#fff',
                border: '1px solid #444',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            >
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
              <option value="fill">Fill</option>
            </select>
          </div>
        </div>
      )}

      {/* Opacity */}
      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 600, color: '#aaa' }}>Appearance</h4>

        <div style={{ marginBottom: '8px' }}>
          <label style={{ display: 'block', fontSize: '11px', marginBottom: '4px', color: '#999' }}>Opacity</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={selectedLayer.opacity || 1}
            onChange={(e) => handleChange('opacity', parseFloat(e.target.value))}
            style={{
              width: '100%',
            }}
          />
          <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
            {Math.round((selectedLayer.opacity || 1) * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
}
