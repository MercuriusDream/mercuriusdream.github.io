import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Static pages live in public/<name>/index.html. GitHub Pages serves them at /<name>/;
// the dev server would fall back to the app, so mirror Pages here.
function publicDirectoryIndex() {
  return {
    name: 'public-directory-index',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const [pathname, query] = req.url.split('?');
        if (pathname === '/' || pathname.includes('.')) return next();
        const dir = pathname.endsWith('/') ? pathname : `${pathname}/`;
        if (!existsSync(join(server.config.publicDir, dir, 'index.html'))) return next();
        const search = query ? `?${query}` : '';
        if (dir !== pathname) {
          res.writeHead(301, { Location: dir + search });
          return res.end();
        }
        req.url = `${dir}index.html${search}`;
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), publicDirectoryIndex()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
});
