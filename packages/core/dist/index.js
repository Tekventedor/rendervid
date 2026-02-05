'use strict';

var Ajv = require('ajv');
var addFormats = require('ajv-formats');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var Ajv__default = /*#__PURE__*/_interopDefault(Ajv);
var addFormats__default = /*#__PURE__*/_interopDefault(addFormats);

// src/validation/validator.ts

// src/validation/schema.ts
var positionSchema = {
  type: "object",
  properties: {
    x: { type: "number" },
    y: { type: "number" }
  },
  required: ["x", "y"]
};
var sizeSchema = {
  type: "object",
  properties: {
    width: { type: "number", minimum: 0 },
    height: { type: "number", minimum: 0 }
  },
  required: ["width", "height"]
};
var outputSchema = {
  type: "object",
  properties: {
    type: { type: "string", enum: ["video", "image"] },
    width: { type: "integer", minimum: 1, maximum: 7680 },
    height: { type: "integer", minimum: 1, maximum: 4320 },
    fps: { type: "integer", minimum: 1, maximum: 120 },
    duration: { type: "number", minimum: 0 },
    backgroundColor: { type: "string" }
  },
  required: ["type", "width", "height"]
};
var inputDefinitionSchema = {
  type: "object",
  properties: {
    key: { type: "string", minLength: 1 },
    type: {
      type: "string",
      enum: ["string", "number", "boolean", "color", "url", "enum", "richtext", "date", "array"]
    },
    label: { type: "string" },
    description: { type: "string" },
    required: { type: "boolean" },
    default: {},
    validation: { type: "object" },
    ui: { type: "object" }
  },
  required: ["key", "type", "label", "description", "required"]
};
var animationSchema = {
  type: "object",
  properties: {
    type: { type: "string", enum: ["entrance", "exit", "emphasis", "keyframe"] },
    effect: { type: "string" },
    duration: { type: "integer", minimum: 1 },
    delay: { type: "integer", minimum: 0 },
    easing: { type: "string" },
    keyframes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          frame: { type: "integer", minimum: 0 },
          properties: { type: "object" },
          easing: { type: "string" }
        },
        required: ["frame", "properties"]
      }
    },
    loop: { type: "integer" },
    alternate: { type: "boolean" }
  },
  required: ["type", "duration"]
};
var layerBaseSchema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 1 },
    type: {
      type: "string",
      enum: ["image", "video", "text", "shape", "audio", "group", "lottie", "custom", "three"]
    },
    name: { type: "string" },
    position: positionSchema,
    size: sizeSchema,
    rotation: { type: "number" },
    scale: {
      type: "object",
      properties: {
        x: { type: "number" },
        y: { type: "number" }
      }
    },
    anchor: {
      type: "object",
      properties: {
        x: { type: "number", minimum: 0, maximum: 1 },
        y: { type: "number", minimum: 0, maximum: 1 }
      }
    },
    from: { type: "integer", minimum: 0 },
    duration: { type: "integer" },
    opacity: { type: "number", minimum: 0, maximum: 1 },
    blendMode: {
      type: "string",
      enum: [
        "normal",
        "multiply",
        "screen",
        "overlay",
        "darken",
        "lighten",
        "color-dodge",
        "color-burn",
        "hard-light",
        "soft-light",
        "difference",
        "exclusion"
      ]
    },
    filters: { type: "array" },
    shadow: {
      type: "object",
      properties: {
        color: { type: "string" },
        blur: { type: "number", minimum: 0 },
        offsetX: { type: "number" },
        offsetY: { type: "number" }
      }
    },
    clipPath: { type: "string" },
    maskLayer: { type: "string" },
    style: { type: "object" },
    className: { type: "string" },
    inputKey: { type: "string" },
    inputProperty: { type: "string" },
    animations: { type: "array", items: animationSchema },
    props: { type: "object" },
    locked: { type: "boolean" },
    hidden: { type: "boolean" }
  },
  required: ["id", "type", "position", "size"]
};
var transitionSchema = {
  type: "object",
  properties: {
    type: { type: "string", enum: ["cut", "fade", "slide", "wipe", "zoom"] },
    duration: { type: "integer", minimum: 1 },
    direction: { type: "string", enum: ["left", "right", "up", "down"] },
    easing: { type: "string" }
  },
  required: ["type", "duration"]
};
var sceneSchema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 1 },
    name: { type: "string" },
    startFrame: { type: "integer", minimum: 0 },
    endFrame: { type: "integer", minimum: 1 },
    backgroundColor: { type: "string" },
    backgroundImage: { type: "string" },
    backgroundFit: { type: "string", enum: ["cover", "contain", "fill", "none"] },
    backgroundVideo: { type: "string" },
    transition: transitionSchema,
    layers: {
      type: "array",
      items: layerBaseSchema
    }
  },
  required: ["id", "startFrame", "endFrame", "layers"]
};
var compositionSchema = {
  type: "object",
  properties: {
    scenes: {
      type: "array",
      items: sceneSchema,
      minItems: 1
    },
    assets: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          type: { type: "string", enum: ["image", "video", "audio", "font", "lottie"] },
          url: { type: "string" },
          name: { type: "string" }
        },
        required: ["id", "type", "url"]
      }
    }
  },
  required: ["scenes"]
};
var customComponentSchema = {
  type: "object",
  properties: {
    type: { type: "string", enum: ["reference", "url", "inline"] },
    reference: { type: "string" },
    url: { type: "string" },
    code: { type: "string" },
    propsSchema: { type: "object" },
    description: { type: "string" }
  },
  required: ["type"]
};
var fontSourceSchema = {
  type: "object",
  properties: {
    url: { type: "string" },
    local: {
      oneOf: [
        { type: "string" },
        { type: "array", items: { type: "string" } }
      ]
    },
    format: {
      type: "string",
      enum: ["woff2", "woff", "truetype", "opentype", "embedded-opentype", "svg"]
    },
    weight: {
      type: "integer",
      enum: [100, 200, 300, 400, 500, 600, 700, 800, 900]
    },
    style: {
      type: "string",
      enum: ["normal", "italic", "oblique"]
    }
  },
  additionalProperties: false
};
var fontFamilySchema = {
  type: "object",
  properties: {
    family: { type: "string", minLength: 1 },
    sources: {
      type: "array",
      items: fontSourceSchema,
      minItems: 1
    },
    display: {
      type: "string",
      enum: ["auto", "block", "swap", "fallback", "optional"]
    },
    fallback: {
      type: "array",
      items: { type: "string" }
    },
    preload: { type: "boolean" }
  },
  required: ["family", "sources"],
  additionalProperties: false
};
var fontConfigurationSchema = {
  type: "object",
  properties: {
    families: {
      type: "array",
      items: fontFamilySchema,
      minItems: 1
    },
    basePath: { type: "string" }
  },
  required: ["families"],
  additionalProperties: false
};
var templateSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Rendervid Template",
  description: "A Rendervid video/image template",
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string", minLength: 1 },
    description: { type: "string" },
    version: { type: "string" },
    author: {
      type: "object",
      properties: {
        name: { type: "string" },
        url: { type: "string" },
        email: { type: "string", format: "email" }
      }
    },
    tags: { type: "array", items: { type: "string" } },
    thumbnail: { type: "string" },
    output: outputSchema,
    inputs: {
      type: "array",
      items: inputDefinitionSchema
    },
    defaults: { type: "object" },
    customComponents: {
      type: "object",
      additionalProperties: customComponentSchema
    },
    fonts: fontConfigurationSchema,
    composition: compositionSchema
  },
  required: ["name", "output", "inputs", "composition"]
};
function getTemplateSchema() {
  return templateSchema;
}
function getLayerSchema(type) {
  return layerBaseSchema;
}

