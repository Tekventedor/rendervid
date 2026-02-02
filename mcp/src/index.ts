#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { createLogger } from './utils/logger.js';
import { renderVideoTool, executeRenderVideo } from './tools/render_video.js';
import { renderImageTool, executeRenderImage } from './tools/render_image.js';
import { validateTemplateTool, executeValidateTemplate } from './tools/validate_template.js';
import { getCapabilitiesTool, executeGetCapabilities } from './tools/get_capabilities.js';
import { listExamplesTool, executeListExamples } from './tools/list_examples.js';
import { getExampleTool, executeGetExample } from './tools/get_example.js';
import { getComponentDocsTool, executeGetComponentDocs } from './tools/get_component_docs.js';
import { getAnimationDocsTool, executeGetAnimationDocs } from './tools/get_animation_docs.js';
import { getEasingDocsTool, executeGetEasingDocs } from './tools/get_easing_docs.js';

const logger = createLogger('mcp-server');

/**
 * Rendervid MCP Server
 *
 * Exposes Rendervid video/image generation capabilities to AI agents via Model Context Protocol.
 */
class RendervidMcpServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'rendervid-mcp-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
    this.setupErrorHandlers();
  }

  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      logger.info('Listing tools');

      return {
        tools: [
          renderVideoTool,
          renderImageTool,
          validateTemplateTool,
          getCapabilitiesTool,
          listExamplesTool,
          getExampleTool,
          getComponentDocsTool,
          getAnimationDocsTool,
          getEasingDocsTool,
        ],
      };
    });

    // Execute tool
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      logger.info('Tool called', { name });

      try {
        let result: string;

        switch (name) {
          case 'render_video':
            result = await executeRenderVideo(args);
            break;

          case 'render_image':
            result = await executeRenderImage(args);
            break;

          case 'validate_template':
            result = await executeValidateTemplate(args);
            break;

          case 'get_capabilities':
            result = await executeGetCapabilities();
            break;

          case 'list_examples':
            result = await executeListExamples(args);
            break;

          case 'get_example':
            result = await executeGetExample(args);
            break;

          case 'get_component_docs':
            result = await executeGetComponentDocs(args);
            break;

          case 'get_animation_docs':
            result = await executeGetAnimationDocs(args);
            break;

          case 'get_easing_docs':
            result = await executeGetEasingDocs(args);
            break;

          default:
            throw new Error(`Unknown tool: ${name}`);
        }

        return {
          content: [
            {
              type: 'text',
              text: result,
            },
          ],
        };
      } catch (error) {
        logger.error('Tool execution failed', { name, error });

        const errorMessage = error instanceof Error ? error.message : String(error);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: 'Tool execution failed',
                tool: name,
                details: errorMessage,
              }, null, 2),
            },
          ],
          isError: true,
        };
      }
    });
  }

  private setupErrorHandlers(): void {
    this.server.onerror = (error) => {
      logger.error('Server error', { error });
    };

    process.on('SIGINT', async () => {
      logger.info('Received SIGINT, shutting down');
      await this.server.close();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      logger.info('Received SIGTERM, shutting down');
      await this.server.close();
      process.exit(0);
    });
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    logger.info('Rendervid MCP Server started', {
      transport: 'stdio',
      tools: [
        'render_video',
        'render_image',
        'validate_template',
        'get_capabilities',
        'list_examples',
        'get_example',
        'get_component_docs',
        'get_animation_docs',
        'get_easing_docs',
      ],
    });
  }
}

// Start the server
const server = new RendervidMcpServer();
server.start().catch((error) => {
  logger.error('Failed to start server', { error });
  process.exit(1);
});
