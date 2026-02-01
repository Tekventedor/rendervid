# Core Types

Complete type reference for @rendervid/core.

## Import

```typescript
import type {
  Template,
  Layer,
  Scene,
  Animation,
  InputDefinition,
  // ... other types
} from '@rendervid/core';
```

## Template Types

### Template

```typescript
interface Template {
  id?: string;
  name: string;
  description?: string;
  version?: string;
  author?: TemplateAuthor;
  tags?: string[];
  thumbnail?: string;
  output: OutputConfig;
  inputs: InputDefinition[];
  defaults?: Record<string, unknown>;
  customComponents?: Record<string, CustomComponentDefinition>;
  composition: Composition;
}
```

### TemplateAuthor

```typescript
interface TemplateAuthor {
  name: string;
  url?: string;
  email?: string;
}
```

### OutputConfig

```typescript
interface OutputConfig {
  type: 'video' | 'image';
  width: number;
  height: number;
  fps?: number;
  duration?: number;
  backgroundColor?: string;
}
```

## Composition Types

### Composition

```typescript
interface Composition {
  scenes: Scene[];
  assets?: AssetDefinition[];
}
```

### Scene

```typescript
interface Scene {
  id: string;
  name?: string;
  startFrame: number;
  endFrame: number;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundFit?: BackgroundFit;
  backgroundVideo?: string;
  transition?: SceneTransition;
  layers: Layer[];
}

type BackgroundFit = 'cover' | 'contain' | 'fill' | 'none';
```

### SceneTransition

```typescript
interface SceneTransition {
  type: TransitionType;
  duration: number;
  direction?: TransitionDirection;
  easing?: string;
}

type TransitionType = 'cut' | 'fade' | 'slide' | 'wipe' | 'zoom';
type TransitionDirection = 'left' | 'right' | 'up' | 'down';
```

### AssetDefinition

```typescript
interface AssetDefinition {
  id: string;
  type: AssetType;
  url: string;
  name?: string;
}

type AssetType = 'image' | 'video' | 'audio' | 'font' | 'lottie';
```

## Layer Types

### LayerType

```typescript
type LayerType =
  | 'image'
  | 'video'
  | 'text'
  | 'shape'
  | 'audio'
  | 'group'
  | 'lottie'
  | 'custom';
```

### LayerBase

```typescript
interface LayerBase {
  id: string;
  type: LayerType;
  name?: string;
  position: Position;
  size: Size;
  rotation?: number;
  scale?: Scale;
  anchor?: Anchor;
  from?: number;
  duration?: number;
  opacity?: number;
  blendMode?: BlendMode;
  filters?: Filter[];
  shadow?: Shadow;
  clipPath?: string;
  maskLayer?: string;
  style?: LayerStyle;
  className?: string;
  inputKey?: string;
  inputProperty?: string;
  animations?: Animation[];
  locked?: boolean;
  hidden?: boolean;
}
```

### Layer (Union Type)

```typescript
type Layer =
  | ImageLayer
  | VideoLayer
  | TextLayer
  | ShapeLayer
  | AudioLayer
  | GroupLayer
  | LottieLayer
  | CustomLayer;
```

### ImageLayer

```typescript
interface ImageLayer extends LayerBase {
  type: 'image';
  props: ImageLayerProps;
}

interface ImageLayerProps {
  src: string;
  fit?: 'cover' | 'contain' | 'fill' | 'none';
  objectPosition?: string;
}
```

### VideoLayer

```typescript
interface VideoLayer extends LayerBase {
  type: 'video';
  props: VideoLayerProps;
}

interface VideoLayerProps {
  src: string;
  fit?: 'cover' | 'contain' | 'fill';
  loop?: boolean;
  muted?: boolean;
  playbackRate?: number;
  startTime?: number;
  endTime?: number;
  volume?: number;
}
```

### TextLayer

```typescript
interface TextLayer extends LayerBase {
  type: 'text';
  props: TextLayerProps;
}

interface TextLayerProps {
  text: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: FontWeight;
  fontStyle?: 'normal' | 'italic';
  color?: string;
  textAlign?: TextAlign;
  verticalAlign?: VerticalAlign;
  lineHeight?: number;
  letterSpacing?: number;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textDecoration?: 'none' | 'underline' | 'line-through';
  stroke?: TextStroke;
  textShadow?: TextShadow;
  backgroundColor?: string;
  padding?: Padding;
  borderRadius?: number;
  maxLines?: number;
  overflow?: 'visible' | 'hidden' | 'ellipsis';
}

type TextAlign = 'left' | 'center' | 'right' | 'justify';
type VerticalAlign = 'top' | 'middle' | 'bottom';
type FontWeight = 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
```