// src/validation/validator.ts
function ajvErrorToValidationError(error) {
  const path = error.instancePath || "/";
  let message = error.message || "Unknown error";
  let code = error.keyword;
  switch (error.keyword) {
    case "required":
      message = `Missing required property: ${error.params.missingProperty}`;
      code = "MISSING_REQUIRED";
      break;
    case "type":
      message = `Expected ${error.params.type}, got ${typeof error.data}`;
      code = "INVALID_TYPE";
      break;
    case "enum":
      message = `Value must be one of: ${error.params.allowedValues.join(", ")}`;
      code = "INVALID_ENUM";
      break;
    case "minimum":
      message = `Value must be >= ${error.params.limit}`;
      code = "VALUE_TOO_SMALL";
      break;
    case "maximum":
      message = `Value must be <= ${error.params.limit}`;
      code = "VALUE_TOO_LARGE";
      break;
    case "minLength":
      message = `String must be at least ${error.params.limit} characters`;
      code = "STRING_TOO_SHORT";
      break;
    case "maxLength":
      message = `String must be at most ${error.params.limit} characters`;
      code = "STRING_TOO_LONG";
      break;
    case "pattern":
      message = `String does not match pattern: ${error.params.pattern}`;
      code = "PATTERN_MISMATCH";
      break;
    case "format":
      message = `Invalid format, expected: ${error.params.format}`;
      code = "INVALID_FORMAT";
      break;
  }
  return {
    code,
    message,
    path,
    expected: error.schema?.toString(),
    actual: error.data?.toString()
  };
}
function createValidator() {
  const ajv = new Ajv__default.default({
    allErrors: true,
    verbose: true,
    strict: false
  });
  addFormats__default.default(ajv);
  return ajv;
}
function validateTemplate(template) {
  const ajv = createValidator();
  const validate = ajv.compile(templateSchema);
  const valid = validate(template);
  const errors = [];
  const warnings = [];
  if (!valid && validate.errors) {
    for (const error of validate.errors) {
      errors.push(ajvErrorToValidationError(error));
    }
  }
  if (valid && template && typeof template === "object") {
    const t = template;
    const usedInputKeys = /* @__PURE__ */ new Set();
    collectUsedInputKeys(t, usedInputKeys);
    for (const input of t.inputs) {
      if (!usedInputKeys.has(input.key)) {
        warnings.push({
          code: "UNUSED_INPUT",
          message: `Input "${input.key}" is defined but not used in any layer`,
          path: `/inputs`,
          suggestion: `Remove the input or add inputKey="${input.key}" to a layer`
        });
      }
    }
    const scenes = t.composition.scenes;
    for (let i = 0; i < scenes.length - 1; i++) {
      if (scenes[i].endFrame > scenes[i + 1].startFrame) {
        errors.push({
          code: "SCENE_OVERLAP",
          message: `Scene "${scenes[i].id}" overlaps with scene "${scenes[i + 1].id}"`,
          path: `/composition/scenes/${i}`,
          expected: `endFrame <= ${scenes[i + 1].startFrame}`,
          actual: scenes[i].endFrame.toString()
        });
      }
    }
    const layerIds = /* @__PURE__ */ new Set();
    const duplicates = /* @__PURE__ */ new Set();
    collectLayerIds(t, layerIds, duplicates);
    for (const id of duplicates) {
      errors.push({
        code: "DUPLICATE_LAYER_ID",
        message: `Duplicate layer ID: "${id}"`,
        path: `/composition`
      });
    }
    const sceneIds = /* @__PURE__ */ new Set();
    for (const scene of scenes) {
      if (sceneIds.has(scene.id)) {
        errors.push({
          code: "DUPLICATE_SCENE_ID",
          message: `Duplicate scene ID: "${scene.id}"`,
          path: `/composition/scenes`
        });
      }
      sceneIds.add(scene.id);
    }
    if (t.customComponents) {
      for (const scene of scenes) {
        checkCustomComponentRefs(scene.layers, t.customComponents, errors);
      }
    }
  }
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
function collectUsedInputKeys(template, keys) {
  for (const scene of template.composition.scenes) {
    collectLayerInputKeys(scene.layers, keys);
  }
}
function collectLayerInputKeys(layers, keys) {
  for (const layer of layers) {
    if (layer.inputKey) {
      keys.add(layer.inputKey);
    }
    if ("children" in layer && layer.children) {
      collectLayerInputKeys(layer.children, keys);
    }
  }
}
function collectLayerIds(template, ids, duplicates) {
  for (const scene of template.composition.scenes) {
    collectLayerIdsRecursive(scene.layers, ids, duplicates);
  }
}
function collectLayerIdsRecursive(layers, ids, duplicates) {
  for (const layer of layers) {
    if (ids.has(layer.id)) {
      duplicates.add(layer.id);
    }
    ids.add(layer.id);
    if ("children" in layer && layer.children) {
      collectLayerIdsRecursive(layer.children, ids, duplicates);
    }
  }
}
function checkCustomComponentRefs(layers, customComponents, errors) {
  for (const layer of layers) {
    if (layer.type === "custom" && "customComponent" in layer) {
      const ref = layer.customComponent;
      if (!customComponents[ref.name]) {
        errors.push({
          code: "UNKNOWN_COMPONENT",
          message: `Custom component "${ref.name}" is not defined in template.customComponents`,
          path: `/layers/${layer.id}`
        });
      }
    }
    if ("children" in layer && layer.children) {
      checkCustomComponentRefs(layer.children, customComponents, errors);
    }
  }
}
function validateInputs(template, inputs) {
  const errors = [];
  const warnings = [];
  for (const def of template.inputs) {
    const value = inputs[def.key];
    if (def.required && (value === void 0 || value === null)) {
      errors.push({
        code: "MISSING_REQUIRED_INPUT",
        message: `Required input "${def.key}" is missing`,
        path: `/inputs/${def.key}`
      });
      continue;
    }
    if (value === void 0 || value === null) {
      continue;
    }
    if (!validateInputType(value, def)) {
      errors.push({
        code: "INVALID_INPUT_TYPE",
        message: `Input "${def.key}" has invalid type`,
        path: `/inputs/${def.key}`,
        expected: def.type,
        actual: typeof value
      });
      continue;
    }
    if (def.validation) {
      const ruleErrors = validateInputRules(value, def);
      errors.push(...ruleErrors.map((e) => ({ ...e, path: `/inputs/${def.key}` })));
    }
  }
  for (const key of Object.keys(inputs)) {
    if (!template.inputs.find((d) => d.key === key)) {
      warnings.push({
        code: "UNKNOWN_INPUT",
        message: `Input "${key}" is not defined in template`,
        path: `/inputs/${key}`,
        suggestion: "Remove this input or add it to the template input definitions"
      });
    }
  }
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
function validateInputType(value, def) {
  switch (def.type) {
    case "string":
    case "color":
    case "url":
    case "richtext":
      return typeof value === "string";
    case "number":
      return typeof value === "number";
    case "boolean":
      return typeof value === "boolean";
    case "date":
      return typeof value === "string" || value instanceof Date;
    case "enum":
      return typeof value === "string";
    case "array":
      return Array.isArray(value);
    default:
      return true;
  }
}
function validateInputRules(value, def) {
  const errors = [];
  const v = def.validation;
  if (!v) return errors;
  if (typeof value === "string") {
    if (v.minLength !== void 0 && value.length < v.minLength) {
      errors.push({
        code: "STRING_TOO_SHORT",
        message: `String must be at least ${v.minLength} characters`,
        expected: `>= ${v.minLength}`,
        actual: value.length.toString()
      });
    }
    if (v.maxLength !== void 0 && value.length > v.maxLength) {
      errors.push({
        code: "STRING_TOO_LONG",
        message: `String must be at most ${v.maxLength} characters`,
        expected: `<= ${v.maxLength}`,
        actual: value.length.toString()
      });
    }
    if (v.pattern && !new RegExp(v.pattern).test(value)) {
      errors.push({
        code: "PATTERN_MISMATCH",
        message: `String does not match pattern`,
        expected: v.pattern,
        actual: value
      });
    }
    if (v.options && !v.options.find((o) => o.value === value)) {
      errors.push({
        code: "INVALID_ENUM",
        message: `Value must be one of: ${v.options.map((o) => o.value).join(", ")}`,
        actual: value
      });
    }
  }
  if (typeof value === "number") {
    if (v.min !== void 0 && value < v.min) {
      errors.push({
        code: "VALUE_TOO_SMALL",
        message: `Value must be >= ${v.min}`,
        expected: `>= ${v.min}`,
        actual: value.toString()
      });
    }
    if (v.max !== void 0 && value > v.max) {
      errors.push({
        code: "VALUE_TOO_LARGE",
        message: `Value must be <= ${v.max}`,
        expected: `<= ${v.max}`,
        actual: value.toString()
      });
    }
    if (v.integer && !Number.isInteger(value)) {
      errors.push({
        code: "NOT_INTEGER",
        message: "Value must be an integer",
        actual: value.toString()
      });
    }
  }
  if (Array.isArray(value)) {
    if (v.minItems !== void 0 && value.length < v.minItems) {
      errors.push({
        code: "ARRAY_TOO_SHORT",
        message: `Array must have at least ${v.minItems} items`,
        expected: `>= ${v.minItems}`,
        actual: value.length.toString()
      });
    }
    if (v.maxItems !== void 0 && value.length > v.maxItems) {
      errors.push({
        code: "ARRAY_TOO_LONG",
        message: `Array must have at most ${v.maxItems} items`,
        expected: `<= ${v.maxItems}`,
        actual: value.length.toString()
      });
    }
  }
  return errors;
}

// src/animation/easings.ts
var linear = (t) => t;
var easeInQuad = (t) => t * t;
var easeOutQuad = (t) => t * (2 - t);
var easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
var easeInCubic = (t) => t * t * t;
var easeOutCubic = (t) => --t * t * t + 1;
var easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
var easeInQuart = (t) => t * t * t * t;
var easeOutQuart = (t) => 1 - --t * t * t * t;
var easeInOutQuart = (t) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
var easeInQuint = (t) => t * t * t * t * t;
var easeOutQuint = (t) => 1 + --t * t * t * t * t;
var easeInOutQuint = (t) => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
var easeInSine = (t) => 1 - Math.cos(t * Math.PI / 2);
var easeOutSine = (t) => Math.sin(t * Math.PI / 2);
var easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;
var easeInExpo = (t) => t === 0 ? 0 : Math.pow(2, 10 * t - 10);
var easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
var easeInOutExpo = (t) => t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2;
var easeInCirc = (t) => 1 - Math.sqrt(1 - t * t);
var easeOutCirc = (t) => Math.sqrt(1 - --t * t);
var easeInOutCirc = (t) => t < 0.5 ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2 : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2;
var c1 = 1.70158;
var c2 = c1 * 1.525;
var c3 = c1 + 1;
var easeInBack = (t) => c3 * t * t * t - c1 * t * t;
var easeOutBack = (t) => 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
var easeInOutBack = (t) => t < 0.5 ? Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2) / 2 : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
var c4 = 2 * Math.PI / 3;
var c5 = 2 * Math.PI / 4.5;
var easeInElastic = (t) => t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
var easeOutElastic = (t) => t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
var easeInOutElastic = (t) => t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2 : Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5) / 2 + 1;
var n1 = 7.5625;
var d1 = 2.75;
var easeOutBounce = (t) => {
  if (t < 1 / d1) {
    return n1 * t * t;
  } else if (t < 2 / d1) {
    return n1 * (t -= 1.5 / d1) * t + 0.75;
  } else if (t < 2.5 / d1) {
    return n1 * (t -= 2.25 / d1) * t + 0.9375;
  } else {
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  }
};
var easeInBounce = (t) => 1 - easeOutBounce(1 - t);
var easeInOutBounce = (t) => t < 0.5 ? (1 - easeOutBounce(1 - 2 * t)) / 2 : (1 + easeOutBounce(2 * t - 1)) / 2;
var easingMap = {
  linear,
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  easeInQuint,
  easeOutQuint,
  easeInOutQuint,
  easeInSine,
  easeOutSine,
  easeInOutSine,
  easeInExpo,
  easeOutExpo,
  easeInOutExpo,
  easeInCirc,
  easeOutCirc,
  easeInOutCirc,
  easeInBack,
  easeOutBack,
  easeInOutBack,
  easeInElastic,
  easeOutElastic,
  easeInOutElastic,
  easeInBounce,
  easeOutBounce,
  easeInOutBounce
};
function getAllEasingNames() {
  return Object.keys(easingMap);
}
function getEasing(name) {
  return easingMap[name] || linear;
}
function parseCubicBezier(value) {
  const match = value.match(
    /^cubic-bezier\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/
  );
  if (!match) return null;
  const [, x1, y1, x2, y2] = match.map(Number);
  return createCubicBezier(x1, y1, x2, y2);
}
function createCubicBezier(x1, y1, x2, y2) {
  const NEWTON_ITERATIONS = 4;
  const NEWTON_MIN_SLOPE = 1e-3;
  const SUBDIVISION_PRECISION = 1e-7;
  const SUBDIVISION_MAX_ITERATIONS = 10;
  const kSplineTableSize = 11;
  const kSampleStepSize = 1 / (kSplineTableSize - 1);
  const sampleValues = new Float32Array(kSplineTableSize);
  function A(a1, a2) {
    return 1 - 3 * a2 + 3 * a1;
  }
  function B(a1, a2) {
    return 3 * a2 - 6 * a1;
  }
  function C(a1) {
    return 3 * a1;
  }
  function calcBezier(t, a1, a2) {
    return ((A(a1, a2) * t + B(a1, a2)) * t + C(a1)) * t;
  }
  function getSlope(t, a1, a2) {
    return 3 * A(a1, a2) * t * t + 2 * B(a1, a2) * t + C(a1);
  }
  function binarySubdivide(x, a, b, mX1, mX2) {
    let currentX;
    let currentT;
    let i = 0;
    do {
      currentT = a + (b - a) / 2;
      currentX = calcBezier(currentT, mX1, mX2) - x;
      if (currentX > 0) {
        b = currentT;
      } else {
        a = currentT;
      }
    } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
    return currentT;
  }
  function newtonRaphsonIterate(x, guessT, mX1, mX2) {
    for (let i = 0; i < NEWTON_ITERATIONS; ++i) {
      const currentSlope = getSlope(guessT, mX1, mX2);
      if (currentSlope === 0) {
        return guessT;
      }
      const currentX = calcBezier(guessT, mX1, mX2) - x;
      guessT -= currentX / currentSlope;
    }
    return guessT;
  }
  for (let i = 0; i < kSplineTableSize; ++i) {
    sampleValues[i] = calcBezier(i * kSampleStepSize, x1, x2);
  }
  function getTForX(x) {
    let intervalStart = 0;
    let currentSample = 1;
    const lastSample = kSplineTableSize - 1;
    for (; currentSample !== lastSample && sampleValues[currentSample] <= x; ++currentSample) {
      intervalStart += kSampleStepSize;
    }
    --currentSample;
    const dist = (x - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
    const guessForT = intervalStart + dist * kSampleStepSize;
    const initialSlope = getSlope(guessForT, x1, x2);
    if (initialSlope >= NEWTON_MIN_SLOPE) {
      return newtonRaphsonIterate(x, guessForT, x1, x2);
    } else if (initialSlope === 0) {
      return guessForT;
    } else {
      return binarySubdivide(x, intervalStart, intervalStart + kSampleStepSize, x1, x2);
    }
  }
  return function bezierEasing(x) {
    if (x === 0) return 0;
    if (x === 1) return 1;
    return calcBezier(getTForX(x), y1, y2);
  };
}
function parseSpring(value) {
  const match = value.match(
    /^spring\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/
  );
  if (!match) return null;
  const [, mass, stiffness, damping] = match.map(Number);
  return createSpring(mass, stiffness, damping);
}
function createSpring(mass, stiffness, damping) {
  const w0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  let wd;
  let A;
  if (zeta < 1) {
    wd = w0 * Math.sqrt(1 - zeta * zeta);
    A = 1;
  } else {
    wd = 0;
    A = 1;
  }
  return function springEasing(t) {
    if (t === 0) return 0;
    if (t >= 1) return 1;
    const scaledT = t * 5;
    if (zeta < 1) {
      return 1 - Math.exp(-zeta * w0 * scaledT) * (A * Math.cos(wd * scaledT) + zeta * w0 * A / wd * Math.sin(wd * scaledT));
    } else {
      return 1 - (1 + w0 * scaledT) * Math.exp(-w0 * scaledT);
    }
  };
}
function parseEasing(value) {
  if (value in easingMap) {
    return easingMap[value];
  }
  const bezier = parseCubicBezier(value);
  if (bezier) return bezier;
  const spring = parseSpring(value);
  if (spring) return spring;
  return linear;
}

// src/animation/interpolation.ts
function interpolate(from, to, progress, easing = "linear") {
  const easingFn = parseEasing(easing);
  const easedProgress = easingFn(progress);
  return from + (to - from) * easedProgress;
}
function getValueAtFrame(keyframes, property, frame) {
  if (keyframes.length === 0) return void 0;
  let prevKeyframe = null;
  let nextKeyframe = null;
  for (const kf of keyframes) {
    if (kf.properties[property] === void 0) continue;
    if (kf.frame <= frame) {
      prevKeyframe = kf;
    }
    if (kf.frame > frame && nextKeyframe === null) {
      nextKeyframe = kf;
    }
  }
  if (prevKeyframe === null) {
    if (nextKeyframe !== null) {
      return nextKeyframe.properties[property];
    }
    return void 0;
  }
  if (nextKeyframe === null || prevKeyframe.frame === frame) {
    return prevKeyframe.properties[property];
  }
  const fromValue = prevKeyframe.properties[property];
  const toValue = nextKeyframe.properties[property];
  if (fromValue === void 0 || toValue === void 0) {
    return fromValue ?? toValue;
  }
  const duration = nextKeyframe.frame - prevKeyframe.frame;
  const elapsed = frame - prevKeyframe.frame;
  const progress = elapsed / duration;
  return interpolate(fromValue, toValue, progress, prevKeyframe.easing);
}
function getPropertiesAtFrame(keyframes, frame) {
  const result = {};
  const propertyNames = /* @__PURE__ */ new Set();
  for (const kf of keyframes) {
    for (const key of Object.keys(kf.properties)) {
      propertyNames.add(key);
    }
  }
  for (const prop of propertyNames) {
    const value = getValueAtFrame(keyframes, prop, frame);
    if (value !== void 0) {
      result[prop] = value;
    }
  }
  return result;
}
function compileAnimation(keyframes, totalFrames) {
  const frameCache = new Array(totalFrames);
  for (let frame = 0; frame < totalFrames; frame++) {
    frameCache[frame] = getPropertiesAtFrame(keyframes, frame);
  }
  return {
    totalFrames,
    getPropertiesAtFrame: (frame) => {
      if (frame < 0) return frameCache[0];
      if (frame >= totalFrames) return frameCache[totalFrames - 1];
      return frameCache[Math.floor(frame)];
    }
  };
}

// src/animation/presets.ts
var fadeIn = {
  name: "fadeIn",
  type: "entrance",
  defaultDuration: 30,
  defaultEasing: "easeOutCubic",
  generate: ({ duration, easing = "easeOutCubic" }) => [
    { frame: 0, properties: { opacity: 0 }, easing },
    { frame: duration, properties: { opacity: 1 } }
  ]
};
var fadeInUp = {
  name: "fadeInUp",
  type: "entrance",
  defaultDuration: 30,
  defaultEasing: "easeOutCubic",
  generate: ({ duration, easing = "easeOutCubic" }) => [
    { frame: 0, properties: { opacity: 0, y: 50 }, easing },
    { frame: duration, properties: { opacity: 1, y: 0 } }
  ]
};
var fadeInDown = {
  name: "fadeInDown",
  type: "entrance",
  defaultDuration: 30,
  defaultEasing: "easeOutCubic",
  generate: ({ duration, easing = "easeOutCubic" }) => [
    { frame: 0, properties: { opacity: 0, y: -50 }, easing },
    { frame: duration, properties: { opacity: 1, y: 0 } }
  ]
};
var fadeInLeft = {
  name: "fadeInLeft",
  type: "entrance",
  defaultDuration: 30,
  defaultEasing: "easeOutCubic",
  generate: ({ duration, easing = "easeOutCubic" }) => [
    { frame: 0, properties: { opacity: 0, x: -50 }, easing },
    { frame: duration, properties: { opacity: 1, x: 0 } }
  ]
};
var fadeInRight = {
  name: "fadeInRight",
  type: "entrance",
  defaultDuration: 30,
  defaultEasing: "easeOutCubic",
  generate: ({ duration, easing = "easeOutCubic" }) => [
    { frame: 0, properties: { opacity: 0, x: 50 }, easing },
    { frame: duration, properties: { opacity: 1, x: 0 } }
  ]
};
var slideInUp = {
  name: "slideInUp",
  type: "entrance",
  defaultDuration: 30,
  defaultEasing: "easeOutCubic",
  generate: ({ duration, easing = "easeOutCubic", canvasSize }) => {
    const offset = canvasSize?.height ?? 500;
    return [
      { frame: 0, properties: { y: offset }, easing },
      { frame: duration, properties: { y: 0 } }
    ];
  }
};
var slideInDown = {
  name: "slideInDown",
  type: "entrance",
  defaultDuration: 30,
  defaultEasing: "easeOutCubic",
  generate: ({ duration, easing = "easeOutCubic", canvasSize }) => {
    const offset = -(canvasSize?.height ?? 500);
    return [
      { frame: 0, properties: { y: offset }, easing },
      { frame: duration, properties: { y: 0 } }
    ];
  }
};
var slideInLeft = {
  name: "slideInLeft",
  type: "entrance",
  defaultDuration: 30,
  defaultEasing: "easeOutCubic",
  generate: ({ duration, easing = "easeOutCubic", canvasSize }) => {
    const offset = -(canvasSize?.width ?? 500);
    return [
      { frame: 0, properties: { x: offset }, easing },
      { frame: duration, properties: { x: 0 } }
    ];
  }
};
var slideInRight = {
  name: "slideInRight",
  type: "entrance",
  defaultDuration: 30,
  defaultEasing: "easeOutCubic",
  generate: ({ duration, easing = "easeOutCubic", canvasSize }) => {
    const offset = canvasSize?.width ?? 500;
    return [
      { frame: 0, properties: { x: offset }, easing },
      { frame: duration, properties: { x: 0 } }
    ];
  }
};
var scaleIn = {
  name: "scaleIn",
  type: "entrance",
  defaultDuration: 30,
  defaultEasing: "easeOutCubic",
  generate: ({ duration, easing = "easeOutCubic" }) => [
    { frame: 0, properties: { opacity: 0, scaleX: 0, scaleY: 0 }, easing },
    { frame: duration, properties: { opacity: 1, scaleX: 1, scaleY: 1 } }
  ]
};
var zoomIn = {
  name: "zoomIn",
  type: "entrance",
  defaultDuration: 30,
  defaultEasing: "easeOutCubic",
  generate: ({ duration, easing = "easeOutCubic" }) => [
    { frame: 0, properties: { opacity: 0, scaleX: 0.3, scaleY: 0.3 }, easing },
    { frame: duration, properties: { opacity: 1, scaleX: 1, scaleY: 1 } }
  ]
};
var rotateIn = {
  name: "rotateIn",
  type: "entrance",
  defaultDuration: 30,
  defaultEasing: "easeOutCubic",
  generate: ({ duration, easing = "easeOutCubic" }) => [
    { frame: 0, properties: { opacity: 0, rotation: -180 }, easing },
    { frame: duration, properties: { opacity: 1, rotation: 0 } }
  ]
};
var bounceIn = {
  name: "bounceIn",
  type: "entrance",
  defaultDuration: 45,
  defaultEasing: "easeOutBounce",
  generate: ({ duration, easing = "easeOutBounce" }) => [
    { frame: 0, properties: { opacity: 0, scaleX: 0.3, scaleY: 0.3 }, easing },
    { frame: duration, properties: { opacity: 1, scaleX: 1, scaleY: 1 } }
  ]
};
var fadeOut = {
  name: "fadeOut",
  type: "exit",
  defaultDuration: 30,
  defaultEasing: "easeInCubic",
  generate: ({ duration, easing = "easeInCubic" }) => [
    { frame: 0, properties: { opacity: 1 }, easing },
    { frame: duration, properties: { opacity: 0 } }
  ]
};
var fadeOutUp = {
  name: "fadeOutUp",
  type: "exit",
  defaultDuration: 30,
  defaultEasing: "easeInCubic",
  generate: ({ duration, easing = "easeInCubic" }) => [
    { frame: 0, properties: { opacity: 1, y: 0 }, easing },
    { frame: duration, properties: { opacity: 0, y: -50 } }
  ]
};
var fadeOutDown = {
  name: "fadeOutDown",
  type: "exit",
  defaultDuration: 30,
  defaultEasing: "easeInCubic",
  generate: ({ duration, easing = "easeInCubic" }) => [
    { frame: 0, properties: { opacity: 1, y: 0 }, easing },
    { frame: duration, properties: { opacity: 0, y: 50 } }
  ]
};
var scaleOut = {
  name: "scaleOut",
  type: "exit",
  defaultDuration: 30,
  defaultEasing: "easeInCubic",
  generate: ({ duration, easing = "easeInCubic" }) => [
    { frame: 0, properties: { opacity: 1, scaleX: 1, scaleY: 1 }, easing },
    { frame: duration, properties: { opacity: 0, scaleX: 0, scaleY: 0 } }
  ]
};
var zoomOut = {
  name: "zoomOut",
  type: "exit",
  defaultDuration: 30,
  defaultEasing: "easeInCubic",
  generate: ({ duration, easing = "easeInCubic" }) => [
    { frame: 0, properties: { opacity: 1, scaleX: 1, scaleY: 1 }, easing },
    { frame: duration, properties: { opacity: 0, scaleX: 0.3, scaleY: 0.3 } }
  ]
};
var pulse = {
  name: "pulse",
  type: "emphasis",
  defaultDuration: 30,
  defaultEasing: "easeInOutSine",
  generate: ({ duration, easing = "easeInOutSine" }) => [
    { frame: 0, properties: { scaleX: 1, scaleY: 1 }, easing },
    { frame: duration / 2, properties: { scaleX: 1.1, scaleY: 1.1 }, easing },
    { frame: duration, properties: { scaleX: 1, scaleY: 1 } }
  ]
};
var shake = {
  name: "shake",
  type: "emphasis",
  defaultDuration: 30,
  defaultEasing: "linear",
  generate: ({ duration }) => {
    const step = duration / 10;
    return [
      { frame: 0, properties: { x: 0 } },
      { frame: step, properties: { x: -10 } },
      { frame: step * 2, properties: { x: 10 } },
      { frame: step * 3, properties: { x: -10 } },
      { frame: step * 4, properties: { x: 10 } },
      { frame: step * 5, properties: { x: -10 } },
      { frame: step * 6, properties: { x: 10 } },
      { frame: step * 7, properties: { x: -10 } },
      { frame: step * 8, properties: { x: 10 } },
      { frame: step * 9, properties: { x: -5 } },
      { frame: duration, properties: { x: 0 } }
    ];
  }
};
var bounce = {
  name: "bounce",
  type: "emphasis",
  defaultDuration: 30,
  defaultEasing: "easeOutBounce",
  generate: ({ duration, easing = "easeOutBounce" }) => [
    { frame: 0, properties: { y: 0 }, easing },
    { frame: duration / 3, properties: { y: -30 }, easing },
    { frame: duration, properties: { y: 0 } }
  ]
};
var spin = {
  name: "spin",
  type: "emphasis",
  defaultDuration: 30,
  defaultEasing: "linear",
  generate: ({ duration, easing = "linear" }) => [
    { frame: 0, properties: { rotation: 0 }, easing },
    { frame: duration, properties: { rotation: 360 } }
  ]
};
var heartbeat = {
  name: "heartbeat",
  type: "emphasis",
  defaultDuration: 30,
  defaultEasing: "easeInOutSine",
  generate: ({ duration, easing = "easeInOutSine" }) => [
    { frame: 0, properties: { scaleX: 1, scaleY: 1 }, easing },
    { frame: duration * 0.14, properties: { scaleX: 1.3, scaleY: 1.3 }, easing },
    { frame: duration * 0.28, properties: { scaleX: 1, scaleY: 1 }, easing },
    { frame: duration * 0.42, properties: { scaleX: 1.3, scaleY: 1.3 }, easing },
    { frame: duration * 0.7, properties: { scaleX: 1, scaleY: 1 } },
    { frame: duration, properties: { scaleX: 1, scaleY: 1 } }
  ]
};
var float = {
  name: "float",
  type: "emphasis",
  defaultDuration: 60,
  defaultEasing: "easeInOutSine",
  generate: ({ duration, easing = "easeInOutSine" }) => [
    { frame: 0, properties: { y: 0 }, easing },
    { frame: duration / 2, properties: { y: -10 }, easing },
    { frame: duration, properties: { y: 0 } }
  ]
};
var flipInX = {
  name: "flipInX",
  type: "entrance",
  defaultDuration: 30,
  defaultEasing: "easeOutCubic",
  generate: ({ duration, easing = "easeOutCubic" }) => [
    { frame: 0, properties: { opacity: 0, scaleY: 0, rotation: 90 }, easing },
    { frame: duration, properties: { opacity: 1, scaleY: 1, rotation: 0 } }
  ]
};
var flipInY = {
  name: "flipInY",
  type: "entrance",
  defaultDuration: 30,
  defaultEasing: "easeOutCubic",
  generate: ({ duration, easing = "easeOutCubic" }) => [
    { frame: 0, properties: { opacity: 0, scaleX: 0, rotation: 90 }, easing },
    { frame: duration, properties: { opacity: 1, scaleX: 1, rotation: 0 } }
  ]
};
var rollIn = {
  name: "rollIn",
  type: "entrance",
  defaultDuration: 35,
  defaultEasing: "easeOutCubic",
  generate: ({ duration, easing = "easeOutCubic", canvasSize }) => {
    const offset = -(canvasSize?.width ?? 500);
    return [
      { frame: 0, properties: { opacity: 0, x: offset, rotation: -120 }, easing },
      { frame: duration, properties: { opacity: 1, x: 0, rotation: 0 } }
    ];
  }
};
var lightSpeedIn = {
  name: "lightSpeedIn",
  type: "entrance",
  defaultDuration: 25,
  defaultEasing: "easeOutQuint",
  generate: ({ duration, easing = "easeOutQuint", canvasSize }) => {
    const offset = canvasSize?.width ?? 500;
    return [
      { frame: 0, properties: { opacity: 0, x: offset, scaleX: 1.5 }, easing },
      { frame: duration, properties: { opacity: 1, x: 0, scaleX: 1 } }
    ];
  }
};
var swingIn = {
  name: "swingIn",
  type: "entrance",
  defaultDuration: 40,
  defaultEasing: "easeOutElastic",
  generate: ({ duration, easing = "easeOutElastic" }) => [
    { frame: 0, properties: { opacity: 0, rotation: -45 }, easing },
    { frame: duration, properties: { opacity: 1, rotation: 0 } }
  ]
};
var backIn = {
  name: "backIn",
  type: "entrance",
  defaultDuration: 30,
  defaultEasing: "easeOutBack",
  generate: ({ duration, easing = "easeOutBack" }) => [
    { frame: 0, properties: { opacity: 0, scaleX: 0.7, scaleY: 0.7 }, easing },
    { frame: duration, properties: { opacity: 1, scaleX: 1, scaleY: 1 } }
  ]
};
var elasticIn = {
  name: "elasticIn",
  type: "entrance",
  defaultDuration: 45,
  defaultEasing: "easeOutElastic",
  generate: ({ duration, easing = "easeOutElastic" }) => [
    { frame: 0, properties: { opacity: 0, scaleX: 0.3, scaleY: 0.3 }, easing },
    { frame: duration, properties: { opacity: 1, scaleX: 1, scaleY: 1 } }
  ]
};
var slideInFromTopLeft = {
  name: "slideInFromTopLeft",
  type: "entrance",
  defaultDuration: 30,
  defaultEasing: "easeOutCubic",
  generate: ({ duration, easing = "easeOutCubic", canvasSize }) => {
    const offsetX = -(canvasSize?.width ?? 500);
    const offsetY = -(canvasSize?.height ?? 500);
    return [
      { frame: 0, properties: { x: offsetX, y: offsetY }, easing },
      { frame: duration, properties: { x: 0, y: 0 } }
    ];
  }
};
var slideInFromTopRight = {
  name: "slideInFromTopRight",
  type: "entrance",
  defaultDuration: 30,
  defaultEasing: "easeOutCubic",
  generate: ({ duration, easing = "easeOutCubic", canvasSize }) => {
    const offsetX = canvasSize?.width ?? 500;
    const offsetY = -(canvasSize?.height ?? 500);
    return [
      { frame: 0, properties: { x: offsetX, y: offsetY }, easing },
      { frame: duration, properties: { x: 0, y: 0 } }
    ];
  }
};
var slideInFromBottomLeft = {
  name: "slideInFromBottomLeft",
  type: "entrance",
  defaultDuration: 30,
  defaultEasing: "easeOutCubic",
  generate: ({ duration, easing = "easeOutCubic", canvasSize }) => {
    const offsetX = -(canvasSize?.width ?? 500);
    const offsetY = canvasSize?.height ?? 500;
    return [
      { frame: 0, properties: { x: offsetX, y: offsetY }, easing },
      { frame: duration, properties: { x: 0, y: 0 } }
    ];
  }
};
var slideInFromBottomRight = {
  name: "slideInFromBottomRight",
  type: "entrance",
  defaultDuration: 30,
  defaultEasing: "easeOutCubic",
  generate: ({ duration, easing = "easeOutCubic", canvasSize }) => {
    const offsetX = canvasSize?.width ?? 500;
    const offsetY = canvasSize?.height ?? 500;
    return [
      { frame: 0, properties: { x: offsetX, y: offsetY }, easing },
      { frame: duration, properties: { x: 0, y: 0 } }
    ];
  }
};
var flipOutX = {
  name: "flipOutX",
  type: "exit",
  defaultDuration: 30,
  defaultEasing: "easeInCubic",
  generate: ({ duration, easing = "easeInCubic" }) => [
    { frame: 0, properties: { opacity: 1, scaleY: 1, rotation: 0 }, easing },
    { frame: duration, properties: { opacity: 0, scaleY: 0, rotation: -90 } }
  ]
};
var flipOutY = {
  name: "flipOutY",
  type: "exit",
  defaultDuration: 30,
  defaultEasing: "easeInCubic",
  generate: ({ duration, easing = "easeInCubic" }) => [
    { frame: 0, properties: { opacity: 1, scaleX: 1, rotation: 0 }, easing },
    { frame: duration, properties: { opacity: 0, scaleX: 0, rotation: -90 } }
  ]
};
var rollOut = {
  name: "rollOut",
  type: "exit",
  defaultDuration: 35,
  defaultEasing: "easeInCubic",
  generate: ({ duration, easing = "easeInCubic", canvasSize }) => {
    const offset = canvasSize?.width ?? 500;
    return [
      { frame: 0, properties: { opacity: 1, x: 0, rotation: 0 }, easing },
      { frame: duration, properties: { opacity: 0, x: offset, rotation: 120 } }
    ];
  }
};
var lightSpeedOut = {
  name: "lightSpeedOut",
  type: "exit",
  defaultDuration: 25,
  defaultEasing: "easeInQuint",
  generate: ({ duration, easing = "easeInQuint", canvasSize }) => {
    const offset = canvasSize?.width ?? 500;
    return [
      { frame: 0, properties: { opacity: 1, x: 0, scaleX: 1 }, easing },
      { frame: duration, properties: { opacity: 0, x: offset, scaleX: 0.7 } }
    ];
  }
};
var swingOut = {
  name: "swingOut",
  type: "exit",
  defaultDuration: 40,
  defaultEasing: "easeInElastic",
  generate: ({ duration, easing = "easeInElastic" }) => [
    { frame: 0, properties: { opacity: 1, rotation: 0 }, easing },
    { frame: duration, properties: { opacity: 0, rotation: 45 } }
  ]
};
var backOut = {
  name: "backOut",
  type: "exit",
  defaultDuration: 30,
  defaultEasing: "easeInBack",
  generate: ({ duration, easing = "easeInBack" }) => [
    { frame: 0, properties: { opacity: 1, scaleX: 1, scaleY: 1 }, easing },
    { frame: duration, properties: { opacity: 0, scaleX: 0.7, scaleY: 0.7 } }
  ]
};
var elasticOut = {
  name: "elasticOut",
  type: "exit",
  defaultDuration: 45,
  defaultEasing: "easeInElastic",
  generate: ({ duration, easing = "easeInElastic" }) => [
    { frame: 0, properties: { opacity: 1, scaleX: 1, scaleY: 1 }, easing },
    { frame: duration, properties: { opacity: 0, scaleX: 0.3, scaleY: 0.3 } }
  ]
};
var fadeOutLeft = {
  name: "fadeOutLeft",
  type: "exit",
  defaultDuration: 30,
  defaultEasing: "easeInCubic",
  generate: ({ duration, easing = "easeInCubic" }) => [
    { frame: 0, properties: { opacity: 1, x: 0 }, easing },
    { frame: duration, properties: { opacity: 0, x: -50 } }
  ]
};
var fadeOutRight = {
  name: "fadeOutRight",
  type: "exit",
  defaultDuration: 30,
  defaultEasing: "easeInCubic",
  generate: ({ duration, easing = "easeInCubic" }) => [
    { frame: 0, properties: { opacity: 1, x: 0 }, easing },
    { frame: duration, properties: { opacity: 0, x: 50 } }
  ]
};
var wobble = {
  name: "wobble",
  type: "emphasis",
  defaultDuration: 40,
  defaultEasing: "linear",
  generate: ({ duration }) => {
    const step = duration / 8;
    return [
      { frame: 0, properties: { x: 0, rotation: 0 } },
      { frame: step, properties: { x: -10, rotation: -5 } },
      { frame: step * 2, properties: { x: 10, rotation: 5 } },
      { frame: step * 3, properties: { x: -8, rotation: -3 } },
      { frame: step * 4, properties: { x: 8, rotation: 3 } },
      { frame: step * 5, properties: { x: -5, rotation: -2 } },
      { frame: step * 6, properties: { x: 5, rotation: 2 } },
      { frame: step * 7, properties: { x: -2, rotation: -1 } },
      { frame: duration, properties: { x: 0, rotation: 0 } }
    ];
  }
};
var flash = {
  name: "flash",
  type: "emphasis",
  defaultDuration: 20,
  defaultEasing: "linear",
  generate: ({ duration }) => {
    const step = duration / 4;
    return [
      { frame: 0, properties: { opacity: 1 } },
      { frame: step, properties: { opacity: 0 } },
      { frame: step * 2, properties: { opacity: 1 } },
      { frame: step * 3, properties: { opacity: 0 } },
      { frame: duration, properties: { opacity: 1 } }
    ];
  }
};
var jello = {
  name: "jello",
  type: "emphasis",
  defaultDuration: 40,
  defaultEasing: "easeInOutSine",
  generate: ({ duration, easing = "easeInOutSine" }) => {
    const step = duration / 6;
    return [
      { frame: 0, properties: { scaleX: 1, scaleY: 1 }, easing },
      { frame: step, properties: { scaleX: 0.9, scaleY: 1.1 }, easing },
      { frame: step * 2, properties: { scaleX: 1.1, scaleY: 0.9 }, easing },
      { frame: step * 3, properties: { scaleX: 0.95, scaleY: 1.05 }, easing },
      { frame: step * 4, properties: { scaleX: 1.05, scaleY: 0.95 }, easing },
      { frame: step * 5, properties: { scaleX: 0.98, scaleY: 1.02 }, easing },
      { frame: duration, properties: { scaleX: 1, scaleY: 1 } }
    ];
  }
};
var rubberBand = {
  name: "rubberBand",
  type: "emphasis",
  defaultDuration: 40,
  defaultEasing: "easeInOutSine",
  generate: ({ duration, easing = "easeInOutSine" }) => {
    const step = duration / 6;
    return [
      { frame: 0, properties: { scaleX: 1, scaleY: 1 }, easing },
      { frame: step, properties: { scaleX: 1.25, scaleY: 0.75 }, easing },
      { frame: step * 2, properties: { scaleX: 0.75, scaleY: 1.25 }, easing },
      { frame: step * 3, properties: { scaleX: 1.15, scaleY: 0.85 }, easing },
      { frame: step * 4, properties: { scaleX: 0.95, scaleY: 1.05 }, easing },
      { frame: step * 5, properties: { scaleX: 1.05, scaleY: 0.95 }, easing },
      { frame: duration, properties: { scaleX: 1, scaleY: 1 } }
    ];
  }
};
var tada = {
  name: "tada",
  type: "emphasis",
  defaultDuration: 40,
  defaultEasing: "easeInOutSine",
  generate: ({ duration, easing = "easeInOutSine" }) => {
    const step = duration / 10;
    return [
      { frame: 0, properties: { scaleX: 1, scaleY: 1, rotation: 0 }, easing },
      { frame: step, properties: { scaleX: 0.9, scaleY: 0.9, rotation: -3 }, easing },
      { frame: step * 2, properties: { scaleX: 0.9, scaleY: 0.9, rotation: -3 }, easing },
      { frame: step * 3, properties: { scaleX: 1.1, scaleY: 1.1, rotation: 3 }, easing },
      { frame: step * 4, properties: { scaleX: 1.1, scaleY: 1.1, rotation: -3 }, easing },
      { frame: step * 5, properties: { scaleX: 1.1, scaleY: 1.1, rotation: 3 }, easing },
      { frame: step * 6, properties: { scaleX: 1.1, scaleY: 1.1, rotation: -3 }, easing },
      { frame: step * 7, properties: { scaleX: 1.1, scaleY: 1.1, rotation: 3 }, easing },
      { frame: step * 8, properties: { scaleX: 1.1, scaleY: 1.1, rotation: -3 }, easing },
      { frame: step * 9, properties: { scaleX: 1.1, scaleY: 1.1, rotation: 3 }, easing },
      { frame: duration, properties: { scaleX: 1, scaleY: 1, rotation: 0 } }
    ];
  }
};
var swing = {
  name: "swing",
  type: "emphasis",
  defaultDuration: 40,
  defaultEasing: "easeInOutSine",
  generate: ({ duration, easing = "easeInOutSine" }) => {
    const step = duration / 4;
    return [
      { frame: 0, properties: { rotation: 0 }, easing },
      { frame: step, properties: { rotation: 15 }, easing },
      { frame: step * 2, properties: { rotation: -10 }, easing },
      { frame: step * 3, properties: { rotation: 5 }, easing },
      { frame: duration, properties: { rotation: 0 } }
    ];
  }
};
var presets = {
  // Entrance - Basic
  fadeIn,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  slideInUp,
  slideInDown,
  slideInLeft,
  slideInRight,
  scaleIn,
  zoomIn,
  rotateIn,
  bounceIn,
  // Entrance - Advanced
  flipInX,
  flipInY,
  rollIn,
  lightSpeedIn,
  swingIn,
  backIn,
  elasticIn,
  slideInFromTopLeft,
  slideInFromTopRight,
  slideInFromBottomLeft,
  slideInFromBottomRight,
  // Exit - Basic
  fadeOut,
  fadeOutUp,
  fadeOutDown,
  fadeOutLeft,
  fadeOutRight,
  scaleOut,
  zoomOut,
  // Exit - Advanced
  flipOutX,
  flipOutY,
  rollOut,
  lightSpeedOut,
  swingOut,
  backOut,
  elasticOut,
  // Emphasis
  pulse,
  shake,
  bounce,
  spin,
  heartbeat,
  float,
  wobble,
  flash,
  jello,
  rubberBand,
  tada,
  swing
};
function getPreset(name) {
  return presets[name];
}
function getAllPresetNames() {
  return Object.keys(presets);
}
function getPresetsByType(type) {
  return Object.values(presets).filter((p) => p.type === type);
}
function generatePresetKeyframes(name, options) {
  const preset = presets[name];
  if (!preset) return [];
  return preset.generate(options);
}

// src/engine.ts
var DefaultComponentRegistry = class {
  components = /* @__PURE__ */ new Map();
  register(name, component, schema) {
    this.components.set(name, {
      component,
      info: { name, propsSchema: schema }
    });
  }
  get(name) {
    return this.components.get(name)?.component;
  }
  list() {
    return Array.from(this.components.values()).map((c) => c.info);
  }
  async registerFromUrl(name, url) {
    throw new Error(`Dynamic component loading not yet implemented: ${name} from ${url}`);
  }
  registerFromCode(name, code) {
    throw new Error(`Inline component loading not yet implemented: ${name}`);
  }
  unregister(name) {
    return this.components.delete(name);
  }
  has(name) {
    return this.components.has(name);
  }
};
var globalRegistry = null;
function getDefaultRegistry() {
  if (!globalRegistry) {
    globalRegistry = new DefaultComponentRegistry();
  }
  return globalRegistry;
}
var RendervidEngine = class {
  options;
  _components;
  activeRenders = /* @__PURE__ */ new Map();
  constructor(options = {}) {
    this.options = {
      renderer: "auto",
      maxConcurrentRenders: 4,
      ...options
    };
    this._components = options.components ?? new DefaultComponentRegistry();
  }
  /**
   * Get the component registry.
   */
  get components() {
    return this._components;
  }
  /**
   * Get engine capabilities.
   */
  getCapabilities() {
    const runtime = typeof window !== "undefined" ? "browser" : "node";
    return {
      version: "0.1.0",
      elements: this.getElementCapabilities(),
      customComponents: Object.fromEntries(
        this._components.list().map((c) => [c.name, c])
      ),
      animations: {
        entrance: getPresetsByType("entrance").map((p) => p.name),
        exit: getPresetsByType("exit").map((p) => p.name),
        emphasis: getPresetsByType("emphasis").map((p) => p.name)
      },
      easings: getAllEasingNames(),
      blendModes: [
        "normal",
        "multiply",
        "screen",
        "overlay",
        "darken",
        "lighten",
        "color-dodge",
        "color-burn",
        "hard-light",
        "soft-light",
        "difference",
        "exclusion"
      ],
      filters: [
        "blur",
        "brightness",
        "contrast",
        "grayscale",
        "hue-rotate",
        "invert",
        "opacity",
        "saturate",
        "sepia",
        "drop-shadow"
      ],
      fonts: {
        builtin: ["Inter", "Roboto", "Open Sans", "Lato", "Montserrat"],
        googleFonts: true,
        customFonts: true
      },
      output: {
        video: {
          formats: ["mp4", "webm", "mov", "gif"],
          codecs: ["h264", "h265", "vp8", "vp9", "av1", "prores"],
          maxWidth: 7680,
          maxHeight: 4320,
          maxDuration: 3600,
          maxFps: 120
        },
        image: {
          formats: ["png", "jpeg", "webp"],
          maxWidth: 7680,
          maxHeight: 4320
        }
      },
      runtime,
      features: {
        tailwind: true,
        customComponents: true,
        webgl: runtime === "browser",
        webcodecs: runtime === "browser" && "VideoEncoder" in globalThis
      }
    };
  }
  /**
   * Get element capabilities.
   */
  getElementCapabilities() {
    return {
      image: {
        description: "Display an image with fit and positioning options",
        category: "visual",
        props: {
          type: "object",
          properties: {
            src: { type: "string", description: "Image URL" },
            fit: { type: "string", enum: ["cover", "contain", "fill", "none"] },
            objectPosition: { type: "string" }
          },
          required: ["src"]
        },
        allowChildren: false,
        animatable: true,
        example: {
          id: "image-1",
          type: "image",
          position: { x: 0, y: 0 },
          size: { width: 400, height: 300 },
          props: { src: "https://example.com/image.jpg", fit: "cover" }
        }
      },
      video: {
        description: "Play a video with playback controls",
        category: "visual",
        props: {
          type: "object",
          properties: {
            src: { type: "string" },
            fit: { type: "string", enum: ["cover", "contain", "fill"] },
            loop: { type: "boolean" },
            muted: { type: "boolean" },
            playbackRate: { type: "number" },
            startTime: { type: "number" },
            endTime: { type: "number" },
            volume: { type: "number", minimum: 0, maximum: 1 }
          },
          required: ["src"]
        },
        allowChildren: false,
        animatable: true,
        example: {
          id: "video-1",
          type: "video",
          position: { x: 0, y: 0 },
          size: { width: 1920, height: 1080 },
          props: { src: "https://example.com/video.mp4", fit: "cover" }
        }
      },
      text: {
        description: "Display text with rich typography options",
        category: "visual",
        props: {
          type: "object",
          properties: {
            text: { type: "string" },
            fontFamily: { type: "string" },
            fontSize: { type: "number" },
            fontWeight: { type: "string" },
            color: { type: "string" },
            textAlign: { type: "string", enum: ["left", "center", "right", "justify"] }
          },
          required: ["text"]
        },
        allowChildren: false,
        animatable: true,
        example: {
          id: "text-1",
          type: "text",
          position: { x: 100, y: 100 },
          size: { width: 800, height: 100 },
          props: { text: "Hello World", fontSize: 48, color: "#ffffff" }
        }
      },
      shape: {
        description: "Draw shapes with fill and stroke",
        category: "visual",
        props: {
          type: "object",
          properties: {
            shape: { type: "string", enum: ["rectangle", "ellipse", "polygon", "star", "path"] },
            fill: { type: "string" },
            stroke: { type: "string" },
            strokeWidth: { type: "number" },
            borderRadius: { type: "number" }
          },
          required: ["shape"]
        },
        allowChildren: false,
        animatable: true,
        example: {
          id: "shape-1",
          type: "shape",
          position: { x: 100, y: 100 },
          size: { width: 200, height: 200 },
          props: { shape: "rectangle", fill: "#3B82F6", borderRadius: 16 }
        }
      },
      audio: {
        description: "Play audio with volume and fade controls",
        category: "audio",
        props: {
          type: "object",
          properties: {
            src: { type: "string" },
            volume: { type: "number", minimum: 0, maximum: 1 },
            loop: { type: "boolean" },
            startTime: { type: "number" },
            fadeIn: { type: "number" },
            fadeOut: { type: "number" }
          },
          required: ["src"]
        },
        allowChildren: false,
        animatable: false,
        example: {
          id: "audio-1",
          type: "audio",
          position: { x: 0, y: 0 },
          size: { width: 0, height: 0 },
          props: { src: "https://example.com/audio.mp3", volume: 1 }
        }
      },
      group: {
        description: "Container for grouping layers",
        category: "container",
        props: {
          type: "object",
          properties: {
            clip: { type: "boolean" }
          }
        },
        allowChildren: true,
        animatable: true,
        example: {
          id: "group-1",
          type: "group",
          position: { x: 0, y: 0 },
          size: { width: 400, height: 300 },
          props: { clip: true },
          children: []
        }
      },
      lottie: {
        description: "Play Lottie animation",
        category: "visual",
        props: {
          type: "object",
          properties: {
            data: { oneOf: [{ type: "object" }, { type: "string" }] },
            loop: { type: "boolean" },
            speed: { type: "number" },
            direction: { type: "integer", enum: [1, -1] }
          },
          required: ["data"]
        },
        allowChildren: false,
        animatable: true,
        example: {
          id: "lottie-1",
          type: "lottie",
          position: { x: 100, y: 100 },
          size: { width: 200, height: 200 },
          props: { data: "https://example.com/animation.json", loop: true }
        }
      },
      custom: {
        description: "Render a custom React component",
        category: "visual",
        props: {
          type: "object",
          additionalProperties: true
        },
        allowChildren: false,
        animatable: true,
        example: {
          id: "custom-1",
          type: "custom",
          position: { x: 100, y: 100 },
          size: { width: 400, height: 300 },
          customComponent: { name: "MyComponent", props: {} },
          props: {}
        }
      }
    };
  }
  /**
   * Get JSON Schema for template validation.
   */
  getTemplateSchema() {
    return getTemplateSchema();
  }
  /**
   * Get schema for a specific element type.
   */
  getElementSchema(type) {
    return getLayerSchema();
  }
  /**
   * Validate a template.
   */
  validateTemplate(template) {
    return validateTemplate(template);
  }
  /**
   * Validate inputs against a template.
   */
  validateInputs(template, inputs) {
    return validateInputs(template, inputs);
  }
  /**
   * Render a video.
   * Requires @rendervid/renderer-browser or @rendervid/renderer-node.
   */
  async renderVideo(_options) {
    throw new Error(
      "Video rendering requires a renderer package. Install @rendervid/renderer-browser or @rendervid/renderer-node."
    );
  }
  /**
   * Render a video with progress updates.
   */
  async renderVideoWithProgress(options, _onProgress) {
    return this.renderVideo(options);
  }
  /**
   * Render an image.
   * Requires @rendervid/renderer-browser or @rendervid/renderer-node.
   */
  async renderImage(_options) {
    throw new Error(
      "Image rendering requires a renderer package. Install @rendervid/renderer-browser or @rendervid/renderer-node."
    );
  }
  /**
   * Cancel an in-progress render.
   */
  cancelRender(renderId) {
    const controller = this.activeRenders.get(renderId);
    if (controller) {
      controller.abort();
      this.activeRenders.delete(renderId);
    }
  }
};

// src/types/composition.ts
function getCompositionDuration(composition) {
  if (composition.scenes.length === 0) return 0;
  return Math.max(...composition.scenes.map((s) => s.endFrame));
}
function getSceneAtFrame(composition, frame) {
  return composition.scenes.find(
    (scene) => frame >= scene.startFrame && frame < scene.endFrame
  );
}
function validateSceneOrder(scenes) {
  for (let i = 0; i < scenes.length - 1; i++) {
    const current = scenes[i];
    const next = scenes[i + 1];
    if (current.endFrame > next.startFrame) {
      return false;
    }
  }
  return true;
}

// src/types/filter.ts
function filterToCSS(filter) {
  const { type, value } = filter;
  switch (type) {
    case "blur":
      return `blur(${value}px)`;
    case "brightness":
      return `brightness(${value})`;
    case "contrast":
      return `contrast(${value})`;
    case "grayscale":
      return `grayscale(${value}%)`;
    case "hue-rotate":
      return `hue-rotate(${value}deg)`;
    case "invert":
      return `invert(${value}%)`;
    case "opacity":
      return `opacity(${value})`;
    case "saturate":
      return `saturate(${value})`;
    case "sepia":
      return `sepia(${value}%)`;
    case "drop-shadow":
      return `drop-shadow(${value})`;
    default:
      return "";
  }
}
function filtersToCSS(filters) {
  return filters.map(filterToCSS).filter(Boolean).join(" ");
}

// src/types/motion-blur.ts
var MOTION_BLUR_QUALITY_PRESETS = {
  low: { samples: 5, shutterAngle: 180 },
  medium: { samples: 10, shutterAngle: 180 },
  high: { samples: 16, shutterAngle: 180 },
  ultra: { samples: 32, shutterAngle: 180 }
};
var DEFAULT_MOTION_BLUR_CONFIG = {
  enabled: false,
  shutterAngle: 180,
  samples: 10,
  quality: "medium",
  adaptive: false,
  minSamples: 3,
  motionThreshold: 0.01,
  stochastic: false,
  blurAmount: 1,
  blurAxis: "both",
  variableSampleRate: false,
  maxSamples: 10,
  preview: false
};
function resolveMotionBlurConfig(config) {
  if (!config) {
    return { ...DEFAULT_MOTION_BLUR_CONFIG };
  }
  const resolved = { ...DEFAULT_MOTION_BLUR_CONFIG };
  if (config.quality) {
    const preset = MOTION_BLUR_QUALITY_PRESETS[config.quality];
    if (config.samples === void 0) {
      resolved.samples = preset.samples;
    }
    if (config.shutterAngle === void 0) {
      resolved.shutterAngle = preset.shutterAngle;
    }
    resolved.quality = config.quality;
  }
  Object.assign(resolved, config);
  return resolved;
}
function validateMotionBlurConfig(config) {
  const errors = [];
  if (config.shutterAngle !== void 0) {
    if (config.shutterAngle < 0 || config.shutterAngle > 360) {
      errors.push("shutterAngle must be between 0 and 360 degrees");
    }
  }
  if (config.samples !== void 0) {
    if (!Number.isInteger(config.samples)) {
      errors.push("samples must be an integer");
    } else if (config.samples < 2 || config.samples > 32) {
      errors.push("samples must be between 2 and 32");
    }
  }
  if (config.minSamples !== void 0) {
    if (!Number.isInteger(config.minSamples)) {
      errors.push("minSamples must be an integer");
    } else if (config.minSamples < 2) {
      errors.push("minSamples must be at least 2");
    }
    if (config.samples !== void 0 && config.minSamples > config.samples) {
      errors.push("minSamples must be less than or equal to samples");
    }
  }
  if (config.motionThreshold !== void 0) {
    if (config.motionThreshold < 1e-4 || config.motionThreshold > 1) {
      errors.push("motionThreshold must be between 0.0001 and 1.0");
    }
  }
  if (config.quality !== void 0) {
    const validQualities = ["low", "medium", "high", "ultra"];
    if (!validQualities.includes(config.quality)) {
      errors.push(`quality must be one of: ${validQualities.join(", ")}`);
    }
  }
  if (config.blurAmount !== void 0) {
    if (config.blurAmount < 0 || config.blurAmount > 2) {
      errors.push("blurAmount must be between 0 and 2");
    }
  }
  if (config.blurAxis !== void 0) {
    const validAxes = ["x", "y", "both"];
    if (!validAxes.includes(config.blurAxis)) {
      errors.push(`blurAxis must be one of: ${validAxes.join(", ")}`);
    }
  }
  if (config.maxSamples !== void 0) {
    if (!Number.isInteger(config.maxSamples)) {
      errors.push("maxSamples must be an integer");
    } else if (config.maxSamples < 2 || config.maxSamples > 32) {
      errors.push("maxSamples must be between 2 and 32");
    }
    if (config.samples !== void 0 && config.maxSamples < config.samples) {
      errors.push("maxSamples must be greater than or equal to samples");
    }
  }
  return errors;
}
function mergeMotionBlurConfigs(global, scene, layer) {
  const configs = [layer, scene, global].filter((c) => c !== void 0);
  if (configs.length === 0) {
    return void 0;
  }
  const hasExplicitDisable = configs.some((c) => c.enabled === false);
  if (hasExplicitDisable) {
    return { enabled: false };
  }
  const merged = { enabled: true };
  for (let i = configs.length - 1; i >= 0; i--) {
    const config = configs[i];
    Object.assign(merged, config);
  }
  return merged;
}

// src/template/TemplateProcessor.ts
var TemplateProcessor = class {
  /**
   * Load custom components from template into registry
   *
   * Processes template.customComponents and registers them with the provided registry.
   * Supports three types:
   * - 'reference': Creates alias to pre-registered component
   * - 'url': Loads component from HTTPS URL
   * - 'inline': Creates component from code string
   *
   * Components are loaded in parallel for performance.
   * Already registered components are skipped to prevent overwrites.
   *
   * @param template - Template containing customComponents definition
   * @param registry - Component registry to register components into
   * @throws Error if component loading fails
   *
   * @example
   * ```typescript
   * await processor.loadCustomComponents(template, registry);
   * // All components from template.customComponents are now available
   * ```
   */
  async loadCustomComponents(template, registry) {
    if (!template.customComponents) {
      return;
    }
    const loadPromises = [];
    for (const [name, definition] of Object.entries(template.customComponents)) {
      if (registry.has(name)) {
        continue;
      }
      loadPromises.push(this.loadComponent(name, definition, registry));
    }
    await Promise.all(loadPromises);
  }
  /**
   * Load a single component from its definition
   *
   * @param name - Component name to register as
   * @param definition - Component definition (reference, url, or inline)
   * @param registry - Component registry to register into
   * @throws Error if component type is invalid or loading fails
   */
  async loadComponent(name, definition, registry) {
    switch (definition.type) {
      case "reference": {
        if (!definition.reference) {
          throw new Error(`Reference missing for component "${name}"`);
        }
        const referencedComponent = registry.get(definition.reference);
        if (!referencedComponent) {
          throw new Error(
            `Referenced component "${definition.reference}" not found for "${name}". Make sure to register it before using this template.`
          );
        }
        registry.register(name, referencedComponent, definition.propsSchema);
        break;
      }
      case "url": {
        if (!definition.url) {
          throw new Error(`URL missing for component "${name}"`);
        }
        await registry.registerFromUrl(name, definition.url);
        break;
      }
      case "inline": {
        if (!definition.code) {
          throw new Error(`Code missing for component "${name}"`);
        }
        registry.registerFromCode(name, definition.code);
        break;
      }
      default: {
        throw new Error(
          `Unknown component type "${definition.type}" for "${name}"`
        );
      }
    }
  }
  /**
   * Resolve input variables in template
   *
   * Replaces all {{key}} placeholders in the template with actual values from inputs.
   * Works recursively through all objects, arrays, and strings in the template.
   *
   * Variable syntax: {{variableName}}
   * - Matches exact input keys
   * - Case-sensitive
   * - Missing variables are left unchanged
   *
   * @param template - Template with {{variable}} placeholders
   * @param inputs - Input values to interpolate
   * @returns New template with all variables resolved
   *
   * @example
   * ```typescript
   * const template = {
   *   name: 'Video',
   *   composition: {
   *     scenes: [{
   *       layers: [{
   *         type: 'text',
   *         text: '{{title}}',
   *         color: '{{color}}'
   *       }]
   *     }]
   *   }
   * };
   *
   * const resolved = processor.resolveInputs(template, {
   *   title: 'Hello World',
   *   color: '#ff0000'
   * });
   * // resolved.composition.scenes[0].layers[0].text === 'Hello World'
   * // resolved.composition.scenes[0].layers[0].color === '#ff0000'
   * ```
   */
  resolveInputs(template, inputs) {
    const cloned = JSON.parse(JSON.stringify(template));
    return this.interpolateObject(cloned, inputs);
  }
  /**
   * Recursively interpolate variables in any object structure
   *
   * @param obj - Object to interpolate
   * @param inputs - Input values
   * @returns Interpolated object
   */
  interpolateObject(obj, inputs) {
    if (typeof obj === "string") {
      return obj.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        const value = inputs[key];
        if (value === void 0) {
          return match;
        }
        return String(value);
      });
    }
    if (Array.isArray(obj)) {
      return obj.map((item) => this.interpolateObject(item, inputs));
    }
    if (obj && typeof obj === "object") {
      const result = {};
      for (const [key, value] of Object.entries(obj)) {
        result[key] = this.interpolateObject(value, inputs);
      }
      return result;
    }
    return obj;
  }
};

