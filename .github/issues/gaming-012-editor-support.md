# [GAMING-012] Template Editor Support for Gaming Features

## Overview
Extend the `@rendervid/editor` package to provide UI controls for editing all gaming features: physics, particles, post-processing, animations, behaviors, and scripting.

## Motivation
Users need a visual interface to configure gaming features without writing JSON manually. The editor should provide intuitive controls for physics properties, particle emitters, behavior parameters, and animation keyframes.

## Technical Approach

Extend existing editor components with new panels and controls for gaming features. Use progressive disclosure to avoid overwhelming users.

### Architecture

```
Editor
├── LayerPanel (existing)
│   ├── ThreeLayerEditor (enhanced)
│   │   ├── PhysicsPanel (NEW)
│   │   ├── ParticlesPanel (NEW)
│   │   ├── PostProcessingPanel (NEW)
│   │   └── AnimationsPanel (enhanced)
│   └── PixiLayerEditor (NEW)
│       ├── SpriteEditor
│       ├── TilemapEditor
│       ├── Physics2DPanel
│       └── FiltersPanel
├── BehaviorsPanel (NEW)
├── ScriptsPanel (NEW)
└── PropertiesPanel (enhanced)
```

### UI Components

```typescript
// packages/editor/src/panels/PhysicsPanel.tsx

export function PhysicsPanel({ layer, onChange }: PhysicsPanelProps) {
  const physics = layer.props.physics;
  
  return (
    <Panel title="Physics" collapsible defaultOpen={physics?.enabled}>
      <Toggle
        label="Enable Physics"
        value={physics?.enabled ?? false}
        onChange={(enabled) => onChange({ ...layer, props: { ...layer.props, physics: { ...physics, enabled } } })}
      />
      
      {physics?.enabled && (
        <>
          <Vector3Input
            label="Gravity"
            value={physics.gravity || [0, -9.81, 0]}
            onChange={(gravity) => onChange({ ...layer, props: { ...layer.props, physics: { ...physics, gravity } } })}
          />
          
          <NumberInput
            label="Timestep"
            value={physics.timestep || 1/60}
            min={1/120}
            max={1/30}
            step={0.001}
            onChange={(timestep) => onChange({ ...layer, props: { ...layer.props, physics: { ...physics, timestep } } })}
          />
          
          <Toggle
            label="Debug Visualization"
            value={physics.debug ?? false}
            onChange={(debug) => onChange({ ...layer, props: { ...layer.props, physics: { ...physics, debug } } })}
          />
        </>
      )}
    </Panel>
  );
}

// packages/editor/src/panels/MeshPhysicsPanel.tsx

export function MeshPhysicsPanel({ mesh, onChange }: MeshPhysicsPanelProps) {
  const rigidBody = mesh.rigidBody;
  
  return (
    <Panel title="Rigid Body" collapsible>
      <Select
        label="Type"
        value={rigidBody?.type || 'none'}
        options={[
          { value: 'none', label: 'No Physics' },
          { value: 'dynamic', label: 'Dynamic' },
          { value: 'static', label: 'Static' },
          { value: 'kinematic', label: 'Kinematic' },
        ]}
        onChange={(type) => {
          if (type === 'none') {
            onChange({ ...mesh, rigidBody: undefined, collider: undefined });
          } else {
            onChange({ ...mesh, rigidBody: { ...rigidBody, type } });
          }
        }}
      />
      
      {rigidBody && rigidBody.type !== 'static' && (
        <>
          <NumberInput
            label="Mass"
            value={rigidBody.mass ?? 1}
            min={0.01}
            max={1000}
            onChange={(mass) => onChange({ ...mesh, rigidBody: { ...rigidBody, mass } })}
          />
          
          <NumberInput
            label="Restitution (Bounciness)"
            value={rigidBody.restitution ?? 0.5}
            min={0}
            max={1}
            step={0.1}
            onChange={(restitution) => onChange({ ...mesh, rigidBody: { ...rigidBody, restitution } })}
          />
          
          <NumberInput
            label="Friction"
            value={rigidBody.friction ?? 0.5}
            min={0}
            max={1}
            step={0.1}
            onChange={(friction) => onChange({ ...mesh, rigidBody: { ...rigidBody, friction } })}
          />
          
          <Vector3Input
            label="Initial Velocity"
            value={rigidBody.linearVelocity || [0, 0, 0]}
            onChange={(linearVelocity) => onChange({ ...mesh, rigidBody: { ...rigidBody, linearVelocity } })}
          />
        </>
      )}
      
      {rigidBody && (
        <ColliderPanel
          collider={mesh.collider}
          geometry={mesh.geometry}
          onChange={(collider) => onChange({ ...mesh, collider })}
        />
      )}
    </Panel>
  );
}

// packages/editor/src/panels/ParticlesPanel.tsx

export function ParticlesPanel({ layer, onChange }: ParticlesPanelProps) {
  const particles = layer.props.particles || [];
  
  return (
    <Panel title="Particle Systems" collapsible>
      <Button onClick={() => {
        const newParticle: ParticleSystemConfig = {
          id: `particles_${Date.now()}`,
          count: 1000,
          emitter: { type: 'point', position: [0, 0, 0] },
          particle: { lifetime: 2, size: 0.1, color: '#ffffff' },
        };
        onChange({ ...layer, props: { ...layer.props, particles: [...particles, newParticle] } });
      }}>
        Add Particle System
      </Button>
      
      {particles.map((particle, index) => (
        <ParticleSystemEditor
          key={particle.id}
          particle={particle}
          onChange={(updated) => {
            const newParticles = [...particles];
            newParticles[index] = updated;
            onChange({ ...layer, props: { ...layer.props, particles: newParticles } });
          }}
          onDelete={() => {
            const newParticles = particles.filter((_, i) => i !== index);
            onChange({ ...layer, props: { ...layer.props, particles: newParticles } });
          }}
        />
      ))}
    </Panel>
  );
}

// packages/editor/src/panels/ParticleSystemEditor.tsx

export function ParticleSystemEditor({ particle, onChange, onDelete }: ParticleSystemEditorProps) {
  return (
    <Card>
      <CardHeader>
        <TextInput
          value={particle.id}
          onChange={(id) => onChange({ ...particle, id })}
        />
        <IconButton icon="trash" onClick={onDelete} />
      </CardHeader>
      
      <NumberInput
        label="Particle Count"
        value={particle.count}
        min={1}
        max={100000}
        onChange={(count) => onChange({ ...particle, count })}
      />
      
      <Select
        label="Emitter Type"
        value={particle.emitter.type}
        options={[
          { value: 'point', label: 'Point' },
          { value: 'sphere', label: 'Sphere' },
          { value: 'box', label: 'Box' },
          { value: 'cone', label: 'Cone' },
          { value: 'mesh', label: 'Mesh Surface' },
        ]}
        onChange={(type) => onChange({ ...particle, emitter: { ...particle.emitter, type } })}
      />
      
      <Vector3Input
        label="Position"
        value={particle.emitter.position}
        onChange={(position) => onChange({ ...particle, emitter: { ...particle.emitter, position } })}
      />
      
      {/* Emitter-specific controls */}
      {particle.emitter.type === 'sphere' && (
        <NumberInput
          label="Radius"
          value={particle.emitter.radius || 1}
          onChange={(radius) => onChange({ ...particle, emitter: { ...particle.emitter, radius } })}
        />
      )}
      
      {/* Particle properties */}
      <Separator />
      <Label>Particle Properties</Label>
      
      <RangeInput
        label="Lifetime (seconds)"
        value={particle.particle.lifetime}
        min={0.1}
        max={10}
        onChange={(lifetime) => onChange({ ...particle, particle: { ...particle.particle, lifetime } })}
      />
      
      <ColorInput
        label="Color"
        value={particle.particle.color}
        onChange={(color) => onChange({ ...particle, particle: { ...particle.particle, color } })}
      />
      
      {/* Forces */}
      <Separator />
      <Label>Forces</Label>
      <ForcesEditor
        forces={particle.forces || []}
        onChange={(forces) => onChange({ ...particle, forces })}
      />
    </Card>
  );
}

// packages/editor/src/panels/PostProcessingPanel.tsx

export function PostProcessingPanel({ layer, onChange }: PostProcessingPanelProps) {
  const postProcessing = layer.props.postProcessing || {};
  
  return (
    <Panel title="Post-Processing" collapsible>
      <Tabs>
        <Tab label="Bloom">
          <Toggle
            label="Enable Bloom"
            value={!!postProcessing.bloom}
            onChange={(enabled) => {
              if (enabled) {
                onChange({ ...layer, props: { ...layer.props, postProcessing: { ...postProcessing, bloom: { intensity: 1 } } } });
              } else {
                const { bloom, ...rest } = postProcessing;
                onChange({ ...layer, props: { ...layer.props, postProcessing: rest } });
              }
            }}
          />
          
          {postProcessing.bloom && (
            <>
              <Slider
                label="Intensity"
                value={postProcessing.bloom.intensity ?? 1}
                min={0}
                max={10}
                step={0.1}
                onChange={(intensity) => onChange({ ...layer, props: { ...layer.props, postProcessing: { ...postProcessing, bloom: { ...postProcessing.bloom, intensity } } } })}
              />
              
              <Slider
                label="Threshold"
                value={postProcessing.bloom.threshold ?? 0.9}
                min={0}
                max={1}
                step={0.05}
                onChange={(threshold) => onChange({ ...layer, props: { ...layer.props, postProcessing: { ...postProcessing, bloom: { ...postProcessing.bloom, threshold } } } })}
              />
            </>
          )}
        </Tab>
        
        <Tab label="Depth of Field">
          {/* Similar controls for DOF */}
        </Tab>
        
        <Tab label="Motion Blur">
          {/* Similar controls for motion blur */}
        </Tab>
        
        <Tab label="Glitch">
          {/* Similar controls for glitch */}
        </Tab>
        
        <Tab label="More">
          {/* Other effects */}
        </Tab>
      </Tabs>
    </Panel>
  );
}

// packages/editor/src/panels/BehaviorsPanel.tsx

export function BehaviorsPanel({ mesh, onChange }: BehaviorsPanelProps) {
  const behaviors = mesh.behaviors || [];
  
  return (
    <Panel title="Behaviors" collapsible>
      <Select
        label="Add Behavior"
        placeholder="Choose a behavior..."
        options={Object.entries(BEHAVIOR_PRESETS).map(([key, preset]) => ({
          value: key,
          label: preset.description,
        }))}
        onChange={(behaviorType) => {
          const preset = BEHAVIOR_PRESETS[behaviorType];
          const newBehavior: BehaviorConfig = {
            type: behaviorType,
            params: Object.fromEntries(
              Object.entries(preset.params).map(([key, param]) => [key, param.default])
            ),
          };
          onChange({ ...mesh, behaviors: [...behaviors, newBehavior] });
        }}
      />
      
      {behaviors.map((behavior, index) => (
        <BehaviorEditor
          key={index}
          behavior={behavior}
          preset={BEHAVIOR_PRESETS[behavior.type]}
          onChange={(updated) => {
            const newBehaviors = [...behaviors];
            newBehaviors[index] = updated;
            onChange({ ...mesh, behaviors: newBehaviors });
          }}
          onDelete={() => {
            const newBehaviors = behaviors.filter((_, i) => i !== index);
            onChange({ ...mesh, behaviors: newBehaviors });
          }}
        />
      ))}
    </Panel>
  );
}

// packages/editor/src/panels/BehaviorEditor.tsx

export function BehaviorEditor({ behavior, preset, onChange, onDelete }: BehaviorEditorProps) {
  return (
    <Card>
      <CardHeader>
        <Text>{preset.description}</Text>
        <IconButton icon="trash" onClick={onDelete} />
      </CardHeader>
      
      {Object.entries(preset.params).map(([key, paramDef]) => (
        <ParamInput
          key={key}
          label={key}
          type={paramDef.type}
          value={behavior.params?.[key] ?? paramDef.default}
          min={paramDef.min}
          max={paramDef.max}
          required={paramDef.required}
          onChange={(value) => onChange({
            ...behavior,
            params: { ...behavior.params, [key]: value },
          })}
        />
      ))}
      
      <NumberInput
        label="Start Frame"
        value={behavior.startFrame}
        placeholder="From beginning"
        onChange={(startFrame) => onChange({ ...behavior, startFrame })}
      />
      
      <NumberInput
        label="End Frame"
        value={behavior.endFrame}
        placeholder="Until end"
        onChange={(endFrame) => onChange({ ...behavior, endFrame })}
      />
    </Card>
  );
}

// packages/editor/src/panels/KeyframeAnimationsPanel.tsx

export function KeyframeAnimationsPanel({ mesh, onChange }: KeyframeAnimationsPanelProps) {
  const animations = mesh.animations || [];
  
  return (
    <Panel title="Keyframe Animations" collapsible>
      <Select
        label="Add Animation"
        placeholder="Choose property..."
        options={[
          { value: 'position.x', label: 'Position X' },
          { value: 'position.y', label: 'Position Y' },
          { value: 'position.z', label: 'Position Z' },
          { value: 'rotation.x', label: 'Rotation X' },
          { value: 'rotation.y', label: 'Rotation Y' },
          { value: 'rotation.z', label: 'Rotation Z' },
          { value: 'scale', label: 'Scale' },
          { value: 'material.color', label: 'Material Color' },
          { value: 'material.opacity', label: 'Material Opacity' },
        ]}
        onChange={(property) => {
          const newAnimation: KeyframeAnimation = {
            property,
            keyframes: [
              { frame: 0, value: 0 },
              { frame: 60, value: 1 },
            ],
          };
          onChange({ ...mesh, animations: [...animations, newAnimation] });
        }}
      />
      
      {animations.map((animation, index) => (
        <KeyframeAnimationEditor
          key={index}
          animation={animation}
          onChange={(updated) => {
            const newAnimations = [...animations];
            newAnimations[index] = updated;
            onChange({ ...mesh, animations: newAnimations });
          }}
          onDelete={() => {
            const newAnimations = animations.filter((_, i) => i !== index);
            onChange({ ...mesh, animations: newAnimations });
          }}
        />
      ))}
    </Panel>
  );
}

// packages/editor/src/panels/KeyframeAnimationEditor.tsx

export function KeyframeAnimationEditor({ animation, onChange, onDelete }: KeyframeAnimationEditorProps) {
  return (
    <Card>
      <CardHeader>
        <Text>{animation.property}</Text>
        <IconButton icon="trash" onClick={onDelete} />
      </CardHeader>
      
      <KeyframeTimeline
        keyframes={animation.keyframes}
        onChange={(keyframes) => onChange({ ...animation, keyframes })}
      />
      
      <Button onClick={() => {
        const newKeyframe: Keyframe = {
          frame: Math.max(...animation.keyframes.map(k => k.frame)) + 30,
          value: 0,
          easing: 'linear',
        };
        onChange({ ...animation, keyframes: [...animation.keyframes, newKeyframe] });
      }}>
        Add Keyframe
      </Button>
      
      {animation.keyframes.map((keyframe, index) => (
        <KeyframeEditor
          key={index}
          keyframe={keyframe}
          onChange={(updated) => {
            const newKeyframes = [...animation.keyframes];
            newKeyframes[index] = updated;
            onChange({ ...animation, keyframes: newKeyframes });
          }}
          onDelete={() => {
            if (animation.keyframes.length > 2) {
              const newKeyframes = animation.keyframes.filter((_, i) => i !== index);
              onChange({ ...animation, keyframes: newKeyframes });
            }
          }}
        />
      ))}
      
      <Select
        label="Loop Mode"
        value={animation.loop || 'none'}
        options={[
          { value: 'none', label: 'No Loop' },
          { value: 'repeat', label: 'Repeat' },
          { value: 'pingpong', label: 'Ping Pong' },
        ]}
        onChange={(loop) => onChange({ ...animation, loop })}
      />
    </Card>
  );
}

// packages/editor/src/panels/ScriptsPanel.tsx

export function ScriptsPanel({ layer, onChange }: ScriptsPanelProps) {
  const scripts = layer.props.scripts || {};
  
  return (
    <Panel title="Custom Scripts" collapsible>
      <Alert type="warning">
        Custom scripts execute in a sandboxed environment. Use behaviors for common patterns.
      </Alert>
      
      <Tabs>
        <Tab label="onInit">
          <CodeEditor
            language="javascript"
            value={scripts.hooks?.onInit || ''}
            placeholder="// Runs once when scene initializes\n// Example: scene.add({ id: 'box', geometry: { type: 'box' } });"
            onChange={(code) => onChange({
              ...layer,
              props: {
                ...layer.props,
                scripts: {
                  ...scripts,
                  hooks: { ...scripts.hooks, onInit: code },
                },
              },
            })}
          />
        </Tab>
        
        <Tab label="onFrame">
          <CodeEditor
            language="javascript"
            value={scripts.hooks?.onFrame || ''}
            placeholder="// Runs every frame\n// Example: const box = scene.getById('box'); box.setRotation([0, time.frame * 0.01, 0]);"
            onChange={(code) => onChange({
              ...layer,
              props: {
                ...layer.props,
                scripts: {
                  ...scripts,
                  hooks: { ...scripts.hooks, onFrame: code },
                },
              },
            })}
          />
        </Tab>
        
        <Tab label="API Reference">
          <ScriptAPIReference />
        </Tab>
      </Tabs>
    </Panel>
  );
}

// packages/editor/src/panels/PixiLayerEditor.tsx

export function PixiLayerEditor({ layer, onChange }: PixiLayerEditorProps) {
  return (
    <div>
      <SpritesPanel layer={layer} onChange={onChange} />
      <TilemapsPanel layer={layer} onChange={onChange} />
      <Particles2DPanel layer={layer} onChange={onChange} />
      <Physics2DPanel layer={layer} onChange={onChange} />
      <FiltersPanel layer={layer} onChange={onChange} />
    </div>
  );
}
```

