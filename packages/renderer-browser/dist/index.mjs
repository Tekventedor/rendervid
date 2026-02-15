import React8, { useMemo, useRef, useEffect, useState } from 'react';
import { generatePresetKeyframes, getPropertiesAtFrame, getDefaultRegistry, TemplateProcessor, FontManager } from '@rendervid/core';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { Canvas, useThree, useLoader } from '@react-three/fiber';
import { PerspectiveCamera, OrthographicCamera } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import * as THREE2 from 'three';
import { createRoot } from 'react-dom/client';
import html2canvas from 'html2canvas';
import { ArrayBufferTarget, Muxer } from 'mp4-muxer';

var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
function useLayerAnimation(layer, frame, fps, sceneDuration) {
  const animatedProperties = useMemo(() => {
    if (!layer.animations || layer.animations.length === 0) {
      return {};
    }
    let combined = {};
    for (const animation of layer.animations) {
      const animProps = getAnimationPropertiesAtFrame(
        animation,
        frame,
        fps,
        sceneDuration,
        layer.size
      );
      combined = { ...combined, ...animProps };
    }
    return combined;
  }, [layer.animations, frame, fps, sceneDuration, layer.size]);
  const style = useMemo(() => {
    const css = {};
    if (animatedProperties.opacity !== void 0) {
      css.opacity = animatedProperties.opacity;
    }
    if (animatedProperties.x !== void 0 || animatedProperties.y !== void 0) {
      const x = animatedProperties.x ?? 0;
      const y = animatedProperties.y ?? 0;
      css.transform = `translate(${x}px, ${y}px)`;
    }
    if (animatedProperties.scaleX !== void 0 || animatedProperties.scaleY !== void 0) {
      const scaleX = animatedProperties.scaleX ?? 1;
      const scaleY = animatedProperties.scaleY ?? 1;
      const existing = css.transform || "";
      css.transform = `${existing} scale(${scaleX}, ${scaleY})`.trim();
    }
    if (animatedProperties.rotation !== void 0) {
      const existing = css.transform || "";
      css.transform = `${existing} rotate(${animatedProperties.rotation}deg)`.trim();
    }
    return css;
  }, [animatedProperties]);
  return { style, properties: animatedProperties };
}
function getAnimationPropertiesAtFrame(animation, frame, fps, sceneDuration, layerSize) {
  const { type, effect, duration, delay = 0, keyframes, loop = 1, alternate = false } = animation;
  const animStart = delay;
  const animDuration = duration;
  let localFrame = frame - animStart;
  if (localFrame < 0) {
    if (type === "entrance") {
      return getAnimationStartProperties(animation, layerSize);
    }
    return {};
  }
  if (loop !== 1 && localFrame >= animDuration) {
    if (loop === -1) {
      localFrame = localFrame % animDuration;
      if (alternate && Math.floor((frame - animStart) / animDuration) % 2 === 1) {
        localFrame = animDuration - localFrame;
      }
    } else if (loop > 1) {
      const totalDuration = animDuration * loop;
      if (localFrame >= totalDuration) {
        if (type === "exit") {
          return getAnimationEndProperties(animation, layerSize);
        }
        return {};
      }
      localFrame = localFrame % animDuration;
      if (alternate && Math.floor((frame - animStart) / animDuration) % 2 === 1) {
        localFrame = animDuration - localFrame;
      }
    }
  }
  if (localFrame >= animDuration) {
    if (type === "exit") {
      return getAnimationEndProperties(animation, layerSize);
    }
    return {};
  }
  let animKeyframes = keyframes;
  if (!animKeyframes && effect) {
    animKeyframes = generatePresetKeyframes(effect, {
      duration: animDuration,
      easing: animation.easing,
      layerSize
    });
  }
  if (!animKeyframes || animKeyframes.length === 0) {
    return {};
  }
  return getPropertiesAtFrame(animKeyframes, localFrame);
}
function getAnimationStartProperties(animation, layerSize) {
  const { effect, keyframes, duration } = animation;
  let animKeyframes = keyframes;
  if (!animKeyframes && effect) {
    animKeyframes = generatePresetKeyframes(effect, {
      duration,
      easing: animation.easing,
      layerSize
    });
  }
  if (!animKeyframes || animKeyframes.length === 0) {
    return {};
  }
  return getPropertiesAtFrame(animKeyframes, 0);
}
function getAnimationEndProperties(animation, layerSize) {
  const { effect, keyframes, duration } = animation;
  let animKeyframes = keyframes;
  if (!animKeyframes && effect) {
    animKeyframes = generatePresetKeyframes(effect, {
      duration,
      easing: animation.easing,
      layerSize
    });
  }
  if (!animKeyframes || animKeyframes.length === 0) {
    return {};
  }
  return getPropertiesAtFrame(animKeyframes, duration);
}
var init_useLayerAnimation = __esm({
  "src/hooks/useLayerAnimation.ts"() {
  }
});

