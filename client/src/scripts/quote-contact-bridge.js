const QUOTE_PREFIX = '#contact?'

function readQuoteData() {
  const hash = window.location.hash
  if (!hash.startsWith(QUOTE_PREFIX)) return null
  const params = new URLSearchParams(hash.slice(QUOTE_PREFIX.length))
  const service = params.get('service') || ''
  const low = params.get('low') || ''
  const high = params.get('high') || ''
  if (!service) return null
  return { service, low, high }
}

function setReactField(element, value) {
  if (!element || value == null) return false
  const prototype = Object.getPrototypeOf(element)
  const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value')
  descriptor?.set?.call(element, value)
  element.dispatchEvent(new Event('input', { bubbles: true }))
  element.dispatchEvent(new Event('change', { bubbles: true }))
  return true
}

function applyQuoteToContact() {
  const quote = readQuoteData()
  if (!quote) return false

  const serviceSelect = document.querySelector('.figma-contact-form select')
  const textarea = document.querySelector('.figma-contact-form textarea')
  if (!serviceSelect || !textarea) return false

  const serviceOption = [...serviceSelect.options].find((option) => option.text === quote.service)
  if (serviceOption) setReactField(serviceSelect, serviceOption.value)

  const estimateText =
    quote.low && quote.high
      ? `\n\nQuote estimate: ${quote.low} — ${quote.high}. This is an estimate only.`
      : ''
  const currentMessage = textarea.value || ''
  if (!currentMessage.includes('Quote estimate:')) {
    setReactField(textarea, `${currentMessage}${estimateText}`.trim())
  }

  return true
}

function scheduleApply() {
  let attempts = 0
  const timer = window.setInterval(() => {
    attempts += 1
    if (applyQuoteToContact() || attempts >= 30) window.clearInterval(timer)
  }, 100)
}

window.addEventListener('hashchange', scheduleApply)
window.addEventListener('popstate', scheduleApply)

if (readQuoteData()) scheduleApply()
