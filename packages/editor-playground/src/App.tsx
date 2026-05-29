import { useState, useEffect, useRef } from 'react';
import { VideoEditor } from '@rendervid/editor';
import '@rendervid/editor/styles.css';
import { allTemplates, categories } from './templates';
import type { Template } from '@rendervid/core';

function formatCategory(name: string): string {
  return name.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function App() {
  const [selectedId, setSelectedId] = useState(allTemplates[0]?.id ?? '');
  const [droppedTemplate, setDroppedTemplate] = useState<Template | null>(null);
  const [droppedName, setDroppedName] = useState<string>('');
  const [dragOver, setDragOver] = useState(false);
  const [dropError, setDropError] = useState<string | null>(null);
  const dragCounter = useRef(0);

  // Whole-window drag-and-drop — drop a template.json anywhere on the page.
  useEffect(() => {
    const onDragEnter = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer?.types.includes('Files')) {
        dragCounter.current += 1;
        setDragOver(true);
      }
    };
    const onDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current -= 1;
      if (dragCounter.current <= 0) {
        dragCounter.current = 0;
        setDragOver(false);
      }
    };
    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
    };
    const onDrop = async (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current = 0;
      setDragOver(false);
      setDropError(null);

      const files = Array.from(e.dataTransfer?.files ?? []);
      if (files.length === 0) return;
      const file = files[0]; // first file wins

      try {
        const text = await file.text();
        const json = JSON.parse(text);
        if (!json.output || (!json.composition && !json.scenes)) {
          throw new Error(
            'Not a valid template — missing "output" or "composition" (or top-level "scenes").',
          );
        }
        // If the file has top-level scenes but no composition, wrap it for the editor.
        if (json.scenes && !json.composition) {
          json.composition = { scenes: json.scenes };
        }
        setDroppedTemplate(json as Template);
        setDroppedName(file.name);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setDropError(`Failed to load ${file.name}: ${msg}`);
        setTimeout(() => setDropError(null), 6000);
      }
    };

    window.addEventListener('dragenter', onDragEnter);
    window.addEventListener('dragleave', onDragLeave);
    window.addEventListener('dragover', onDragOver);
    window.addEventListener('drop', onDrop);
    return () => {
      window.removeEventListener('dragenter', onDragEnter);
      window.removeEventListener('dragleave', onDragLeave);
      window.removeEventListener('dragover', onDragOver);
      window.removeEventListener('drop', onDrop);
    };
  }, []);

  const entry = allTemplates.find((e) => e.id === selectedId) ?? allTemplates[0];
  const baseTemplate = entry?.template;
  const template = droppedTemplate ?? baseTemplate;

  if (!template) {
    return (
      <div style={{ padding: 40, color: '#fff' }}>
        No templates found in examples/. Drop a <code>template.json</code> onto the window to load
        one.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 16px',
          backgroundColor: '#09090b',
          borderBottom: '1px solid #27272a',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#a1a1aa' }}>
          Editor Playground
        </span>
        {droppedTemplate ? (
          <>
            <span
              style={{
                padding: '4px 10px',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: '#1d4ed8',
                color: '#fff',
                borderRadius: '4px',
              }}
              title={droppedName}
            >
              📂 {droppedName}
            </span>
            <button
              onClick={() => {
                setDroppedTemplate(null);
                setDroppedName('');
              }}
              style={{
                padding: '4px 10px',
                fontSize: '12px',
                backgroundColor: '#27272a',
                color: '#fff',
                border: '1px solid #3f3f46',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              ✕ Clear dropped
            </button>
          </>
        ) : (
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            style={{
              padding: '4px 8px',
              fontSize: '13px',
              backgroundColor: '#27272a',
              color: '#fff',
              border: '1px solid #3f3f46',
              borderRadius: '4px',
              cursor: 'pointer',
              maxWidth: '400px',
            }}
          >
            {categories.map((group) => (
              <optgroup key={group.category} label={formatCategory(group.category)}>
                {group.entries.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.template.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        )}
        <span style={{ fontSize: '12px', color: '#71717a' }}>
          {template.output.width}x{template.output.height}
          {template.output.fps ? ` @ ${template.output.fps}fps` : ' (image)'}
        </span>
        <span style={{ fontSize: '12px', color: '#52525b', marginLeft: 'auto' }}>
          {droppedTemplate ? 'dropped' : `${allTemplates.length} templates`} · drop a{' '}
          <code>template.json</code> anywhere
        </span>
      </div>

      {/* Editor */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <VideoEditor
          key={droppedTemplate ? `dropped:${droppedName}` : selectedId}
          template={template}
          config={{ enableHistory: true, theme: 'dark' }}
          callbacks={{
            onSave: (t) => {
              console.log('[onSave]', t);
            },
            onChange: (t) => {
              console.log('[onChange]', t.name);
            },
            onError: (err) => {
              console.error('[onError]', err);
            },
          }}
          width="100%"
          height="100%"
        />
      </div>

      {/* Drag-over overlay */}
      {dragOver && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(29, 78, 216, 0.18)',
            backdropFilter: 'blur(2px)',
            border: '4px dashed #3b82f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              padding: '32px 48px',
              backgroundColor: '#1e293b',
              color: '#fff',
              borderRadius: '12px',
              fontSize: '20px',
              fontWeight: 600,
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            Drop template.json to load it
          </div>
        </div>
      )}

      {/* Drop error toast */}
      {dropError && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '12px 20px',
            backgroundColor: '#7f1d1d',
            color: '#fff',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 500,
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            zIndex: 10000,
            maxWidth: '600px',
          }}
        >
          {dropError}
        </div>
      )}
    </div>
  );
}
