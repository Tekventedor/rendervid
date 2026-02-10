/**
 * Render YouTube Subscribe lower third videos for FlowHunt channel.
 *
 * Generates 3 transparent ProRes 4444 videos, one per recent upload.
 *
 * Usage:
 *   npx tsx examples/youtube-lower-third/render.ts
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { createNodeRenderer } from '@rendervid/renderer-node';
import type { Template } from '@rendervid/core';

// ── FlowHunt channel data (scraped from YouTube) ──────────────────────
const CHANNEL = {
  name: 'FlowHunt',
  subscribers: '202 subscribers',
  avatar:
    'https://yt3.googleusercontent.com/nq4JoCO94W0R6672Mlnla3SZcO83IAaM12lh36O942v1NnHRGWo55dTyqWqaY0vv6sm_k8K7FQ=s240-c-k-c0x00ffffff-no-rj',
};

const VIDEOS = [
  {
    id: 'PYZaBz04SwE',
    title: 'Automate WIX Blog Writing with FlowHunt -- AI Article Generation',
  },
  {
    id: 'H9SOXl7sOIc',
    title: 'FlowHunt Desktop App Demo: Build Powerful AI Automations at Scale',
  },
  {
    id: 'jA77AO7o6QI',
    title: 'THIS OPENSOURCE FRAMEWORK IS ALL YOU NEED TO MAKE YOUR PYTHON APPLICATION RELIABLE!',
  },
];

// ── Main ───────────────────────────────────────────────────────────────
async function main() {
  const templatePath = resolve(__dirname, 'template.json');
  const template: Template = JSON.parse(readFileSync(templatePath, 'utf-8'));

  const renderer = createNodeRenderer({
    gpu: { rendering: true, encoding: 'auto', fallback: true },
  });

  for (const video of VIDEOS) {
    const slug = video.id;
    const outputPath = resolve(__dirname, `lower-third-${slug}.mov`);

    console.log(`\n── Rendering: ${video.title}`);
    console.log(`   Output:    ${outputPath}`);

    const result = await renderer.renderVideo({
      template,
      inputs: {
        channelName: CHANNEL.name,
        subscriberCount: CHANNEL.subscribers,
        avatarUrl: CHANNEL.avatar,
        videoTitle: video.title,
      },
      outputPath,
      codec: 'prores',
      pixelFormat: 'yuva444p10le',
      onProgress: (p) => {
        process.stdout.write(
          `\r   [${p.phase}] ${p.percent.toFixed(1)}%`
        );
      },
    });

    console.log(
      `\n   Done in ${(result.renderTime / 1000).toFixed(1)}s — ${(result.fileSize / 1024 / 1024).toFixed(1)} MB`
    );
  }

  console.log('\n✓ All 3 videos rendered.\n');
}

main().catch((err) => {
  console.error('Render failed:', err);
  process.exit(1);
});
