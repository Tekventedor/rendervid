# Glitch Reveal

A dramatic reveal animation where text transitions from chaotic glitches to crystal clarity.

## Overview

This template creates a progressive decoding effect where text starts in complete digital chaos and gradually stabilizes. The glitch effect intensity and type change over time, simulating the visual of corrupted data being decoded or a signal clearing up. Perfect for dramatic reveals, data decryption sequences, or transmission effects.

## Features

- **Progressive Glitch Reduction**: Intensity decreases from 100% to 0%
- **Multiple Glitch Type Transitions**: Seamlessly transitions through all 5 glitch types
- **Dual Text System**: Start with one message, end with another
- **Animated Scan Line**: Moving horizontal line effect
- **Progress Indicator**: Visual progress bars showing decode stages
- **Stage Labels**: Text indicators of current processing stage
- **Dynamic Noise Overlay**: Fades out as clarity increases
- **Scanline Effect**: Classic CRT aesthetic

## Customization

### Inputs

- **Initial Text** (required): The text shown during glitch phase (e.g., "TRANSMISSION INCOMING")
- **Final Text** (required): The clear text revealed at the end (e.g., "MESSAGE DECODED")
- **Background Color** (optional): Background color (default: #000000 - black)
- **Text Color** (optional): Text and accent color (default: #ffffff - white)

### Color Schemes

**Classic Terminal**
- Background: `#000000` (black)
- Text: `#00ff00` (green)
- Look: Classic hacker terminal

**Neon Nights**
- Background: `#0a0a0a` (near black)
- Text: `#ff00ff` (magenta)
- Look: Cyberpunk neon

**Blue Screen**
- Background: `#000033` (dark blue)
- Text: `#00ffff` (cyan)
- Look: Tech, digital

**Warning**
- Background: `#1a0000` (dark red)
- Text: `#ff0000` (red)
- Look: Alert, critical

## Technical Details

- **Duration**: 6 seconds (180 frames at 30fps)
- **Resolution**: 1920x1080 (Full HD)
- **Glitch Types Used**: All 5 types in sequence

### Glitch Type Timeline

The template transitions through glitch types as it reveals:

1. **Scramble (0-20%)**: Frames 0-36
   - Most chaotic, complete fragmentation
   - Intensity: 1.0 → 0.8

2. **Noise (20-40%)**: Frames 36-72
   - Digital corruption and static
   - Intensity: 0.8 → 0.6

3. **RGB Split (40-60%)**: Frames 72-108
   - Chromatic aberration
   - Intensity: 0.6 → 0.4

4. **Shift (60-80%)**: Frames 108-144
   - Position shifts and skewing
   - Intensity: 0.4 → 0.2

5. **Slice (80-100%)**: Frames 144-180
   - Subtle horizontal displacement
   - Intensity: 0.2 → 0

### Text Transition

- **Frames 0-126**: Initial glitched text visible
- **Frames 126-153**: Cross-fade transition
- **Frames 153-180**: Final clear text visible

### Stage Indicators

- INITIALIZING... (0-20%)
- PROCESSING... (20-40%)
- DECODING... (40-60%)
- STABILIZING... (60-80%)
- FINALIZING... (80-95%)
- COMPLETE (95-100%)

## Use Cases

- Data decryption sequences
- Transmission/signal clearing effects
- Dramatic message reveals
- Sci-fi computer interfaces
- Hacker movie effects
- Game loading screens
- Mystery unveiling
- Tech product launches
- Cybersecurity content
- Digital forensics visualization

## Animation Behavior

**Intensity Curve**
- Linear decrease from 1.0 to 0
- Smooth transition between glitch types
- No abrupt changes

**Frequency**
- Starts at 0.5 glitches/second (very frequent)
- Decreases to 0.1 glitches/second (rare)
- More glitches when corrupted, fewer when clear

## Tips

1. **Text length**: Keep both texts similar length for smooth transition
2. **Contrast**: High contrast between background and text works best
3. **Message pairing**: Make the texts related (e.g., question → answer)
4. **Color choice**: Bright text colors show glitch effects better
5. **Preview stages**: Check how text looks at different glitch intensities

## Creative Ideas

**Decryption Sequence**
```
text: "ENCRYPTED_DATA_4C2F9A"
finalText: "PASSWORD ACCEPTED"
textColor: "#00ff00"
```

**Signal Lock**
```
text: "SEARCHING..."
finalText: "SIGNAL ACQUIRED"
textColor: "#00ffff"
```

**System Boot**
```
text: "INITIALIZING SYSTEM"
finalText: "SYSTEM ONLINE"
textColor: "#ffffff"
```

**Error Recovery**
```
text: "ERROR: CORRUPTION DETECTED"
finalText: "REPAIR COMPLETE"
textColor: "#ff0000"
```

## Performance Notes

- All glitch effects are deterministic (same result every render)
- Frame-based timing ensures perfect synchronization
- Seeded randomness guarantees consistent glitches
- Optimized for video export

## Related Templates

- **glitch-title**: Static glitchy title card
- **glitch-transition**: Multiple layers with periodic glitches
- **kinetic-typography**: Dynamic text without glitch effects

## Advanced Customization

For developers wanting to modify the template:

- Adjust `progress` calculation for non-linear reveals
- Modify glitch type thresholds for different transition timing
- Change frequency formula for custom glitch patterns
- Customize stage labels and progress bar styling
- Add additional visual elements between stages
