import { useEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import gsap from 'gsap'
import '../styles/opening-animation.css'

export default function PageTransition() {
  const layer = useRef(null)
  const logo = useRef(null)
  const logoMark = useRef(null)
  const logoWord = useRef(null)
  const tagline = useRef(null)
  const line = useRef(null)
  const location = useLocation()
  const navigationType = useNavigationType()
  const first = useRef(true)

  useEffect(() => {
    const node = layer.current
    if (!node) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (first.current) {
      first.current = false

      if (reduced) {
        gsap.set(node, { autoAlpha: 0, pointerEvents: 'none' })
        return
      }

      // React StrictMode runs effects twice in development. Keep the intro
      // marked as active so the second pass cannot start a route transition.
      node.dataset.openingActive = 'true'

      const tl = gsap.timeline({
        defaults: { ease: 'power4.out' },
        onComplete: () => {
          node.dataset.openingActive = 'false'
          gsap.set(node, { pointerEvents: 'none' })
        },
      })

      gsap.set(node, { autoAlpha: 1, clipPath: 'inset(0 0 0 0)' })
      gsap.set(logoMark.current, { scale: 0, rotate: -18 })
      gsap.set(logoWord.current, { y: 28, autoAlpha: 0 })
      gsap.set(tagline.current, { y: 16, autoAlpha: 0 })
      gsap.set(line.current, { scaleX: 0, transformOrigin: 'left center' })

      tl.to(logoMark.current, {
        scale: 1,
        rotate: 0,
        duration: 0.65,
        ease: 'back.out(1.7)',
      })
        .to(logoWord.current, { y: 0, autoAlpha: 1, duration: 0.55 }, '-=0.3')
        .to(line.current, { scaleX: 1, duration: 0.65 }, '-=0.2')
        .to(tagline.current, { y: 0, autoAlpha: 1, duration: 0.45 }, '-=0.25')
        .to({}, { duration: 0.25 })
        .to(node, {
          clipPath: 'inset(0 0 100% 0)',
          duration: 0.9,
          ease: 'power4.inOut',
        })
        .set(node, { autoAlpha: 0 })

      return
    }

    // Ignore the development-only StrictMode second effect pass while the
    // opening sequence is still playing.
    if (node.dataset.openingActive === 'true') return
    if (reduced) return

    gsap.set(node, {
      autoAlpha: 1,
      clipPath: 'inset(0 0 0 0)',
      transformOrigin: navigationType === 'POP' ? 'bottom' : 'top',
    })
    gsap.to(node, {
      clipPath: navigationType === 'POP' ? 'inset(100% 0 0 0)' : 'inset(0 0 100% 0)',
      duration: 0.75,
      delay: 0.04,
      ease: 'power4.inOut',
      onComplete: () => {
        gsap.set(node, { autoAlpha: 0, pointerEvents: 'none' })
        window.scrollTo({ top: 0, behavior: 'instant' })
      },
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
      gsap.set(node, { autoAlpha: 1, clipPath: 'inset(100% 0 0 0)' })
      gsap.to(node, {
        clipPath: 'inset(0 0 0 0)',
        duration: 0.55,
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
    <div ref={layer} className="page-transition opening-animation" aria-hidden="true">
      <div className="opening-animation-glow" />
      <div ref={logo} className="opening-animation-content">
        <div ref={logoMark} className="opening-animation-mark">
          G
        </div>
        <div ref={logoWord} className="opening-animation-word">
          GROW WITH <span>ME</span>
        </div>
        <div ref={line} className="opening-animation-line" />
        <p ref={tagline} className="opening-animation-tagline">
          Creative digital solutions since 2020
        </p>
      </div>
      <div className="opening-animation-corner" />
    </div>
  )
}
