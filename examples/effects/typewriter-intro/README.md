# Typewriter Intro

Classic terminal-style typewriter intro with retro computer aesthetic and cursor animation.

## Preview

![Preview](./preview.gif)

## Features

- Terminal-style interface with border and header
- Three lines of text typing sequentially
- Block cursor animation with customizable color
- Retro computer aesthetic with green text
- Scanning line effect for authentic CRT feel
- Variable typing speeds for emphasis
- Sound pulse effect on final line

## Usage

```bash
pnpm run examples:render effects/typewriter-intro
```

## Inputs

| Input | Type | Required | Default |
|-------|------|----------|---------|
| `line1` | string | Yes | SYSTEM BOOT SEQUENCE |
| `line2` | string | Yes | INITIALIZING COMPONENTS... |
| `line3` | string | Yes | WELCOME TO THE MATRIX |
| `cursorColor` | color | No | #00ff00 |

## Use Cases

- Tech product launches
- Terminal/CLI demonstrations
- Retro gaming intros
- Hacker-themed content
- System boot sequences
- Developer tool showcases

## Customization Tips

- Change the cursor color to match your brand
- Adjust text for your specific message
- Modify terminal colors for different themes
- Add more lines by duplicating the typewriter layers
- Experiment with different typing speeds for dramatic effect
