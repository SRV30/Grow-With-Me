import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import gsap from 'gsap'
import { getProject } from '../services/api.js'
import CloudinaryImage from '../components/CloudinaryImage.jsx'
import CloudinaryVideo from '../components/CloudinaryVideo.jsx'
import SEO from '../components/SEO.jsx'
import { ProjectSchema } from '../components/StructuredData.jsx'
import logoUrl from '../assets/logo.PNG'
import '../styles/project-detail.css'

const formatCategory = (value = '') =>
  value
    .replaceAll('-', ' ')
    .replaceAll('_', ' ')
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase())

export default function ProjectPage() {
  const { slug } = useParams()
  const root = useRef(null)
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    getProject(slug)
      .then(setProject)
      .catch((e) => setError(e.response?.data?.message || 'Project not found'))
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    if (!root.current || !project || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      return undefined

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-project-reveal]',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.06, ease: 'power3.out' },
      )
      gsap.fromTo(
        '[data-project-media]',
        { clipPath: 'inset(7% 0)', scale: 1.035 },
        { clipPath: 'inset(0% 0)', scale: 1, duration: 1, ease: 'power3.inOut' },
      )
    }, root)

    return () => ctx.revert()
  }, [project])

  if (loading) {
    return <main className="project-detail-page project-detail-loading">Loading project…</main>
  }

  if (error || !project) {
    return (
      <main className="project-detail-page project-detail-error">
        <p>{error || 'Project not found'}</p>
        <Link to="/work" className="project-detail-back">
          <ArrowLeft size={15} /> Back to work
        </Link>
      </main>
    )
  }

  const category = formatCategory(project.category) || 'Creative project'
  const gallery = project.gallery || []
  const videos = project.videos || []
  const services = project.services || []

  return (
    <main ref={root} className="project-detail-page">
      <SEO
        title={project.title}
        description={project.description}
        image={project.coverImage?.url}
        path={`/work/${project.slug}`}
      />
      <ProjectSchema project={project} />

      <header className="project-detail-container project-detail-topbar">
        <Link to="/" className="project-detail-brand" aria-label="Grow With Me home">
          <img src={logoUrl} alt="Grow With Me" />
        </Link>
        <nav className="project-detail-nav" aria-label="Project navigation">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/services">Services</Link>
          <Link to="/work" className="active">
            Work
          </Link>
          <Link to="/contact">Contact</Link>
        </nav>
        <Link to="/contact" className="project-detail-start">
          Start a Project <ArrowUpRight size={16} />
        </Link>
      </header>

      <section className="project-detail-container project-detail-hero">
        <Link to="/work" className="project-detail-back" data-project-reveal>
          <ArrowLeft size={15} /> Back to Work
        </Link>

        <div className="project-detail-hero-grid">
          <div className="project-detail-hero-copy">
            <div className="project-detail-kicker" data-project-reveal>
              {category}
            </div>
            <h1 className="project-detail-title" data-project-reveal>
              {project.title}
              <em>.</em>
            </h1>
            <p className="project-detail-tagline" data-project-reveal>
              More than a project, it&apos;s an experience.
            </p>
            <p className="project-detail-summary" data-project-reveal>
              {project.description}
            </p>

            <div className="project-detail-meta" data-project-reveal>
              <div>
                <strong>{project.year || '—'}</strong>
                <span>Year</span>
              </div>
              <div>
                <strong>{project.client || 'Personal Project'}</strong>
                <span>Client</span>
              </div>
              <div>
                <strong>{category}</strong>
                <span>Category</span>
              </div>
            </div>
          </div>

          {project.coverImage?.url ? (
            <div className="project-detail-hero-visual" data-project-media>
              <div className="project-detail-yellow-shape" />
              <CloudinaryImage
                src={project.coverImage.url}
                alt={project.coverImage.alt || project.title}
                className="project-detail-hero-image"
                width={1500}
                sizes="(max-width: 800px) 100vw, 55vw"
                priority
              />
            </div>
          ) : null}
        </div>
      </section>

      <section className="project-detail-container project-detail-intro" data-project-reveal>
        <div className="project-detail-quote-mark">“</div>
        <blockquote>A cinematic experience right at your fingertips.</blockquote>
        <p>{project.description}</p>
      </section>

      {services.length ? (
        <section className="project-detail-container project-detail-focus" data-project-reveal>
          {services.map((service) => (
            <div className="project-detail-focus-item" key={service}>
              <span className="project-detail-focus-icon">
                <Check size={18} />
              </span>
              <div>
                <strong>{service}</strong>
                <span>Thoughtful design focused on the project experience.</span>
              </div>
            </div>
          ))}
        </section>
      ) : null}

      <section className="project-detail-container project-detail-gallery-section">
        <div className="project-detail-section-heading" data-project-reveal>
          <h2>Project Gallery</h2>
          <p>Some glimpses of the project</p>
        </div>

        {gallery.length || videos.length ? (
          <div className="project-detail-gallery">
            {gallery.map((image, index) => (
              <figure
                key={`${image.publicId || image.url}-${index}`}
                className={`project-detail-media ${index === 0 ? 'featured' : ''}`}
                data-project-media
              >
                <CloudinaryImage
                  src={image.url}
                  alt={image.alt || `${project.title} ${index + 1}`}
                  width={1400}
                  sizes="(max-width: 800px) 100vw, 70vw"
                />
              </figure>
            ))}
            {videos.map((video, index) => (
              <figure
                key={`${video.publicId || video.url}-${index}`}
                className="project-detail-media"
                data-project-media
              >
                <CloudinaryVideo src={video.url} poster={video.thumbnail || undefined} controls />
              </figure>
            ))}
          </div>
        ) : (
          <div className="project-detail-empty-gallery">
            More project visuals will be added here.
          </div>
        )}
      </section>

      <section className="project-detail-cta">
        <div className="project-detail-container project-detail-cta-grid">
          <div data-project-reveal>
            <p className="project-detail-cta-kicker">Ready for your next project?</p>
            <h2>Let&apos;s create something amazing together.</h2>
            <p>Turn your vision into a powerful digital product.</p>
          </div>
          <Link to="/contact" className="project-detail-button" data-project-reveal>
            Start a Project <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  )
}
