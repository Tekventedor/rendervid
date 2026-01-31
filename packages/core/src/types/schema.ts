/**
 * JSON Schema 7 type (simplified).
 * For full typing, use @types/json-schema.
 */
export interface JSONSchema7 {
  $id?: string;
  $ref?: string;
  $schema?: string;
  $comment?: string;

  type?: JSONSchema7TypeName | JSONSchema7TypeName[];
  enum?: unknown[];
  const?: unknown;

  // String
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: string;

  // Number
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: number;
  minimum?: number;
  exclusiveMinimum?: number;

  // Array
  items?: JSONSchema7 | JSONSchema7[];
  additionalItems?: JSONSchema7 | boolean;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  contains?: JSONSchema7;

  // Object
  maxProperties?: number;
  minProperties?: number;
  required?: string[];
  additionalProperties?: JSONSchema7 | boolean;
  properties?: Record<string, JSONSchema7>;
  patternProperties?: Record<string, JSONSchema7>;
  propertyNames?: JSONSchema7;

  // Conditionals
  if?: JSONSchema7;
  then?: JSONSchema7;
  else?: JSONSchema7;

  // Combining
  allOf?: JSONSchema7[];
  anyOf?: JSONSchema7[];
  oneOf?: JSONSchema7[];
  not?: JSONSchema7;

  // Metadata
  title?: string;
  description?: string;
  default?: unknown;
  examples?: unknown[];

  // Definitions
  definitions?: Record<string, JSONSchema7>;
  $defs?: Record<string, JSONSchema7>;
}

/**
 * JSON Schema 7 type names.
 */
export type JSONSchema7TypeName =
  | 'string'
  | 'number'
  | 'integer'
  | 'boolean'
  | 'object'
  | 'array'
  | 'null';
