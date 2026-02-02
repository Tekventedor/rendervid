# Holographic Interface

Futuristic holographic interface with multiple animated elements

**Stats:**
- Duration: 12 seconds
- FPS: 60
- Resolution: 1920x1080
- Layers: 14

**Features:**
- 5 custom components
- 3 input variables

To render this video, use:
```bash
pnpm examples:render holographic-interface
```

Or use the BrowserRenderer API:
```typescript
import { createBrowserRenderer } from '@rendervid/renderer-browser';
import template from './examples/custom-components/holographic-interface.json';

const renderer = createBrowserRenderer();
const result = await renderer.renderVideo({ template });
```
