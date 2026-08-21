import { useMemo, useState } from 'react'

function transformCloudinaryUrl(
  url,
  { width = 1600, quality = 'auto', format = 'auto', crop = 'limit' } = {},
) {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url
  const marker = '/upload/'
  const [before, after] = url.split(marker)
  return `${before}${marker}f_${format},q_${quality},c_${crop},w_${width},dpr_auto/${after}`
}

export default function CloudinaryImage({
  src,
  alt = '',
  className = '',
  width = 1600,
  sizes = '100vw',
  priority = false,
  blur = true,
  ...props
}) {
  const [loaded, setLoaded] = useState(false)
  const optimized = useMemo(() => transformCloudinaryUrl(src, { width }), [src, width])
  const placeholder = useMemo(
    () => transformCloudinaryUrl(src, { width: 32, quality: 20, crop: 'fill' }),
    [src],
  )
  if (!src) return null
  return (
    <div className={`cloudinary-image ${loaded ? 'is-loaded' : ''} ${className}`}>
      {blur && (
        <img src={placeholder} aria-hidden="true" className="cloudinary-placeholder" alt="" />
      )}
      <img
        src={optimized}
        srcSet={`${transformCloudinaryUrl(src, { width: 640 })} 640w, ${transformCloudinaryUrl(src, { width: 960 })} 960w, ${transformCloudinaryUrl(src, { width: 1280 })} 1280w, ${transformCloudinaryUrl(src, { width: 1600 })} 1600w`}
        sizes={sizes}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        {...props}
      />
    </div>
  )
}
