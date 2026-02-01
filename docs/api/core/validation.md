# Validation

Template and input validation utilities.

## Import

```typescript
import {
  validateTemplate,
  validateInputs,
  getTemplateSchema,
  getLayerSchema,
  type ValidationResult,
  type ValidationError,
} from '@rendervid/core';
```

## Functions

### validateTemplate()

Validate a template structure.

```typescript
function validateTemplate(template: unknown): ValidationResult;
```

**Parameters:**
- `template: unknown` - The template to validate

**Returns:** `ValidationResult`

**Example:**

```typescript
import { validateTemplate } from '@rendervid/core';

const template = {
  name: 'My Template',
  output: { type: 'video', width: 1920, height: 1080, fps: 30, duration: 5 },
  inputs: [],
  composition: {
    scenes: [{
      id: 'main',
      startFrame: 0,
      endFrame: 150,
      layers: []
    }]
  }
};

const result = validateTemplate(template);

if (result.valid) {
  console.log('Template is valid!');
} else {
  result.errors.forEach(error => {
    console.error(`${error.path}: ${error.message}`);
  });
}
```

### validateInputs()

Validate input values against a template's input definitions.

```typescript
function validateInputs(
  template: Template,
  inputs: Record<string, unknown>
): ValidationResult;
```

**Parameters:**
- `template: Template` - The template with input definitions
- `inputs: Record<string, unknown>` - Input values to validate

**Returns:** `ValidationResult`

**Example:**

```typescript
import { validateInputs } from '@rendervid/core';

const template = {
  name: 'Demo',
  output: { type: 'video', width: 1920, height: 1080, fps: 30, duration: 5 },
  inputs: [
    { key: 'title', type: 'string', label: 'Title', required: true },
    { key: 'count', type: 'number', label: 'Count', required: true, validation: { min: 1, max: 100 } }
  ],
  composition: { scenes: [] }
};

const inputs = {
  title: 'Hello',
  count: 150  // Invalid: exceeds max
};

const result = validateInputs(template, inputs);
// result.valid === false
// result.errors[0].message === "count must be at most 100"
```

### getTemplateSchema()

Get the JSON Schema for template validation.

```typescript
function getTemplateSchema(): JSONSchema7;
```

**Returns:** JSON Schema object for templates

**Example:**

```typescript
import { getTemplateSchema } from '@rendervid/core';
import Ajv from 'ajv';

const schema = getTemplateSchema();
const ajv = new Ajv();
const validate = ajv.compile(schema);

const isValid = validate(myTemplate);
```

### getLayerSchema()

Get the JSON Schema for a specific layer type.

```typescript
function getLayerSchema(type: string): JSONSchema7 | null;
```

**Parameters:**
- `type: string` - Layer type name

**Returns:** JSON Schema for the layer type, or `null` if not found

**Example:**

```typescript
import { getLayerSchema } from '@rendervid/core';

const textSchema = getLayerSchema('text');
console.log(textSchema?.properties);
// { text: { type: 'string' }, fontSize: { type: 'number' }, ... }

const unknownSchema = getLayerSchema('unknown');
// null
```

## Types

### ValidationResult

```typescript
interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings?: ValidationWarning[];
}
```

### ValidationError

```typescript
interface ValidationError {
  path: string;      // JSON path to error location
  message: string;   // Human-readable error message
  code: string;      // Error code for programmatic handling
}
```

### ValidationWarning

```typescript
interface ValidationWarning {
  path: string;
  message: string;
  code: string;
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `REQUIRED_FIELD` | Required field is missing |
| `INVALID_TYPE` | Value has wrong type |
| `INVALID_VALUE` | Value is invalid |
| `OUT_OF_RANGE` | Numeric value out of allowed range |
| `PATTERN_MISMATCH` | String doesn't match pattern |
| `LENGTH_ERROR` | String length out of bounds |
| `ARRAY_LENGTH` | Array length out of bounds |
| `UNKNOWN_LAYER_TYPE` | Unrecognized layer type |
| `UNKNOWN_ANIMATION` | Unrecognized animation preset |
| `SCENE_OVERLAP` | Scenes have overlapping frames |
| `INVALID_TIMING` | Invalid frame timing |

## Validation Rules

### Template Validation

1. **Required fields**: `name`, `output`, `inputs`, `composition`
2. **Output validation**:
   - `type` must be `'video'` or `'image'`
   - `width` and `height` must be positive integers
   - For video: `fps` must be positive, `duration` must be positive
3. **Scene validation**:
   - Each scene must have unique `id`
   - `startFrame` must be >= 0
   - `endFrame` must be > `startFrame`
   - Scenes must not overlap
4. **Layer validation**:
   - Each layer must have unique `id` within its scene
   - `type` must be a valid layer type
   - `position` and `size` must have `x`/`y` and `width`/`height`
   - Layer-specific props are validated

### Input Validation

1. **Required inputs**: All inputs with `required: true` must be provided
2. **Type checking**: Values must match declared input type
3. **String validation**:
   - `minLength` and `maxLength` enforcement
   - `pattern` regex matching
4. **Number validation**:
   - `min` and `max` bounds
   - `integer` constraint
   - `step` validation (if specified)
5. **Array validation**:
   - `minItems` and `maxItems` bounds
   - Item type validation (if `itemType` specified)
6. **Enum validation**: Value must be in defined options
7. **URL validation**: `allowedTypes` filtering

## Example: Custom Validation

```typescript
import { validateTemplate, validateInputs } from '@rendervid/core';

function validateAndRender(template: unknown, inputs: Record<string, unknown>) {
  // Validate template structure
  const templateResult = validateTemplate(template);
  if (!templateResult.valid) {
    return {
      success: false,
      error: 'Invalid template',
      details: templateResult.errors
    };
  }

  // Validate inputs
  const inputResult = validateInputs(template as Template, inputs);
  if (!inputResult.valid) {
    return {
      success: false,
      error: 'Invalid inputs',
      details: inputResult.errors
    };
  }

  // Check for warnings
  if (templateResult.warnings?.length) {
    console.warn('Template warnings:', templateResult.warnings);
  }

  // Proceed with rendering...
  return { success: true };
}
```

## Example: Error Display

```typescript
import { validateTemplate } from '@rendervid/core';

function displayValidationErrors(result: ValidationResult) {
  if (result.valid) {
    console.log('Validation passed!');
    return;
  }

  console.group('Validation Errors');

  result.errors.forEach((error, index) => {
    console.error(`${index + 1}. [${error.code}] ${error.path}`);
    console.error(`   ${error.message}`);
  });

  if (result.warnings?.length) {
    console.group('Warnings');
    result.warnings.forEach(warning => {
      console.warn(`[${warning.code}] ${warning.path}: ${warning.message}`);
    });
    console.groupEnd();
  }

  console.groupEnd();
}
```

## Related Documentation

- [RendervidEngine](/api/core/engine) - Engine API
- [Types](/api/core/types) - Type definitions
- [Inputs](/templates/inputs) - Input definitions
