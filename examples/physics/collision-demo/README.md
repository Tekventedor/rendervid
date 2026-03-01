# Collision Demo - Physics Events

Demonstrates collision event system with particle spawning on impact.

## Preview

![Demo](output.gif)

[📹 Watch full video (MP4)](output.mp4)

## Features

- Real-time collision detection
- Event-driven particle spawning
- Multiple collision actions
- Impulse-based filtering

## Collision Events

### Event Types
- `collisionStart` - When collision begins
- `collisionEnd` - When collision ends
- `collisionStay` - While collision persists

### Actions

#### Spawn Particles
```json
{
  "type": "spawnParticles",
  "params": {
    "count": 100,
    "lifetime": 0.5,
    "velocity": { "min": [-2, 0, -2], "max": [2, 3, 2] },
    "color": "#ff0000"
  }
}
```

#### Play Sound
```json
{
  "type": "playSound",
  "params": {
    "sound": "impact.mp3",
    "volume": 0.5
  }
}
```

#### Change Color
```json
{
  "type": "changeColor",
  "params": {
    "color": "#ffff00",
    "duration": 0.2
  }
}
```

#### Apply Force
```json
{
  "type": "applyForce",
  "params": {
    "force": [0, 10, 0],
    "target": "bodyA"
  }
}
```

#### Destroy Object
```json
{
  "type": "destroy",
  "params": {
    "target": "bodyB",
    "delay": 0.5
  }
}
```

#### Custom Callback
```json
{
  "type": "custom",
  "params": {
    "callback": "(event) => { console.log('Collision!', event); }"
  }
}
```

## Filtering

### By Impulse
Only trigger on strong impacts:
```json
{
  "onCollisionStart": {
    "minImpulse": 5,
    "maxImpulse": 100,
    "actions": [...]
  }
}
```

### By Body
Target specific objects:
```json
{
  "bodyA": "ball1",
  "bodyB": "ground",
  "actions": [...]
}
```

### By Tag
Group objects by tags:
```json
{
  "tag": "explosive",
  "actions": [...]
}
```

## Event Data

Each collision event provides:
```typescript
{
  type: 'collisionStart' | 'collisionEnd' | 'collisionStay',
  bodyA: string,
  bodyB: string,
  point: [number, number, number],
  normal: [number, number, number],
  impulse: number,
  timestamp: number
}
```

## Usage

```bash
npx rendervid render examples/physics/collision-demo/template.json
```

## Advanced

### Multiple Actions
Chain multiple actions on collision:
```json
{
  "onCollisionStart": {
    "actions": [
      { "type": "playSound", "params": {...} },
      { "type": "spawnParticles", "params": {...} },
      { "type": "changeColor", "params": {...} }
    ]
  }
}
```

### Conditional Logic
Use impulse thresholds for different effects:
```json
{
  "onCollisionStart": {
    "minImpulse": 10,
    "actions": [{ "type": "destroy", "params": {...} }]
  }
}
```
