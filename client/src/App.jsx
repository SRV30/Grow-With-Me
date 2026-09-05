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
import { services, industries, process } from './data/site.js'
import { api, getHomepage, getProjects } from './services/api.js'
import SEO from './components/SEO.jsx'
import { OrganizationSchema } from './components/StructuredData.jsx'
import './styles/figma-home.css'
import './styles/hero-collage.css'
import './styles/mobile-fixes.css'

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

function Logo() {
  return (
    <a className="figma-logo" href="#top" aria-label="Grow With Me home">
      <span className="figma-logo-mark">G</span>
      <span>
        GROW WITH<small>ME</small>
      </span>
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

function ContactForm() {
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
          {services.map((service) => (
            <option key={service.title}>{service.title}</option>
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
  return (
    <a className="figma-project-card" href={`/work/${project.slug}`}>
      {project.coverImage?.url ? (
        <img
          src={project.coverImage.url}
          alt={project.coverImage.alt || project.title}
          loading="lazy"
        />
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
  const heroProjects = useMemo(() => {
    const shuffled = [...projects].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 5)
  }, [projects])

  const slots = Array.from({ length: 5 }, (_, index) => heroProjects[index] || null)

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
              className={`hero-collage-card hero-collage-card-${index + 1}`}
              href={project ? `/work/${project.slug}` : '/work'}
              aria-label={project ? `View ${project.title}` : 'View Grow With Me work'}
            >
              {project?.coverImage?.url ? (
                <img
                  src={project.coverImage.url}
                  alt={project.coverImage.alt || project.title}
                  loading={index < 2 ? 'eager' : 'lazy'}
                />
              ) : (
                <div className="hero-collage-brand-card">
                  <span>GROW</span>
                  <strong>WITH</strong>
                  <b>ME</b>
                  <small>CREATIVE DIGITAL SOLUTIONS</small>
                </div>
              )}
              {project ? (
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
function ServicesSection() {
  return (
    <section id="services" className="row-section row-white">
      <div className="row-container">
        <SectionHeading eyebrow="What we do" title="Our Services" />
        <div className="row-service-grid">
          {services.map((service, index) => {
            const Icon = serviceIcons[index] || PenTool
            return (
              <article className="row-service-card" key={service.title}>
                <Icon className="row-service-icon" size={42} />
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <ArrowRight className="row-service-arrow" size={22} />
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
function WorkSection({ projects }) {
  return (
    <section id="work" className="row-section row-soft">
      <div className="row-container">
        <SectionHeading
          eyebrow="Our work"
          title="We Create. You Grow."
          description="Explore some of our creative work and see how we help businesses present themselves professionally online."
        />
        <div className="row-work-filters">
          {['All', 'Posters', 'Reels', 'Advertisements', 'Social Media', 'Websites'].map(
            (filter, index) => (
              <button key={filter} className={index === 0 ? 'selected' : ''}>
                {filter}
              </button>
            ),
          )}
        </div>
        <div className="row-work-grid">
          {projects.length ? (
            projects.map((project) => <ProjectCard key={project._id} project={project} />)
          ) : (
            <div className="row-empty-work">
              Publish featured projects from the CMS to populate this section.
            </div>
          )}
        </div>
        <a className="figma-yellow-button row-centered-button" href="/work">
          View Full Portfolio <ArrowRight size={17} />
        </a>
      </div>
    </section>
  )
}
function FeaturedSection({ projects }) {
  return (
    <section className="row-section row-white">
      <div className="row-container">
        <SectionHeading
          eyebrow="Our work"
          title="Featured Work"
          description="A glimpse of our creative projects that deliver results and build strong brand presence."
        />
        <div className="row-featured-grid">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
        <a className="figma-yellow-button row-centered-button" href="/work">
          View All Projects <ArrowRight size={17} />
        </a>
      </div>
    </section>
  )
}
function ProcessSection({ processItems }) {
  return (
    <section className="row-section row-light">
      <div className="row-container">
        <SectionHeading
          eyebrow="How we work"
          title="Our Process"
          description="A simple and effective process that turns ideas into impactful results."
        />
        <div className="row-process-grid">
          {processItems.map((item, index) => {
            const Icon = processIcons[index] || ArrowRight
            return (
              <article key={item.number}>
                <div className="row-process-icon">
                  <Icon size={24} />
                </div>
                <strong>{item.number}</strong>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
function IndustriesSection({ industriesList }) {
  return (
    <section className="row-section row-soft">
      <div className="row-container row-industry-container">
        <SectionHeading
          eyebrow="Who we work with"
          title="Industries We Serve"
          description="We work with businesses, professionals and brands looking to build a strong digital presence."
        />
        <div className="row-industries-grid">
          {industriesList.map((industry, index) => {
            const Icon = industryIcons[index] || BriefcaseBusiness
            return (
              <article key={industry}>
                <Icon size={32} />
                <b>{industry}</b>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
function AboutSection({ about, aboutImage }) {
  return (
    <section id="about" className="row-section row-about">
      <div className="row-container">
        <div className="row-about-grid">
          <div className="row-about-copy">
            <p className="figma-eyebrow">{about?.eyebrow || 'About us'}</p>
            <h2>{about?.title || 'About Grow With Me'}</h2>
            <p className="row-about-kicker">Creative Digital Solutions Since 2020</p>
            <p>
              {about?.description ||
                'Grow With Me is a creative digital service company founded with the aim of helping businesses build a strong and professional online presence.'}
            </p>
            <p>
              Since 2020, we have been working on creative content, video editing, graphic
              designing, social media and digital promotion.
            </p>
            <p>
              From a single promotional creative to complete social media management, we provide
              digital solutions according to your business needs.
            </p>
          </div>
          <div className="row-about-image">
            {aboutImage ? (
              <img src={aboutImage} alt="Grow With Me creative work" loading="lazy" />
            ) : (
              <div className="row-about-placeholder">
                GROW
                <br />
                WITH
                <br />
                <strong>ME</strong>
              </div>
            )}
          </div>
        </div>
        <blockquote className="row-quote">
          <span>“</span>
          <p>
            Your Business Deserves to Be Seen.
            <br />
            Grow With Me.
          </p>
        </blockquote>
      </div>
    </section>
  )
}
function CtaCupAnimation() {
  return (
    <div className="row-cup-stage" aria-label="Animated coffee cup" role="img">
      <div className="row-cup-halo" />
      <div className="row-cup-steam row-cup-steam-one" />
      <div className="row-cup-steam row-cup-steam-two" />
      <div className="row-cup">
        <Coffee className="row-cup-icon" size={76} strokeWidth={2.4} />
        <span className="row-cup-spark">✦</span>
      </div>
    </div>
  )
}
function CtaSection({ cta, ctaImage }) {
  return (
    <section className="row-section row-cta">
      <div className="row-container row-cta-grid">
        <div className="row-cta-copy">
          <p className="figma-eyebrow">{cta?.eyebrow || 'Ready to grow?'}</p>
          <h2>{cta?.title || "Let's Build Your Digital Presence Together."}</h2>
          <p>
            Whether you need social media management, professional videos, creative design,
            advertising or a website — Grow With Me is here to help.
          </p>
          <div className="figma-actions">
            <a className="figma-yellow-button" href={cta?.primaryLink || '#contact'}>
              {cta?.primaryText || 'Get Started'} <ArrowRight size={17} />
            </a>
            <a
              className="figma-outline-button"
              href="https://wa.me/918434305404"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp Us <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
        <div className="row-cta-image">
          {ctaImage ? (
            <img src={ctaImage} alt="Grow With Me project" loading="lazy" />
          ) : (
            <CtaCupAnimation />
          )}
        </div>
      </div>
    </section>
  )
}
function ContactSection() {
  return (
    <section id="contact" className="row-section row-contact">
      <div className="row-container row-contact-grid">
        <div className="row-contact-copy">
          <p className="figma-eyebrow">Start a project</p>
          <h2>Ready to grow?</h2>
          <p>
            Tell us what you are building and we will help turn the idea into a stronger digital
            presence.
          </p>
        </div>
        <ContactForm />
      </div>
    </section>
  )
}
function Footer() {
  return (
    <footer className="figma-footer row-footer">
      <div className="row-footer-contact">
        <a href="tel:+918434305404">
          <span>Call Us</span>
          <strong>8434305404</strong>
        </a>
        <a href="mailto:growwithmeayush@gmail.com">
          <span>Email Us</span>
          <strong>growwithmeayush@gmail.com</strong>
        </a>
        <a href="https://wa.me/918434305404" target="_blank" rel="noreferrer">
          <span>Chat on WhatsApp</span>
          <strong>8434305404</strong>
        </a>
      </div>
      <div className="row-container row-footer-main">
        <div>
          <Logo />
          <p>
            Social Media · Design · Video · Digital Marketing
            <br />
            Since 2020
          </p>
        </div>
        <div>
          <h3>Quick Links</h3>
          <a href="#top">Home</a>
          <a href="#services">Services</a>
          <a href="#work">Portfolio</a>
          <a href="#about">About Us</a>
          <a href="#contact">Contact</a>
        </div>
        <div>
          <h3>Contact</h3>
          <a href="tel:+918434305404">8434305404</a>
          <a href="mailto:growwithmeayush@gmail.com">growwithmeayush@gmail.com</a>
        </div>
      </div>
      <div className="row-footer-bottom">
        <span>© 2026 Grow With Me. All Rights Reserved.</span>
        <span>GST details, if applicable, should be displayed only after GST registration.</span>
      </div>
    </footer>
  )
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [projects, setProjects] = useState([])
  const [homepage, setHomepage] = useState(null)
  useEffect(() => {
    getProjects({ featured: true })
      .then(setProjects)
      .catch(() => {})
    getHomepage()
      .then(setHomepage)
      .catch(() => {})
  }, [])
  const hero = homepage?.hero
  const about = homepage?.about
  const cta = homepage?.cta
  const liveIndustries = useMemo(
    () =>
      homepage?.industries?.length
        ? homepage.industries
            .filter((item) => item.active)
            .sort((a, b) => a.order - b.order)
            .map((item) => item.name)
        : industries,
    [homepage],
  )
  const liveProcess = homepage?.process?.length
    ? homepage.process.slice().sort((a, b) => a.order - b.order)
    : process.map(([number, title, text], index) => ({ number, title, text, order: index }))
  const featuredProjects = projects.slice(0, 6)
  const aboutImage = hero?.media?.url || featuredProjects[1]?.coverImage?.url
  const ctaImage = cta?.media?.url || featuredProjects[2]?.coverImage?.url
  return (
    <div className="figma-site row-layout-site">
      <SEO
        title="Creative Digital Solutions"
        description="Grow With Me helps businesses grow online through social media management, creative content, video editing, graphic design, digital marketing and web design."
        path="/"
      />
      <OrganizationSchema />
      <header className="figma-header row-header">
        <div className="row-container row-header-inner">
          <Logo />
          <nav className="figma-nav" aria-label="Primary navigation">
            <a className="active" href="#top">
              Home
            </a>
            <a href="#services">Services</a>
            <a href="#work">Portfolio</a>
            <a href="#about">About Us</a>
            <a href="#contact">Contact</a>
          </nav>
          <a className="figma-yellow-button header-cta" href="#contact">
            Get Started <ArrowUpRight size={14} />
          </a>
          <button
            type="button"
            className="figma-menu-button"
            aria-expanded={menuOpen}
            aria-controls="gwm-mobile-navigation"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {menuOpen ? (
          <nav
            id="gwm-mobile-navigation"
            className="figma-mobile-nav row-mobile-nav"
            aria-label="Mobile navigation"
          >
            <a href="#top" onClick={() => setMenuOpen(false)}>
              Home
            </a>
            <a href="#services" onClick={() => setMenuOpen(false)}>
              Services
            </a>
            <a href="#work" onClick={() => setMenuOpen(false)}>
              Portfolio
            </a>
            <a href="#about" onClick={() => setMenuOpen(false)}>
              About Us
            </a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>
              Contact
            </a>
            <a className="mobile-nav-cta" href="#contact" onClick={() => setMenuOpen(false)}>
              Get Started <ArrowUpRight size={15} />
            </a>
          </nav>
        ) : null}
      </header>
      <main id="top">
        <HeroSection hero={hero} projects={featuredProjects} />
        <TrustSection />
        <ServicesSection />
        <WorkSection projects={featuredProjects} />
        <FeaturedSection projects={featuredProjects} />
        <ProcessSection processItems={liveProcess} />
        <IndustriesSection industriesList={liveIndustries} />
        <AboutSection about={about} aboutImage={aboutImage} />
        <CtaSection cta={cta} ctaImage={ctaImage} />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
