# Typewriter Effect Example

Text appearing character by character with cursor

**Stats:**
- Duration: 8 seconds
- FPS: 30
- Resolution: 1920x1080
- Layers: 2

**Features:**
- 1 custom components
- 3 input variables

To render this video, use:
```bash
pnpm examples:render typewriter
```

Or use the BrowserRenderer API:
```typescript
import { createBrowserRenderer } from '@rendervid/renderer-browser';
import template from './examples/custom-components/typewriter.json';

const renderer = createBrowserRenderer();
const result = await renderer.renderVideo({ template });
```
