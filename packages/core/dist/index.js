'use strict';

var Ajv = require('ajv');
var addFormats = require('ajv-formats');
var fs2 = require('fs');
var path2 = require('path');
var zlib = require('zlib');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var Ajv__default = /*#__PURE__*/_interopDefault(Ajv);
var addFormats__default = /*#__PURE__*/_interopDefault(addFormats);
var fs2__namespace = /*#__PURE__*/_interopNamespace(fs2);
var path2__namespace = /*#__PURE__*/_interopNamespace(path2);
var zlib__namespace = /*#__PURE__*/_interopNamespace(zlib);

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
      enum: ["image", "video", "text", "shape", "audio", "group", "lottie", "custom", "three", "gif"]
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
  const path3 = error.instancePath || "/";
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
    path: path3,
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
    const dist2 = (x - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
    const guessForT = intervalStart + dist2 * kSampleStepSize;
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

// src/animation/color.ts
var NAMED_COLORS = {
  transparent: [0, 0, 0, 0],
  black: [0, 0, 0, 1],
  white: [255, 255, 255, 1],
  red: [255, 0, 0, 1],
  green: [0, 128, 0, 1],
  blue: [0, 0, 255, 1],
  yellow: [255, 255, 0, 1],
  cyan: [0, 255, 255, 1],
  magenta: [255, 0, 255, 1],
  orange: [255, 165, 0, 1],
  purple: [128, 0, 128, 1],
  pink: [255, 192, 203, 1],
  lime: [0, 255, 0, 1],
  navy: [0, 0, 128, 1],
  teal: [0, 128, 128, 1],
  maroon: [128, 0, 0, 1],
  olive: [128, 128, 0, 1],
  aqua: [0, 255, 255, 1],
  fuchsia: [255, 0, 255, 1],
  silver: [192, 192, 192, 1],
  gray: [128, 128, 128, 1],
  grey: [128, 128, 128, 1],
  coral: [255, 127, 80, 1],
  salmon: [250, 128, 114, 1],
  tomato: [255, 99, 71, 1],
  gold: [255, 215, 0, 1],
  khaki: [240, 230, 140, 1],
  violet: [238, 130, 238, 1],
  indigo: [75, 0, 130, 1],
  crimson: [220, 20, 60, 1],
  plum: [221, 160, 221, 1],
  orchid: [218, 112, 214, 1],
  tan: [210, 180, 140, 1],
  beige: [245, 245, 220, 1],
  ivory: [255, 255, 240, 1],
  linen: [250, 240, 230, 1],
  lavender: [230, 230, 250, 1],
  skyblue: [135, 206, 235, 1],
  steelblue: [70, 130, 180, 1],
  royalblue: [65, 105, 225, 1],
  midnightblue: [25, 25, 112, 1],
  darkblue: [0, 0, 139, 1],
  darkgreen: [0, 100, 0, 1],
  darkred: [139, 0, 0, 1],
  darkorange: [255, 140, 0, 1],
  darkviolet: [148, 0, 211, 1],
  deeppink: [255, 20, 147, 1],
  dodgerblue: [30, 144, 255, 1],
  firebrick: [178, 34, 34, 1],
  forestgreen: [34, 139, 34, 1],
  hotpink: [255, 105, 180, 1],
  limegreen: [50, 205, 50, 1],
  orangered: [255, 69, 0, 1],
  seagreen: [46, 139, 87, 1],
  sienna: [160, 82, 45, 1],
  slateblue: [106, 90, 205, 1],
  slategray: [112, 128, 144, 1],
  springgreen: [0, 255, 127, 1],
  turquoise: [64, 224, 208, 1],
  wheat: [245, 222, 179, 1],
  whitesmoke: [245, 245, 245, 1],
  yellowgreen: [154, 205, 50, 1]
};
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
function parseHex(hex) {
  const h = hex.startsWith("#") ? hex.slice(1) : hex;
  let r, g, b, a;
  if (h.length === 3) {
    r = parseInt(h[0] + h[0], 16);
    g = parseInt(h[1] + h[1], 16);
    b = parseInt(h[2] + h[2], 16);
    a = 1;
  } else if (h.length === 4) {
    r = parseInt(h[0] + h[0], 16);
    g = parseInt(h[1] + h[1], 16);
    b = parseInt(h[2] + h[2], 16);
    a = parseInt(h[3] + h[3], 16) / 255;
  } else if (h.length === 6) {
    r = parseInt(h.slice(0, 2), 16);
    g = parseInt(h.slice(2, 4), 16);
    b = parseInt(h.slice(4, 6), 16);
    a = 1;
  } else if (h.length === 8) {
    r = parseInt(h.slice(0, 2), 16);
    g = parseInt(h.slice(2, 4), 16);
    b = parseInt(h.slice(4, 6), 16);
    a = parseInt(h.slice(6, 8), 16) / 255;
  } else {
    return null;
  }
  if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a)) return null;
  return { r, g, b, a };
}
function parseRgb(str) {
  const match = str.match(
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+))?\s*\)$/
  );
  if (!match) return null;
  return {
    r: clamp(Math.round(Number(match[1])), 0, 255),
    g: clamp(Math.round(Number(match[2])), 0, 255),
    b: clamp(Math.round(Number(match[3])), 0, 255),
    a: match[4] !== void 0 ? clamp(Number(match[4]), 0, 1) : 1
  };
}
function hslToRgb(h, s, l) {
  h = (h % 360 + 360) % 360;
  s = clamp(s, 0, 100) / 100;
  l = clamp(l, 0, 100) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(h / 60 % 2 - 1));
  const m = l - c / 2;
  let r, g, b;
  if (h < 60) {
    [r, g, b] = [c, x, 0];
  } else if (h < 120) {
    [r, g, b] = [x, c, 0];
  } else if (h < 180) {
    [r, g, b] = [0, c, x];
  } else if (h < 240) {
    [r, g, b] = [0, x, c];
  } else if (h < 300) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255)
  ];
}
function parseHsl(str) {
  const match = str.match(
    /^hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*(?:,\s*([\d.]+))?\s*\)$/
  );
  if (!match) return null;
  const [r, g, b] = hslToRgb(Number(match[1]), Number(match[2]), Number(match[3]));
  return {
    r,
    g,
    b,
    a: match[4] !== void 0 ? clamp(Number(match[4]), 0, 1) : 1
  };
}
function parseColor(color) {
  const trimmed = color.trim().toLowerCase();
  if (trimmed in NAMED_COLORS) {
    const [r, g, b, a] = NAMED_COLORS[trimmed];
    return { r, g, b, a };
  }
  if (trimmed.startsWith("#")) {
    const result = parseHex(trimmed);
    if (result) return result;
  }
  if (trimmed.startsWith("rgb")) {
    const result = parseRgb(trimmed);
    if (result) return result;
  }
  if (trimmed.startsWith("hsl")) {
    const result = parseHsl(trimmed);
    if (result) return result;
  }
  return { r: 0, g: 0, b: 0, a: 0 };
}
function colorToString(color) {
  const r = clamp(Math.round(color.r), 0, 255);
  const g = clamp(Math.round(color.g), 0, 255);
  const b = clamp(Math.round(color.b), 0, 255);
  const a = clamp(color.a, 0, 1);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
function lerpColor(from, to, t) {
  return {
    r: from.r + (to.r - from.r) * t,
    g: from.g + (to.g - from.g) * t,
    b: from.b + (to.b - from.b) * t,
    a: from.a + (to.a - from.a) * t
  };
}
function interpolateColors(value, inputRange, outputRange) {
  if (inputRange.length !== outputRange.length) {
    throw new Error("inputRange and outputRange must have the same length");
  }
  if (inputRange.length < 2) {
    throw new Error("inputRange must have at least 2 values");
  }
  const parsedColors = outputRange.map(parseColor);
  if (value <= inputRange[0]) {
    return colorToString(parsedColors[0]);
  }
  if (value >= inputRange[inputRange.length - 1]) {
    return colorToString(parsedColors[parsedColors.length - 1]);
  }
  for (let i = 0; i < inputRange.length - 1; i++) {
    if (value >= inputRange[i] && value <= inputRange[i + 1]) {
      const segmentProgress = (value - inputRange[i]) / (inputRange[i + 1] - inputRange[i]);
      return colorToString(lerpColor(parsedColors[i], parsedColors[i + 1], segmentProgress));
    }
  }
  return colorToString(parsedColors[parsedColors.length - 1]);
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

// src/utils/random.ts
function hashSeed(seed) {
  if (typeof seed === "number") return seed >>> 0;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char | 0;
  }
  return hash >>> 0;
}
function mulberry32(seed) {
  let t = seed + 1831565813 | 0;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
}
function random(seed) {
  return mulberry32(hashSeed(seed));
}
function randomRange(seed, min, max) {
  return min + random(seed) * (max - min);
}
function randomInt(seed, min, max) {
  return Math.floor(min + random(seed) * (max - min + 1));
}
function createRandom(seed) {
  let state = hashSeed(seed);
  return function next() {
    state = state + 1831565813 | 0;
    let t = state;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// src/utils/noise.ts
var GRAD2 = [
  [1, 1],
  [-1, 1],
  [1, -1],
  [-1, -1],
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1]
];
var GRAD3 = [
  [1, 1, 0],
  [-1, 1, 0],
  [1, -1, 0],
  [-1, -1, 0],
  [1, 0, 1],
  [-1, 0, 1],
  [1, 0, -1],
  [-1, 0, -1],
  [0, 1, 1],
  [0, -1, 1],
  [0, 1, -1],
  [0, -1, -1]
];
var F2 = 0.5 * (Math.sqrt(3) - 1);
var G2 = (3 - Math.sqrt(3)) / 6;
var F3 = 1 / 3;
var G3 = 1 / 6;
function buildPermutationTable(seed) {
  const perm = new Uint8Array(512);
  const source = new Uint8Array(256);
  for (let i = 0; i < 256; i++) {
    source[i] = i;
  }
  let s = seed >>> 0;
  for (let i = 255; i > 0; i--) {
    s = s + 1831565813 | 0;
    let t = s;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    const r = ((t ^ t >>> 14) >>> 0) % (i + 1);
    const tmp = source[i];
    source[i] = source[r];
    source[r] = tmp;
  }
  for (let i = 0; i < 256; i++) {
    perm[i] = source[i];
    perm[i + 256] = source[i];
  }
  return perm;
}
function hashSeed2(seed) {
  if (typeof seed === "number") return seed >>> 0;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char | 0;
  }
  return hash >>> 0;
}
var permCache = /* @__PURE__ */ new Map();
function getPermTable(seed) {
  const numericSeed = hashSeed2(seed);
  let perm = permCache.get(numericSeed);
  if (!perm) {
    perm = buildPermutationTable(numericSeed);
    permCache.set(numericSeed, perm);
  }
  return perm;
}
function noise2D(seed, x, y) {
  const perm = getPermTable(seed);
  const s = (x + y) * F2;
  const i = Math.floor(x + s);
  const j = Math.floor(y + s);
  const t = (i + j) * G2;
  const X0 = i - t;
  const Y0 = j - t;
  const x0 = x - X0;
  const y0 = y - Y0;
  let i1, j1;
  if (x0 > y0) {
    i1 = 1;
    j1 = 0;
  } else {
    i1 = 0;
    j1 = 1;
  }
  const x1 = x0 - i1 + G2;
  const y1 = y0 - j1 + G2;
  const x2 = x0 - 1 + 2 * G2;
  const y2 = y0 - 1 + 2 * G2;
  const ii = i & 255;
  const jj = j & 255;
  let n0 = 0, n12 = 0, n2 = 0;
  let t0 = 0.5 - x0 * x0 - y0 * y0;
  if (t0 >= 0) {
    const gi0 = perm[ii + perm[jj]] % 8;
    t0 *= t0;
    n0 = t0 * t0 * (GRAD2[gi0][0] * x0 + GRAD2[gi0][1] * y0);
  }
  let t1 = 0.5 - x1 * x1 - y1 * y1;
  if (t1 >= 0) {
    const gi1 = perm[ii + i1 + perm[jj + j1]] % 8;
    t1 *= t1;
    n12 = t1 * t1 * (GRAD2[gi1][0] * x1 + GRAD2[gi1][1] * y1);
  }
  let t2 = 0.5 - x2 * x2 - y2 * y2;
  if (t2 >= 0) {
    const gi2 = perm[ii + 1 + perm[jj + 1]] % 8;
    t2 *= t2;
    n2 = t2 * t2 * (GRAD2[gi2][0] * x2 + GRAD2[gi2][1] * y2);
  }
  return 70 * (n0 + n12 + n2);
}
function noise3D(seed, x, y, z) {
  const perm = getPermTable(seed);
  const s = (x + y + z) * F3;
  const i = Math.floor(x + s);
  const j = Math.floor(y + s);
  const k = Math.floor(z + s);
  const t = (i + j + k) * G3;
  const X0 = i - t;
  const Y0 = j - t;
  const Z0 = k - t;
  const x0 = x - X0;
  const y0 = y - Y0;
  const z0 = z - Z0;
  let i1, j1, k1;
  let i2, j2, k2;
  if (x0 >= y0) {
    if (y0 >= z0) {
      i1 = 1;
      j1 = 0;
      k1 = 0;
      i2 = 1;
      j2 = 1;
      k2 = 0;
    } else if (x0 >= z0) {
      i1 = 1;
      j1 = 0;
      k1 = 0;
      i2 = 1;
      j2 = 0;
      k2 = 1;
    } else {
      i1 = 0;
      j1 = 0;
      k1 = 1;
      i2 = 1;
      j2 = 0;
      k2 = 1;
    }
  } else {
    if (y0 < z0) {
      i1 = 0;
      j1 = 0;
      k1 = 1;
      i2 = 0;
      j2 = 1;
      k2 = 1;
    } else if (x0 < z0) {
      i1 = 0;
      j1 = 1;
      k1 = 0;
      i2 = 0;
      j2 = 1;
      k2 = 1;
    } else {
      i1 = 0;
      j1 = 1;
      k1 = 0;
      i2 = 1;
      j2 = 1;
      k2 = 0;
    }
  }
  const x1 = x0 - i1 + G3;
  const y1 = y0 - j1 + G3;
  const z1 = z0 - k1 + G3;
  const x2 = x0 - i2 + 2 * G3;
  const y2 = y0 - j2 + 2 * G3;
  const z2 = z0 - k2 + 2 * G3;
  const x3 = x0 - 1 + 3 * G3;
  const y3 = y0 - 1 + 3 * G3;
  const z3 = z0 - 1 + 3 * G3;
  const ii = i & 255;
  const jj = j & 255;
  const kk = k & 255;
  let n0 = 0, n12 = 0, n2 = 0, n3 = 0;
  let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
  if (t0 >= 0) {
    const gi0 = perm[ii + perm[jj + perm[kk]]] % 12;
    t0 *= t0;
    n0 = t0 * t0 * (GRAD3[gi0][0] * x0 + GRAD3[gi0][1] * y0 + GRAD3[gi0][2] * z0);
  }
  let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
  if (t1 >= 0) {
    const gi1 = perm[ii + i1 + perm[jj + j1 + perm[kk + k1]]] % 12;
    t1 *= t1;
    n12 = t1 * t1 * (GRAD3[gi1][0] * x1 + GRAD3[gi1][1] * y1 + GRAD3[gi1][2] * z1);
  }
  let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
  if (t2 >= 0) {
    const gi2 = perm[ii + i2 + perm[jj + j2 + perm[kk + k2]]] % 12;
    t2 *= t2;
    n2 = t2 * t2 * (GRAD3[gi2][0] * x2 + GRAD3[gi2][1] * y2 + GRAD3[gi2][2] * z2);
  }
  let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
  if (t3 >= 0) {
    const gi3 = perm[ii + 1 + perm[jj + 1 + perm[kk + 1]]] % 12;
    t3 *= t3;
    n3 = t3 * t3 * (GRAD3[gi3][0] * x3 + GRAD3[gi3][1] * y3 + GRAD3[gi3][2] * z3);
  }
  return 32 * (n0 + n12 + n2 + n3);
}
function fade(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}
function lerp(a, b, t) {
  return a + t * (b - a);
}
function grad2(hash, x, y) {
  const g = GRAD2[hash % 8];
  return g[0] * x + g[1] * y;
}
function grad3(hash, x, y, z) {
  const g = GRAD3[hash % 12];
  return g[0] * x + g[1] * y + g[2] * z;
}
function perlin2D(seed, x, y) {
  const perm = getPermTable(seed);
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = fade(xf);
  const v = fade(yf);
  const ii = xi & 255;
  const jj = yi & 255;
  const aa = perm[ii + perm[jj]];
  const ab = perm[ii + perm[jj + 1]];
  const ba = perm[ii + 1 + perm[jj]];
  const bb = perm[ii + 1 + perm[jj + 1]];
  const x1 = lerp(grad2(aa, xf, yf), grad2(ba, xf - 1, yf), u);
  const x2 = lerp(grad2(ab, xf, yf - 1), grad2(bb, xf - 1, yf - 1), u);
  return lerp(x1, x2, v);
}
function perlin3D(seed, x, y, z) {
  const perm = getPermTable(seed);
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const xf = x - xi;
  const yf = y - yi;
  const zf = z - zi;
  const u = fade(xf);
  const v = fade(yf);
  const w = fade(zf);
  const ii = xi & 255;
  const jj = yi & 255;
  const kk = zi & 255;
  const aaa = perm[ii + perm[jj + perm[kk]]];
  const aab = perm[ii + perm[jj + perm[kk + 1]]];
  const aba = perm[ii + perm[jj + 1 + perm[kk]]];
  const abb = perm[ii + perm[jj + 1 + perm[kk + 1]]];
  const baa = perm[ii + 1 + perm[jj + perm[kk]]];
  const bab = perm[ii + 1 + perm[jj + perm[kk + 1]]];
  const bba = perm[ii + 1 + perm[jj + 1 + perm[kk]]];
  const bbb = perm[ii + 1 + perm[jj + 1 + perm[kk + 1]]];
  const x1 = lerp(
    grad3(aaa, xf, yf, zf),
    grad3(baa, xf - 1, yf, zf),
    u
  );
  const x2 = lerp(
    grad3(aba, xf, yf - 1, zf),
    grad3(bba, xf - 1, yf - 1, zf),
    u
  );
  const x3 = lerp(
    grad3(aab, xf, yf, zf - 1),
    grad3(bab, xf - 1, yf, zf - 1),
    u
  );
  const x4 = lerp(
    grad3(abb, xf, yf - 1, zf - 1),
    grad3(bbb, xf - 1, yf - 1, zf - 1),
    u
  );
  const y1 = lerp(x1, x2, v);
  const y2 = lerp(x3, x4, v);
  return lerp(y1, y2, w);
}
function hash2(perm, ix, iy) {
  return perm[(ix & 255) + perm[iy & 255] & 511];
}
function hash3(perm, ix, iy, iz) {
  return perm[(ix & 255) + perm[(iy & 255) + perm[iz & 255] & 511] & 511];
}
function hashToFloat(h) {
  return h / 256;
}
function worley2D(seed, x, y) {
  const perm = getPermTable(seed);
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  let minDist = Infinity;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const cx = xi + dx;
      const cy = yi + dy;
      const h1 = hash2(perm, cx, cy);
      const h2 = hash2(perm, cx + 243, cy + 127);
      const fpx = cx + hashToFloat(h1);
      const fpy = cy + hashToFloat(h2);
      const distX = fpx - x;
      const distY = fpy - y;
      const dist2 = distX * distX + distY * distY;
      if (dist2 < minDist) {
        minDist = dist2;
      }
    }
  }
  return Math.sqrt(minDist) * 2 - 1;
}
function worley3D(seed, x, y, z) {
  const perm = getPermTable(seed);
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  let minDist = Infinity;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dz = -1; dz <= 1; dz++) {
        const cx = xi + dx;
        const cy = yi + dy;
        const cz = zi + dz;
        const h1 = hash3(perm, cx, cy, cz);
        const h2 = hash3(perm, cx + 243, cy + 127, cz + 71);
        const h3 = hash3(perm, cx + 59, cy + 191, cz + 157);
        const fpx = cx + hashToFloat(h1);
        const fpy = cy + hashToFloat(h2);
        const fpz = cz + hashToFloat(h3);
        const distX = fpx - x;
        const distY = fpy - y;
        const distZ = fpz - z;
        const dist2 = distX * distX + distY * distY + distZ * distZ;
        if (dist2 < minDist) {
          minDist = dist2;
        }
      }
    }
  }
  return Math.sqrt(minDist) * 2 - 1;
}
function valueNoise2D(seed, x, y) {
  const perm = getPermTable(seed);
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = fade(xf);
  const v = fade(yf);
  const c00 = hashToFloat(hash2(perm, xi, yi)) * 2 - 1;
  const c10 = hashToFloat(hash2(perm, xi + 1, yi)) * 2 - 1;
  const c01 = hashToFloat(hash2(perm, xi, yi + 1)) * 2 - 1;
  const c11 = hashToFloat(hash2(perm, xi + 1, yi + 1)) * 2 - 1;
  const x1 = lerp(c00, c10, u);
  const x2 = lerp(c01, c11, u);
  return lerp(x1, x2, v);
}
function valueNoise3D(seed, x, y, z) {
  const perm = getPermTable(seed);
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const xf = x - xi;
  const yf = y - yi;
  const zf = z - zi;
  const u = fade(xf);
  const v = fade(yf);
  const w = fade(zf);
  const c000 = hashToFloat(hash3(perm, xi, yi, zi)) * 2 - 1;
  const c100 = hashToFloat(hash3(perm, xi + 1, yi, zi)) * 2 - 1;
  const c010 = hashToFloat(hash3(perm, xi, yi + 1, zi)) * 2 - 1;
  const c110 = hashToFloat(hash3(perm, xi + 1, yi + 1, zi)) * 2 - 1;
  const c001 = hashToFloat(hash3(perm, xi, yi, zi + 1)) * 2 - 1;
  const c101 = hashToFloat(hash3(perm, xi + 1, yi, zi + 1)) * 2 - 1;
  const c011 = hashToFloat(hash3(perm, xi, yi + 1, zi + 1)) * 2 - 1;
  const c111 = hashToFloat(hash3(perm, xi + 1, yi + 1, zi + 1)) * 2 - 1;
  const x1 = lerp(c000, c100, u);
  const x2 = lerp(c010, c110, u);
  const x3 = lerp(c001, c101, u);
  const x4 = lerp(c011, c111, u);
  const y1 = lerp(x1, x2, v);
  const y2 = lerp(x3, x4, v);
  return lerp(y1, y2, w);
}