// src/component-defaults.ts
var ComponentDefaultsManager = class {
  registry = /* @__PURE__ */ new Map();
  defaultFrameAwareDefaults = {
    optional: {
      animationDuration: 3,
      easing: "easeOutCubic",
      delayFrames: 0,
      opacity: 1
    },
    excludeAutoInject: []
  };
  /**
   * Register a component configuration with defaults and schema
   */
  register(name, config) {
    this.registry.set(name, {
      ...config,
      defaults: {
        ...this.defaultFrameAwareDefaults,
        ...config.defaults
      }
    });
  }
  /**
   * Unregister a component
   */
  unregister(name) {
    return this.registry.delete(name);
  }
  /**
   * Get component configuration
   */
  getConfig(name) {
    return this.registry.get(name);
  }
  /**
   * Get default values for a component
   */
  getDefaults(name) {
    const config = this.registry.get(name);
    if (!config) {
      return this.defaultFrameAwareDefaults;
    }
    return config.defaults || this.defaultFrameAwareDefaults;
  }
  /**
   * Get schema for a component
   */
  getSchema(name) {
    return this.registry.get(name)?.schema;
  }
  /**
   * Resolve component props with defaults and frame-aware props
   *
   * @param componentName - Name of the component
   * @param layerProps - Props provided in the template layer
   * @param frameData - Frame-aware data from renderer
   * @returns Resolved props with defaults applied and validation results
   */
  resolveProps(componentName, layerProps = {}, frameData) {
    const config = this.registry.get(componentName);
    const defaults = config?.defaults || this.defaultFrameAwareDefaults;
    const schema = config?.schema;
    const resolved = {};
    const warnings = [];
    const errors = [];
    if (defaults.optional) {
      Object.assign(resolved, defaults.optional);
    }
    if (defaults.required) {
      Object.assign(resolved, defaults.required);
    }
    Object.assign(resolved, layerProps);
    const excludeList = defaults.excludeAutoInject || [];
    const frameAwareKeys = Object.keys(frameData);
    for (const key of frameAwareKeys) {
      if (!excludeList.includes(key)) {
        resolved[key] = frameData[key];
      }
    }
    if (schema) {
      const validationResult = this.validateProps(resolved, schema);
      errors.push(...validationResult.errors);
      warnings.push(...validationResult.warnings);
    }
    if (defaults.required) {
      for (const requiredProp of Object.keys(defaults.required)) {
        if (!(requiredProp in resolved)) {
          errors.push({
            property: requiredProp,
            value: void 0,
            error: `Required prop "${requiredProp}" is missing`
          });
        }
      }
    }
    return {
      props: resolved,
      warnings,
      errors,
      isValid: errors.length === 0
    };
  }
  /**
   * Validate props against schema
   */
  validateProps(props, schema) {
    const errors = [];
    const warnings = [];
    const properties = schema.properties || {};
    schema.required || [];
    for (const [propName, propValue] of Object.entries(props)) {
      const propSchema = properties[propName];
      if (!propSchema) {
        if (!schema.additionalProperties) {
          warnings.push(
            `Property "${propName}" is not defined in schema and additionalProperties is false`
          );
        }
        continue;
      }
      const typeError = this.validateType(propValue, propSchema);
      if (typeError) {
        errors.push({
          property: propName,
          value: propValue,
          error: typeError,
          schema: propSchema
        });
      }
      if (typeof propValue === "number") {
        if (propSchema.minimum !== void 0 && propValue < propSchema.minimum) {
          errors.push({
            property: propName,
            value: propValue,
            error: `Value ${propValue} is less than minimum ${propSchema.minimum}`,
            schema: propSchema
          });
        }
        if (propSchema.maximum !== void 0 && propValue > propSchema.maximum) {
          errors.push({
            property: propName,
            value: propValue,
            error: `Value ${propValue} is greater than maximum ${propSchema.maximum}`,
            schema: propSchema
          });
        }
      }
      if (typeof propValue === "string") {
        if (propSchema.minLength !== void 0 && propValue.length < propSchema.minLength) {
          errors.push({
            property: propName,
            value: propValue,
            error: `String length ${propValue.length} is less than minimum ${propSchema.minLength}`,
            schema: propSchema
          });
        }
        if (propSchema.maxLength !== void 0 && propValue.length > propSchema.maxLength) {
          errors.push({
            property: propName,
            value: propValue,
            error: `String length ${propValue.length} is greater than maximum ${propSchema.maxLength}`,
            schema: propSchema
          });
        }
      }
      if (propSchema.enum && !propSchema.enum.includes(propValue)) {
        errors.push({
          property: propName,
          value: propValue,
          error: `Value must be one of: ${propSchema.enum.join(", ")}`,
          schema: propSchema
        });
      }
    }
    return { errors, warnings };
  }
  /**
   * Validate type of a value against schema type
   */
  validateType(value, schema) {
    const schemaType = schema.type;
    const actualType = this.getActualType(value);
    if (!schemaType) {
      return null;
    }
    const allowedTypes = Array.isArray(schemaType) ? schemaType : [schemaType];
    if (!allowedTypes.includes(actualType)) {
      return `Expected type ${allowedTypes.join(" or ")}, got ${actualType}`;
    }
    return null;
  }
  /**
   * Get actual type of a value
   */
  getActualType(value) {
    if (value === null) return "null";
    if (Array.isArray(value)) return "array";
    if (value instanceof Object) return "object";
    return typeof value;
  }
  /**
   * Merge multiple prop sets with proper precedence
   *
   * Precedence: layerProps > defaults.required > defaults.optional > frameAwareDefaults
   */
  mergeProps(componentName, ...propSets) {
    const config = this.registry.get(componentName);
    const defaults = config?.defaults || this.defaultFrameAwareDefaults;
    const merged = {};
    if (defaults.optional) {
      Object.assign(merged, defaults.optional);
    }
    if (defaults.required) {
      Object.assign(merged, defaults.required);
    }
    for (const props of propSets) {
      Object.assign(merged, props);
    }
    return merged;
  }
  /**
   * List all registered components
   */
  listComponents() {
    const components = [];
    for (const [name, config] of this.registry.entries()) {
      components.push({
        name,
        description: config.description,
        hasDefaults: !!config.defaults,
        hasSchema: !!config.schema
      });
    }
    return components;
  }
};
function createDefaultComponentDefaultsManager() {
  const manager = new ComponentDefaultsManager();
  manager.register("AnimatedLineChart", {
    name: "AnimatedLineChart",
    description: "Animated line chart for stock prices with gradient and glow effects",
    defaults: {
      optional: {
        animationDuration: 3,
        easing: "easeOutCubic",
        showGrid: true,
        showLabels: true,
        colors: ["#00f2ea", "#ff0050"]
      }
    },
    schema: {
      properties: {
        animationDuration: {
          type: "number",
          description: "Duration of the animation in seconds",
          minimum: 0.1,
          maximum: 10,
          default: 3
        },
        easing: {
          type: "string",
          description: "Animation easing function",
          enum: ["linear", "easeInQuad", "easeOutQuad", "easeOutCubic"],
          default: "easeOutCubic"
        },
        showGrid: {
          type: "boolean",
          description: "Show grid lines in the chart",
          default: true
        },
        showLabels: {
          type: "boolean",
          description: "Show axis labels",
          default: true
        },
        colors: {
          type: "array",
          description: "Gradient colors as hex strings",
          items: { type: "string" }
        },
        frame: {
          type: "number",
          description: "Current animation frame (auto-injected)"
        },
        fps: {
          type: "number",
          description: "Frames per second (auto-injected)"
        },
        layerSize: {
          type: "object",
          description: "Layer dimensions (auto-injected)"
        }
      }
    }
  });
  manager.register("AuroraBackground", {
    name: "AuroraBackground",
    description: "Flowing gradient aurora/northern lights effect",
    defaults: {
      optional: {
        colors: ["#667eea", "#764ba2", "#f093fb", "#4facfe", "#00f2fe"],
        speed: 0.8,
        blur: 40,
        opacity: 0.6,
        width: "100%",
        height: "100%"
      }
    },
    schema: {
      properties: {
        colors: {
          type: "array",
          description: "Aurora colors as hex strings",
          items: { type: "string" }
        },
        speed: {
          type: "number",
          minimum: 0.1,
          maximum: 2,
          default: 0.8,
          description: "Animation speed multiplier"
        },
        blur: {
          type: "number",
          minimum: 10,
          maximum: 80,
          default: 40,
          description: "Blur amount in pixels"
        },
        opacity: {
          type: "number",
          minimum: 0.1,
          maximum: 1,
          default: 0.6,
          description: "Background opacity"
        }
      }
    }
  });
  manager.register("WaveBackground", {
    name: "WaveBackground",
    description: "Animated fluid wave background",
    defaults: {
      optional: {
        colors: ["#0ea5e9", "#06b6d4", "#14b8a6"],
        speed: 0.5,
        waveCount: 3,
        amplitude: 50,
        frequency: 0.02,
        opacity: 1,
        width: "100%",
        height: "100%"
      }
    },
    schema: {
      properties: {
        colors: {
          type: "array",
          description: "Wave colors as hex strings",
          items: { type: "string" }
        },
        speed: {
          type: "number",
          minimum: 0.1,
          maximum: 2,
          default: 0.5
        },
        waveCount: {
          type: "number",
          minimum: 1,
          maximum: 10,
          default: 3
        },
        amplitude: {
          type: "number",
          minimum: 10,
          maximum: 100,
          default: 50
        }
      }
    }
  });
  return manager;
}

