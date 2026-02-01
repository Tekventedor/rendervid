import React from 'react';
import type { Layer, Scene } from '@rendervid/core';

export interface LayerRendererProps {
  /** The layer to render */
  layer: Layer;
  /** Current frame number */
  frame: number;
  /** Current scene */
  scene: Scene;
  /** Custom render function */
  customRender?: (layer: Layer, frame: number) => React.ReactNode;
}

/**
 * Get layer styles based on layer properties
 */
function getLayerStyles(layer: Layer): React.CSSProperties {
  const styles: React.CSSProperties = {
    position: 'absolute',
    left: layer.position.x,
    top: layer.position.y,
    width: layer.size.width,
    height: layer.size.height,
  };

  if (layer.rotation) {
    styles.transform = `rotate(${layer.rotation}deg)`;
  }

  if (layer.opacity !== undefined) {
    styles.opacity = layer.opacity;
  }

  if (layer.scale) {
    const scaleX = layer.scale.x ?? 1;
    const scaleY = layer.scale.y ?? 1;
    const existingTransform = styles.transform || '';
    styles.transform = `${existingTransform} scale(${scaleX}, ${scaleY})`.trim();
  }

  if (layer.blendMode) {
    styles.mixBlendMode = layer.blendMode as React.CSSProperties['mixBlendMode'];
  }

  return styles;
}

/**
 * Render an image layer
 */
function renderImageLayer(layer: Layer): React.ReactNode {
  if (layer.type !== 'image') return null;

  const props = layer.props as { src: string; fit?: string; alt?: string };

  return (
    <img
      src={props.src}
      alt={props.alt || ''}
      style={{
        width: '100%',
        height: '100%',
        objectFit: (props.fit || 'cover') as React.CSSProperties['objectFit'],
      }}
    />
  );
}

/**
 * Render a video layer
 */
function renderVideoLayer(layer: Layer, frame: number): React.ReactNode {
  if (layer.type !== 'video') return null;

  const props = layer.props as {
    src: string;
    volume?: number;
    loop?: boolean;
    muted?: boolean;
    fit?: string;
  };

  // Note: In preview mode, we just show a placeholder or first frame
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#1a1a2e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: '14px',
      }}
    >
      <span>Video: {props.src.split('/').pop()}</span>
    </div>
  );
}

/**
 * Render a text layer
 */
function renderTextLayer(layer: Layer): React.ReactNode {
  if (layer.type !== 'text') return null;

  const props = layer.props as {
    text: string;
    fontSize?: number;
    fontWeight?: string;
    color?: string;
    textAlign?: string;
    verticalAlign?: string;
    fontFamily?: string;
    lineHeight?: number;
    letterSpacing?: number;
  };

  const textStyles: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: props.verticalAlign === 'top' ? 'flex-start' :
                props.verticalAlign === 'bottom' ? 'flex-end' : 'center',
    justifyContent: props.textAlign === 'left' ? 'flex-start' :
                    props.textAlign === 'right' ? 'flex-end' : 'center',
    fontSize: props.fontSize || 16,
    fontWeight: props.fontWeight || 'normal',
    color: props.color || '#ffffff',
    fontFamily: props.fontFamily || 'inherit',
    lineHeight: props.lineHeight,
    letterSpacing: props.letterSpacing,
    textAlign: (props.textAlign || 'center') as React.CSSProperties['textAlign'],
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  };

  return <div style={textStyles}>{props.text}</div>;
}

/**
 * Render a shape layer
 */
function renderShapeLayer(layer: Layer): React.ReactNode {
  if (layer.type !== 'shape') return null;

  const props = layer.props as {
    shape: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    borderRadius?: number;
  };

  const shapeStyles: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: props.fill || 'transparent',
    border: props.stroke ? `${props.strokeWidth || 1}px solid ${props.stroke}` : 'none',
    borderRadius: props.shape === 'circle' ? '50%' : props.borderRadius || 0,
  };

  return <div style={shapeStyles} />;
}

/**
 * Render a group layer
 */
function renderGroupLayer(
  layer: Layer,
  frame: number,
  scene: Scene,
  customRender?: (layer: Layer, frame: number) => React.ReactNode
): React.ReactNode {
  if (layer.type !== 'group' || !layer.children) return null;

  const props = layer.props as { clip?: boolean };

  const groupStyles: React.CSSProperties = {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: props.clip ? 'hidden' : 'visible',
  };

  return (
    <div style={groupStyles}>
      {layer.children.map((child) => (
        <LayerRenderer
          key={child.id}
          layer={child}
          frame={frame}
          scene={scene}
          customRender={customRender}
        />
      ))}
    </div>
  );
}

/**
 * Render an audio layer (placeholder - audio handled separately)
 */
function renderAudioLayer(layer: Layer): React.ReactNode {
  if (layer.type !== 'audio') return null;

  // Audio layers are not visually rendered
  return null;
}

/**
 * Render a lottie layer (placeholder)
 */
function renderLottieLayer(layer: Layer): React.ReactNode {
  if (layer.type !== 'lottie') return null;

  const props = layer.props as { data: string };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#3b82f6',
        fontSize: '14px',
        border: '1px dashed #3b82f6',
        borderRadius: '4px',
      }}
    >
      <span>Lottie Animation</span>
    </div>
  );
}

/**
 * Render a custom layer
 */
function renderCustomLayer(layer: Layer): React.ReactNode {
  if (layer.type !== 'custom') return null;

  const component = layer.customComponent;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#8b5cf6',
        fontSize: '14px',
        border: '1px dashed #8b5cf6',
        borderRadius: '4px',
      }}
    >
      <span>Custom: {component?.name || 'Unknown'}</span>
    </div>
  );
}

/**
 * Component for rendering individual layers
 */
export function LayerRenderer({
  layer,
  frame,
  scene,
  customRender,
}: LayerRendererProps): React.ReactElement | null {
  // Use custom render if provided
  if (customRender) {
    const customResult = customRender(layer, frame);
    if (customResult) {
      return (
        <div style={getLayerStyles(layer)}>{customResult}</div>
      );
    }
  }

  const styles = getLayerStyles(layer);
  let content: React.ReactNode = null;

  switch (layer.type) {
    case 'image':
      content = renderImageLayer(layer);
      break;
    case 'video':
      content = renderVideoLayer(layer, frame);
      break;
    case 'text':
      content = renderTextLayer(layer);
      break;
    case 'shape':
      content = renderShapeLayer(layer);
      break;
    case 'audio':
      content = renderAudioLayer(layer);
      break;
    case 'group':
      content = renderGroupLayer(layer, frame, scene, customRender);
      break;
    case 'lottie':
      content = renderLottieLayer(layer);
      break;
    case 'custom':
      content = renderCustomLayer(layer);
      break;
    default:
      content = (
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ff0000',
          }}
        >
          Unknown layer type
        </div>
      );
  }

  if (content === null) {
    return null;
  }

  return <div style={styles}>{content}</div>;
}
