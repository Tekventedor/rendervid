# ParticleSystem Component Examples

## Basic Usage

### Simple Upward Movement
```tsx
<ParticleSystem
  frame={currentFrame}
  count={50}
  type="circle"
  color="#ffffff"
  size={3}
  speed={2}
  direction="up"
  width={1920}
  height={1080}
/>
```

### With Particle Connections
```tsx
<ParticleSystem
  frame={currentFrame}
  count={50}
  type="circle"
  color="#ffffff"
  size={3}
  speed={2}
  direction="up"
  connections={true}
  connectionDistance={100}
  connectionColor="#ffffff"
  connectionOpacity={0.3}
  width={1920}
  height={1080}
/>
```

## Advanced Examples

### Multi-Color Random Particles
```tsx
<ParticleSystem
  frame={currentFrame}
  count={100}
  type="star"
  color={['#ff0080', '#7928ca', '#4c00ff', '#00ff00']}
  size={[2, 8]}
  speed={[1, 4]}
  direction="random"
  opacity={[0.3, 1]}
  wrap={true}
  width={1920}
  height={1080}
/>
```

### Gravity Effect
```tsx
<ParticleSystem
  frame={currentFrame}
  count={30}
  type="square"
  color="#00ff00"
  size={5}
  speed={3}
  direction="up"
  effect="gravity"
  effectStrength={0.1}
  width={1920}
  height={1080}
/>
```

### Radial Burst
```tsx
<ParticleSystem
  frame={currentFrame}
  count={100}
  type="circle"
  color={['#ff6b6b', '#ffd93d', '#6bcf7f']}
  size={[2, 6]}
  speed={[2, 5]}
  direction="radial"
  opacity={[0.5, 1]}
  fadeOut={true}
  lifetime={120}
  width={1920}
  height={1080}
/>
```

### Attraction to Center
```tsx
<ParticleSystem
  frame={currentFrame}
  count={60}
  type="circle"
  color="#4c00ff"
  size={4}
  speed={1}
  direction="random"
  effect="attraction"
  effectStrength={0.05}
  effectCenter={[0.5, 0.5]}
  connections={true}
  connectionDistance={80}
  width={1920}
  height={1080}
/>
```

### Repulsion from Center
```tsx
<ParticleSystem
  frame={currentFrame}
  count={80}
  type="star"
  color={['#ff0080', '#ffd93d']}
  size={[3, 7]}
  speed={0.5}
  direction="static"
  effect="repulsion"
  effectStrength={0.2}
  effectCenter={[0.5, 0.5]}
  width={1920}
  height={1080}
/>
```

### Connected Network
```tsx
<ParticleSystem
  frame={currentFrame}
  count={40}
  type="circle"
  color="#00d9ff"
  size={4}
  speed={1}
  direction="random"
  wrap={true}
  connections={true}
  connectionDistance={150}
  connectionColor="#00d9ff"
  connectionOpacity={0.5}
  connectionWidth={2}
  width={1920}
  height={1080}
/>
```

### Snow Effect
```tsx
<ParticleSystem
  frame={currentFrame}
  count={150}
  type="circle"
  color="#ffffff"
  size={[1, 4]}
  speed={[0.5, 2]}
  direction="down"
  wrap={true}
  opacity={[0.3, 0.8]}
  width={1920}
  height={1080}
/>
```

### Floating Bubbles
```tsx
<ParticleSystem
  frame={currentFrame}
  count={30}
  type="circle"
  color={['#4c00ff', '#00d9ff', '#00ff88']}
  size={[10, 30]}
  speed={[0.5, 1.5]}
  direction="up"
  wrap={true}
  opacity={[0.2, 0.5]}
  fadeIn={true}
  width={1920}
  height={1080}
/>
```

### Stars Twinkling
```tsx
<ParticleSystem
  frame={currentFrame}
  count={200}
  type="star"
  color="#ffffff"
  size={[1, 3]}
  speed={0}
  direction="static"
  opacity={[0.3, 1]}
  seed={12345}
  width={1920}
  height={1080}
/>
```

### Confetti
```tsx
<ParticleSystem
  frame={currentFrame}
  count={100}
  type="square"
  color={['#ff0080', '#7928ca', '#ffd93d', '#00ff88', '#00d9ff']}
  size={[3, 8]}
  speed={[2, 5]}
  direction="down"
  effect="gravity"
  effectStrength={0.05}
  opacity={[0.7, 1]}
  width={1920}
  height={1080}
/>
```

### Custom Image Particles
```tsx
<ParticleSystem
  frame={currentFrame}
  count={40}
  type="image"
  imageUrl="https://example.com/particle.png"
  size={[20, 40]}
  speed={[1, 3]}
  direction="random"
  opacity={[0.5, 1]}
  wrap={true}
  width={1920}
  height={1080}
/>
```

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `frame` | `number` | Required | Current frame number |
| `count` | `number` | `50` | Number of particles |
| `type` | `'circle' \| 'square' \| 'star' \| 'image'` | `'circle'` | Particle shape |
| `color` | `string \| string[]` | `'#ffffff'` | Particle color(s) |
| `size` | `number \| [number, number]` | `3` | Particle size or range |
| `speed` | `number \| [number, number]` | `2` | Movement speed or range |
| `direction` | `'up' \| 'down' \| 'left' \| 'right' \| 'random' \| 'radial' \| 'static'` | `'up'` | Movement direction |
| `opacity` | `number \| [number, number]` | `1` | Opacity or range |
| `lifetime` | `number` | `0` | Lifetime in frames (0 = infinite) |
| `width` | `number` | `1920` | Container width |
| `height` | `number` | `1080` | Container height |
| `wrap` | `boolean` | `false` | Wrap particles at edges |
| `fadeIn` | `boolean` | `false` | Fade in effect |
| `fadeOut` | `boolean` | `false` | Fade out effect |
| `connections` | `boolean` | `false` | Draw lines between nearby particles |
| `connectionDistance` | `number` | `100` | Max distance for connections |
| `connectionColor` | `string` | `'#ffffff'` | Connection line color |
| `connectionOpacity` | `number` | `0.3` | Connection line opacity |
| `connectionWidth` | `number` | `1` | Connection line width |
| `effect` | `'gravity' \| 'attraction' \| 'repulsion' \| 'connections' \| 'none'` | `'none'` | Physics effect |
| `effectStrength` | `number` | `0.1` | Effect strength |
| `effectCenter` | `[number, number]` | `[0.5, 0.5]` | Effect center (0-1 normalized) |
| `imageUrl` | `string` | - | Image URL (when type is 'image') |
| `seed` | `number` | `12345` | Random seed for determinism |

## Tips

1. **Performance**: Keep particle count reasonable (50-200 for smooth rendering)
2. **Connections**: Use with fewer particles (30-60) for best performance
3. **Determinism**: Use the same `seed` value to get consistent particle generation
4. **Ranges**: Use `[min, max]` arrays for varied particle properties
5. **Multiple Colors**: Pass an array of colors for random color selection
6. **Effects**: Combine `wrap` with movement for infinite loops
7. **Lifetime**: Use `lifetime` with `fadeOut` for smooth particle disappearance
