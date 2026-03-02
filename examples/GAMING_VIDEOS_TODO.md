# Gaming Examples - Video Generation

## Status

Video files (`output.mp4` and `output.gif`) are **placeholders** and need to be generated.

## Why Videos Aren't Generated Yet

The new gaming features (GPU particles, animations, behaviors, collision events) are implemented but not yet integrated into the renderer. To generate videos, we need to:

1. **Integrate gaming systems into renderer**:
   - Update `ThreeRenderer` to use `ParticleSystem`
   - Update `ThreeRenderer` to use `AnimationEngine`
   - Update `ThreeRenderer` to use `BehaviorSystem`
   - Update `ThreeRenderer` to use `CollisionEventSystem`
   - Update `ThreeRenderer` to use `PostProcessingManager`

2. **Build renderer with new features**

3. **Generate videos** using the script below

## How to Generate Videos

Once the renderer is integrated:

```bash
# Generate all gaming example videos
./scripts/generate-gaming-videos.sh
```

Or manually for each example:

```bash
cd examples/physics/falling-boxes
npx tsx render.ts
```

This will create:
- `output.mp4` - Full quality video
- `output.gif` - Animated preview

## Examples Needing Videos

- [ ] examples/physics/falling-boxes/
- [ ] examples/particles/explosion-mvp/
- [ ] examples/animations/keyframe-cube/
- [ ] examples/behaviors/orbiting-cube/
- [ ] examples/particles/fire-explosion/
- [ ] examples/animations/complex-path/
- [ ] examples/behaviors/complex-motion/
- [ ] examples/physics/collision-demo/

## Next Steps

1. Integrate gaming features into `packages/renderer-browser/src/renderers/ThreeRenderer.ts`
2. Test rendering with one example
3. Generate all videos
4. Commit videos to repository
5. Update PR

## Alternative: Generate After Merge

Videos can also be generated after merging the PR, once the renderer integration is complete.
