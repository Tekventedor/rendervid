import React, { useRef, useEffect, useCallback } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { keymap } from '@codemirror/view';

interface CodeEditorDialogProps {
  isOpen: boolean;
  code: string;
  componentName: string;
  onSave: (code: string) => void;
  onClose: () => void;
}

export function CodeEditorDialog({ isOpen, code, componentName, onSave, onClose }: CodeEditorDialogProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  const handleSave = useCallback(() => {
    if (viewRef.current) {
      onSave(viewRef.current.state.doc.toString());
    }
  }, [onSave]);

  useEffect(() => {
    if (!isOpen || !editorRef.current) return;

    const view = new EditorView({
      doc: code,
      extensions: [
        basicSetup,
        javascript({ jsx: true }),
        oneDark,
        keymap.of([
          {
            key: 'Mod-s',
            run: () => {
              if (viewRef.current) {
                onSave(viewRef.current.state.doc.toString());
              }
              return true;
            },
          },
        ]),
        EditorView.theme({
          '&': { height: '100%' },
          '.cm-scroller': { overflow: 'auto' },
        }),
      ],
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [isOpen, code, onSave]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '90vw',
          height: '80vh',
          backgroundColor: '#1e1e1e',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderBottom: '1px solid #333',
            flexShrink: 0,
          }}
        >
          <span style={{ color: '#ccc', fontSize: '13px', fontWeight: 600 }}>
            {componentName}
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleSave}
              style={{
                padding: '6px 16px',
                backgroundColor: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Save
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '6px 16px',
                backgroundColor: '#444',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>

        {/* Editor */}
        <div ref={editorRef} style={{ flex: 1, minHeight: 0, overflow: 'auto' }} />
      </div>
    </div>
  );
}
