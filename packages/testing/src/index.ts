// Template assertions
export {
  expectValidTemplate,
  expectInvalidTemplate,
  expectValidInputs,
  expectInvalidInputs,
  expectLayerExists,
  expectSceneCount,
} from './assertions/template';

// Animation assertions
export {
  expectAnimationProperty,
  expectKeyframeCount,
  expectValueAtFrame,
} from './assertions/animation';

// Performance utilities
export {
  measureRenderTime,
  expectWithinBudget,
  type BenchmarkResult,
} from './performance/benchmark';

// Mock utilities
export {
  createMockAudioData,
  createMockTemplate,
  createMockLayer,
  type MockAudioOptions,
} from './mocks/media';

// Vitest plugin
export { rendervidPlugin } from './plugins/vitest-plugin';
