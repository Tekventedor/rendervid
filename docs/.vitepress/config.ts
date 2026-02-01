import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Rendervid',
  description: 'Stateless video/image rendering engine with JSON templates and React component support',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
  ],

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'Guide', link: '/getting-started/installation' },
      { text: 'API', link: '/api/core/engine' },
      { text: 'Templates', link: '/templates/schema' },
      { text: 'Examples', link: '/examples/' },
      {
        text: 'Packages',
        items: [
          { text: '@rendervid/core', link: '/api/core/engine' },
          { text: '@rendervid/renderer-browser', link: '/api/renderer-browser/renderer' },
          { text: '@rendervid/renderer-node', link: '/api/renderer-node/renderer' },
          { text: '@rendervid/player', link: '/api/player/player' },
          { text: '@rendervid/templates', link: '/api/templates/overview' },
        ],
      },
    ],

    sidebar: {
      '/getting-started/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Installation', link: '/getting-started/installation' },
            { text: 'Quick Start', link: '/getting-started/quick-start' },
            { text: 'First Template', link: '/getting-started/first-template' },
            { text: 'Concepts', link: '/getting-started/concepts' },
          ],
        },
      ],
      '/api/': [
        {
          text: '@rendervid/core',
          collapsed: false,
          items: [
            { text: 'RendervidEngine', link: '/api/core/engine' },
            { text: 'Types', link: '/api/core/types' },
            { text: 'Validation', link: '/api/core/validation' },
            { text: 'Capabilities', link: '/api/core/capabilities' },
          ],
        },
        {
          text: '@rendervid/renderer-browser',
          collapsed: false,
          items: [
            { text: 'BrowserRenderer', link: '/api/renderer-browser/renderer' },
            { text: 'Encoder', link: '/api/renderer-browser/encoder' },
          ],
        },
        {
          text: '@rendervid/renderer-node',
          collapsed: false,
          items: [
            { text: 'NodeRenderer', link: '/api/renderer-node/renderer' },
          ],
        },
        {
          text: '@rendervid/player',
          collapsed: false,
          items: [
            { text: 'Player Component', link: '/api/player/player' },
          ],
        },
        {
          text: '@rendervid/templates',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/api/templates/overview' },
            { text: 'Themes', link: '/api/templates/themes' },
            { text: 'Scene Templates', link: '/api/templates/scenes' },
          ],
        },
      ],
      '/templates/': [
        {
          text: 'Template Reference',
          items: [
            { text: 'Template Schema', link: '/templates/schema' },
            { text: 'Layers', link: '/templates/layers' },
            { text: 'Animations', link: '/templates/animations' },
            { text: 'Transitions', link: '/templates/transitions' },
            { text: 'Filters', link: '/templates/filters' },
            { text: 'Inputs', link: '/templates/inputs' },
            { text: 'Styles', link: '/templates/styles' },
          ],
        },
      ],
      '/guides/': [
        {
          text: 'Guides',
          items: [
            { text: 'Custom Components', link: '/guides/custom-components' },
            { text: 'Using Tailwind CSS', link: '/guides/tailwind' },
            { text: 'AI Integration', link: '/guides/ai-integration' },
            { text: 'Performance Tips', link: '/guides/performance' },
            { text: 'Troubleshooting', link: '/guides/troubleshooting' },
          ],
        },
      ],
      '/examples/': [
        {
          text: 'Examples',
          items: [
            { text: 'Overview', link: '/examples/' },
            { text: 'Basic Video', link: '/examples/basic-video' },
            { text: 'Social Media', link: '/examples/social-media' },
            { text: 'Data Visualization', link: '/examples/data-visualization' },
            { text: 'Custom Components', link: '/examples/custom-component' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/QualityUnit/rendervid' },
    ],

    footer: {
      message: 'Released under the FlowHunt Attribution License',
      copyright: 'Copyright 2024 QualityUnit',
    },

    search: {
      provider: 'local',
    },

    editLink: {
      pattern: 'https://github.com/QualityUnit/rendervid/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
  },
});
