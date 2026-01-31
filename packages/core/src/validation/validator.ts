import Ajv, { type ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';
import type { Template, InputDefinition } from '../types';
import { templateSchema } from './schema';

/**
 * Validation error.
 */
export interface ValidationError {
  /** Error code */
  code: string;
  /** Human-readable message */
  message: string;
  /** JSON path to error location */
  path: string;
  /** Expected value/type */
  expected?: string;
  /** Actual value/type */
  actual?: string;
}

/**
 * Validation warning.
 */
export interface ValidationWarning {
  /** Warning code */
  code: string;
  /** Human-readable message */
  message: string;
  /** JSON path to warning location */
  path: string;
  /** Suggestion to fix */
  suggestion?: string;
}

/**
 * Validation result.
 */
export interface ValidationResult {
  /** Is template valid */
  valid: boolean;
  /** Validation errors */
  errors: ValidationError[];
  /** Validation warnings */
  warnings: ValidationWarning[];
}

/**
 * Convert AJV error to ValidationError.
 */
function ajvErrorToValidationError(error: ErrorObject): ValidationError {
  const path = error.instancePath || '/';
  let message = error.message || 'Unknown error';
  let code = error.keyword;

  // Improve error messages
  switch (error.keyword) {
    case 'required':
      message = `Missing required property: ${(error.params as { missingProperty: string }).missingProperty}`;
      code = 'MISSING_REQUIRED';
      break;
    case 'type':
      message = `Expected ${(error.params as { type: string }).type}, got ${typeof error.data}`;
      code = 'INVALID_TYPE';
      break;
    case 'enum':
      message = `Value must be one of: ${(error.params as { allowedValues: unknown[] }).allowedValues.join(', ')}`;
      code = 'INVALID_ENUM';
      break;
    case 'minimum':
      message = `Value must be >= ${(error.params as { limit: number }).limit}`;
      code = 'VALUE_TOO_SMALL';
      break;
    case 'maximum':
      message = `Value must be <= ${(error.params as { limit: number }).limit}`;
      code = 'VALUE_TOO_LARGE';
      break;
    case 'minLength':
      message = `String must be at least ${(error.params as { limit: number }).limit} characters`;
      code = 'STRING_TOO_SHORT';
      break;
    case 'maxLength':
      message = `String must be at most ${(error.params as { limit: number }).limit} characters`;
      code = 'STRING_TOO_LONG';
      break;
    case 'pattern':
      message = `String does not match pattern: ${(error.params as { pattern: string }).pattern}`;
      code = 'PATTERN_MISMATCH';
      break;
    case 'format':
      message = `Invalid format, expected: ${(error.params as { format: string }).format}`;
      code = 'INVALID_FORMAT';
      break;
  }

  return {
    code,
    message,
    path,
    expected: error.schema?.toString(),
    actual: error.data?.toString(),
  };
}

/**
 * Create AJV validator instance.
 */
function createValidator(): Ajv {
  const ajv = new Ajv({
    allErrors: true,
    verbose: true,
    strict: false,
  });
  addFormats(ajv);
  return ajv;
}

/**
 * Validate a template against the schema.
 */
export function validateTemplate(template: unknown): ValidationResult {
  const ajv = createValidator();
  const validate = ajv.compile(templateSchema);
  const valid = validate(template);

  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  if (!valid && validate.errors) {
    for (const error of validate.errors) {
      errors.push(ajvErrorToValidationError(error));
    }
  }

  // Additional semantic validations
  if (valid && template && typeof template === 'object') {
    const t = template as Template;

    // Check for unused inputs
    const usedInputKeys = new Set<string>();
    collectUsedInputKeys(t, usedInputKeys);

    for (const input of t.inputs) {
      if (!usedInputKeys.has(input.key)) {
        warnings.push({
          code: 'UNUSED_INPUT',
          message: `Input "${input.key}" is defined but not used in any layer`,
          path: `/inputs`,
          suggestion: `Remove the input or add inputKey="${input.key}" to a layer`,
        });
      }
    }

    // Check for scene overlaps
    const scenes = t.composition.scenes;
    for (let i = 0; i < scenes.length - 1; i++) {
      if (scenes[i].endFrame > scenes[i + 1].startFrame) {
        errors.push({
          code: 'SCENE_OVERLAP',
          message: `Scene "${scenes[i].id}" overlaps with scene "${scenes[i + 1].id}"`,
          path: `/composition/scenes/${i}`,
          expected: `endFrame <= ${scenes[i + 1].startFrame}`,
          actual: scenes[i].endFrame.toString(),
        });
      }
    }

    // Check for duplicate layer IDs
    const layerIds = new Set<string>();
    const duplicates = new Set<string>();
    collectLayerIds(t, layerIds, duplicates);

    for (const id of duplicates) {
      errors.push({
        code: 'DUPLICATE_LAYER_ID',
        message: `Duplicate layer ID: "${id}"`,
        path: `/composition`,
      });
    }

    // Check for duplicate scene IDs
    const sceneIds = new Set<string>();
    for (const scene of scenes) {
      if (sceneIds.has(scene.id)) {
        errors.push({
          code: 'DUPLICATE_SCENE_ID',
          message: `Duplicate scene ID: "${scene.id}"`,
          path: `/composition/scenes`,
        });
      }
      sceneIds.add(scene.id);
    }

    // Check custom component references
    if (t.customComponents) {
      for (const scene of scenes) {
        checkCustomComponentRefs(scene.layers, t.customComponents, errors);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Collect all input keys used in layers.
 */
function collectUsedInputKeys(template: Template, keys: Set<string>): void {
  for (const scene of template.composition.scenes) {
    collectLayerInputKeys(scene.layers, keys);
  }
}

function collectLayerInputKeys(layers: Template['composition']['scenes'][0]['layers'], keys: Set<string>): void {
  for (const layer of layers) {
    if (layer.inputKey) {
      keys.add(layer.inputKey);
    }
    if ('children' in layer && layer.children) {
      collectLayerInputKeys(layer.children, keys);
    }
  }
}

/**
 * Collect all layer IDs and find duplicates.
 */
function collectLayerIds(template: Template, ids: Set<string>, duplicates: Set<string>): void {
  for (const scene of template.composition.scenes) {
    collectLayerIdsRecursive(scene.layers, ids, duplicates);
  }
}

function collectLayerIdsRecursive(
  layers: Template['composition']['scenes'][0]['layers'],
  ids: Set<string>,
  duplicates: Set<string>
): void {
  for (const layer of layers) {
    if (ids.has(layer.id)) {
      duplicates.add(layer.id);
    }
    ids.add(layer.id);
    if ('children' in layer && layer.children) {
      collectLayerIdsRecursive(layer.children, ids, duplicates);
    }
  }
}

/**
 * Check custom component references.
 */
function checkCustomComponentRefs(
  layers: Template['composition']['scenes'][0]['layers'],
  customComponents: Record<string, unknown>,
  errors: ValidationError[]
): void {
  for (const layer of layers) {
    if (layer.type === 'custom' && 'customComponent' in layer) {
      const ref = layer.customComponent as { name: string };
      if (!customComponents[ref.name]) {
        errors.push({
          code: 'UNKNOWN_COMPONENT',
          message: `Custom component "${ref.name}" is not defined in template.customComponents`,
          path: `/layers/${layer.id}`,
        });
      }
    }
    if ('children' in layer && layer.children) {
      checkCustomComponentRefs(layer.children, customComponents, errors);
    }
  }
}

/**
 * Validate inputs against template input definitions.
 */
export function validateInputs(
  template: Template,
  inputs: Record<string, unknown>
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  for (const def of template.inputs) {
    const value = inputs[def.key];

    // Check required
    if (def.required && (value === undefined || value === null)) {
      errors.push({
        code: 'MISSING_REQUIRED_INPUT',
        message: `Required input "${def.key}" is missing`,
        path: `/inputs/${def.key}`,
      });
      continue;
    }

    // Skip validation if not provided and not required
    if (value === undefined || value === null) {
      continue;
    }

    // Type validation
    if (!validateInputType(value, def)) {
      errors.push({
        code: 'INVALID_INPUT_TYPE',
        message: `Input "${def.key}" has invalid type`,
        path: `/inputs/${def.key}`,
        expected: def.type,
        actual: typeof value,
      });
      continue;
    }

    // Validation rules
    if (def.validation) {
      const ruleErrors = validateInputRules(value, def);
      errors.push(...ruleErrors.map((e) => ({ ...e, path: `/inputs/${def.key}` })));
    }
  }

  // Check for extra inputs
  for (const key of Object.keys(inputs)) {
    if (!template.inputs.find((d) => d.key === key)) {
      warnings.push({
        code: 'UNKNOWN_INPUT',
        message: `Input "${key}" is not defined in template`,
        path: `/inputs/${key}`,
        suggestion: 'Remove this input or add it to the template input definitions',
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Check if input value matches expected type.
 */
function validateInputType(value: unknown, def: InputDefinition): boolean {
  switch (def.type) {
    case 'string':
    case 'color':
    case 'url':
    case 'richtext':
      return typeof value === 'string';
    case 'number':
      return typeof value === 'number';
    case 'boolean':
      return typeof value === 'boolean';
    case 'date':
      return typeof value === 'string' || value instanceof Date;
    case 'enum':
      return typeof value === 'string';
    case 'array':
      return Array.isArray(value);
    default:
      return true;
  }
}

/**
 * Validate input against validation rules.
 */
function validateInputRules(
  value: unknown,
  def: InputDefinition
): Omit<ValidationError, 'path'>[] {
  const errors: Omit<ValidationError, 'path'>[] = [];
  const v = def.validation;
  if (!v) return errors;

  if (typeof value === 'string') {
    if (v.minLength !== undefined && value.length < v.minLength) {
      errors.push({
        code: 'STRING_TOO_SHORT',
        message: `String must be at least ${v.minLength} characters`,
        expected: `>= ${v.minLength}`,
        actual: value.length.toString(),
      });
    }
    if (v.maxLength !== undefined && value.length > v.maxLength) {
      errors.push({
        code: 'STRING_TOO_LONG',
        message: `String must be at most ${v.maxLength} characters`,
        expected: `<= ${v.maxLength}`,
        actual: value.length.toString(),
      });
    }
    if (v.pattern && !new RegExp(v.pattern).test(value)) {
      errors.push({
        code: 'PATTERN_MISMATCH',
        message: `String does not match pattern`,
        expected: v.pattern,
        actual: value,
      });
    }
    if (v.options && !v.options.find((o) => o.value === value)) {
      errors.push({
        code: 'INVALID_ENUM',
        message: `Value must be one of: ${v.options.map((o) => o.value).join(', ')}`,
        actual: value,
      });
    }
  }

  if (typeof value === 'number') {
    if (v.min !== undefined && value < v.min) {
      errors.push({
        code: 'VALUE_TOO_SMALL',
        message: `Value must be >= ${v.min}`,
        expected: `>= ${v.min}`,
        actual: value.toString(),
      });
    }
    if (v.max !== undefined && value > v.max) {
      errors.push({
        code: 'VALUE_TOO_LARGE',
        message: `Value must be <= ${v.max}`,
        expected: `<= ${v.max}`,
        actual: value.toString(),
      });
    }
    if (v.integer && !Number.isInteger(value)) {
      errors.push({
        code: 'NOT_INTEGER',
        message: 'Value must be an integer',
        actual: value.toString(),
      });
    }
  }

  if (Array.isArray(value)) {
    if (v.minItems !== undefined && value.length < v.minItems) {
      errors.push({
        code: 'ARRAY_TOO_SHORT',
        message: `Array must have at least ${v.minItems} items`,
        expected: `>= ${v.minItems}`,
        actual: value.length.toString(),
      });
    }
    if (v.maxItems !== undefined && value.length > v.maxItems) {
      errors.push({
        code: 'ARRAY_TOO_LONG',
        message: `Array must have at most ${v.maxItems} items`,
        expected: `<= ${v.maxItems}`,
        actual: value.length.toString(),
      });
    }
  }

  return errors;
}
