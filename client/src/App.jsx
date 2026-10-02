import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Coffee,
  Diamond,
  ExternalLink,
  Image as ImageIcon,
  Laptop,
  Menu,
  Megaphone,
  PenTool,
  PlaySquare,
  Rocket,
  ShoppingBag,
  Smartphone,
  Store,
  Users,
  Utensils,
  X,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import logoImage from './assets/logo.PNG'
import { services, industries, process } from './data/site.js'
import { api, getHomepage, getProjects, getServices } from './services/api.js'
import SEO from './components/SEO.jsx'
import { OrganizationSchema } from './components/StructuredData.jsx'
import TestimonialsSection from './components/TestimonialsSection.jsx'
import QuoteCalculator from './components/QuoteCalculator.jsx'
import CloudinaryVideo from './components/CloudinaryVideo.jsx'
import './styles/figma-home.css'
import './styles/hero-collage.css'

const industryIcons = [
  Diamond,
  Store,
  Utensils,
  ShoppingBag,
  Users,
  Building2,
  Rocket,
  BriefcaseBusiness,
]
const serviceIcons = [Smartphone, PlaySquare, PenTool, Megaphone, BarChart3, Laptop]
const processIcons = [Users, CalendarDays, PenTool, ImageIcon, Rocket, ArrowRight]

const isVideoMedia = (media) => {
  const url = media?.secureUrl || media?.url || ''
  return (
    media?.resourceType === 'video' ||
    /\/video\/upload\//i.test(url) ||
    /\.(mp4|webm|mov)(\?|$)/i.test(url)
  )
}

function Logo() {
  return (
    <a className="figma-logo" href="#top" aria-label="Grow With Me home">
      <img
        src={logoImage}
        alt="Grow With Me"
        style={{ width: '300px', maxWidth: '100%', height: 'auto', display: 'block' }}
      />
    </a>
  )
}

function SectionHeading({ eyebrow, title, description, align = 'center' }) {
  return (
    <div className={`row-heading row-heading-${align}`}>
      <p className="figma-eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {description ? <p className="row-heading-description">{description}</p> : null}
    </div>
  )
}

function ContactForm({ servicesList }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    budget: '',
    message: '',
  })
  const [state, setState] = useState('idle')
  const [error, setError] = useState('')
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const submit = async (event) => {
    event.preventDefault()
    setState('loading')
    setError('')
    try {
      await api.post('/enquiries', form)
      setState('success')
      setForm({ name: '', email: '', phone: '', company: '', service: '', budget: '', message: '' })
    } catch (submissionError) {
      setState('error')
      setError(submissionError.response?.data?.message || 'Something went wrong. Please try again.')
    }
  }
  if (state === 'success')
    return (
      <div className="figma-contact-success">
        <CheckCircle2 size={34} />
        <h3>Message received.</h3>
        <p>Thanks for reaching out. We will review your enquiry and get back to you soon.</p>
        <button type="button" className="figma-dark-button" onClick={() => setState('idle')}>
          Send another enquiry <ArrowUpRight size={17} />
        </button>
      </div>
    )
  return (
    <form className="figma-contact-form" onSubmit={submit}>
      {[
        ['name', 'Name', 'text'],
        ['email', 'Email', 'email'],
        ['phone', 'Phone', 'tel'],
        ['company', 'Company', 'text'],
      ].map(([key, label, type]) => (
        <label key={key}>
          <span>{label} *</span>
          <input
            required={key === 'name' || key === 'email'}
            type={type}
            value={form[key]}
            onChange={(event) => update(key, event.target.value)}
          />
        </label>
      ))}
      <label>
        <span>Service</span>
        <select value={form.service} onChange={(event) => update('service', event.target.value)}>
          <option value="">Select a service</option>
          {servicesList.map((service) => (
            <option key={service._id || service.title}>{service.title}</option>
          ))}
        </select>
      </label>
      <label>
        <span>Budget</span>
        <select value={form.budget} onChange={(event) => update('budget', event.target.value)}>
          <option value="">Select a range</option>
          <option>Under ₹10,000</option>
          <option>₹10,000 – ₹25,000</option>
          <option>₹25,000 – ₹50,000</option>
          <option>₹50,000+</option>
        </select>
      </label>
      <label className="figma-field-wide">
        <span>Tell us about your project *</span>
        <textarea
          required
          rows="5"
          value={form.message}
          onChange={(event) => update('message', event.target.value)}
        />
      </label>
      {state === 'error' ? <p className="figma-form-error">{error}</p> : null}
      <button
        type="submit"
        disabled={state === 'loading'}
        className="figma-dark-button figma-field-wide"
      >
        {state === 'loading' ? 'Sending…' : 'Send enquiry'} <ArrowUpRight size={17} />
      </button>
    </form>
  )
}