### Visual Timeline for Keyframes

```typescript
// packages/editor/src/components/KeyframeTimeline.tsx

export function KeyframeTimeline({ keyframes, onChange }: KeyframeTimelineProps) {
  const [selectedKeyframe, setSelectedKeyframe] = useState<number | null>(null);
  
  return (
    <div className="keyframe-timeline">
      <div className="timeline-ruler">
        {/* Frame numbers */}
      </div>
      
      <div className="timeline-track">
        {keyframes.map((keyframe, index) => (
          <Draggable
            key={index}
            position={{ x: keyframe.frame * PIXELS_PER_FRAME, y: 0 }}
            onDrag={(e, data) => {
              const newFrame = Math.round(data.x / PIXELS_PER_FRAME);
              const newKeyframes = [...keyframes];
              newKeyframes[index] = { ...keyframe, frame: newFrame };
              onChange(newKeyframes);
            }}
          >
            <div
              className={`keyframe-marker ${selectedKeyframe === index ? 'selected' : ''}`}
              onClick={() => setSelectedKeyframe(index)}
            >
              <div className="keyframe-diamond" />
            </div>
          </Draggable>
        ))}
        
        {/* Bezier curve visualization between keyframes */}
        <svg className="timeline-curves">
          {keyframes.slice(0, -1).map((keyframe, index) => (
            <BezierCurve
              key={index}
              start={keyframe}
              end={keyframes[index + 1]}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
```

