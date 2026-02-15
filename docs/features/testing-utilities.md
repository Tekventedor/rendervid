# Testing Utilities

The `@rendervid/testing` package provides testing utilities for Rendervid templates, animations, and performance benchmarking. It is designed to be lightweight and easy to use with vitest.

## Installation

```bash
pnpm add -D @rendervid/testing
```

Peer dependencies: `@rendervid/core` and `vitest`.

## Template Assertions

Validate templates and inputs in your test suites.

```typescript
import { describe, it } from 'vitest';
import {
  expectValidTemplate,
  expectInvalidTemplate,
  expectValidInputs,
  expectInvalidInputs,
  expectLayerExists,
  expectSceneCount,
} from '@rendervid/testing';

describe('My Template', () => {
  it('should be valid', () => {
    expectValidTemplate(myTemplate);
  });

  it('should reject missing name', () => {
    expectInvalidTemplate({ output: {}, composition: {} }, ['MISSING_REQUIRED']);
  });

  it('should have the intro layer', () => {
    expectLayerExists(myTemplate, 'intro-title');
  });

  it('should have 3 scenes', () => {
    expectSceneCount(myTemplate, 3);
  });

  it('should accept valid inputs', () => {
    expectValidInputs(myTemplate, { title: 'Hello World' });
  });

  it('should reject missing required inputs', () => {
    expectInvalidInputs(myTemplate, {}, ['MISSING_REQUIRED_INPUT']);
  });
});
```

## Animation Assertions

Test animation properties and keyframes.

```typescript
import {
  expectAnimationProperty,
  expectKeyframeCount,
  expectValueAtFrame,
} from '@rendervid/testing';

describe('Layer Animations', () => {
  it('should animate opacity', () => {
    expectAnimationProperty(myLayer, 'opacity');
  });

  it('should have 3 opacity keyframes', () => {
    expectKeyframeCount(myLayer, 'opacity', 3);
  });

  it('should start invisible', () => {
    expectValueAtFrame(myAnimation, 0, { opacity: 0 });
  });
});
```

## Mock Utilities

Create mock data for testing without real media files.

```typescript
import {
  createMockTemplate,
  createMockLayer,
  createMockAudioData,
} from '@rendervid/testing';

// Create a template with defaults
const template = createMockTemplate();

// Create a template with overrides
const customTemplate = createMockTemplate({
  name: 'Test Template',
  output: { type: 'image', width: 800, height: 600 },
});

// Create typed layers
const textLayer = createMockLayer('text', { id: 'title' });
const imageLayer = createMockLayer('image');
const shapeLayer = createMockLayer('shape');

// Create mock audio data
const audio = createMockAudioData({ duration: 10, sampleRate: 44100 });
```

## Performance Benchmarking

Measure and assert render performance.

```typescript
import { measureRenderTime, expectWithinBudget } from '@rendervid/testing';

describe('Performance', () => {
  it('should render within budget', async () => {
    const result = await measureRenderTime(async () => {
      await renderMyTemplate();
    });

    // Assert average is under 100ms
    expectWithinBudget(result.avg, 100);
  });
});
```

The `measureRenderTime` function returns:
- `avg` - average execution time in ms
- `min` - minimum execution time in ms
- `max` - maximum execution time in ms
- `runs` - number of runs performed

## Vitest Plugin

Register custom matchers for a more fluent test API.

```typescript
// setup.ts (referenced in vitest.config.ts setupFiles)
import { rendervidPlugin } from '@rendervid/testing';

const plugin = rendervidPlugin();
plugin.setup();
```

Then use custom matchers in your tests:

```typescript
import { describe, it, expect } from 'vitest';

describe('My Template', () => {
  it('should be valid', () => {
    expect(myTemplate).toBeValidTemplate();
  });

  it('should have the title layer', () => {
    expect(myTemplate).toHaveLayer('title');
  });

  it('should have 2 scenes', () => {
    expect(myTemplate).toHaveSceneCount(2);
  });

  it('should animate opacity', () => {
    expect(myLayer).toHaveAnimationProperty('opacity');
  });
});
```

## Available Custom Matchers

| Matcher | Description |
|---------|-------------|
| `toBeValidTemplate()` | Assert template passes validation |
| `toBeInvalidTemplate(errorCodes?)` | Assert template fails validation |
| `toHaveLayer(layerId)` | Assert layer exists in template |
| `toHaveSceneCount(count)` | Assert number of scenes |
| `toHaveAnimationProperty(property)` | Assert layer has animation on property |