// src/utils/noise-helpers.ts
function fbm(noiseFn, seed, x, y, options) {
  const octaves = options?.octaves ?? 6;
  const lacunarity = options?.lacunarity ?? 2;
  const persistence = options?.persistence ?? 0.5;
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let maxAmplitude = 0;
  for (let i = 0; i < octaves; i++) {
    value += amplitude * noiseFn(seed, x * frequency, y * frequency);
    maxAmplitude += amplitude;
    amplitude *= persistence;
    frequency *= lacunarity;
  }
  return value / maxAmplitude;
}
function turbulence(noiseFn, seed, x, y, options) {
  const octaves = options?.octaves ?? 6;
  const lacunarity = options?.lacunarity ?? 2;
  const persistence = options?.persistence ?? 0.5;
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let maxAmplitude = 0;
  for (let i = 0; i < octaves; i++) {
    value += amplitude * Math.abs(noiseFn(seed, x * frequency, y * frequency));
    maxAmplitude += amplitude;
    amplitude *= persistence;
    frequency *= lacunarity;
  }
  return value / maxAmplitude * 2 - 1;
}
function ridgedNoise(noiseFn, seed, x, y, options) {
  const octaves = options?.octaves ?? 6;
  const lacunarity = options?.lacunarity ?? 2;
  const persistence = options?.persistence ?? 0.5;
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let weight = 1;
  let maxAmplitude = 0;
  for (let i = 0; i < octaves; i++) {
    let signal = noiseFn(seed, x * frequency, y * frequency);
    signal = 1 - Math.abs(signal);
    signal *= signal;
    signal *= weight;
    weight = Math.min(Math.max(signal * 2, 0), 1);
    value += amplitude * signal;
    maxAmplitude += amplitude;
    amplitude *= persistence;
    frequency *= lacunarity;
  }
  return value / maxAmplitude * 2 - 1;
}
function domainWarp(noiseFn, seed, x, y, warpAmount = 1) {
  const seedStr = String(seed);
  const warpX = noiseFn(seedStr + "_wx", x, y) * warpAmount;
  const warpY = noiseFn(seedStr + "_wy", x, y) * warpAmount;
  return noiseFn(seed, x + warpX, y + warpY);
}
function animatedNoise(noiseFn, seed, x, y, time, speed = 1) {
  const timeOffset = time * speed;
  return noiseFn(
    seed,
    x + Math.sin(timeOffset * 0.7) * 100,
    y + Math.cos(timeOffset * 0.7) * 100
  );
}

// src/utils/gif.ts
function getGifFrameAtTime(metadata, timeMs, loop = true, speed = 1) {
  const { frames, totalDuration } = metadata;
  if (frames.length === 0) return 0;
  if (totalDuration <= 0) return 0;
  let effectiveTime = timeMs * speed;
  if (loop) {
    effectiveTime = effectiveTime % totalDuration;
    if (effectiveTime < 0) effectiveTime += totalDuration;
  } else {
    effectiveTime = Math.max(0, Math.min(effectiveTime, totalDuration));
  }
  let cumulative = 0;
  for (let i = 0; i < frames.length; i++) {
    cumulative += frames[i].delay;
    if (effectiveTime < cumulative) {
      return i;
    }
  }
  return frames.length - 1;
}

