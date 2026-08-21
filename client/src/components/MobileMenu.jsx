import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ArrowUpRight, X } from 'lucide-react'

const links = [
  ['01', 'Services', '#services'],
  ['02', 'Work', '/work'],
  ['03', 'Process', '#process'],
  ['04', 'About', '#about'],
  ['05', 'Contact', '#contact'],
]

export default function MobileMenu({ open, onClose }) {
  const panel = useRef(null)
  const timeline = useRef(null)
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (!panel.current)
      return () => {
        document.body.style.overflow = ''
      }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    timeline.current?.kill()
    if (reduced) {
      panel.current.style.transform = open ? 'translateY(0)' : 'translateY(-100%)'
      return () => {
        document.body.style.overflow = ''
      }
    }
    timeline.current = gsap.timeline({ defaults: { ease: 'power4.out' } })
    if (open)
      timeline.current
        .set(panel.current, { yPercent: -100, display: 'block' })
        .to(panel.current, { yPercent: 0, duration: 0.72 })
        .fromTo(
          '[data-mobile-link]',
          { y: 55, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65, stagger: 0.07 },
          '-.35',
        )
        .fromTo(
          '[data-mobile-footer]',
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          '-.35',
        )
    else
      timeline.current.to(panel.current, {
        yPercent: -100,
        duration: 0.55,
        onComplete: () => {
          panel.current.style.display = 'none'
        },
      })
    return () => {
      timeline.current?.kill()
      document.body.style.overflow = ''
    }
  }, [open])
  const navigate = (event, href) => {
    onClose()
    if (href.startsWith('#')) return
    event.preventDefault()
    window.history.pushState({}, '', href)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }
  return (
    <div ref={panel} className="mobile-menu" aria-hidden={!open}>
      <div className="mobile-menu-inner">
        <div className="flex items-center justify-between">
          <a href="/" onClick={onClose} className="text-lg font-black tracking-[-.05em]">
            GROW<span>.</span>WITH<span>.</span>ME
          </a>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="grid h-11 w-11 place-items-center border border-black/15"
          >
            <X size={21} />
          </button>
        </div>
        <nav className="mt-20">
          {links.map(([number, label, href]) => (
            <a
              key={label}
              href={href}
              onClick={(event) => navigate(event, href)}
              data-mobile-link
              className="mobile-menu-link"
            >
              <span>{number}</span>
              <strong>{label}</strong>
              <ArrowUpRight size={22} />
            </a>
          ))}
        </nav>
        <div data-mobile-footer className="mt-auto border-t border-black/15 pt-7">
          <p className="eyebrow">Let's build something.</p>
          <a
            href="mailto:growithmeayush@gmail.com"
            className="mt-3 inline-flex items-center gap-2 font-bold"
          >
            growithmeayush@gmail.com <ArrowUpRight size={15} />
          </a>
        </div>
      </div>
    </div>
  )
}
