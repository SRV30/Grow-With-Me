const normalize = (value = '') =>
  value
    .trim()
    .toLowerCase()
    .replace(/[-_]+/g, ' ')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const getWorkItems = () => Array.from(document.querySelectorAll('#work .figma-project-card'))

const getCategoryForService = (serviceTitle) => {
  const requested = new Set(normalize(serviceTitle).split(' ').filter(Boolean))
  const categories = [...new Set(
    getWorkItems()
      .map((item) => item.querySelector('.figma-project-overlay span')?.textContent)
      .filter(Boolean)
      .map(normalize),
  )]

  let bestCategory = ''
  let bestScore = 0
  categories.forEach((category) => {
    const score = category
      .split(' ')
      .filter((token) => requested.has(token)).length
    if (score > bestScore) {
      bestScore = score
      bestCategory = category
    }
  })

  return bestCategory || normalize(serviceTitle)
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

const initializeWorkFilters = () => {
  const buttons = document.querySelectorAll('#work .row-work-filters button')
  buttons.forEach((button) => {
    button.type = 'button'
    button.dataset.filter = normalize(button.textContent)
    button.setAttribute('aria-pressed', button.classList.contains('selected') ? 'true' : 'false')
  })

  if (!document.documentElement.dataset.gwmWorkFilterBound) {
    document.addEventListener('click', (event) => {
      const button = event.target.closest('#work .row-work-filters button')
      if (button) {
        applyWorkFilter(button)
        return
      }

      const serviceCard = event.target.closest('.row-service-card')
      if (serviceCard) {
        const title = serviceCard.querySelector('h3')?.textContent?.trim()
        if (title) {
          const category = getCategoryForService(title)
          window.location.href = `/work?service=${encodeURIComponent(category)}`
        } else {
          window.location.href = '/work'
        }
      }
    })
    document.documentElement.dataset.gwmWorkFilterBound = 'true'
  }
}

initializeWorkFilters()

const observer = new MutationObserver(initializeWorkFilters)
observer.observe(document.body, { childList: true, subtree: true })
