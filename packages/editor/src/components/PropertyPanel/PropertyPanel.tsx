import React, { useState } from 'react';
import type { PropertyPanelProps } from '../../types';
import { CodeEditorDialog } from './CodeEditorDialog';

// ─── Constants for dropdown options ───

const ENTRANCE_EFFECTS = [
  'fadeIn', 'fadeInUp', 'fadeInDown', 'fadeInLeft', 'fadeInRight',
  'slideInUp', 'slideInDown', 'slideInLeft', 'slideInRight',
  'scaleIn', 'scaleInUp', 'scaleInDown', 'zoomIn',
  'rotateIn', 'rotateInClockwise', 'rotateInCounterClockwise',
  'bounceIn', 'bounceInUp', 'bounceInDown',
  'flipInX', 'flipInY',
  'rollIn', 'lightSpeedIn', 'swingIn', 'backIn', 'elasticIn',
  'typewriter', 'revealLeft', 'revealRight', 'revealUp', 'revealDown',
];

const EXIT_EFFECTS = [
  'fadeOut', 'fadeOutUp', 'fadeOutDown', 'fadeOutLeft', 'fadeOutRight',
  'slideOutUp', 'slideOutDown', 'slideOutLeft', 'slideOutRight',
  'scaleOut', 'zoomOut', 'rotateOut', 'bounceOut',
  'flipOutX', 'flipOutY',
  'rollOut', 'lightSpeedOut', 'swingOut', 'backOut', 'elasticOut',
];

const EMPHASIS_EFFECTS = [
  'pulse', 'float', 'heartbeat',
  'shake', 'bounce', 'swing', 'wobble',
  'flash', 'tada', 'rubberBand', 'jello', 'spin',
];

const EASING_OPTIONS = [
  'linear',
  'easeInQuad', 'easeOutQuad', 'easeInOutQuad',
  'easeInCubic', 'easeOutCubic', 'easeInOutCubic',
  'easeInQuart', 'easeOutQuart', 'easeInOutQuart',
  'easeInBack', 'easeOutBack', 'easeInOutBack',
  'easeInElastic', 'easeOutElastic', 'easeInOutElastic',
  'easeInBounce', 'easeOutBounce', 'easeInOutBounce',
];

const TRANSITION_TYPES = [
  'cut', 'fade', 'slide', 'wipe', 'zoom', 'rotate', 'flip', 'blur',
  'circle', 'push', 'crosszoom', 'glitch', 'dissolve', 'cube', 'swirl', 'diagonal-wipe', 'iris',
];

const DIRECTIONAL_TRANSITIONS = ['slide', 'wipe', 'push'];

const BLEND_MODES = [
  'normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten',
  'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion',
];

// ─── Shared styles ───

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

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  marginBottom: '4px',
  color: '#999',
};

const sectionHeaderStyle: React.CSSProperties = {
  margin: '0 0 8px',
  fontSize: '12px',
  fontWeight: 600,
  color: '#aaa',
};

const fieldStyle: React.CSSProperties = {
  marginBottom: '8px',
};

// ─── Collapsible Section ───

function Section({ title, defaultOpen = true, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: '16px' }}>
      <div
        onClick={() => setOpen(!open)}
        style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', userSelect: 'none', marginBottom: open ? '8px' : 0 }}
      >
        <span style={{ fontSize: '10px', color: '#999' }}>{open ? '\u25BC' : '\u25B6'}</span>
        <h4 style={{ ...sectionHeaderStyle, margin: 0 }}>{title}</h4>
      </div>
      {open && children}
    </div>
  );
}

// ─── Main Component ───

