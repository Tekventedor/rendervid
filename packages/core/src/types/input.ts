/**
 * Input data types supported by templates.
 */
export type InputType =
  | 'string'    // Text input
  | 'number'    // Numeric input
  | 'boolean'   // Toggle
  | 'color'     // Color picker (#RRGGBB or rgba())
  | 'url'       // URL to asset
  | 'enum'      // Select from options
  | 'richtext'  // Formatted text (HTML/Markdown)
  | 'date'      // Date value
  | 'array';    // Array of values

/**
 * Option for enum inputs.
 */
export interface EnumOption {
  /** Option value */
  value: string;
  /** Display label */
  label: string;
}

/**
 * Validation rules for inputs.
 */
export interface InputValidation {
  // String validation
  /** Minimum string length */
  minLength?: number;
  /** Maximum string length */
  maxLength?: number;
  /** Regex pattern to match */
  pattern?: string;

  // Number validation
  /** Minimum numeric value */
  min?: number;
  /** Maximum numeric value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Must be an integer */
  integer?: boolean;

  // Enum validation
  /** Available options for enum type */
  options?: EnumOption[];

  // URL validation
  /** Allowed asset types */
  allowedTypes?: ('image' | 'video' | 'audio' | 'font')[];

  // Array validation
  /** Minimum array length */
  minItems?: number;
  /** Maximum array length */
  maxItems?: number;
  /** Schema for array items */
  itemType?: Omit<InputDefinition, 'key' | 'label' | 'required'>;
}

/**
 * UI hints for input rendering.
 */
export interface InputUI {
  /** Placeholder text */
  placeholder?: string;
  /** Help text shown below input */
  helpText?: string;
  /** Group name for organizing inputs */
  group?: string;
  /** Display order within group */
  order?: number;
  /** Hide from UI (use default/computed value) */
  hidden?: boolean;
  /** Number of rows for multiline text */
  rows?: number;
  /** File accept attribute for file inputs */
  accept?: string;
}

/**
 * Definition of a template input.
 *
 * Inputs allow templates to be customized at render time.
 * They can be bound to layer properties using `inputKey`.
 *
 * @example
 * ```typescript
 * const titleInput: InputDefinition = {
 *   key: 'title',
 *   type: 'string',
 *   label: 'Title',
 *   description: 'The main title text',
 *   required: true,
 *   default: 'Hello World',
 *   validation: {
 *     minLength: 1,
 *     maxLength: 100,
 *   },
 * };
 * ```
 */
export interface InputDefinition {
  /**
   * Unique key for this input.
   * Used to reference the input in layer bindings.
   */
  key: string;

  /**
   * Data type of the input
   */
  type: InputType;

  /**
   * Display label shown in UI
   */
  label: string;

  /**
   * Description for users and AI agents
   */
  description: string;

  /**
   * Whether this input is required
   */
  required: boolean;

  /**
   * Default value if not provided
   */
  default?: unknown;

  /**
   * Validation rules
   */
  validation?: InputValidation;

  /**
   * UI rendering hints
   */
  ui?: InputUI;
}
