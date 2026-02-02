# Progress Ring Example

Circular progress indicator with percentage display

**Stats:**
- Duration: 5 seconds
- FPS: 30
- Resolution: 1920x1080
- Layers: 2

**Features:**
- 1 custom components
- 2 input variables

To render this video, use:
```bash
pnpm examples:render progress-ring
```

Or use the BrowserRenderer API:
```typescript
import { createBrowserRenderer } from '@rendervid/renderer-browser';
import template from './examples/custom-components/progress-ring.json';

const renderer = createBrowserRenderer();
const result = await renderer.renderVideo({ template });
```
