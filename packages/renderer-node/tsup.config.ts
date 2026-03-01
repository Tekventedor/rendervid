import { defineConfig } from 'tsup';
import type { Plugin } from 'esbuild';

/**
 * esbuild plugin that shims Node.js built-in modules for browser builds.
 * @rendervid/core re-exports utilities (template-packager, audio, etc.) that
 * import fs/path/zlib, but those code paths are never reached in the browser
 * bundle injected into Puppeteer.
 */
const nodeBuiltinsShim: Plugin = {
  name: 'node-builtins-shim',
  setup(build) {
    const builtins = ['fs', 'path', 'zlib', 'os', 'crypto', 'stream', 'util', 'url', 'http', 'https', 'net', 'tls', 'child_process', 'worker_threads'];
    const filter = new RegExp(`^(node:)?(${builtins.join('|')})$`);

    build.onResolve({ filter }, (args) => ({
      path: args.path,
      namespace: 'node-builtin-shim',
    }));

    build.onLoad({ filter: /.*/, namespace: 'node-builtin-shim' }, () => ({
      contents: 'export default {};',
      loader: 'js',
    }));
  },
};

export default defineConfig([
  // Main package build
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    shims: true, // Add shims for __dirname and other Node.js globals in ESM
    external: ['puppeteer', 'fluent-ffmpeg', 'react', 'react-dom'],
  },
  // Browser bundle for injection into Puppeteer
  {
    entry: {
      'browser-renderer': 'src/browser-bundle.tsx',
    },
    format: ['iife'],
    outDir: 'dist',
    platform: 'browser',
    target: 'es2020',
    minify: true,
    sourcemap: false,
    splitting: false,
    // Bundle React, ReactDOM, Three.js, and all rendervid packages
    // These need to be available in the browser context
    external: [],
    noExternal: [
      'react',
      'react-dom',
      '@rendervid/renderer-browser',
      '@rendervid/core',
      '@rendervid/components',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
    ],
    esbuildPlugins: [nodeBuiltinsShim],
    esbuildOptions(options) {
      // Ensure globalName is set for IIFE format
      options.globalName = 'RendervidBrowserRenderer';

      // Use automatic JSX runtime (matches component packages)
      // This ensures consistent JSX transformation across all bundled code
      options.jsx = 'automatic';

      // Ensure React modules are deduplicated
      options.conditions = ['module', 'import', 'default'];
      options.mainFields = ['module', 'main'];

      // Enable .js extension resolution for Three.js examples
      options.resolveExtensions = ['.tsx', '.ts', '.jsx', '.js', '.json'];
    },
  },
]);
