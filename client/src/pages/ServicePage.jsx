import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2, Sparkles } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import gsap from 'gsap'
import { getProjects, getServices } from '../services/api.js'
import SEO from '../components/SEO.jsx'
import CloudinaryImage from '../components/CloudinaryImage.jsx'
import logoUrl from '../assets/logo.PNG'
import '../styles/service-page.css'

const fallbackServices = [
  {
    title: 'Social Media Management',
    text: 'A consistent, professional social presence built around your brand and audience.',
  },
  {
    title: 'Reels & Video Editing',
    text: 'Short-form videos designed to capture attention and turn views into interest.',
  },
  {
    title: 'Graphic Designing',
    text: 'Posters, promotional creatives, offers and campaigns with a clear visual identity.',
  },
  {
    title: 'Social Media Advertising',
    text: 'Targeted campaigns that put your business in front of the right audience.',
  },
  {
    title: 'Business Promotion',
    text: 'Creative promotional content that helps products and services get noticed.',
  },
  {
    title: 'Website Design',
    text: 'Modern, responsive websites that give your business a strong digital identity.',
  },
]

const serviceContent = {
  'social-media-management': {
    eyebrow: '01 / Social growth',
    headline: 'Build a social presence people remember.',
    description:
      'We plan, create and manage consistent social content that makes your brand look professional and keeps your audience engaged.',
    deliverables: [
      'Content strategy',
      'Content calendars',
      'Post & caption creation',
      'Publishing & scheduling',
      'Audience engagement',
    ],
  },
  'reels-video-editing': {
    eyebrow: '02 / Short-form video',
    headline: 'Turn attention into something worth watching.',
    description:
      'From raw footage to polished reels, we create fast, clear and engaging short-form videos built for modern social platforms.',
    deliverables: [
      'Reels editing',
      'Short-form videos',
      'Transitions & pacing',
      'Subtitles & captions',
      'Platform-ready exports',
    ],
  },
  'graphic-designing': {
    eyebrow: '03 / Visual design',
    headline: 'Make every visual look intentional.',
    description:
      'We create branded graphics that communicate clearly, look professional and keep your visual identity consistent.',
    deliverables: [
      'Social posts',
      'Promotional creatives',
      'Posters & banners',
      'Thumbnails',
      'Campaign graphics',
    ],
  },
  'social-media-advertising': {
    eyebrow: '04 / Paid growth',
    headline: 'Put your business in front of the right people.',
    description:
      'We help turn paid social campaigns into focused growth opportunities through clear creative and audience-first campaign thinking.',
    deliverables: [
      'Campaign planning',
      'Ad creatives',
      'Audience targeting',
      'Campaign monitoring',
      'Performance-focused iteration',
    ],
  },
  'business-promotion': {
    eyebrow: '05 / Promotion',
    headline: 'Give your next offer the attention it deserves.',
    description:
      'We combine creative content and promotional thinking to help products, offers and local businesses get noticed.',
    deliverables: [
      'Promotional concepts',
      'Offer creatives',
      'Campaign content',
      'Launch assets',
      'Digital promotion',
    ],
  },
  'website-design': {
    eyebrow: '06 / Digital presence',
    headline: 'Give your business a website worth remembering.',
    description:
      'We design modern, responsive websites that communicate your value clearly and create a professional first impression.',
    deliverables: [
      'Responsive UI design',
      'Landing pages',
      'Business websites',
      'Mobile-first layouts',
      'Conversion-focused sections',
    ],
  },
}

const slugify = (value = '') =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
const normalize = (value = '') => slugify(value).replaceAll('-', ' ')

const unwrapList = (value) => {
  if (Array.isArray(value)) return value
  if (Array.isArray(value?.projects)) return value.projects
  if (Array.isArray(value?.data)) return value.data
  return []
}

