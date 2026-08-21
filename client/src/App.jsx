import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { ArrowDownRight, ArrowUpRight, Menu, X } from 'lucide-react'
import { services, industries, process } from './data/site.js'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const shellRef = useRef(null)
  const heroRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true })
    const raf = (time) => { lenis.raf(time * 1000) }
    gsap.ticker.add(raf)

    const ctx = gsap.context(() => {
      gsap.from('.hero-copy > *', { y: 70, opacity: 0, duration: 1.1, stagger: 0.12, ease: 'power4.out' })
      gsap.from('.hero-card', { y: 90, rotate: 8, opacity: 0, duration: 1.25, delay: .35, ease: 'power4.out' })
      gsap.utils.toArray('.reveal').forEach((element) => {
        gsap.to(element, {
          y: 0,
          opacity: 1,
          duration: .9,
          ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 88%', once: true },
        })
      })
      gsap.to('.hero-card', {
        yPercent: 16,
        rotate: -3,
        ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
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
    const handleMove = (event) => {
      document.querySelectorAll('.magnetic').forEach((element) => {
        const rect = element.getBoundingClientRect()
        const x = event.clientX - (rect.left + rect.width / 2)
        const y = event.clientY - (rect.top + rect.height / 2)
        const distance = Math.hypot(x, y)
        if (distance < 110) element.style.transform = `translate(${x * .12}px, ${y * .12}px)`
        else element.style.transform = ''
      })
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  return (
    <div ref={shellRef} className="site-shell">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-[#f6f4ee]/85 backdrop-blur-xl">
        <nav className="container-gwm flex h-20 items-center justify-between">
          <a href="#top" className="text-lg font-black tracking-[-.05em]">GROW<span className="text-[#111]">.</span>WITH<span className="text-[#111]">.</span>ME</a>
          <div className="hidden items-center gap-9 text-xs font-bold uppercase tracking-[.14em] md:flex">
            <a className="nav-link" href="#services">Services</a>
            <a className="nav-link" href="#work">Work</a>
            <a className="nav-link" href="#process">Process</a>
            <a className="nav-link" href="#about">About</a>
          </div>
          <a href="#contact" className="yellow-button magnetic hidden md:inline-flex">Let's Talk <ArrowUpRight size={16} /></a>
          <button aria-label={menuOpen ? 'Close menu' : 'Open menu'} className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        </nav>
        {menuOpen && <div className="border-t border-black/10 bg-[#f6f4ee] px-6 py-6 md:hidden"><div className="container-gwm flex flex-col gap-5 text-sm font-bold uppercase tracking-[.12em]"><a href="#services" onClick={() => setMenuOpen(false)}>Services</a><a href="#work" onClick={() => setMenuOpen(false)}>Work</a><a href="#process" onClick={() => setMenuOpen(false)}>Process</a><a href="#about" onClick={() => setMenuOpen(false)}>About</a><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a></div></div>}
      </header>

      <main id="top">
        <section ref={heroRef} className="hero-grid hero-noise relative flex min-h-screen items-center pt-20">
          <div className="container-gwm grid gap-12 py-20 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:gap-20">
            <div className="hero-copy relative z-10">
              <p className="eyebrow mb-7">Creative digital solutions · Since 2020</p>
              <h1 className="display max-w-5xl">Grow your business.<br />Build your brand.<br /><span className="relative inline-block"><span className="relative z-10">Get noticed.</span><span className="absolute bottom-1 left-0 -z-0 h-[.16em] w-full bg-[#f5d90a]" /></span></h1>
              <p className="mt-9 max-w-xl text-base leading-7 text-[#68675f] md:text-lg">Social media, creative content, video editing, graphic design, digital marketing and websites — built around the way your business needs to grow.</p>
              <div className="mt-9 flex flex-wrap gap-4"><a href="#contact" className="yellow-button magnetic">Get Started <ArrowUpRight size={17} /></a><a href="#work" className="dark-button magnetic">View Our Work <ArrowDownRight size={17} /></a></div>
            </div>
            <div className="relative mx-auto w-full max-w-[540px] [perspective:1200px]">
              <div className="hero-orb absolute -right-4 -top-8 z-20 flex h-24 w-24 items-center justify-center rounded-full bg-[#f5d90a] text-center text-[10px] font-black uppercase leading-3 tracking-widest shadow-xl md:h-32 md:w-32">Creative<br />digital<br />solutions</div>
              <div className="hero-card relative overflow-hidden border border-black bg-[#111] p-3"><div className="relative aspect-[4/5] overflow-hidden bg-[#e9e6dc]"><div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_30%,#f5d90a_0_15%,transparent_16%),radial-gradient(circle_at_72%_72%,#111_0_18%,transparent_19%)]" /><div className="absolute left-[10%] top-[12%] max-w-[75%] text-[clamp(3rem,8vw,6.5rem)] font-black leading-[.78] tracking-[-.08em]">MAKE<br /><span className="text-[#f5d90a]" style={{ WebkitTextStroke: '2px #111' }}>NOISE.</span></div><div className="absolute bottom-7 left-7 right-7 flex items-end justify-between border-t border-black pt-4 text-[10px] font-bold uppercase tracking-[.18em]"><span>Grow With Me</span><span>01 / 06</span></div></div></div>
            </div>
          </div>
        </section>

        <div className="marquee border-y border-black bg-[#111] py-5 text-[#f5d90a]"><div className="marquee-track gap-12 text-sm font-black uppercase tracking-[.2em]"><span>Social Media</span><span>•</span><span>Video</span><span>•</span><span>Design</span><span>•</span><span>Digital Marketing</span><span>•</span><span>Websites</span><span>•</span><span>Social Media</span><span>•</span><span>Video</span><span>•</span><span>Design</span><span>•</span><span>Digital Marketing</span><span>•</span><span>Websites</span><span>•</span></div></div>

        <section id="services" className="container-gwm py-28 md:py-40"><div className="reveal mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end"><div><p className="eyebrow mb-5">What we do</p><h2 className="section-title">Services<br /><span className="text-[#8b8980]">that move.</span></h2></div><p className="max-w-sm text-sm leading-6 text-[#68675f]">From one promotional creative to complete social media management, we build digital solutions around your business.</p></div><div>{services.map((service) => <article key={service.number} className="service-row group grid gap-5 py-7 md:grid-cols-[80px_1fr_1fr_60px] md:items-center"><span className="text-xs font-bold text-[#68675f]">{service.number}</span><h3 className="text-2xl font-bold tracking-[-.04em] md:text-3xl">{service.title}</h3><p className="max-w-md text-sm leading-6 text-[#68675f]">{service.text}</p><ArrowUpRight className="service-arrow" /></article>)}</div></section>

        <section id="work" className="bg-[#111] py-28 text-white md:py-40"><div className="container-gwm"><div className="reveal flex flex-col justify-between gap-8 md:flex-row md:items-end"><div><p className="eyebrow mb-5 text-[#f5d90a]">Selected work</p><h2 className="section-title">We create.<br /><span className="text-[#777]">You grow.</span></h2></div><a href="#contact" className="yellow-button magnetic">View Portfolio <ArrowUpRight size={17} /></a></div><div className="mt-16 grid gap-5 md:grid-cols-2"><div className="project-placeholder min-h-[520px] border border-white/10"><div className="absolute bottom-7 left-7 z-10"><p className="text-xs uppercase tracking-[.18em] text-white/50">Featured project</p><h3 className="mt-2 text-3xl font-bold">Your next campaign</h3></div></div><div className="project-placeholder min-h-[520px] bg-[#c9c5b9]"><div className="absolute bottom-7 left-7 z-10 text-black"><p className="text-xs uppercase tracking-[.18em] opacity-50">Portfolio</p><h3 className="mt-2 text-3xl font-bold">Built to be noticed</h3></div></div></div></div></section>

        <section id="process" className="container-gwm py-28 md:py-40"><div className="reveal mb-16"><p className="eyebrow mb-5">How we work</p><h2 className="section-title">From idea<br />to <span className="text-[#8b8980]">impact.</span></h2></div><div className="grid border-t border-black/15 md:grid-cols-3">{process.map(([number, title, text]) => <article key={number} className="reveal border-b border-black/15 p-7 pl-0 md:border-r md:p-8 md:pl-0"><span className="text-xs font-bold text-[#68675f]">{number}</span><h3 className="mt-16 text-3xl font-bold tracking-[-.04em]">{title}</h3><p className="mt-4 max-w-xs text-sm leading-6 text-[#68675f]">{text}</p></article>)}</div></section>

        <section id="about" className="border-y border-black/10 bg-[#ebe8df] py-28 md:py-40"><div className="container-gwm grid gap-16 lg:grid-cols-[1fr_.8fr]"><div className="reveal"><p className="eyebrow mb-5">About Grow With Me</p><h2 className="section-title">Creative<br />digital<br /><span className="text-[#8b8980]">solutions.</span></h2></div><div className="reveal self-end"><p className="text-xl font-medium leading-8 tracking-[-.02em]">Since 2020, we have been helping businesses build a professional and engaging digital presence through creative content, video editing, graphic design, social media and digital promotion.</p><div className="mt-12 grid grid-cols-2 gap-8 border-t border-black/15 pt-6"><div><p className="text-5xl font-black tracking-[-.06em]">2020</p><p className="mt-2 text-xs font-bold uppercase tracking-[.15em] text-[#68675f]">Experience since</p></div><div><p className="text-5xl font-black tracking-[-.06em]">∞</p><p className="mt-2 text-xs font-bold uppercase tracking-[.15em] text-[#68675f]">Ideas to explore</p></div></div></div></div></section>

        <section className="container-gwm py-24 md:py-32"><p className="eyebrow mb-8">Who we work with</p><div className="flex flex-wrap gap-x-5 gap-y-2 text-2xl font-bold tracking-[-.04em] md:text-4xl">{industries.map((industry, index) => <span key={industry} className="reveal">{industry}{index < industries.length - 1 ? ' /' : ''}</span>)}</div></section>

        <section id="contact" className="relative overflow-hidden bg-[#f5d90a] py-28 md:py-40"><div className="container-gwm relative z-10"><p className="eyebrow mb-5">Ready to grow?</p><h2 className="section-title max-w-5xl">Your business<br />deserves to<br /><span className="relative inline-block"><span className="relative z-10">be seen.</span><span className="absolute bottom-1 left-0 -z-0 h-[.15em] w-full bg-white" /></span></h2><div className="mt-12 flex flex-wrap gap-4"><a href="https://wa.me/918434305404" target="_blank" rel="noreferrer" className="dark-button magnetic">WhatsApp Us <ArrowUpRight size={17} /></a><a href="mailto:growithmeayush@gmail.com" className="yellow-button magnetic">Send Email <ArrowUpRight size={17} /></a></div></div><div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[60px] border-black/10" /></section>
      </main>

      <footer className="bg-[#111] py-12 text-white"><div className="container-gwm flex flex-col justify-between gap-10 md:flex-row md:items-end"><div><p className="text-2xl font-black tracking-[-.06em]">GROW WITH ME</p><p className="mt-2 text-xs uppercase tracking-[.16em] text-white/50">Social Media · Design · Video · Digital Marketing</p></div><div className="text-sm text-white/60 md:text-right"><p>8434305404 · growithmeayush@gmail.com</p><p className="mt-2">© 2026 Grow With Me. All Rights Reserved.</p></div></div></footer>
    </div>
  )
}

export default App
