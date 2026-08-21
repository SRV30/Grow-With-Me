import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { ArrowDownRight, ArrowUpRight, CheckCircle2, Menu, X } from 'lucide-react'
import { services, industries, process } from './data/site.js'
import { api, getHomepage, getProjects } from './services/api.js'
import MagneticCursor from './components/MagneticCursor.jsx'

gsap.registerPlugin(ScrollTrigger)

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
  const submit = async (event) => {
    event.preventDefault()
    setState('loading')
    setError('')
    try {
      await api.post('/enquiries', form)
      setState('success')
      setForm({ name: '', email: '', phone: '', company: '', service: '', budget: '', message: '' })
    } catch (e) {
      setState('error')
      setError(e.response?.data?.message || 'Something went wrong. Please try again.')
    }
  }
  if (state === 'success')
    return (
      <div className="mt-12 max-w-2xl border border-black/20 bg-white/25 p-8 md:p-12">
        <CheckCircle2 size={32} />
        <h3 className="mt-5 text-3xl font-black tracking-[-.04em]">Message received.</h3>
        <p className="mt-3 max-w-lg leading-7">
          Thanks for reaching out. We’ll review your enquiry and get back to you soon.
        </p>
        <button className="dark-button mt-7" onClick={() => setState('idle')}>
          Send another enquiry
        </button>
      </div>
    )
  return (
    <form onSubmit={submit} className="mt-12 grid max-w-4xl gap-5 md:grid-cols-2">
      {[
        ['name', 'Name', 'text'],
        ['email', 'Email', 'email'],
        ['phone', 'Phone', 'tel'],
        ['company', 'Company', 'text'],
      ].map(([key, label, type]) => (
        <label key={key} className="contact-field">
          <span>{label} *</span>
          <input
            required={key === 'name' || key === 'email'}
            type={type}
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          />
        </label>
      ))}
      <label className="contact-field">
        <span>Service</span>
        <select
          value={form.service}
          onChange={(e) => setForm({ ...form, service: e.target.value })}
        >
          <option value="">Select a service</option>
          {services.map((service) => (
            <option key={service.title}>{service.title}</option>
          ))}
        </select>
      </label>
      <label className="contact-field">
        <span>Budget</span>
        <select value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })}>
          <option value="">Select a range</option>
          <option>Under ₹10,000</option>
          <option>₹10,000 – ₹25,000</option>
          <option>₹25,000 – ₹50,000</option>
          <option>₹50,000+</option>
        </select>
      </label>
      <label className="contact-field md:col-span-2">
        <span>Tell us about your project *</span>
        <textarea
          required
          rows="6"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </label>
      {state === 'error' && <p className="md:col-span-2 font-medium text-red-700">{error}</p>}
      <button
        disabled={state === 'loading'}
        className="dark-button magnetic w-fit disabled:cursor-wait disabled:opacity-60 md:col-span-2"
      >
        {state === 'loading' ? 'Sending…' : 'Send enquiry'} <ArrowUpRight size={17} />
      </button>
    </form>
  )
}

