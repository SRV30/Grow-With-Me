import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function PageMotion() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion) return undefined

    const context = gsap.context(() => {
      gsap.from('.row-hero-copy > *', {
        y: 36,
        opacity: 0,
        duration: 0.85,
        stagger: 0.08,
        ease: 'power3.out',
      })

      gsap.from('.row-hero-art', {
        x: 45,
        y: 18,
        opacity: 0,
        scale: 0.94,
        duration: 1.05,
        ease: 'power3.out',
        delay: 0.12,
      })

      gsap.utils.toArray('.row-trust-grid article').forEach((item, index) => {
        gsap.from(item, {
          y: 22,
          opacity: 0,
          duration: 0.65,
          delay: index * 0.06,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 88%',
            once: true,
          },
        })
      })

      gsap.utils.toArray('.row-section').forEach((section) => {
        const heading = section.querySelector('.row-heading')
        if (heading) {
          gsap.from(heading, {
            y: 34,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              once: true,
            },
          })
        }
      })

      const staggerGroups = [
        '.row-service-card',
        '.row-featured-grid .figma-project-card',
        '.row-work-grid .figma-project-card',
        '.row-process-grid article',
        '.row-industries-grid article',
      ]

      staggerGroups.forEach((selector) => {
        gsap.utils.toArray(selector).forEach((item, index) => {
          gsap.from(item, {
            y: 28,
            opacity: 0,
            duration: 0.7,
            delay: (index % 6) * 0.05,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 90%',
              once: true,
            },
          })
        })
      })

      gsap.utils.toArray('.row-about-copy, .row-about-image, .row-quote, .row-cta-copy, .row-cta-image, .row-contact-copy, .figma-contact-form').forEach(
        (item) => {
          gsap.from(item, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 88%',
              once: true,
            },
          })
        },
      )

      gsap.utils.toArray('.figma-project-card').forEach((card) => {
        const image = card.querySelector('img')
        if (!image) return

        gsap.set(image, { scale: 1.02 })
        card.addEventListener('mouseenter', () => gsap.to(image, { scale: 1.07, duration: 0.55, ease: 'power3.out' }))
        card.addEventListener('mouseleave', () => gsap.to(image, { scale: 1.02, duration: 0.55, ease: 'power3.out' }))
      })

      const refresh = () => ScrollTrigger.refresh()
      window.addEventListener('load', refresh, { once: true })
    })

    return () => context.revert()
  }, [])

  return null
}
