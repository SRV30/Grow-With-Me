import { useEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import gsap from 'gsap'

export default function PageTransition() {
  const layer = useRef(null)
  const location = useLocation()
  const navigationType = useNavigationType()
  const first = useRef(true)

  useEffect(() => {
    const node = layer.current
    if (!node) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (first.current) {
      first.current = false
      if (reduced) return
      gsap.fromTo(
        node,
        { scaleY: 1, transformOrigin: 'top' },
        { scaleY: 0, duration: 0.8, ease: 'power4.inOut' },
      )
      return
    }
    if (reduced) return
    gsap.set(node, { scaleY: 1, transformOrigin: navigationType === 'POP' ? 'bottom' : 'top' })
    gsap.to(node, {
      scaleY: 0,
      duration: 0.85,
      delay: 0.05,
      ease: 'power4.inOut',
      onComplete: () => window.scrollTo({ top: 0, behavior: 'instant' }),
    })
  }, [location.key, navigationType])

  useEffect(() => {
    const onClick = (event) => {
      const link = event.target.closest('a')
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return
      const href = link.getAttribute('href')
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('http')
      )
        return
      const url = new URL(href, window.location.href)
      if (url.origin !== window.location.origin) return
      if (url.pathname === window.location.pathname && url.search === window.location.search) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      event.preventDefault()
      const node = layer.current
      if (!node) return
      gsap.to(node, {
        scaleY: 1,
        transformOrigin: 'bottom',
        duration: 0.65,
        ease: 'power4.inOut',
        onComplete: () => {
          window.history.pushState({}, '', url.href)
          window.dispatchEvent(new PopStateEvent('popstate'))
        },
      })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <div ref={layer} className="page-transition" aria-hidden="true">
      <span className="page-transition-mark">GROW WITH ME</span>
    </div>
  )
}
