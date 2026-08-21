import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function KineticText({ children, className = '', as: Tag = 'div' }) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    if (!ref.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      return undefined
    const original = ref.current.textContent || ''
    const chars = [...original]
      .map((char) => `<span class="kinetic-char">${char === ' ' ? '&nbsp;' : char}</span>`)
      .join('')
    ref.current.innerHTML = chars
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.kinetic-char',
        { yPercent: 115, rotateX: -70, opacity: 0 },
        {
          yPercent: 0,
          rotateX: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.025,
          ease: 'power4.out',
          scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true },
        },
      )
    }, ref)
    return () => {
      ctx.revert()
      if (ref.current) ref.current.textContent = original
    }
  }, [])

  return (
    <Tag ref={ref} className={`kinetic-text ${className}`}>
      {children}
    </Tag>
  )
}