### ShapeLayer

```typescript
interface ShapeLayer extends LayerBase {
  type: 'shape';
  props: ShapeLayerProps;
}

interface ShapeLayerProps {
  shape: ShapeType;
  fill?: string;
  gradient?: Gradient;
  stroke?: string;
  strokeWidth?: number;
  strokeDash?: number[];
  borderRadius?: number;
  sides?: number;
  points?: number;
  innerRadius?: number;
  pathData?: string;
}

type ShapeType = 'rectangle' | 'ellipse' | 'polygon' | 'star' | 'path';
```

### AudioLayer

```typescript
interface AudioLayer extends LayerBase {
  type: 'audio';
  props: AudioLayerProps;
}

interface AudioLayerProps {
  src: string;
  volume?: number;
  loop?: boolean;
  startTime?: number;
  fadeIn?: number;
  fadeOut?: number;
}
```

### GroupLayer

```typescript
interface GroupLayer extends LayerBase {
  type: 'group';
  props: GroupLayerProps;
  children: Layer[];
}

interface GroupLayerProps {
  clip?: boolean;
}
```

### LottieLayer

```typescript
interface LottieLayer extends LayerBase {
  type: 'lottie';
  props: LottieLayerProps;
}

interface LottieLayerProps {
  data: object | string;
  loop?: boolean;
  speed?: number;
  direction?: 1 | -1;
}
```

### CustomLayer

```typescript
interface CustomLayer extends LayerBase {
  type: 'custom';
  props: CustomLayerProps;
  customComponent: CustomComponentRef;
}

interface CustomLayerProps {
  [key: string]: unknown;
}

interface CustomComponentRef {
  name: string;
  props: Record<string, unknown>;
}
```

## Geometry Types

### Position

```typescript
interface Position {
  x: number;
  y: number;
}
```

### Size

```typescript
interface Size {
  width: number;
  height: number;
}
```

### Scale

```typescript
interface Scale {
  x: number;
  y: number;
}
```

### Anchor

```typescript
interface Anchor {
  x: number;  // 0-1, 0.5 = center
  y: number;  // 0-1, 0.5 = center
}
```

## Animation Types

### Animation

```typescript
interface Animation {
  type: AnimationType;
  effect?: AnimationPreset | string;
  duration: number;
  delay?: number;
  easing?: Easing;
  keyframes?: Keyframe[];
  loop?: number;
  alternate?: boolean;
}

type AnimationType = 'entrance' | 'exit' | 'emphasis' | 'keyframe';
```

### AnimationPreset

```typescript
type EntranceAnimation =
  | 'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight'
  | 'slideInUp' | 'slideInDown' | 'slideInLeft' | 'slideInRight'
  | 'scaleIn' | 'scaleInUp' | 'scaleInDown'
  | 'rotateIn' | 'rotateInClockwise' | 'rotateInCounterClockwise'
  | 'bounceIn' | 'bounceInUp' | 'bounceInDown'
  | 'flipInX' | 'flipInY'
  | 'zoomIn' | 'typewriter'
  | 'revealLeft' | 'revealRight' | 'revealUp' | 'revealDown';

type ExitAnimation =
  | 'fadeOut' | 'fadeOutUp' | 'fadeOutDown' | 'fadeOutLeft' | 'fadeOutRight'
  | 'slideOutUp' | 'slideOutDown' | 'slideOutLeft' | 'slideOutRight'
  | 'scaleOut' | 'rotateOut' | 'bounceOut'
  | 'flipOutX' | 'flipOutY' | 'zoomOut';

type EmphasisAnimation =
  | 'pulse' | 'shake' | 'bounce' | 'swing' | 'wobble'
  | 'flash' | 'rubberBand' | 'heartbeat' | 'float' | 'spin';

type AnimationPreset = EntranceAnimation | ExitAnimation | EmphasisAnimation;
```

### Keyframe

```typescript
interface Keyframe {
  frame: number;
  properties: AnimatableProperties;
  easing?: Easing;
}

interface AnimatableProperties {
  x?: number;
  y?: number;
  scaleX?: number;
  scaleY?: number;
  rotation?: number;
  opacity?: number;
  [key: string]: number | undefined;
}
```

### Easing

