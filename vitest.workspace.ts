import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  {
    extends: './packages/core/vitest.config.ts',
    test: {
      name: 'core',
      root: './packages/core',
    },
  },
  {
    extends: './packages/player/vitest.config.ts',
    test: {
      name: 'player',
      root: './packages/player',
      environment: 'jsdom',
    },
  },
  {
    extends: './packages/renderer-browser/vitest.config.ts',
    test: {
      name: 'renderer-browser',
      root: './packages/renderer-browser',
    },
  },
  {
    extends: './packages/renderer-node/vitest.config.ts',
    test: {
      name: 'renderer-node',
      root: './packages/renderer-node',
    },
  },
  {
    extends: './packages/components/vitest.config.ts',
    test: {
      name: 'components',
      root: './packages/components',
      environment: 'jsdom',
    },
  },
  {
    extends: './packages/templates/vitest.config.ts',
    test: {
      name: 'templates',
      root: './packages/templates',
    },
  },
  {
    extends: './packages/editor/vitest.config.ts',
    test: {
      name: 'editor',
      root: './packages/editor',
      environment: 'jsdom',
    },
  },
  {
    extends: './examples/vitest.config.ts',
    test: {
      name: 'examples',
      root: './examples',
    },
  },
]);
