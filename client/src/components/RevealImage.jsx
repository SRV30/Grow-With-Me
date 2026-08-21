import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
export default function RevealImage({
  src,
  alt = '',
  className = '',
  variant = 'up',
  parallax = true,
}) {
  const root = useRef(null)
  const image = useRef(null)
  useEffect(() => {
    if (
      !root.current ||
      !image.current ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return undefined
    const ctx = gsap.context(() => {
      const clipFrom =
        variant === 'left'
          ? 'inset(0 100% 0 0)'
          : variant === 'right'
            ? 'inset(0 0 0 100%)'
            : 'inset(100% 0 0 0)'
      gsap.fromTo(
        root.current,
        { clipPath: clipFrom },
        {
          clipPath: 'inset(0 0 0 0)',
          duration: 1.15,
          ease: 'power4.inOut',
          scrollTrigger: { trigger: root.current, start: 'top 88%', once: true },
        },
      )
      gsap.fromTo(
        image.current,
        { scale: 1.16, filter: 'grayscale(1) contrast(.9)' },
        {
          scale: 1,
          filter: 'grayscale(0) contrast(1)',
          duration: 1.35,
          ease: 'power3.out',
          scrollTrigger: { trigger: root.current, start: 'top 88%', once: true },
        },
      )
      if (parallax)
        gsap.to(image.current, {
          yPercent: -7,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
    }, root)
    return () => ctx.revert()
  }, [variant, parallax])
  return (
    <div ref={root} className={`reveal-image ${className}`}>
      <img ref={image} src={src} alt={alt} loading="lazy" />
    </div>
  )
}
