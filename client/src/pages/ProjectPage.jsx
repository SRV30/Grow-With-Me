import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowUpRight, Check, Play } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import gsap from 'gsap'
import { getProject, getProjects } from '../services/api.js'
import CloudinaryImage from '../components/CloudinaryImage.jsx'
import SEO from '../components/SEO.jsx'
import { ProjectSchema } from '../components/StructuredData.jsx'
import logoUrl from '../assets/logo.PNG'
import '../styles/project-detail.css'

const formatCategory = (value = '') =>
  value.replaceAll('-', ' ').replaceAll('_', ' ').trim().replace(/\b\w/g, (letter) => letter.toUpperCase())

const normalize = (value = '') => value.toLowerCase().replaceAll('-', ' ').replaceAll('_', ' ').trim()

export default function ProjectPage() {
  const { slug } = useParams()
  const root = useRef(null)
  const [project, setProject] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    Promise.all([getProject(slug), getProjects()])
      .then(([current, projects]) => {
        setProject(current)
        const list = Array.isArray(projects) ? projects : projects?.projects || []
        setRelated(
          list
            .filter((item) => item.slug !== current.slug && normalize(item.category) === normalize(current.category))
            .slice(0, 3),
        )
      })
      .catch((e) => setError(e.response?.data?.message || 'Project not found'))
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    if (!root.current || !project || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-project-reveal]', { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, stagger: 0.05, ease: 'power3.out' })
      gsap.fromTo('[data-project-media]', { clipPath: 'inset(7% 0)', scale: 1.035 }, { clipPath: 'inset(0% 0)', scale: 1, duration: 1, ease: 'power3.inOut' })
    }, root)
    return () => ctx.revert()
  }, [project])

  if (loading) return <main className="project-detail-page project-detail-loading">Loading project…</main>

  if (error || !project) {
    return (
      <main className="project-detail-page project-detail-error">
        <p>{error || 'Project not found'}</p>
        <Link to="/work" className="project-detail-back"><ArrowLeft size={15} /> Back to work</Link>
      </main>
    )
  }

  const category = formatCategory(project.category) || 'Creative project'
  const services = Array.isArray(project.services) ? project.services : []
  const gallery = Array.isArray(project.gallery) ? project.gallery.filter((item) => item?.url) : []
  const videos = Array.isArray(project.videos) ? project.videos.filter((item) => item?.url) : []
  const mediaCount = gallery.length + videos.length

  return (
    <main ref={root} className="project-detail-page">
      <SEO title={project.seo?.title || project.title} description={project.seo?.description || project.description} image={project.coverImage?.url} path={`/work/${project.slug}`} />
      <ProjectSchema project={project} />

      <header className="project-detail-container project-detail-topbar">
        <Link to="/" className="project-detail-brand" aria-label="Grow With Me home"><img src={logoUrl} alt="Grow With Me" /></Link>
        <nav className="project-detail-nav" aria-label="Project navigation">
          <Link to="/">Home</Link><Link to="/#about">About</Link><Link to="/#services">Services</Link><Link to="/work" className="active">Work</Link><Link to="/#contact">Contact</Link>
        </nav>
        <Link to="/#contact" className="project-detail-start">Start a Project <ArrowUpRight size={16} /></Link>
      </header>

      <section className="project-detail-container project-detail-hero">
        <Link to="/work" className="project-detail-back" data-project-reveal><ArrowLeft size={15} /> Back to Work</Link>
        <div className="project-detail-hero-grid">
          <div className="project-detail-hero-copy">
            <div className="project-detail-kicker" data-project-reveal>{category}</div>
            <h1 className="project-detail-title" data-project-reveal>{project.title}<em>.</em></h1>
            <p className="project-detail-tagline" data-project-reveal>From brief to final creative.</p>
            <p className="project-detail-summary" data-project-reveal>{project.description || 'A focused creative project built around the client’s goals and audience.'}</p>
            <div className="project-detail-meta" data-project-reveal>
              <div><strong>{project.year || '—'}</strong><span>Year</span></div>
              <div><strong>{project.client || 'Personal Project'}</strong><span>Client</span></div>
              <div><strong>{mediaCount || '—'}</strong><span>Assets</span></div>
            </div>
          </div>
          {project.coverImage?.url ? <div className="project-detail-hero-visual" data-project-media><div className="project-detail-yellow-shape" /><CloudinaryImage src={project.coverImage.url} alt={project.coverImage.alt || project.title} className="project-detail-hero-image" width={1500} sizes="(max-width: 800px) 100vw, 55vw" priority /></div> : null}
        </div>
      </section>

      <section className="project-detail-container project-detail-intro" data-project-reveal>
        <div className="project-detail-quote-mark">“</div>
        <div><p className="project-detail-label">The brief</p><blockquote>Good creative starts with a clear purpose.</blockquote></div>
        <p>{project.description || 'This case study presents the available project brief, services and final creative work.'}</p>
      </section>

      <section className="project-detail-container project-detail-case-study" data-project-reveal>
        <div className="project-detail-case-card"><span>01</span><div><p className="project-detail-label">Challenge</p><h2>Understand the goal first.</h2><p>{project.description || 'The project was shaped around the client, category and intended audience.'}</p></div></div>
        <div className="project-detail-case-card"><span>02</span><div><p className="project-detail-label">Approach</p><h2>Turn the brief into focused creative.</h2><p>We brought the selected services together into one consistent direction, keeping the final experience clear and purposeful.</p></div></div>
        <div className="project-detail-case-card"><span>03</span><div><p className="project-detail-label">Solution</p><h2>Build the final deliverables.</h2><p>{services.length ? `The work covered ${services.map(formatCategory).join(', ')}.` : `The final work was delivered as a ${category.toLowerCase()} project.`}</p></div></div>
      </section>

      {services.length ? <section className="project-detail-container project-detail-focus" data-project-reveal>{services.map((service) => <div className="project-detail-focus-item" key={service}><span className="project-detail-focus-icon"><Check size={18} /></span><div><strong>{formatCategory(service)}</strong><span>Part of the project deliverables and creative direction.</span></div></div>)}</section> : null}

      {mediaCount ? <section className="project-detail-container project-detail-gallery-section" data-project-reveal>
        <div className="project-detail-section-heading"><div><p className="project-detail-label">04 · Final work</p><h2>Inside the project.</h2></div><p>{mediaCount} visual asset{mediaCount === 1 ? '' : 's'}</p></div>
        <div className="project-detail-gallery">
          {gallery.map((item, index) => <figure className={`project-detail-media ${index === 0 ? 'featured' : ''}`} key={`image-${item.publicId || item.url}`}><CloudinaryImage src={item.url} alt={item.alt || `${project.title} project image ${index + 1}`} width={1400} sizes="(max-width: 620px) 100vw, 70vw" /></figure>)}
          {videos.map((item, index) => <figure className="project-detail-media" key={`video-${item.publicId || item.url}`}><video controls preload="metadata" poster={item.thumbnail || undefined} src={item.url} aria-label={`${project.title} project video ${index + 1}`} /></figure>)}
        </div>
      </section> : null}

      {related.length ? <section className="project-detail-container project-detail-related" data-project-reveal><div className="project-detail-section-heading"><div><p className="project-detail-label">More from {category}</p><h2>Related work.</h2></div><Link to={`/work?service=${encodeURIComponent(project.category)}`} className="project-detail-inline-link">View all <ArrowUpRight size={15} /></Link></div><div className="project-detail-related-grid">{related.map((item) => <Link to={`/work/${item.slug}`} className="project-detail-related-card" key={item.slug}>{item.coverImage?.url ? <CloudinaryImage src={item.coverImage.url} alt={item.coverImage.alt || item.title} width={900} sizes="(max-width: 620px) 100vw, 33vw" /> : <div className="project-detail-related-placeholder" />}<div><span>{formatCategory(item.category)}</span><h3>{item.title}</h3><ArrowUpRight size={17} /></div></Link>)}</div></section> : null}

      <section className="project-detail-cta"><div className="project-detail-container project-detail-cta-grid"><div data-project-reveal><p className="project-detail-cta-kicker">05 · Your project</p><h2>Let&apos;s create work worth showing.</h2><p>Have a brief? Let&apos;s turn it into something people remember.</p></div><Link to="/#contact" className="project-detail-button" data-project-reveal>Start a Project <ArrowUpRight size={17} /></Link></div></section>
    </main>
  )
}