// src/component-defaults-integration.ts
var ComponentPropsResolver = class {
  defaultsManager;
  constructor(defaultsManager) {
    this.defaultsManager = defaultsManager || createDefaultComponentDefaultsManager();
  }
  /**
   * Resolve props for a custom layer
   *
   * This should be called before rendering each frame
   */
  resolveLayerProps(layer, frame, fps, totalFrames, sceneDuration, layerWidth, layerHeight) {
    if (layer.type !== "custom" || !layer.customComponent) {
      return {
        props: {},
        warnings: [],
        errors: [],
        isValid: true
      };
    }
    const { name: componentName } = layer.customComponent;
    const layerProps = layer.customComponent.props || {};
    const frameData = {
      frame,
      fps,
      totalFrames,
      layerSize: {
        width: layerWidth,
        height: layerHeight
      },
      sceneDuration
    };
    return this.defaultsManager.resolveProps(
      componentName,
      layerProps,
      frameData
    );
  }
  /**
   * Register component configuration
   */
  registerComponent(name, config) {
    this.defaultsManager.register(name, config);
  }
  /**
   * Get defaults manager for direct access
   */
  getManager() {
    return this.defaultsManager;
  }
};

// src/fonts/types.ts
function isNumericWeight(weight) {
  return typeof weight === "number";
}
function isNamedWeight(weight) {
  return typeof weight === "string";
}
function weightToNumeric(weight) {
  if (isNumericWeight(weight)) {
    return weight;
  }
  const weightMap = {
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900
  };
  return weightMap[weight];
}
function numericToNamedWeight(weight) {
  const weightMap = {
    100: "thin",
    200: "extralight",
    300: "light",
    400: "normal",
    500: "medium",
    600: "semibold",
    700: "bold",
    800: "extrabold",
    900: "black"
  };
  return weightMap[weight];
}
var FontLoadingError = class _FontLoadingError extends Error {
  /**
   * Font family that failed to load
   */
  family;
  /**
   * Original error that caused the failure
   */
  cause;
  constructor(message, family, cause) {
    super(message);
    this.name = "FontLoadingError";
    this.family = family;
    this.cause = cause;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, _FontLoadingError);
    }
  }
};
var FONT_CONSTANTS = {
  /**
   * Default font weights to load if none specified
   */
  DEFAULT_WEIGHTS: [400, 700],
  /**
   * Default font styles to load if none specified
   */
  DEFAULT_STYLES: ["normal"],
  /**
   * Default character subset
   */
  DEFAULT_SUBSET: ["latin"],
  /**
   * Default font display strategy
   */
  DEFAULT_DISPLAY: "swap",
  /**
   * Default font loading strategy
   */
  DEFAULT_LOADING_STRATEGY: "eager",
  /**
   * Default timeout for font loading (10 seconds)
   */
  DEFAULT_TIMEOUT: 1e4,
  /**
   * Maximum file size for font uploads (4MB)
   */
  MAX_UPLOAD_SIZE: 4194304,
  /**
   * Supported font formats in order of preference
   */
  SUPPORTED_FORMATS: ["woff2", "woff", "ttf", "otf"],
  /**
   * Web-safe font fallback stacks
   */
  WEB_SAFE_FALLBACKS: {
    "sans-serif": ["Arial", "Helvetica", "sans-serif"],
    "serif": ["Georgia", "Times New Roman", "serif"],
    "monospace": ["Courier New", "Courier", "monospace"],
    "display": ["Impact", "Arial Black", "sans-serif"],
    "handwriting": ["Comic Sans MS", "cursive"]
  }
};

