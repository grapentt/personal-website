import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Include .js files for JSX transformation
      include: '**/*.{jsx,js}',
    }),
  ],

  // GitHub Pages base path
  base: '/personal-website/',

  // Path aliases for cleaner imports
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@data': path.resolve(__dirname, './src/data'),
      '@static': path.resolve(__dirname, './src/static'),
    },
  },

  // Build configuration
  build: {
    outDir: 'build', // Keep 'build' for GitHub Pages compatibility
    sourcemap: true,
    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'katex-vendor': ['katex', 'react-katex'],
        },
      },
    },
  },

  // Dev server configuration
  server: {
    port: 3000,
    open: true,
  },

  // Preview server (for testing production build)
  preview: {
    port: 3000,
  },

  // CSS configuration
  css: {
    preprocessorOptions: {
      scss: {
        // Suppress deprecation warnings for legacy SASS
        // These warn about Dart Sass 3.0 features (future version)
        // Can be addressed in future SASS modernization milestone
        silenceDeprecations: ['import', 'global-builtin', 'color-functions'],
        api: 'modern-compiler',
      },
    },
  },
});