## Implementation Checklist

### Phase 1: Core UI Components
- [ ] Create reusable form components (Vector3Input, RangeInput, etc.)
- [ ] Create Panel/Card/Tab components
- [ ] Create CodeEditor component (Monaco or CodeMirror)
- [ ] Create KeyframeTimeline component

### Phase 2: Physics Editing
- [ ] PhysicsPanel for scene-level physics
- [ ] MeshPhysicsPanel for rigid bodies
- [ ] ColliderPanel for collider configuration
- [ ] Visual collider preview in viewport

### Phase 3: Particles Editing
- [ ] ParticlesPanel for managing particle systems
- [ ] ParticleSystemEditor with all properties
- [ ] EmitterEditor for different emitter types
- [ ] ForcesEditor for particle forces
- [ ] Particle preview in viewport

### Phase 4: Post-Processing Editing
- [ ] PostProcessingPanel with tabs for each effect
- [ ] Real-time preview of effects
- [ ] Effect presets (cinematic, retro, etc.)
- [ ] Before/after comparison view

### Phase 5: Animation Editing
- [ ] KeyframeAnimationsPanel
- [ ] KeyframeTimeline with drag-and-drop
- [ ] KeyframeEditor for individual keyframes
- [ ] Easing function selector with preview
- [ ] Animation playback controls