// src/utils/gif-optimizer.ts
function estimateGifFileSize(width, height, frameCount, colors = 256) {
  if (width <= 0 || height <= 0 || frameCount <= 0 || colors <= 0) {
    return 0;
  }
  const clampedColors = Math.min(256, Math.max(2, colors));
  const bitsPerPixel = Math.ceil(Math.log2(clampedColors));
  const rawFrameSize = width * height * bitsPerPixel / 8;
  const compressionRatio = 0.5;
  const frameOverhead = 20;
  const globalOverhead = 800 + clampedColors * 3;
  const estimatedSize = globalOverhead + frameCount * (rawFrameSize * compressionRatio + frameOverhead);
  return Math.ceil(estimatedSize);
}
function calculateOptimalColors(targetSizeBytes, width, height, frameCount) {
  if (targetSizeBytes <= 0 || width <= 0 || height <= 0 || frameCount <= 0) {
    return 2;
  }
  let low = 2;
  let high = 256;
  let result = 2;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const estimated = estimateGifFileSize(width, height, frameCount, mid);
    if (estimated <= targetSizeBytes) {
      result = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return result;
}
function getGifOptimizationPreset(purpose) {
  switch (purpose) {
    case "social":
      return {
        maxWidth: 480,
        maxHeight: 480,
        fps: 15,
        colors: 128,
        dither: "floyd_steinberg",
        maxFileSize: 8 * 1024 * 1024,
        // 8MB (Twitter/X limit)
        loop: 0
      };
    case "web":
      return {
        maxWidth: 640,
        maxHeight: 480,
        fps: 20,
        colors: 256,
        dither: "floyd_steinberg",
        maxFileSize: 5 * 1024 * 1024,
        // 5MB for web performance
        loop: 0
      };
    case "email":
      return {
        maxWidth: 320,
        maxHeight: 240,
        fps: 10,
        colors: 64,
        dither: "bayer",
        maxFileSize: 1 * 1024 * 1024,
        // 1MB for email clients
        loop: 0
      };
  }
}

// src/export/svg-exporter.ts
var SAMPLE_COUNT = 20;
var UNSUPPORTED_TYPES = ["video", "audio", "lottie", "custom", "three", "gif"];
var UNSUPPORTED_REASONS = {
  video: "Video playback cannot be represented in static SVG",
  audio: "Audio has no visual representation in SVG",
  lottie: "Lottie animations require a dedicated runtime player",
  custom: "Custom React components cannot be serialized to SVG",
  three: "Three.js 3D scenes require WebGL which is not available in SVG",
  gif: "Animated GIFs require frame-by-frame decoding which is not available in SVG"
};
function exportAnimatedSvg(template, inputs) {
  let resolved = template;
  if (inputs && Object.keys(inputs).length > 0) {
    const processor = new TemplateProcessor();
    resolved = processor.resolveInputs(template, inputs);
  }
  const { width, height } = resolved.output;
  const fps = resolved.output.fps ?? 30;
  const bgColor = resolved.output.backgroundColor ?? "#000000";
  const defs = [];
  const styles = [];
  const elements = [];
  const unsupportedLayers = [];
  let idCounter = 0;
  const nextId = () => `rv-${++idCounter}`;
  for (const scene of resolved.composition.scenes) {
    const sceneOffsetSec = scene.startFrame / fps;
    const sceneDurationFrames = scene.endFrame - scene.startFrame;
    if (scene.backgroundColor) {
      const sceneStart = scene.startFrame / fps;
      const sceneDur = sceneDurationFrames / fps;
      const bgId = nextId();
      elements.push(
        `  <rect id="${bgId}" x="0" y="0" width="${width}" height="${height}" fill="${esc(scene.backgroundColor)}" opacity="0"><animate attributeName="opacity" from="1" to="1" begin="${round(sceneStart)}s" dur="${round(sceneDur)}s" fill="freeze" /></rect>`
      );
    }
    for (const layer of scene.layers) {
      convertLayer(layer, scene, sceneOffsetSec, sceneDurationFrames, fps, { width, height }, defs, styles, elements, unsupportedLayers);
    }
  }
  const defsBlock = defs.length > 0 ? `  <defs>
${defs.join("\n")}
  </defs>
` : "";
  const styleBlock = styles.length > 0 ? `  <style>
${styles.join("\n")}
  </style>
` : "";
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">`,
    `  <rect width="${width}" height="${height}" fill="${esc(bgColor)}" />`,
    defsBlock,
    styleBlock,
    elements.join("\n"),
    `</svg>`
  ].filter(Boolean).join("\n");
  return { svg, unsupportedLayers };
}
function convertLayer(layer, scene, sceneOffsetSec, sceneDurationFrames, fps, canvasSize, defs, styles, elements, unsupportedLayers) {
  if (UNSUPPORTED_TYPES.includes(layer.type)) {
    elements.push(`  <!-- Unsupported layer type "${layer.type}" (${esc(layer.name ?? layer.id)}) -->`);
    unsupportedLayers.push({
      id: layer.id,
      name: layer.name,
      type: layer.type,
      reason: UNSUPPORTED_REASONS[layer.type] ?? `Layer type "${layer.type}" is not supported in SVG export`
    });
    return;
  }
  if (layer.hidden) return;
  const layerId = sanitizeId(layer.id);
  const anchor = layer.anchor ?? { x: 0, y: 0 };
  const x = layer.position.x - layer.size.width * anchor.x;
  const y = layer.position.y - layer.size.height * anchor.y;
  const baseOpacity = layer.opacity ?? 1;
  const baseRotation = layer.rotation ?? 0;
  const baseScaleX = layer.scale?.x ?? 1;
  const baseScaleY = layer.scale?.y ?? 1;
  let content;
  switch (layer.type) {
    case "text":
      content = convertTextLayer(layer, defs, layerId);
      break;
    case "shape":
      content = convertShapeLayer(layer, defs, layerId);
      break;
    case "image":
      content = convertImageLayer(layer);
      break;
    case "group":
      content = convertGroupLayer(layer, scene, sceneOffsetSec, sceneDurationFrames, fps, canvasSize, defs, styles, unsupportedLayers);
      break;
    default:
      return;
  }
  const anchorPxX = layer.size.width * anchor.x;
  const anchorPxY = layer.size.height * anchor.y;
  const transformOrigin = `${anchorPxX}px ${anchorPxY}px`;
  const baseTransform = buildTransform(0, 0, baseScaleX, baseScaleY, baseRotation);
  const anims = layer.animations ?? [];
  const animRules = [];
  for (let ai = 0; ai < anims.length; ai++) {
    const anim = anims[ai];
    const animId = `${layerId}-anim-${ai}`;
    const result = generateAnimationCSS(anim, animId, fps, canvasSize, x, y, baseScaleX, baseScaleY, baseRotation, baseOpacity);
    if (result) {
      styles.push(result.keyframes);
      animRules.push(result.rule(sceneOffsetSec));
    }
  }
  const layerFrom = layer.from ?? 0;
  const layerDuration = layer.duration === void 0 || layer.duration === -1 ? sceneDurationFrames - layerFrom : layer.duration;
  const visStart = (scene.startFrame + layerFrom) / fps;
  const visDur = layerDuration / fps;
  const hasAnimations = animRules.length > 0;
  const cssRules = [];
  if (hasAnimations) {
    cssRules.push(`      transform-origin: ${round(anchorPxX + x)}px ${round(anchorPxY + y)}px;`);
    cssRules.push(`      transform: ${buildTransform(x, y, baseScaleX, baseScaleY, baseRotation)};`);
    cssRules.push(`      opacity: ${baseOpacity};`);
  } else {
    cssRules.push(`      transform-origin: ${transformOrigin};`);
    cssRules.push(`      transform: ${baseTransform};`);
    cssRules.push(`      opacity: ${baseOpacity};`);
  }
  if (layerFrom > 0 || layerDuration < sceneDurationFrames) {
    cssRules.push(`      visibility: hidden;`);
    const visAnimId = `${layerId}-vis`;
    styles.push(
      `    @keyframes ${visAnimId} {
      0%, 100% { visibility: visible; }
    }`
    );
    animRules.push(
      `${visAnimId} ${round(visDur)}s ${round(visStart)}s 1 linear forwards`
    );
  }
  if (animRules.length > 0) {
    cssRules.push(`      animation: ${animRules.join(", ")};`);
  }
  styles.push(`    #${layerId} {
${cssRules.join("\n")}
    }`);
  if (hasAnimations) {
    elements.push(
      `  <g id="${layerId}">`,
      `    ${content}`,
      `  </g>`
    );
  } else {
    elements.push(
      `  <g id="${layerId}" transform="translate(${round(x)}, ${round(y)})">`,
      `    ${content}`,
      `  </g>`
    );
  }
}
function convertTextLayer(layer, defs, layerId) {
  const props = layer.props;
  const fontSize = props.fontSize ?? 16;
  const fontFamily = props.fontFamily ?? "sans-serif";
  const fontWeight = props.fontWeight ?? "normal";
  const fontStyle = props.fontStyle ?? "normal";
  const color = props.color ?? "#ffffff";
  const textAlign = props.textAlign ?? "left";
  const lineHeight = props.lineHeight ?? 1.2;
  const letterSpacing = props.letterSpacing ?? 0;
  const textAnchor = textAlign === "center" ? "middle" : textAlign === "right" ? "end" : "start";
  const textX = textAlign === "center" ? layer.size.width / 2 : textAlign === "right" ? layer.size.width : 0;
  const lines = props.text.split("\n");
  const lineSpacing = fontSize * lineHeight;
  const verticalAlign = props.verticalAlign ?? "top";
  const totalTextHeight = lines.length * lineSpacing;
  let startY;
  if (verticalAlign === "middle") {
    startY = (layer.size.height - totalTextHeight) / 2 + fontSize;
  } else if (verticalAlign === "bottom") {
    startY = layer.size.height - totalTextHeight + fontSize;
  } else {
    startY = fontSize;
  }
  let tspans;
  if (props.spans && props.spans.length > 0) {
    tspans = props.spans.map((span) => {
      const spanAttrs = [];
      if (span.fontFamily) spanAttrs.push(`font-family="${esc(span.fontFamily)}"`);
      if (span.fontSize !== void 0) spanAttrs.push(`font-size="${span.fontSize}"`);
      if (span.fontWeight) spanAttrs.push(`font-weight="${span.fontWeight}"`);
      if (span.fontStyle) spanAttrs.push(`font-style="${span.fontStyle}"`);
      if (span.color) spanAttrs.push(`fill="${esc(span.color)}"`);
      if (span.letterSpacing !== void 0) spanAttrs.push(`letter-spacing="${span.letterSpacing}"`);
      if (span.textDecoration) spanAttrs.push(`text-decoration="${span.textDecoration}"`);
      if (span.stroke) {
        spanAttrs.push(`stroke="${esc(span.stroke.color)}"`);
        spanAttrs.push(`stroke-width="${span.stroke.width}"`);
        spanAttrs.push(`paint-order="stroke"`);
      }
      const attrStr = spanAttrs.length > 0 ? ` ${spanAttrs.join(" ")}` : "";
      return `<tspan${attrStr}>${esc(span.text)}</tspan>`;
    }).join("");
  } else {
    tspans = lines.map(
      (line, i) => `<tspan x="${textX}" dy="${i === 0 ? 0 : lineSpacing}">${esc(line)}</tspan>`
    ).join("");
  }
  const attrs = [
    `font-family="${esc(fontFamily)}"`,
    `font-size="${fontSize}"`,
    `font-weight="${fontWeight}"`,
    `font-style="${fontStyle}"`,
    `fill="${esc(color)}"`,
    `text-anchor="${textAnchor}"`
  ];
  if (letterSpacing) {
    attrs.push(`letter-spacing="${letterSpacing}"`);
  }
  let strokeAttrs = "";
  if (props.stroke) {
    strokeAttrs = ` stroke="${esc(props.stroke.color)}" stroke-width="${props.stroke.width}" paint-order="stroke"`;
  }
  let filterId = "";
  if (props.textShadow) {
    filterId = `${layerId}-shadow`;
    const ts = props.textShadow;
    let dx = 0, dy = 0, blurVal = 0, shadowColor = "rgba(0,0,0,0.5)";
    if (typeof ts === "string") {
      const m = ts.match(/^([\d.-]+)\w*\s+([\d.-]+)\w*\s+([\d.-]+)\w*\s+(.+)$/);
      if (m) {
        dx = parseFloat(m[1]);
        dy = parseFloat(m[2]);
        blurVal = parseFloat(m[3]);
        shadowColor = m[4];
      }
    } else if (typeof ts === "object" && ts !== null) {
      const obj = ts;
      dx = obj.offsetX ?? 0;
      dy = obj.offsetY ?? 0;
      blurVal = obj.blur ?? 0;
      shadowColor = obj.color ?? "rgba(0,0,0,0.5)";
    }
    defs.push(
      `    <filter id="${filterId}"><feDropShadow dx="${dx}" dy="${dy}" stdDeviation="${blurVal / 2}" flood-color="${esc(shadowColor)}" /></filter>`
    );
  }
  let bgRect = "";
  if (props.backgroundColor) {
    const padding = typeof props.padding === "number" ? props.padding : 0;
    const br = props.borderRadius ?? 0;
    bgRect = `<rect x="${-padding}" y="${-padding}" width="${layer.size.width + padding * 2}" height="${layer.size.height + padding * 2}" rx="${br}" ry="${br}" fill="${esc(props.backgroundColor)}" />`;
  }
  const filterRef = filterId ? ` filter="url(#${filterId})"` : "";
  return `${bgRect}<text y="${startY}" ${attrs.join(" ")}${strokeAttrs}${filterRef}>${tspans}</text>`;
}
function convertShapeLayer(layer, defs, layerId) {
  const props = layer.props;
  const { width, height } = layer.size;
  const gradientId = `${layerId}-grad`;
  let fillValue;
  if (props.gradient) {
    defs.push(createGradientDef(props.gradient, gradientId));
    fillValue = `url(#${gradientId})`;
  } else {
    fillValue = props.fill ?? "transparent";
  }
  const stroke = props.stroke ? ` stroke="${esc(props.stroke)}"` : "";
  const strokeWidth = props.strokeWidth ? ` stroke-width="${props.strokeWidth}"` : "";
  const strokeDash = props.strokeDash ? ` stroke-dasharray="${props.strokeDash.join(" ")}"` : "";
  const common = `fill="${esc(fillValue)}"${stroke}${strokeWidth}${strokeDash}`;
  const sw = props.strokeWidth ?? 0;
  switch (props.shape) {
    case "rectangle": {
      const br = props.borderRadius ?? 0;
      return `<rect x="${sw / 2}" y="${sw / 2}" width="${width - sw}" height="${height - sw}" rx="${br}" ry="${br}" ${common} />`;
    }
    case "ellipse":
      return `<ellipse cx="${width / 2}" cy="${height / 2}" rx="${(width - sw) / 2}" ry="${(height - sw) / 2}" ${common} />`;
    case "polygon": {
      const sides = props.sides ?? 6;
      const pts = generatePolygonPoints(sides, width, height);
      return `<polygon points="${pts}" ${common} />`;
    }
    case "star": {
      const numPoints = props.points ?? 5;
      const innerRadius = props.innerRadius ?? 0.5;
      const pts = generateStarPoints(numPoints, width, height, innerRadius);
      return `<polygon points="${pts}" ${common} />`;
    }
    case "path":
      return `<path d="${esc(props.pathData ?? "")}" ${common} />`;
    default:
      return `<rect width="${width}" height="${height}" ${common} />`;
  }
}
function convertImageLayer(layer) {
  const { width, height } = layer.size;
  const fit = layer.props.fit ?? "cover";
  const preserveAspectRatio = fit === "cover" ? "xMidYMid slice" : fit === "contain" ? "xMidYMid meet" : fit === "fill" ? "none" : "xMidYMid slice";
  return `<image href="${esc(layer.props.src)}" width="${width}" height="${height}" preserveAspectRatio="${preserveAspectRatio}" />`;
}
function convertGroupLayer(layer, scene, sceneOffsetSec, sceneDurationFrames, fps, canvasSize, defs, styles, unsupportedLayers) {
  const childElements = [];
  for (const child of layer.children) {
    convertLayer(child, scene, sceneOffsetSec, sceneDurationFrames, fps, canvasSize, defs, styles, childElements, unsupportedLayers);
  }
  return childElements.join("\n    ");
}
function generateAnimationCSS(anim, animId, fps, canvasSize, baseX, baseY, baseScaleX, baseScaleY, baseRotation, baseOpacity) {
  const duration = anim.duration;
  if (duration <= 0) return null;
  let kfs;
  if (anim.type === "keyframe" && anim.keyframes) {
    kfs = anim.keyframes;
  } else if (anim.effect) {
    kfs = generatePresetKeyframes(anim.effect, {
      duration,
      easing: anim.easing,
      canvasSize
    });
    if (kfs.length === 0) return null;
  } else {
    return null;
  }
  const stops = [];
  for (let i = 0; i <= SAMPLE_COUNT; i++) {
    const frame = i / SAMPLE_COUNT * duration;
    const props = getPropertiesAtFrame(kfs, frame);
    const pct = Math.round(i / SAMPLE_COUNT * 100);
    const tx = baseX + (props.x ?? 0);
    const ty = baseY + (props.y ?? 0);
    const sx = (props.scaleX ?? 1) * baseScaleX;
    const sy = (props.scaleY ?? 1) * baseScaleY;
    const rot = (props.rotation ?? 0) + baseRotation;
    const transformParts = [];
    transformParts.push(`translate(${round(tx)}px, ${round(ty)}px)`);
    if (sx !== 1 || sy !== 1) {
      transformParts.push(`scale(${round(sx)}, ${round(sy)})`);
    }
    if (rot !== 0) {
      transformParts.push(`rotate(${round(rot)}deg)`);
    }
    const cssParts = [];
    cssParts.push(`transform: ${transformParts.join(" ")}`);
    const effectiveOpacity = (props.opacity ?? 1) * baseOpacity;
    cssParts.push(`opacity: ${round(effectiveOpacity)}`);
    if (cssParts.length > 0) {
      stops.push(`      ${pct}% { ${cssParts.join("; ")}; }`);
    }
  }
  if (stops.length === 0) return null;
  const keyframesCSS = `    @keyframes ${animId} {
${stops.join("\n")}
    }`;
  const durSec = duration / fps;
  const delaySec = (anim.delay ?? 0) / fps;
  const iterations = anim.loop === -1 ? "infinite" : String(anim.loop ?? 1);
  const direction = anim.alternate ? "alternate" : "normal";
  const preset = anim.effect ? getPreset(anim.effect) : void 0;
  const animType = preset?.type ?? anim.type;
  const fillMode = animType === "emphasis" ? "none" : "forwards";
  return {
    keyframes: keyframesCSS,
    rule: (sceneOffsetSec) => {
      const totalDelay = sceneOffsetSec + delaySec;
      return `${animId} ${round(durSec)}s ${round(totalDelay)}s linear ${iterations} ${direction} ${fillMode}`;
    }
  };
}
function generatePolygonPoints(sides, width, height) {
  const pts = [];
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2;
  for (let i = 0; i < sides; i++) {
    const angle = i * 2 * Math.PI / sides - Math.PI / 2;
    const px = centerX + radius * Math.cos(angle);
    const py = centerY + radius * Math.sin(angle);
    pts.push(`${round(px)},${round(py)}`);
  }
  return pts.join(" ");
}
function generateStarPoints(numPoints, width, height, innerRadius) {
  const result = [];
  const centerX = width / 2;
  const centerY = height / 2;
  const outerRadius = Math.min(width, height) / 2;
  const inner = outerRadius * innerRadius;
  for (let i = 0; i < numPoints * 2; i++) {
    const angle = i * Math.PI / numPoints - Math.PI / 2;
    const r = i % 2 === 0 ? outerRadius : inner;
    const px = centerX + r * Math.cos(angle);
    const py = centerY + r * Math.sin(angle);
    result.push(`${round(px)},${round(py)}`);
  }
  return result.join(" ");
}
function createGradientDef(gradient, id) {
  const { type, colors, angle = 0 } = gradient;
  if (type === "radial") {
    const stops2 = colors.map(
      (stop) => `<stop offset="${stop.offset * 100}%" stop-color="${esc(stop.color)}" />`
    ).join("");
    return `    <radialGradient id="${id}" cx="50%" cy="50%" r="50%">${stops2}</radialGradient>`;
  }
  const rad = angle * Math.PI / 180;
  const x1 = 50 - Math.cos(rad) * 50;
  const y1 = 50 + Math.sin(rad) * 50;
  const x2 = 50 + Math.cos(rad) * 50;
  const y2 = 50 - Math.sin(rad) * 50;
  const stops = colors.map(
    (stop) => `<stop offset="${stop.offset * 100}%" stop-color="${esc(stop.color)}" />`
  ).join("");
  return `    <linearGradient id="${id}" x1="${round(x1)}%" y1="${round(y1)}%" x2="${round(x2)}%" y2="${round(y2)}%">${stops}</linearGradient>`;
}
function buildTransform(x, y, scaleX, scaleY, rotation) {
  const parts = [];
  if (x !== 0 || y !== 0) parts.push(`translate(${round(x)}px, ${round(y)}px)`);
  if (scaleX !== 1 || scaleY !== 1) parts.push(`scale(${round(scaleX)}, ${round(scaleY)})`);
  if (rotation !== 0) parts.push(`rotate(${round(rotation)}deg)`);
  return parts.length > 0 ? parts.join(" ") : "none";
}
function round(n) {
  return Math.round(n * 1e3) / 1e3;
}
function esc(s) {
  const str = String(s ?? "");
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function sanitizeId(id) {
  return id.replace(/[^a-zA-Z0-9_-]/g, "_");
}

// src/utils/text.ts
function getCharWidthRatio(fontFamily) {
  const lower = fontFamily.toLowerCase();
  if (lower.includes("serif") && !lower.includes("sans")) {
    return 0.55;
  }
  return 0.6;
}
function measureText(options) {
  const {
    text,
    fontFamily,
    fontSize,
    fontWeight,
    letterSpacing = 0,
    lineHeight = 1.2,
    maxWidth
  } = options;
  const baseRatio = getCharWidthRatio(fontFamily);
  let weightMultiplier = 1;
  if (fontWeight !== void 0) {
    const w = typeof fontWeight === "number" ? fontWeight : parseInt(String(fontWeight), 10);
    if (!isNaN(w) && w >= 700) {
      weightMultiplier = 1.05;
    } else if (fontWeight === "bold") {
      weightMultiplier = 1.05;
    }
  }
  const charWidth = fontSize * baseRatio * weightMultiplier + letterSpacing;
  const lineHeightPx = fontSize * lineHeight;
  const lines = text.split("\n");
  if (maxWidth === void 0) {
    let maxLineWidth2 = 0;
    for (const line of lines) {
      const w = line.length * charWidth;
      if (w > maxLineWidth2) maxLineWidth2 = w;
    }
    return {
      width: maxLineWidth2,
      height: lines.length * lineHeightPx
    };
  }
  let totalLines = 0;
  let maxLineWidth = 0;
  for (const line of lines) {
    if (line.length === 0) {
      totalLines++;
      continue;
    }
    const words = line.split(/\s+/);
    let currentLineWidth = 0;
    let firstWord = true;
    for (const word of words) {
      const wordWidth = word.length * charWidth;
      const spaceWidth = firstWord ? 0 : charWidth;
      if (!firstWord && currentLineWidth + spaceWidth + wordWidth > maxWidth) {
        if (currentLineWidth > maxLineWidth) maxLineWidth = currentLineWidth;
        currentLineWidth = wordWidth;
        totalLines++;
      } else {
        currentLineWidth += spaceWidth + wordWidth;
      }
      firstWord = false;
    }
    if (currentLineWidth > maxLineWidth) maxLineWidth = currentLineWidth;
    totalLines++;
  }
  return {
    width: Math.min(maxLineWidth, maxWidth),
    height: totalLines * lineHeightPx
  };
}
function fitText(options) {
  const {
    text,
    withinWidth,
    fontFamily,
    minFontSize = 1,
    maxFontSize = 200,
    fontWeight,
    letterSpacing
  } = options;
  let lo = minFontSize;
  let hi = maxFontSize;
  while (hi - lo > 0.5) {
    const mid = (lo + hi) / 2;
    const measurement = measureText({
      text,
      fontFamily,
      fontSize: mid,
      fontWeight,
      letterSpacing
    });
    if (measurement.width <= withinWidth) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return { fontSize: Math.floor(lo) };
}

// src/utils/audio.ts
var DEFAULT_FFT_SIZE = 2048;
function fft(re, im) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    while (j & bit) {
      j ^= bit;
      bit >>= 1;
    }
    j ^= bit;
    if (i < j) {
      let tmp = re[i];
      re[i] = re[j];
      re[j] = tmp;
      tmp = im[i];
      im[i] = im[j];
      im[j] = tmp;
    }
  }
  for (let len = 2; len <= n; len *= 2) {
    const halfLen = len / 2;
    const angle = -2 * Math.PI / len;
    const wRe = Math.cos(angle);
    const wIm = Math.sin(angle);
    for (let i = 0; i < n; i += len) {
      let curRe = 1;
      let curIm = 0;
      for (let j = 0; j < halfLen; j++) {
        const evenIdx = i + j;
        const oddIdx = i + j + halfLen;
        const tRe = curRe * re[oddIdx] - curIm * im[oddIdx];
        const tIm = curRe * im[oddIdx] + curIm * re[oddIdx];
        re[oddIdx] = re[evenIdx] - tRe;
        im[oddIdx] = im[evenIdx] - tIm;
        re[evenIdx] += tRe;
        im[evenIdx] += tIm;
        const nextRe = curRe * wRe - curIm * wIm;
        const nextIm = curRe * wIm + curIm * wRe;
        curRe = nextRe;
        curIm = nextIm;
      }
    }
  }
}
function applyHanningWindow(samples) {
  const n = samples.length;
  for (let i = 0; i < n; i++) {
    samples[i] *= 0.5 * (1 - Math.cos(2 * Math.PI * i / (n - 1)));
  }
}
function nextPowerOf2(n) {
  let p = 1;
  while (p < n) p *= 2;
  return p;
}
function mixToMono(audioData) {
  if (audioData.numberOfChannels === 1) {
    return audioData.channelData[0];
  }
  const length = audioData.length;
  const mono = new Float32Array(length);
  const numChannels = audioData.numberOfChannels;
  for (let i = 0; i < length; i++) {
    let sum = 0;
    for (let ch = 0; ch < numChannels; ch++) {
      sum += audioData.channelData[ch][i];
    }
    mono[i] = sum / numChannels;
  }
  return mono;
}
function getAudioData(samples, sampleRate, numberOfChannels = 1) {
  const length = Math.floor(samples.length / numberOfChannels);
  const channelData = [];
  for (let ch = 0; ch < numberOfChannels; ch++) {
    const channel = new Float32Array(length);
    for (let i = 0; i < length; i++) {
      channel[i] = samples[ch + i * numberOfChannels];
    }
    channelData.push(channel);
  }
  return {
    channelData,
    sampleRate,
    numberOfChannels,
    durationInSeconds: length / sampleRate,
    length
  };
}
function visualizeAudio(options) {
  const {
    audioData,
    frame,
    fps,
    numberOfSamples = 256,
    smoothingTimeConstant = 0.8
  } = options;
  const mono = mixToMono(audioData);
  const startSample = Math.floor(frame / fps * audioData.sampleRate);
  const windowSize = nextPowerOf2(Math.max(DEFAULT_FFT_SIZE, numberOfSamples * 2));
  const re = new Float64Array(windowSize);
  const im = new Float64Array(windowSize);
  for (let i = 0; i < windowSize; i++) {
    const idx = startSample + i;
    re[i] = idx >= 0 && idx < mono.length ? mono[idx] : 0;
  }
  applyHanningWindow(re);
  fft(re, im);
  const halfSize = windowSize / 2;
  const magnitudes = new Float64Array(halfSize);
  let maxMag = 0;
  for (let i = 0; i < halfSize; i++) {
    magnitudes[i] = Math.sqrt(re[i] * re[i] + im[i] * im[i]);
    if (magnitudes[i] > maxMag) maxMag = magnitudes[i];
  }
  if (maxMag > 0) {
    for (let i = 0; i < halfSize; i++) {
      magnitudes[i] /= maxMag;
    }
  }
  if (smoothingTimeConstant > 0 && smoothingTimeConstant < 1) {
    for (let i = 0; i < halfSize; i++) {
      magnitudes[i] = magnitudes[i] * (1 - smoothingTimeConstant) + smoothingTimeConstant * magnitudes[i];
    }
  }
  const result = new Array(numberOfSamples);
  const binSize = halfSize / numberOfSamples;
  for (let i = 0; i < numberOfSamples; i++) {
    const start = Math.floor(i * binSize);
    const end = Math.floor((i + 1) * binSize);
    let sum = 0;
    const count = Math.max(1, end - start);
    for (let j = start; j < end && j < halfSize; j++) {
      sum += magnitudes[j];
    }
    result[i] = sum / count;
  }
  return result;
}
function visualizeAudioWaveform(options) {
  const { audioData, frame, fps, numberOfSamples = 64 } = options;
  const mono = mixToMono(audioData);
  const startSample = Math.floor(frame / fps * audioData.sampleRate);
  const samplesPerFrame = Math.ceil(audioData.sampleRate / fps);
  const result = new Array(numberOfSamples);
  const binSize = samplesPerFrame / numberOfSamples;
  for (let i = 0; i < numberOfSamples; i++) {
    const start = startSample + Math.floor(i * binSize);
    const end = startSample + Math.floor((i + 1) * binSize);
    let sum = 0;
    const count = Math.max(1, end - start);
    for (let j = start; j < end; j++) {
      const idx = Math.max(0, Math.min(j, mono.length - 1));
      sum += mono[idx];
    }
    result[i] = sum / count;
  }
  return result;
}
function getWaveformPortion(options) {
  const { audioData, startTimeInSeconds, durationInSeconds, numberOfSamples = 64 } = options;
  const mono = mixToMono(audioData);
  const startSample = Math.floor(startTimeInSeconds * audioData.sampleRate);
  const totalSamples = Math.floor(durationInSeconds * audioData.sampleRate);
  const result = new Array(numberOfSamples);
  const binSize = totalSamples / numberOfSamples;
  for (let i = 0; i < numberOfSamples; i++) {
    const start = startSample + Math.floor(i * binSize);
    const end = startSample + Math.floor((i + 1) * binSize);
    let sum = 0;
    const count = Math.max(1, end - start);
    for (let j = start; j < end; j++) {
      const idx = Math.max(0, Math.min(j, mono.length - 1));
      sum += mono[idx];
    }
    result[i] = sum / count;
  }
  return result;
}
function getAudioDuration(audioData) {
  return audioData.durationInSeconds;
}
function createSmoothSvgPath(points) {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0][0]} ${points[0][1]}`;
  let d = `M ${points[0][0]} ${points[0][1]}`;
  if (points.length === 2) {
    d += ` L ${points[1][0]} ${points[1][1]}`;
    return d;
  }
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

// src/utils/audio-analysis.ts
var DEFAULT_FFT_SIZE2 = 2048;
function fft2(re, im) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    while (j & bit) {
      j ^= bit;
      bit >>= 1;
    }
    j ^= bit;
    if (i < j) {
      let tmp = re[i];
      re[i] = re[j];
      re[j] = tmp;
      tmp = im[i];
      im[i] = im[j];
      im[j] = tmp;
    }
  }
  for (let len = 2; len <= n; len *= 2) {
    const halfLen = len / 2;
    const angle = -2 * Math.PI / len;
    const wRe = Math.cos(angle);
    const wIm = Math.sin(angle);
    for (let i = 0; i < n; i += len) {
      let curRe = 1;
      let curIm = 0;
      for (let j = 0; j < halfLen; j++) {
        const evenIdx = i + j;
        const oddIdx = i + j + halfLen;
        const tRe = curRe * re[oddIdx] - curIm * im[oddIdx];
        const tIm = curRe * im[oddIdx] + curIm * re[oddIdx];
        re[oddIdx] = re[evenIdx] - tRe;
        im[oddIdx] = im[evenIdx] - tIm;
        re[evenIdx] += tRe;
        im[evenIdx] += tIm;
        const nextRe = curRe * wRe - curIm * wIm;
        const nextIm = curRe * wIm + curIm * wRe;
        curRe = nextRe;
        curIm = nextIm;
      }
    }
  }
}
function applyHanningWindow2(samples) {
  const n = samples.length;
  for (let i = 0; i < n; i++) {
    samples[i] *= 0.5 * (1 - Math.cos(2 * Math.PI * i / (n - 1)));
  }
}
function nextPowerOf22(n) {
  let p = 1;
  while (p < n) p *= 2;
  return p;
}
function mixToMono2(audioData) {
  if (audioData.numberOfChannels === 1) {
    return audioData.channelData[0];
  }
  const length = audioData.length;
  const mono = new Float32Array(length);
  const numChannels = audioData.numberOfChannels;
  for (let i = 0; i < length; i++) {
    let sum = 0;
    for (let ch = 0; ch < numChannels; ch++) {
      sum += audioData.channelData[ch][i];
    }
    mono[i] = sum / numChannels;
  }
  return mono;
}
var DEFAULT_BANDS = [
  { name: "sub-bass", minFreq: 20, maxFreq: 60 },
  { name: "bass", minFreq: 60, maxFreq: 250 },
  { name: "low-mid", minFreq: 250, maxFreq: 500 },
  { name: "mid", minFreq: 500, maxFreq: 2e3 },
  { name: "high-mid", minFreq: 2e3, maxFreq: 4e3 },
  { name: "presence", minFreq: 4e3, maxFreq: 6e3 },
  { name: "brilliance", minFreq: 6e3, maxFreq: 2e4 }
];
function detectBeats(audioData, options = {}) {
  const {
    minInterval = 0.3,
    threshold = 1.5,
    windowSize = 0.5,
    sensitivity = 0.5
  } = options;
  const mono = mixToMono2(audioData);
  const sampleRate = audioData.sampleRate;
  const hopSamples = Math.floor(sampleRate * 0.01);
  const frameSamples = Math.floor(sampleRate * 0.02);
  const numFrames = Math.floor((mono.length - frameSamples) / hopSamples);
  if (numFrames <= 0) return [];
  const energies = new Float64Array(numFrames);
  for (let i = 0; i < numFrames; i++) {
    const start = i * hopSamples;
    let energy = 0;
    for (let j = 0; j < frameSamples; j++) {
      const idx = start + j;
      if (idx < mono.length) {
        energy += mono[idx] * mono[idx];
      }
    }
    energies[i] = energy / frameSamples;
  }
  const windowFrames = Math.max(1, Math.floor(windowSize / 0.01));
  const beats = [];
  const minIntervalFrames = Math.floor(minInterval / 0.01);
  let lastBeatFrame = -minIntervalFrames;
  const effectiveThreshold = threshold * (1.5 - sensitivity);
  for (let i = 0; i < numFrames; i++) {
    const halfWindow = Math.floor(windowFrames / 2);
    const wStart = Math.max(0, i - halfWindow);
    const wEnd = Math.min(numFrames, i + halfWindow);
    let avgEnergy = 0;
    for (let j = wStart; j < wEnd; j++) {
      avgEnergy += energies[j];
    }
    avgEnergy /= wEnd - wStart;
    if (energies[i] > avgEnergy * effectiveThreshold && i - lastBeatFrame >= minIntervalFrames && energies[i] > 0) {
      const time = i * hopSamples / sampleRate;
      beats.push({
        frame: 0,
        // will be set below
        time,
        intensity: 0
        // will be normalized below
      });
      lastBeatFrame = i;
    }
  }
  if (beats.length > 0) {
    let maxEnergy = 0;
    const beatEnergies = [];
    for (const beat of beats) {
      const frameIdx = Math.floor(beat.time / 0.01);
      const e = frameIdx >= 0 && frameIdx < numFrames ? energies[frameIdx] : 0;
      beatEnergies.push(e);
      if (e > maxEnergy) maxEnergy = e;
    }
    for (let i = 0; i < beats.length; i++) {
      beats[i].intensity = maxEnergy > 0 ? beatEnergies[i] / maxEnergy : 0;
    }
  }
  return beats;
}
function getBeatAtFrame(beats, frame, fps, decayFrames = 8) {
  if (beats.length === 0) return 0;
  let maxIntensity = 0;
  for (const beat of beats) {
    const beatFrame = beat.time * fps;
    const frameDiff = frame - beatFrame;
    if (frameDiff < 0) continue;
    if (frameDiff <= decayFrames) {
      const decay = Math.exp(-3 * (frameDiff / decayFrames));
      const intensity = beat.intensity * decay;
      if (intensity > maxIntensity) {
        maxIntensity = intensity;
      }
    }
  }
  return Math.min(1, maxIntensity);
}
function getFrequencyBands(audioData, frame, fps, bands) {
  const bandDefs = bands || DEFAULT_BANDS;
  const mono = mixToMono2(audioData);
  const startSample = Math.floor(frame / fps * audioData.sampleRate);
  const windowSize = nextPowerOf22(DEFAULT_FFT_SIZE2);
  const re = new Float64Array(windowSize);
  const im = new Float64Array(windowSize);
  for (let i = 0; i < windowSize; i++) {
    const idx = startSample + i;
    re[i] = idx >= 0 && idx < mono.length ? mono[idx] : 0;
  }
  applyHanningWindow2(re);
  fft2(re, im);
  const halfSize = windowSize / 2;
  const magnitudes = new Float64Array(halfSize);
  for (let i = 0; i < halfSize; i++) {
    magnitudes[i] = Math.sqrt(re[i] * re[i] + im[i] * im[i]);
  }
  const freqPerBin = audioData.sampleRate / windowSize;
  const result = [];
  let maxEnergy = 0;
  for (const band of bandDefs) {
    const minBin = Math.max(0, Math.floor(band.minFreq / freqPerBin));
    const maxBin = Math.min(halfSize - 1, Math.ceil(band.maxFreq / freqPerBin));
    let energy = 0;
    let count = 0;
    for (let i = minBin; i <= maxBin; i++) {
      energy += magnitudes[i];
      count++;
    }
    energy = count > 0 ? energy / count : 0;
    result.push({
      name: band.name,
      minFreq: band.minFreq,
      maxFreq: band.maxFreq,
      energy
    });
    if (energy > maxEnergy) maxEnergy = energy;
  }
  if (maxEnergy > 0) {
    for (const band of result) {
      band.energy /= maxEnergy;
    }
  }
  return result;
}
function getAmplitudeEnvelope(audioData, frame, fps, windowSize) {
  const mono = mixToMono2(audioData);
  const samplesPerFrame = Math.ceil(audioData.sampleRate / fps);
  const effectiveWindow = windowSize ?? samplesPerFrame;
  const centerSample = Math.floor(frame / fps * audioData.sampleRate);
  const halfWindow = Math.floor(effectiveWindow / 2);
  const start = Math.max(0, centerSample - halfWindow);
  const end = Math.min(mono.length, centerSample + halfWindow);
  if (start >= end) return 0;
  let sumSquares = 0;
  for (let i = start; i < end; i++) {
    sumSquares += mono[i] * mono[i];
  }
  const rms = Math.sqrt(sumSquares / (end - start));
  return Math.min(1, rms * 2);
}

// src/utils/canvas-draw.ts
var COMMAND_RE = /([MmLlHhVvCcSsQqTtAaZz])/;
function parsePathNumbers(str) {
  const matches = str.match(/-?\d*\.?\d+(?:e[+-]?\d+)?/gi);
  return matches ? matches.map(Number) : [];
}
function parsePathData(d) {
  const tokens = d.split(COMMAND_RE).map((s) => s.trim()).filter((s) => s.length > 0);
  const segments = [];
  let currentCommand = "";
  for (const token of tokens) {
    if (/^[MmLlHhVvCcSsQqTtAaZz]$/.test(token)) {
      currentCommand = token;
    } else {
      const nums = parsePathNumbers(token);
      segments.push({ command: currentCommand, args: nums });
    }
  }
  return segments;
}
function createPath2DFromSvg(pathData) {
  return new Path2D(pathData);
}
function drawPath(ctx, pathData, options = {}) {
  const {
    fill,
    stroke,
    strokeWidth = 1,
    strokeDash,
    lineCap = "butt",
    lineJoin = "miter",
    opacity = 1
  } = options;
  ctx.save();
  ctx.globalAlpha = opacity;
  const path3 = createPath2DFromSvg(pathData);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill(path3);
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = lineCap;
    ctx.lineJoin = lineJoin;
    if (strokeDash) {
      ctx.setLineDash(strokeDash);
    }
    ctx.stroke(path3);
    if (strokeDash) {
      ctx.setLineDash([]);
    }
  }
  ctx.restore();
}
function createCanvasGradient(ctx, gradient, bounds) {
  let canvasGradient;
  if (gradient.type === "radial") {
    const cx = gradient.x0 ?? bounds.x + bounds.width / 2;
    const cy = gradient.y0 ?? bounds.y + bounds.height / 2;
    const r0 = gradient.r0 ?? 0;
    const r1 = gradient.r1 ?? Math.max(bounds.width, bounds.height) / 2;
    canvasGradient = ctx.createRadialGradient(cx, cy, r0, cx, cy, r1);
  } else if (gradient.type === "conic") {
    const cx = gradient.x0 ?? bounds.x + bounds.width / 2;
    const cy = gradient.y0 ?? bounds.y + bounds.height / 2;
    const startAngle = (gradient.startAngle ?? 0) * Math.PI / 180;
    canvasGradient = ctx.createConicGradient(startAngle, cx, cy);
  } else {
    const x0 = gradient.x0 ?? bounds.x;
    const y0 = gradient.y0 ?? bounds.y;
    const x1 = gradient.x1 ?? bounds.x + bounds.width;
    const y1 = gradient.y1 ?? bounds.y;
    canvasGradient = ctx.createLinearGradient(x0, y0, x1, y1);
  }
  for (const stop of gradient.stops) {
    canvasGradient.addColorStop(
      Math.max(0, Math.min(1, stop.offset)),
      stop.color
    );
  }
  return canvasGradient;
}
function drawGradient(ctx, gradient, bounds) {
  ctx.save();
  const canvasGradient = createCanvasGradient(ctx, gradient, bounds);
  ctx.fillStyle = canvasGradient;
  ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
  ctx.restore();
}
function samplePathPoints(pathData, numSamples) {
  const segments = parsePathData(pathData);
  const points = [];
  let cx = 0;
  let cy = 0;
  let startX = 0;
  let startY = 0;
  const allPoints = [];
  for (const seg of segments) {
    const cmd = seg.command;
    const a = seg.args;
    switch (cmd) {
      case "M":
        cx = a[0];
        cy = a[1];
        startX = cx;
        startY = cy;
        allPoints.push({ x: cx, y: cy });
        break;
      case "m":
        cx += a[0];
        cy += a[1];
        startX = cx;
        startY = cy;
        allPoints.push({ x: cx, y: cy });
        break;
      case "L":
        cx = a[0];
        cy = a[1];
        allPoints.push({ x: cx, y: cy });
        break;
      case "l":
        cx += a[0];
        cy += a[1];
        allPoints.push({ x: cx, y: cy });
        break;
      case "H":
        cx = a[0];
        allPoints.push({ x: cx, y: cy });
        break;
      case "h":
        cx += a[0];
        allPoints.push({ x: cx, y: cy });
        break;
      case "V":
        cy = a[0];
        allPoints.push({ x: cx, y: cy });
        break;
      case "v":
        cy += a[0];
        allPoints.push({ x: cx, y: cy });
        break;
      case "C":
        for (let t = 0.25; t <= 1; t += 0.25) {
          const t2 = t * t;
          const t3 = t2 * t;
          const mt = 1 - t;
          const mt2 = mt * mt;
          const mt3 = mt2 * mt;
          const x = mt3 * cx + 3 * mt2 * t * a[0] + 3 * mt * t2 * a[2] + t3 * a[4];
          const y = mt3 * cy + 3 * mt2 * t * a[1] + 3 * mt * t2 * a[3] + t3 * a[5];
          allPoints.push({ x, y });
        }
        cx = a[4];
        cy = a[5];
        break;
      case "Q":
        for (let t = 0.25; t <= 1; t += 0.25) {
          const mt = 1 - t;
          const x = mt * mt * cx + 2 * mt * t * a[0] + t * t * a[2];
          const y = mt * mt * cy + 2 * mt * t * a[1] + t * t * a[3];
          allPoints.push({ x, y });
        }
        cx = a[2];
        cy = a[3];
        break;
      case "Z":
      case "z":
        cx = startX;
        cy = startY;
        allPoints.push({ x: cx, y: cy });
        break;
    }
  }
  if (allPoints.length < 2) {
    return [];
  }
  const distances = [0];
  let totalLength = 0;
  for (let i = 1; i < allPoints.length; i++) {
    const dx = allPoints[i].x - allPoints[i - 1].x;
    const dy = allPoints[i].y - allPoints[i - 1].y;
    totalLength += Math.sqrt(dx * dx + dy * dy);
    distances.push(totalLength);
  }
  if (totalLength === 0) return [];
  for (let i = 0; i < numSamples; i++) {
    const t = i / Math.max(1, numSamples - 1) * totalLength;
    let segIdx = 0;
    for (let j = 1; j < distances.length; j++) {
      if (distances[j] >= t) {
        segIdx = j - 1;
        break;
      }
      segIdx = j - 1;
    }
    const segLen = distances[segIdx + 1] - distances[segIdx];
    const localT = segLen > 0 ? (t - distances[segIdx]) / segLen : 0;
    const p0 = allPoints[segIdx];
    const p1 = allPoints[Math.min(segIdx + 1, allPoints.length - 1)];
    const x = p0.x + (p1.x - p0.x) * localT;
    const y = p0.y + (p1.y - p0.y) * localT;
    const angle = Math.atan2(p1.y - p0.y, p1.x - p0.x);
    points.push({ x, y, angle });
  }
  return points;
}
function drawTextOnPath(ctx, text, pathData, options = {}) {
  const {
    fontSize = 16,
    fontFamily = "sans-serif",
    fontWeight = "normal",
    fill = "#000000",
    stroke,
    strokeWidth = 1,
    letterSpacing = 0,
    startOffset = 0
  } = options;
  ctx.save();
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.textBaseline = "middle";
  let totalWidth = 0;
  const charWidths = [];
  for (const char of text) {
    const w = ctx.measureText(char).width + letterSpacing;
    charWidths.push(w);
    totalWidth += w;
  }
  const numSamples = Math.max(text.length * 4, 100);
  const pathPoints = samplePathPoints(pathData, numSamples);
  if (pathPoints.length < 2) {
    ctx.restore();
    return;
  }
  let currentDist = startOffset * totalWidth;
  for (let i = 0; i < text.length; i++) {
    const charWidth = charWidths[i];
    const charCenter = currentDist + charWidth / 2;
    const t = Math.max(0, Math.min(1, charCenter / totalWidth));
    const idx = Math.min(
      Math.floor(t * (pathPoints.length - 1)),
      pathPoints.length - 1
    );
    const point = pathPoints[idx];
    ctx.save();
    ctx.translate(point.x, point.y);
    ctx.rotate(point.angle);
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fillText(text[i], -charWidth / 2, 0);
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.strokeText(text[i], -charWidth / 2, 0);
    }
    ctx.restore();
    currentDist += charWidth;
  }
  ctx.restore();
}
function createPattern(ctx, source, repetition = "repeat") {
  return ctx.createPattern(source, repetition);
}
function applyClipPath(ctx, pathData) {
  const path3 = createPath2DFromSvg(pathData);
  ctx.clip(path3);
}
function drawCircle(ctx, cx, cy, r, options = {}) {
  const { fill, stroke, strokeWidth = 1, opacity = 1 } = options;
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  }
  ctx.restore();
}
function drawRoundedRect(ctx, x, y, width, height, borderRadius = 0, options = {}) {
  const { fill, stroke, strokeWidth = 1, opacity = 1 } = options;
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.beginPath();
  if (borderRadius > 0) {
    const r = Math.min(borderRadius, width / 2, height / 2);
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.arcTo(x + width, y, x + width, y + r, r);
    ctx.lineTo(x + width, y + height - r);
    ctx.arcTo(x + width, y + height, x + width - r, y + height, r);
    ctx.lineTo(x + r, y + height);
    ctx.arcTo(x, y + height, x, y + height - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
  } else {
    ctx.rect(x, y, width, height);
  }
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
  }
  ctx.restore();
}

// src/utils/paths.ts
var COMMAND_RE2 = /([MmLlHhVvCcSsQqTtAaZz])/;
function tokenize(d) {
  return d.split(COMMAND_RE2).map((s) => s.trim()).filter((s) => s.length > 0);
}
function parseNumbers(str) {
  const matches = str.match(/-?\d*\.?\d+(?:e[+-]?\d+)?/gi);
  return matches ? matches.map(Number) : [];
}
function argsPerCommand(cmd) {
  switch (cmd.toUpperCase()) {
    case "M":
    case "L":
    case "T":
      return 2;
    case "H":
    case "V":
      return 1;
    case "C":
      return 6;
    case "S":
    case "Q":
      return 4;
    case "A":
      return 7;
    case "Z":
      return 0;
    default:
      return 0;
  }
}
function parsePath(d) {
  const tokens = tokenize(d);
  const commands = [];
  let i = 0;
  while (i < tokens.length) {
    const cmd = tokens[i];
    i++;
    if (cmd.toUpperCase() === "Z") {
      commands.push({ command: cmd, args: [] });
      continue;
    }
    const argCount = argsPerCommand(cmd);
    if (argCount === 0) {
      commands.push({ command: cmd, args: [] });
      continue;
    }
    const numStr = i < tokens.length ? tokens[i] : "";
    i++;
    const nums = parseNumbers(numStr);
    let offset = 0;
    let isFirst = true;
    while (offset + argCount <= nums.length) {
      const args = nums.slice(offset, offset + argCount);
      if (isFirst) {
        commands.push({ command: cmd, args });
        isFirst = false;
      } else {
        const implicitCmd = cmd === "M" ? "L" : cmd === "m" ? "l" : cmd;
        commands.push({ command: implicitCmd, args });
      }
      offset += argCount;
    }
    if (isFirst && nums.length > 0) {
      commands.push({ command: cmd, args: nums });
    }
  }
  return commands;
}
function serializePath(commands) {
  return commands.map((c) => {
    if (c.args.length === 0) return c.command;
    return c.command + " " + c.args.map((n) => roundNum(n)).join(" ");
  }).join(" ");
}
function roundNum(n) {
  const r = Math.round(n * 1e3) / 1e3;
  return String(r);
}
function toAbsolute(commands) {
  const result = [];
  let cx = 0;
  let cy = 0;
  let subpathStartX = 0;
  let subpathStartY = 0;
  for (const { command, args } of commands) {
    const isRelative = command === command.toLowerCase() && command !== "Z" && command !== "z";
    const upper = command.toUpperCase();
    if (upper === "Z") {
      result.push({ command: "Z", args: [] });
      cx = subpathStartX;
      cy = subpathStartY;
      continue;
    }
    const absArgs = [...args];
    switch (upper) {
      case "M":
        if (isRelative) {
          absArgs[0] += cx;
          absArgs[1] += cy;
        }
        cx = absArgs[0];
        cy = absArgs[1];
        subpathStartX = cx;
        subpathStartY = cy;
        break;
      case "L":
        if (isRelative) {
          absArgs[0] += cx;
          absArgs[1] += cy;
        }
        cx = absArgs[0];
        cy = absArgs[1];
        break;
      case "H":
        if (isRelative) {
          absArgs[0] += cx;
        }
        cx = absArgs[0];
        break;
      case "V":
        if (isRelative) {
          absArgs[0] += cy;
        }
        cy = absArgs[0];
        break;
      case "C":
        if (isRelative) {
          absArgs[0] += cx;
          absArgs[1] += cy;
          absArgs[2] += cx;
          absArgs[3] += cy;
          absArgs[4] += cx;
          absArgs[5] += cy;
        }
        cx = absArgs[4];
        cy = absArgs[5];
        break;
      case "S":
        if (isRelative) {
          absArgs[0] += cx;
          absArgs[1] += cy;
          absArgs[2] += cx;
          absArgs[3] += cy;
        }
        cx = absArgs[2];
        cy = absArgs[3];
        break;
      case "Q":
        if (isRelative) {
          absArgs[0] += cx;
          absArgs[1] += cy;
          absArgs[2] += cx;
          absArgs[3] += cy;
        }
        cx = absArgs[2];
        cy = absArgs[3];
        break;
      case "T":
        if (isRelative) {
          absArgs[0] += cx;
          absArgs[1] += cy;
        }
        cx = absArgs[0];
        cy = absArgs[1];
        break;
      case "A":
        if (isRelative) {
          absArgs[5] += cx;
          absArgs[6] += cy;
        }
        cx = absArgs[5];
        cy = absArgs[6];
        break;
    }
    result.push({ command: upper, args: absArgs });
  }
  return result;
}
function dist(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}
function lerp2(a, b, t) {
  return a + (b - a) * t;
}
function lerpPoint(a, b, t) {
  return { x: lerp2(a.x, b.x, t), y: lerp2(a.y, b.y, t) };
}
function cubicBezierPoint(p0, p1, p2, p3, t) {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  const t2 = t * t;
  const t3 = t2 * t;
  return {
    x: mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x,
    y: mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y
  };
}
function cubicBezierTangent(p0, p1, p2, p3, t) {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const t2 = t * t;
  const dx = 3 * mt2 * (p1.x - p0.x) + 6 * mt * t * (p2.x - p1.x) + 3 * t2 * (p3.x - p2.x);
  const dy = 3 * mt2 * (p1.y - p0.y) + 6 * mt * t * (p2.y - p1.y) + 3 * t2 * (p3.y - p2.y);
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return { x: 0, y: 0 };
  return { x: dx / len, y: dy / len };
}
function quadBezierPoint(p0, p1, p2, t) {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const t2 = t * t;
  return {
    x: mt2 * p0.x + 2 * mt * t * p1.x + t2 * p2.x,
    y: mt2 * p0.y + 2 * mt * t * p1.y + t2 * p2.y
  };
}
function quadBezierTangent(p0, p1, p2, t) {
  const mt = 1 - t;
  const dx = 2 * mt * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
  const dy = 2 * mt * (p1.y - p0.y) + 2 * t * (p2.y - p1.y);
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return { x: 0, y: 0 };
  return { x: dx / len, y: dy / len };
}
function arcToPoints(cx, cy, rx, ry, phi, theta1, dtheta, steps) {
  const points = [];
  const cosPhi = Math.cos(phi);
  const sinPhi = Math.sin(phi);
  for (let i = 0; i <= steps; i++) {
    const t = theta1 + dtheta * i / steps;
    const cosT = Math.cos(t);
    const sinT = Math.sin(t);
    points.push({
      x: cosPhi * rx * cosT - sinPhi * ry * sinT + cx,
      y: sinPhi * rx * cosT + cosPhi * ry * sinT + cy
    });
  }
  return points;
}
function endpointToCenter(x1, y1, rx, ry, phi, largeArc, sweep, x2, y2) {
  const cosPhi = Math.cos(phi);
  const sinPhi = Math.sin(phi);
  const dx = (x1 - x2) / 2;
  const dy = (y1 - y2) / 2;
  const x1p = cosPhi * dx + sinPhi * dy;
  const y1p = -sinPhi * dx + cosPhi * dy;
  let rxSq = rx * rx;
  let rySq = ry * ry;
  const x1pSq = x1p * x1p;
  const y1pSq = y1p * y1p;
  const lambda = x1pSq / rxSq + y1pSq / rySq;
  if (lambda > 1) {
    const sqrtLambda = Math.sqrt(lambda);
    rx *= sqrtLambda;
    ry *= sqrtLambda;
    rxSq = rx * rx;
    rySq = ry * ry;
  }
  let num = rxSq * rySq - rxSq * y1pSq - rySq * x1pSq;
  let den = rxSq * y1pSq + rySq * x1pSq;
  if (den === 0) {
    return { cx: (x1 + x2) / 2, cy: (y1 + y2) / 2, theta1: 0, dtheta: 0, rx, ry };
  }
  let sq = Math.sqrt(Math.max(0, num / den));
  if (largeArc === sweep) sq = -sq;
  const cxp = sq * rx * y1p / ry;
  const cyp = -sq * ry * x1p / rx;
  const cx = cosPhi * cxp - sinPhi * cyp + (x1 + x2) / 2;
  const cy = sinPhi * cxp + cosPhi * cyp + (y1 + y2) / 2;
  const theta1 = Math.atan2((y1p - cyp) / ry, (x1p - cxp) / rx);
  let dtheta = Math.atan2((-y1p - cyp) / ry, (-x1p - cxp) / rx) - theta1;
  if (sweep && dtheta < 0) dtheta += 2 * Math.PI;
  if (!sweep && dtheta > 0) dtheta -= 2 * Math.PI;
  return { cx, cy, theta1, dtheta, rx, ry };
}
var CURVE_STEPS = 64;
function buildSegments(commands) {
  const segments = [];
  let cx = 0;
  let cy = 0;
  let subpathStartX = 0;
  let subpathStartY = 0;
  let lastControlX = 0;
  let lastControlY = 0;
  let lastCommand = "";
  for (const { command, args } of commands) {
    const start = { x: cx, y: cy };
    switch (command) {
      case "M":
        cx = args[0];
        cy = args[1];
        subpathStartX = cx;
        subpathStartY = cy;
        lastCommand = "M";
        continue;
      case "L": {
        const end = { x: args[0], y: args[1] };
        const segLen = dist(start, end);
        segments.push({
          start,
          end,
          length: segLen,
          pointAtLength: (t) => lerpPoint(start, end, t),
          tangentAtLength: () => {
            const d = dist(start, end);
            if (d === 0) return { x: 0, y: 0 };
            return { x: (end.x - start.x) / d, y: (end.y - start.y) / d };
          }
        });
        cx = end.x;
        cy = end.y;
        lastCommand = "L";
        break;
      }
      case "H": {
        const end = { x: args[0], y: cy };
        const segLen = Math.abs(args[0] - cx);
        segments.push({
          start,
          end,
          length: segLen,
          pointAtLength: (t) => lerpPoint(start, end, t),
          tangentAtLength: () => {
            const dx = end.x - start.x;
            return { x: dx >= 0 ? 1 : -1, y: 0 };
          }
        });
        cx = end.x;
        lastCommand = "H";
        break;
      }
      case "V": {
        const end = { x: cx, y: args[0] };
        const segLen = Math.abs(args[0] - cy);
        segments.push({
          start,
          end,
          length: segLen,
          pointAtLength: (t) => lerpPoint(start, end, t),
          tangentAtLength: () => {
            const dy = end.y - start.y;
            return { x: 0, y: dy >= 0 ? 1 : -1 };
          }
        });
        cy = end.y;
        lastCommand = "V";
        break;
      }
      case "C": {
        const p0 = start;
        const p1 = { x: args[0], y: args[1] };
        const p2 = { x: args[2], y: args[3] };
        const p3 = { x: args[4], y: args[5] };
        const lut = buildCubicLUT(p0, p1, p2, p3);
        segments.push({
          start: p0,
          end: p3,
          length: lut.totalLength,
          pointAtLength: (t) => cubicPointFromLUT(lut, t, p0, p1, p2, p3),
          tangentAtLength: (t) => cubicTangentFromLUT(lut, t, p0, p1, p2, p3)
        });
        lastControlX = p2.x;
        lastControlY = p2.y;
        cx = p3.x;
        cy = p3.y;
        lastCommand = "C";
        break;
      }
      case "S": {
        const p0 = start;
        let cp1x, cp1y;
        if (lastCommand === "C" || lastCommand === "S") {
          cp1x = 2 * cx - lastControlX;
          cp1y = 2 * cy - lastControlY;
        } else {
          cp1x = cx;
          cp1y = cy;
        }
        const p1 = { x: cp1x, y: cp1y };
        const p2 = { x: args[0], y: args[1] };
        const p3 = { x: args[2], y: args[3] };
        const lut = buildCubicLUT(p0, p1, p2, p3);
        segments.push({
          start: p0,
          end: p3,
          length: lut.totalLength,
          pointAtLength: (t) => cubicPointFromLUT(lut, t, p0, p1, p2, p3),
          tangentAtLength: (t) => cubicTangentFromLUT(lut, t, p0, p1, p2, p3)
        });
        lastControlX = p2.x;
        lastControlY = p2.y;
        cx = p3.x;
        cy = p3.y;
        lastCommand = "S";
        break;
      }
      case "Q": {
        const p0 = start;
        const p1 = { x: args[0], y: args[1] };
        const p2 = { x: args[2], y: args[3] };
        const lut = buildQuadLUT(p0, p1, p2);
        segments.push({
          start: p0,
          end: p2,
          length: lut.totalLength,
          pointAtLength: (t) => quadPointFromLUT(lut, t, p0, p1, p2),
          tangentAtLength: (t) => quadTangentFromLUT(lut, t, p0, p1, p2)
        });
        lastControlX = p1.x;
        lastControlY = p1.y;
        cx = p2.x;
        cy = p2.y;
        lastCommand = "Q";
        break;
      }
      case "T": {
        const p0 = start;
        let cp1x, cp1y;
        if (lastCommand === "Q" || lastCommand === "T") {
          cp1x = 2 * cx - lastControlX;
          cp1y = 2 * cy - lastControlY;
        } else {
          cp1x = cx;
          cp1y = cy;
        }
        const p1 = { x: cp1x, y: cp1y };
        const p2 = { x: args[0], y: args[1] };
        const lut = buildQuadLUT(p0, p1, p2);
        segments.push({
          start: p0,
          end: p2,
          length: lut.totalLength,
          pointAtLength: (t) => quadPointFromLUT(lut, t, p0, p1, p2),
          tangentAtLength: (t) => quadTangentFromLUT(lut, t, p0, p1, p2)
        });
        lastControlX = p1.x;
        lastControlY = p1.y;
        cx = p2.x;
        cy = p2.y;
        lastCommand = "T";
        break;
      }
      case "A": {
        const rxArg = Math.abs(args[0]);
        const ryArg = Math.abs(args[1]);
        const phi = args[2] * Math.PI / 180;
        const largeArc = args[3] !== 0;
        const sweep = args[4] !== 0;
        const ex = args[5];
        const ey = args[6];
        const end = { x: ex, y: ey };
        if (rxArg === 0 || ryArg === 0) {
          const segLen = dist(start, end);
          segments.push({
            start,
            end,
            length: segLen,
            pointAtLength: (t) => lerpPoint(start, end, t),
            tangentAtLength: () => {
              const d = dist(start, end);
              if (d === 0) return { x: 0, y: 0 };
              return { x: (end.x - start.x) / d, y: (end.y - start.y) / d };
            }
          });
        } else {
          const center = endpointToCenter(
            cx,
            cy,
            rxArg,
            ryArg,
            phi,
            largeArc,
            sweep,
            ex,
            ey
          );
          const steps = CURVE_STEPS;
          const points = arcToPoints(
            center.cx,
            center.cy,
            center.rx,
            center.ry,
            phi,
            center.theta1,
            center.dtheta,
            steps
          );
          let totalLen = 0;
          const cumLengths = [0];
          for (let i = 1; i < points.length; i++) {
            totalLen += dist(points[i - 1], points[i]);
            cumLengths.push(totalLen);
          }
          segments.push({
            start,
            end,
            length: totalLen,
            pointAtLength: (t) => polylinePointAt(points, cumLengths, totalLen, t),
            tangentAtLength: (t) => polylineTangentAt(points, cumLengths, totalLen, t)
          });
        }
        cx = ex;
        cy = ey;
        lastCommand = "A";
        break;
      }
      case "Z": {
        const end = { x: subpathStartX, y: subpathStartY };
        const segLen = dist(start, end);
        if (segLen > 0) {
          segments.push({
            start,
            end,
            length: segLen,
            pointAtLength: (t) => lerpPoint(start, end, t),
            tangentAtLength: () => {
              const d = segLen;
              return { x: (end.x - start.x) / d, y: (end.y - start.y) / d };
            }
          });
        }
        cx = subpathStartX;
        cy = subpathStartY;
        lastCommand = "Z";
        break;
      }
    }
  }
  return segments;
}
function buildCubicLUT(p0, p1, p2, p3) {
  let totalLength = 0;
  const cumLengths = [0];
  let prev = p0;
  for (let i = 1; i <= CURVE_STEPS; i++) {
    const t = i / CURVE_STEPS;
    const pt = cubicBezierPoint(p0, p1, p2, p3, t);
    totalLength += dist(prev, pt);
    cumLengths.push(totalLength);
    prev = pt;
  }
  return { totalLength, cumLengths };
}
function buildQuadLUT(p0, p1, p2) {
  let totalLength = 0;
  const cumLengths = [0];
  let prev = p0;
  for (let i = 1; i <= CURVE_STEPS; i++) {
    const t = i / CURVE_STEPS;
    const pt = quadBezierPoint(p0, p1, p2, t);
    totalLength += dist(prev, pt);
    cumLengths.push(totalLength);
    prev = pt;
  }
  return { totalLength, cumLengths };
}
function lengthToParam(lut, t) {
  const targetLen = t * lut.totalLength;
  const n = lut.cumLengths.length - 1;
  let lo = 0;
  let hi = n;
  while (lo < hi) {
    const mid = lo + hi >> 1;
    if (lut.cumLengths[mid] < targetLen) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  if (lo === 0) return 0;
  const segStart = lut.cumLengths[lo - 1];
  const segEnd = lut.cumLengths[lo];
  const segLen = segEnd - segStart;
  const frac = segLen > 0 ? (targetLen - segStart) / segLen : 0;
  return (lo - 1 + frac) / n;
}
function cubicPointFromLUT(lut, t, p0, p1, p2, p3) {
  const param = lengthToParam(lut, t);
  return cubicBezierPoint(p0, p1, p2, p3, param);
}
function cubicTangentFromLUT(lut, t, p0, p1, p2, p3) {
  const param = lengthToParam(lut, t);
  return cubicBezierTangent(p0, p1, p2, p3, param);
}
function quadPointFromLUT(lut, t, p0, p1, p2) {
  const param = lengthToParam(lut, t);
  return quadBezierPoint(p0, p1, p2, param);
}
function quadTangentFromLUT(lut, t, p0, p1, p2) {
  const param = lengthToParam(lut, t);
  return quadBezierTangent(p0, p1, p2, param);
}
function polylinePointAt(points, cumLengths, totalLength, t) {
  if (totalLength === 0 || points.length === 0) return points[0] ?? { x: 0, y: 0 };
  const targetLen = t * totalLength;
  for (let i = 1; i < cumLengths.length; i++) {
    if (cumLengths[i] >= targetLen) {
      const segLen = cumLengths[i] - cumLengths[i - 1];
      const frac = segLen > 0 ? (targetLen - cumLengths[i - 1]) / segLen : 0;
      return lerpPoint(points[i - 1], points[i], frac);
    }
  }
  return points[points.length - 1];
}
function polylineTangentAt(points, cumLengths, totalLength, t) {
  if (totalLength === 0 || points.length < 2) return { x: 1, y: 0 };
  const targetLen = t * totalLength;
  for (let i = 1; i < cumLengths.length; i++) {
    if (cumLengths[i] >= targetLen) {
      const d2 = dist(points[i - 1], points[i]);
      if (d2 === 0) return { x: 1, y: 0 };
      return {
        x: (points[i].x - points[i - 1].x) / d2,
        y: (points[i].y - points[i - 1].y) / d2
      };
    }
  }
  const last = points.length - 1;
  const d = dist(points[last - 1], points[last]);
  if (d === 0) return { x: 1, y: 0 };
  return {
    x: (points[last].x - points[last - 1].x) / d,
    y: (points[last].y - points[last - 1].y) / d
  };
}
function getSegments(d) {
  const commands = toAbsolute(parsePath(d));
  return buildSegments(commands);
}
function getTotalLength(segments) {
  let total = 0;
  for (const seg of segments) {
    total += seg.length;
  }
  return total;
}
function findSegmentAtLength(segments, targetLength) {
  if (segments.length === 0) return null;
  let accum = 0;
  for (const seg of segments) {
    if (accum + seg.length >= targetLength) {
      const localLen = targetLength - accum;
      const t = seg.length > 0 ? localLen / seg.length : 0;
      return { segment: seg, t: Math.max(0, Math.min(1, t)) };
    }
    accum += seg.length;
  }
  const last = segments[segments.length - 1];
  return { segment: last, t: 1 };
}
function evolvePath(d, progress) {
  const length = getLength(d);
  const clampedProgress = Math.max(0, Math.min(1, progress));
  return {
    d,
    strokeDasharray: `${roundNum(length)}`,
    strokeDashoffset: length * (1 - clampedProgress)
  };
}
function getLength(d) {
  if (!d || d.trim().length === 0) return 0;
  const segments = getSegments(d);
  return getTotalLength(segments);
}
function getPointAtLength(d, length) {
  if (!d || d.trim().length === 0) return { x: 0, y: 0 };
  const segments = getSegments(d);
  const totalLength = getTotalLength(segments);
  const clampedLength = Math.max(0, Math.min(totalLength, length));
  const result = findSegmentAtLength(segments, clampedLength);
  if (!result) return { x: 0, y: 0 };
  return result.segment.pointAtLength(result.t);
}
function getTangentAtLength(d, length) {
  if (!d || d.trim().length === 0) return { x: 0, y: 0 };
  const segments = getSegments(d);
  const totalLength = getTotalLength(segments);
  const clampedLength = Math.max(0, Math.min(totalLength, length));
  const result = findSegmentAtLength(segments, clampedLength);
  if (!result) return { x: 0, y: 0 };
  return result.segment.tangentAtLength(result.t);
}
function getBoundingBox(d) {
  if (!d || d.trim().length === 0) return { x: 0, y: 0, width: 0, height: 0 };
  const segments = getSegments(d);
  if (segments.length === 0) {
    const commands = toAbsolute(parsePath(d));
    for (const cmd of commands) {
      if (cmd.command === "M") {
        return { x: cmd.args[0], y: cmd.args[1], width: 0, height: 0 };
      }
    }
    return { x: 0, y: 0, width: 0, height: 0 };
  }
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  function updateBounds(p) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  const sampleCount = 32;
  for (const seg of segments) {
    updateBounds(seg.start);
    updateBounds(seg.end);
    for (let i = 1; i < sampleCount; i++) {
      const t = i / sampleCount;
      updateBounds(seg.pointAtLength(t));
    }
  }
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}
function scalePath(d, scaleX, scaleY) {
  if (!d || d.trim().length === 0) return d;
  const sy = scaleY ?? scaleX;
  const commands = parsePath(d);
  const scaled = [];
  for (const { command, args } of commands) {
    const upper = command.toUpperCase();
    switch (upper) {
      case "M":
      case "L":
      case "T":
        scaled.push({
          command,
          args: [args[0] * scaleX, args[1] * sy]
        });
        break;
      case "H":
        scaled.push({ command, args: [args[0] * scaleX] });
        break;
      case "V":
        scaled.push({ command, args: [args[0] * sy] });
        break;
      case "C":
        scaled.push({
          command,
          args: [
            args[0] * scaleX,
            args[1] * sy,
            args[2] * scaleX,
            args[3] * sy,
            args[4] * scaleX,
            args[5] * sy
          ]
        });
        break;
      case "S":
      case "Q":
        scaled.push({
          command,
          args: [
            args[0] * scaleX,
            args[1] * sy,
            args[2] * scaleX,
            args[3] * sy
          ]
        });
        break;
      case "A":
        scaled.push({
          command,
          args: [
            args[0] * scaleX,
            args[1] * sy,
            args[2],
            args[3],
            args[4],
            args[5] * scaleX,
            args[6] * sy
          ]
        });
        break;
      case "Z":
        scaled.push({ command, args: [] });
        break;
      default:
        scaled.push({ command, args: [...args] });
        break;
    }
  }
  return serializePath(scaled);
}
function translatePath(d, dx, dy) {
  if (!d || d.trim().length === 0) return d;
  const commands = parsePath(d);
  const translated = [];
  for (const { command, args } of commands) {
    const upper = command.toUpperCase();
    const isRelative = command !== upper;
    if (isRelative || upper === "Z") {
      translated.push({ command, args: [...args] });
      continue;
    }
    switch (upper) {
      case "M":
      case "L":
      case "T":
        translated.push({
          command,
          args: [args[0] + dx, args[1] + dy]
        });
        break;
      case "H":
        translated.push({ command, args: [args[0] + dx] });
        break;
      case "V":
        translated.push({ command, args: [args[0] + dy] });
        break;
      case "C":
        translated.push({
          command,
          args: [
            args[0] + dx,
            args[1] + dy,
            args[2] + dx,
            args[3] + dy,
            args[4] + dx,
            args[5] + dy
          ]
        });
        break;
      case "S":
      case "Q":
        translated.push({
          command,
          args: [
            args[0] + dx,
            args[1] + dy,
            args[2] + dx,
            args[3] + dy
          ]
        });
        break;
      case "A":
        translated.push({
          command,
          args: [
            args[0],
            args[1],
            args[2],
            args[3],
            args[4],
            args[5] + dx,
            args[6] + dy
          ]
        });
        break;
      default:
        translated.push({ command, args: [...args] });
        break;
    }
  }
  return serializePath(translated);
}
function resetPath(d) {
  if (!d || d.trim().length === 0) return d;
  const commands = toAbsolute(parsePath(d));
  for (const cmd of commands) {
    if (cmd.command === "M") {
      return translatePath(
        serializePath(commands),
        -cmd.args[0],
        -cmd.args[1]
      );
    }
  }
  return d;
}
function reversePath(d) {
  if (!d || d.trim().length === 0) return d;
  const commands = toAbsolute(parsePath(d));
  if (commands.length === 0) return d;
  const points = [];
  const segCommands = [];
  let cx = 0;
  let cy = 0;
  let subpathStartX = 0;
  let subpathStartY = 0;
  let hasClose = false;
  for (const { command, args } of commands) {
    switch (command) {
      case "M":
        cx = args[0];
        cy = args[1];
        subpathStartX = cx;
        subpathStartY = cy;
        points.push({ x: cx, y: cy });
        segCommands.push({ command: "M", args: [cx, cy] });
        break;
      case "L":
        cx = args[0];
        cy = args[1];
        points.push({ x: cx, y: cy });
        segCommands.push({ command: "L", args: [cx, cy] });
        break;
      case "H":
        cx = args[0];
        points.push({ x: cx, y: cy });
        segCommands.push({ command: "L", args: [cx, cy] });
        break;
      case "V":
        cy = args[0];
        points.push({ x: cx, y: cy });
        segCommands.push({ command: "L", args: [cx, cy] });
        break;
      case "C":
        points.push({ x: args[4], y: args[5] });
        segCommands.push({
          command: "C",
          args: [args[2], args[3], args[0], args[1], cx, cy]
        });
        cx = args[4];
        cy = args[5];
        break;
      case "Q":
        points.push({ x: args[2], y: args[3] });
        segCommands.push({
          command: "Q",
          args: [args[0], args[1], cx, cy]
        });
        cx = args[2];
        cy = args[3];
        break;
      case "Z":
        hasClose = true;
        if (cx !== subpathStartX || cy !== subpathStartY) {
          points.push({ x: subpathStartX, y: subpathStartY });
          segCommands.push({ command: "L", args: [subpathStartX, subpathStartY] });
        }
        cx = subpathStartX;
        cy = subpathStartY;
        break;
      default:
        points.push({ x: cx, y: cy });
        segCommands.push({ command, args: [...args] });
        break;
    }
  }
  const reversed = [];
  if (points.length === 0) return d;
  const lastPt = points[points.length - 1];
  reversed.push({ command: "M", args: [lastPt.x, lastPt.y] });
  for (let i = segCommands.length - 1; i >= 1; i--) {
    const cmd = segCommands[i];
    if (cmd.command === "M") continue;
    if (cmd.command === "C") {
      const prevPt = points[i - 1];
      reversed.push({
        command: "C",
        args: [cmd.args[0], cmd.args[1], cmd.args[2], cmd.args[3], prevPt.x, prevPt.y]
      });
    } else if (cmd.command === "Q") {
      const prevPt = points[i - 1];
      reversed.push({
        command: "Q",
        args: [cmd.args[0], cmd.args[1], prevPt.x, prevPt.y]
      });
    } else if (cmd.command === "L") {
      const prevPt = points[i - 1];
      reversed.push({ command: "L", args: [prevPt.x, prevPt.y] });
    } else {
      const prevPt = points[i - 1];
      reversed.push({ command: "L", args: [prevPt.x, prevPt.y] });
    }
  }
  if (hasClose) {
    reversed.push({ command: "Z", args: [] });
  }
  return serializePath(reversed);
}
function interpolatePath(progress, d12, d2) {
  if (!d12 || !d2) return d12 || d2 || "";
  const cmds1 = toAbsolute(parsePath(d12));
  const cmds2 = toAbsolute(parsePath(d2));
  const maxLen = Math.max(cmds1.length, cmds2.length);
  while (cmds1.length < maxLen) {
    const last = cmds1[cmds1.length - 1];
    if (last) {
      cmds1.push({ command: last.command, args: [...last.args] });
    } else {
      cmds1.push({ command: "M", args: [0, 0] });
    }
  }
  while (cmds2.length < maxLen) {
    const last = cmds2[cmds2.length - 1];
    if (last) {
      cmds2.push({ command: last.command, args: [...last.args] });
    } else {
      cmds2.push({ command: "M", args: [0, 0] });
    }
  }
  const t = Math.max(0, Math.min(1, progress));
  const result = [];
  for (let i = 0; i < maxLen; i++) {
    const c12 = cmds1[i];
    const c22 = cmds2[i];
    const cmd = c12.command === "Z" && c22.command !== "Z" ? c22.command : c12.command;
    if (cmd === "Z") {
      result.push({ command: "Z", args: [] });
      continue;
    }
    const argCount = Math.max(c12.args.length, c22.args.length);
    const args = [];
    for (let j = 0; j < argCount; j++) {
      const a = j < c12.args.length ? c12.args[j] : 0;
      const b = j < c22.args.length ? c22.args[j] : 0;
      args.push(lerp2(a, b, t));
    }
    result.push({ command: cmd, args });
  }
  return serializePath(result);
}
function getSubpaths(d) {
  if (!d || d.trim().length === 0) return [];
  const commands = parsePath(d);
  const subpaths = [];
  let current = [];
  for (const cmd of commands) {
    if (cmd.command === "M" || cmd.command === "m") {
      if (current.length > 0) {
        subpaths.push(current);
      }
      current = [cmd];
    } else {
      current.push(cmd);
    }
  }
  if (current.length > 0) {
    subpaths.push(current);
  }
  return subpaths.map(serializePath);
}
function normalizePath(d) {
  if (!d || d.trim().length === 0) return d;
  return serializePath(toAbsolute(parsePath(d)));
}

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
var REQUIRED_MANIFEST_FIELDS = [
  "name",
  "version",
  "description",
  "author",
  "license",
  "tags",
  "category",
  "rendervid",
  "inputs",
  "files"
];
var TEMPLATE_CATEGORIES = [
  "social-media",
  "presentation",
  "marketing",
  "education",
  "entertainment",
  "e-commerce",
  "news",
  "sports",
  "music",
  "corporate",
  "event",
  "real-estate",
  "other"
];
function validateManifest(manifest) {
  const errors = [];
  const warnings = [];
  for (const field of REQUIRED_MANIFEST_FIELDS) {
    if (manifest[field] === void 0 || manifest[field] === null) {
      errors.push({
        code: "MISSING_FIELD",
        message: `Missing required field: ${field}`,
        path: field
      });
    }
  }
  if (manifest.name) {
    const namePattern = /^(@[a-z0-9-]+\/)?[a-z0-9-]+$/;
    if (!namePattern.test(manifest.name)) {
      errors.push({
        code: "INVALID_NAME",
        message: "Name must be lowercase alphanumeric with hyphens, optionally scoped (e.g. @scope/name)",
        path: "name",
        expected: "@scope/template-name or template-name",
        actual: manifest.name
      });
    }
  }
  if (manifest.version) {
    const semverPattern = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?(\+[a-zA-Z0-9.]+)?$/;
    if (!semverPattern.test(manifest.version)) {
      errors.push({
        code: "INVALID_VERSION",
        message: "Version must follow semantic versioning (e.g. 1.0.0)",
        path: "version",
        expected: "X.Y.Z",
        actual: manifest.version
      });
    }
  }
  if (manifest.author) {
    if (!manifest.author.name || typeof manifest.author.name !== "string") {
      errors.push({
        code: "INVALID_AUTHOR",
        message: "Author must have a name string",
        path: "author.name"
      });
    }
  }
  if (manifest.rendervid) {
    const rv = manifest.rendervid;
    if (!rv.minVersion) {
      errors.push({
        code: "MISSING_FIELD",
        message: "rendervid.minVersion is required",
        path: "rendervid.minVersion"
      });
    }
    if (!rv.resolution || !rv.resolution.width || !rv.resolution.height) {
      errors.push({
        code: "INVALID_RESOLUTION",
        message: "rendervid.resolution must have width and height",
        path: "rendervid.resolution"
      });
    }
    if (rv.fps && (rv.fps < 1 || rv.fps > 120)) {
      warnings.push({
        code: "UNUSUAL_FPS",
        message: `FPS value ${rv.fps} is unusual`,
        path: "rendervid.fps",
        suggestion: "Common values are 24, 30, or 60"
      });
    }
  }
  if (manifest.tags && !Array.isArray(manifest.tags)) {
    errors.push({
      code: "INVALID_TAGS",
      message: "Tags must be an array of strings",
      path: "tags"
    });
  }
  if (manifest.category && !TEMPLATE_CATEGORIES.includes(manifest.category)) {
    warnings.push({
      code: "UNKNOWN_CATEGORY",
      message: `Unknown category: ${manifest.category}`,
      path: "category",
      suggestion: `Valid categories: ${TEMPLATE_CATEGORIES.join(", ")}`
    });
  }
  if (manifest.files && Array.isArray(manifest.files)) {
    if (manifest.files.length === 0) {
      errors.push({
        code: "EMPTY_FILES",
        message: "Files list must contain at least one file",
        path: "files"
      });
    }
    const hasTemplateJson = manifest.files.some(
      (f) => f === "template.json" || f.endsWith("/template.json")
    );
    if (!hasTemplateJson) {
      warnings.push({
        code: "MISSING_TEMPLATE_JSON",
        message: "Files list should include template.json",
        path: "files",
        suggestion: "Add template.json to the files array"
      });
    }
  }
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
function createTarBuffer(entries) {
  const blocks = [];
  for (const entry of entries) {
    const header = Buffer.alloc(512);
    header.write(entry.name.slice(0, 100), 0, 100, "utf-8");
    header.write("0000644\0", 100, 8, "utf-8");
    header.write("0001000\0", 108, 8, "utf-8");
    header.write("0001000\0", 116, 8, "utf-8");
    const sizeOctal = entry.content.length.toString(8).padStart(11, "0");
    header.write(sizeOctal + "\0", 124, 12, "utf-8");
    const mtime = Math.floor(Date.now() / 1e3).toString(8).padStart(11, "0");
    header.write(mtime + "\0", 136, 12, "utf-8");
    header.write("0", 156, 1, "utf-8");
    header.write("        ", 148, 8, "utf-8");
    let checksum = 0;
    for (let i = 0; i < 512; i++) {
      checksum += header[i];
    }
    const checksumStr = checksum.toString(8).padStart(6, "0") + "\0 ";
    header.write(checksumStr, 148, 8, "utf-8");
    blocks.push(header);
    blocks.push(entry.content);
    const remainder = entry.content.length % 512;
    if (remainder > 0) {
      blocks.push(Buffer.alloc(512 - remainder));
    }
  }
  blocks.push(Buffer.alloc(1024));
  return Buffer.concat(blocks);
}
function extractTarBuffer(tarBuffer) {
  const entries = [];
  let offset = 0;
  while (offset < tarBuffer.length - 512) {
    const header = tarBuffer.subarray(offset, offset + 512);
    let allZero = true;
    for (let i = 0; i < 512; i++) {
      if (header[i] !== 0) {
        allZero = false;
        break;
      }
    }
    if (allZero) break;
    let nameEnd = 0;
    while (nameEnd < 100 && header[nameEnd] !== 0) nameEnd++;
    const name = header.subarray(0, nameEnd).toString("utf-8");
    const sizeStr = header.subarray(124, 135).toString("utf-8").trim();
    const size = parseInt(sizeStr, 8);
    offset += 512;
    const content = tarBuffer.subarray(offset, offset + size);
    entries.push({ name, content: Buffer.from(content) });
    offset += size;
    const remainder = size % 512;
    if (remainder > 0) {
      offset += 512 - remainder;
    }
  }
  return entries;
}
async function packageTemplate(dir) {
  const manifestPath = path2__namespace.join(dir, "template.json");
  if (!fs2__namespace.existsSync(manifestPath)) {
    throw new Error(`No template.json found in ${dir}`);
  }
  const manifestContent = fs2__namespace.readFileSync(manifestPath, "utf-8");
  let manifest;
  try {
    manifest = JSON.parse(manifestContent);
  } catch {
    throw new Error("Failed to parse template.json: invalid JSON");
  }
  const validation = validateManifest(manifest);
  if (!validation.valid) {
    const errorMessages = validation.errors.map((e) => `  - ${e.message}`).join("\n");
    throw new Error(`Invalid manifest:
