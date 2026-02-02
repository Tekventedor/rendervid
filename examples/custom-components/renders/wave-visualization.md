# Audio Wave Visualization

Beautiful audio wave visualization with multiple frequency bands

**Stats:**
- Duration: 10 seconds
- FPS: 60
- Resolution: 1920x1080
- Layers: 7

**Features:**
- 3 custom components
- 4 input variables

To render this video, use:
```bash
pnpm examples:render wave-visualization
```

Or use the BrowserRenderer API:
```typescript
import { createBrowserRenderer } from '@rendervid/renderer-browser';
import template from './examples/custom-components/wave-visualization.json';

const renderer = createBrowserRenderer();
const result = await renderer.renderVideo({ template });
```
