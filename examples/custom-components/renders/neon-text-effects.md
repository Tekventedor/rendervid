# Neon Text Effects

Stunning neon text with glow, flicker, and animation effects

**Stats:**
- Duration: 6 seconds
- FPS: 60
- Resolution: 1920x1080
- Layers: 8

**Features:**
- 4 custom components
- 3 input variables

To render this video, use:
```bash
pnpm examples:render neon-text-effects
```

Or use the BrowserRenderer API:
```typescript
import { createBrowserRenderer } from '@rendervid/renderer-browser';
import template from './examples/custom-components/neon-text-effects.json';

const renderer = createBrowserRenderer();
const result = await renderer.renderVideo({ template });
```
