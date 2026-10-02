import { useEffect, useRef } from 'react'

function optimize(url, { width = 1600, quality = 'auto' } = {}) {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url
  const [base, asset] = url.split('/upload/')
  return `${base}/upload/f_auto,q_${quality},w_${width},dpr_auto/${asset}`
}

export default function CloudinaryVideo({ src, poster, className = '', ...props }) {
  const ref = useRef(null)
  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    const video = ref.current
    if (!video || reduced) return undefined

    const play = () => {
      video.play().catch(() => {})
    }

    const pause = () => {
      video.pause()
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play()
        else pause()
      },
      { rootMargin: '240px 0px', threshold: 0.05 },
    )

    observer.observe(video)
    if (video.getBoundingClientRect().top < window.innerHeight) play()

    return () => {
      observer.disconnect()
      pause()
    }
  }, [reduced, src])

  if (!src || reduced) return poster ? <img src={poster} alt="" className={className} /> : null

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      preload="auto"
      autoPlay
      playsInline
      muted
      loop
      controls
      {...props}
      src={optimize(src)}
      aria-label={props['aria-label'] || 'Project video'}
    />
  )
}