function ProjectCard({ project }) {
  const cover = project.coverImage
  const video = isVideoMedia(cover)
  return (
    <a className="figma-project-card" href={`/work/${project.slug}`}>
      {cover?.url ? (
        video ? (
          <CloudinaryVideo
            src={cover.url}
            poster={cover.poster || cover.thumbnail}
            className="figma-project-media"
            controls={false}
            aria-label={cover.alt || project.title}
          />
        ) : (
          <img
            src={cover.url}
            alt={cover.alt || project.title}
            loading="lazy"
            className="figma-project-media"
          />
        )
      ) : (
        <div className="figma-project-placeholder" />
      )}
      <div className="figma-project-overlay">
        <span>{project.category?.replaceAll('-', ' ') || 'Creative project'}</span>
        <strong>{project.title}</strong>
      </div>
    </a>
  )
}

function HeroSection({ hero, projects }) {
  const heroProjects = useMemo(
    () => [...projects].sort(() => Math.random() - 0.5).slice(0, 5),
    [projects],
  )
  const [mobileIndex] = useState(() => Math.floor(Math.random() * 5))
  const slots = Array.from({ length: 5 }, (_, index) => {
    if (heroProjects[index]) return heroProjects[index]
    if (index === 0 && hero?.media?.url) {
      return {
        _id: 'homepage-hero-media',
        slug: '',
        title: 'Featured Grow With Me work',
        coverImage: hero.media,
      }
    }
    return null
  })

  return (
    <section className="row-section row-hero hero-collage-section">
      <div className="row-container row-hero-grid hero-collage-grid">
        <div className="row-hero-copy">
          <p className="figma-eyebrow">
            {hero?.eyebrow || 'Creative digital solutions since 2020'}
          </p>
          <h1>
            Grow Your Business.
            <br />
            Build Your Brand.
            <br />
            <em>{hero?.title?.split(' ').slice(-2).join(' ') || 'Get Noticed.'}</em>
          </h1>
          <p className="row-lead-services">
            Social Media · Creative Content · Video Editing · Graphic Design · Digital Marketing
          </p>
          <p className="row-hero-description">
            {hero?.description ||
              'Since 2020, Grow With Me has been helping businesses build a professional and engaging digital presence through creative content, videos, designs and digital marketing.'}
          </p>
          <div className="figma-actions">
            <a className="figma-yellow-button" href={hero?.primaryCtaLink || '#contact'}>
              {hero?.primaryCtaText || 'Get Started'} <ArrowRight size={17} />
            </a>
            <a className="figma-outline-button" href={hero?.secondaryCtaLink || '#work'}>
              {hero?.secondaryCtaText || 'View Our Work'} <ExternalLink size={15} />
            </a>
          </div>
        </div>
        <div className="hero-collage" aria-label="Featured Grow With Me projects">
          <div className="hero-collage-dots" />
          {slots.map((project, index) => (
            <a
              key={project?._id || `brand-${index}`}
              className={`hero-collage-card hero-collage-card-${index + 1}${index === mobileIndex ? ' hero-collage-mobile-selected' : ''}`}
              href={project?.slug ? `/work/${project.slug}` : '/work'}
              aria-label={project ? `View ${project.title}` : 'View Grow With Me work'}
            >
              {project?.coverImage?.url ? (
                isVideoMedia(project.coverImage) ? (
                  <CloudinaryVideo
                    src={project.coverImage.url}
                    poster={project.coverImage.poster || project.coverImage.thumbnail}
                    className="hero-collage-media"
                    controls={false}
                    aria-label={project.coverImage.alt || project.title}
                  />
                ) : (
                  <img
                    src={project.coverImage.url}
                    alt={project.coverImage.alt || project.title}
                    loading={index < 2 ? 'eager' : 'lazy'}
                    className="hero-collage-media"
                  />
                )
              ) : (
                <div className="hero-collage-brand-card">
                  <span>GROW</span>
                  <strong>WITH</strong>
                  <b>ME</b>
                  <small>CREATIVE DIGITAL SOLUTIONS</small>
                </div>
              )}
              {project?.slug ? (
                <span className="hero-collage-label">
                  {project.category?.replaceAll('-', ' ') || 'Featured work'}
                </span>
              ) : null}
            </a>
          ))}
          <span className="hero-collage-float hero-collage-heart">♥</span>
          <span className="hero-collage-float hero-collage-play">▶</span>
          <span className="hero-collage-float hero-collage-dot">●</span>
          <span className="hero-collage-sign">
            GROW
            <br />
            WITH
            <br />
            <b>ME</b>
          </span>
        </div>
      </div>
    </section>
  )
}

function TrustSection() {
  const items = [
    ['Since 2020', 'Experience You Can Trust', CalendarDays],
    ['Creative Ideas', 'Content That Makes You Stand Out', PenTool],
    ['Professional Quality', 'High-Quality Designs & Videos', CheckCircle2],
    ['Business Focused', 'Our Goal Is Your Business Growth', BarChart3],
  ]
  return (
    <section className="row-section row-trust">
      <div className="row-container row-trust-grid">
        {items.map(([title, text, Icon]) => (
          <article key={title}>
            <Icon size={34} />
            <div>
              <strong>{title}</strong>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
