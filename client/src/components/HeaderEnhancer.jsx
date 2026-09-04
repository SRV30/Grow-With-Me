import { useEffect } from 'react'
import gsap from 'gsap'
import '../styles/header-theme-fix.css'

export default function HeaderEnhancer() {
  useEffect(() => {
    const header = document.querySelector('header')
    if (!header) return undefined

    let last = window.scrollY
    let ticking = false
    const site = document.querySelector('.figma-site')
    const storedTheme = localStorage.getItem('gwm-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    let darkMode = storedTheme ? storedTheme === 'dark' : prefersDark

    const applyTheme = (animate = false) => {
      site?.classList.toggle('theme-dark', darkMode)
      document.documentElement.classList.toggle('gwm-dark', darkMode)
      document.documentElement.style.colorScheme = darkMode ? 'dark' : 'light'
      localStorage.setItem('gwm-theme', darkMode ? 'dark' : 'light')

      const toggle = header.querySelector('[data-theme-toggle]')
      if (toggle) {
        toggle.setAttribute('aria-pressed', String(darkMode))
        toggle.setAttribute('aria-label', darkMode ? 'Switch to light mode' : 'Switch to dark mode')
        toggle.setAttribute('title', darkMode ? 'Light mode' : 'Dark mode')
        toggle.innerHTML = darkMode
          ? '<span aria-hidden="true">☀</span>'
          : '<span aria-hidden="true">☾</span>'
      }

      if (animate && site) {
        site.classList.remove('dark-mode-transition')
        void site.offsetWidth
        site.classList.add('dark-mode-transition')
        window.setTimeout(() => site.classList.remove('dark-mode-transition'), 560)
      }
    }

    const toggleTheme = () => {
      darkMode = !darkMode
      applyTheme(true)
    }

    let themeToggle = header.querySelector('[data-theme-toggle]')
    if (!themeToggle) {
      themeToggle = document.createElement('button')
      themeToggle.type = 'button'
      themeToggle.dataset.themeToggle = 'true'
      themeToggle.className = 'theme-toggle'
      themeToggle.addEventListener('click', toggleTheme)
      header.querySelector('.row-header-inner')?.appendChild(themeToggle)
    }

    applyTheme()

    const update = () => {
      const y = window.scrollY
      header.classList.toggle('header-scrolled', y > 24)
      header.classList.toggle('header-hidden', y > last + 12 && y > 180)
      if (y < last - 12) header.classList.remove('header-hidden')
      last = y
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update)
        ticking = true
      }
    }

    const onMouse = (event) => {
      const button = event.target.closest('header a, header button')
      if (!button || window.matchMedia('(pointer:coarse)').matches) return
      const rect = button.getBoundingClientRect()
      gsap.to(button, {
        x: (event.clientX - rect.left - rect.width / 2) * 0.06,
        y: (event.clientY - rect.top - rect.height / 2) * 0.06,
        duration: 0.25,
        ease: 'power3.out',
        overwrite: true,
      })
    }

    const reset = (event) => {
      const button = event.target.closest('header a, header button')
      if (button) gsap.to(button, { x: 0, y: 0, duration: 0.4, ease: 'power3.out' })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    header.addEventListener('pointermove', onMouse)
    header.addEventListener('pointerleave', reset, true)
    update()

    return () => {
      window.removeEventListener('scroll', onScroll)
      header.removeEventListener('pointermove', onMouse)
      header.removeEventListener('pointerleave', reset, true)
      themeToggle?.removeEventListener('click', toggleTheme)
    }
  }, [])

  return null
}
