import { useState } from 'react';
import { VideoEditor } from '@rendervid/editor';
import '@rendervid/editor/styles.css';
import { allTemplates, categories } from './templates';

function formatCategory(name: string): string {
  return name.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function App() {
  const [selectedId, setSelectedId] = useState(allTemplates[0]?.id ?? '');
  const entry = allTemplates.find((e) => e.id === selectedId) ?? allTemplates[0];
  const template = entry?.template;

  if (!template) {
    return <div style={{ padding: 40, color: '#fff' }}>No templates found in examples/</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
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
        <span style={{ fontSize: '12px', color: '#71717a' }}>
          {template.output.width}x{template.output.height}
          {template.output.fps ? ` @ ${template.output.fps}fps` : ' (image)'}
        </span>
        <span style={{ fontSize: '12px', color: '#52525b', marginLeft: 'auto' }}>
          {allTemplates.length} templates
        </span>
      </div>

      {/* Editor */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <VideoEditor
          key={selectedId}
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
    </div>
  );
}
