# Gaming Framework Integration Issues

This directory contains detailed GitHub issues for integrating gaming frameworks (Three.js, PixiJS, physics engines) into Rendervid to enable game-style video generation.

## Overview

**Epic Issue**: [GAMING-000](gaming-000-epic.md) - Complete overview and roadmap

## Issues by Phase

### Phase 1: Physics Foundation (Weeks 1-2)

| Issue | Title | Description | Dependencies |
|-------|-------|-------------|--------------|
| [GAMING-001](gaming-001-physics-package.md) | Physics Package Foundation | Create `@rendervid/physics` with Rapier3D | None |
| [GAMING-002](gaming-002-physics-threejs-integration.md) | Physics Three.js Integration | Add physics to Three.js layer | GAMING-001 |
| [GAMING-003](gaming-003-collision-events.md) | Collision Events & Callbacks | Trigger actions on collisions | GAMING-002 |

**Deliverables**: Physics simulation, collision detection, 3 examples

### Phase 2: Visual Effects (Weeks 3-4)

| Issue | Title | Description | Dependencies |
|-------|-------|-------------|--------------|
| [GAMING-004](gaming-004-gpu-particle-system.md) | GPU Particle System | 10k+ particles with emitters & forces | GAMING-002 |
| [GAMING-005](gaming-005-post-processing.md) | Post-Processing Effects | Bloom, DOF, motion blur, glitch | GAMING-002 |

**Deliverables**: Particle effects, cinematic post-processing, 5 examples

### Phase 3: Animation & Scripting (Weeks 5-6)

| Issue | Title | Description | Dependencies |
|-------|-------|-------------|--------------|
| [GAMING-006](gaming-006-keyframe-animation.md) | Keyframe Animation System | Advanced animations with easing | GAMING-002 |
| [GAMING-007](gaming-007-scripting-system.md) | Custom Scripting with VM | Safe JavaScript execution | GAMING-002, GAMING-003 |
| [GAMING-010](gaming-010-behavior-presets.md) | Behavior Preset Library | 15+ reusable behaviors | GAMING-002, GAMING-008 |

**Deliverables**: Keyframe system, scripting, behaviors, 5 examples

### Phase 4: 2D Gaming (Weeks 7-8)

| Issue | Title | Description | Dependencies |
|-------|-------|-------------|--------------|
| [GAMING-008](gaming-008-pixijs-layer.md) | PixiJS 2D Layer | Sprites, tilemaps, filters | None |
| [GAMING-009](gaming-009-matter-physics.md) | Matter.js 2D Physics | 2D physics for PixiJS | GAMING-008 |

**Deliverables**: 2D layer, 2D physics, 5 examples

### Phase 5: AI Integration (Week 9)

| Issue | Title | Description | Dependencies |
|-------|-------|-------------|--------------|
| [GAMING-011](gaming-011-ai-capabilities.md) | AI Capabilities & MCP | Expose features to AI agents | All previous |

**Deliverables**: Capabilities API, MCP tools, AI guide, 20+ total examples

## Quick Reference

### By Feature

**Physics**
- [GAMING-001](gaming-001-physics-package.md) - Core physics engine
- [GAMING-002](gaming-002-physics-threejs-integration.md) - 3D physics
- [GAMING-009](gaming-009-matter-physics.md) - 2D physics
- [GAMING-003](gaming-003-collision-events.md) - Collision events

**Visual Effects**
- [GAMING-004](gaming-004-gpu-particle-system.md) - Particle systems
- [GAMING-005](gaming-005-post-processing.md) - Post-processing

**Animation & Control**
- [GAMING-006](gaming-006-keyframe-animation.md) - Keyframe animations
- [GAMING-007](gaming-007-scripting-system.md) - Custom scripting
- [GAMING-010](gaming-010-behavior-presets.md) - Behavior presets

**Rendering**
- [GAMING-002](gaming-002-physics-threejs-integration.md) - Three.js (3D)
- [GAMING-008](gaming-008-pixijs-layer.md) - PixiJS (2D)

**AI Integration**
- [GAMING-011](gaming-011-ai-capabilities.md) - AI capabilities

### By Package

| Package | Issues |
|---------|--------|
| `@rendervid/physics` | GAMING-001, GAMING-002, GAMING-009 |
| `@rendervid/particles` | GAMING-004 |
| `@rendervid/scripting` | GAMING-007 |
| `@rendervid/behaviors` | GAMING-010 |
| `@rendervid/renderer-browser` | GAMING-002, GAMING-004, GAMING-005, GAMING-006, GAMING-008 |
| `@rendervid/core` | All (type definitions) |
| `@rendervid/mcp-server` | GAMING-011 |

## Implementation Order

**Critical Path** (must be done in order):
1. GAMING-001 → GAMING-002 → GAMING-003
2. GAMING-004 (parallel with 3)
3. GAMING-005 (parallel with 4)
4. GAMING-006 (parallel with 7)
5. GAMING-007
6. GAMING-008 → GAMING-009
7. GAMING-010 (requires 2 and 8)
8. GAMING-011 (requires all)

**Can be parallelized**:
- GAMING-004 and GAMING-005 (both extend Three.js)
- GAMING-006 and GAMING-007 (different systems)
- GAMING-008 and GAMING-009 (2D is independent of 3D)

## Estimated Effort

| Issue | Complexity | Estimated Days |
|-------|------------|----------------|
| GAMING-001 | High | 5 |
| GAMING-002 | Medium | 4 |
| GAMING-003 | Medium | 3 |
| GAMING-004 | High | 6 |
| GAMING-005 | Medium | 4 |
| GAMING-006 | Medium | 5 |
| GAMING-007 | High | 6 |
| GAMING-008 | High | 7 |
| GAMING-009 | Medium | 4 |
| GAMING-010 | Medium | 5 |
| GAMING-011 | Low | 3 |
| **Total** | | **52 days** (~9 weeks with 1 developer) |

## Success Metrics

### Performance Targets
- 1000+ 3D physics bodies at 60fps
- 10,000+ 3D particles at 60fps
- 100+ 2D physics bodies at 60fps
- <5ms post-processing overhead

### Quality Targets
- >90% test coverage
- Zero security vulnerabilities
- No memory leaks
- Deterministic rendering

### User Experience
- 30+ example templates
- Complete documentation
- AI agents can generate videos
- <10 lines JSON for simple effects

## Getting Started

1. Read the [Epic Issue](gaming-000-epic.md) for full context
2. Start with [GAMING-001](gaming-001-physics-package.md) (physics foundation)
3. Follow the critical path order
4. Each issue includes:
   - Detailed technical approach
   - Type definitions
   - Implementation checklist
   - API design examples
   - Testing requirements
   - Documentation requirements

## Questions?

- Check the epic issue for architecture overview
- Each issue has detailed implementation notes
- Dependencies are clearly marked
- All issues include acceptance criteria

## Contributing

When implementing an issue:
1. Create a feature branch: `feature/gaming-XXX-description`
2. Follow the implementation checklist
3. Write tests (>90% coverage)
4. Update documentation
5. Create example templates
6. Update capabilities API (if applicable)
7. Submit PR referencing the issue

## Notes

- All issues are designed to be AI-friendly
- JSON-first API design
- Modular architecture (can adopt incrementally)
- Backward compatible (existing templates still work)
- Security-first (sandboxed scripting)
