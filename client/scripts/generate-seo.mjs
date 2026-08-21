import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const rawSiteUrl =
  process.env.VITE_SITE_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  'https://grow-with-me.vercel.app'

const siteUrl = `${rawSiteUrl.startsWith('http') ? rawSiteUrl : `https://${rawSiteUrl}`}`.replace(/\/$/, '')

const dist = resolve(process.cwd(), 'dist')
const indexPath = resolve(dist, 'index.html')

const routes = ['/', '/work']
const urls = routes.map((path) => `${siteUrl}${path}`)

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
  .map((url) => `  <url><loc>${url}</loc></url>`)
  .join('\n')}\n</urlset>\n`

const robots = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /admin/\n\nSitemap: ${siteUrl}/sitemap.xml\n`

await writeFile(resolve(dist, 'sitemap.xml'), sitemap, 'utf8')
await writeFile(resolve(dist, 'robots.txt'), robots, 'utf8')

let html = await readFile(indexPath, 'utf8')
html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${siteUrl}/" />`)
html = html.replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${siteUrl}/" />`)
await writeFile(indexPath, html, 'utf8')

console.log(`SEO files generated for ${siteUrl}`)
