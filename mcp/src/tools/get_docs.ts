import { getDocumentation, getDocumentationTopics } from '@rendervid/core';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('get_docs');

const availableTopics = [
  'overview', 'template', 'scene', 'layer',
  'layer/text', 'layer/image', 'layer/video', 'layer/shape',
  'layer/audio', 'layer/group', 'layer/lottie', 'layer/gif',
  'layer/caption', 'layer/canvas', 'layer/three', 'layer/custom',
  'animations', 'easings', 'transitions', 'filters',
  'fonts', 'style', 'motion-blur', 'inputs',
];

export const getDocsTool = {
  name: 'get_docs',
  description: `Get documentation for a specific Rendervid topic. Returns structured docs with properties, types, defaults, and examples.

Start with "overview" for a summary, then drill into specific topics as needed.

Topics: ${availableTopics.join(', ')}`,
  inputSchema: {
    type: 'object',
    properties: {
      topic: {
        type: 'string',
        description: `Documentation topic. Available: ${availableTopics.join(', ')}`,
        enum: availableTopics,
      },
    },
    required: ['topic'],
  },
};

export async function executeGetDocs(args: unknown): Promise<string> {
  try {
    const { topic } = args as { topic?: string };

    if (!topic) {
      return JSON.stringify({
        error: 'Missing required parameter: topic',
        availableTopics: getDocumentationTopics(),
        hint: 'Start with get_docs({ topic: "overview" }) for a summary of all capabilities.',
      }, null, 2);
    }

    logger.info('Getting docs', { topic });

    const docs = getDocumentation(topic);

    logger.info('Docs retrieved', { topic, title: docs.title });

    return JSON.stringify(docs, null, 2);
  } catch (error) {
    logger.error('Failed to get docs', { error });

    const errorMessage = error instanceof Error ? error.message : String(error);

    return JSON.stringify({
      error: 'Failed to get documentation',
      details: errorMessage,
      availableTopics: getDocumentationTopics(),
    }, null, 2);
  }
}
