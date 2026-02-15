# Template Marketplace & Registry

The rendervid Template Marketplace provides a registry system for publishing, discovering, and installing reusable video templates.

## Overview

The template registry allows you to:

- **Publish** templates as versioned packages to a registry
- **Search** for templates by keyword, category, or tags
- **Install** templates from the registry into your project
- **Validate** template packages before publishing

## Template Manifest

Every publishable template requires a `template.json` manifest file:

```json
{
  "name": "@your-scope/template-name",
  "version": "1.0.0",
  "description": "A short description of your template",
  "author": {
    "name": "Your Name",
    "url": "https://yoursite.com"
  },
  "license": "MIT",
  "tags": ["social-media", "instagram", "story"],
  "category": "social-media",
  "rendervid": {
    "minVersion": "1.0.0",
    "resolution": { "width": 1080, "height": 1920 },
    "duration": "15s",
    "fps": 30
  },
  "inputs": {
    "title": {
      "type": "string",
      "required": true,
      "description": "Main title text"
    },
    "backgroundColor": {
      "type": "color",
      "default": "#1a1a2e",
      "description": "Background color"
    }
  },
  "preview": {
    "thumbnail": "preview/thumb.png",
    "video": "preview/demo.mp4",
    "gif": "preview/demo.gif"
  },
  "files": [
    "template.json",
    "composition.json",
    "assets/logo.png",
    "preview/thumb.png"
  ],
  "repository": "https://github.com/you/your-templates"
}
```

## Categories

Templates are organized into the following categories:

| Category | Description |
|----------|-------------|
| `social-media` | Instagram, TikTok, YouTube posts and stories |
| `presentation` | Slides, pitch decks, educational content |
| `marketing` | Ads, promotions, product showcases |
| `education` | Tutorials, explainers, course content |
| `entertainment` | Music videos, intros, outros |
| `e-commerce` | Product listings, reviews, unboxing |
| `news` | News tickers, breaking news, weather |
| `sports` | Highlights, scoreboards, player stats |
| `music` | Visualizers, lyrics, album art |
| `corporate` | Internal comms, onboarding, reports |
| `event` | Invitations, countdowns, announcements |
| `real-estate` | Property tours, listings, floor plans |
| `other` | Everything else |

## API Usage

### Initialize a New Template

```typescript
import { initTemplate } from '@rendervid/core';

await initTemplate('./my-template', {
  name: '@myorg/intro-animation',
  category: 'entertainment',
  description: 'Animated intro sequence',
  authorName: 'Jane Doe',
  width: 1920,
  height: 1080,
  fps: 30,
  duration: 5,
});
```

### Validate a Template Directory

```typescript
import { validateTemplateDir } from '@rendervid/core';

const result = await validateTemplateDir('./my-template');
if (!result.valid) {
  console.error('Validation errors:', result.errors);
} else {
  console.log('Template is valid!');
  if (result.warnings.length > 0) {
    console.warn('Warnings:', result.warnings);
  }
}
```

### Validate a Manifest Object

```typescript
import { validateManifest } from '@rendervid/core';

const result = validateManifest(manifest);
console.log(result.valid); // true/false
console.log(result.errors); // validation errors
console.log(result.warnings); // validation warnings
```

### Package a Template

```typescript
import { packageTemplate } from '@rendervid/core';

const { tarball, manifest } = await packageTemplate('./my-template');
// tarball is a gzipped tar Buffer ready for publishing
```

### Unpack a Template

```typescript
import { unpackTemplate } from '@rendervid/core';

const manifest = await unpackTemplate(tarball, './installed-templates/my-template');
console.log('Installed:', manifest.name, manifest.version);
```

### Generate Manifest from Existing Template

```typescript
import { generateManifest } from '@rendervid/core';
import type { Template } from '@rendervid/core';

const template: Template = { /* your template */ };
const manifest = generateManifest(template, {
  name: '@myorg/my-template',
  category: 'social-media',
  license: 'MIT',
});
```

### Registry Client

```typescript
import { RegistryClient } from '@rendervid/core';

const client = new RegistryClient({
  registryUrl: 'https://registry.rendervid.dev',
  authToken: 'your-auth-token', // required for publish/unpublish
});

// Search for templates
const results = await client.search('instagram story', {
  category: 'social-media',
  tags: ['instagram'],
  limit: 20,
});

// Get package details
const pkg = await client.getPackage('@rendervid/instagram-story');
const specificVersion = await client.getPackage('@rendervid/instagram-story', '2.0.0');

// List popular templates
const popular = await client.listPopular(10);

// List categories
const categories = await client.listCategories();

// Publish a template (requires auth)
const { tarball, manifest } = await packageTemplate('./my-template');
await client.publish(tarball, manifest);

// Unpublish a version (requires auth)
await client.unpublish('@myorg/my-template', '1.0.0');

// Download a template tarball
const downloadedTarball = await client.download('@rendervid/instagram-story');
const installedManifest = await unpackTemplate(downloadedTarball, './templates/instagram-story');
```

### Error Handling

```typescript
import { RegistryClient, RegistryError } from '@rendervid/core';

try {
  const pkg = await client.getPackage('nonexistent');
} catch (err) {
  if (err instanceof RegistryError) {
    console.error(`Registry error (${err.statusCode}): ${err.message}`);
  }
}
```

## Publishing Workflow

1. **Create** your template directory with a `template.json` manifest
2. **Validate** with `validateTemplateDir()`
3. **Package** with `packageTemplate()`
4. **Publish** with `client.publish(tarball, manifest)`

```typescript
import {
  validateTemplateDir,
  packageTemplate,
  RegistryClient,
} from '@rendervid/core';

async function publishTemplate(dir: string) {
  // Step 1: Validate
  const validation = await validateTemplateDir(dir);
  if (!validation.valid) {
    throw new Error(`Validation failed:\n${validation.errors.map(e => e.message).join('\n')}`);
  }

  // Step 2: Package
  const { tarball, manifest } = await packageTemplate(dir);
  console.log(`Packaged ${manifest.name}@${manifest.version} (${tarball.length} bytes)`);

  // Step 3: Publish
  const client = new RegistryClient({
    registryUrl: 'https://registry.rendervid.dev',
    authToken: process.env.RENDERVID_TOKEN,
  });

  await client.publish(tarball, manifest);
  console.log(`Published ${manifest.name}@${manifest.version}`);
}
```

## Types Reference

All types are exported from `@rendervid/core`:

- `TemplateManifest` - Full manifest for a publishable template
- `RegistrySearchResult` - Search result summary
- `RegistryPackage` - Full package details (extends TemplateManifest)
- `RegistryClientOptions` - Options for creating a RegistryClient
- `SearchOptions` - Options for search queries
- `InitTemplateOptions` - Options for template initialization
- `TemplateCategory` - Union type of valid category strings
