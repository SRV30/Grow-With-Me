const MOBILE_BREAKPOINT = 520
const TYPING_WORDS = ['Business.', 'Presence.', 'Audience.']

function enhanceMobileHero() {
  if (window.innerWidth > MOBILE_BREAKPOINT) return

  const hero = document.querySelector('.hero-collage-section')
  if (!hero) return

  const heading = hero.querySelector('.row-hero-copy h1')
  if (heading && heading.dataset.mobileEnhanced !== 'true') {
    heading.dataset.mobileEnhanced = 'true'
    heading.innerHTML = `
      <span class="mobile-hero-static-line">Grow Your</span>
      <span class="mobile-hero-typing-line">
        <span class="mobile-hero-typing-text"></span><span class="mobile-hero-cursor" aria-hidden="true"></span>
      </span>
      <span class="mobile-hero-static-line">Build Your Brand.</span>
      <span class="mobile-hero-static-line">Get Noticed.</span>
    `

    const typingTarget = heading.querySelector('.mobile-hero-typing-text')
    let wordIndex = 0
    let charIndex = 0
    let deleting = false

    const type = () => {
      if (!typingTarget || window.innerWidth > MOBILE_BREAKPOINT) return
      const word = TYPING_WORDS[wordIndex]

      if (!deleting) {
        charIndex += 1
        typingTarget.textContent = word.slice(0, charIndex)
        if (charIndex === word.length) {
          deleting = true
          window.setTimeout(type, 1500)
          return
        }
      } else {
        charIndex -= 1
        typingTarget.textContent = word.slice(0, charIndex)
        if (charIndex === 0) {
          deleting = false
          wordIndex = (wordIndex + 1) % TYPING_WORDS.length
        }
      }

      window.setTimeout(type, deleting ? 55 : 95)
    }

    type()
  }

  const servicesLine = hero.querySelector('.row-lead-services')
  if (servicesLine && servicesLine.dataset.mobileEnhanced !== 'true') {
    servicesLine.dataset.mobileEnhanced = 'true'
    const items = ['Video Editing', 'Graphic Design', 'Social Media', 'Digital Marketing']
    servicesLine.innerHTML = items
      .map((item) => `<span class="mobile-hero-service-pill">${item}</span>`)
      .join('')
  }

  const primaryButton = hero.querySelector('.figma-yellow-button')
  if (primaryButton && primaryButton.dataset.mobileEnhanced !== 'true') {
    primaryButton.dataset.mobileEnhanced = 'true'
    primaryButton.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) node.textContent = "Let's Work Together "
    })
  }
}

let resizeTimer
const run = () => window.requestAnimationFrame(enhanceMobileHero)

run()

const observer = new MutationObserver(run)
observer.observe(document.body, { childList: true, subtree: true })

window.addEventListener('resize', () => {
  window.clearTimeout(resizeTimer)
  resizeTimer = window.setTimeout(run, 120)
})
