import type { Template, Layer } from '@rendervid/core';
import {
  expectValidTemplate,
  expectInvalidTemplate,
  expectLayerExists,
  expectSceneCount,
} from '../assertions/template';
import { expectAnimationProperty } from '../assertions/animation';

/**
 * Rendervid vitest plugin that registers custom matchers for template and animation testing.
 *
 * @example
 * ```typescript
 * // vitest.config.ts
 * import { rendervidPlugin } from '@rendervid/testing';
 *
 * export default defineConfig({
 *   test: {
 *     setupFiles: ['./setup.ts'],
 *   },
 * });
 *
 * // setup.ts
 * import { rendervidPlugin } from '@rendervid/testing';
 * const plugin = rendervidPlugin();
 * plugin.setup();
 * ```
 */
export function rendervidPlugin() {
  return {
    name: 'rendervid',

    /**
     * Call this in your vitest setup file to register custom matchers.
     */
    setup() {
      // Dynamic import to avoid requiring vitest at module load time
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { expect } = require('vitest');

      expect.extend({
        toBeValidTemplate(received: unknown) {
          try {
            expectValidTemplate(received);
            return {
              message: () => 'Expected template to be invalid, but it passed validation',
              pass: true,
            };
          } catch (error) {
            return {
              message: () =>
                (error as Error).message || 'Template validation failed',
              pass: false,
            };
          }
        },

        toBeInvalidTemplate(received: unknown, errorCodes?: string[]) {
          try {
            expectInvalidTemplate(received, errorCodes);
            return {
              message: () => 'Expected template to be valid, but it was invalid',
              pass: true,
            };
          } catch (error) {
            return {
              message: () =>
                (error as Error).message || 'Template was unexpectedly valid',
              pass: false,
            };
          }
        },

        toHaveLayer(received: unknown, layerId: string) {
          try {
            expectLayerExists(received as Template, layerId);
            return {
              message: () =>
                `Expected template not to have layer "${layerId}", but it was found`,
              pass: true,
            };
          } catch (error) {
            return {
              message: () =>
                (error as Error).message || `Layer "${layerId}" not found`,
              pass: false,
            };
          }
        },

        toHaveSceneCount(received: unknown, count: number) {
          try {
            expectSceneCount(received as Template, count);
            return {
              message: () =>
                `Expected template not to have ${count} scene(s)`,
              pass: true,
            };
          } catch (error) {
            return {
              message: () =>
                (error as Error).message || `Scene count mismatch`,
              pass: false,
            };
          }
        },

        toHaveAnimationProperty(received: unknown, property: string) {
          try {
            expectAnimationProperty(received as Layer, property);
            return {
              message: () =>
                `Expected layer not to have animation on property "${property}"`,
              pass: true,
            };
          } catch (error) {
            return {
              message: () =>
                (error as Error).message ||
                `Animation property "${property}" not found`,
              pass: false,
            };
          }
        },
      });
    },
  };
}
