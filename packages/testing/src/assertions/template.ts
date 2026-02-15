import type { Template } from '@rendervid/core';
import { validateTemplate, validateInputs } from '@rendervid/core';

/**
 * Assert that a template is valid. Throws with detailed error information if invalid.
 */
export function expectValidTemplate(template: unknown): void {
  const result = validateTemplate(template);
  if (!result.valid) {
    const errorDetails = result.errors
      .map((e) => `  [${e.code}] ${e.message} (at ${e.path})`)
      .join('\n');
    throw new Error(
      `Expected template to be valid, but found ${result.errors.length} error(s):\n${errorDetails}`
    );
  }
}

/**
 * Assert that a template is invalid. Optionally check for specific error codes.
 */
export function expectInvalidTemplate(
  template: unknown,
  errorCodes?: string[]
): void {
  const result = validateTemplate(template);
  if (result.valid) {
    throw new Error('Expected template to be invalid, but it passed validation');
  }

  if (errorCodes && errorCodes.length > 0) {
    const foundCodes = result.errors.map((e) => e.code);
    for (const code of errorCodes) {
      if (!foundCodes.includes(code)) {
        throw new Error(
          `Expected error code "${code}" but found: [${foundCodes.join(', ')}]`
        );
      }
    }
  }
}

/**
 * Assert that a set of inputs is valid for a given template.
 */
export function expectValidInputs(
  template: Template,
  inputs: Record<string, unknown>
): void {
  const result = validateInputs(template, inputs);
  if (!result.valid) {
    const errorDetails = result.errors
      .map((e) => `  [${e.code}] ${e.message} (at ${e.path})`)
      .join('\n');
    throw new Error(
      `Expected inputs to be valid, but found ${result.errors.length} error(s):\n${errorDetails}`
    );
  }
}

/**
 * Assert that a set of inputs is invalid for a given template.
 * Optionally check for specific error codes.
 */
export function expectInvalidInputs(
  template: Template,
  inputs: Record<string, unknown>,
  errorCodes?: string[]
): void {
  const result = validateInputs(template, inputs);
  if (result.valid) {
    throw new Error('Expected inputs to be invalid, but they passed validation');
  }

  if (errorCodes && errorCodes.length > 0) {
    const foundCodes = result.errors.map((e) => e.code);
    for (const code of errorCodes) {
      if (!foundCodes.includes(code)) {
        throw new Error(
          `Expected error code "${code}" but found: [${foundCodes.join(', ')}]`
        );
      }
    }
  }
}

/**
 * Assert that a layer with a specific ID exists in the template.
 * Searches across all scenes and nested group layers.
 */
export function expectLayerExists(template: Template, layerId: string): void {
  for (const scene of template.composition.scenes) {
    if (findLayerById(scene.layers, layerId)) {
      return;
    }
  }
  throw new Error(
    `Expected layer with id "${layerId}" to exist in template, but it was not found`
  );
}

/**
 * Assert that a template has an exact number of scenes.
 */
export function expectSceneCount(template: Template, count: number): void {
  const actual = template.composition.scenes.length;
  if (actual !== count) {
    throw new Error(
      `Expected template to have ${count} scene(s), but found ${actual}`
    );
  }
}

/**
 * Recursively search for a layer by ID.
 */
function findLayerById(
  layers: Template['composition']['scenes'][0]['layers'],
  layerId: string
): boolean {
  for (const layer of layers) {
    if (layer.id === layerId) return true;
    if ('children' in layer && layer.children) {
      if (findLayerById(layer.children, layerId)) return true;
    }
  }
  return false;
}