// src/styles/resolver.ts
function gradientToCSS(gradient) {
  const { type, from, via, to, direction = 180 } = gradient;
  const colors = via ? `${from}, ${via}, ${to}` : `${from}, ${to}`;
  switch (type) {
    case "linear":
      return `linear-gradient(${direction}deg, ${colors})`;
    case "radial":
      return `radial-gradient(circle, ${colors})`;
    case "conic":
      return `conic-gradient(from ${direction}deg, ${colors})`;
    default:
      return `linear-gradient(${direction}deg, ${colors})`;
  }
}
function resolveSpacing(value) {
  if (value === void 0) return void 0;
  if (typeof value === "number") return `${value}px`;
  return value;
}
function resolveBorderRadius(value) {
  if (value === void 0) return void 0;
  if (typeof value === "number") return `${value}px`;
  if (value in borderRadiusPresets) return borderRadiusPresets[value];
  return value;
}
function resolveFontWeight(value) {
  if (value === void 0) return void 0;
  if (typeof value === "number") return value;
  if (value in fontWeightPresets) return fontWeightPresets[value];
  return 400;
}
function resolveBlur(value) {
  if (value === void 0) return void 0;
  if (typeof value === "number") return value;
  return blurPresets[value] ?? 0;
}
function resolveBoxShadow(value) {
  if (value === void 0) return void 0;
  if (value in shadowPresets) return shadowPresets[value];
  return value;
}
function mapJustifyContent(value) {
  if (!value) return void 0;
  const map = {
    start: "flex-start",
    end: "flex-end",
    center: "center",
    between: "space-between",
    around: "space-around",
    evenly: "space-evenly"
  };
  return map[value] || value;
}
function mapAlignItems(value) {
  if (!value) return void 0;
  const map = {
    start: "flex-start",
    end: "flex-end",
    center: "center",
    stretch: "stretch",
    baseline: "baseline"
  };
  return map[value] || value;
}
function buildFilter(style) {
  const filters = [];
  if (style.blur !== void 0) {
    const blurValue = resolveBlur(style.blur);
    if (blurValue) filters.push(`blur(${blurValue}px)`);
  }
  if (style.brightness !== void 0) {
    filters.push(`brightness(${style.brightness / 100})`);
  }
  if (style.contrast !== void 0) {
    filters.push(`contrast(${style.contrast / 100})`);
  }
  if (style.grayscale !== void 0) {
    filters.push(`grayscale(${style.grayscale}%)`);
  }
  if (style.saturate !== void 0) {
    filters.push(`saturate(${style.saturate / 100})`);
  }
  if (style.sepia !== void 0) {
    filters.push(`sepia(${style.sepia}%)`);
  }
  if (style.hueRotate !== void 0) {
    filters.push(`hue-rotate(${style.hueRotate}deg)`);
  }
  if (style.invert !== void 0) {
    filters.push(`invert(${style.invert}%)`);
  }
  return filters.length > 0 ? filters.join(" ") : void 0;
}
function resolveStyle(style) {
  const css = {};
  if (style.padding !== void 0) css.padding = resolveSpacing(style.padding);
  if (style.paddingX !== void 0) {
    css.paddingLeft = resolveSpacing(style.paddingX);
    css.paddingRight = resolveSpacing(style.paddingX);
  }
  if (style.paddingY !== void 0) {
    css.paddingTop = resolveSpacing(style.paddingY);
    css.paddingBottom = resolveSpacing(style.paddingY);
  }
  if (style.paddingTop !== void 0) css.paddingTop = resolveSpacing(style.paddingTop);
  if (style.paddingRight !== void 0) css.paddingRight = resolveSpacing(style.paddingRight);
  if (style.paddingBottom !== void 0) css.paddingBottom = resolveSpacing(style.paddingBottom);
  if (style.paddingLeft !== void 0) css.paddingLeft = resolveSpacing(style.paddingLeft);
  if (style.margin !== void 0) css.margin = resolveSpacing(style.margin);
  if (style.marginX !== void 0) {
    css.marginLeft = resolveSpacing(style.marginX);
    css.marginRight = resolveSpacing(style.marginX);
  }
  if (style.marginY !== void 0) {
    css.marginTop = resolveSpacing(style.marginY);
    css.marginBottom = resolveSpacing(style.marginY);
  }
  if (style.borderRadius !== void 0) css.borderRadius = resolveBorderRadius(style.borderRadius);
  if (style.borderTopLeftRadius !== void 0) css.borderTopLeftRadius = resolveBorderRadius(style.borderTopLeftRadius);
  if (style.borderTopRightRadius !== void 0) css.borderTopRightRadius = resolveBorderRadius(style.borderTopRightRadius);
  if (style.borderBottomRightRadius !== void 0) css.borderBottomRightRadius = resolveBorderRadius(style.borderBottomRightRadius);
  if (style.borderBottomLeftRadius !== void 0) css.borderBottomLeftRadius = resolveBorderRadius(style.borderBottomLeftRadius);
  if (style.borderWidth !== void 0) css.borderWidth = style.borderWidth;
  if (style.borderColor !== void 0) css.borderColor = style.borderColor;
  if (style.borderStyle !== void 0) css.borderStyle = style.borderStyle;
  if (style.boxShadow !== void 0) css.boxShadow = resolveBoxShadow(style.boxShadow);
  if (style.backgroundColor !== void 0) css.backgroundColor = style.backgroundColor;
  if (style.backgroundGradient !== void 0) {
    css.backgroundImage = gradientToCSS(style.backgroundGradient);
  }
  if (style.backgroundImage !== void 0) {
    css.backgroundImage = `url(${style.backgroundImage})`;
  }
  if (style.backgroundSize !== void 0) css.backgroundSize = style.backgroundSize;
  if (style.backgroundPosition !== void 0) css.backgroundPosition = style.backgroundPosition;
  if (style.backdropBlur !== void 0) {
    const blurValue = resolveBlur(style.backdropBlur);
    if (blurValue) css.backdropFilter = `blur(${blurValue}px)`;
  }
  if (style.fontFamily !== void 0) css.fontFamily = style.fontFamily;
  if (style.fontSize !== void 0) css.fontSize = resolveSpacing(style.fontSize);
  if (style.fontWeight !== void 0) css.fontWeight = resolveFontWeight(style.fontWeight);
  if (style.lineHeight !== void 0) css.lineHeight = style.lineHeight;
  if (style.letterSpacing !== void 0) css.letterSpacing = resolveSpacing(style.letterSpacing);
  if (style.textAlign !== void 0) css.textAlign = style.textAlign;
  if (style.textColor !== void 0) css.color = style.textColor;
  if (style.textShadow !== void 0) css.textShadow = style.textShadow;
  if (style.textDecoration !== void 0) css.textDecoration = style.textDecoration;
  if (style.textTransform !== void 0) css.textTransform = style.textTransform;
  if (style.wordBreak !== void 0) css.wordBreak = style.wordBreak;
  if (style.whiteSpace !== void 0) css.whiteSpace = style.whiteSpace;
  if (style.display !== void 0) css.display = style.display;
  if (style.flexDirection !== void 0) css.flexDirection = style.flexDirection;
  if (style.flexWrap !== void 0) css.flexWrap = style.flexWrap;
  if (style.justifyContent !== void 0) css.justifyContent = mapJustifyContent(style.justifyContent);
  if (style.alignItems !== void 0) css.alignItems = mapAlignItems(style.alignItems);
  if (style.alignContent !== void 0) css.alignContent = mapAlignItems(style.alignContent);
  if (style.gap !== void 0) css.gap = resolveSpacing(style.gap);
  if (style.rowGap !== void 0) css.rowGap = resolveSpacing(style.rowGap);
  if (style.columnGap !== void 0) css.columnGap = resolveSpacing(style.columnGap);
  const filter = buildFilter(style);
  if (filter) css.filter = filter;
  if (style.overflow !== void 0) css.overflow = style.overflow;
  if (style.overflowX !== void 0) css.overflowX = style.overflowX;
  if (style.overflowY !== void 0) css.overflowY = style.overflowY;
  if (style.css) {
    Object.assign(css, style.css);
  }
  return css;
}
function mergeStyles(className, style) {
  return {
    className: className || "",
    style: style ? resolveStyle(style) : {}
  };
}
function getStyleClassName(className) {
  return className;
}
var shadowPresets, blurPresets, borderRadiusPresets, fontWeightPresets;
var init_resolver = __esm({
  "src/styles/resolver.ts"() {
    shadowPresets = {
      sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)"
    };
    blurPresets = {
      sm: 4,
      md: 12,
      lg: 24
    };
    borderRadiusPresets = {
      none: "0",
      sm: "0.125rem",
      md: "0.375rem",
      lg: "0.5rem",
      xl: "0.75rem",
      "2xl": "1rem",
      "3xl": "1.5rem",
      full: "9999px"
    };
    fontWeightPresets = {
      thin: 100,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900
    };
  }
});
function ImageLayer({ layer, frame, fps, sceneDuration }) {
  const { style: animationStyle } = useLayerAnimation(layer, frame, fps, sceneDuration);
  const src = layer.props.src;
  if (!src) return null;
  const fit = layer.props.fit || "cover";
  const objectPosition = layer.props.objectPosition || "center";
  const layerStyle = layer.style ? resolveStyle(layer.style) : {};
  const anchor = layer.anchor ?? { x: 0, y: 0 };
  const left = layer.position.x - layer.size.width * anchor.x;
  const top = layer.position.y - layer.size.height * anchor.y;
  return /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        position: "absolute",
        left,
        top,
        width: layer.size.width,
        height: layer.size.height,
        transform: layer.rotation ? `rotate(${layer.rotation}deg)` : void 0,
        opacity: layer.opacity ?? 1,
        overflow: "hidden",
        ...layerStyle,
        ...animationStyle
      },
      className: layer.className,
      children: /* @__PURE__ */ jsx(
        "img",
        {
          src,
          alt: "",
          style: {
            width: "100%",
            height: "100%",
            objectFit: fit === "fill" ? "fill" : fit,
            objectPosition,
            display: "block"
          }
        }
      )
    }
  );
}
var init_ImageLayer = __esm({
  "src/layers/ImageLayer.tsx"() {
    init_useLayerAnimation();
    init_resolver();
  }
});
function TextLayer({ layer, frame, fps, sceneDuration }) {
  const { style: animationStyle } = useLayerAnimation(layer, frame, fps, sceneDuration);
  const {
    text,
    fontFamily = "Inter, sans-serif",
    fontSize = 16,
    fontWeight = "normal",
    fontStyle = "normal",
    color = "#000000",
    textAlign = "left",
    verticalAlign = "top",
    lineHeight = 1.4,
    letterSpacing = 0,
    textTransform,
    textDecoration,
    stroke,
    textShadow,
    backgroundColor,
    padding,
    borderRadius,
    maxLines,
    overflow = "visible"
  } = layer.props;
  const layerStyle = layer.style ? resolveStyle(layer.style) : {};
  let paddingStyle = {};
  if (padding !== void 0) {
    if (typeof padding === "number") {
      paddingStyle = { padding };
    } else {
      paddingStyle = {
        paddingTop: padding.top,
        paddingRight: padding.right,
        paddingBottom: padding.bottom,
        paddingLeft: padding.left
      };
    }
  }
  let strokeShadow = "";
  if (stroke) {
    const { color: strokeColor, width } = stroke;
    strokeShadow = [
      `${width}px 0 ${strokeColor}`,
      `-${width}px 0 ${strokeColor}`,
      `0 ${width}px ${strokeColor}`,
      `0 -${width}px ${strokeColor}`
    ].join(", ");
  }
  const combinedTextShadow = [strokeShadow, textShadow ? `${textShadow.offsetX}px ${textShadow.offsetY}px ${textShadow.blur}px ${textShadow.color}` : ""].filter(Boolean).join(", ") || void 0;
  const alignItems = {
    top: "flex-start",
    middle: "center",
    bottom: "flex-end"
  }[verticalAlign];
  const anchor = layer.anchor ?? { x: 0, y: 0 };
  const left = layer.position.x - layer.size.width * anchor.x;
  const top = layer.position.y - layer.size.height * anchor.y;
  return /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        position: "absolute",
        left,
        top,
        width: layer.size.width,
        height: layer.size.height,
        transform: layer.rotation ? `rotate(${layer.rotation}deg)` : void 0,
        opacity: layer.opacity ?? 1,
        display: "flex",
        alignItems,
        justifyContent: textAlign === "center" ? "center" : textAlign === "right" ? "flex-end" : "flex-start",
        ...layerStyle,
        ...animationStyle
      },
      className: layer.className,
      children: /* @__PURE__ */ jsx(
        "div",
        {
          style: {
            fontFamily,
            fontSize,
            fontWeight,
            fontStyle,
            color,
            textAlign,
            lineHeight,
            letterSpacing,
            textTransform,
            textDecoration,
            textShadow: combinedTextShadow,
            backgroundColor,
            borderRadius,
            overflow: overflow === "ellipsis" ? "hidden" : overflow,
            textOverflow: overflow === "ellipsis" ? "ellipsis" : void 0,
            whiteSpace: maxLines === 1 ? "nowrap" : void 0,
            display: maxLines && maxLines > 1 ? "-webkit-box" : void 0,
            WebkitLineClamp: maxLines && maxLines > 1 ? maxLines : void 0,
            WebkitBoxOrient: maxLines && maxLines > 1 ? "vertical" : void 0,
            width: "100%",
            ...paddingStyle
          },
          children: text
        }
      )
    }
  );
}
var init_TextLayer = __esm({
  "src/layers/TextLayer.tsx"() {
    init_useLayerAnimation();
    init_resolver();
  }
});
function VideoLayer({ layer, frame, fps, sceneDuration, isPlaying = true }) {
  const videoRef = useRef(null);
  const { style: animationStyle } = useLayerAnimation(layer, frame, fps, sceneDuration);
  const src = layer.props.src;
  if (!src) return null;
  const {
    fit = "cover",
    loop = false,
    muted = false,
    playbackRate = 1,
    startTime = 0,
    volume = 1
  } = layer.props;
  const layerStyle = layer.style ? resolveStyle(layer.style) : {};
  const anchor = layer.anchor ?? { x: 0, y: 0 };
  const left = layer.position.x - layer.size.width * anchor.x;
  const top = layer.position.y - layer.size.height * anchor.y;
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const layerStartFrame = layer.from ?? 0;
    const localFrame = frame - layerStartFrame;
    const targetTime = startTime + localFrame / fps * playbackRate;
    const tolerance = 1e-3;
    if (Math.abs(video.currentTime - targetTime) > tolerance) {
      video.currentTime = targetTime;
    }
    if (isPlaying && video.paused) {
      video.play().catch(() => {
      });
    } else if (!isPlaying && !video.paused) {
      video.pause();
    }
  }, [frame, fps, startTime, playbackRate, isPlaying, layer.from]);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = playbackRate;
    video.volume = muted ? 0 : volume;
  }, [playbackRate, volume, muted]);
  return /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        position: "absolute",
        left,
        top,
        width: layer.size.width,
        height: layer.size.height,
        transform: layer.rotation ? `rotate(${layer.rotation}deg)` : void 0,
        opacity: layer.opacity ?? 1,
        overflow: "hidden",
        ...layerStyle,
        ...animationStyle
      },
      className: layer.className,
      children: /* @__PURE__ */ jsx(
        "video",
        {
          ref: videoRef,
          src,
          loop,
          muted,
          playsInline: true,
          style: {
            width: "100%",
            height: "100%",
            objectFit: fit
          }
        }
      )
    }
  );
}
var init_VideoLayer = __esm({
  "src/layers/VideoLayer.tsx"() {
    init_useLayerAnimation();
    init_resolver();
  }
});
function createGradientDef(gradient, id) {
  const { type, colors, angle = 0 } = gradient;
  if (type === "radial") {
    return /* @__PURE__ */ jsx("radialGradient", { id, cx: "50%", cy: "50%", r: "50%", children: colors.map((stop, i) => /* @__PURE__ */ jsx("stop", { offset: `${stop.offset * 100}%`, stopColor: stop.color }, i)) });
  }
  const rad = angle * Math.PI / 180;
  const x1 = 50 - Math.cos(rad) * 50;
  const y1 = 50 + Math.sin(rad) * 50;
  const x2 = 50 + Math.cos(rad) * 50;
  const y2 = 50 - Math.sin(rad) * 50;
  return /* @__PURE__ */ jsx("linearGradient", { id, x1: `${x1}%`, y1: `${y1}%`, x2: `${x2}%`, y2: `${y2}%`, children: colors.map((stop, i) => /* @__PURE__ */ jsx("stop", { offset: `${stop.offset * 100}%`, stopColor: stop.color }, i)) });
}
function generatePolygonPoints(sides, width, height) {
  const points = [];
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2;
  for (let i = 0; i < sides; i++) {
    const angle = i * 2 * Math.PI / sides - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    points.push(`${x},${y}`);
  }
  return points.join(" ");
}
function generateStarPoints(points, width, height, innerRadius) {
  const result = [];
  const centerX = width / 2;
  const centerY = height / 2;
  const outerRadius = Math.min(width, height) / 2;
  const inner = outerRadius * innerRadius;
  for (let i = 0; i < points * 2; i++) {
    const angle = i * Math.PI / points - Math.PI / 2;
    const radius = i % 2 === 0 ? outerRadius : inner;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    result.push(`${x},${y}`);
  }
  return result.join(" ");
}
function ShapeLayer({ layer, frame, fps, sceneDuration }) {
  const { style: animationStyle } = useLayerAnimation(layer, frame, fps, sceneDuration);
  const {
    shape,
    fill,
    gradient,
    stroke,
    strokeWidth = 0,
    strokeDash,
    borderRadius = 0,
    sides = 6,
    points = 5,
    innerRadius = 0.5,
    pathData
  } = layer.props;
  const { width, height } = layer.size;
  const gradientId = `gradient-${layer.id}`;
  const fillValue = gradient ? `url(#${gradientId})` : fill || "transparent";
  const layerStyle = layer.style ? resolveStyle(layer.style) : {};
  const anchor = layer.anchor ?? { x: 0, y: 0 };
  const left = layer.position.x - layer.size.width * anchor.x;
  const top = layer.position.y - layer.size.height * anchor.y;
  const renderShape = () => {
    switch (shape) {
      case "rectangle":
        return /* @__PURE__ */ jsx(
          "rect",
          {
            x: strokeWidth / 2,
            y: strokeWidth / 2,
            width: width - strokeWidth,
            height: height - strokeWidth,
            rx: borderRadius,
            ry: borderRadius,
            fill: fillValue,
            stroke,
            strokeWidth,
            strokeDasharray: strokeDash?.join(" ")
          }
        );
      case "ellipse":
        return /* @__PURE__ */ jsx(
          "ellipse",
          {
            cx: width / 2,
            cy: height / 2,
            rx: (width - strokeWidth) / 2,
            ry: (height - strokeWidth) / 2,
            fill: fillValue,
            stroke,
            strokeWidth,
            strokeDasharray: strokeDash?.join(" ")
          }
        );
      case "polygon":
        return /* @__PURE__ */ jsx(
          "polygon",
          {
            points: generatePolygonPoints(sides, width, height),
            fill: fillValue,
            stroke,
            strokeWidth,
            strokeDasharray: strokeDash?.join(" ")
          }
        );
      case "star":
        return /* @__PURE__ */ jsx(
          "polygon",
          {
            points: generateStarPoints(points, width, height, innerRadius),
            fill: fillValue,
            stroke,
            strokeWidth,
            strokeDasharray: strokeDash?.join(" ")
          }
        );
      case "path":
        return /* @__PURE__ */ jsx(
          "path",
          {
            d: pathData || "",
            fill: fillValue,
            stroke,
            strokeWidth,
            strokeDasharray: strokeDash?.join(" ")
          }
        );
      default:
        return null;
    }
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        position: "absolute",
        left,
        top,
        width: layer.size.width,
        height: layer.size.height,
        transform: layer.rotation ? `rotate(${layer.rotation}deg)` : void 0,
        opacity: layer.opacity ?? 1,
        ...layerStyle,
        ...animationStyle
      },
      className: layer.className,
      children: /* @__PURE__ */ jsxs(
        "svg",
        {
          width,
          height,
          viewBox: `0 0 ${width} ${height}`,
          style: { display: "block" },
          children: [
            gradient && /* @__PURE__ */ jsx("defs", { children: createGradientDef(gradient, gradientId) }),
            renderShape()
          ]
        }
      )
    }
  );
}
var init_ShapeLayer = __esm({
  "src/layers/ShapeLayer.tsx"() {
    init_useLayerAnimation();
    init_resolver();
  }
});
function AudioLayer({ layer, frame, fps, sceneDuration, isPlaying = true }) {
  const audioRef = useRef(null);
  const src = layer.props.src;
  if (!src) return null;
  const {
    volume = 1,
    loop = false,
    startTime = 0,
    fadeIn = 0,
    fadeOut = 0
  } = layer.props;
  const layerStartFrame = layer.from ?? 0;
  const layerDuration = layer.duration ?? sceneDuration;
  const localFrame = frame - layerStartFrame;
  let currentVolume = volume;
  if (fadeIn > 0 && localFrame < fadeIn) {
    currentVolume = volume * (localFrame / fadeIn);
  }
  if (fadeOut > 0 && localFrame > layerDuration - fadeOut) {
    const fadeProgress = (layerDuration - localFrame) / fadeOut;
    currentVolume = volume * Math.max(0, fadeProgress);
  }
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const targetTime = startTime + localFrame / fps;
    if (Math.abs(audio.currentTime - targetTime) > 0.1) {
      audio.currentTime = targetTime;
    }
    if (isPlaying && audio.paused) {
      audio.play().catch(() => {
      });
    } else if (!isPlaying && !audio.paused) {
      audio.pause();
    }
  }, [frame, fps, startTime, isPlaying, localFrame]);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = Math.max(0, Math.min(1, currentVolume));
  }, [currentVolume]);
  return /* @__PURE__ */ jsx(
    "audio",
    {
      ref: audioRef,
      src,
      loop,
      style: { display: "none" }
    }
  );
}
var init_AudioLayer = __esm({
  "src/layers/AudioLayer.tsx"() {
  }
});
function GroupLayer({
  layer,
  frame,
  fps,
  sceneDuration,
  isPlaying,
  registry
}) {
  const { style: animationStyle } = useLayerAnimation(layer, frame, fps, sceneDuration);
  const { clip = false } = layer.props;
  const layerStyle = layer.style ? resolveStyle(layer.style) : {};
  return /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        position: "absolute",
        left: layer.position.x,
        top: layer.position.y,
        width: layer.size.width,
        height: layer.size.height,
        transform: layer.rotation ? `rotate(${layer.rotation}deg)` : void 0,
        opacity: layer.opacity ?? 1,
        overflow: clip ? "hidden" : "visible",
        ...layerStyle,
        ...animationStyle
      },
      className: layer.className,
      children: layer.children?.map((child) => /* @__PURE__ */ jsx(
        LayerRenderer,
        {
          layer: child,
          frame,
          fps,
          sceneDuration,
          isPlaying,
          registry
        },
        child.id
      ))
    }
  );
}
var init_GroupLayer = __esm({
  "src/layers/GroupLayer.tsx"() {
    init_useLayerAnimation();
    init_resolver();
    init_LayerRenderer();
  }
});
function LottieLayer({ layer, frame, fps, sceneDuration }) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { style: animationStyle } = useLayerAnimation(layer, frame, fps, sceneDuration);
  const {
    data,
    loop = false,
    speed = 1,
    direction = 1
  } = layer.props;
  const layerStyle = layer.style ? resolveStyle(layer.style) : {};
  useEffect(() => {
    if (lottie) {
      setIsLoaded(true);
      return;
    }
    import('lottie-web').then((module) => {
      lottie = module.default;
      setIsLoaded(true);
    }).catch((err) => {
      console.warn("Failed to load lottie-web:", err);
    });
  }, []);
  useEffect(() => {
    if (!isLoaded || !lottie || !containerRef.current) return;
    const isUrl = typeof data === "string";
    playerRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: false,
      // We control frames manually
      autoplay: false,
      ...isUrl ? { path: data } : { animationData: data }
    });
    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [isLoaded, data]);
  useEffect(() => {
    if (!playerRef.current) return;
    const player = playerRef.current;
    const layerStartFrame = layer.from ?? 0;
    const localFrame = frame - layerStartFrame;
    let lottieFrame = localFrame * speed;
    if (direction === -1) {
      lottieFrame = player.totalFrames - lottieFrame;
    }
    if (loop && player.totalFrames > 0) {
      lottieFrame = lottieFrame % player.totalFrames;
    }
    lottieFrame = Math.max(0, Math.min(lottieFrame, player.totalFrames - 1));
    player.goToAndStop(Math.floor(lottieFrame), true);
  }, [frame, layer.from, speed, direction, loop]);
  return /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        position: "absolute",
        left: layer.position.x,
        top: layer.position.y,
        width: layer.size.width,
        height: layer.size.height,
        transform: layer.rotation ? `rotate(${layer.rotation}deg)` : void 0,
        opacity: layer.opacity ?? 1,
        ...layerStyle,
        ...animationStyle
      },
      className: layer.className,
      children: /* @__PURE__ */ jsx(
        "div",
        {
          ref: containerRef,
          style: {
            width: "100%",
            height: "100%"
          }
        }
      )
    }
  );
}
var lottie;
var init_LottieLayer = __esm({
  "src/layers/LottieLayer.tsx"() {
    init_useLayerAnimation();
    init_resolver();
    lottie = null;
  }
});
function CustomLayer({
  layer,
  frame,
  fps,
  sceneDuration,
  registry
}) {
  const { style: animationStyle } = useLayerAnimation(layer, frame, fps, sceneDuration);
  const { customComponent } = layer;
  if (!customComponent) {
    console.warn(`Custom layer ${layer.id} has no customComponent defined`);
    return null;
  }
  const { name, props: componentProps } = customComponent;
  const Component = registry?.get(name);
  if (!Component) {
    console.warn(`Custom component "${name}" not found in registry`);
    return null;
  }
  const layerStyle = layer.style ? resolveStyle(layer.style) : {};
  const anchor = layer.anchor ?? { x: 0, y: 0 };
  const left = layer.position.x - layer.size.width * anchor.x;
  const top = layer.position.y - layer.size.height * anchor.y;
  return /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        position: "absolute",
        left,
        top,
        width: layer.size.width,
        height: layer.size.height,
        transform: layer.rotation ? `rotate(${layer.rotation}deg)` : void 0,
        opacity: layer.opacity ?? 1,
        ...layerStyle,
        ...animationStyle
      },
      className: layer.className,
      children: /* @__PURE__ */ jsx(
        Component,
        {
          ...componentProps,
          frame,
          fps,
          sceneDuration,
          layerSize: layer.size
        }
      )
    }
  );
}
var init_CustomLayer = __esm({
  "src/layers/CustomLayer.tsx"() {
    init_useLayerAnimation();
    init_resolver();
  }
});
function Camera({ config, frame, layerSize }) {
  const { set } = useThree();
  if (config.type === "perspective") {
    const {
      fov = 75,
      near: near2 = 0.1,
      far: far2 = 1e3,
      position: position2 = [0, 0, 5],
      lookAt: lookAt2
    } = config;
    return /* @__PURE__ */ jsx(
      PerspectiveCamera,
      {
        makeDefault: true,
        fov,
        near: near2,
        far: far2,
        position: position2,
        aspect: layerSize.width / layerSize.height,
        onUpdate: (camera) => {
          if (lookAt2) {
            camera.lookAt(lookAt2[0], lookAt2[1], lookAt2[2]);
          }
        }
      }
    );
  }
  const {
    left,
    right,
    top,
    bottom,
    near = 0.1,
    far = 1e3,
    position = [0, 0, 5],
    lookAt
  } = config;
  const aspect = layerSize.width / layerSize.height;
  const frustumSize = 10;
  const orthoLeft = left ?? -frustumSize * aspect / 2;
  const orthoRight = right ?? frustumSize * aspect / 2;
  const orthoTop = top ?? frustumSize / 2;
  const orthoBottom = bottom ?? -frustumSize / 2;
  return /* @__PURE__ */ jsx(
    OrthographicCamera,
    {
      makeDefault: true,
      left: orthoLeft,
      right: orthoRight,
      top: orthoTop,
      bottom: orthoBottom,
      near,
      far,
      position,
      onUpdate: (camera) => {
        if (lookAt) {
          camera.lookAt(lookAt[0], lookAt[1], lookAt[2]);
        }
      }
    }
  );
}
var init_Camera = __esm({
  "src/layers/three/Camera.tsx"() {
  }
});
function Lights({ lights }) {
  return /* @__PURE__ */ jsx(Fragment, { children: lights.map((light, index) => {
    const key = `light-${index}`;
    switch (light.type) {
      case "ambient":
        return /* @__PURE__ */ jsx(
          "ambientLight",
          {
            color: light.color,
            intensity: light.intensity ?? 1
          },
          key
        );
      case "directional": {
        const position = light.position;
        return /* @__PURE__ */ jsx(
          "directionalLight",
          {
            color: light.color,
            intensity: light.intensity ?? 1,
            position,
            castShadow: light.castShadow ?? false,
            "shadow-mapSize-width": light.shadowMapSize ?? 1024,
            "shadow-mapSize-height": light.shadowMapSize ?? 1024,
            onUpdate: (self) => {
              if (light.target) {
                self.target.position.set(
                  light.target[0],
                  light.target[1],
                  light.target[2]
                );
              }
            }
          },
          key
        );
      }
      case "point":
        return /* @__PURE__ */ jsx(
          "pointLight",
          {
            color: light.color,
            intensity: light.intensity ?? 1,
            position: light.position,
            distance: light.distance ?? 0,
            decay: light.decay ?? 2,
            castShadow: light.castShadow ?? false
          },
          key
        );
      case "spot": {
        const position = light.position;
        return /* @__PURE__ */ jsx(
          "spotLight",
          {
            color: light.color,
            intensity: light.intensity ?? 1,
            position,
            distance: light.distance ?? 0,
            angle: light.angle ?? Math.PI / 3,
            penumbra: light.penumbra ?? 0,
            decay: light.decay ?? 2,
            castShadow: light.castShadow ?? false,
            onUpdate: (self) => {
              if (light.target) {
                self.target.position.set(
                  light.target[0],
                  light.target[1],
                  light.target[2]
                );
              }
            }
          },
          key
        );
      }
      case "hemisphere":
        return /* @__PURE__ */ jsx(
          "hemisphereLight",
          {
            color: light.color,
            groundColor: light.groundColor,
            intensity: light.intensity ?? 1,
            position: light.position ?? [0, 1, 0]
          },
          key
        );
      default:
        console.warn(`Unknown light type: ${light.type}`);
        return null;
    }
  }) });
}
var init_Lights = __esm({
  "src/layers/three/Lights.tsx"() {
  }
});
function Geometry({ config }) {
  switch (config.type) {
    case "box": {
      const {
        width = 1,
        height = 1,
        depth = 1,
        widthSegments = 1,
        heightSegments = 1,
        depthSegments = 1
      } = config;
      return /* @__PURE__ */ jsx(
        "boxGeometry",
        {
          args: [width, height, depth, widthSegments, heightSegments, depthSegments]
        }
      );
    }
    case "sphere": {
      const {
        radius = 1,
        widthSegments = 32,
        heightSegments = 16,
        phiStart = 0,
        phiLength = Math.PI * 2,
        thetaStart = 0,
        thetaLength = Math.PI
      } = config;
      return /* @__PURE__ */ jsx(
        "sphereGeometry",
        {
          args: [
            radius,
            widthSegments,
            heightSegments,
            phiStart,
            phiLength,
            thetaStart,
            thetaLength
          ]
        }
      );
    }
    case "cylinder": {
      const {
        radiusTop = 1,
        radiusBottom = 1,
        height = 1,
        radialSegments = 8,
        heightSegments = 1,
        openEnded = false
      } = config;
      return /* @__PURE__ */ jsx(
        "cylinderGeometry",
        {
          args: [radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded]
        }
      );
    }
    case "cone": {
      const {
        radius = 1,
        height = 1,
        radialSegments = 8,
        heightSegments = 1,
        openEnded = false
      } = config;
      return /* @__PURE__ */ jsx(
        "coneGeometry",
        {
          args: [radius, height, radialSegments, heightSegments, openEnded]
        }
      );
    }
    case "torus": {
      const {
        radius = 1,
        tube = 0.4,
        radialSegments = 8,
        tubularSegments = 6,
        arc = Math.PI * 2
      } = config;
      return /* @__PURE__ */ jsx(
        "torusGeometry",
        {
          args: [radius, tube, radialSegments, tubularSegments, arc]
        }
      );
    }
    case "plane": {
      const {
        width = 1,
        height = 1,
        widthSegments = 1,
        heightSegments = 1
      } = config;
      return /* @__PURE__ */ jsx(
        "planeGeometry",
        {
          args: [width, height, widthSegments, heightSegments]
        }
      );
    }
    case "gltf":
      return /* @__PURE__ */ jsx(GLTFGeometry, { config });
    case "text3d":
      return /* @__PURE__ */ jsx(Text3DGeometry, { config });
    default:
      console.warn(`Unknown geometry type: ${config.type}`);
      return /* @__PURE__ */ jsx("boxGeometry", {});
  }
}
function GLTFGeometry({ config }) {
  const [geometry, setGeometry] = useState(null);
  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(
      config.url,
      (gltf) => {
        gltf.scene.traverse((child) => {
          if (child instanceof THREE2.Mesh && child.geometry) {
            const geom = child.geometry.clone();
            if (config.scale) {
              geom.scale(config.scale, config.scale, config.scale);
            }
            setGeometry(geom);
          }
        });
      },
      void 0,
      (error) => {
        console.error("Error loading GLTF:", error);
        setGeometry(new THREE2.BoxGeometry(1, 1, 1));
      }
    );
  }, [config.url, config.scale]);
  if (!geometry) {
    return /* @__PURE__ */ jsx("boxGeometry", { args: [0.1, 0.1, 0.1] });
  }
  return /* @__PURE__ */ jsx("primitive", { object: geometry, attach: "geometry" });
}
function Text3DGeometry({ config }) {
  const [geometry, setGeometry] = useState(null);
  useEffect(() => {
    const loader = new FontLoader();
    loader.load(
      config.font,
      (font) => {
        const textGeometry = new TextGeometry(config.text, {
          font,
          size: config.size ?? 1,
          height: config.height ?? 0.2,
          curveSegments: config.curveSegments ?? 12,
          bevelEnabled: config.bevelEnabled ?? false,
          bevelThickness: config.bevelThickness ?? 0.03,
          bevelSize: config.bevelSize ?? 0.02,
          bevelSegments: config.bevelSegments ?? 3
        });
        textGeometry.computeBoundingBox();
        setGeometry(textGeometry);
      },
      void 0,
      (error) => {
        console.error("Error loading font:", error);
        setGeometry(new THREE2.BoxGeometry(1, 0.2, 0.2));
      }
    );
  }, [config.text, config.font, config.size, config.height]);
  if (!geometry) {
    return /* @__PURE__ */ jsx("boxGeometry", { args: [0.1, 0.1, 0.1] });
  }
  return /* @__PURE__ */ jsx("primitive", { object: geometry, attach: "geometry" });
}
var init_Geometry = __esm({
  "src/layers/three/Geometry.tsx"() {
  }
});
function Material({ config }) {
  switch (config.type) {
    case "standard":
      return /* @__PURE__ */ jsx(StandardMaterial, { config });
    case "basic":
      return /* @__PURE__ */ jsx(BasicMaterial, { config });
    case "phong":
      return /* @__PURE__ */ jsx(PhongMaterial, { config });
    case "physical":
      return /* @__PURE__ */ jsx(PhysicalMaterial, { config });
    case "normal":
      return /* @__PURE__ */ jsx(NormalMaterial, { config });
    case "matcap":
      return /* @__PURE__ */ jsx(MatCapMaterial, { config });
    default:
      console.warn(`Unknown material type: ${config.type}`);
      return /* @__PURE__ */ jsx("meshStandardMaterial", {});
  }
}
function StandardMaterial({
  config
}) {
  const map = useTextureIfDefined(config.map);
  const normalMap = useTextureIfDefined(config.normalMap);
  const roughnessMap = useTextureIfDefined(config.roughnessMap);
  const metalnessMap = useTextureIfDefined(config.metalnessMap);
  const aoMap = useTextureIfDefined(config.aoMap);
  const emissiveMap = useTextureIfDefined(config.emissiveMap);
  const envMap = useTextureIfDefined(config.envMap);
  return /* @__PURE__ */ jsx(
    "meshStandardMaterial",
    {
      color: config.color,
      opacity: config.opacity ?? 1,
      transparent: config.transparent ?? (config.opacity !== void 0 && config.opacity < 1),
      side: getSide(config.side),
      flatShading: config.flatShading,
      wireframe: config.wireframe,
      metalness: config.metalness ?? 0,
      roughness: config.roughness ?? 1,
      map,
      normalMap,
      normalScale: config.normalScale ? new THREE2.Vector2(...config.normalScale) : void 0,
      roughnessMap,
      metalnessMap,
      aoMap,
      aoMapIntensity: config.aoMapIntensity,
      emissive: config.emissive,
      emissiveIntensity: config.emissiveIntensity,
      emissiveMap,
      envMap,
      envMapIntensity: config.envMapIntensity
    }
  );
}
function BasicMaterial({
  config
}) {
  const map = useTextureIfDefined(config.map);
  const envMap = useTextureIfDefined(config.envMap);
  return /* @__PURE__ */ jsx(
    "meshBasicMaterial",
    {
      color: config.color,
      opacity: config.opacity ?? 1,
      transparent: config.transparent ?? (config.opacity !== void 0 && config.opacity < 1),
      side: getSide(config.side),
      flatShading: config.flatShading,
      wireframe: config.wireframe,
      map,
      envMap,
      reflectivity: config.reflectivity,
      refractionRatio: config.refractionRatio
    }
  );
}
function PhongMaterial({
  config
}) {
  const map = useTextureIfDefined(config.map);
  const normalMap = useTextureIfDefined(config.normalMap);
  const specularMap = useTextureIfDefined(config.specularMap);
  const emissiveMap = useTextureIfDefined(config.emissiveMap);
  return /* @__PURE__ */ jsx(
    "meshPhongMaterial",
    {
      color: config.color,
      opacity: config.opacity ?? 1,
      transparent: config.transparent ?? (config.opacity !== void 0 && config.opacity < 1),
      side: getSide(config.side),
      flatShading: config.flatShading,
      wireframe: config.wireframe,
      specular: config.specular,
      shininess: config.shininess ?? 30,
      map,
      normalMap,
      normalScale: config.normalScale ? new THREE2.Vector2(...config.normalScale) : void 0,
      specularMap,
      emissive: config.emissive,
      emissiveMap
    }
  );
}
function PhysicalMaterial({
  config
}) {
  const map = useTextureIfDefined(config.map);
  const normalMap = useTextureIfDefined(config.normalMap);
  const roughnessMap = useTextureIfDefined(config.roughnessMap);
  const metalnessMap = useTextureIfDefined(config.metalnessMap);
  const aoMap = useTextureIfDefined(config.aoMap);
  const emissiveMap = useTextureIfDefined(config.emissiveMap);
  const envMap = useTextureIfDefined(config.envMap);
  return /* @__PURE__ */ jsx(
    "meshPhysicalMaterial",
    {
      color: config.color,
      opacity: config.opacity ?? 1,
      transparent: config.transparent ?? (config.opacity !== void 0 && config.opacity < 1),
      side: getSide(config.side),
      flatShading: config.flatShading,
      wireframe: config.wireframe,
      metalness: config.metalness ?? 0,
      roughness: config.roughness ?? 1,
      map,
      normalMap,
      normalScale: config.normalScale ? new THREE2.Vector2(...config.normalScale) : void 0,
      roughnessMap,
      metalnessMap,
      aoMap,
      aoMapIntensity: config.aoMapIntensity,
      emissive: config.emissive,
      emissiveIntensity: config.emissiveIntensity,
      emissiveMap,
      envMap,
      envMapIntensity: config.envMapIntensity,
      clearcoat: config.clearcoat,
      clearcoatRoughness: config.clearcoatRoughness,
      sheen: config.sheen,
      sheenColor: config.sheenColor,
      transmission: config.transmission,
      thickness: config.thickness
    }
  );
}
function NormalMaterial({
  config
}) {
  const normalMap = useTextureIfDefined(config.normalMap);
  return /* @__PURE__ */ jsx(
    "meshNormalMaterial",
    {
      opacity: config.opacity ?? 1,
      transparent: config.transparent ?? (config.opacity !== void 0 && config.opacity < 1),
      side: getSide(config.side),
      flatShading: config.flatShading,
      wireframe: config.wireframe,
      normalMap,
      normalScale: config.normalScale ? new THREE2.Vector2(...config.normalScale) : void 0
    }
  );
}
function MatCapMaterial({
  config
}) {
  const matcap = useTexture(config.matcap);
  const map = useTextureIfDefined(config.map);
  const normalMap = useTextureIfDefined(config.normalMap);
  return /* @__PURE__ */ jsx(
    "meshMatcapMaterial",
    {
      color: config.color,
      opacity: config.opacity ?? 1,
      transparent: config.transparent ?? (config.opacity !== void 0 && config.opacity < 1),
      side: getSide(config.side),
      flatShading: config.flatShading,
      wireframe: config.wireframe,
      matcap,
      map,
      normalMap,
      normalScale: config.normalScale ? new THREE2.Vector2(...config.normalScale) : void 0
    }
  );
}
function useTexture(config) {
  const texture = useLoader(THREE2.TextureLoader, config.url);
  useMemo(() => {
    if (!texture) return;
    if (config.wrapS) {
      texture.wrapS = getWrapMode(config.wrapS);
    }
    if (config.wrapT) {
      texture.wrapT = getWrapMode(config.wrapT);
    }
    if (config.repeat) {
      texture.repeat.set(config.repeat[0], config.repeat[1]);
    }
    if (config.offset) {
      texture.offset.set(config.offset[0], config.offset[1]);
    }
    if (config.rotation !== void 0) {
      texture.rotation = config.rotation;
    }
    texture.needsUpdate = true;
  }, [texture, config]);
  return texture;
}
function useTextureIfDefined(config) {
  const shouldLoad = !!config;
  const texture = shouldLoad ? useLoader(THREE2.TextureLoader, config.url) : void 0;
  useMemo(() => {
    if (!texture || !config) return;
    if (config.wrapS) {
      texture.wrapS = getWrapMode(config.wrapS);
    }
    if (config.wrapT) {
      texture.wrapT = getWrapMode(config.wrapT);
    }
    if (config.repeat) {
      texture.repeat.set(config.repeat[0], config.repeat[1]);
    }
    if (config.offset) {
      texture.offset.set(config.offset[0], config.offset[1]);
    }
    if (config.rotation !== void 0) {
      texture.rotation = config.rotation;
    }
    texture.needsUpdate = true;
  }, [texture, config]);
  return texture;
}
function getSide(side) {
  switch (side) {
    case "front":
      return THREE2.FrontSide;
    case "back":
      return THREE2.BackSide;
    case "double":
      return THREE2.DoubleSide;
    default:
      return THREE2.FrontSide;
  }
}
function getWrapMode(mode) {
  switch (mode) {
    case "repeat":
      return THREE2.RepeatWrapping;
    case "clamp":
      return THREE2.ClampToEdgeWrapping;
    case "mirror":
      return THREE2.MirroredRepeatWrapping;
    default:
      return THREE2.RepeatWrapping;
  }
}
var init_Material = __esm({
  "src/layers/three/Material.tsx"() {
  }
});
function Mesh2({ config, frame }) {
  const meshRef = useRef(null);
  const {
    geometry,
    material,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = [1, 1, 1],
    castShadow = false,
    receiveShadow = false,
    visible = true,
    renderOrder = 0,
    autoRotate
  } = config;
  useEffect(() => {
    if (!meshRef.current || !autoRotate) return;
    const mesh = meshRef.current;
    mesh.rotation.x = rotation[0] + autoRotate[0] * frame;
    mesh.rotation.y = rotation[1] + autoRotate[1] * frame;
    mesh.rotation.z = rotation[2] + autoRotate[2] * frame;
  }, [frame, autoRotate, rotation]);
  return /* @__PURE__ */ jsxs(
    "mesh",
    {
      ref: meshRef,
      position,
      rotation: autoRotate ? void 0 : rotation,
      scale,
      castShadow,
      receiveShadow,
      visible,
      renderOrder,
      children: [
        /* @__PURE__ */ jsx(Geometry, { config: geometry }),
        /* @__PURE__ */ jsx(Material, { config: material })
      ]
    }
  );
}
var init_Mesh = __esm({
  "src/layers/three/Mesh.tsx"() {
    init_Geometry();
    init_Material();
  }
});
function ThreeScene({
  camera,
  lights = [],
  meshes,
  background,
  fog,
  shadows,
  toneMapping,
  frame,
  layerSize
}) {
  const { scene, gl, invalidate } = useThree();
  useEffect(() => {
    invalidate();
  }, [frame, invalidate]);
  useEffect(() => {
    if (!background) {
      scene.background = null;
      return;
    }
    if (typeof background === "string" || typeof background === "number") {
      scene.background = new THREE2.Color(background);
      return;
    }
    scene.background = null;
  }, [background, scene]);
  useEffect(() => {
    if (!fog) {
      scene.fog = null;
      return;
    }
    scene.fog = new THREE2.Fog(
      new THREE2.Color(fog.color).getHex(),
      fog.near,
      fog.far
    );
  }, [fog, scene]);
  useEffect(() => {
    if (!shadows?.enabled) {
      gl.shadowMap.enabled = false;
      return;
    }
    gl.shadowMap.enabled = true;
    switch (shadows.type) {
      case "basic":
        gl.shadowMap.type = THREE2.BasicShadowMap;
        break;
      case "pcf":
        gl.shadowMap.type = THREE2.PCFShadowMap;
        break;
      case "pcfsoft":
        gl.shadowMap.type = THREE2.PCFSoftShadowMap;
        break;
      case "vsm":
        gl.shadowMap.type = THREE2.VSMShadowMap;
        break;
      default:
        gl.shadowMap.type = THREE2.PCFShadowMap;
    }
  }, [shadows, gl]);
  useEffect(() => {
    if (!toneMapping) {
      gl.toneMapping = THREE2.NoToneMapping;
      gl.toneMappingExposure = 1;
      return;
    }
    switch (toneMapping.type) {
      case "none":
        gl.toneMapping = THREE2.NoToneMapping;
        break;
      case "linear":
        gl.toneMapping = THREE2.LinearToneMapping;
        break;
      case "reinhard":
        gl.toneMapping = THREE2.ReinhardToneMapping;
        break;
      case "cineon":
        gl.toneMapping = THREE2.CineonToneMapping;
        break;
      case "aces":
        gl.toneMapping = THREE2.ACESFilmicToneMapping;
        break;
      default:
        gl.toneMapping = THREE2.NoToneMapping;
    }
    gl.toneMappingExposure = toneMapping.exposure ?? 1;
  }, [toneMapping, gl]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Camera, { config: camera, frame, layerSize }),
    /* @__PURE__ */ jsx(Lights, { lights }),
    meshes.map((mesh) => /* @__PURE__ */ jsx(Mesh2, { config: mesh, frame }, mesh.id))
  ] });
}
var init_ThreeScene = __esm({
  "src/layers/three/ThreeScene.tsx"() {
    init_Camera();
    init_Lights();
    init_Mesh();
  }
});
function ThreeLayer({ layer, frame, fps, sceneDuration }) {
  const { style: animationStyle } = useLayerAnimation(layer, frame, fps, sceneDuration);
  const layerStyle = layer.style ? resolveStyle(layer.style) : {};
  const anchor = layer.anchor ?? { x: 0, y: 0 };
  const left = layer.position.x - layer.size.width * anchor.x;
  const top = layer.position.y - layer.size.height * anchor.y;
  const {
    camera,
    lights,
    meshes,
    background,
    fog,
    antialias = true,
    shadows,
    toneMapping
  } = layer.props;
  const canvasProps = {
    gl: {
      alpha: true,
      // Support transparency
      antialias,
      preserveDrawingBuffer: true
      // Required for screenshots/video capture
    },
    shadows: shadows?.enabled ?? false,
    frameloop: "always",
    // Continuous rendering
    dpr: 1,
    // Device pixel ratio - use 1 for consistent rendering
    style: {
      width: "100%",
      height: "100%"
    }
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        position: "absolute",
        left,
        top,
        width: layer.size.width,
        height: layer.size.height,
        transform: layer.rotation ? `rotate(${layer.rotation}deg)` : void 0,
        opacity: layer.opacity ?? 1,
        overflow: "hidden",
        ...layerStyle,
        ...animationStyle
      },
      className: layer.className,
      children: /* @__PURE__ */ jsx(Canvas, { ...canvasProps, children: /* @__PURE__ */ jsx(
        ThreeScene,
        {
          camera,
          lights,
          meshes,
          background,
          fog,
          shadows,
          toneMapping,
          frame,
          layerSize: layer.size
        }
      ) })
    }
  );
}
var init_ThreeLayer = __esm({
  "src/layers/ThreeLayer.tsx"() {
    init_useLayerAnimation();
    init_resolver();
    init_ThreeScene();
  }
});
function LayerRenderer({
  layer,
  frame,
  fps,
  sceneDuration,
  isPlaying = true,
  registry
}) {
  const layerStart = layer.from ?? 0;
  const layerDuration = layer.duration ?? sceneDuration;
  const layerEnd = layerStart + layerDuration;
  if (frame < layerStart || frame >= layerEnd) {
    return null;
  }
  if (layer.hidden) {
    return null;
  }
  const localFrame = frame - layerStart;
  const commonProps = {
    frame: localFrame,
    fps,
    sceneDuration: layerDuration
  };
  switch (layer.type) {
    case "image":
      return /* @__PURE__ */ jsx(ImageLayer, { layer, ...commonProps });
    case "text":
      return /* @__PURE__ */ jsx(TextLayer, { layer, ...commonProps });
    case "video":
      return /* @__PURE__ */ jsx(VideoLayer, { layer, ...commonProps, isPlaying });
    case "shape":
      return /* @__PURE__ */ jsx(ShapeLayer, { layer, ...commonProps });
    case "audio":
      return /* @__PURE__ */ jsx(AudioLayer, { layer, ...commonProps, isPlaying });
    case "group":
      return /* @__PURE__ */ jsx(
        GroupLayer,
        {
          layer,
          ...commonProps,
          isPlaying,
          registry
        }
      );
    case "lottie":
      return /* @__PURE__ */ jsx(LottieLayer, { layer, ...commonProps });
    case "three":
      return /* @__PURE__ */ jsx(ThreeLayer, { layer, ...commonProps });
    case "custom":
      return /* @__PURE__ */ jsx(
        CustomLayer,
        {
          layer,
          ...commonProps,
          registry
        }
      );
    default:
      console.warn(`Unknown layer type: ${layer.type}`);
      return null;
  }
}
var init_LayerRenderer = __esm({
  "src/layers/LayerRenderer.tsx"() {
    init_ImageLayer();
    init_TextLayer();
    init_VideoLayer();
    init_ShapeLayer();
    init_AudioLayer();
    init_GroupLayer();
    init_LottieLayer();
    init_CustomLayer();
    init_ThreeLayer();
  }
});

