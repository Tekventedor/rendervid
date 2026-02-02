# Animated Counter Example

Demonstrates an animated counter using inline custom component

**Stats:**
- Duration: 5 seconds
- FPS: 30
- Resolution: 1920x1080
- Layers: 2

**Features:**
- 1 custom components
- 3 input variables

To render this video, use:
```bash
pnpm examples:render animated-counter
```

Or use the BrowserRenderer API:
```typescript
import { createBrowserRenderer } from '@rendervid/renderer-browser';
import template from './examples/custom-components/animated-counter.json';

const renderer = createBrowserRenderer();
const result = await renderer.renderVideo({ template });
```