// src/fonts/FontManager.ts
var FALLBACK_MAP = {
  // Sans-Serif
  Roboto: ["Arial", "Helvetica", "sans-serif"],
  "Open Sans": ["Arial", "Helvetica", "sans-serif"],
  Lato: ["Arial", "Helvetica", "sans-serif"],
  Montserrat: ["Arial", "Helvetica", "sans-serif"],
  Poppins: ["Arial", "Helvetica", "sans-serif"],
  Inter: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Arial", "sans-serif"],
  "Work Sans": ["Arial", "Helvetica", "sans-serif"],
  "Plus Jakarta Sans": ["Arial", "Helvetica", "sans-serif"],
  Nunito: ["Arial", "Helvetica", "sans-serif"],
  Raleway: ["Arial", "Helvetica", "sans-serif"],
  Ubuntu: ["Arial", "Helvetica", "sans-serif"],
  "Source Sans Pro": ["Arial", "Helvetica", "sans-serif"],
  // Serif
  "Playfair Display": ["Georgia", "Times New Roman", "serif"],
  Merriweather: ["Georgia", "Cambria", "serif"],
  Lora: ["Georgia", "Times New Roman", "serif"],
  "PT Serif": ["Georgia", "Times New Roman", "serif"],
  "EB Garamond": ["Garamond", "Georgia", "serif"],
  "Libre Baskerville": ["Baskerville", "Georgia", "serif"],
  "Crimson Text": ["Georgia", "Times New Roman", "serif"],
  // Monospace
  "Roboto Mono": ["Consolas", "Monaco", "Courier New", "monospace"],
  "JetBrains Mono": ["Consolas", "Monaco", "monospace"],
  "Fira Code": ["Cascadia Code", "Consolas", "monospace"],
  "Source Code Pro": ["Consolas", "Monaco", "monospace"],
  "IBM Plex Mono": ["Consolas", "Monaco", "monospace"],
  Inconsolata: ["Consolas", "Monaco", "monospace"],
  // Display
  "Bebas Neue": ["Impact", "Arial Black", "sans-serif"],
  Oswald: ["Arial", "Helvetica", "sans-serif"],
  Pacifico: ["cursive"],
  Lobster: ["cursive"]
};
var GENERIC_FALLBACKS = {
  "sans-serif": ["Arial", "Helvetica", "sans-serif"]};
