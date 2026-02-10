import React, { useState, useRef, useCallback } from 'react';
import type { Template } from '@rendervid/core';
import { exportAnimatedSvg } from '@rendervid/core';
import {
  createBrowserRenderer,
  downloadBlob,
  isWebCodecsSupported,
  type RenderProgress,
  type BrowserRendererOptions,
} from '@rendervid/renderer-browser';
import { buildRegistry } from '../Preview/Preview';

export interface ExportDialogProps {
  template: Template;
  inputValues: Record<string, unknown>;
  onClose: () => void;
}

type ExportFormat = 'mp4' | 'webm' | 'svg';
type ExportState = 'idle' | 'exporting' | 'done' | 'error';

export function ExportDialog({ template, inputValues, onClose }: ExportDialogProps) {
  const [format, setFormat] = useState<ExportFormat>(isWebCodecsSupported() ? 'mp4' : 'webm');
  const [state, setState] = useState<ExportState>('idle');
  const [progress, setProgress] = useState<RenderProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState<number>(0);
  const rendererRef = useRef<ReturnType<typeof createBrowserRenderer> | null>(null);

  const webCodecsAvailable = isWebCodecsSupported();

  const handleExport = useCallback(async () => {
    setState('exporting');
    setError(null);
    setProgress(null);

    try {
      const registry = buildRegistry(template.customComponents);
      const opts: BrowserRendererOptions = {
        registry,
        preferWebCodecs: format === 'mp4',
      };
      const renderer = createBrowserRenderer(opts);
      rendererRef.current = renderer;

      const videoFormat = format as 'mp4' | 'webm';
      const result = await renderer.renderVideo({
        template,
        inputs: inputValues,
        format: videoFormat,
        onProgress: (p) => setProgress(p),
      });

      setResultSize(result.size);
      setState('done');

      const ext = format === 'mp4' ? 'mp4' : 'webm';
      const filename = `${template.name || 'video'}.${ext}`.replace(/\s+/g, '-').toLowerCase();
      downloadBlob(result.blob, filename);

      renderer.dispose();
      rendererRef.current = null;
    } catch (err) {
      setState('error');
      setError(err instanceof Error ? err.message : String(err));
      rendererRef.current?.dispose();
      rendererRef.current = null;
    }
  }, [template, inputValues, format]);

  const handleExportSvg = useCallback(() => {
    try {
      const result = exportAnimatedSvg(template, inputValues);
      const blob = new Blob([result.svg], { type: 'image/svg+xml' });
      setResultSize(blob.size);
      setState('done');
      const filename = `${template.name || 'animation'}.svg`.replace(/\s+/g, '-').toLowerCase();
      downloadBlob(blob, filename);
      if (result.unsupportedLayers.length > 0) {
        const names = result.unsupportedLayers.map(l => `${l.name || l.id} (${l.type})`).join(', ');
        console.warn(`SVG export skipped unsupported layers: ${names}`);
      }
    } catch (err) {
      setState('error');
      setError(err instanceof Error ? err.message : String(err));
    }
  }, [template, inputValues]);

  const handleExportImage = useCallback(async () => {
    setState('exporting');
    setError(null);

    try {
      const registry = buildRegistry(template.customComponents);
      const renderer = createBrowserRenderer({ registry });
      rendererRef.current = renderer;

      const result = await renderer.renderImage({
        template,
        inputs: inputValues,
        frame: 0,
        format: 'png',
      });

      setResultSize(result.size);
      setState('done');

      const filename = `${template.name || 'frame'}.png`.replace(/\s+/g, '-').toLowerCase();
      downloadBlob(result.blob, filename);

      renderer.dispose();
      rendererRef.current = null;
    } catch (err) {
      setState('error');
      setError(err instanceof Error ? err.message : String(err));
      rendererRef.current?.dispose();
      rendererRef.current = null;
    }
  }, [template, inputValues]);

  const progressPercent = progress ? Math.round(progress.percentage) : 0;
  const eta = progress?.estimatedTimeRemaining;

  return (
    <div style={overlayStyle} onClick={(e) => { if (e.target === e.currentTarget && state !== 'exporting') onClose(); }}>
      <div style={dialogStyle}>
        <div style={headerStyle}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Export Video</h3>
          {state !== 'exporting' && (
            <button onClick={onClose} style={closeButtonStyle} title="Close">X</button>
          )}
        </div>

        {state === 'idle' && (
          <>
            {/* Template info */}
            <div style={sectionStyle}>
              <div style={labelStyle}>Template</div>
              <div style={{ fontSize: '13px', color: '#ccc' }}>{template.name}</div>
              <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                {template.output.width}x{template.output.height} @ {template.output.fps || 30}fps
                {' '} ({((template.output.duration || 0) || ((getTotalFrames(template)) / (template.output.fps || 30))).toFixed(1)}s)
              </div>
            </div>

            {/* Format selection */}
            <div style={sectionStyle}>
              <div style={labelStyle}>Format</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setFormat('mp4')}
                  style={{
                    ...formatButtonStyle,
                    ...(format === 'mp4' ? formatButtonActiveStyle : {}),
                    opacity: webCodecsAvailable ? 1 : 0.5,
                  }}
                  disabled={!webCodecsAvailable}
                  title={webCodecsAvailable ? 'MP4 (H.264) via WebCodecs' : 'WebCodecs not supported in this browser'}
                >
                  MP4
                </button>
                <button
                  onClick={() => setFormat('webm')}
                  style={{
                    ...formatButtonStyle,
                    ...(format === 'webm' ? formatButtonActiveStyle : {}),
                  }}
                >
                  WebM
                </button>
                <button
                  onClick={() => setFormat('svg')}
                  style={{
                    ...formatButtonStyle,
                    ...(format === 'svg' ? formatButtonActiveStyle : {}),
                  }}
                >
                  SVG
                </button>
              </div>
              <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                {format === 'mp4' ? 'H.264 via WebCodecs - best compatibility' : format === 'webm' ? 'VP9 via MediaRecorder - browser native' : 'Animated SVG - lightweight, scalable, CSS animations'}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button onClick={format === 'svg' ? handleExportSvg : handleExport} style={exportButtonStyle}>
                {format === 'svg' ? 'Export SVG' : 'Export Video'}
              </button>
              <button onClick={handleExportImage} style={imageButtonStyle}>
                Export Frame (PNG)
              </button>
            </div>
          </>
        )}

        {state === 'exporting' && progress && (
          <div style={sectionStyle}>
            <div style={{ fontSize: '13px', color: '#ccc', marginBottom: '8px' }}>
              {progress.phase === 'capturing' && `Rendering frames... ${progressPercent}%`}
              {progress.phase === 'encoding' && 'Encoding...'}
              {progress.phase === 'muxing' && 'Creating file...'}
              {progress.phase === 'complete' && 'Complete!'}
            </div>

            {/* Progress bar */}
            <div style={progressBarBgStyle}>
              <div style={{ ...progressBarFillStyle, width: `${progressPercent}%` }} />
            </div>

            <div style={{ fontSize: '11px', color: '#888', marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Frame {progress.currentFrame} / {progress.totalFrames}</span>
              {eta !== undefined && eta > 0 && <span>~{Math.ceil(eta)}s remaining</span>}
            </div>
          </div>
        )}

        {state === 'exporting' && !progress && (
          <div style={sectionStyle}>
            <div style={{ fontSize: '13px', color: '#ccc' }}>Preparing...</div>
          </div>
        )}

        {state === 'done' && (
          <div style={sectionStyle}>
            <div style={{ fontSize: '14px', color: '#4ade80', marginBottom: '8px' }}>Export complete!</div>
            <div style={{ fontSize: '12px', color: '#888' }}>
              File size: {(resultSize / 1024 / 1024).toFixed(2)} MB
            </div>
            <button onClick={onClose} style={{ ...exportButtonStyle, marginTop: '12px' }}>
              Close
            </button>
          </div>
        )}

        {state === 'error' && (
          <div style={sectionStyle}>
            <div style={{ fontSize: '14px', color: '#f87171', marginBottom: '8px' }}>Export failed</div>
            <div style={{ fontSize: '12px', color: '#888', wordBreak: 'break-word' }}>{error}</div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button onClick={() => setState('idle')} style={exportButtonStyle}>Try Again</button>
              <button onClick={onClose} style={imageButtonStyle}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getTotalFrames(template: Template): number {
  const scenes = template.composition.scenes as any[];
  if (scenes.length === 0) return 0;
  return Math.max(...scenes.map((s: any) => s.endFrame || 0));
}

// Styles
const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10000,
};

const dialogStyle: React.CSSProperties = {
  backgroundColor: '#2a2a2a',
  borderRadius: '12px',
  padding: '20px',
  width: '400px',
  maxWidth: '90vw',
  color: '#fff',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '16px',
};

const closeButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#888',
  fontSize: '14px',
  cursor: 'pointer',
  padding: '4px 8px',
};

const sectionStyle: React.CSSProperties = {
  marginBottom: '12px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '11px',
  color: '#888',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: '6px',
};

const formatButtonStyle: React.CSSProperties = {
  padding: '8px 20px',
  fontSize: '13px',
  backgroundColor: '#333',
  color: '#ccc',
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: '#555',
  borderRadius: '6px',
  cursor: 'pointer',
};

const formatButtonActiveStyle: React.CSSProperties = {
  backgroundColor: '#1a4d8c',
  color: '#fff',
  borderColor: '#3b82f6',
};

const exportButtonStyle: React.CSSProperties = {
  padding: '10px 24px',
  fontSize: '13px',
  fontWeight: 600,
  backgroundColor: '#00aa00',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

const imageButtonStyle: React.CSSProperties = {
  padding: '10px 24px',
  fontSize: '13px',
  backgroundColor: '#444',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

const progressBarBgStyle: React.CSSProperties = {
  width: '100%',
  height: '6px',
  backgroundColor: '#444',
  borderRadius: '3px',
  overflow: 'hidden',
};

const progressBarFillStyle: React.CSSProperties = {
  height: '100%',
  backgroundColor: '#3b82f6',
  borderRadius: '3px',
  transition: 'width 0.2s ease',
};
