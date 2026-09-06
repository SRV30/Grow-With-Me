import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
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
  value.replaceAll('-', ' ').replaceAll('_', ' ').trim().replace(/\b\w/g, (letter) => letter.toUpperCase())

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
      gsap.fromTo('[data-project-reveal]', { y: 45, opacity: 0 }, {
        y: 0, opacity: 1, duration: .9, stagger: .07, ease: 'power4.out',
      })
      gsap.fromTo('[data-project-media]', { clipPath: 'inset(8% 0)', scale: 1.04 }, {
        clipPath: 'inset(0% 0)', scale: 1, duration: 1.1, ease: 'power4.inOut',
      })
    }, root)
    return () => ctx.revert()
  }, [project])

  if (loading) return <main className="project-detail-page project-detail-container" style={{ minHeight: '100vh', paddingTop: 160 }}>Loading project…</main>

  if (error || !project) {
    return (
      <main className="project-detail-page project-detail-container" style={{ minHeight: '100vh', paddingTop: 120 }}>
        <p>{error || 'Project not found'}</p>
        <Link to="/work" className="project-detail-back" style={{ marginTop: 24 }}>
          <ArrowLeft size={15} /> Back to work
        </Link>
      </main>
    )
  }

  const category = formatCategory(project.category) || 'Creative project'
  const gallery = project.gallery || []
  const videos = project.videos || []

  return (
    <main ref={root} className="project-detail-page">
      <SEO title={project.title} description={project.description} image={project.coverImage?.url} path={`/work/${project.slug}`} />
      <ProjectSchema project={project} />

      <header className="project-detail-container project-detail-topbar">
        <Link to="/" className="project-detail-brand" aria-label="Grow With Me home">
          <img src={logoUrl} alt="Grow With Me" />
        </Link>
        <Link to="/work" className="project-detail-back">
          <ArrowLeft size={15} /> All work
        </Link>
      </header>

      <section className="project-detail-container project-detail-hero">
        <div className="project-detail-kicker" data-project-reveal>
          {category} <span>·</span> {project.year || 'Selected work'}
        </div>
        <div className="project-detail-hero-grid">
          <div>
            <h1 className="project-detail-title" data-project-reveal>
              {project.title}<em>.</em>
            </h1>
          </div>
          <div data-project-reveal>
            <p className="project-detail-summary">{project.description}</p>
            {project.client ? (
              <p className="project-detail-client"><span>Client · </span>{project.client}</p>
            ) : null}
          </div>
        </div>
      </section>

      {project.coverImage?.url ? (
        <div className="project-detail-cover-wrap" data-project-media>
          <CloudinaryImage
            src={project.coverImage.url}
            alt={project.coverImage.alt || project.title}
            className="project-detail-cover"
            width={1800}
            sizes="100vw"
            priority
          />
        </div>
      ) : null}

      <section className="project-detail-container project-detail-info">
        <div>
          <p className="project-detail-info-label">Project overview</p>
          <h2>Built to<br />stand out.</h2>
        </div>
        <div>
          {project.services?.length ? (
            <div className="project-detail-services" data-project-reveal>
              {project.services.map((service) => (
                <span className="project-detail-service" key={service}>{service}</span>
              ))}
            </div>
          ) : null}

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
                <figure key={`${video.publicId || video.url}-${index}`} className="project-detail-media" data-project-media>
                  <CloudinaryVideo
                    src={video.url}
                    poster={video.thumbnail || undefined}
                    controls
                  />
                </figure>
              ))}
            </div>
          ) : (
            <div className="project-detail-empty-gallery">More project visuals will be added here.</div>
          )}
        </div>
      </section>

      <section className="project-detail-cta">
        <div className="project-detail-container project-detail-cta-grid">
          <div data-project-reveal>
            <p className="project-detail-kicker" style={{ marginBottom: 0 }}>Grow with us</p>
            <h2>Ready for<br />your next<br /><span>project?</span></h2>
          </div>
          <a href="mailto:growithmeayush@gmail.com" className="project-detail-button" data-project-reveal>
            Start a project <ArrowUpRight size={17} />
          </a>
        </div>
      </section>
    </main>
  )
}