var FontManager = class {
  loadTimeout;
  injectedStyles = /* @__PURE__ */ new Set();
  /**
   * Create a new FontManager.
   *
   * @param options - Configuration options
   * @param options.timeout - Font loading timeout in milliseconds (default: 10000)
   */
  constructor(options = {}) {
    this.loadTimeout = options.timeout ?? 1e4;
  }
  /**
   * Load fonts from configuration.
   *
   * Loads Google Fonts and custom fonts, with timeout and error handling.
   * Fonts that fail to load will be included in the `failed` array.
   *
   * @param config - Font configuration
   * @returns Promise resolving to loaded fonts result
   *
   * @example
   * ```typescript
   * const result = await fontManager.loadFonts({
   *   google: [
   *     { family: 'Roboto', weights: [400, 700] },
   *     { family: 'Playfair Display', styles: ['normal', 'italic'] },
   *   ],
   * });
   *
   * console.log(`Loaded ${result.loaded.length} fonts in ${result.loadTime}ms`);
   * if (result.failed.length > 0) {
   *   console.warn(`Failed to load: ${result.failed.map(f => f.family).join(', ')}`);
   * }
   * ```
   */
  async loadFonts(config) {
    const startTime = Date.now();
    const loaded = [];
    const failed = [];
    const promises = [];
    if (config.google) {
      for (const font of config.google) {
        promises.push(
          this.loadGoogleFont(font).then(() => {
            const weights = font.weights ?? [400];
            const styles = font.styles ?? ["normal"];
            for (const weight of weights) {
              for (const style of styles) {
                loaded.push({ family: font.family, weight, style });
              }
            }
          }).catch((error) => {
            console.error(`Failed to load Google Font ${font.family}:`, error);
            failed.push({ family: font.family });
          })
        );
      }
    }
    if (config.custom) {
      for (const font of config.custom) {
        promises.push(
          this.loadCustomFont(font).then(() => {
            loaded.push({
              family: font.family,
              weight: font.weight ?? 400,
              style: font.style ?? "normal"
            });
          }).catch((error) => {
            console.error(`Failed to load custom font ${font.family}:`, error);
            failed.push({
              family: font.family,
              weight: font.weight,
              style: font.style
            });
          })
        );
      }
    }
    await Promise.all(promises);
    await this.waitForFontsReady();
    const loadTime = Date.now() - startTime;
    return { loaded, failed, loadTime };
  }
  /**
   * Extract all fonts used in a template.
   *
   * Scans all text layers and extracts unique font family/weight/style combinations.
   *
   * @param template - Template to extract fonts from
   * @returns Set of font references used in the template
   *
   * @example
   * ```typescript
   * const fonts = fontManager.extractFontsFromTemplate(template);
   * console.log(`Template uses ${fonts.size} unique fonts`);
   * fonts.forEach(font => {
   *   console.log(`- ${font.family} ${font.weight} ${font.style}`);
   * });
   * ```
   */
  extractFontsFromTemplate(template) {
    const fonts = /* @__PURE__ */ new Set();
    const extractFromLayers = (layers) => {
      for (const layer of layers) {
        if (layer.type === "text") {
          const textLayer = layer;
          const fontFamily = textLayer.props.fontFamily;
          if (fontFamily) {
            let weight = 400;
            if (textLayer.props.fontWeight) {
              const fw = textLayer.props.fontWeight;
              if (typeof fw === "number") {
                weight = fw;
              } else if (typeof fw === "string") {
                if (fw === "bold") {
                  weight = 700;
                } else if (fw === "normal") {
                  weight = 400;
                } else {
                  const parsed = parseInt(fw, 10);
                  if ([100, 200, 300, 400, 500, 600, 700, 800, 900].includes(parsed)) {
                    weight = parsed;
                  }
                }
              }
            }
            const style = textLayer.props.fontStyle ?? "normal";
            const fontRef = {
              family: fontFamily,
              weight,
              style
            };
            let exists = false;
            for (const existing of fonts) {
              if (existing.family === fontRef.family && existing.weight === fontRef.weight && existing.style === fontRef.style) {
                exists = true;
                break;
              }
            }
            if (!exists) {
              fonts.add(fontRef);
            }
          }
        }
        if (layer.type === "group" && "children" in layer) {
          extractFromLayers(layer.children);
        }
      }
    };
    for (const scene of template.composition.scenes) {
      extractFromLayers(scene.layers);
    }
    return fonts;
  }
  /**
   * Wait for document.fonts.ready.
   *
   * This ensures all fonts are loaded before rendering to prevent
   * FOIT (Flash of Invisible Text) and FOUT (Flash of Unstyled Text).
   *
   * @param timeout - Optional timeout in milliseconds (uses instance timeout if not provided)
   * @returns Promise that resolves when fonts are ready or timeout occurs
   *
   * @example
   * ```typescript
   * await fontManager.waitForFontsReady();
   * // Fonts are now ready for rendering
   * ```
   */
  async waitForFontsReady(timeout) {
    const maxWait = timeout ?? this.loadTimeout;
    if (typeof document === "undefined" || !document.fonts) {
      return;
    }
    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => {
        console.warn("Font loading timeout reached, continuing with fallbacks");
        resolve();
      }, maxWait);
    });
    const readyPromise = document.fonts.ready.then(() => {
    });
    await Promise.race([readyPromise, timeoutPromise]);
  }
  /**
   * Verify that specific fonts are loaded.
   *
   * Checks if fonts are available using the CSS Font Loading API.
   *
   * @param fonts - Array of font references to verify
   * @returns True if all fonts are loaded, false otherwise
   *
   * @example
   * ```typescript
   * const allLoaded = fontManager.verifyFontsLoaded([
   *   { family: 'Roboto', weight: 400 },
   *   { family: 'Roboto', weight: 700 },
   * ]);
   * if (!allLoaded) {
   *   console.warn('Some fonts are not loaded');
   * }
   * ```
   */
  verifyFontsLoaded(fonts) {
    if (typeof document === "undefined" || !document.fonts) {
      return true;
    }
    for (const font of fonts) {
      const weight = font.weight ?? 400;
      const style = font.style ?? "normal";
      const fontSpec = `${style} ${weight} 16px "${font.family}"`;
      if (!document.fonts.check(fontSpec)) {
        console.error(`Font not loaded: ${font.family} (${weight} ${style})`);
        return false;
      }
    }
    return true;
  }
  /**
   * Get CSS fallback font stack for a font family.
   *
   * Returns a CSS font-family value with appropriate fallbacks.
   *
   * @param fontFamily - Primary font family name
   * @param customFallbacks - Optional custom fallback array
   * @returns CSS font-family string with fallbacks
   *
   * @example
   * ```typescript
   * const stack = fontManager.getFallbackStack('Roboto');
   * // Returns: "'Roboto', Arial, Helvetica, sans-serif"
   *
   * const customStack = fontManager.getFallbackStack('MyFont', ['Arial', 'sans-serif']);
   * // Returns: "'MyFont', Arial, sans-serif"
   * ```
   */
  getFallbackStack(fontFamily, customFallbacks) {
    const fallbacks = customFallbacks ?? FALLBACK_MAP[fontFamily] ?? GENERIC_FALLBACKS["sans-serif"];
    return `'${fontFamily}', ${fallbacks.join(", ")}`;
  }
  /**
   * Load a Google Font.
   *
   * @internal
   */
  async loadGoogleFont(definition) {
    const weights = definition.weights ?? [400];
    const styles = definition.styles ?? ["normal"];
    const subsets = definition.subsets ?? ["latin"];
    const display = definition.display ?? "swap";
    const family = definition.family.replace(/ /g, "+");
    const weightsParam = weights.join(";");
    const variants = [];
    for (const style of styles) {
      if (style === "italic") {
        variants.push(`ital,wght@1,${weightsParam}`);
      } else {
        variants.push(`wght@${weightsParam}`);
      }
    }
    const subsetsParam = subsets.join(",");
    const url = `https://fonts.googleapis.com/css2?family=${family}:${variants.join(";")}&subset=${subsetsParam}&display=${display}`;
    if (this.injectedStyles.has(url)) {
      return;
    }
    try {
      const response = await this.fetchWithTimeout(url, this.loadTimeout);
      const css = await response.text();
      this.injectFontCSS(css);
      this.injectedStyles.add(url);
      await this.loadFontFaces(definition.family, weights, styles);
    } catch (error) {
      throw new FontLoadingError(
        `Failed to load Google Font: ${definition.family}`,
        definition.family,
        error instanceof Error ? error : void 0
      );
    }
  }
  /**
   * Load a custom font.
   *
   * @internal
   */
  async loadCustomFont(definition) {
    const weight = definition.weight ?? 400;
    const style = definition.style ?? "normal";
    const format = definition.format ?? "woff2";
    const display = definition.display ?? "swap";
    const css = this.generateFontFaceCSS({
      family: definition.family,
      src: definition.source,
      weight,
      style,
      format,
      display,
      unicodeRange: definition.unicodeRange
    });
    if (this.injectedStyles.has(css)) {
      return;
    }
    try {
      this.injectFontCSS(css);
      this.injectedStyles.add(css);
      await this.loadFontFaces(definition.family, [weight], [style]);
    } catch (error) {
      throw new FontLoadingError(
        `Failed to load custom font: ${definition.family}`,
        definition.family,
        error instanceof Error ? error : void 0
      );
    }
  }
  /**
   * Generate @font-face CSS rule.
   *
   * @internal
   */
  generateFontFaceCSS(options) {
    const { family, src, weight, style, format, display, unicodeRange } = options;
    let css = "@font-face {\n";
    css += `  font-family: '${family}';
`;
    css += `  src: url('${src}') format('${format}');
`;
    css += `  font-weight: ${weight};
`;
    css += `  font-style: ${style};
`;
    css += `  font-display: ${display};
`;
    if (unicodeRange) {
      css += `  unicode-range: ${unicodeRange};
`;
    }
    css += "}\n";
    return css;
  }
  /**
   * Inject CSS into the document.
   *
   * @internal
   */
  injectFontCSS(css) {
    if (typeof document === "undefined") {
      return;
    }
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }
  /**
   * Load font faces using Font Loading API.
   *
   * @internal
   */
  async loadFontFaces(family, weights, styles) {
    if (typeof FontFace === "undefined") {
      return;
    }
    const promises = [];
    for (const weight of weights) {
      for (const style of styles) {
        const promise = this.loadFontFace(family, weight, style);
        promises.push(promise);
      }
    }
    await Promise.all(promises);
  }
  /**
   * Load a single font face.
   *
   * @internal
   */
  async loadFontFace(family, weight, style) {
    if (typeof FontFace === "undefined" || typeof document === "undefined") {
      return;
    }
    try {
      const fontFace = new FontFace(
        family,
        `local('${family}')`,
        { weight: weight.toString(), style }
      );
      const loadPromise = fontFace.load();
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Font load timeout")), this.loadTimeout);
      });
      await Promise.race([loadPromise, timeoutPromise]);
      document.fonts.add(fontFace);
    } catch (error) {
      console.warn(`Failed to load font face: ${family} ${weight} ${style}`, error);
    }
  }
  /**
   * Fetch with timeout.
   *
   * @internal
   */
  async fetchWithTimeout(url, timeout) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Fetch timeout");
      }
      throw error;
    }
  }
};