export function PropertyPanel({ selectedLayer, onUpdateLayer, template, onUpdateCustomComponentCode, selectedScene, onUpdateScene }: PropertyPanelProps) {
  const [codeDialogOpen, setCodeDialogOpen] = useState(false);

  if (!selectedLayer && !selectedScene) {
    return (
      <div className="rendervid-property-panel" style={{ padding: '20px', backgroundColor: '#2a2a2a', color: '#999', height: '100%' }}>
        <p style={{ textAlign: 'center', fontSize: '13px' }}>
          Select a layer to edit its properties
        </p>
      </div>
    );
  }

  // ─── Handlers ───

  const handleChange = (key: string, value: any) => {
    onUpdateLayer({ [key]: value });
  };

  const handlePropChange = (propKey: string, value: any) => {
    onUpdateLayer({
      props: { ...selectedLayer.props, [propKey]: value },
    });
  };

  const handleCustomComponentPropChange = (propKey: string, value: string) => {
    onUpdateLayer({
      customComponent: {
        ...selectedLayer.customComponent,
        props: { ...selectedLayer.customComponent?.props, [propKey]: value },
      },
    });
  };

  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    onUpdateLayer({ position: { ...selectedLayer?.position, [axis]: value } });
  };

  const handleSizeChange = (dimension: 'width' | 'height', value: number) => {
    onUpdateLayer({ size: { ...selectedLayer?.size, [dimension]: value } });
  };

  // ─── Animation handlers ───

  const animations: any[] = selectedLayer?.animations || [];

  const handleAddAnimation = (type: string) => {
    const effects: Record<string, string> = {
      entrance: 'fadeIn',
      exit: 'fadeOut',
      emphasis: 'pulse',
    };
    const newAnim: any = {
      type,
      effect: effects[type] || 'fadeIn',
      duration: 30,
      delay: 0,
    };
    if (type === 'keyframe') {
      delete newAnim.effect;
      newAnim.keyframes = [
        { frame: 0, properties: { opacity: 1 } },
        { frame: 30, properties: { opacity: 1 } },
      ];
    }
    onUpdateLayer({ animations: [...animations, newAnim] });
  };

  const handleUpdateAnimation = (index: number, updates: any) => {
    const updated = animations.map((a: any, i: number) => i === index ? { ...a, ...updates } : a);
    onUpdateLayer({ animations: updated });
  };

  const handleRemoveAnimation = (index: number) => {
    onUpdateLayer({ animations: animations.filter((_: any, i: number) => i !== index) });
  };

  // ─── Transition handlers ───

  const handleSetTransition = () => {
    if (!selectedScene) return;
    onUpdateScene({ transition: { type: 'fade', duration: 30 } });
  };

  const handleUpdateTransition = (updates: any) => {
    if (!selectedScene) return;
    onUpdateScene({ transition: { ...selectedScene.transition, ...updates } });
  };

  const handleRemoveTransition = () => {
    if (!selectedScene) return;
    onUpdateScene({ transition: undefined });
  };

  // ─── Effect options for animation type ───

  const getEffectsForType = (type: string) => {
    switch (type) {
      case 'entrance': return ENTRANCE_EFFECTS;
      case 'exit': return EXIT_EFFECTS;
      case 'emphasis': return EMPHASIS_EFFECTS;
      default: return [];
    }
  };

  return (
    <div className="rendervid-property-panel" style={{ padding: '12px', backgroundColor: '#2a2a2a', color: '#fff', height: '100%', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #444' }}>
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Properties</h3>
        {selectedLayer ? (
          <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#999' }}>
            {selectedLayer.type} • {selectedLayer.id}
          </p>
        ) : selectedScene ? (
          <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#999' }}>
            Scene • {selectedScene.name || selectedScene.id}
          </p>
        ) : null}
      </div>

      {/* ═══ SCENE PROPERTIES (shown when no layer is selected) ═══ */}
      {selectedScene && !selectedLayer && (
        <>
          <Section title="Scene">
            <div style={fieldStyle}>
              <label style={labelStyle}>Name</label>
              <input
                type="text"
                value={selectedScene.name || ''}
                onChange={(e) => onUpdateScene({ name: e.target.value })}
                placeholder={selectedScene.id}
                style={inputStyle}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <div>
                <label style={labelStyle}>Start Frame</label>
                <input
                  type="number"
                  value={selectedScene.startFrame ?? 0}
                  min={0}
                  onChange={(e) => onUpdateScene({ startFrame: parseInt(e.target.value) || 0 })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>End Frame</label>
                <input
                  type="number"
                  value={selectedScene.endFrame ?? 0}
                  min={0}
                  onChange={(e) => onUpdateScene({ endFrame: parseInt(e.target.value) || 0 })}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ marginTop: '8px' }}>
              <label style={labelStyle}>Background Color</label>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <input
                  type="color"
                  value={selectedScene.backgroundColor || '#000000'}
                  onChange={(e) => onUpdateScene({ backgroundColor: e.target.value })}
                  style={{ ...inputStyle, width: '40px', height: '32px', padding: '2px', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={selectedScene.backgroundColor || ''}
                  onChange={(e) => onUpdateScene({ backgroundColor: e.target.value })}
                  placeholder="none"
                  style={{ ...inputStyle, flex: 1 }}
                />
              </div>
            </div>
          </Section>

          <Section title="Transition">
            {selectedScene.transition ? (
              <div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Type</label>
                  <select
                    value={selectedScene.transition.type || 'fade'}
                    onChange={(e) => handleUpdateTransition({ type: e.target.value })}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    {TRANSITION_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Duration (frames)</label>
                  <input
                    type="number"
                    value={selectedScene.transition.duration || 30}
                    min={1}
                    onChange={(e) => handleUpdateTransition({ duration: parseInt(e.target.value) || 1 })}
                    style={inputStyle}
                  />
                </div>

                {DIRECTIONAL_TRANSITIONS.includes(selectedScene.transition.type) && (
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Direction</label>
                    <select
                      value={selectedScene.transition.direction || 'left'}
                      onChange={(e) => handleUpdateTransition({ direction: e.target.value })}
                      style={{ ...inputStyle, cursor: 'pointer' }}
                    >
                      {['left', 'right', 'up', 'down'].map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div style={fieldStyle}>
                  <label style={labelStyle}>Easing</label>
                  <select
                    value={selectedScene.transition.easing || ''}
                    onChange={(e) => handleUpdateTransition({ easing: e.target.value || undefined })}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    <option value="">Default</option>
                    {EASING_OPTIONS.map((e) => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleRemoveTransition}
                  style={{
                    padding: '4px 10px', fontSize: '11px',
                    backgroundColor: '#662222', color: '#ff8888',
                    border: 'none', borderRadius: '3px', cursor: 'pointer',
                  }}
                >
                  Remove Transition
                </button>
              </div>
            ) : (
              <button
                onClick={handleSetTransition}
                style={{
                  padding: '6px 12px', fontSize: '11px',
                  backgroundColor: '#444', color: '#ccc',
                  border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%',
                }}
              >
                + Add Transition
              </button>
            )}
          </Section>
        </>
      )}

      {/* ═══ LAYER PROPERTIES ═══ */}
      {selectedLayer && (
        <>
          {/* ─── Audio Properties (audio layers only, no transform/animations) ─── */}
          {selectedLayer.type === 'audio' && (
            <Section title="Audio">
              <div style={fieldStyle}>
                <label style={labelStyle}>Source URL</label>
                <input type="text" value={selectedLayer.props?.src || ''} onChange={(e) => handlePropChange('src', e.target.value)} placeholder="audio.mp3 or https://..." style={inputStyle} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                <div>
                  <label style={labelStyle}>Volume</label>
                  <input type="number" min={0} max={1} step={0.05} value={selectedLayer.props?.volume ?? 1} onChange={(e) => handlePropChange('volume', parseFloat(e.target.value))} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Loop</label>
                  <select value={selectedLayer.props?.loop ? 'yes' : 'no'} onChange={(e) => handlePropChange('loop', e.target.value === 'yes')} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '6px' }}>
                <div>
                  <label style={labelStyle}>Start Time (s)</label>
                  <input type="number" min={0} step={0.1} value={selectedLayer.props?.startTime ?? 0} onChange={(e) => handlePropChange('startTime', parseFloat(e.target.value))} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Pan</label>
                  <input type="number" min={-1} max={1} step={0.1} value={selectedLayer.props?.pan ?? 0} onChange={(e) => handlePropChange('pan', parseFloat(e.target.value))} style={inputStyle} title="-1 = left, 0 = center, 1 = right" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '6px' }}>
                <div>
                  <label style={labelStyle}>Fade In (frames)</label>
                  <input type="number" min={0} value={selectedLayer.props?.fadeIn ?? 0} onChange={(e) => handlePropChange('fadeIn', parseInt(e.target.value) || 0)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Fade Out (frames)</label>
                  <input type="number" min={0} value={selectedLayer.props?.fadeOut ?? 0} onChange={(e) => handlePropChange('fadeOut', parseInt(e.target.value) || 0)} style={inputStyle} />
                </div>
              </div>

              <div style={{ marginTop: '6px' }}>
                <label style={labelStyle}>Layer Timing</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  <div>
                    <label style={labelStyle}>From (frame)</label>
                    <input type="number" min={0} value={selectedLayer.from ?? 0} onChange={(e) => handleChange('from', parseInt(e.target.value) || 0)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Duration (frames)</label>
                    <input type="number" min={-1} value={selectedLayer.duration ?? -1} onChange={(e) => handleChange('duration', parseInt(e.target.value))} style={inputStyle} title="-1 = entire scene" />
                  </div>
                </div>
              </div>
            </Section>
          )}

          {/* ─── Transform (hidden for audio layers) ─── */}
          {selectedLayer.type !== 'audio' && (
          <Section title="Transform">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <div>
                <label style={labelStyle}>X</label>
                <input type="number" value={selectedLayer.position?.x || 0} onChange={(e) => handlePositionChange('x', parseInt(e.target.value))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Y</label>
                <input type="number" value={selectedLayer.position?.y || 0} onChange={(e) => handlePositionChange('y', parseInt(e.target.value))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Width</label>
                <input type="number" value={selectedLayer.size?.width || 0} onChange={(e) => handleSizeChange('width', parseInt(e.target.value))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Height</label>
                <input type="number" value={selectedLayer.size?.height || 0} onChange={(e) => handleSizeChange('height', parseInt(e.target.value))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Rotation</label>
                <input type="number" value={selectedLayer.rotation || 0} onChange={(e) => handleChange('rotation', parseFloat(e.target.value))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Opacity</label>
                <input type="number" min={0} max={1} step={0.05} value={selectedLayer.opacity ?? 1} onChange={(e) => handleChange('opacity', parseFloat(e.target.value))} style={inputStyle} />
              </div>
            </div>

            <div style={{ marginTop: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <div>
                <label style={labelStyle}>Scale X</label>
                <input type="number" min={0} step={0.1} value={selectedLayer.scale?.x ?? 1} onChange={(e) => handleChange('scale', { ...(selectedLayer.scale || { x: 1, y: 1 }), x: parseFloat(e.target.value) })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Scale Y</label>
                <input type="number" min={0} step={0.1} value={selectedLayer.scale?.y ?? 1} onChange={(e) => handleChange('scale', { ...(selectedLayer.scale || { x: 1, y: 1 }), y: parseFloat(e.target.value) })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Anchor X</label>
                <input type="number" min={0} max={1} step={0.1} value={selectedLayer.anchor?.x ?? 0.5} onChange={(e) => handleChange('anchor', { ...(selectedLayer.anchor || { x: 0.5, y: 0.5 }), x: parseFloat(e.target.value) })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Anchor Y</label>
                <input type="number" min={0} max={1} step={0.1} value={selectedLayer.anchor?.y ?? 0.5} onChange={(e) => handleChange('anchor', { ...(selectedLayer.anchor || { x: 0.5, y: 0.5 }), y: parseFloat(e.target.value) })} style={inputStyle} />
              </div>
            </div>

            {/* Blend Mode */}
            <div style={{ marginTop: '8px' }}>
              <label style={labelStyle}>Blend Mode</label>
              <select
                value={selectedLayer.blendMode || 'normal'}
                onChange={(e) => handleChange('blendMode', e.target.value === 'normal' ? undefined : e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                {BLEND_MODES.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </Section>
          )}

          {/* ─── Animations (hidden for audio layers) ─── */}
          {selectedLayer.type !== 'audio' && (
          <Section title={`Animations (${animations.length})`}>
            {animations.map((anim: any, idx: number) => (
              <AnimationEditor
                key={idx}
                index={idx}
                animation={anim}
                onChange={(updates) => handleUpdateAnimation(idx, updates)}
                onRemove={() => handleRemoveAnimation(idx)}
                getEffectsForType={getEffectsForType}
              />
            ))}

            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              <button onClick={() => handleAddAnimation('entrance')} style={addBtnStyle}>+ Entrance</button>
              <button onClick={() => handleAddAnimation('exit')} style={addBtnStyle}>+ Exit</button>
              <button onClick={() => handleAddAnimation('emphasis')} style={addBtnStyle}>+ Emphasis</button>
              <button onClick={() => handleAddAnimation('keyframe')} style={addBtnStyle}>+ Keyframe</button>
            </div>
          </Section>
          )}

          {/* ─── Text Properties ─── */}
          {selectedLayer.type === 'text' && (
            <Section title="Text">
              <div style={fieldStyle}>
                <label style={labelStyle}>Content</label>
                <textarea
                  value={selectedLayer.props?.text || ''}
                  onChange={(e) => handlePropChange('text', e.target.value)}
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                <div>
                  <label style={labelStyle}>Font Size</label>
                  <input type="number" value={selectedLayer.props?.fontSize || 16} onChange={(e) => handlePropChange('fontSize', parseInt(e.target.value))} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Font Weight</label>
                  <select value={selectedLayer.props?.fontWeight || 'normal'} onChange={(e) => handlePropChange('fontWeight', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                    <option value="100">100</option><option value="200">200</option><option value="300">300</option>
                    <option value="400">400</option><option value="500">500</option><option value="600">600</option>
                    <option value="700">700</option><option value="800">800</option><option value="900">900</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '6px' }}>
                <div>
                  <label style={labelStyle}>Color</label>
                  <input type="color" value={selectedLayer.props?.color || '#ffffff'} onChange={(e) => handlePropChange('color', e.target.value)} style={{ ...inputStyle, height: '32px', padding: '2px', cursor: 'pointer' }} />
                </div>
                <div>
                  <label style={labelStyle}>Align</label>
                  <select value={selectedLayer.props?.textAlign || 'left'} onChange={(e) => handlePropChange('textAlign', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                    <option value="justify">Justify</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '6px' }}>
                <div>
                  <label style={labelStyle}>Line Height</label>
                  <input type="number" step={0.1} min={0.5} value={selectedLayer.props?.lineHeight ?? 1.2} onChange={(e) => handlePropChange('lineHeight', parseFloat(e.target.value))} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Letter Spacing</label>
                  <input type="number" value={selectedLayer.props?.letterSpacing ?? 0} onChange={(e) => handlePropChange('letterSpacing', parseFloat(e.target.value))} style={inputStyle} />
                </div>
              </div>

              <div style={{ marginTop: '6px' }}>
                <label style={labelStyle}>Font Family</label>
                <input type="text" value={selectedLayer.props?.fontFamily || ''} onChange={(e) => handlePropChange('fontFamily', e.target.value)} placeholder="Inter, system-ui, sans-serif" style={inputStyle} />
              </div>
            </Section>
          )}

          {/* ─── Shape Properties ─── */}
          {selectedLayer.type === 'shape' && (
            <Section title="Shape">
              <div style={fieldStyle}>
                <label style={labelStyle}>Shape Type</label>
                <select value={selectedLayer.props?.shape || 'rectangle'} onChange={(e) => handlePropChange('shape', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="rectangle">Rectangle</option>
                  <option value="ellipse">Ellipse</option>
                  <option value="polygon">Polygon</option>
                  <option value="star">Star</option>
                  <option value="path">Path</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                <div>
                  <label style={labelStyle}>Fill Color</label>
                  <input type="color" value={selectedLayer.props?.fill || '#ffffff'} onChange={(e) => handlePropChange('fill', e.target.value)} style={{ ...inputStyle, height: '32px', padding: '2px', cursor: 'pointer' }} />
                </div>
                <div>
                  <label style={labelStyle}>Border Radius</label>
                  <input type="number" value={selectedLayer.props?.borderRadius || 0} min={0} onChange={(e) => handlePropChange('borderRadius', parseInt(e.target.value))} style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '6px' }}>
                <div>
                  <label style={labelStyle}>Stroke Color</label>
                  <input type="color" value={selectedLayer.props?.stroke || '#000000'} onChange={(e) => handlePropChange('stroke', e.target.value)} style={{ ...inputStyle, height: '32px', padding: '2px', cursor: 'pointer' }} />
                </div>
                <div>
                  <label style={labelStyle}>Stroke Width</label>
                  <input type="number" value={selectedLayer.props?.strokeWidth || 0} min={0} onChange={(e) => handlePropChange('strokeWidth', parseInt(e.target.value))} style={inputStyle} />
                </div>
              </div>
            </Section>
          )}

          {/* ─── Image Properties ─── */}
          {selectedLayer.type === 'image' && (
            <Section title="Image">
              <div style={fieldStyle}>
                <label style={labelStyle}>Source URL</label>
                <input type="text" value={selectedLayer.props?.src || ''} onChange={(e) => handlePropChange('src', e.target.value)} placeholder="https://..." style={inputStyle} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Object Fit</label>
                <select value={selectedLayer.props?.fit || 'cover'} onChange={(e) => handlePropChange('fit', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="cover">Cover</option>
                  <option value="contain">Contain</option>
                  <option value="fill">Fill</option>
                </select>
              </div>
            </Section>
          )}

          {/* ─── Video Properties ─── */}
          {selectedLayer.type === 'video' && (
            <Section title="Video">
              <div style={fieldStyle}>
                <label style={labelStyle}>Source URL</label>
                <input type="text" value={selectedLayer.props?.videoSrc || selectedLayer.props?.src || ''} onChange={(e) => handlePropChange('videoSrc', e.target.value)} placeholder="video.mp4 or https://..." style={inputStyle} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Object Fit</label>
                <select value={selectedLayer.props?.fit || 'cover'} onChange={(e) => handlePropChange('fit', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="cover">Cover</option>
                  <option value="contain">Contain</option>
                  <option value="fill">Fill</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                <div>
                  <label style={labelStyle}>Volume</label>
                  <input type="number" min={0} max={1} step={0.05} value={selectedLayer.props?.volume ?? 1} onChange={(e) => handlePropChange('volume', parseFloat(e.target.value))} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Loop</label>
                  <select value={selectedLayer.props?.loop ? 'yes' : 'no'} onChange={(e) => handlePropChange('loop', e.target.value === 'yes')} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '6px' }}>
                <div>
                  <label style={labelStyle}>Start Time (s)</label>
                  <input type="number" min={0} step={0.1} value={selectedLayer.props?.startTime ?? 0} onChange={(e) => handlePropChange('startTime', parseFloat(e.target.value))} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Playback Rate</label>
                  <input type="number" min={0.1} max={4} step={0.1} value={selectedLayer.props?.playbackRate ?? 1} onChange={(e) => handlePropChange('playbackRate', parseFloat(e.target.value))} style={inputStyle} />
                </div>
              </div>
            </Section>
          )}

          {/* ─── Custom Component Properties ─── */}
          {selectedLayer.type === 'custom' && selectedLayer.customComponent && (
            <Section title="Custom Component">
              <div style={fieldStyle}>
                <label style={labelStyle}>Name</label>
                <input type="text" value={selectedLayer.customComponent.name || ''} readOnly style={{ ...inputStyle, color: '#888' }} />
              </div>

              {selectedLayer.customComponent.props && Object.entries(selectedLayer.customComponent.props).map(([key, value]) => (
                <div key={key} style={fieldStyle}>
                  <label style={labelStyle}>{key}</label>
                  <input type="text" value={String(value ?? '')} onChange={(e) => handleCustomComponentPropChange(key, e.target.value)} style={inputStyle} />
                </div>
              ))}

              {template.customComponents?.[selectedLayer.customComponent.name] && (
                <div style={fieldStyle}>
                  <label style={labelStyle}>Component Code</label>
                  <div style={{ position: 'relative' }}>
                    <textarea
                      value={template.customComponents[selectedLayer.customComponent.name].code || ''}
                      onChange={(e) => onUpdateCustomComponentCode(selectedLayer.customComponent.name, e.target.value)}
                      rows={15}
                      style={{ ...inputStyle, fontFamily: 'monospace', resize: 'vertical', lineHeight: '1.5', tabSize: 2 }}
                    />
                    <button
                      onClick={() => setCodeDialogOpen(true)}
                      title="Open in editor"
                      style={{
                        position: 'absolute', top: '4px', right: '4px',
                        width: '24px', height: '24px', padding: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backgroundColor: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#999',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#555'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#333'; }}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="8,1 13,1 13,6" />
                        <line x1="13" y1="1" x2="7" y2="7" />
                        <path d="M11,8 L11,12 C11,12.5 10.5,13 10,13 L2,13 C1.5,13 1,12.5 1,12 L1,4 C1,3.5 1.5,3 2,3 L6,3" />
                      </svg>
                    </button>
                  </div>
                  <CodeEditorDialog
                    isOpen={codeDialogOpen}
                    code={template.customComponents[selectedLayer.customComponent.name].code || ''}
                    componentName={selectedLayer.customComponent.name}
                    onSave={(code) => {
                      onUpdateCustomComponentCode(selectedLayer.customComponent.name, code);
                      setCodeDialogOpen(false);
                    }}
                    onClose={() => setCodeDialogOpen(false)}
                  />
                </div>
              )}
            </Section>
          )}
        </>
      )}
    </div>
  );
}

// ─── Animation Editor Sub-component ───

const addBtnStyle: React.CSSProperties = {
  padding: '4px 8px',
  fontSize: '10px',
  backgroundColor: '#333',
  color: '#aaa',
  border: '1px solid #555',
  borderRadius: '3px',
  cursor: 'pointer',
};

const animCardStyle: React.CSSProperties = {
  padding: '8px',
  marginBottom: '8px',
  backgroundColor: '#1e1e1e',
  borderRadius: '4px',
  border: '1px solid #3a3a3a',
};

function AnimationEditor({
  index,
  animation,
  onChange,
  onRemove,
  getEffectsForType,
}: {
  index: number;
  animation: any;
  onChange: (updates: any) => void;
  onRemove: () => void;
  getEffectsForType: (type: string) => string[];
}) {
  const [expanded, setExpanded] = useState(false);
  const effects = getEffectsForType(animation.type);
  const typeColors: Record<string, string> = { entrance: '#22aa44', exit: '#cc4444', emphasis: '#cc8800', keyframe: '#4488cc' };
  const typeColor = typeColors[animation.type] || '#666';

  return (
    <div style={animCardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: expanded ? '8px' : 0 }}>
        <span
          onClick={() => setExpanded(!expanded)}
          style={{ fontSize: '10px', color: '#999', cursor: 'pointer' }}
        >
          {expanded ? '\u25BC' : '\u25B6'}
        </span>
        <span style={{
          padding: '1px 6px', fontSize: '9px', fontWeight: 600,
          backgroundColor: typeColor, color: '#fff', borderRadius: '3px', textTransform: 'uppercase',
        }}>
          {animation.type}
        </span>
        <span style={{ flex: 1, fontSize: '11px', color: '#ccc', cursor: 'pointer' }} onClick={() => setExpanded(!expanded)}>
          {animation.effect || 'custom'} • {animation.duration}f
        </span>
        <button
          onClick={onRemove}
          style={{ padding: '0 4px', fontSize: '14px', backgroundColor: 'transparent', color: '#666', border: 'none', cursor: 'pointer', lineHeight: 1 }}
          title="Remove animation"
        >
          &times;
        </button>
      </div>

      {expanded && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            <div>
              <label style={labelStyle}>Type</label>
              <select
                value={animation.type}
                onChange={(e) => {
                  const newType = e.target.value;
                  const newEffects = getEffectsForType(newType);
                  const updates: any = { type: newType };
                  if (newType === 'keyframe') {
                    updates.effect = undefined;
                    if (!animation.keyframes) {
                      updates.keyframes = [
                        { frame: 0, properties: { opacity: 1 } },
                        { frame: animation.duration || 30, properties: { opacity: 1 } },
                      ];
                    }
                  } else {
                    updates.effect = newEffects[0] || 'fadeIn';
                    updates.keyframes = undefined;
                  }
                  onChange(updates);
                }}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="entrance">Entrance</option>
                <option value="exit">Exit</option>
                <option value="emphasis">Emphasis</option>
                <option value="keyframe">Keyframe</option>
              </select>
            </div>

            {animation.type !== 'keyframe' && (
              <div>
                <label style={labelStyle}>Effect</label>
                <select
                  value={animation.effect || ''}
                  onChange={(e) => onChange({ effect: e.target.value })}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  {effects.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '6px' }}>
            <div>
              <label style={labelStyle}>Duration (frames)</label>
              <input
                type="number"
                min={1}
                value={animation.duration || 30}
                onChange={(e) => onChange({ duration: parseInt(e.target.value) || 1 })}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Delay (frames)</label>
              <input
                type="number"
                min={0}
                value={animation.delay || 0}
                onChange={(e) => onChange({ delay: parseInt(e.target.value) || 0 })}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginTop: '6px' }}>
            <label style={labelStyle}>Easing</label>
            <select
              value={animation.easing || ''}
              onChange={(e) => onChange({ easing: e.target.value || undefined })}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="">Default</option>
              {EASING_OPTIONS.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>

          {animation.type === 'emphasis' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '6px' }}>
              <div>
                <label style={labelStyle}>Loop</label>
                <input
                  type="number"
                  min={-1}
                  value={animation.loop ?? 1}
                  onChange={(e) => onChange({ loop: parseInt(e.target.value) })}
                  style={inputStyle}
                  title="-1 for infinite"
                />
              </div>
              <div>
                <label style={labelStyle}>Alternate</label>
                <select
                  value={animation.alternate ? 'yes' : 'no'}
                  onChange={(e) => onChange({ alternate: e.target.value === 'yes' })}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
            </div>
          )}

          {animation.type === 'keyframe' && animation.keyframes && (
            <div style={{ marginTop: '8px' }}>
              <label style={{ ...labelStyle, fontWeight: 600 }}>Keyframes</label>
              {animation.keyframes.map((kf: any, ki: number) => (
                <div key={ki} style={{ display: 'flex', gap: '4px', alignItems: 'center', marginBottom: '4px' }}>
                  <input
                    type="number"
                    value={kf.frame}
                    min={0}
                    onChange={(e) => {
                      const kfs = [...animation.keyframes];
                      kfs[ki] = { ...kfs[ki], frame: parseInt(e.target.value) || 0 };
                      onChange({ keyframes: kfs });
                    }}
                    style={{ ...inputStyle, width: '50px' }}
                    title="Frame"
                  />
                  <input
                    type="text"
                    value={JSON.stringify(kf.properties || {})}
                    onChange={(e) => {
                      try {
                        const props = JSON.parse(e.target.value);
                        const kfs = [...animation.keyframes];
                        kfs[ki] = { ...kfs[ki], properties: props };
                        onChange({ keyframes: kfs });
                      } catch { /* invalid json, ignore */ }
                    }}
                    style={{ ...inputStyle, flex: 1, fontFamily: 'monospace', fontSize: '10px' }}
                    title="Properties JSON"
                  />
                  <button
                    onClick={() => {
                      const kfs = animation.keyframes.filter((_: any, i: number) => i !== ki);
                      onChange({ keyframes: kfs });
                    }}
                    style={{ padding: '0 4px', fontSize: '12px', backgroundColor: 'transparent', color: '#666', border: 'none', cursor: 'pointer' }}
                  >
                    &times;
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const lastFrame = animation.keyframes.length > 0 ? animation.keyframes[animation.keyframes.length - 1].frame + 10 : 0;
                  onChange({ keyframes: [...animation.keyframes, { frame: lastFrame, properties: { opacity: 1 } }] });
                }}
                style={{ ...addBtnStyle, marginTop: '4px' }}
              >
                + Add Keyframe
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
