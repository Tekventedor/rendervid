/**
 * Type declarations for window extensions in the browser context
 */

import type { Template } from '@rendervid/core';

declare global {
  interface Window {
    RENDERVID_TEMPLATE: Template;
    RENDERVID_INPUTS: Record<string, unknown>;
    RENDERVID_CURRENT_FRAME: number;
    RENDERVID_READY: boolean;
    __rendervidRenderFrame?: (frame: number) => void;
    __rendervidRoot?: unknown;
    renderFrame?: (frame: number) => void;
  }
}

export {};
