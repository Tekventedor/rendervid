# Particle Explosion Effect

Stunning particle explosion with physics simulation using custom component

**Stats:**
- Duration: 5 seconds
- FPS: 60
- Resolution: 1920x1080
- Layers: 4

**Features:**
- 2 custom components
- 3 input variables

To render this video, use:
```bash
pnpm examples:render particle-explosion
```

Or use the BrowserRenderer API:
```typescript
import { createBrowserRenderer } from '@rendervid/renderer-browser';
import template from './examples/custom-components/particle-explosion.json';

const renderer = createBrowserRenderer();
const result = await renderer.renderVideo({ template });
```
