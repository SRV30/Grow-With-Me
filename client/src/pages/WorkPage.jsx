import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, ArrowUpRight, Filter, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getProjects } from '../services/api.js'
import SEO from '../components/SEO.jsx'
import CloudinaryImage from '../components/CloudinaryImage.jsx'
import { EmptyState, LoadingState, ErrorState } from '../components/StatusState.jsx'
import '../styles/work-page.css'

const filters = [
  'All',
  'Social Media',
  'Video',
  'Graphic Design',
  'Digital Marketing',
  'Web Design',
]
const normalizeCategory = (value = '') => value.toLowerCase().replaceAll('-', ' ').trim()

function ProjectCard({ project, index }) {
  const featured = index === 0
  const category = project.category?.replaceAll('-', ' ') || 'Creative project'

  return (
    <Link
      to={`/work/${project.slug}`}
      className={`work-project-card ${featured ? 'work-project-featured' : ''}`}
      data-cursor="View project"
    >
      <div className="work-project-media">
        {project.coverImage?.url ? (
          <CloudinaryImage
            src={project.coverImage.url}
            alt={project.coverImage.alt || project.title}
            className="work-project-image"
            width={featured ? 1400 : 900}
            sizes={featured ? '(max-width: 900px) 100vw, 66vw' : '(max-width: 900px) 100vw, 33vw'}
            priority={featured}
            blur={false}
          />
        ) : (
          <div className="work-project-placeholder" aria-hidden="true">
            <span>GWM</span>
          </div>
        )}
      </div>
      <div className="work-project-shade" />
      <span className="work-project-index">{String(index + 1).padStart(2, '0')}</span>
      <span className="work-project-arrow" aria-hidden="true">
        <ArrowUpRight size={20} />
      </span>
      <div className="work-project-content">
        <p>
          {category} {project.year ? `· ${project.year}` : ''}
        </p>
        <h2>{project.title}</h2>
        <span className="work-project-view">
          View case <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  )
}

export default function WorkPage() {
  const [projects, setProjects] = useState([])
  const [active, setActive] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getProjects()
      setProjects(Array.isArray(data) ? data : [])
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load projects.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    document.documentElement.style.colorScheme = 'light'
    localStorage.removeItem('gwm-theme')
  }, [])

  useEffect(() => {
    load()
  }, [])

  const visible = useMemo(() => {
    if (active === 'All') return projects
    const selected = normalizeCategory(active)
    return projects.filter((project) => normalizeCategory(project.category) === selected)
  }, [projects, active])

  return (
    <main className="work-page work-theme">
      <SEO
        title="Selected Work"
        description="Explore selected social campaigns, videos, graphic design, digital marketing and websites created through the Grow With Me studio."
        path="/work"
      />

      <header className="work-header">
        <div className="work-container work-header-inner">
          <Link className="work-logo" to="/" aria-label="Grow With Me home">
            <span className="work-logo-mark">G</span>
            <strong>
              GROW WITH <em>ME</em>
            </strong>
          </Link>

          <nav className="work-nav" aria-label="Portfolio navigation">
            <Link to="/#services">Services</Link>
            <Link className="is-active" to="/work">
              Work
            </Link>
            <Link to="/#about">About</Link>
            <Link className="work-nav-cta" to="/#contact">
              Start a project <ArrowRight size={14} />
            </Link>
          </nav>

          <div className="work-header-actions">
            <button
              type="button"
              className="work-menu-button"
              aria-expanded={menuOpen}
              aria-controls="work-mobile-navigation"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? (
                <X size={21} />
              ) : (
                <span>
                  <i />
                  <i />
                  <i />
                </span>
              )}
            </button>
          </div>
        </div>

        {menuOpen ? (
          <nav
            id="work-mobile-navigation"
            className="work-mobile-nav"
            aria-label="Mobile portfolio navigation"
          >
            <Link to="/#services" onClick={() => setMenuOpen(false)}>
              Services
            </Link>
            <Link to="/work" onClick={() => setMenuOpen(false)}>
              Work
            </Link>
            <Link to="/#about" onClick={() => setMenuOpen(false)}>
              About
            </Link>
            <Link className="work-nav-cta" to="/#contact" onClick={() => setMenuOpen(false)}>
              Start a project <ArrowRight size={14} />
            </Link>
          </nav>
        ) : null}
      </header>

      <section className="work-hero">
        <div className="work-hero-glow" />
        <div className="work-hero-grid work-container">
          <div className="work-hero-copy">
            <div className="work-hero-kicker">
              <span className="work-kicker-line" />
              <p className="work-eyebrow">01 / Selected work</p>
            </div>
            <h1>
              Ideas that
              <br />
              <span>get noticed.</span>
            </h1>
            <div className="work-hero-scroll">
              Scroll to explore <ArrowDownMark />
            </div>
          </div>
          <div className="work-hero-side">
            <div className="work-hero-number">01</div>
            <p>
              A curated selection of creative campaigns, digital experiences and brand work built to
              make businesses look sharper and communicate better.
            </p>
            <div className="work-hero-meta">
              <span>
                <strong>{projects.length}</strong> projects
              </span>
              <span>
                <strong>2020—26</strong> studio
              </span>
            </div>
          </div>
        </div>
        <div className="work-hero-marquee" aria-hidden="true">
          <div>
            CREATIVE WORK <b>✦</b> SOCIAL <b>✦</b> VIDEO <b>✦</b> DESIGN <b>✦</b> DIGITAL <b>✦</b>{' '}
            CREATIVE WORK <b>✦</b> SOCIAL <b>✦</b>
          </div>
        </div>
      </section>

      <section className="work-filter-section" aria-label="Project filters">
        <div className="work-container work-filter-bar">
          <span className="work-filter-label">
            <Filter size={14} /> Filter projects
          </span>
          <div className="work-filters" role="group" aria-label="Filter projects">
            {filters.map((filter) => (
              <button
                type="button"
                key={filter}
                aria-pressed={active === filter}
                className={active === filter ? 'is-active' : ''}
                onClick={() => setActive(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
          <span className="work-result-count">
            {visible.length.toString().padStart(2, '0')} results
          </span>
        </div>
      </section>

      {loading ? (
        <section className="work-container work-state">
          <LoadingState label="Loading selected work…" />
        </section>
      ) : error ? (
        <section className="work-container work-state">
          <ErrorState message={error} onRetry={load} />
        </section>
      ) : (
        <section className="work-container work-project-grid" aria-live="polite">
          {visible.map((project, index) => (
            <ProjectCard key={project._id || project.slug} project={project} index={index} />
          ))}
          {!visible.length && (
            <div className="work-empty">
              <EmptyState
                title="No projects yet"
                description="Publish a project from the admin dashboard and it will appear here."
              />
            </div>
          )}
        </section>
      )}

      {!loading && !error && visible.length > 0 ? (
        <section className="work-bottom-cta">
          <div className="work-cta-ring" aria-hidden="true" />
          <div className="work-container">
            <p className="work-eyebrow">02 / Let's build something</p>
            <h2>
              Have a project
              <br />
              <span>in mind?</span>
            </h2>
            <Link className="work-yellow-button" to="/#contact">
              Start a conversation <ArrowUpRight size={17} />
            </Link>
          </div>
        </section>
      ) : null}
    </main>
  )
}

function ArrowDownMark() {
  return <span className="work-down-arrow">↓</span>
}
