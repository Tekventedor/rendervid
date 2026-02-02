# TextTrail Direction Reference

Visual guide to understanding the different trail directions.

## Direction: `"right"`
```
Text →→→→→
```
Trail extends to the right (most common for left-to-right languages)

## Direction: `"left"`
```
←←←←← Text
```
Trail extends to the left

## Direction: `"up"`
```
    Text
    ↑
    ↑
    ↑
    ↑
```
Trail extends upward

## Direction: `"down"`
```
    Text
    ↓
    ↓
    ↓
    ↓
```
Trail extends downward

## Direction: `"top-right"`
```
        Text
       ↗
      ↗
     ↗
    ↗
```
Trail extends diagonally to top-right (45° angle)

## Direction: `"top-left"`
```
    Text
     ↖
      ↖
       ↖
        ↖
```
Trail extends diagonally to top-left (45° angle)

## Direction: `"bottom-right"`
```
Text
    ↘
     ↘
      ↘
       ↘
```
Trail extends diagonally to bottom-right (45° angle)

## Direction: `"bottom-left"`
```
        Text
       ↙
      ↙
     ↙
    ↙
```
Trail extends diagonally to bottom-left (45° angle)

## Visual Effect

Each trail copy has:
- Decreasing opacity (configurable via `startOpacity` and `endOpacity`)
- Position offset based on direction and `trailSpacing`
- Optional blur effect that increases with distance from main text

## Animation

When `animate={true}`, the entire trail continuously moves in the specified direction, creating a dynamic motion effect.

## Tips

- **Horizontal trails** (`left`, `right`) work best for emphasis and speed
- **Vertical trails** (`up`, `down`) create rising or falling effects
- **Diagonal trails** create dynamic, energetic motion
- Combine with `blur` for enhanced motion blur effects
- Use higher `trailSpacing` for more dramatic effects
- Use more `trailLength` copies for longer, smoother trails
