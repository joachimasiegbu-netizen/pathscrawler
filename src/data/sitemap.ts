// Builds sitemap.xml: every ROUTE_SEO row marked sitemap: true, plus one
// entry per career page. Run by the sitemap plugin in vite.config.ts (served
// at /sitemap.xml in dev, written into dist/ at build) - not imported by the
// app, so the career data it reads stays out of anything RouteMeta pulls in.
// Explicit extensions because vite.config.ts loads this file, and Vite's
// native config loader (its planned default) won't resolve bare paths.
import demoCareers from './demoCareers.js'
import { ROUTE_SEO, SITE_URL } from './seo.ts'

export function buildSitemapXml(): string {
  const paths = [
    ...ROUTE_SEO.filter((route) => route.sitemap).map((route) => route.path),
    ...demoCareers.map((career) => `/career/${career.id}`),
  ]
  const urls = paths.map((path) => `  <url><loc>${SITE_URL}${path}</loc></url>`).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}
