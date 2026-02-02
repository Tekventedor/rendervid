import { defineConfig } from 'tsup';

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
    // Bundle React and ReactDOM since they need to be available in the browser
    external: [],
    noExternal: ['react', 'react-dom', '@rendervid/renderer-browser', '@rendervid/core', '@rendervid/components'],
    esbuildOptions(options) {
      // Ensure globalName is set for IIFE format
      options.globalName = 'RendervidBrowserRenderer';

      // Use automatic JSX runtime (matches component packages)
      // This ensures consistent JSX transformation across all bundled code
      options.jsx = 'automatic';

      // Ensure React modules are deduplicated
      options.conditions = ['module', 'import', 'default'];
      options.mainFields = ['module', 'main'];
    },
  },
]);
