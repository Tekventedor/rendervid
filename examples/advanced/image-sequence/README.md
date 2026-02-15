# Image Sequence Export Example

Export a template as a sequence of individual image frames.

## Usage

```bash
# Export as PNG (default)
npx tsx render.ts

# Export as JPEG with custom quality
npx tsx render.ts --format jpeg --quality 85

# Export as WebP
npx tsx render.ts --format webp --quality 90

# Custom naming pattern with manifest
npx tsx render.ts --pattern "shot-{number}" --manifest

# Export specific frame range
npx tsx render.ts --start 0 --end 24
```

## Naming Patterns

The `namingPattern` option supports the following tokens:

- `{number}` - Zero-padded frame number (e.g., `00042`)
- `{name}` - Sanitized template name
- `{hash}` - Short MD5 hash unique to each frame
- `%05d` - Printf-style frame number formatting

## Manifest

When `--manifest` is passed, a `manifest.json` file is generated in the output directory containing metadata about all exported frames.