// src/renderer/SceneRenderer.tsx
var SceneRenderer_exports = {};
__export(SceneRenderer_exports, {
  SceneRenderer: () => SceneRenderer,
  TemplateRenderer: () => TemplateRenderer,
  calculateTotalDuration: () => calculateTotalDuration,
  calculateTotalFrames: () => calculateTotalFrames,
  getSceneAtFrame: () => getSceneAtFrame
});
function getSceneDuration(scene) {
  return scene.endFrame - scene.startFrame;
}
function registryToMap(registry) {
  if (!registry) return void 0;
  const map = /* @__PURE__ */ new Map();
  const components = registry.list();
  for (const info of components) {
    const component = registry.get(info.name);
    if (component) {
      map.set(info.name, component);
    }
  }
  return map;
}
function SceneRenderer({
  scene,
  frame,
  fps,
  width,
  height,
  isPlaying = true,
  registry
}) {
  const sceneDuration = getSceneDuration(scene);
  const registryMap = React8.useMemo(() => registryToMap(registry), [registry]);
  const backgroundStyle = {};
  if (scene.backgroundColor) {
    backgroundStyle.backgroundColor = scene.backgroundColor;
  }
  if (scene.backgroundImage) {
    backgroundStyle.backgroundImage = `url(${scene.backgroundImage})`;
    backgroundStyle.backgroundSize = scene.backgroundFit || "cover";
    backgroundStyle.backgroundPosition = "center";
    backgroundStyle.backgroundRepeat = "no-repeat";
  }
  const sortedLayers = [...scene.layers || []];
  return /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        position: "relative",
        width,
        height,
        overflow: "hidden",
        backgroundColor: "#000000",
        ...backgroundStyle
      },
      children: sortedLayers.map((layer) => /* @__PURE__ */ jsx(
        LayerRenderer,
        {
          layer,
          frame,
          fps,
          sceneDuration,
          isPlaying,
          registry: registryMap
        },
        layer.id
      ))
    }
  );
}
function TemplateRenderer({
  scenes,
  frame,
  fps,
  width,
  height,
  isPlaying = true,
  registry
}) {
  let currentScene = null;
  let nextScene = null;
  let localFrame = frame;
  let transitionProgress = 0;
  let transitionType = null;
  let transitionDirection = void 0;
  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    if (frame >= scene.startFrame && frame < scene.endFrame) {
      currentScene = scene;
      localFrame = frame - scene.startFrame;
      if (scene.transition && scene.transition.duration > 0 && i < scenes.length - 1) {
        const transitionStart = scene.endFrame - scene.transition.duration;
        if (frame >= transitionStart && frame < scene.endFrame) {
          nextScene = scenes[i + 1];
          transitionType = scene.transition.type;
          transitionDirection = scene.transition.direction;
          transitionProgress = (frame - transitionStart) / scene.transition.duration;
        }
      }
      break;
    }
  }
  if (!currentScene && scenes.length > 0) {
    const lastScene = scenes[scenes.length - 1];
    if (frame >= lastScene.endFrame) {
      currentScene = lastScene;
      localFrame = lastScene.endFrame - lastScene.startFrame - 1;
    }
  }
  if (!currentScene) {
    return /* @__PURE__ */ jsx(
      "div",
      {
        style: {
          width,
          height,
          backgroundColor: "#000000"
        }
      }
    );
  }
  if (!nextScene || !transitionType) {
    return /* @__PURE__ */ jsx(
      SceneRenderer,
      {
        scene: currentScene,
        frame: localFrame,
        fps,
        width,
        height,
        isPlaying,
        registry
      }
    );
  }
  const nextLocalFrame = 0;
  return /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        position: "relative",
        width,
        height,
        overflow: "hidden"
      },
      children: /* @__PURE__ */ jsx(
        TransitionRenderer,
        {
          outgoingScene: currentScene,
          incomingScene: nextScene,
          outgoingFrame: localFrame,
          incomingFrame: nextLocalFrame,
          progress: transitionProgress,
          transitionType,
          direction: transitionDirection,
          fps,
          width,
          height,
          isPlaying,
          registry
        }
      )
    }
  );
}
function TransitionRenderer({
  outgoingScene,
  incomingScene,
  outgoingFrame,
  incomingFrame,
  progress,
  transitionType,
  direction = "left",
  fps,
  width,
  height,
  isPlaying,
  registry
}) {
  const getTransitionStyle = () => {
    switch (transitionType) {
      case "fade": {
        return {
          opacity: 1 - progress
        };
      }
      case "slide": {
        const offset = progress * 100;
        if (direction === "left") {
          return { transform: `translateX(-${offset}%)` };
        } else if (direction === "right") {
          return { transform: `translateX(${offset}%)` };
        } else if (direction === "up") {
          return { transform: `translateY(-${offset}%)` };
        } else if (direction === "down") {
          return { transform: `translateY(${offset}%)` };
        }
        return { transform: `translateX(-${offset}%)` };
      }
      case "zoom": {
        const scale = 1 - progress;
        return {
          transform: `scale(${scale})`,
          opacity: scale
        };
      }
      case "wipe": {
        const offset = progress * 100;
        if (direction === "left") {
          return { clipPath: `inset(0 ${offset}% 0 0)` };
        } else if (direction === "right") {
          return { clipPath: `inset(0 0 0 ${offset}%)` };
        } else if (direction === "up") {
          return { clipPath: `inset(0 0 ${offset}% 0)` };
        } else if (direction === "down") {
          return { clipPath: `inset(${offset}% 0 0 0)` };
        }
        return { clipPath: `inset(0 ${offset}% 0 0)` };
      }
      case "rotate": {
        const angle = progress * 90;
        const scale = 1 - progress * 0.5;
        return {
          transform: `rotate(${angle}deg) scale(${scale})`,
          opacity: 1 - progress,
          transformOrigin: "center center"
        };
      }
      case "flip": {
        const angle = progress * 90;
        const isHorizontal = direction === "left" || direction === "right";
        return {
          transform: isHorizontal ? `perspective(1000px) rotateY(${angle}deg)` : `perspective(1000px) rotateX(${angle}deg)`,
          opacity: progress > 0.5 ? 0 : 1,
          transformOrigin: "center center"
        };
      }
      case "blur": {
        const blurAmount = progress * 20;
        return {
          filter: `blur(${blurAmount}px)`,
          opacity: 1 - progress
        };
      }
      case "circle": {
        const radius = 150 * (1 - progress);
        return {
          clipPath: `circle(${radius}% at 50% 50%)`
        };
      }
      case "push": {
        const offset = progress * 100;
        if (direction === "left") {
          return { transform: `translateX(-${offset}%)` };
        } else if (direction === "right") {
          return { transform: `translateX(${offset}%)` };
        } else if (direction === "up") {
          return { transform: `translateY(-${offset}%)` };
        } else if (direction === "down") {
          return { transform: `translateY(${offset}%)` };
        }
        return { transform: `translateX(-${offset}%)` };
      }
      case "crosszoom": {
        const scale = 1 + progress * 0.5;
        return {
          transform: `scale(${scale})`,
          opacity: 1 - progress
        };
      }
      case "glitch": {
        const seed = Math.floor(progress * 100);
        const offsetX = (seed * 9301 + 49297) % 233280 / 233280 * 20 - 10;
        const offsetY = (seed * 421 + 2038074743) % 2147483647 / 2147483647 * 20 - 10;
        return {
          transform: `translate(${offsetX}px, ${offsetY}px)`,
          opacity: 1 - progress,
          filter: progress > 0.3 ? `hue-rotate(${progress * 360}deg)` : "none"
        };
      }
      case "dissolve": {
        const pixelSize = Math.floor(progress * 20);
        return {
          filter: pixelSize > 0 ? `blur(${pixelSize}px)` : "none",
          opacity: 1 - progress
        };
      }
      case "cube": {
        const angle = progress * 90;
        const isHorizontal = direction === "left" || direction === "right";
        const rotateDir = direction === "left" || direction === "up" ? -1 : 1;
        return {
          transform: isHorizontal ? `perspective(2000px) rotateY(${angle * rotateDir}deg) translateZ(-500px)` : `perspective(2000px) rotateX(${angle * rotateDir}deg) translateZ(-500px)`,
          transformOrigin: "center center",
          opacity: progress > 0.5 ? 0 : 1
        };
      }
      case "swirl": {
        const angle = progress * 180;
        const scale = 1 - progress;
        return {
          transform: `rotate(${angle}deg) scale(${scale})`,
          opacity: 1 - progress,
          filter: `blur(${progress * 10}px)`
        };
      }
      case "diagonal-wipe": {
        const offset = progress * 150;
        if (direction === "left") {
          return { clipPath: `polygon(0 0, ${100 - offset}% 0, 0 ${100 - offset}%, 0 0)` };
        } else if (direction === "right") {
          return { clipPath: `polygon(100% 0, 100% ${100 - offset}%, ${offset}% 100%, 100% 100%, 100% 0)` };
        }
        return { clipPath: `polygon(0 0, ${100 - offset}% 0, 0 ${100 - offset}%, 0 0)` };
      }
      case "iris": {
        const radius = 100 * (1 - progress);
        return {
          clipPath: `circle(${radius}% at 50% 50%)`
        };
      }
      case "cut":
      default:
        return progress > 0.5 ? { opacity: 0 } : {};
    }
  };
  const getIncomingStyle = () => {
    switch (transitionType) {
      case "fade": {
        return {
          opacity: progress
        };
      }
      case "slide": {
        const offset = (1 - progress) * 100;
        if (direction === "left") {
          return { transform: `translateX(${offset}%)` };
        } else if (direction === "right") {
          return { transform: `translateX(-${offset}%)` };
        } else if (direction === "up") {
          return { transform: `translateY(${offset}%)` };
        } else if (direction === "down") {
          return { transform: `translateY(-${offset}%)` };
        }
        return { transform: `translateX(${offset}%)` };
      }
      case "zoom": {
        const scale = progress;
        return {
          transform: `scale(${scale})`,
          opacity: scale
        };
      }
      case "wipe": {
        return {};
      }
      case "rotate": {
        const angle = (1 - progress) * -90;
        const scale = 0.5 + progress * 0.5;
        return {
          transform: `rotate(${angle}deg) scale(${scale})`,
          opacity: progress,
          transformOrigin: "center center"
        };
      }
      case "flip": {
        const angle = (1 - progress) * -90;
        const isHorizontal = direction === "left" || direction === "right";
        return {
          transform: isHorizontal ? `perspective(1000px) rotateY(${angle}deg)` : `perspective(1000px) rotateX(${angle}deg)`,
          opacity: progress > 0.5 ? 1 : 0,
          transformOrigin: "center center"
        };
      }
      case "blur": {
        const blurAmount = (1 - progress) * 20;
        return {
          filter: `blur(${blurAmount}px)`,
          opacity: progress
        };
      }
      case "circle": {
        const radius = 150 * progress;
        return {
          clipPath: `circle(${radius}% at 50% 50%)`
        };
      }
      case "push": {
        const offset = (1 - progress) * 100;
        if (direction === "left") {
          return { transform: `translateX(${offset}%)` };
        } else if (direction === "right") {
          return { transform: `translateX(-${offset}%)` };
        } else if (direction === "up") {
          return { transform: `translateY(${offset}%)` };
        } else if (direction === "down") {
          return { transform: `translateY(-${offset}%)` };
        }
        return { transform: `translateX(${offset}%)` };
      }
      case "crosszoom": {
        const scale = 0.5 + progress * 0.5;
        return {
          transform: `scale(${scale})`,
          opacity: progress
        };
      }
      case "glitch": {
        const seed = Math.floor(progress * 100);
        const offsetX = (seed * 9301 + 49297) % 233280 / 233280 * 20 - 10;
        const offsetY = (seed * 421 + 2038074743) % 2147483647 / 2147483647 * 20 - 10;
        return {
          transform: progress > 0.7 ? `translate(${offsetX}px, ${offsetY}px)` : "none",
          opacity: progress
        };
      }
      case "dissolve": {
        const pixelSize = Math.floor((1 - progress) * 20);
        return {
          filter: pixelSize > 0 ? `blur(${pixelSize}px)` : "none",
          opacity: progress
        };
      }
      case "cube": {
        const angle = (1 - progress) * -90;
        const isHorizontal = direction === "left" || direction === "right";
        const rotateDir = direction === "left" || direction === "up" ? -1 : 1;
        return {
          transform: isHorizontal ? `perspective(2000px) rotateY(${angle * rotateDir}deg) translateZ(-500px)` : `perspective(2000px) rotateX(${angle * rotateDir}deg) translateZ(-500px)`,
          transformOrigin: "center center",
          opacity: progress > 0.5 ? 1 : 0
        };
      }
      case "swirl": {
        const angle = (1 - progress) * -180;
        const scale = progress;
        return {
          transform: `rotate(${angle}deg) scale(${scale})`,
          opacity: progress,
          filter: `blur(${(1 - progress) * 10}px)`
        };
      }
      case "diagonal-wipe": {
        const offset = (1 - progress) * 150;
        if (direction === "left") {
          return { clipPath: `polygon(100% 100%, ${offset}% 100%, 100% ${offset}%, 100% 100%)` };
        } else if (direction === "right") {
          return { clipPath: `polygon(0 100%, 0 ${offset}%, ${100 - offset}% 100%, 0 100%)` };
        }
        return { clipPath: `polygon(100% 100%, ${offset}% 100%, 100% ${offset}%, 100% 100%)` };
      }
      case "iris": {
        const radius = 100 * progress;
        return {
          clipPath: `circle(${radius}% at 50% 50%)`
        };
      }
      case "cut":
      default:
        return progress > 0.5 ? {} : { opacity: 0 };
    }
  };
  const needsOutgoingOnTop = transitionType === "wipe" || transitionType === "diagonal-wipe";
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        style: {
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: needsOutgoingOnTop ? 0 : 1,
          ...getIncomingStyle()
        },
        children: /* @__PURE__ */ jsx(
          SceneRenderer,
          {
            scene: incomingScene,
            frame: incomingFrame,
            fps,
            width,
            height,
            isPlaying,
            registry
          }
        )
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        style: {
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: needsOutgoingOnTop ? 1 : 0,
          ...getTransitionStyle()
        },
        children: /* @__PURE__ */ jsx(
          SceneRenderer,
          {
            scene: outgoingScene,
            frame: outgoingFrame,
            fps,
            width,
            height,
            isPlaying,
            registry
          }
        )
      }
    )
  ] });
}
function calculateTotalDuration(scenes) {
  if (scenes.length === 0) return 0;
  const lastScene = scenes[scenes.length - 1];
  return lastScene.endFrame / 30;
}
function calculateTotalFrames(scenes, _fps) {
  if (scenes.length === 0) return 0;
  const lastScene = scenes[scenes.length - 1];
  return lastScene.endFrame;
}
function getSceneAtFrame(scenes, frame, _fps) {
  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    if (frame >= scene.startFrame && frame < scene.endFrame) {
      return {
        scene,
        localFrame: frame - scene.startFrame,
        sceneIndex: i
      };
    }
  }
  if (scenes.length > 0) {
    const lastScene = scenes[scenes.length - 1];
    if (frame >= lastScene.endFrame) {
      return {
        scene: lastScene,
        localFrame: lastScene.endFrame - lastScene.startFrame - 1,
        sceneIndex: scenes.length - 1
      };
    }
  }
  return null;
}
var init_SceneRenderer = __esm({
  "src/renderer/SceneRenderer.tsx"() {
    init_LayerRenderer();
  }
});

