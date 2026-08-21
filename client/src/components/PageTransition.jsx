import { useEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import gsap from 'gsap'
import '../styles/opening-animation.css'
import '../styles/contact-polish.css'

const PHONE = '8434305404'
const WHATSAPP = '918434305404'

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
      tl.to(logoMark.current, { scale: 1, rotate: 0, duration: 0.65, ease: 'back.out(1.7)' })
        .to(logoWord.current, { y: 0, autoAlpha: 1, duration: 0.55 }, '-=0.3')
        .to(line.current, { scaleX: 1, duration: 0.65 }, '-=0.2')
        .to(tagline.current, { y: 0, autoAlpha: 1, duration: 0.45 }, '-=0.25')
        .to({}, { duration: 0.25 })
        .to(node, { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'power4.inOut' })
        .set(node, { autoAlpha: 0 })
      return
    }

    if (node.dataset.openingActive === 'true' || reduced) return
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
    const polishContact = () => {
      const ctaLinks = document.querySelectorAll('.row-cta-copy .figma-actions a')
      if (ctaLinks.length >= 2) {
        const callLink = ctaLinks[0]
        const whatsappLink = ctaLinks[1]
        callLink.href = `tel:${PHONE}`
        callLink.textContent = 'Call Us  →'
        callLink.setAttribute('aria-label', `Call Grow With Me at ${PHONE}`)
        whatsappLink.href = `https://wa.me/${WHATSAPP}`
        whatsappLink.textContent = 'WhatsApp Us  ↗'
        whatsappLink.target = '_blank'
        whatsappLink.rel = 'noopener noreferrer'
        whatsappLink.setAttribute('aria-label', 'Chat with Grow With Me on WhatsApp')
      }

      const form = document.querySelector('.figma-contact-form')
      if (form) {
        const inputs = form.querySelectorAll('input')
        const placeholders = [
          'Enter your full name',
          'you@company.com',
          '+91 98765 43210',
          'Your company or brand name',
        ]
        inputs.forEach((field, index) => {
          if (placeholders[index]) field.placeholder = placeholders[index]
        })
        const message = form.querySelector('textarea')
        if (message) message.placeholder = 'Tell us about your project, goals, budget and timeline...'
      }
    }

    polishContact()
    const observer = new MutationObserver(polishContact)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [location.key])

  useEffect(() => {
    const onClick = (event) => {
      const link = event.target.closest('a')
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return
      const href = link.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) return
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
        <div ref={logoMark} className="opening-animation-mark">G</div>
        <div ref={logoWord} className="opening-animation-word">GROW WITH <span>ME</span></div>
        <div ref={line} className="opening-animation-line" />
        <p ref={tagline} className="opening-animation-tagline">Creative digital solutions since 2020</p>
      </div>
      <div className="opening-animation-corner" />
    </div>
  )
}
