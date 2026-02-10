import React, { useState } from 'react';
import type { InputDefinition } from '@rendervid/core';
import type { InputPanelProps } from '../../types';

export function InputPanel({ inputs, values, onChangeValue, onReset }: InputPanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="rendervid-input-panel" style={{ backgroundColor: '#2a2a2a', borderBottom: '1px solid #444' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          cursor: 'pointer',
          userSelect: 'none',
        }}
        onClick={() => setCollapsed(!collapsed)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '10px', color: '#999' }}>{collapsed ? '\u25B6' : '\u25BC'}</span>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#fff' }}>Inputs</h3>
          <span style={{ fontSize: '11px', color: '#666' }}>({inputs.length})</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onReset();
          }}
          style={{
            padding: '2px 8px',
            fontSize: '11px',
            backgroundColor: '#444',
            color: '#ccc',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
          }}
          title="Reset to defaults"
        >
          Reset
        </button>
      </div>

      {/* Fields */}
      {!collapsed && (
        <div style={{ padding: '0 12px 12px' }}>
          {inputs.map((input) => (
            <InputField
              key={input.key}
              input={input}
              value={values[input.key]}
              onChange={(value) => onChangeValue(input.key, value)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function InputField({
  input,
  value,
  onChange,
}: {
  input: InputDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '6px',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    border: '1px solid #444',
    borderRadius: '4px',
    fontSize: '12px',
    boxSizing: 'border-box',
  };

  const renderControl = () => {
    switch (input.type) {
      case 'boolean':
        return (
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => onChange(e.target.checked)}
              style={{ accentColor: '#0066cc' }}
            />
            <span style={{ fontSize: '12px', color: '#ccc' }}>{value ? 'Yes' : 'No'}</span>
          </label>
        );

      case 'number':
        return (
          <input
            type="number"
            value={value != null ? Number(value) : ''}
            min={input.validation?.min}
            max={input.validation?.max}
            step={input.validation?.step}
            onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder={input.ui?.placeholder}
            style={inputStyle}
          />
        );

      case 'color':
        return (
          <input
            type="color"
            value={typeof value === 'string' ? value : '#000000'}
            onChange={(e) => onChange(e.target.value)}
            style={{
              ...inputStyle,
              height: '32px',
              padding: '2px',
              cursor: 'pointer',
            }}
          />
        );

      case 'enum':
        return (
          <select
            value={String(value ?? '')}
            onChange={(e) => onChange(e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            <option value="">-- Select --</option>
            {input.validation?.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case 'string':
      case 'richtext':
      case 'date':
        if (input.ui?.rows && input.ui.rows > 1) {
          return (
            <textarea
              value={String(value ?? '')}
              onChange={(e) => onChange(e.target.value)}
              rows={input.ui.rows}
              placeholder={input.ui?.placeholder}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          );
        }
        return (
          <input
            type={input.type === 'date' ? 'date' : 'text'}
            value={String(value ?? '')}
            onChange={(e) => onChange(e.target.value)}
            placeholder={input.ui?.placeholder}
            style={inputStyle}
          />
        );

      case 'url':
      // Handle non-standard types that some templates use
      // eslint-disable-next-line no-fallthrough
      case 'image' as any:
      case 'video' as any: {
        const allowedTypes = input.validation?.allowedTypes as string[] | undefined;
        const isImage = input.type === ('image' as any) || allowedTypes?.includes('image');
        const isVideo = input.type === ('video' as any) || allowedTypes?.includes('video');
        const typeLabel = isVideo ? 'Video' : isImage ? 'Image' : 'URL';
        const strValue = String(value ?? '');
        const hasPreview = isImage && strValue && strValue !== '';

        return (
          <div>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <input
                type="text"
                value={strValue}
                onChange={(e) => onChange(e.target.value)}
                placeholder={input.ui?.placeholder || `Enter ${typeLabel.toLowerCase()} URL...`}
                style={{ ...inputStyle, flex: 1 }}
              />
              <span style={{
                padding: '2px 6px',
                fontSize: '9px',
                fontWeight: 600,
                backgroundColor: isVideo ? '#7c3aed' : isImage ? '#0284c7' : '#444',
                color: '#fff',
                borderRadius: '3px',
                whiteSpace: 'nowrap',
                textTransform: 'uppercase',
              }}>
                {typeLabel}
              </span>
            </div>
            {hasPreview && (
              <div style={{
                marginTop: '4px',
                borderRadius: '4px',
                overflow: 'hidden',
                border: '1px solid #444',
                maxHeight: '80px',
              }}>
                <img
                  src={strValue}
                  alt=""
                  style={{ width: '100%', height: '80px', objectFit: 'cover', display: 'block' }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
            )}
          </div>
        );
      }

      default:
        return (
          <input
            type="text"
            value={String(value ?? '')}
            onChange={(e) => onChange(e.target.value)}
            placeholder={input.ui?.placeholder}
            style={inputStyle}
          />
        );
    }
  };

  return (
    <div style={{ marginBottom: '8px' }}>
      <label style={{ display: 'block', fontSize: '11px', marginBottom: '4px', color: '#999' }}>
        {input.label || input.key}
        {input.required && <span style={{ color: '#cc4444', marginLeft: '2px' }}>*</span>}
      </label>
      {renderControl()}
      {input.description && (
        <p style={{ margin: '2px 0 0', fontSize: '10px', color: '#666' }}>{input.description}</p>
      )}
    </div>
  );
}