// src/renderer/BrowserRenderer.tsx
init_SceneRenderer();
function createFrameCapturer() {
  async function captureFrame(options) {
    const startTime = performance.now();
    const canvas = await html2canvas(options.element, {
      width: options.width,
      height: options.height,
      backgroundColor: options.backgroundColor ?? null,
      scale: options.scale ?? 1,
      useCORS: options.useCORS ?? true,
      proxy: options.proxy,
      logging: false,
      allowTaint: false,
      foreignObjectRendering: false,
      // Optimize for video rendering
      imageTimeout: 15e3,
      removeContainer: true
    });
    const captureTime = performance.now() - startTime;
    return { canvas, captureTime };
  }
  async function captureFrameData(options) {
    const { canvas } = await captureFrame(options);
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get 2D context from canvas");
    }
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  }
  async function captureFrameBlob(options, format = "image/png", quality = 0.95) {
    const { canvas } = await captureFrame(options);
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to create blob from canvas"));
          }
        },
        format,
        quality
      );
    });
  }
  async function captureFrameDataURL(options, format = "image/png", quality = 0.95) {
    const { canvas } = await captureFrame(options);
    return canvas.toDataURL(format, quality);
  }
  return {
    captureFrame,
    captureFrameData,
    captureFrameBlob,
    captureFrameDataURL
  };
}
function createOffscreenCapturer() {
  const supportsOffscreen = typeof OffscreenCanvas !== "undefined";
  if (!supportsOffscreen) {
    console.error("OffscreenCanvas not supported, falling back to regular canvas");
    return createFrameCapturer();
  }
  return createFrameCapturer();
}