### Phase 6: Behaviors Editing
- [ ] BehaviorsPanel for adding behaviors
- [ ] BehaviorEditor with dynamic param inputs
- [ ] Behavior preview/simulation
- [ ] Behavior library browser

### Phase 7: Scripting Editing
- [ ] ScriptsPanel with code editor
- [ ] Syntax highlighting and autocomplete
- [ ] Script validation and error display
- [ ] API reference documentation
- [ ] Script templates/snippets

### Phase 8: 2D Layer Editing
- [ ] PixiLayerEditor
- [ ] SpriteEditor with texture upload
- [ ] TilemapEditor with tile picker
- [ ] Physics2DPanel for Matter.js
- [ ] FiltersPanel for PixiJS filters

### Phase 9: Integration
- [ ] Integrate all panels into main editor
- [ ] Add gaming features to layer type selector
- [ ] Update template validation
- [ ] Add gaming examples to template library

### Phase 10: UX Polish
- [ ] Tooltips for all controls
- [ ] Keyboard shortcuts
- [ ] Undo/redo for all changes
- [ ] Copy/paste for behaviors and animations
- [ ] Preset library for common configurations

### Phase 11: Testing
- [ ] Unit tests for all components
- [ ] Integration tests for editor workflows
- [ ] Visual regression tests
- [ ] Accessibility tests