```typescript
type EasingName =
  | 'linear'
  | 'easeInQuad' | 'easeOutQuad' | 'easeInOutQuad'
  | 'easeInCubic' | 'easeOutCubic' | 'easeInOutCubic'
  | 'easeInQuart' | 'easeOutQuart' | 'easeInOutQuart'
  | 'easeInQuint' | 'easeOutQuint' | 'easeInOutQuint'
  | 'easeInSine' | 'easeOutSine' | 'easeInOutSine'
  | 'easeInExpo' | 'easeOutExpo' | 'easeInOutExpo'
  | 'easeInCirc' | 'easeOutCirc' | 'easeInOutCirc'
  | 'easeInBack' | 'easeOutBack' | 'easeInOutBack'
  | 'easeInElastic' | 'easeOutElastic' | 'easeInOutElastic'
  | 'easeInBounce' | 'easeOutBounce' | 'easeInOutBounce';

type Easing = EasingName | string;  // Also accepts cubic-bezier() and spring()
```

## Input Types

### InputDefinition

```typescript
interface InputDefinition {
  key: string;
  type: InputType;
  label: string;
  description: string;
  required: boolean;
  default?: unknown;
  validation?: InputValidation;
  ui?: InputUI;
}

type InputType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'color'
  | 'url'
  | 'enum'
  | 'richtext'
  | 'date'
  | 'array';
```

### InputValidation

```typescript
interface InputValidation {
  // String
  minLength?: number;
  maxLength?: number;
  pattern?: string;

  // Number
  min?: number;
  max?: number;
  step?: number;
  integer?: boolean;

  // Enum
  options?: EnumOption[];

  // URL
  allowedTypes?: ('image' | 'video' | 'audio' | 'font')[];

  // Array
  minItems?: number;
  maxItems?: number;
  itemType?: Omit<InputDefinition, 'key' | 'label' | 'required'>;
}

interface EnumOption {
  value: string;
  label: string;
}
```

## Filter Types

### Filter

```typescript
interface Filter {
  type: FilterType;
  value: number | string;
  animate?: FilterAnimation;
}

type FilterType =
  | 'blur'
  | 'brightness'
  | 'contrast'
  | 'grayscale'
  | 'hue-rotate'
  | 'invert'
  | 'opacity'
  | 'saturate'
  | 'sepia'
  | 'drop-shadow';

interface FilterAnimation {
  from: number;
  to: number;
  duration: number;
  easing?: string;
}
```

## Style Types

### LayerStyle

```typescript
interface LayerStyle {
  // Spacing
  padding?: string | number;
  paddingX?: string | number;
  paddingY?: string | number;
  // ... other padding variants
  margin?: string | number;
  // ... other margin variants

  // Borders
  borderRadius?: string | number;
  // ... corner variants
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';

  // Shadows
  boxShadow?: ShadowPreset | string;

  // Backgrounds
  backgroundColor?: string;
  backgroundGradient?: BackgroundGradient;
  backgroundImage?: string;
  backgroundSize?: 'cover' | 'contain' | 'auto' | string;
  backgroundPosition?: string;
  backdropBlur?: BlurPreset | number;

  // Typography
  fontFamily?: string;
  fontSize?: string | number;
  fontWeight?: string | number;
  lineHeight?: string | number;
  letterSpacing?: string | number;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textColor?: string;
  textShadow?: string;
  textDecoration?: 'none' | 'underline' | 'line-through';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';

  // Layout
  display?: 'flex' | 'grid' | 'block' | 'inline' | 'inline-flex' | 'inline-block' | 'none';
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  alignItems?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  gap?: string | number;

  // Effects
  blur?: BlurPreset | number;
  brightness?: number;
  contrast?: number;
  grayscale?: number;
  saturate?: number;
  sepia?: number;
  hueRotate?: number;
  invert?: number;

  // Overflow
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';

  // Raw CSS
  css?: CSSProperties;
}

type ShadowPreset = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type BlurPreset = 'sm' | 'md' | 'lg';
```

### Gradient

```typescript
interface Gradient {
  type: 'linear' | 'radial';
  colors: GradientStop[];
  angle?: number;
}

interface GradientStop {
  offset: number;  // 0-1
  color: string;
}

interface BackgroundGradient {
  type: 'linear' | 'radial' | 'conic';
  from: string;
  via?: string;
  to: string;
  direction?: number;
}
```

## Miscellaneous Types

### BlendMode

```typescript
type BlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'hard-light'
  | 'soft-light'
  | 'difference'
  | 'exclusion';
```

### Shadow

```typescript
interface Shadow {
  color: string;
  blur: number;
  offsetX: number;
  offsetY: number;
}
```

### TextStroke

```typescript
interface TextStroke {
  color: string;
  width: number;
}
```

### TextShadow

```typescript
interface TextShadow {
  color: string;
  blur: number;
  offsetX: number;
  offsetY: number;
}
```

## Related Documentation

- [RendervidEngine](/api/core/engine) - Engine API
- [Template Schema](/templates/schema) - Template reference
- [Layers](/templates/layers) - Layer types
