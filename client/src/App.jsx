import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clapperboard,
  Coffee,
  Diamond,
  ExternalLink,
  Home as HomeIcon,
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
import './styles/figma-home.css'

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
        GROW WITH
        <small>ME</small>
      </span>
    </a>
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

  if (state === 'success') {
    return (
      <div className="figma-contact-success">
        <CheckCircle2 size={30} />
        <h3>Message received.</h3>
        <p>Thanks for reaching out. We will review your enquiry and get back to you soon.</p>
        <button type="button" className="figma-dark-button" onClick={() => setState('idle')}>
          Send another enquiry <ArrowUpRight size={17} />
        </button>
      </div>
    )
  }

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

      {state === 'error' && <p className="figma-form-error">{error}</p>}

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

function App() {
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
    ? homepage.process.sort((a, b) => a.order - b.order)
    : process.map(([number, title, text], index) => ({ number, title, text, order: index }))

  const featuredProjects = projects.slice(0, 6)
  const heroImage = hero?.media?.url || featuredProjects[0]?.coverImage?.url
  const aboutImage = about?.media?.url || featuredProjects[1]?.coverImage?.url
  const ctaImage = cta?.media?.url || featuredProjects[2]?.coverImage?.url

  return (
    <div className="figma-site">
      <header className="figma-header">
        <div className="figma-header-inner">
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
            className="figma-menu-button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <nav className="figma-mobile-nav">
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
          </nav>
        )}
      </header>

      <main id="top" className="figma-home-grid">
        <div className="figma-left-column">
          <section className="figma-hero-section">
            <div className="figma-hero-copy">
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
              <p className="figma-hero-services">
                Social Media • Creative Content • Video Editing • Graphic Design • Digital Marketing
              </p>
              <p className="figma-hero-description">
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

            <div className="figma-hero-art" aria-hidden="true">
              {heroImage ? (
                <img src={heroImage} alt="" />
              ) : (
                <div className="figma-art-placeholder">
                  <span>GROW</span>
                  <strong>WITH</strong>
                  <b>ME</b>
                </div>
              )}
              <span className="figma-art-dot dot-one">♥</span>
              <span className="figma-art-dot dot-two">●</span>
              <span className="figma-art-badge">
                GROW
                <br />
                WITH
                <br />
                ME
              </span>
            </div>
          </section>

          <section className="figma-trust-strip">
            {[
              ['Since 2020', 'Experience You Can Trust', CalendarDays],
              ['Creative Ideas', 'Content That Makes You Stand Out', PenTool],
              ['Professional Quality', 'High-Quality Designs & Videos', CheckCircle2],
              ['Business Focused', 'Our Goal Is Your Business Growth', BarChart3],
            ].map(([title, text, Icon]) => (
              <div key={title}>
                <Icon size={27} />
                <div>
                  <b>{title}</b>
                  <span>{text}</span>
                </div>
              </div>
            ))}
          </section>

          <section id="services" className="figma-section figma-services-section">
            <div className="figma-section-heading">
              <p className="figma-eyebrow">What we do</p>
              <h2>Our Services</h2>
            </div>
            <div className="figma-service-grid">
              {services.map((service, index) => {
                const Icon = serviceIcons[index] || ImageIcon
                return (
                  <article className="figma-service-card" key={service.number}>
                    <Icon size={42} strokeWidth={1.6} />
                    <span className="figma-service-number">{service.number}</span>
                    <h3>{service.title}</h3>
                    <p>{service.text}</p>
                    <ArrowRight className="figma-card-arrow" size={21} />
                  </article>
                )
              })}
            </div>
          </section>

          <section id="work" className="figma-section figma-work-section">
            <div className="figma-section-heading centered">
              <p className="figma-eyebrow">Our work</p>
              <h2>We Create. You Grow.</h2>
              <p>
                Explore some of our creative work and see how we help businesses present themselves
                professionally online.
              </p>
            </div>
            <div className="figma-work-filters">
              {['All', 'Posters', 'Reels', 'Advertisements', 'Social Media', 'Websites'].map(
                (filter, index) => (
                  <button key={filter} className={index === 0 ? 'selected' : ''}>
                    {filter}
                  </button>
                ),
              )}
            </div>
            <div className="figma-work-grid">
              {featuredProjects.length ? (
                featuredProjects.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))
              ) : (
                <div className="figma-empty-work">
                  Publish featured projects from the CMS to populate this section.
                </div>
              )}
            </div>
            <a className="figma-yellow-button figma-centered-button" href="/work">
              View Full Portfolio <ArrowRight size={17} />
            </a>
          </section>
        </div>

        <div className="figma-right-column">
          <section className="figma-featured-section">
            <div className="figma-section-heading centered">
              <p className="figma-eyebrow">Our work</p>
              <h2>Featured Work</h2>
              <p>
                A glimpse of our creative projects that deliver results and build strong brand
                presence.
              </p>
            </div>
            <div className="figma-featured-grid">
              {featuredProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
            <a className="figma-yellow-button figma-centered-button" href="/work">
              View All Projects
            </a>
          </section>

          <section id="process" className="figma-process-section">
            <div className="figma-section-heading centered">
              <p className="figma-eyebrow">How we work</p>
              <h2>Our Process</h2>
              <p>A simple and effective process that turns ideas into impactful results.</p>
            </div>
            <div className="figma-process-grid">
              {liveProcess.map((item, index) => {
                const Icon = processIcons[index] || ArrowRight
                return (
                  <article key={item.number}>
                    <div className="figma-process-icon">
                      <Icon size={21} />
                    </div>
                    <strong>{item.number}</strong>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                )
              })}
            </div>
          </section>

          <section className="figma-industries-section">
            <div className="figma-section-heading centered">
              <p className="figma-eyebrow">Who we work with</p>
              <h2>Industries We Serve</h2>
              <p>
                We work with businesses, professionals and brands looking to build a strong digital
                presence.
              </p>
            </div>
            <div className="figma-industries-grid">
              {liveIndustries.map((industry, index) => {
                const Icon = industryIcons[index] || BriefcaseBusiness
                return (
                  <div key={industry}>
                    <Icon size={27} />
                    <b>{industry}</b>
                  </div>
                )
              })}
            </div>
          </section>

          <section id="about" className="figma-about-section">
            <div className="figma-about-copy">
              <p className="figma-eyebrow">{about?.eyebrow || 'About us'}</p>
              <h2>{about?.title || 'About Grow With Me'}</h2>
              <p>
                {about?.description ||
                  'Creative Digital Solutions Since 2020. Grow With Me is a creative digital service company founded with the aim of helping businesses build a strong and professional online presence.'}
              </p>
              <p>
                From a single promotional creative to complete social media management, we provide
                digital solutions according to your business needs.
              </p>
            </div>
            <div className="figma-about-image">
              {aboutImage ? (
                <img src={aboutImage} alt="Grow With Me creative work" loading="lazy" />
              ) : (
                <div className="figma-about-placeholder">
                  GROW
                  <br />
                  WITH
                  <br />
                  <strong>ME</strong>
                </div>
              )}
            </div>
            <div className="figma-quote">
              “{' '}
              <span>
                Your Business Deserves to Be Seen.
                <br />
                Grow With Me.
              </span>
            </div>
          </section>

          <section className="figma-cta-section">
            <div>
              <p className="figma-eyebrow">{cta?.eyebrow || 'Ready to grow'}</p>
              <h2>{cta?.title || "Let's Build Your Digital Presence Together."}</h2>
              <p>
                Whether you need social media management, professional videos, graphic design,
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
            <div className="figma-cta-image">
              {ctaImage ? (
                <img src={ctaImage} alt="Grow With Me project" loading="lazy" />
              ) : (
                <div className="figma-person-placeholder">
                  <Coffee size={48} />
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <section id="contact" className="figma-contact-section">
        <div className="figma-contact-header">
          <p className="figma-eyebrow">Start a project</p>
          <h2>Ready to grow?</h2>
          <p>
            Tell us what you are building and we will help turn the idea into a stronger digital
            presence.
          </p>
        </div>
        <ContactForm />
      </section>

      <footer className="figma-footer">
        <div className="figma-footer-contact">
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
        <div className="figma-footer-main">
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
        <div className="figma-footer-bottom">© 2026 Grow With Me. All Rights Reserved.</div>
      </footer>
    </div>
  )
}

export default App