### Phase 12: Documentation
- [ ] Editor user guide
- [ ] Video tutorials
- [ ] Interactive tooltips
- [ ] Example workflows

## UI/UX Considerations

### Progressive Disclosure
- Collapse advanced options by default
- Show "Add Physics" button instead of empty physics panel
- Use tabs to organize complex features

### Visual Feedback
- Real-time preview of changes in viewport
- Visual indicators for physics bodies (wireframes)
- Particle system preview
- Animation timeline scrubbing

### Presets & Templates
- Behavior presets with descriptions
- Post-processing presets (cinematic, retro, etc.)
- Particle effect presets (explosion, fire, smoke)
- Animation curve presets

### Validation & Errors
- Inline validation for numeric inputs
- Clear error messages for invalid configurations
- Warnings for performance issues (too many particles)
- Script syntax errors with line numbers

## Dependencies
- All GAMING issues (#GAMING-001 through #GAMING-011)
- `@rendervid/editor` package
- Monaco Editor or CodeMirror for script editing
- React DnD for drag-and-drop timeline

## Acceptance Criteria
- [ ] All gaming features editable in UI
- [ ] No need to write JSON manually
- [ ] Real-time preview works
- [ ] Intuitive UX (user testing)
- [ ] Performance: <100ms for UI updates
- [ ] Accessible (keyboard navigation, screen readers)
- [ ] All tests pass
- [ ] Documentation complete

## Related Issues
- All GAMING issues (#GAMING-001 through #GAMING-011)

## Notes
- Consider visual scripting as alternative to code editor (future)
- Add AI assistant for generating behaviors/scripts (future)
- Support importing animations from external tools (future)
- Mobile/tablet support for editor (future)
