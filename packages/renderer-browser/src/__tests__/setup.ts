import { beforeAll, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import React from 'react';

// Polyfill for React 19 compatibility with react-reconciler
if (!React.internals) {
  (React as any).internals = {
    ReactCurrentOwner: { current: null },
    ReactCurrentDispatcher: { current: null },
  };
}

// Also set __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED for compatibility
if (!(React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
  (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {
    ReactCurrentOwner: { current: null },
    ReactCurrentDispatcher: { current: null },
  };
}

// Mock WebGL context
beforeAll(() => {
  // Mock HTMLCanvasElement.getContext for WebGL
  HTMLCanvasElement.prototype.getContext = vi.fn((contextType: string) => {
    if (contextType === 'webgl' || contextType === 'webgl2') {
      return {
        canvas: document.createElement('canvas'),
        getExtension: vi.fn(),
        getParameter: vi.fn(),
        createTexture: vi.fn(),
        bindTexture: vi.fn(),
        texImage2D: vi.fn(),
        texParameteri: vi.fn(),
        viewport: vi.fn(),
        clearColor: vi.fn(),
        clear: vi.fn(),
        enable: vi.fn(),
        disable: vi.fn(),
        createProgram: vi.fn(),
        createShader: vi.fn(),
        shaderSource: vi.fn(),
        compileShader: vi.fn(),
        attachShader: vi.fn(),
        linkProgram: vi.fn(),
        useProgram: vi.fn(),
        getProgramParameter: vi.fn(() => true),
        getShaderParameter: vi.fn(() => true),
        getUniformLocation: vi.fn(),
        getAttribLocation: vi.fn(),
        uniformMatrix4fv: vi.fn(),
        uniform1i: vi.fn(),
        uniform1f: vi.fn(),
        uniform3fv: vi.fn(),
        enableVertexAttribArray: vi.fn(),
        vertexAttribPointer: vi.fn(),
        createBuffer: vi.fn(),
        bindBuffer: vi.fn(),
        bufferData: vi.fn(),
        drawArrays: vi.fn(),
        drawElements: vi.fn(),
      } as any;
    }
    return null;
  });

  // Mock WebGL availability check
  global.WebGLRenderingContext = function() {} as any;
  global.WebGL2RenderingContext = function() {} as any;

  // Mock ResizeObserver for react-use-measure
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;
});

afterEach(() => {
  // Cleanup after each test
  vi.clearAllMocks();
});
