import { useEffect } from 'react'
import gsap from 'gsap'

export default function HeaderEnhancer() {
  useEffect(() => {
    const header = document.querySelector('header')
    if (!header) return undefined

    let last = window.scrollY
    let ticking = false

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
    }
  }, [])

  return null
}
