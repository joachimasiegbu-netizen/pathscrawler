import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { buildSitemapXml } from './src/data/sitemap.ts'

// sitemap.xml from the route table in src/data/seo.ts plus every career
// page: served live in dev, written into dist/ at build.
function sitemap(): Plugin {
  return {
    name: 'pathscrawler-sitemap',
    configureServer(server) {
      server.middlewares.use('/sitemap.xml', (_req, res) => {
        res.setHeader('Content-Type', 'application/xml')
        res.end(buildSitemapXml())
      })
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: buildSitemapXml() })
    },
  }
}

export default defineConfig({
  plugins: [react(), sitemap()],
  server: {
    port: 4173,
  },
})