// src/encoder/webcodecs.ts
function isWebCodecsSupported() {
  return typeof VideoEncoder !== "undefined" && typeof VideoFrame !== "undefined" && typeof EncodedVideoChunk !== "undefined";
}
function getRecommendedCodec(width, height) {
  if (width <= 1920 && height <= 1080) {
    return "avc1.42001f";
  }
  if (width <= 3840 && height <= 2160) {
    return "avc1.640028";
  }
  return "vp09.00.10.08";
}
function createWebCodecsEncoder(options) {
  const {
    width,
    height,
    fps,
    bitrate = width * height * fps * 0.1,
    // ~10% of raw bitrate
    codec = getRecommendedCodec(width, height),
    hardwareAcceleration = "prefer-hardware",
    latencyMode = "quality"
  } = options;
  const chunks = [];
  let encoder = null;
  let frameCount = 0;
  const frameDuration = Math.floor(1e6 / fps);
  const config = {
    codec,
    width,
    height,
    bitrate,
    framerate: fps,
    hardwareAcceleration,
    latencyMode,
    avc: codec.startsWith("avc1") ? { format: "annexb" } : void 0
  };
  function isSupported() {
    return isWebCodecsSupported();
  }
  async function initialize() {
    if (!isSupported()) {
      throw new Error("WebCodecs is not supported in this browser");
    }
    const support = await VideoEncoder.isConfigSupported(config);
    if (!support.supported) {
      throw new Error(`Codec ${codec} is not supported with the given configuration`);
    }
    encoder = new VideoEncoder({
      output: (chunk, metadata) => {
        const data = new Uint8Array(chunk.byteLength);
        chunk.copyTo(data);
        chunks.push({
          data,
          timestamp: chunk.timestamp,
          duration: chunk.duration ?? frameDuration,
          isKeyframe: chunk.type === "key"
        });
      },
      error: (error) => {
        console.error("VideoEncoder error:", error);
      }
    });
    encoder.configure(config);
  }
  async function encodeFrame(frame, timestamp) {
    if (!encoder) {
      throw new Error("Encoder not initialized");
    }
    let videoFrame;
    if (frame instanceof VideoFrame) {
      videoFrame = frame;
    } else {
      if (frame instanceof HTMLCanvasElement) {
        const ctx = frame.getContext("2d");
        if (!ctx) {
          throw new Error(
            "Cannot create VideoFrame: canvas has no 2D context. This can happen if the canvas was created with a different context type (e.g., WebGL)."
          );
        }
      }
      videoFrame = new VideoFrame(frame, {
        timestamp: timestamp * 1e3,
        // Convert ms to microseconds
        duration: frameDuration
      });
    }
    const isKeyframe = frameCount % (fps * 2) === 0;
    encoder.encode(videoFrame, { keyFrame: isKeyframe });
    videoFrame.close();
    frameCount++;
  }
  async function flush() {
    if (!encoder) {
      throw new Error("Encoder not initialized");
    }
    await encoder.flush();
  }
  function getChunks() {
    return [...chunks];
  }
  function close() {
    if (encoder) {
      encoder.close();
      encoder = null;
    }
    chunks.length = 0;
    frameCount = 0;
  }
  function getConfig() {
    return { ...config };
  }
  return {
    isSupported,
    initialize,
    encodeFrame,
    flush,
    getChunks,
    close,
    getConfig
  };
}
function canvasToVideoFrame(canvas, timestamp, fps) {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error(
      "Cannot create VideoFrame: canvas has no 2D context. Ensure the canvas was not previously used with a WebGL context."
    );
  }
  const frameDuration = Math.floor(1e6 / fps);
  return new VideoFrame(canvas, {
    timestamp: timestamp * 1e3,
    // Convert ms to microseconds
    duration: frameDuration
  });
}
function createMp4Muxer(options) {
  const {
    width,
    height,
    fps,
    videoCodec = "avc",
    audioSampleRate,
    audioChannels
  } = options;
  const target = new ArrayBufferTarget();
  const muxerConfig = {
    target,
    video: {
      codec: videoCodec,
      width,
      height
    },
    fastStart: "in-memory",
    firstTimestampBehavior: "offset"
  };
  if (audioSampleRate && audioChannels) {
    muxerConfig.audio = {
      codec: "aac",
      numberOfChannels: audioChannels,
      sampleRate: audioSampleRate
    };
  }
  const muxer = new Muxer(muxerConfig);
  let totalVideoBytes = 0;
  let totalAudioBytes = 0;
  function addVideoChunk(chunk) {
    muxer.addVideoChunk(
      {
        type: chunk.isKeyframe ? "key" : "delta",
        timestamp: chunk.timestamp,
        duration: chunk.duration,
        data: chunk.data,
        byteLength: chunk.data.byteLength,
        copyTo: (dest) => {
          new Uint8Array(dest).set(chunk.data);
        }
      },
      void 0,
      chunk.timestamp
    );
    totalVideoBytes += chunk.data.byteLength;
  }
  function addAudioChunk(chunk) {
    muxer.addAudioChunk(
      {
        type: "key",
        // Audio chunks are typically all keyframes
        timestamp: chunk.timestamp,
        duration: chunk.duration,
        data: chunk.data,
        byteLength: chunk.data.byteLength,
        copyTo: (dest) => {
          new Uint8Array(dest).set(chunk.data);
        }
      },
      void 0,
      chunk.timestamp
    );
    totalAudioBytes += chunk.data.byteLength;
  }
  function finalize() {
    muxer.finalize();
    return new Uint8Array(target.buffer);
  }
  function getEstimatedSize() {
    return Math.ceil((totalVideoBytes + totalAudioBytes) * 1.1);
  }
  return {
    addVideoChunk,
    addAudioChunk,
    finalize,
    getEstimatedSize
  };
}
function createWebMMuxer(_options) {
  const videoChunks = [];
  const audioChunks = [];
  function addVideoChunk(chunk) {
    videoChunks.push(chunk);
  }
  function addAudioChunk(chunk) {
    audioChunks.push(chunk);
  }
  function finalize() {
    const totalSize = videoChunks.reduce((sum, c) => sum + c.data.byteLength, 0);
    const result = new Uint8Array(totalSize);
    let offset = 0;
    for (const chunk of videoChunks) {
      result.set(chunk.data, offset);
      offset += chunk.data.byteLength;
    }
    return result;
  }
  function getEstimatedSize() {
    const videoSize = videoChunks.reduce((sum, c) => sum + c.data.byteLength, 0);
    const audioSize = audioChunks.reduce((sum, c) => sum + c.data.byteLength, 0);
    return Math.ceil((videoSize + audioSize) * 1.1);
  }
  return {
    addVideoChunk,
    addAudioChunk,
    finalize,
    getEstimatedSize
  };
}
async function blobToArrayBuffer(blob) {
  return blob.arrayBuffer();
}
function arrayBufferToBlob(buffer, mimeType) {
  return new Blob([buffer], { type: mimeType });
}
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
function downloadArrayBuffer(buffer, filename, mimeType) {
  const blob = arrayBufferToBlob(buffer, mimeType);
  downloadBlob(blob, filename);
}
var BrowserRenderer = class {
  options;
  container;
  root = null;
  isRendering = false;
  registry;
  processor;
  constructor(options = {}) {
    this.options = options;
    this.container = options.container || this.createContainer();
    this.registry = options.registry || getDefaultRegistry();
    this.processor = new TemplateProcessor();
  }
  createContainer() {
    const container = document.createElement("div");
    container.style.cssText = `
      position: fixed;
      left: -9999px;
      top: -9999px;
      pointer-events: none;
      visibility: hidden;
    `;
    document.body.appendChild(container);
    return container;
  }
  /**
   * Get the component registry.
   */
  getRegistry() {
    return this.registry;
  }
  /**
   * Register a custom component.
   */
  registerComponent(name, component) {
    this.registry.register(name, component);
  }
  /**
   * Check if WebCodecs is supported for high-quality encoding.
   */
  isWebCodecsSupported() {
    return isWebCodecsSupported();
  }
  /**
   * Render a template to video.
   */
  async renderVideo(options) {
    if (this.isRendering) {
      throw new Error("Renderer is already rendering");
    }
    this.isRendering = true;
    try {
      const { template, inputs = {}, format = "mp4", bitrate, onProgress, onFrame } = options;
      await this.processor.loadCustomComponents(template, this.registry);
      const processedTemplate = this.processor.resolveInputs(template, inputs);
      await this.loadFonts(processedTemplate);
      const { width, height, fps = 30 } = processedTemplate.output;
      const scenes = processedTemplate.composition.scenes;
      const totalFrames = calculateTotalFrames(scenes, fps);
      const duration = totalFrames / fps;
      const renderContainer = document.createElement("div");
      renderContainer.style.cssText = `
        width: ${width}px;
        height: ${height}px;
        overflow: hidden;
      `;
      this.container.appendChild(renderContainer);
      this.root = createRoot(renderContainer);
      const capturer = createFrameCapturer();
      const useWebCodecs = this.options.preferWebCodecs !== false && isWebCodecsSupported();
      let result;
      if (useWebCodecs && format === "mp4") {
        result = await this.renderWithWebCodecs(
          scenes,
          renderContainer,
          { width, height, fps, totalFrames, duration, bitrate },
          capturer,
          onProgress,
          onFrame
        );
      } else {
        result = await this.renderWithMediaRecorder(
          scenes,
          renderContainer,
          { width, height, fps, totalFrames, duration },
          capturer,
          onProgress,
          onFrame
        );
      }
      this.root.unmount();
      this.root = null;
      this.container.removeChild(renderContainer);
      return result;
    } finally {
      this.isRendering = false;
    }
  }
  async renderWithWebCodecs(scenes, container, config, capturer, onProgress, onFrame) {
    const { width, height, fps, totalFrames, duration, bitrate } = config;
    const encoder = createWebCodecsEncoder({
      width,
      height,
      fps,
      bitrate
    });
    await encoder.initialize();
    const muxer = createMp4Muxer({
      width,
      height,
      fps
    });
    performance.now();
    const frameTimes = [];
    for (let frame = 0; frame < totalFrames; frame++) {
      const frameStartTime = performance.now();
      await this.renderFrame(scenes, frame, fps, width, height);
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const { canvas } = await capturer.captureFrame({
        element: container,
        width,
        height
      });
      const timestamp = frame / fps * 1e3;
      await encoder.encodeFrame(canvas, timestamp);
      frameTimes.push(performance.now() - frameStartTime);
      if (frameTimes.length > 10) frameTimes.shift();
      const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
      const remainingFrames = totalFrames - frame - 1;
      const estimatedTimeRemaining = remainingFrames * avgFrameTime / 1e3;
      onProgress?.({
        currentFrame: frame,
        totalFrames,
        percentage: (frame + 1) / totalFrames * 100,
        phase: "capturing",
        estimatedTimeRemaining
      });
      onFrame?.(frame, totalFrames);
    }
    onProgress?.({
      currentFrame: totalFrames,
      totalFrames,
      percentage: 100,
      phase: "encoding"
    });
    await encoder.flush();
    onProgress?.({
      currentFrame: totalFrames,
      totalFrames,
      percentage: 100,
      phase: "muxing"
    });
    for (const chunk of encoder.getChunks()) {
      muxer.addVideoChunk(chunk);
    }
    const videoData = muxer.finalize();
    encoder.close();
    const blob = new Blob([videoData], { type: "video/mp4" });
    onProgress?.({
      currentFrame: totalFrames,
      totalFrames,
      percentage: 100,
      phase: "complete"
    });
    return {
      blob,
      duration,
      frameCount: totalFrames,
      size: blob.size,
      mimeType: "video/mp4"
    };
  }
  async renderWithMediaRecorder(scenes, container, config, capturer, onProgress, onFrame) {
    const { width, height, fps, totalFrames, duration } = config;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get 2D context from canvas for MediaRecorder export");
    }
    const stream = canvas.captureStream(fps);
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "video/webm;codecs=vp9",
      videoBitsPerSecond: width * height * fps * 0.1
    });
    const chunks = [];
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };
    const recordingComplete = new Promise((resolve) => {
      mediaRecorder.onstop = () => {
        resolve(new Blob(chunks, { type: "video/webm" }));
      };
    });
    mediaRecorder.start(100);
    const frameTimes = [];
    for (let frame = 0; frame < totalFrames; frame++) {
      const frameStartTime = performance.now();
      await this.renderFrame(scenes, frame, fps, width, height);
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const { canvas: capturedCanvas } = await capturer.captureFrame({
        element: container,
        width,
        height
      });
      ctx.drawImage(capturedCanvas, 0, 0);
      const targetFrameTime = 1e3 / fps;
      const elapsed = performance.now() - frameStartTime;
      if (elapsed < targetFrameTime) {
        await new Promise((resolve) => setTimeout(resolve, targetFrameTime - elapsed));
      }
      frameTimes.push(performance.now() - frameStartTime);
      if (frameTimes.length > 10) frameTimes.shift();
      const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
      const remainingFrames = totalFrames - frame - 1;
      const estimatedTimeRemaining = remainingFrames * avgFrameTime / 1e3;
      onProgress?.({
        currentFrame: frame,
        totalFrames,
        percentage: (frame + 1) / totalFrames * 100,
        phase: "capturing",
        estimatedTimeRemaining
      });
      onFrame?.(frame, totalFrames);
    }
    mediaRecorder.stop();
    const blob = await recordingComplete;
    onProgress?.({
      currentFrame: totalFrames,
      totalFrames,
      percentage: 100,
      phase: "complete"
    });
    return {
      blob,
      duration,
      frameCount: totalFrames,
      size: blob.size,
      mimeType: "video/webm"
    };
  }
  renderFrame(scenes, frame, fps, width, height) {
    return new Promise((resolve) => {
      if (!this.root) {
        resolve();
        return;
      }
      this.root.render(
        /* @__PURE__ */ jsx(
          TemplateRenderer,
          {
            scenes,
            frame,
            fps,
            width,
            height,
            isPlaying: false,
            registry: this.registry
          }
        )
      );
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          resolve();
        });
      });
    });
  }
  /**
   * Render a single frame as an image.
   */
  async renderImage(options) {
    if (this.isRendering) {
      throw new Error("Renderer is already rendering");
    }
    this.isRendering = true;
    try {
      const {
        template,
        inputs = {},
        sceneIndex = 0,
        frame = 0,
        format = "png",
        quality = 0.95
      } = options;
      await this.processor.loadCustomComponents(template, this.registry);
      const processedTemplate = this.processor.resolveInputs(template, inputs);
      await this.loadFonts(processedTemplate);
      const { width, height, fps = 30 } = processedTemplate.output;
      const scenes = processedTemplate.composition.scenes;
      if (sceneIndex >= scenes.length) {
        throw new Error(`Scene index ${sceneIndex} out of range`);
      }
      const renderContainer = document.createElement("div");
      renderContainer.style.cssText = `
        width: ${width}px;
        height: ${height}px;
        overflow: hidden;
      `;
      this.container.appendChild(renderContainer);
      this.root = createRoot(renderContainer);
      const scene = scenes[sceneIndex];
      const { SceneRenderer: SceneRenderer2 } = await Promise.resolve().then(() => (init_SceneRenderer(), SceneRenderer_exports));
      await new Promise((resolve) => {
        this.root.render(
          /* @__PURE__ */ jsx(
            SceneRenderer2,
            {
              scene,
              frame,
              fps,
              width,
              height,
              isPlaying: false,
              registry: this.registry
            }
          )
        );
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            resolve();
          });
        });
      });
      const capturer = createFrameCapturer();
      const mimeType = `image/${format}`;
      const blob = await capturer.captureFrameBlob(
        {
          element: renderContainer,
          width,
          height
        },
        mimeType,
        quality
      );
      this.root.unmount();
      this.root = null;
      this.container.removeChild(renderContainer);
      return {
        blob,
        width,
        height,
        size: blob.size,
        mimeType
      };
    } finally {
      this.isRendering = false;
    }
  }
  /**
   * Load fonts from template configuration.
   *
   * @private
   */
  async loadFonts(template) {
    if (!template.fonts) {
      return;
    }
    const fontManager = new FontManager();
    try {
      const result = await fontManager.loadFonts(template.fonts);
      if (result.loaded.length > 0) {
        console.log(`[BrowserRenderer] Loaded ${result.loaded.length} fonts in ${result.loadTime}ms`);
        result.loaded.forEach((font) => {
          console.log(`  - ${font.family} ${font.weight || 400} ${font.style || "normal"}`);
        });
      }
      if (result.failed.length > 0) {
        console.warn(`[BrowserRenderer] Failed to load ${result.failed.length} fonts, using fallbacks`);
        result.failed.forEach((font) => {
          console.warn(`  - ${font.family} ${font.weight || 400} ${font.style || "normal"}`);
        });
      }
    } catch (error) {
      console.warn("[BrowserRenderer] Font loading failed, using fallbacks:", error);
    }
  }
  /**
   * Dispose of the renderer and clean up resources.
   */
  dispose() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
    if (this.container && this.container.parentNode && !this.options.container) {
      this.container.parentNode.removeChild(this.container);
    }
  }
};
function createBrowserRenderer(options) {
  return new BrowserRenderer(options);
}

