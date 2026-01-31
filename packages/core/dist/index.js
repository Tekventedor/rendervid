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
      enum: ["image", "video", "text", "shape", "audio", "group", "lottie", "custom"]
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
var presets = {
  // Entrance
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
  // Exit
  fadeOut,
  fadeOutUp,
  fadeOutDown,
  scaleOut,
  zoomOut,
  // Emphasis
  pulse,
  shake,
  bounce,
  spin,
  heartbeat,
  float
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
  unregister(name) {
    return this.components.delete(name);
  }
  has(name) {
    return this.components.has(name);
  }
};
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

exports.RendervidEngine = RendervidEngine;
exports.compileAnimation = compileAnimation;
exports.createCubicBezier = createCubicBezier;
exports.createSpring = createSpring;
exports.filterToCSS = filterToCSS;
exports.filtersToCSS = filtersToCSS;
exports.generatePresetKeyframes = generatePresetKeyframes;
exports.getAllEasingNames = getAllEasingNames;
exports.getAllPresetNames = getAllPresetNames;
exports.getCompositionDuration = getCompositionDuration;
exports.getEasing = getEasing;
exports.getLayerSchema = getLayerSchema;
exports.getPreset = getPreset;
exports.getPresetsByType = getPresetsByType;
exports.getPropertiesAtFrame = getPropertiesAtFrame;
exports.getSceneAtFrame = getSceneAtFrame;
exports.getTemplateSchema = getTemplateSchema;
exports.getValueAtFrame = getValueAtFrame;
exports.interpolate = interpolate;
exports.parseEasing = parseEasing;
exports.templateSchema = templateSchema;
exports.validateInputs = validateInputs;
exports.validateSceneOrder = validateSceneOrder;
exports.validateTemplate = validateTemplate;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map