// src/fonts/catalog-data.json
var catalog_data_default = {
  fonts: [
    {
      family: "Roboto",
      category: "sans-serif",
      weights: [100, 300, 400, 500, 700, 900],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext", "cyrillic"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 1
    },
    {
      family: "Open Sans",
      category: "sans-serif",
      weights: [300, 400, 500, 600, 700, 800],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext", "cyrillic"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 2
    },
    {
      family: "Lato",
      category: "sans-serif",
      weights: [100, 300, 400, 700, 900],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 3
    },
    {
      family: "Montserrat",
      category: "sans-serif",
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext", "cyrillic"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 4
    },
    {
      family: "Poppins",
      category: "sans-serif",
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 5
    },
    {
      family: "Inter",
      category: "sans-serif",
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      styles: ["normal"],
      subsets: ["latin", "latin-ext", "cyrillic"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 6
    },
    {
      family: "Raleway",
      category: "sans-serif",
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 7
    },
    {
      family: "Nunito",
      category: "sans-serif",
      weights: [200, 300, 400, 500, 600, 700, 800, 900],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 8
    },
    {
      family: "Ubuntu",
      category: "sans-serif",
      weights: [300, 400, 500, 700],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext", "cyrillic"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 9
    },
    {
      family: "Work Sans",
      category: "sans-serif",
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 10
    },
    {
      family: "Noto Sans",
      category: "sans-serif",
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext", "cyrillic"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 11
    },
    {
      family: "Rubik",
      category: "sans-serif",
      weights: [300, 400, 500, 600, 700, 800, 900],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext", "cyrillic"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 12
    },
    {
      family: "Source Sans 3",
      category: "sans-serif",
      weights: [200, 300, 400, 500, 600, 700, 800, 900],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 13
    },
    {
      family: "Mukta",
      category: "sans-serif",
      weights: [200, 300, 400, 500, 600, 700, 800],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 14
    },
    {
      family: "Kanit",
      category: "sans-serif",
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 15
    },
    {
      family: "Barlow",
      category: "sans-serif",
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 16
    },
    {
      family: "Manrope",
      category: "sans-serif",
      weights: [200, 300, 400, 500, 600, 700, 800],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 17
    },
    {
      family: "DM Sans",
      category: "sans-serif",
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 18
    },
    {
      family: "Nunito Sans",
      category: "sans-serif",
      weights: [200, 300, 400, 500, 600, 700, 800, 900],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 19
    },
    {
      family: "Quicksand",
      category: "sans-serif",
      weights: [300, 400, 500, 600, 700],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 20
    },
    {
      family: "Josefin Sans",
      category: "sans-serif",
      weights: [100, 200, 300, 400, 500, 600, 700],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 21
    },
    {
      family: "Cabin",
      category: "sans-serif",
      weights: [400, 500, 600, 700],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 22
    },
    {
      family: "Hind",
      category: "sans-serif",
      weights: [300, 400, 500, 600, 700],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 23
    },
    {
      family: "Karla",
      category: "sans-serif",
      weights: [200, 300, 400, 500, 600, 700, 800],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 24
    },
    {
      family: "Oxygen",
      category: "sans-serif",
      weights: [300, 400, 700],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 25
    },
    {
      family: "Asap",
      category: "sans-serif",
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 26
    },
    {
      family: "Exo 2",
      category: "sans-serif",
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 27
    },
    {
      family: "IBM Plex Sans",
      category: "sans-serif",
      weights: [100, 200, 300, 400, 500, 600, 700],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext", "cyrillic"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 28
    },
    {
      family: "Arimo",
      category: "sans-serif",
      weights: [400, 500, 600, 700],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 29
    },
    {
      family: "Titillium Web",
      category: "sans-serif",
      weights: [200, 300, 400, 600, 700, 900],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 30
    },
    {
      family: "Heebo",
      category: "sans-serif",
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 31
    },
    {
      family: "Assistant",
      category: "sans-serif",
      weights: [200, 300, 400, 500, 600, 700, 800],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 32
    },
    {
      family: "Fira Sans",
      category: "sans-serif",
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext", "cyrillic"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 33
    },
    {
      family: "Anton",
      category: "sans-serif",
      weights: [400],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 34
    },
    {
      family: "Dosis",
      category: "sans-serif",
      weights: [200, 300, 400, 500, 600, 700, 800],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 35
    },
    {
      family: "Plus Jakarta Sans",
      category: "sans-serif",
      weights: [200, 300, 400, 500, 600, 700, 800],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 36
    },
    {
      family: "Outfit",
      category: "sans-serif",
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 37
    },
    {
      family: "Space Grotesk",
      category: "sans-serif",
      weights: [300, 400, 500, 600, 700],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 38
    },
    {
      family: "Urbanist",
      category: "sans-serif",
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 39
    },
    {
      family: "Lexend",
      category: "sans-serif",
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 40
    },
    {
      family: "Mulish",
      category: "sans-serif",
      weights: [200, 300, 400, 500, 600, 700, 800, 900],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 41
    },
    {
      family: "Red Hat Display",
      category: "sans-serif",
      weights: [300, 400, 500, 600, 700, 800, 900],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 42
    },
    {
      family: "Figtree",
      category: "sans-serif",
      weights: [300, 400, 500, 600, 700, 800, 900],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 43
    },
    {
      family: "Archivo",
      category: "sans-serif",
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 44
    },
    {
      family: "Jost",
      category: "sans-serif",
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 45
    },
    {
      family: "Public Sans",
      category: "sans-serif",
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 46
    },
    {
      family: "Cairo",
      category: "sans-serif",
      weights: [200, 300, 400, 500, 600, 700, 800, 900],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 47
    },
    {
      family: "Comfortaa",
      category: "sans-serif",
      weights: [300, 400, 500, 600, 700],
      styles: ["normal"],
      subsets: ["latin", "latin-ext", "cyrillic"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 48
    },
    {
      family: "ABeeZee",
      category: "sans-serif",
      weights: [400],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 49
    },
    {
      family: "Be Vietnam Pro",
      category: "sans-serif",
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 50
    },
    {
      family: "Playfair Display",
      category: "serif",
      weights: [400, 500, 600, 700, 800, 900],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext", "cyrillic"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 51
    },
    {
      family: "Merriweather",
      category: "serif",
      weights: [300, 400, 700, 900],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext", "cyrillic"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 52
    },
    {
      family: "Lora",
      category: "serif",
      weights: [400, 500, 600, 700],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext", "cyrillic"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 53
    },
    {
      family: "PT Serif",
      category: "serif",
      weights: [400, 700],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext", "cyrillic"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 54
    },
    {
      family: "Libre Baskerville",
      category: "serif",
      weights: [400, 700],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 55
    },
    {
      family: "Crimson Text",
      category: "serif",
      weights: [400, 600, 700],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 56
    },
    {
      family: "EB Garamond",
      category: "serif",
      weights: [400, 500, 600, 700, 800],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext", "cyrillic"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 57
    },
    {
      family: "Noto Serif",
      category: "serif",
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext", "cyrillic"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 58
    },
    {
      family: "Source Serif 4",
      category: "serif",
      weights: [200, 300, 400, 500, 600, 700, 800, 900],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 59
    },
    {
      family: "Bitter",
      category: "serif",
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 60
    },
    {
      family: "Cormorant Garamond",
      category: "serif",
      weights: [300, 400, 500, 600, 700],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext", "cyrillic"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 61
    },
    {
      family: "Spectral",
      category: "serif",
      weights: [200, 300, 400, 500, 600, 700, 800],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 62
    },
    {
      family: "Alegreya",
      category: "serif",
      weights: [400, 500, 600, 700, 800, 900],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 63
    },
    {
      family: "Abril Fatface",
      category: "serif",
      weights: [400],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 64
    },
    {
      family: "Cardo",
      category: "serif",
      weights: [400, 700],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 65
    },
    {
      family: "Volkhov",
      category: "serif",
      weights: [400, 700],
      styles: ["normal", "italic"],
      subsets: ["latin"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 66
    },
    {
      family: "Domine",
      category: "serif",
      weights: [400, 500, 600, 700],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 67
    },
    {
      family: "Tinos",
      category: "serif",
      weights: [400, 700],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 68
    },
    {
      family: "Archivo Black",
      category: "serif",
      weights: [400],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 69
    },
    {
      family: "IBM Plex Serif",
      category: "serif",
      weights: [100, 200, 300, 400, 500, 600, 700],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext", "cyrillic"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 70
    },
    {
      family: "Roboto Mono",
      category: "monospace",
      weights: [100, 200, 300, 400, 500, 600, 700],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext", "cyrillic"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 71
    },
    {
      family: "JetBrains Mono",
      category: "monospace",
      weights: [100, 200, 300, 400, 500, 600, 700, 800],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext", "cyrillic"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 72
    },
    {
      family: "Fira Code",
      category: "monospace",
      weights: [300, 400, 500, 600, 700],
      styles: ["normal"],
      subsets: ["latin", "latin-ext", "cyrillic"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 73
    },
    {
      family: "Source Code Pro",
      category: "monospace",
      weights: [200, 300, 400, 500, 600, 700, 800, 900],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext", "cyrillic"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 74
    },
    {
      family: "Inconsolata",
      category: "monospace",
      weights: [200, 300, 400, 500, 600, 700, 800, 900],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 75
    },
    {
      family: "Space Mono",
      category: "monospace",
      weights: [400, 700],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 76
    },
    {
      family: "IBM Plex Mono",
      category: "monospace",
      weights: [100, 200, 300, 400, 500, 600, 700],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext", "cyrillic"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 77
    },
    {
      family: "Courier Prime",
      category: "monospace",
      weights: [400, 700],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 78
    },
    {
      family: "Anonymous Pro",
      category: "monospace",
      weights: [400, 700],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext", "cyrillic"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 79
    },
    {
      family: "Overpass Mono",
      category: "monospace",
      weights: [300, 400, 500, 600, 700],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 80
    },
    {
      family: "PT Mono",
      category: "monospace",
      weights: [400],
      styles: ["normal"],
      subsets: ["latin", "latin-ext", "cyrillic"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 81
    },
    {
      family: "Ubuntu Mono",
      category: "monospace",
      weights: [400, 700],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext", "cyrillic"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 82
    },
    {
      family: "Noto Sans Mono",
      category: "monospace",
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      styles: ["normal"],
      subsets: ["latin", "latin-ext", "cyrillic"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 83
    },
    {
      family: "Red Hat Mono",
      category: "monospace",
      weights: [300, 400, 500, 600, 700],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 84
    },
    {
      family: "DM Mono",
      category: "monospace",
      weights: [300, 400, 500],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 85
    },
    {
      family: "Bebas Neue",
      category: "display",
      weights: [400],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 86
    },
    {
      family: "Oswald",
      category: "display",
      weights: [200, 300, 400, 500, 600, 700],
      styles: ["normal"],
      subsets: ["latin", "latin-ext", "cyrillic"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 87
    },
    {
      family: "Righteous",
      category: "display",
      weights: [400],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 88
    },
    {
      family: "Pacifico",
      category: "display",
      weights: [400],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 89
    },
    {
      family: "Lobster",
      category: "display",
      weights: [400],
      styles: ["normal"],
      subsets: ["latin", "latin-ext", "cyrillic"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 90
    },
    {
      family: "Permanent Marker",
      category: "display",
      weights: [400],
      styles: ["normal"],
      subsets: ["latin"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 91
    },
    {
      family: "Bangers",
      category: "display",
      weights: [400],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 92
    },
    {
      family: "Fredoka",
      category: "display",
      weights: [300, 400, 500, 600, 700],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 93
    },
    {
      family: "Russo One",
      category: "display",
      weights: [400],
      styles: ["normal"],
      subsets: ["latin", "latin-ext", "cyrillic"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 94
    },
    {
      family: "Alfa Slab One",
      category: "display",
      weights: [400],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 95
    },
    {
      family: "Caveat",
      category: "display",
      weights: [400, 500, 600, 700],
      styles: ["normal"],
      subsets: ["latin", "latin-ext", "cyrillic"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: true,
      popularity: 96
    },
    {
      family: "Shadows Into Light",
      category: "display",
      weights: [400],
      styles: ["normal"],
      subsets: ["latin"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 97
    },
    {
      family: "Staatliches",
      category: "display",
      weights: [400],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 98
    },
    {
      family: "Archivo Black",
      category: "display",
      weights: [400],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 99
    },
    {
      family: "Concert One",
      category: "display",
      weights: [400],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      preview: "The quick brown fox jumps over the lazy dog",
      variable: false,
      popularity: 100
    }
  ]
};

// src/fonts/catalog.ts
var catalog = catalog_data_default;
function getFontCatalog() {
  return [...catalog.fonts];
}
function getFontsByCategory(category) {
  return catalog.fonts.filter((font) => font.category === category);
}
function getFontMetadata(family) {
  return catalog.fonts.find((font) => font.family === family);
}
function getPopularFonts() {
  return catalog.fonts.filter((font) => font.popularity <= 50).sort((a, b) => a.popularity - b.popularity);
}
function getVariableFonts() {
  return catalog.fonts.filter((font) => font.variable);
}
function searchFonts(query) {
  const lowerQuery = query.toLowerCase();
  return catalog.fonts.filter(
    (font) => font.family.toLowerCase().includes(lowerQuery)
  );
}
function getFontsByWeight(weights, matchAll = false) {
  return catalog.fonts.filter((font) => {
    if (matchAll) {
      return weights.every((weight) => font.weights.includes(weight));
    } else {
      return weights.some((weight) => font.weights.includes(weight));
    }
  });
}
function getFontsWithItalic() {
  return catalog.fonts.filter((font) => font.styles.includes("italic"));
}
function getCatalogStats() {
  const total = catalog.fonts.length;
  const byCategory = catalog.fonts.reduce((acc, font) => {
    acc[font.category] = (acc[font.category] || 0) + 1;
    return acc;
  }, {});
  const variableCount = catalog.fonts.filter((f) => f.variable).length;
  const withItalic = catalog.fonts.filter((f) => f.styles.includes("italic")).length;
  return {
    total,
    byCategory,
    variable: variableCount,
    withItalic
  };
}
function isFontAvailable(family) {
  return catalog.fonts.some((font) => font.family === family);
}
function getRandomFonts(count = 1) {
  const shuffled = [...catalog.fonts].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

exports.ComponentDefaultsManager = ComponentDefaultsManager;
exports.ComponentPropsResolver = ComponentPropsResolver;
exports.DEFAULT_MOTION_BLUR_CONFIG = DEFAULT_MOTION_BLUR_CONFIG;
exports.FONT_CONSTANTS = FONT_CONSTANTS;
exports.FontLoadingError = FontLoadingError;
exports.FontManager = FontManager;
exports.MOTION_BLUR_QUALITY_PRESETS = MOTION_BLUR_QUALITY_PRESETS;
exports.RendervidEngine = RendervidEngine;
exports.TemplateProcessor = TemplateProcessor;
exports.compileAnimation = compileAnimation;
exports.createCubicBezier = createCubicBezier;
exports.createDefaultComponentDefaultsManager = createDefaultComponentDefaultsManager;
exports.createSpring = createSpring;
exports.filterToCSS = filterToCSS;
exports.filtersToCSS = filtersToCSS;
exports.generatePresetKeyframes = generatePresetKeyframes;
exports.getAllEasingNames = getAllEasingNames;
exports.getAllPresetNames = getAllPresetNames;
exports.getCatalogStats = getCatalogStats;
exports.getCompositionDuration = getCompositionDuration;
exports.getDefaultRegistry = getDefaultRegistry;
exports.getEasing = getEasing;
exports.getFontCatalog = getFontCatalog;
exports.getFontMetadata = getFontMetadata;
exports.getFontsByCategory = getFontsByCategory;
exports.getFontsByWeight = getFontsByWeight;
exports.getFontsWithItalic = getFontsWithItalic;
exports.getLayerSchema = getLayerSchema;
exports.getPopularFonts = getPopularFonts;
exports.getPreset = getPreset;
exports.getPresetsByType = getPresetsByType;
exports.getPropertiesAtFrame = getPropertiesAtFrame;
exports.getRandomFonts = getRandomFonts;
exports.getSceneAtFrame = getSceneAtFrame;
exports.getTemplateSchema = getTemplateSchema;
exports.getValueAtFrame = getValueAtFrame;
exports.getVariableFonts = getVariableFonts;
exports.interpolate = interpolate;
exports.isFontAvailable = isFontAvailable;
exports.isNamedWeight = isNamedWeight;
exports.isNumericWeight = isNumericWeight;
exports.mergeMotionBlurConfigs = mergeMotionBlurConfigs;
exports.numericToNamedWeight = numericToNamedWeight;
exports.parseEasing = parseEasing;
exports.resolveMotionBlurConfig = resolveMotionBlurConfig;
exports.searchFonts = searchFonts;
exports.templateSchema = templateSchema;
exports.validateInputs = validateInputs;
exports.validateMotionBlurConfig = validateMotionBlurConfig;
exports.validateSceneOrder = validateSceneOrder;
exports.validateTemplate = validateTemplate;
exports.weightToNumeric = weightToNumeric;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map