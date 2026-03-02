/**
 * Documentation module for Rendervid.
 * Provides structured documentation for all engine features, accessible via get_docs MCP tool.
 */

import type { DocResult } from './types.js';

// Topic handlers
import { getOverviewDocs } from './topics/overview.js';
import { getTemplateDocs } from './topics/template.js';
import { getSceneDocs } from './topics/scene.js';
import { getLayerBaseDocs } from './topics/layer-base.js';
import { getTextLayerDocs } from './topics/layers/text.js';
import { getImageLayerDocs } from './topics/layers/image.js';
import { getVideoLayerDocs } from './topics/layers/video.js';
import { getShapeLayerDocs } from './topics/layers/shape.js';
import { getAudioLayerDocs } from './topics/layers/audio.js';
import { getGroupLayerDocs } from './topics/layers/group.js';
import { getLottieLayerDocs } from './topics/layers/lottie.js';
import { getGifLayerDocs } from './topics/layers/gif.js';
import { getCaptionLayerDocs } from './topics/layers/caption.js';
import { getCanvasLayerDocs } from './topics/layers/canvas.js';
import { getThreeLayerDocs } from './topics/layers/three.js';
import { getCustomLayerDocs } from './topics/layers/custom.js';
import { getAnimationsDocs } from './topics/animations.js';
import { getEasingsDocs } from './topics/easings.js';
import { getTransitionsDocs } from './topics/transitions.js';
import { getFiltersDocs } from './topics/filters.js';
import { getFontsDocs } from './topics/fonts.js';
import { getStyleDocs } from './topics/style.js';
import { getMotionBlurDocs } from './topics/motion-blur.js';
import { getInputsDocs } from './topics/inputs.js';

const topicHandlers: Record<string, () => DocResult> = {
  'overview': getOverviewDocs,
  'template': getTemplateDocs,
  'scene': getSceneDocs,
  'layer': getLayerBaseDocs,
  'layer/text': getTextLayerDocs,
  'layer/image': getImageLayerDocs,
  'layer/video': getVideoLayerDocs,
  'layer/shape': getShapeLayerDocs,
  'layer/audio': getAudioLayerDocs,
  'layer/group': getGroupLayerDocs,
  'layer/lottie': getLottieLayerDocs,
  'layer/gif': getGifLayerDocs,
  'layer/caption': getCaptionLayerDocs,
  'layer/canvas': getCanvasLayerDocs,
  'layer/three': getThreeLayerDocs,
  'layer/custom': getCustomLayerDocs,
  'animations': getAnimationsDocs,
  'easings': getEasingsDocs,
  'transitions': getTransitionsDocs,
  'filters': getFiltersDocs,
  'fonts': getFontsDocs,
  'style': getStyleDocs,
  'motion-blur': getMotionBlurDocs,
  'inputs': getInputsDocs,
};

/**
 * Get documentation for a specific topic.
 *
 * @param topic - Topic identifier (e.g., "overview", "layer/text", "animations")
 * @returns Structured documentation for the topic
 * @throws Error if the topic is not recognized
 */
export function getDocumentation(topic: string): DocResult {
  const handler = topicHandlers[topic];
  if (!handler) {
    const available = Object.keys(topicHandlers).sort();
    throw new Error(
      `Unknown documentation topic: "${topic}". Available topics: ${available.join(', ')}`
    );
  }
  return handler();
}

/**
 * Get all available documentation topic names.
 */
export function getDocumentationTopics(): string[] {
  return Object.keys(topicHandlers).sort();
}

export type { DocResult, DocSection, DocProperty } from './types.js';
