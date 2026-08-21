import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollChoreography() {
  const root = useRef(null)
  useLayoutEffect(() => {
    if (!root.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      return undefined
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-scroll-reveal]').forEach((element) => {
        gsap.fromTo(
          element,
          { y: 55, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: element, start: 'top 88%', once: true },
          },
        )
      })
      gsap.utils
        .toArray('[data-scroll-line]')
        .forEach((line) =>
          gsap.fromTo(
            line,
            { scaleX: 0, transformOrigin: 'left center' },
            {
              scaleX: 1,
              duration: 1.1,
              ease: 'power3.inOut',
              scrollTrigger: { trigger: line, start: 'top 90%', once: true },
            },
          ),
        )
      gsap.utils.toArray('[data-scroll-stagger]').forEach((group) => {
        const children = group.querySelectorAll('[data-scroll-item]')
        gsap.fromTo(
          children,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.09,
            ease: 'power3.out',
            scrollTrigger: { trigger: group, start: 'top 82%', once: true },
          },
        )
      })
      gsap.utils.toArray('[data-parallax]').forEach((element) => {
        const amount = Number(element.dataset.parallax) || 60
        gsap.fromTo(
          element,
          { yPercent: -amount / 10 },
          {
            yPercent: amount / 10,
            ease: 'none',
            scrollTrigger: {
              trigger: element,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [])
  return <span ref={root} className="scroll-choreography-root" aria-hidden="true" />
}