${errorMessages}`);
  }
  const filesToPackage = manifest.files && manifest.files.length > 0 ? manifest.files : collectFiles(dir);
  const entries = [];
  for (const file of filesToPackage) {
    const filePath = path2__namespace.join(dir, file);
    if (fs2__namespace.existsSync(filePath)) {
      const content = fs2__namespace.readFileSync(filePath);
      entries.push({ name: file, content });
    }
  }
  if (!filesToPackage.includes("template.json")) {
    entries.unshift({
      name: "template.json",
      content: Buffer.from(manifestContent, "utf-8")
    });
  }
  const tarBuffer = createTarBuffer(entries);
  const tarball = await new Promise((resolve, reject) => {
    zlib__namespace.gzip(tarBuffer, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
  return { tarball, manifest };
}
function collectFiles(dir, prefix = "") {
  const files = [];
  const IGNORED = /* @__PURE__ */ new Set(["node_modules", ".git", ".DS_Store", "dist", "build"]);
  const entries = fs2__namespace.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORED.has(entry.name)) continue;
    const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files.push(...collectFiles(path2__namespace.join(dir, entry.name), relativePath));
    } else {
      files.push(relativePath);
    }
  }
  return files;
}
async function unpackTemplate(tarball, targetDir) {
  const tarBuffer = await new Promise((resolve, reject) => {
    zlib__namespace.gunzip(tarball, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
  const entries = extractTarBuffer(tarBuffer);
  fs2__namespace.mkdirSync(targetDir, { recursive: true });
  let manifest = null;
  for (const entry of entries) {
    const filePath = path2__namespace.join(targetDir, entry.name);
    const fileDir = path2__namespace.dirname(filePath);
    fs2__namespace.mkdirSync(fileDir, { recursive: true });
    fs2__namespace.writeFileSync(filePath, entry.content);
    if (entry.name === "template.json") {
      manifest = JSON.parse(entry.content.toString("utf-8"));
    }
  }
  if (!manifest) {
    throw new Error("No template.json found in package");
  }
  return manifest;
}
function generateManifest(template, options) {
  const duration = template.output.duration ? `${template.output.duration}s` : "0s";
  const inputs = {};
  if (template.inputs) {
    for (const input of template.inputs) {
      inputs[input.key] = {
        type: input.type,
        required: input.required,
        default: input.default,
        description: input.label || input.key
      };
    }
  }
  const manifest = {
    name: options?.name || template.name.toLowerCase().replace(/\s+/g, "-"),
    version: options?.version || template.version || "1.0.0",
    description: options?.description || template.description || "",
    author: options?.author || {
      name: template.author?.name || "Unknown",
      url: template.author?.url
    },
    license: options?.license || "MIT",
    tags: options?.tags || template.tags || [],
    category: options?.category || "other",
    rendervid: options?.rendervid || {
      minVersion: "1.0.0",
      resolution: {
        width: template.output.width,
        height: template.output.height
      },
      duration,
      fps: template.output.fps || 30
    },
    inputs,
    files: options?.files || ["template.json"],
    ...options?.preview && { preview: options.preview },
    ...options?.repository && { repository: options.repository }
  };
  return manifest;
}

// src/utils/registry-client.ts
var RegistryClient = class {
  registryUrl;
  authToken;
  constructor(options) {
    this.registryUrl = options.registryUrl.replace(/\/+$/, "");
    this.authToken = options.authToken;
  }
  /**
   * Search for templates in the registry.
   */
  async search(query, options) {
    const params = new URLSearchParams({ q: query });
    if (options?.tags && options.tags.length > 0) {
      params.set("tags", options.tags.join(","));
    }
    if (options?.category) {
      params.set("category", options.category);
    }
    if (options?.limit) {
      params.set("limit", String(options.limit));
    }
    if (options?.offset) {
      params.set("offset", String(options.offset));
    }
    const response = await this.fetch(`/api/v1/search?${params.toString()}`);
    return response;
  }
  /**
   * Get full package details from the registry.
   */
  async getPackage(name, version) {
    const encodedName = encodeURIComponent(name);
    const url = version ? `/api/v1/packages/${encodedName}/${version}` : `/api/v1/packages/${encodedName}`;
    const response = await this.fetch(url);
    return response;
  }
  /**
   * Publish a template package to the registry.
   *
   * Requires authentication (authToken).
   */
  async publish(tarball, manifest) {
    if (!this.authToken) {
      throw new Error("Authentication required to publish. Set authToken in client options.");
    }
    const body = JSON.stringify({
      manifest,
      tarball: tarball.toString("base64")
    });
    await this.fetch("/api/v1/packages", {
      method: "PUT",
      body,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  /**
   * Unpublish a specific version of a template from the registry.
   *
   * Requires authentication (authToken).
   */
  async unpublish(name, version) {
    if (!this.authToken) {
      throw new Error("Authentication required to unpublish. Set authToken in client options.");
    }
    const encodedName = encodeURIComponent(name);
    await this.fetch(`/api/v1/packages/${encodedName}/${version}`, {
      method: "DELETE"
    });
  }
  /**
   * List all available template categories.
   */
  async listCategories() {
    const response = await this.fetch("/api/v1/categories");
    return response;
  }
  /**
   * List popular templates.
   */
  async listPopular(limit) {
    const params = limit ? `?limit=${limit}` : "";
    const response = await this.fetch(`/api/v1/popular${params}`);
    return response;
  }
  /**
   * Download a template tarball from the registry.
   */
  async download(name, version) {
    const encodedName = encodeURIComponent(name);
    const url = version ? `/api/v1/packages/${encodedName}/${version}/download` : `/api/v1/packages/${encodedName}/download`;
    const fullUrl = `${this.registryUrl}${url}`;
    const headers = {};
    if (this.authToken) {
      headers["Authorization"] = `Bearer ${this.authToken}`;
    }
    const response = await fetch(fullUrl, { headers });
    if (!response.ok) {
      throw new RegistryError(
        `Download failed: ${response.status} ${response.statusText}`,
        response.status
      );
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
  /**
   * Internal fetch helper with authentication and error handling.
   */
  async fetch(urlPath, options) {
    const url = `${this.registryUrl}${urlPath}`;
    const headers = {
      Accept: "application/json",
      ...options?.headers || {}
    };
    if (this.authToken) {
      headers["Authorization"] = `Bearer ${this.authToken}`;
    }
    let response;
    try {
      response = await fetch(url, {
        method: options?.method || "GET",
        headers,
        body: options?.body
      });
    } catch (err) {
      throw new RegistryError(
        `Network error connecting to registry at ${this.registryUrl}: ${err instanceof Error ? err.message : String(err)}`,
        0
      );
    }
    if (!response.ok) {
      let errorMessage;
      try {
        const errorBody = await response.json();
        errorMessage = errorBody.error || errorBody.message || response.statusText;
      } catch {
        errorMessage = response.statusText;
      }
      throw new RegistryError(
        `Registry error: ${errorMessage}`,
        response.status
      );
    }
    return response.json();
  }
};
var RegistryError = class extends Error {
  /** HTTP status code (0 for network errors) */
  statusCode;
  constructor(message, statusCode) {
    super(message);
    this.name = "RegistryError";
    this.statusCode = statusCode;
  }
};
async function initTemplate(dir, options) {
  fs2__namespace.mkdirSync(dir, { recursive: true });
  const templateJsonPath = path2__namespace.join(dir, "template.json");
  if (fs2__namespace.existsSync(templateJsonPath)) {
    throw new Error(`template.json already exists in ${dir}`);
  }
  const dirName = path2__namespace.basename(dir);
  const name = options?.name || dirName.toLowerCase().replace(/\s+/g, "-");
  const manifest = {
    name,
    version: "1.0.0",
    description: options?.description || `A rendervid template: ${name}`,
    author: {
      name: options?.authorName || "Your Name",
      url: options?.authorUrl
    },
    license: options?.license || "MIT",
    tags: [],
    category: options?.category || "other",
    rendervid: {
      minVersion: "1.0.0",
      resolution: {
        width: options?.width || 1920,
        height: options?.height || 1080
      },
      duration: `${options?.duration || 5}s`,
      fps: options?.fps || 30
    },
    inputs: {},
    files: ["template.json"]
  };
  fs2__namespace.writeFileSync(
    templateJsonPath,
    JSON.stringify(manifest, null, 2) + "\n",
    "utf-8"
  );
  const compositionPath = path2__namespace.join(dir, "composition.json");
  if (!fs2__namespace.existsSync(compositionPath)) {
    const composition = {
      name: manifest.description,
      output: {
        type: "video",
        width: manifest.rendervid.resolution.width,
        height: manifest.rendervid.resolution.height,
        fps: manifest.rendervid.fps,
        duration: options?.duration || 5
      },
      inputs: [],
      composition: {
        scenes: [
          {
            id: "scene-1",
            startFrame: 0,
            endFrame: (options?.duration || 5) * (options?.fps || 30),
            layers: []
          }
        ]
      }
    };
    fs2__namespace.writeFileSync(
      compositionPath,
      JSON.stringify(composition, null, 2) + "\n",
      "utf-8"
    );
  }
}
async function validateTemplateDir(dir) {
  const errors = [];
  const warnings = [];
  if (!fs2__namespace.existsSync(dir)) {
    return {
      valid: false,
      errors: [
        {
          code: "DIR_NOT_FOUND",
          message: `Directory not found: ${dir}`,
          path: ""
        }
      ],
      warnings: []
    };
  }
  const manifestPath = path2__namespace.join(dir, "template.json");
  if (!fs2__namespace.existsSync(manifestPath)) {
    return {
      valid: false,
      errors: [
        {
          code: "MANIFEST_NOT_FOUND",
          message: "No template.json found in directory",
          path: "template.json"
        }
      ],
      warnings: []
    };
  }
  let manifest;
  try {
    const content = fs2__namespace.readFileSync(manifestPath, "utf-8");
    manifest = JSON.parse(content);
  } catch (err) {
    return {
      valid: false,
      errors: [
        {
          code: "INVALID_JSON",
          message: `Failed to parse template.json: ${err instanceof Error ? err.message : String(err)}`,
          path: "template.json"
        }
      ],
      warnings: []
    };
  }
  const manifestValidation = validateManifest(manifest);
  errors.push(...manifestValidation.errors);
  warnings.push(...manifestValidation.warnings);
  if (manifest.files && Array.isArray(manifest.files)) {
    for (const file of manifest.files) {
      const filePath = path2__namespace.join(dir, file);
      if (!fs2__namespace.existsSync(filePath)) {
        errors.push({
          code: "FILE_NOT_FOUND",
          message: `Referenced file not found: ${file}`,
          path: `files[${manifest.files.indexOf(file)}]`
        });
      }
    }
  }
  if (manifest.preview) {
    const previewFields = [
      "thumbnail",
      "video",
      "gif"
    ];
    for (const field of previewFields) {
      const value = manifest.preview[field];
      if (value && !value.startsWith("http://") && !value.startsWith("https://")) {
        const previewPath = path2__namespace.join(dir, value);
        if (!fs2__namespace.existsSync(previewPath)) {
          warnings.push({
            code: "PREVIEW_NOT_FOUND",
            message: `Preview file not found: ${value}`,
            path: `preview.${field}`,
            suggestion: "Ensure the file exists or use an absolute URL"
          });
        }
      }
    }
  }
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
async function searchTemplates(query, registryUrl, options) {
  const client = new RegistryClient({ registryUrl });
  return client.search(query, options);
}
function getAvailableCategories() {
  return TEMPLATE_CATEGORIES;
}

exports.ComponentDefaultsManager = ComponentDefaultsManager;
exports.ComponentPropsResolver = ComponentPropsResolver;
exports.DEFAULT_MOTION_BLUR_CONFIG = DEFAULT_MOTION_BLUR_CONFIG;
exports.FONT_CONSTANTS = FONT_CONSTANTS;
exports.FontLoadingError = FontLoadingError;
exports.FontManager = FontManager;
exports.MOTION_BLUR_QUALITY_PRESETS = MOTION_BLUR_QUALITY_PRESETS;
exports.RegistryClient = RegistryClient;
exports.RegistryError = RegistryError;
exports.RendervidEngine = RendervidEngine;
exports.TEMPLATE_CATEGORIES = TEMPLATE_CATEGORIES;
exports.TemplateProcessor = TemplateProcessor;
exports.animatedNoise = animatedNoise;
exports.applyClipPath = applyClipPath;
exports.calculateOptimalColors = calculateOptimalColors;
exports.colorToString = colorToString;
exports.compileAnimation = compileAnimation;
exports.createCanvasGradient = createCanvasGradient;
exports.createCubicBezier = createCubicBezier;
exports.createDefaultComponentDefaultsManager = createDefaultComponentDefaultsManager;
exports.createPattern = createPattern;
exports.createRandom = createRandom;
exports.createSmoothSvgPath = createSmoothSvgPath;
exports.createSpring = createSpring;
exports.detectBeats = detectBeats;
exports.domainWarp = domainWarp;
exports.drawCircle = drawCircle;
exports.drawGradient = drawGradient;
exports.drawPath = drawPath;
exports.drawRoundedRect = drawRoundedRect;
exports.drawTextOnPath = drawTextOnPath;
exports.estimateGifFileSize = estimateGifFileSize;
exports.evolvePath = evolvePath;
exports.exportAnimatedSvg = exportAnimatedSvg;
exports.fbm = fbm;
exports.filterToCSS = filterToCSS;
exports.filtersToCSS = filtersToCSS;
exports.fitText = fitText;
exports.generateManifest = generateManifest;
exports.generatePresetKeyframes = generatePresetKeyframes;
exports.getAllEasingNames = getAllEasingNames;
exports.getAllPresetNames = getAllPresetNames;
exports.getAmplitudeEnvelope = getAmplitudeEnvelope;
exports.getAudioData = getAudioData;
exports.getAudioDuration = getAudioDuration;
exports.getAvailableCategories = getAvailableCategories;
exports.getBeatAtFrame = getBeatAtFrame;
exports.getBoundingBox = getBoundingBox;
exports.getCatalogStats = getCatalogStats;
exports.getCompositionDuration = getCompositionDuration;
exports.getDefaultRegistry = getDefaultRegistry;
exports.getEasing = getEasing;
exports.getFontCatalog = getFontCatalog;
exports.getFontMetadata = getFontMetadata;
exports.getFontsByCategory = getFontsByCategory;
exports.getFontsByWeight = getFontsByWeight;
exports.getFontsWithItalic = getFontsWithItalic;
exports.getFrequencyBands = getFrequencyBands;
exports.getGifFrameAtTime = getGifFrameAtTime;
exports.getGifOptimizationPreset = getGifOptimizationPreset;
exports.getLayerSchema = getLayerSchema;
exports.getLength = getLength;
exports.getPointAtLength = getPointAtLength;
exports.getPopularFonts = getPopularFonts;
exports.getPreset = getPreset;
exports.getPresetsByType = getPresetsByType;
exports.getPropertiesAtFrame = getPropertiesAtFrame;
exports.getRandomFonts = getRandomFonts;
exports.getSceneAtFrame = getSceneAtFrame;
exports.getSubpaths = getSubpaths;
exports.getTangentAtLength = getTangentAtLength;
exports.getTemplateSchema = getTemplateSchema;
exports.getValueAtFrame = getValueAtFrame;
exports.getVariableFonts = getVariableFonts;
exports.getWaveformPortion = getWaveformPortion;
exports.initTemplate = initTemplate;
exports.interpolate = interpolate;
exports.interpolateColors = interpolateColors;
exports.interpolatePath = interpolatePath;
exports.isFontAvailable = isFontAvailable;
exports.isNamedWeight = isNamedWeight;
exports.isNumericWeight = isNumericWeight;
exports.measureText = measureText;
exports.mergeMotionBlurConfigs = mergeMotionBlurConfigs;
exports.noise2D = noise2D;
exports.noise3D = noise3D;
exports.normalizePath = normalizePath;
exports.numericToNamedWeight = numericToNamedWeight;
exports.packageTemplate = packageTemplate;
exports.parseColor = parseColor;
exports.parseEasing = parseEasing;
exports.perlin2D = perlin2D;
exports.perlin3D = perlin3D;
exports.random = random;
exports.randomInt = randomInt;
exports.randomRange = randomRange;
exports.resetPath = resetPath;
exports.resolveMotionBlurConfig = resolveMotionBlurConfig;
exports.reversePath = reversePath;
exports.ridgedNoise = ridgedNoise;
exports.scalePath = scalePath;
exports.searchFonts = searchFonts;
exports.searchTemplates = searchTemplates;
exports.templateSchema = templateSchema;
exports.translatePath = translatePath;
exports.turbulence = turbulence;
exports.unpackTemplate = unpackTemplate;
exports.validateInputs = validateInputs;
exports.validateManifest = validateManifest;
exports.validateMotionBlurConfig = validateMotionBlurConfig;
exports.validateSceneOrder = validateSceneOrder;
exports.validateTemplate = validateTemplate;
exports.validateTemplateDir = validateTemplateDir;
exports.valueNoise2D = valueNoise2D;
exports.valueNoise3D = valueNoise3D;
exports.visualizeAudio = visualizeAudio;
exports.visualizeAudioWaveform = visualizeAudioWaveform;
exports.weightToNumeric = weightToNumeric;
exports.worley2D = worley2D;
exports.worley3D = worley3D;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map