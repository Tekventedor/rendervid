# Dashboard with Multiple Components

Demonstrates using multiple custom components in a single template

**Stats:**
- Duration: 6 seconds
- FPS: 30
- Resolution: 1920x1080
- Layers: 14

**Features:**
- 4 custom components
- 3 input variables

To render this video, use:
```bash
pnpm examples:render dashboard
```

Or use the BrowserRenderer API:
```typescript
import { createBrowserRenderer } from '@rendervid/renderer-browser';
import template from './examples/custom-components/dashboard.json';

const renderer = createBrowserRenderer();
const result = await renderer.renderVideo({ template });
```