// src/renderer/index.ts
init_SceneRenderer();

// src/layers/index.ts
init_ImageLayer();
init_TextLayer();
init_VideoLayer();
init_ShapeLayer();
init_AudioLayer();
init_GroupLayer();
init_LottieLayer();
init_CustomLayer();
init_ThreeLayer();
init_LayerRenderer();

// src/index.ts
init_useLayerAnimation();
init_resolver();

// src/encoder/mediarecorder.ts
function getBestMimeType() {
  const types = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8,opus",
    "video/webm;codecs=vp8",
    "video/webm",
    "video/mp4;codecs=avc1,mp4a.40.2",
    "video/mp4"
  ];
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return "video/webm";
}
function isMediaRecorderSupported() {
  return typeof MediaRecorder !== "undefined";
}
function createMediaRecorderEncoder(options) {
  const {
    canvas,
    fps,
    videoBitrate = 5e6,
    audioBitrate = 128e3,
    mimeType = getBestMimeType(),
    audioTracks = []
  } = options;
  let mediaRecorder = null;
  let stream = null;
  const chunks = [];
  function isSupported() {
    return isMediaRecorderSupported() && MediaRecorder.isTypeSupported(mimeType);
  }
  function createStream() {
    const videoStream = canvas.captureStream(fps);
    const combinedStream = new MediaStream();
    for (const track of videoStream.getVideoTracks()) {
      combinedStream.addTrack(track);
    }
    for (const track of audioTracks) {
      combinedStream.addTrack(track);
    }
    return combinedStream;
  }
  function start() {
    if (mediaRecorder) {
      throw new Error("Recording already in progress");
    }
    stream = createStream();
    mediaRecorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: videoBitrate,
      audioBitsPerSecond: audioBitrate
    });
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };
    mediaRecorder.start(100);
  }
  function stop() {
    return new Promise((resolve, reject) => {
      if (!mediaRecorder) {
        reject(new Error("No recording in progress"));
        return;
      }
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        chunks.length = 0;
        if (stream) {
          for (const track of stream.getTracks()) {
            track.stop();
          }
          stream = null;
        }
        mediaRecorder = null;
        resolve(blob);
      };
      mediaRecorder.onerror = (event) => {
        reject(new Error(`MediaRecorder error: ${event}`));
      };
      mediaRecorder.stop();
    });
  }
  function pause() {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.pause();
    }
  }
  function resume() {
    if (mediaRecorder && mediaRecorder.state === "paused") {
      mediaRecorder.resume();
    }
  }
  function getState() {
    return mediaRecorder?.state ?? "inactive";
  }
  function addAudioTrack(track) {
    if (stream) {
      stream.addTrack(track);
    } else {
      audioTracks.push(track);
    }
  }
  return {
    isSupported,
    start,
    stop,
    pause,
    resume,
    getState,
    addAudioTrack
  };
}
function createFrameByFrameRecorder(options) {
  const { frameMimeType = "image/webp", frameQuality = 0.9 } = options;
  const frames = [];
  async function addFrame(canvas) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            frames.push(blob);
            resolve();
          } else {
            reject(new Error("Failed to create frame blob"));
          }
        },
        frameMimeType,
        frameQuality
      );
    });
  }
  function getFrames() {
    return [...frames];
  }
  function getFrameCount() {
    return frames.length;
  }
  function clear() {
    frames.length = 0;
  }
  return {
    addFrame,
    getFrames,
    getFrameCount,
    clear
  };
}

