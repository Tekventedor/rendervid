# Code Showcase

Developer-focused code presentation mimicking a VS Code editor with syntax-highlighted code lines, title bar with window controls, file tabs, line numbers, and staggered typewriter-style entrance animations.

## Preview

![Preview](preview.gif)

[View animated SVG](preview.svg)

## Description

Developer-focused code presentation mimicking a VS Code editor with syntax-highlighted code lines, title bar with window controls, file tabs, line numbers, and staggered typewriter-style entrance animations.

## Features

- 1920x1080 (16:9)
- VS Code-style editor with sidebar, tabs, and status bar
- Syntax-highlighted code with staggered typewriter entrance
- Blinking cursor with line highlight and minimap
- 8-second duration at 30 fps

## Inputs

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| title | string | app.tsx | Title / Filename |
| language | string | TypeScript React | Language |

## Quick Start

```bash
pnpm run examples:render tech/code-showcase
```

## Output

- **Format**: MP4 video
- **Resolution**: 1920x1080
- **Frame Rate**: 30 fps
- **Duration**: 8 seconds