function App() {
  const shellRef = useRef(null),
    heroRef = useRef(null)
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
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true })
    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    const ctx = gsap.context(() => {
      gsap.from('.hero-copy > *', {
        y: 70,
        opacity: 0,
        duration: 1.1,
        stagger: 0.12,
        ease: 'power4.out',
      })
      gsap.from('.hero-card', {
        y: 90,
        rotate: 8,
        opacity: 0,
        duration: 1.25,
        delay: 0.35,
        ease: 'power4.out',
      })
      gsap.utils
        .toArray('.reveal')
        .forEach((element) =>
          gsap.fromTo(
            element,
            { y: 45, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: 'power3.out',
              scrollTrigger: { trigger: element, start: 'top 88%', once: true },
            },
          ),
        )
      gsap.to('.hero-card', {
        yPercent: 16,
        rotate: -3,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, shellRef)
    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [])
  useEffect(() => {
    const handleMove = (event) =>
      document.querySelectorAll('.magnetic').forEach((element) => {
        const rect = element.getBoundingClientRect(),
          x = event.clientX - (rect.left + rect.width / 2),
          y = event.clientY - (rect.top + rect.height / 2)
        element.style.transform =
          Math.hypot(x, y) < 110 ? `translate(${x * 0.12}px,${y * 0.12}px)` : ''
      })
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])
  const hero = homepage?.hero,
    about = homepage?.about,
    cta = homepage?.cta,
    liveIndustries =
      homepage?.industries
        ?.filter((item) => item.active)
        .sort((a, b) => a.order - b.order)
        .map((item) => item.name) || industries,
    liveProcess = homepage?.process?.sort((a, b) => a.order - b.order) || null
  return (
    <div ref={shellRef} className="site-shell">
      <MagneticCursor />
      <header className="fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-[#f6f4ee]/85 backdrop-blur-xl">
        <nav className="container-gwm flex h-20 items-center justify-between">
          <a href="#top" className="text-lg font-black tracking-[-.05em]" data-cursor="Home">
            GROW<span>.</span>WITH<span>.</span>ME
          </a>
          <div className="hidden items-center gap-9 text-xs font-bold uppercase tracking-[.14em] md:flex">
            <a className="nav-link" href="#services">
              Services
            </a>
            <a className="nav-link" href="#work">
              Work
            </a>
            <a className="nav-link" href="#process">
              Process
            </a>
            <a className="nav-link" href="#about">
              About
            </a>
          </div>
          <a
            href="#contact"
            className="yellow-button magnetic hidden md:inline-flex"
            data-cursor="Talk"
          >
            Let's Talk <ArrowUpRight size={16} />
          </a>
          <button
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </nav>
        {menuOpen && (
          <div className="border-t border-black/10 bg-[#f6f4ee] px-6 py-6 md:hidden">
            <div className="container-gwm flex flex-col gap-5 text-sm font-bold uppercase tracking-[.12em]">
              <a href="#services" onClick={() => setMenuOpen(false)}>
                Services
              </a>
              <a href="#work" onClick={() => setMenuOpen(false)}>
                Work
              </a>
              <a href="#process" onClick={() => setMenuOpen(false)}>
                Process
              </a>
              <a href="#about" onClick={() => setMenuOpen(false)}>
                About
              </a>
              <a href="#contact" onClick={() => setMenuOpen(false)}>
                Contact
              </a>
            </div>
          </div>
        )}
      </header>
      <main id="top">
        <section
          ref={heroRef}
          className="hero-grid hero-noise relative flex min-h-screen items-center pt-20"
        >
          <div className="container-gwm grid gap-12 py-20 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:gap-20">
            <div className="hero-copy relative z-10">
              <p className="eyebrow mb-7">
                {hero?.eyebrow || 'Creative digital solutions · Since 2020'}
              </p>
              <h1 className="display max-w-5xl">
                {hero?.title || (
                  <>
                    Grow your business.
                    <br />
                    Build your brand.
                    <br />
                    <span className="relative inline-block">
                      <span className="relative z-10">Get noticed.</span>
                      <span className="absolute bottom-1 left-0 -z-0 h-[.16em] w-full bg-[#f5d90a]" />
                    </span>
                  </>
                )}
              </h1>
              <p className="mt-9 max-w-xl text-base leading-7 text-[#68675f] md:text-lg">
                {hero?.description ||
                  'Social media, creative content, video editing, graphic design, digital marketing and websites — built around the way your business needs to grow.'}
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <a
                  href={hero?.primaryCtaLink || '#contact'}
                  className="yellow-button magnetic"
                  data-cursor="Start"
                >
                  {hero?.primaryCtaText || 'Get Started'} <ArrowUpRight size={17} />
                </a>
                <a
                  href={hero?.secondaryCtaLink || '#work'}
                  className="dark-button magnetic"
                  data-cursor="Explore"
                >
                  {hero?.secondaryCtaText || 'View Our Work'} <ArrowDownRight size={17} />
                </a>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-[540px] [perspective:1200px]">
              <div className="hero-orb absolute -right-4 -top-8 z-20 flex h-24 w-24 items-center justify-center rounded-full bg-[#f5d90a] text-center text-[10px] font-black uppercase leading-3 tracking-widest shadow-xl md:h-32 md:w-32">
                Creative
                <br />
                digital
                <br />
                solutions
              </div>
              <div className="hero-card relative overflow-hidden border border-black bg-[#111] p-3">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#e9e6dc]">
                  {hero?.media?.url ? (
                    <img
                      src={hero.media.url}
                      alt={hero.media.alt || ''}
                      className="absolute inset-0 h-full w-full object-cover opacity-80"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_30%,#f5d90a_0_15%,transparent_16%),radial-gradient(circle_at_72%_72%,#111_0_18%,transparent_19%)]" />
                  )}
                  <div className="absolute left-[10%] top-[12%] max-w-[75%] text-[clamp(3rem,8vw,6.5rem)] font-black leading-[.78] tracking-[-.08em]">
                    MAKE
                    <br />
                    <span className="text-[#f5d90a]" style={{ WebkitTextStroke: '2px #111' }}>
                      NOISE.
                    </span>
                  </div>
                  <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between border-t border-black pt-4 text-[10px] font-bold uppercase tracking-[.18em]">
                    <span>Grow With Me</span>
                    <span>01 / 06</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="marquee border-y border-black bg-[#111] py-5 text-[#f5d90a]">
          <div className="marquee-track gap-12 text-sm font-black uppercase tracking-[.2em]">
            {(homepage?.marquee?.length
              ? homepage.marquee.sort((a, b) => a.order - b.order).map((item) => item.text)
              : ['Social Media', 'Video', 'Design', 'Digital Marketing', 'Websites']
            ).map((item, i) => (
              <span key={`${item}-${i}`}>
                {item} <b>•</b>
              </span>
            ))}
          </div>
        </div>
        <section id="services" className="container-gwm py-28 md:py-40">
          <div className="reveal mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="eyebrow mb-5">What we do</p>
              <h2 className="section-title">
                Services
                <br />
                <span className="text-[#8b8980]">that move.</span>
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-[#68675f]">
              From one promotional creative to complete social media management, we build digital
              solutions around your business.
            </p>
          </div>
          <div>
            {services.map((service) => (
              <article
                key={service.number}
                className="service-row group grid gap-5 py-7 md:grid-cols-[80px_1fr_1fr_60px] md:items-center"
              >
                <span className="text-xs font-bold text-[#68675f]">{service.number}</span>
                <h3 className="text-2xl font-bold tracking-[-.04em] md:text-3xl">
                  {service.title}
                </h3>
                <p className="max-w-md text-sm leading-6 text-[#68675f]">{service.text}</p>
                <ArrowUpRight className="service-arrow" />
              </article>
            ))}
          </div>
        </section>
        <section id="work" className="bg-[#111] py-28 text-white md:py-40">
          <div className="container-gwm">
            <div className="reveal flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div>
                <p className="eyebrow mb-5 text-[#f5d90a]">Selected work</p>
                <h2 className="section-title">
                  We create.
                  <br />
                  <span className="text-[#777]">You grow.</span>
                </h2>
              </div>
              <a href="/work" className="yellow-button magnetic" data-cursor="Portfolio">
                View Portfolio <ArrowUpRight size={17} />
              </a>
            </div>
            <div className="mt-16 grid gap-5 md:grid-cols-2">
              {projects.length ? (
                projects.slice(0, 6).map((project) => (
                  <a
                    href={`/work/${project.slug}`}
                    key={project._id}
                    data-cursor="View"
                    className="group relative min-h-[520px] overflow-hidden border border-white/10 bg-[#222]"
                  >
                    <div className="absolute inset-0 transition duration-700 group-hover:scale-105">
                      {project.coverImage?.url ? (
                        <img
                          src={project.coverImage.url}
                          alt={project.coverImage.alt || project.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-full w-full bg-[#2a2a27]" />
                      )}
                    </div>
                    <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-7 pt-28">
                      <p className="text-xs uppercase tracking-[.18em] text-white/50">
                        {project.category.replaceAll('-', ' ')}
                      </p>
                      <h3 className="mt-2 text-3xl font-bold">{project.title}</h3>
                    </div>
                  </a>
                ))
              ) : (
                <div className="md:col-span-2 border border-white/10 p-12 text-white/50">
                  Featured projects will appear here once they are published from the CMS.
                </div>
              )}
            </div>
          </div>
        </section>
        <section id="process" className="container-gwm py-28 md:py-40">
          <div className="reveal mb-16">
            <p className="eyebrow mb-5">How we work</p>
            <h2 className="section-title">
              From idea
              <br />
              to <span className="text-[#8b8980]">impact.</span>
            </h2>
          </div>
          <div className="grid border-t border-black/15 md:grid-cols-3">
            {(
              liveProcess ||
              process.map(([number, title, text], i) => ({ number, title, text, order: i }))
            ).map((item) => (
              <article
                key={item.number}
                className="reveal border-b border-black/15 p-7 pl-0 md:border-r md:p-8 md:pl-0"
              >
                <span className="text-xs font-bold text-[#68675f]">{item.number}</span>
                <h3 className="mt-16 text-3xl font-bold tracking-[-.04em]">{item.title}</h3>
                <p className="mt-4 max-w-xs text-sm leading-6 text-[#68675f]">{item.text}</p>
              </article>
            ))}
          </div>
        </section>
        <section id="about" className="border-y border-black/10 bg-[#ebe8df] py-28 md:py-40">
          <div className="container-gwm grid gap-16 lg:grid-cols-[1fr_.8fr]">
            <div className="reveal">
              <p className="eyebrow mb-5">{about?.eyebrow || 'About Grow With Me'}</p>
              <h2 className="section-title">
                {about?.title || (
                  <>
                    Creative
                    <br />
                    digital
                    <br />
                    <span className="text-[#8b8980]">solutions.</span>
                  </>
                )}
              </h2>
            </div>
            <div className="reveal self-end">
              <p className="text-xl font-medium leading-8 tracking-[-.02em]">
                {about?.description ||
                  'Since 2020, we have been helping businesses build a professional and engaging digital presence through creative content, video editing, graphic design, social media and digital promotion.'}
              </p>
              <div className="mt-12 grid grid-cols-2 gap-8 border-t border-black/15 pt-6">
                <div>
                  <p className="text-5xl font-black tracking-[-.06em]">
                    {about?.experienceYear || 2020}
                  </p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[.15em] text-[#68675f]">
                    Experience since
                  </p>
                </div>
                <div>
                  <p className="text-5xl font-black tracking-[-.06em]">∞</p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[.15em] text-[#68675f]">
                    Ideas to explore
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="container-gwm py-24 md:py-32">
          <p className="eyebrow mb-8">Who we work with</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-2xl font-bold tracking-[-.04em] md:text-4xl">
            {liveIndustries.map((industry, index) => (
              <span key={industry} className="reveal">
                {industry}
                {index < liveIndustries.length - 1 ? ' /' : ''}
              </span>
            ))}
          </div>
        </section>
        <section id="contact" className="relative overflow-hidden bg-[#f5d90a] py-28 md:py-40">
          <div className="container-gwm relative z-10">
            <p className="eyebrow mb-5">{cta?.eyebrow || 'Ready to grow?'}</p>
            <h2 className="section-title max-w-5xl">
              {cta?.title || (
                <>
                  Your business
                  <br />
                  deserves to
                  <br />
                  <span className="relative inline-block">
                    <span className="relative z-10">be seen.</span>
                    <span className="absolute bottom-1 left-0 -z-0 h-[.15em] w-full bg-white" />
                  </span>
                </>
              )}
            </h2>
            <div className="mt-12 flex flex-wrap gap-4">
              <a
                href={cta?.primaryLink || 'https://wa.me/918434305404'}
                target="_blank"
                rel="noreferrer"
                className="dark-button magnetic"
                data-cursor="WhatsApp"
              >
                {cta?.primaryText || 'WhatsApp Us'} <ArrowUpRight size={17} />
              </a>
              <a
                href={cta?.secondaryLink || '#contact'}
                className="yellow-button magnetic"
                data-cursor="Email"
              >
                {cta?.secondaryText || 'Send Email'} <ArrowUpRight size={17} />
              </a>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <footer className="bg-[#111] py-12 text-white">
        <div className="container-gwm flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <div>
            <p className="text-2xl font-black tracking-[-.06em]">GROW WITH ME</p>
            <p className="mt-2 text-xs uppercase tracking-[.16em] text-white/50">
              Social Media · Design · Video · Digital Marketing
            </p>
          </div>
          <div className="text-sm text-white/60 md:text-right">
            <p>8434305404 · growithmeayush@gmail.com</p>
            <p className="mt-2">© 2026 Grow With Me. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
export default App
