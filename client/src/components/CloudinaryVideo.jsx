import { useEffect, useRef, useState } from 'react'

function optimize(url, { width = 1600, quality = 'auto' } = {}) {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url
  const [base, asset] = url.split('/upload/')
  return `${base}/upload/f_auto,q_${quality},w_${width},dpr_auto/${asset}`
}

export default function CloudinaryVideo({ src, poster, className = '', ...props }) {
  const ref = useRef(null)
  const [active, setActive] = useState(false)
  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  useEffect(() => {
    if (!ref.current || reduced) return undefined
    const observer = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting)
        if (!entry.isIntersecting) ref.current.pause()
      },
      { rootMargin: '240px 0px', threshold: 0.05 },
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [reduced])
  if (!src || reduced) return poster ? <img src={poster} alt="" className={className} /> : null
  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      preload="none"
      playsInline
      muted
      controls
      {...props}
      src={optimize(src)}
      data-video-active={active}
      aria-label={props['aria-label'] || 'Project video'}
    />
  )
}
