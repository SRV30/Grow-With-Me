import express from 'express'
import { Project } from '../models/Project.js'

const router = express.Router()
const siteUrl = process.env.CLIENT_URL || process.env.FRONTEND_URL || 'https://growwithmeayush.vercel.app'

router.get('/sitemap.xml', async (_req, res) => {
  try {
    const projects = await Project.find({ published: true }).select('slug updatedAt').lean()
    const urls = [
      { loc: `${siteUrl}/`, priority: '1.0' },
      { loc: `${siteUrl}/work`, priority: '0.9' },
      ...projects.map(project => ({ loc: `${siteUrl}/work/${project.slug}`, priority: '0.7', lastmod: project.updatedAt }))
    ]
    const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url => `<url><loc>${escapeXml(url.loc)}</loc>${url.lastmod ? `<lastmod>${new Date(url.lastmod).toISOString()}</lastmod>` : ''}<priority>${url.priority}</priority></url>`).join('')}</urlset>`
    res.type('application/xml').send(body)
  } catch {
    res.status(500).type('application/xml').send('<?xml version="1.0" encoding="UTF-8"?><error>Sitemap unavailable</error>')
  }
})

function escapeXml(value) { return String(value).replace(/[<>&'"]/g, char => ({ '<':'&lt;', '>':'&gt;', '&':'&amp;', "'":'&apos;', '"':'&quot;' }[char])) }
export default router
