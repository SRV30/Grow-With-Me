import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ArrowUpRight } from 'lucide-react'
import CloudinaryImage from './CloudinaryImage.jsx'

export default function PortfolioShowcase({ projects = [] }) {
  const root = useRef(null)
  useEffect(() => {
    if (!root.current) return undefined
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    if (reduced || coarse) return undefined
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.portfolio-card').forEach((card) => {
        const media = card.querySelector('.portfolio-media'),
          image = card.querySelector('.portfolio-image'),
          title = card.querySelector('.portfolio-title'),
          meta = card.querySelector('.portfolio-meta'),
          arrow = card.querySelector('.portfolio-view')
        const move = (event) => {
          const rect = card.getBoundingClientRect(),
            px = (event.clientX - rect.left) / rect.width - 0.5,
            py = (event.clientY - rect.top) / rect.height - 0.5
          gsap.to(media, {
            rotateY: px * 9,
            rotateX: -py * 9,
            z: 10,
            duration: 0.45,
            ease: 'power3.out',
            overwrite: true,
          })
          gsap.to(image, {
            x: -px * 24,
            y: -py * 24,
            scale: 1.1,
            duration: 0.55,
            ease: 'power3.out',
            overwrite: true,
          })
          gsap.to(title, {
            x: px * 14,
            y: py * 8,
            duration: 0.5,
            ease: 'power3.out',
            overwrite: true,
          })
          gsap.to(meta, {
            x: px * 7,
            y: py * 3,
            duration: 0.5,
            ease: 'power3.out',
            overwrite: true,
          })
          gsap.to(arrow, {
            x: px * 12,
            y: py * 12,
            rotation: 45 + px * 12,
            scale: 1.08,
            duration: 0.4,
            ease: 'power3.out',
            overwrite: true,
          })
        }
        const leave = () => {
          gsap.to(media, { rotateY: 0, rotateX: 0, z: 0, duration: 0.7, ease: 'power3.out' })
          gsap.to(image, { x: 0, y: 0, scale: 1, duration: 0.7, ease: 'power3.out' })
          gsap.to(title, { x: 0, y: 0, duration: 0.6, ease: 'power3.out' })
          gsap.to(meta, { x: 0, y: 0, duration: 0.6, ease: 'power3.out' })
          gsap.to(arrow, { x: 0, y: 0, rotation: 0, scale: 1, duration: 0.6, ease: 'power3.out' })
        }
        card.addEventListener('pointermove', move)
        card.addEventListener('pointerleave', leave)
      })
    }, root)
    return () => ctx.revert()
  }, [projects])
  if (!projects.length)
    return (
      <div className="portfolio-empty">
        Featured projects will appear here once they are published from the CMS.
      </div>
    )
  return (
    <div ref={root} className="portfolio-showcase">
      {projects.slice(0, 6).map((project, index) => (
        <a
          href={`/work/${project.slug}`}
          key={project._id}
          className="portfolio-card"
          data-cursor="View project"
        >
          <div className="portfolio-media">
            {project.coverImage?.url ? (
              <CloudinaryImage
                src={project.coverImage.url}
                alt={project.coverImage.alt || project.title}
                className="portfolio-image"
                width={1600}
                sizes="(max-width: 768px) 100vw, 60vw"
                priority={index === 0}
              />
            ) : (
              <div className="portfolio-image portfolio-image-placeholder" />
            )}
            <div className="portfolio-overlay" />
            <span className="portfolio-index">0{index + 1}</span>
            <span className="portfolio-view">
              <ArrowUpRight size={18} />
            </span>
            <div className="portfolio-content">
              <p className="portfolio-meta">
                {project.category?.replaceAll('-', ' ') || 'Creative project'}
              </p>
              <h3 className="portfolio-title">{project.title}</h3>
            </div>
          </div>
        </a>
      ))}
    </div>
  )
}
