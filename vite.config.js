import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    // MDX must run before React so that .mdx files become JSX first.
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [rehypeKatex],
        providerImportSource: '@mdx-js/react',
      }),
    },
    react({ include: /\.(jsx|js|mdx|md|tsx|ts)$/ }),
  ],

  // The site is served from https://grapentt.github.io/personal-website/
  base: '/personal-website/',

  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },

  build: {
    outDir: 'build',
    sourcemap: false,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          katex: ['katex'],
        },
      },
    },
  },

  server: { port: 3000, open: false },
  preview: { port: 3000 },
});
