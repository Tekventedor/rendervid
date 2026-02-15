/**
 * Custom vitest matcher declarations for @rendervid/testing.
 *
 * To use these matchers, add this to your tsconfig.json:
 *   "types": ["@rendervid/testing/vitest-matchers"]
 *
 * Or add a triple-slash reference in your test setup file:
 *   /// <reference types="@rendervid/testing/vitest-matchers" />
 */

import 'vitest';

declare module 'vitest' {
  interface Assertion<T> {
    /** Assert that a template passes validation */
    toBeValidTemplate(): void;
    /** Assert that a template fails validation, optionally checking for specific error codes */
    toBeInvalidTemplate(errorCodes?: string[]): void;
    /** Assert that a layer with the given ID exists in the template */
    toHaveLayer(layerId: string): void;
    /** Assert that the template has a specific number of scenes */
    toHaveSceneCount(count: number): void;
    /** Assert that the layer has an animation on the given property */
    toHaveAnimationProperty(property: string): void;
  }

  interface AsymmetricMatchersContaining {
    toBeValidTemplate(): void;
    toBeInvalidTemplate(errorCodes?: string[]): void;
    toHaveLayer(layerId: string): void;
    toHaveSceneCount(count: number): void;
    toHaveAnimationProperty(property: string): void;
  }
}
