import { useEffect } from 'react'

const SITE = 'Grow With Me'
const DEFAULT_DESCRIPTION = 'Grow With Me helps businesses build a professional digital presence through social media, creative content, video editing, graphic design and digital marketing.'

export default function SEO({ title, description = DEFAULT_DESCRIPTION, image, path = '/' }) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE}` : `${SITE} — Creative Digital Solutions Since 2020`
    const canonical = `${window.location.origin}${path}`
    document.title = fullTitle
    const set = (selector, attribute, value) => { const element = document.head.querySelector(selector); if (element) element.setAttribute(attribute, value); else { const node = document.createElement('meta'); node.setAttribute(attribute, value); document.head.appendChild(node) } }
    const link = document.head.querySelector('link[rel="canonical"]') || document.head.appendChild(Object.assign(document.createElement('link'), { rel: 'canonical' }))
    link.href = canonical
    set('meta[name="description"]', 'content', description)
    set('meta[property="og:title"]', 'content', fullTitle)
    set('meta[property="og:description"]', 'content', description)
    set('meta[property="og:type"]', 'content', 'website')
    set('meta[property="og:url"]', 'content', canonical)
    if (image) set('meta[property="og:image"]', 'content', image)
    set('meta[name="twitter:card"]', 'content', image ? 'summary_large_image' : 'summary')
    set('meta[name="twitter:title"]', 'content', fullTitle)
    set('meta[name="twitter:description"]', 'content', description)
    if (image) set('meta[name="twitter:image"]', 'content', image)
  }, [title, description, image, path])
  return null
}
