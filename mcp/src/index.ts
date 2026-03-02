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
import {
  startRenderAsyncTool,
  checkRenderStatusTool,
  listRenderJobsTool,
  executeStartRenderAsync,
  executeCheckRenderStatus,
  executeListRenderJobs,
} from './tools/render_video_async.js';
import { validateTemplateTool, executeValidateTemplate } from './tools/validate_template.js';
import { getDocsTool, executeGetDocs } from './tools/get_docs.js';
import { getExampleTool, executeGetExample } from './tools/get_example.js';
import { getComponentDefaultsTool, executeGetComponentDefaults } from './tools/get_component_defaults.js';

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
          startRenderAsyncTool,
          checkRenderStatusTool,
          listRenderJobsTool,
          renderImageTool,
          validateTemplateTool,
          getDocsTool,
          getExampleTool,
          getComponentDefaultsTool,
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

          case 'start_render_async':
            result = await executeStartRenderAsync(args);
            break;

          case 'check_render_status':
            result = await executeCheckRenderStatus(args);
            break;

          case 'list_render_jobs':
            result = await executeListRenderJobs(args);
            break;

          case 'render_image':
            result = await executeRenderImage(args);
            break;

          case 'validate_template':
            result = await executeValidateTemplate(args);
            break;

          case 'get_docs':
            result = await executeGetDocs(args);
            break;

          case 'get_example':
            result = await executeGetExample(args);
            break;

          case 'get_component_defaults':
            result = await executeGetComponentDefaults(args);
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

        // Defensive error handling - ensure we always return something
        let errorMessage: string;
        let errorStack: string | undefined;

        try {
          errorMessage = error instanceof Error ? error.message : String(error);
          errorStack = error instanceof Error ? error.stack : undefined;
        } catch (stringifyError) {
          errorMessage = 'Failed to serialize error message';
          errorStack = undefined;
        }

        // Construct error response with safe JSON serialization
        let errorResponse: string;
        try {
          errorResponse = JSON.stringify({
            success: false,
            error: 'Tool execution failed',
            tool: name,
            details: errorMessage,
            stack: errorStack,
            timestamp: new Date().toISOString(),
          }, null, 2);
        } catch (jsonError) {
          // Last resort: return plain text error
          errorResponse = `{"success": false, "error": "Tool execution failed", "tool": "${name}", "details": "Failed to serialize error"}`;
        }

        return {
          content: [
            {
              type: 'text',
              text: errorResponse,
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

    // Critical: Handle unhandled promise rejections
    // Without this, async errors can crash the process without returning a response
    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled Promise Rejection', {
        reason: reason instanceof Error ? reason.message : String(reason),
        stack: reason instanceof Error ? reason.stack : undefined,
      });
      // Don't crash - the MCP server must stay running
    });

    // Critical: Handle uncaught exceptions
    // This prevents the process from crashing on unexpected errors
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception', {
        message: error.message,
        stack: error.stack,
      });
      // Don't crash - the MCP server must stay running
    });

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
        'get_docs',
        'get_example',
        'get_component_defaults',
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