// src/encoder/gif-encoder.ts
function createGifEncoder(options) {
  const { width, height, fps, quality = 10 } = options;
  const delay = Math.round(100 / fps);
  const sampleInterval = Math.max(1, Math.min(30, quality));
  const outputData = [];
  let frameIndex = 0;
  function writeByte(b) {
    outputData.push(b & 255);
  }
  function writeShort(s) {
    writeByte(s & 255);
    writeByte(s >> 8 & 255);
  }
  function writeString(s) {
    for (let i = 0; i < s.length; i++) {
      outputData.push(s.charCodeAt(i));
    }
  }
  function computeBox(colors) {
    let rMin = 255, rMax = 0, gMin = 255, gMax = 0, bMin = 255, bMax = 0;
    for (let i = 0; i < colors.length; i++) {
      const c = colors[i];
      if (c[0] < rMin) rMin = c[0];
      if (c[0] > rMax) rMax = c[0];
      if (c[1] < gMin) gMin = c[1];
      if (c[1] > gMax) gMax = c[1];
      if (c[2] < bMin) bMin = c[2];
      if (c[2] > bMax) bMax = c[2];
    }
    return { colors, rMin, rMax, gMin, gMax, bMin, bMax };
  }
  function splitBox(box) {
    const rRange = box.rMax - box.rMin;
    const gRange = box.gMax - box.gMin;
    const bRange = box.bMax - box.bMin;
    let sortIndex;
    if (rRange >= gRange && rRange >= bRange) {
      sortIndex = 0;
    } else if (gRange >= rRange && gRange >= bRange) {
      sortIndex = 1;
    } else {
      sortIndex = 2;
    }
    box.colors.sort((a, b) => a[sortIndex] - b[sortIndex]);
    const mid = Math.floor(box.colors.length / 2);
    return [
      computeBox(box.colors.slice(0, mid)),
      computeBox(box.colors.slice(mid))
    ];
  }
  function medianCut(pixels, numColors, sample) {
    const colors = [];
    for (let i = 0; i < pixels.length; i += 4 * sample) {
      colors.push([pixels[i], pixels[i + 1], pixels[i + 2]]);
    }
    if (colors.length === 0) {
      const palette2 = [];
      for (let i = 0; i < numColors; i++) {
        palette2.push([0, 0, 0]);
      }
      return palette2;
    }
    let boxes = [computeBox(colors)];
    while (boxes.length < numColors) {
      let maxVolume = -1;
      let maxIndex = 0;
      for (let i = 0; i < boxes.length; i++) {
        const b2 = boxes[i];
        if (b2.colors.length < 2) continue;
        const volume = (b2.rMax - b2.rMin) * (b2.gMax - b2.gMin) * (b2.bMax - b2.bMin);
        if (volume > maxVolume) {
          maxVolume = volume;
          maxIndex = i;
        }
      }
      if (maxVolume <= 0 || boxes[maxIndex].colors.length < 2) break;
      const [a, b] = splitBox(boxes[maxIndex]);
      boxes.splice(maxIndex, 1, a, b);
    }
    const palette = [];
    for (const box of boxes) {
      let rSum = 0, gSum = 0, bSum = 0;
      for (const c of box.colors) {
        rSum += c[0];
        gSum += c[1];
        bSum += c[2];
      }
      const n = box.colors.length;
      palette.push([
        Math.round(rSum / n),
        Math.round(gSum / n),
        Math.round(bSum / n)
      ]);
    }
    while (palette.length < numColors) {
      palette.push([0, 0, 0]);
    }
    return palette;
  }
  function findClosestColor(palette, r, g, b) {
    let minDist = Infinity;
    let minIndex = 0;
    for (let i = 0; i < palette.length; i++) {
      const pr = palette[i][0];
      const pg = palette[i][1];
      const pb = palette[i][2];
      const dist = (r - pr) * (r - pr) + (g - pg) * (g - pg) + (b - pb) * (b - pb);
      if (dist < minDist) {
        minDist = dist;
        minIndex = i;
        if (dist === 0) break;
      }
    }
    return minIndex;
  }
  function indexPixels(pixels, palette) {
    const numPixels = pixels.length / 4;
    const indexed = new Uint8Array(numPixels);
    for (let i = 0; i < numPixels; i++) {
      const offset = i * 4;
      indexed[i] = findClosestColor(
        palette,
        pixels[offset],
        pixels[offset + 1],
        pixels[offset + 2]
      );
    }
    return indexed;
  }
  function lzwEncode(indexedPixels, colorDepth) {
    const minCodeSize = Math.max(2, colorDepth);
    const clearCode = 1 << minCodeSize;
    const eoiCode = clearCode + 1;
    let codeSize = minCodeSize + 1;
    let nextCode = eoiCode + 1;
    const maxCodeSize = 12;
    const maxCode = 1 << maxCodeSize;
    const codeTable = /* @__PURE__ */ new Map();
    function initTable() {
      codeTable.clear();
      for (let i = 0; i < clearCode; i++) {
        codeTable.set(String(i), i);
      }
      nextCode = eoiCode + 1;
      codeSize = minCodeSize + 1;
    }
    const output = [];
    let bitBuffer = 0;
    let bitCount = 0;
    function emitCode(code) {
      bitBuffer |= code << bitCount;
      bitCount += codeSize;
      while (bitCount >= 8) {
        output.push(bitBuffer & 255);
        bitBuffer >>= 8;
        bitCount -= 8;
      }
    }
    initTable();
    emitCode(clearCode);
    if (indexedPixels.length === 0) {
      emitCode(eoiCode);
      if (bitCount > 0) {
        output.push(bitBuffer & 255);
      }
      return output;
    }
    let current = String(indexedPixels[0]);
    for (let i = 1; i < indexedPixels.length; i++) {
      const pixel = indexedPixels[i];
      const combined = current + "," + pixel;
      if (codeTable.has(combined)) {
        current = combined;
      } else {
        emitCode(codeTable.get(current));
        if (nextCode < maxCode) {
          codeTable.set(combined, nextCode);
          nextCode++;
          if (nextCode > 1 << codeSize && codeSize < maxCodeSize) {
            codeSize++;
          }
        } else {
          emitCode(clearCode);
          initTable();
        }
        current = String(pixel);
      }
    }
    emitCode(codeTable.get(current));
    emitCode(eoiCode);
    if (bitCount > 0) {
      output.push(bitBuffer & 255);
    }
    return output;
  }
  function writeSubBlocks(data) {
    let offset = 0;
    while (offset < data.length) {
      const blockSize = Math.min(255, data.length - offset);
      writeByte(blockSize);
      for (let i = 0; i < blockSize; i++) {
        writeByte(data[offset + i]);
      }
      offset += blockSize;
    }
    writeByte(0);
  }
  function writeHeader() {
    writeString("GIF89a");
  }
  function writeLogicalScreenDescriptor(palette) {
    writeShort(width);
    writeShort(height);
    const packed = 128 | // Global Color Table flag
    7 << 4 | // Color resolution (8 bits)
    0 | // Sort flag
    7;
    writeByte(packed);
    writeByte(0);
    writeByte(0);
    for (let i = 0; i < 256; i++) {
      if (i < palette.length) {
        writeByte(palette[i][0]);
        writeByte(palette[i][1]);
        writeByte(palette[i][2]);
      } else {
        writeByte(0);
        writeByte(0);
        writeByte(0);
      }
    }
  }
  function writeNetscapeExt() {
    writeByte(33);
    writeByte(255);
    writeByte(11);
    writeString("NETSCAPE2.0");
    writeByte(3);
    writeByte(1);
    writeShort(0);
    writeByte(0);
  }
  function writeGraphicControlExt() {
    writeByte(33);
    writeByte(249);
    writeByte(4);
    writeByte(0);
    writeShort(delay);
    writeByte(0);
    writeByte(0);
  }
  function writeImageDescriptor() {
    writeByte(44);
    writeShort(0);
    writeShort(0);
    writeShort(width);
    writeShort(height);
    writeByte(0);
  }
  function writeImageData(indexedPixels) {
    const minCodeSize = 8;
    writeByte(minCodeSize);
    const lzwData = lzwEncode(indexedPixels, minCodeSize);
    writeSubBlocks(lzwData);
  }
  function writeTrailer() {
    writeByte(59);
  }
  let globalPalette = null;
  let headerWritten = false;
  return {
    addFrame(imageData) {
      const pixels = imageData.data;
      if (frameIndex === 0) {
        globalPalette = medianCut(pixels, 256, sampleInterval);
        writeHeader();
        writeLogicalScreenDescriptor(globalPalette);
        writeNetscapeExt();
        headerWritten = true;
      }
      if (!globalPalette || !headerWritten) {
        throw new Error("GIF encoder: header not written");
      }
      const indexedPixels = indexPixels(pixels, globalPalette);
      writeGraphicControlExt();
      writeImageDescriptor();
      writeImageData(indexedPixels);
      frameIndex++;
    },
    finish() {
      if (frameIndex === 0) {
        throw new Error("GIF encoder: no frames added");
      }
      writeTrailer();
      const buffer = new Uint8Array(outputData);
      return new Blob([buffer], { type: "image/gif" });
    }
  };
}

export { AudioLayer, BrowserRenderer, CustomLayer, GroupLayer, ImageLayer, LayerRenderer, LottieLayer, SceneRenderer, ShapeLayer, TemplateRenderer, TextLayer, ThreeLayer, VideoLayer, arrayBufferToBlob, blobToArrayBuffer, calculateTotalDuration, calculateTotalFrames, canvasToVideoFrame, createBrowserRenderer, createFrameByFrameRecorder, createFrameCapturer, createGifEncoder, createMediaRecorderEncoder, createMp4Muxer, createOffscreenCapturer, createWebCodecsEncoder, createWebMMuxer, downloadArrayBuffer, downloadBlob, getBestMimeType, getRecommendedCodec, getSceneAtFrame, getStyleClassName, isMediaRecorderSupported, isWebCodecsSupported, mergeStyles, resolveStyle, useLayerAnimation };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map