import logoUrl from '../assets/img.png'

const API_BASE = (import.meta.env.VITE_BACKEND_URL || '/api').replace(/\/$/, '')

const normalize = (value = '') =>
  value
    .trim()
    .toLowerCase()
    .replace(/[-_]+/g, ' ')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const slugify = (value = '') =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const getWorkItems = () => Array.from(document.querySelectorAll('#work .figma-project-card'))

const shuffle = (items) => {
  const shuffled = [...items]
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const applyHeaderLogo = () => {
  document.querySelectorAll('.figma-logo').forEach((logo) => {
    let image = logo.querySelector('.figma-header-logo-image')
    if (!image) {
      image = document.createElement('img')
      image.className = 'figma-header-logo-image'
      image.src = logoUrl
      image.alt = 'Grow With Me'
      image.loading = 'eager'
      image.decoding = 'async'
      logo.prepend(image)
    }

    logo.querySelectorAll(':scope > span').forEach((span) => {
      span.style.display = 'none'
    })

    logo.style.display = 'inline-flex'
    logo.style.alignItems = 'center'
    logo.style.width = 'max-content'
    logo.style.height = '48px'
    logo.style.gap = '0'

    image.style.display = 'block'
    image.style.width = 'auto'
    image.style.height = '48px'
    image.style.maxWidth = '180px'
    image.style.objectFit = 'contain'
  })
}

const applyContactLogo = () => {
  document.querySelectorAll('.row-contact-copy').forEach((copy) => {
    let image = copy.querySelector('.row-contact-logo')
    if (!image) {
      image = document.createElement('img')
      image.className = 'row-contact-logo'
      image.src = logoUrl
      image.alt = 'Grow With Me'
      image.loading = 'lazy'
      image.decoding = 'async'

      const description = copy.querySelector('p:last-child')
      if (description) description.insertAdjacentElement('afterend', image)
      else copy.appendChild(image)
    }
  })
}

const applyWorkFilter = (button) => {
  const filter = normalize(button.dataset.filter || button.textContent)
  const items = getWorkItems()
  let visible = 0

  items.forEach((item) => {
    const category = normalize(item.querySelector('.figma-project-overlay span')?.textContent)
    const matches = filter === 'all' || category === filter
    item.hidden = !matches
    if (matches) visible += 1
  })

  document.querySelectorAll('#work .row-work-filters button').forEach((item) => {
    item.classList.toggle('selected', item === button)
    item.setAttribute('aria-pressed', item === button ? 'true' : 'false')
  })

  let empty = document.querySelector('#work [data-work-filter-empty]')
  if (!visible && items.length) {
    if (!empty) {
      empty = document.createElement('div')
      empty.dataset.workFilterEmpty = 'true'
      empty.className = 'row-empty-work row-filter-empty'
      document.querySelector('#work .row-work-grid')?.appendChild(empty)
    }
    empty.textContent = `No featured projects available in ${button.textContent.trim()}.`
    empty.hidden = false
  } else if (empty) {
    empty.hidden = true
  }
}

const syncServices = async () => {
  const grid = document.querySelector('#services .row-service-grid')
  if (!grid || grid.dataset.gwmServicesSynced === 'true') return

  try {
    const response = await fetch(`${API_BASE}/services`, { credentials: 'include' })
    if (!response.ok) return
    const payload = await response.json()
    const services = Array.isArray(payload.data) ? shuffle(payload.data) : []
    if (!services.length) return

    const serviceCards = Array.from(grid.querySelectorAll('.row-service-card'))
    services.forEach((service, index) => {
      let card = serviceCards[index]
      if (!card) {
        card = serviceCards[serviceCards.length - 1]?.cloneNode(true)
        if (!card) return
        grid.appendChild(card)
        serviceCards.push(card)
      }

      const title = card.querySelector('h3')
      const description = card.querySelector('p')
      if (title) title.textContent = service.title
      if (description) description.textContent = service.description
      card.dataset.serviceSlug = service.slug
      card.href = `/work?service=${encodeURIComponent(service.slug)}`
      card.setAttribute('aria-label', `View ${service.title} portfolio`)
      card.hidden = false
    })

    serviceCards.slice(services.length).forEach((card) => card.remove())
    grid.dataset.gwmServicesSynced = 'true'

    const contactSelect = document.querySelector('.figma-contact-form select')
    if (contactSelect && contactSelect.dataset.gwmServicesSynced !== 'true') {
      const current = contactSelect.value
      contactSelect.innerHTML = '<option value="">Select a service</option>'
      services.forEach((service) => {
        const option = document.createElement('option')
        option.value = service.title
        option.textContent = service.title
        contactSelect.appendChild(option)
      })
      contactSelect.value = services.some((service) => service.title === current) ? current : ''
      contactSelect.dataset.gwmServicesSynced = 'true'
    }
  } catch {
    // Keep the static fallback services if the API is unavailable.
  }
}

const syncProjectCategorySelect = async () => {
  const select = document.querySelector('.admin-editor-page select')
  if (!select || select.dataset.gwmServicesSynced === 'true') return

  try {
    const response = await fetch(`${API_BASE}/services`, { credentials: 'include' })
    if (!response.ok) return
    const payload = await response.json()
    const services = Array.isArray(payload.data) ? payload.data : []
    if (!services.length) return

    const current = select.value
    select.innerHTML = ''
    services.forEach((service) => {
      const option = document.createElement('option')
      option.value = service.slug
      option.textContent = service.title
      select.appendChild(option)
    })

    if (services.some((service) => service.slug === current)) select.value = current
    select.dataset.gwmServicesSynced = 'true'
  } catch {
    // Keep the existing category options if the API is unavailable.
  }
}

const initializeWorkFilters = () => {
  applyHeaderLogo()
  applyContactLogo()

  const buttons = document.querySelectorAll('#work .row-work-filters button')
  buttons.forEach((button) => {
    button.type = 'button'
    button.dataset.filter = normalize(button.textContent)
    button.setAttribute('aria-pressed', button.classList.contains('selected') ? 'true' : 'false')
  })

  syncServices()
  syncProjectCategorySelect()

  if (!document.documentElement.dataset.gwmWorkFilterBound) {
    document.addEventListener('click', (event) => {
      const button = event.target.closest('#work .row-work-filters button')
      if (button) {
        applyWorkFilter(button)
        return
      }

      const serviceCard = event.target.closest('.row-service-card')
      if (serviceCard) {
        const slug = serviceCard.dataset.serviceSlug
        const title = serviceCard.querySelector('h3')?.textContent?.trim()
        window.location.href = `/work?service=${encodeURIComponent(slug || slugify(title || ''))}`
      }
    })
    document.documentElement.dataset.gwmWorkFilterBound = 'true'
  }
}

initializeWorkFilters()

const observer = new MutationObserver(initializeWorkFilters)
observer.observe(document.body, { childList: true, subtree: true })
