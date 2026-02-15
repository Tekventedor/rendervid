# Template Publishing Example

This example demonstrates how to create, validate, package, and publish a rendervid template to the template registry.

## Directory Structure

```
my-template/
  template.json       # Template manifest (required)
  composition.json    # Rendervid composition
  assets/
    logo.png          # Template assets
    background.jpg
  preview/
    thumb.png         # Preview thumbnail
    demo.mp4          # Preview video
```

## Step 1: Initialize a Template

```typescript
import { initTemplate } from '@rendervid/core';

await initTemplate('./my-template', {
  name: '@myorg/product-showcase',
  category: 'e-commerce',
  description: 'Animated product showcase with customizable colors and text',
  authorName: 'Your Name',
  width: 1080,
  height: 1080,
  fps: 30,
  duration: 15,
});
```

This creates a `template.json` scaffold and a basic `composition.json` in the specified directory.

## Step 2: Edit the Manifest

Update `template.json` with your template's inputs and file references:

```json
{
  "name": "@myorg/product-showcase",
  "version": "1.0.0",
  "description": "Animated product showcase with customizable colors and text",
  "author": { "name": "Your Name", "url": "https://yoursite.com" },
  "license": "MIT",
  "tags": ["e-commerce", "product", "showcase", "square"],
  "category": "e-commerce",
  "rendervid": {
    "minVersion": "1.0.0",
    "resolution": { "width": 1080, "height": 1080 },
    "duration": "15s",
    "fps": 30
  },
  "inputs": {
    "productName": {
      "type": "string",
      "required": true,
      "description": "Product name displayed in the video"
    },
    "productImage": {
      "type": "url",
      "required": true,
      "description": "URL to the product image"
    },
    "price": {
      "type": "string",
      "required": true,
      "description": "Product price (e.g. '$29.99')"
    },
    "accentColor": {
      "type": "color",
      "default": "#ff6b35",
      "description": "Accent color for highlights and CTAs"
    }
  },
  "preview": {
    "thumbnail": "preview/thumb.png"
  },
  "files": [
    "template.json",
    "composition.json",
    "assets/logo.png",
    "preview/thumb.png"
  ],
  "repository": "https://github.com/myorg/rendervid-templates"
}
```

## Step 3: Validate

```typescript
import { validateTemplateDir } from '@rendervid/core';

const result = await validateTemplateDir('./my-template');

if (!result.valid) {
  console.error('Template has errors:');
  for (const error of result.errors) {
    console.error(`  [${error.code}] ${error.message} (at ${error.path})`);
  }
  process.exit(1);
}

if (result.warnings.length > 0) {
  console.warn('Warnings:');
  for (const warning of result.warnings) {
    console.warn(`  [${warning.code}] ${warning.message}`);
    if (warning.suggestion) {
      console.warn(`    Suggestion: ${warning.suggestion}`);
    }
  }
}

console.log('Template is valid!');
```

## Step 4: Package & Publish

```typescript
import { packageTemplate, RegistryClient } from '@rendervid/core';

// Package the template
const { tarball, manifest } = await packageTemplate('./my-template');
console.log(`Packaged: ${manifest.name}@${manifest.version}`);
console.log(`Size: ${(tarball.length / 1024).toFixed(1)} KB`);

// Publish to registry
const client = new RegistryClient({
  registryUrl: 'https://registry.rendervid.dev',
  authToken: process.env.RENDERVID_REGISTRY_TOKEN,
});

await client.publish(tarball, manifest);
console.log('Published successfully!');
```

## Step 5: Discover & Install

```typescript
import { RegistryClient, unpackTemplate } from '@rendervid/core';

const client = new RegistryClient({
  registryUrl: 'https://registry.rendervid.dev',
});

// Search for templates
const results = await client.search('product showcase', {
  category: 'e-commerce',
  limit: 10,
});

for (const result of results) {
  console.log(`${result.name} v${result.version} - ${result.description}`);
  console.log(`  Downloads: ${result.downloads} | Tags: ${result.tags.join(', ')}`);
}

// Download and install
const tarball = await client.download('@myorg/product-showcase');
const installed = await unpackTemplate(tarball, './templates/product-showcase');
console.log(`Installed: ${installed.name}@${installed.version}`);
```

## Generating a Manifest from an Existing Template

If you already have a rendervid `Template` object, you can generate a manifest from it:

```typescript
import { generateManifest } from '@rendervid/core';

const manifest = generateManifest(existingTemplate, {
  name: '@myorg/existing-template',
  category: 'marketing',
  license: 'MIT',
  preview: { thumbnail: 'preview/thumb.png' },
  repository: 'https://github.com/myorg/templates',
});
```
