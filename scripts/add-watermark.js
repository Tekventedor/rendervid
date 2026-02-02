#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Watermark layer definition
const WATERMARK_LAYER = {
  id: 'watermark',
  type: 'text',
  position: { x: 1520, y: 20 },
  size: { width: 380, height: 60 },
  props: {
    text: 'RenderVid by\nFlowHunt.io',
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'right',
    lineHeight: 1.3,
    opacity: 0.7,
    textShadow: '0 2px 4px rgba(0,0,0,0.5)'
  }
};

/**
 * Checks if a layer is already a watermark
 */
function isWatermarkLayer(layer) {
  return layer.id === 'watermark' ||
         (layer.type === 'text' &&
          layer.props?.text?.includes('RenderVid') &&
          layer.props?.text?.includes('FlowHunt'));
}

/**
 * Checks if a scene already has a watermark
 */
function hasWatermark(scene) {
  return scene.layers?.some(isWatermarkLayer);
}

/**
 * Adds watermark to a scene (as the top layer)
 */
function addWatermarkToScene(scene) {
  if (hasWatermark(scene)) {
    return { scene, added: false, reason: 'already exists' };
  }

  // Add watermark as the last layer (top layer in z-order)
  scene.layers.push({ ...WATERMARK_LAYER });

  return { scene, added: true };
}

/**
 * Process a single template file
 */
function processTemplate(templatePath) {
  try {
    // Read template
    const content = fs.readFileSync(templatePath, 'utf8');
    const template = JSON.parse(content);

    // Check if template has composition and scenes
    if (!template.composition?.scenes) {
      return {
        success: false,
        path: templatePath,
        error: 'No scenes found'
      };
    }

    let scenesUpdated = 0;
    let scenesSkipped = 0;
    const sceneResults = [];

    // Process each scene
    template.composition.scenes = template.composition.scenes.map((scene) => {
      const result = addWatermarkToScene(scene);
      sceneResults.push({
        sceneId: scene.id,
        added: result.added,
        reason: result.reason
      });

      if (result.added) {
        scenesUpdated++;
      } else {
        scenesSkipped++;
      }

      return result.scene;
    });

    // Write back if any changes were made
    if (scenesUpdated > 0) {
      fs.writeFileSync(
        templatePath,
        JSON.stringify(template, null, 2) + '\n',
        'utf8'
      );
    }

    return {
      success: true,
      path: templatePath,
      scenesUpdated,
      scenesSkipped,
      sceneResults
    };
  } catch (error) {
    return {
      success: false,
      path: templatePath,
      error: error.message
    };
  }
}

/**
 * Find all template.json files in a directory
 */
function findTemplates(dir) {
  const templates = [];

  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name === 'template.json') {
        templates.push(fullPath);
      }
    }
  }

  walk(dir);
  return templates;
}

/**
 * Main function
 */
function main() {
  const examplesDir = path.join(__dirname, '..', 'examples');

  console.log('🔍 Finding all template.json files...\n');
  const templates = findTemplates(examplesDir);

  console.log(`Found ${templates.length} templates\n`);
  console.log('─'.repeat(80));

  let totalTemplatesUpdated = 0;
  let totalScenesUpdated = 0;
  let totalScenesSkipped = 0;
  const errors = [];

  // Process each template
  templates.forEach((templatePath) => {
    const relativePath = path.relative(examplesDir, templatePath);
    const result = processTemplate(templatePath);

    if (result.success) {
      if (result.scenesUpdated > 0) {
        console.log(`✅ ${relativePath}`);
        console.log(`   Updated: ${result.scenesUpdated} scenes`);
        if (result.scenesSkipped > 0) {
          console.log(`   Skipped: ${result.scenesSkipped} scenes (already have watermark)`);
        }
        totalTemplatesUpdated++;
        totalScenesUpdated += result.scenesUpdated;
      } else {
        console.log(`⏭️  ${relativePath}`);
        console.log(`   Skipped: All ${result.scenesSkipped} scenes already have watermark`);
      }
      totalScenesSkipped += result.scenesSkipped;
    } else {
      console.log(`❌ ${relativePath}`);
      console.log(`   Error: ${result.error}`);
      errors.push({ path: relativePath, error: result.error });
    }
    console.log('');
  });

  console.log('─'.repeat(80));
  console.log('\n📊 Summary:');
  console.log(`   Templates processed: ${templates.length}`);
  console.log(`   Templates updated: ${totalTemplatesUpdated}`);
  console.log(`   Templates skipped: ${templates.length - totalTemplatesUpdated - errors.length}`);
  console.log(`   Scenes updated: ${totalScenesUpdated}`);
  console.log(`   Scenes skipped: ${totalScenesSkipped}`);

  if (errors.length > 0) {
    console.log(`   Errors: ${errors.length}`);
    console.log('\n⚠️  Errors:');
    errors.forEach(({ path, error }) => {
      console.log(`   - ${path}: ${error}`);
    });
  }

  console.log('\n✨ Done!');

  if (totalTemplatesUpdated > 0) {
    console.log('\n💡 Next steps:');
    console.log('   1. Review the changes: git diff examples/');
    console.log('   2. Regenerate videos: npm run generate:videos');
    console.log('   3. Commit the changes: git add . && git commit -m "Add watermarks to all examples"');
  }
}

// Run the script
main();
