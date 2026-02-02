# 3D Cube Rotation

Stunning 3D cube rotation with CSS transforms using custom component

**Stats:**
- Duration: 8 seconds
- FPS: 60
- Resolution: 1920x1080
- Layers: 3

**Features:**
- 2 custom components
- 6 input variables

To render this video, use:
```bash
pnpm examples:render 3d-cube-rotation
```

Or use the BrowserRenderer API:
```typescript
import { createBrowserRenderer } from '@rendervid/renderer-browser';
import template from './examples/custom-components/3d-cube-rotation.json';

const renderer = createBrowserRenderer();
const result = await renderer.renderVideo({ template });
```