export default function ServicePage() {
  const { slug } = useParams()
  const root = useRef(null)
  const [services, setServices] = useState(fallbackServices)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    Promise.allSettled([getServices(), getProjects()]).then(([serviceResult, projectResult]) => {
      if (!active) return
      const serviceList = unwrapList(
        serviceResult.status === 'fulfilled' ? serviceResult.value : null,
      )
      const projectList = unwrapList(
        projectResult.status === 'fulfilled' ? projectResult.value : null,
      )
      if (serviceList.length) setServices(serviceList)
      setProjects(projectList)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  const service = useMemo(
    () =>
      services.find((item) => slugify(item.title) === slug) ||
      services.find((item) => normalize(item.title) === normalize(slug)) ||
      null,
    [services, slug],
  )
  const content =
    serviceContent[slug] ||
    serviceContent[slugify(service?.title)] ||
    serviceContent['social-media-management']
  const relatedProjects = useMemo(
    () =>
      projects
        .filter((project) => normalize(project.category) === normalize(service?.title))
        .slice(0, 6),
    [projects, service],
  )

  useEffect(() => {
    if (!root.current || !service || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      return undefined
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-service-reveal]',
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, stagger: 0.06, ease: 'power3.out' },
      )
      gsap.fromTo(
        '[data-service-media]',
        { clipPath: 'inset(8% 0)', scale: 1.03 },
        { clipPath: 'inset(0)', scale: 1, duration: 1, ease: 'power3.inOut' },
      )
    }, root)
    return () => ctx.revert()
  }, [service])

  if (loading) return <main className="service-page service-page-state">Loading service…</main>
  if (!service)
    return (
      <main className="service-page service-page-state">
        <h1>Service not found</h1>
        <Link to="/" className="service-back">
          <ArrowLeft size={16} /> Back home
        </Link>
      </main>
    )

  return (
    <main ref={root} className="service-page">
      <SEO title={service.title} description={service.text} path={`/services/${slug}`} />
      <header className="service-topbar">
        <Link to="/" className="service-brand">
          <img src={logoUrl} alt="Grow With Me" />
        </Link>
        <nav aria-label="Service navigation">
          <Link to="/#services" className="active">
            Services
          </Link>
          <Link to="/work">Work</Link>
          <Link to="/#about">About</Link>
          <Link to="/#contact" className="service-topbar-cta">
            Start a project <ArrowUpRight size={15} />
          </Link>
        </nav>
      </header>

      <section className="service-hero service-container">
        <Link to="/#services" className="service-back" data-service-reveal>
          <ArrowLeft size={15} /> All services
        </Link>
        <div className="service-hero-grid">
          <div className="service-hero-copy">
            <p className="service-eyebrow" data-service-reveal>
              <span /> {content.eyebrow}
            </p>
            <h1 data-service-reveal>{content.headline}</h1>
            <p className="service-hero-description" data-service-reveal>
              {content.description}
            </p>
            <div className="service-actions" data-service-reveal>
              <Link to="/#contact" className="service-primary-button">
                Get a quote <ArrowRight size={17} />
              </Link>
              <Link to="/work" className="service-secondary-button">
                View our work <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
          <div className="service-hero-card" data-service-media>
            <div className="service-card-pattern" />
            <div className="service-card-content">
              <Sparkles size={22} />
              <span>{service.title}</span>
              <strong>
                Creative work.
                <br />
                Business purpose.
              </strong>
            </div>
          </div>
        </div>
      </section>

      <section className="service-intro service-container">
        <div>
          <p className="service-eyebrow">What you get</p>
          <h2>Everything you need to show up professionally.</h2>
        </div>
        <p>
          {service.text} Our approach keeps the creative work connected to a clear business
          objective.
        </p>
      </section>

      <section className="service-deliverables service-container">
        <div className="service-section-heading">
          <p className="service-eyebrow">Deliverables</p>
          <h2>Built around your needs.</h2>
        </div>
        <div className="service-deliverables-grid">
          {content.deliverables.map((item, index) => (
            <article key={item} data-service-reveal>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <CheckCircle2 size={20} />
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="service-process">
        <div className="service-container">
          <div className="service-section-heading">
            <p className="service-eyebrow">Our process</p>
            <h2>Simple, clear, effective.</h2>
          </div>
          <div className="service-process-grid">
            {['Discuss', 'Plan', 'Create', 'Review', 'Launch'].map((step, index) => (
              <article key={step}>
                <span>0{index + 1}</span>
                <h3>{step}</h3>
                <p>
                  {
                    [
                      'Understand your goals.',
                      'Build the right direction.',
                      'Create the work.',
                      'Refine with your feedback.',
                      'Deliver ready-to-use assets.',
                    ][index]
                  }
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="service-related service-container">
        <div className="service-related-heading">
          <div>
            <p className="service-eyebrow">Selected work</p>
            <h2>Work made for this service.</h2>
          </div>
          <Link to={`/work?service=${encodeURIComponent(service.title)}`}>
            View all <ArrowUpRight size={15} />
          </Link>
        </div>
        {relatedProjects.length ? (
          <div className="service-related-grid">
            {relatedProjects.map((project) => (
              <Link
                to={`/work/${project.slug}`}
                key={project._id || project.slug}
                className="service-project-card"
              >
                {project.coverImage?.url ? (
                  <CloudinaryImage
                    src={project.coverImage.url}
                    alt={project.coverImage.alt || project.title}
                    className="service-project-image"
                    width={900}
                    sizes="(max-width: 800px) 100vw, 33vw"
                    blur={false}
                  />
                ) : (
                  <div className="service-project-placeholder">GWM</div>
                )}
                <div>
                  <span>{project.year || 'Project'}</span>
                  <strong>{project.title}</strong>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="service-no-projects">New work for this service will appear here.</div>
        )}
      </section>

      <section className="service-final-cta">
        <div className="service-container">
          <p className="service-eyebrow">Ready when you are</p>
          <h2>Let&apos;s build something that gets noticed.</h2>
          <Link to="/#contact" className="service-primary-button">
            Start your project <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  )
}
