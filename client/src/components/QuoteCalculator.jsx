import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Check, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getServices } from '../services/api.js'
import '../styles/quote-calculator.css'

const pricing = {
  'social-media-management': 5000,
  'reels-video-editing': 2500,
  'graphic-designing': 1500,
  'social-media-advertising': 3500,
  'business-promotion': 2500,
  'website-design': 8000,
}

const sizeOptions = [
  ['small', 'Starter', 1],
  ['medium', 'Growth', 1.55],
  ['large', 'Scale', 2.25],
]
const complexityOptions = [
  ['simple', 'Simple', 1],
  ['standard', 'Standard', 1.2],
  ['premium', 'Premium', 1.45],
]
const timelineOptions = [
  ['flexible', 'Flexible timeline', 1],
  ['standard', 'Standard timeline', 1.08],
  ['rush', 'Rush delivery', 1.2],
]
const addons = [
  ['strategy', 'Strategy & planning', 1000],
  ['content', 'Content calendar', 800],
  ['extra', 'Extra revision round', 500],
]

const slugify = (value = '') =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const money = (value) => `₹${Math.round(value).toLocaleString('en-IN')}`

export default function QuoteCalculator() {
  const [services, setServices] = useState([])
  const [servicesLoading, setServicesLoading] = useState(true)
  const [serviceError, setServiceError] = useState('')
  const [form, setForm] = useState({
    service: '',
    size: 'small',
    complexity: 'standard',
    timeline: 'flexible',
    addons: [],
  })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    let active = true
    getServices()
      .then((data) => {
        if (!active) return
        const list = Array.isArray(data) ? data : Array.isArray(data?.services) ? data.services : []
        const activeServices = list.filter((service) => service?.active !== false && service?.title)
        setServices(activeServices)
        if (activeServices.length) {
          setForm((current) => ({
            ...current,
            service: current.service || activeServices[0].slug || slugify(activeServices[0].title),
          }))
        }
      })
      .catch(() => {
        if (active) setServiceError('Services could not be loaded. Please try again.')
      })
      .finally(() => {
        if (active) setServicesLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const toggleAddon = (key) =>
    setForm((current) => ({
      ...current,
      addons: current.addons.includes(key)
        ? current.addons.filter((item) => item !== key)
        : [...current.addons, key],
    }))

  const selectedService = services.find(
    (service) => (service.slug || slugify(service.title)) === form.service,
  )
  const serviceKey = selectedService?.slug || slugify(selectedService?.title)

  const estimate = useMemo(() => {
    const base = pricing[serviceKey] || 2500
    const multiplier =
      (sizeOptions.find(([key]) => key === form.size)?.[2] || 1) *
      (complexityOptions.find(([key]) => key === form.complexity)?.[2] || 1) *
      (timelineOptions.find(([key]) => key === form.timeline)?.[2] || 1)
    const extras = addons
      .filter(([key]) => form.addons.includes(key))
      .reduce((sum, [, , price]) => sum + price, 0)
    const total = base * multiplier + extras
    return { low: total * 0.9, high: total * 1.1 }
  }, [form, serviceKey])

  const selectedServiceTitle = selectedService?.title || ''
  const estimateLow = money(estimate.low)
  const estimateHigh = money(estimate.high)
  const contactHash = `#contact?service=${encodeURIComponent(selectedServiceTitle)}&low=${encodeURIComponent(estimateLow)}&high=${encodeURIComponent(estimateHigh)}`

  const reset = () => {
    setForm((current) => ({
      ...current,
      service: services[0]?.slug || slugify(services[0]?.title) || '',
      size: 'small',
      complexity: 'standard',
      timeline: 'flexible',
      addons: [],
    }))
    setSubmitted(false)
  }

  return (
    <section className="quote-calculator" id="quote">
      <div className="quote-calculator-container">
        <div className="quote-calculator-heading">
          <div>
            <p className="quote-eyebrow">Quick estimate</p>
            <h2>What might your project cost?</h2>
            <p>
              Choose a few options to get a starting estimate. Final pricing is confirmed after we
              understand your exact requirements.
            </p>
          </div>
          <span className="quote-badge">ESTIMATE ONLY</span>
        </div>
        <div className="quote-calculator-grid">
          <div className="quote-form-panel">
            <Field title="1. What do you need?">
              {servicesLoading ? (
                <p className="quote-service-status">Loading services…</p>
              ) : serviceError ? (
                <p className="quote-service-status quote-service-error">{serviceError}</p>
              ) : services.length ? (
                <div className="quote-options">
                  {services.map((service) => {
                    const key = service.slug || slugify(service.title)
                    return (
                      <button
                        type="button"
                        className={form.service === key ? 'selected' : ''}
                        onClick={() => update('service', key)}
                        key={service._id || key}
                      >
                        {service.title}
                      </button>
                    )
                  })}
                </div>
              ) : (
                <p className="quote-service-status">No active services available.</p>
              )}
            </Field>
            <Field title="2. Project size">
              <div className="quote-options three">
                {sizeOptions.map(([key, label]) => (
                  <button
                    type="button"
                    className={form.size === key ? 'selected' : ''}
                    onClick={() => update('size', key)}
                    key={key}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </Field>
            <Field title="3. Complexity">
              <div className="quote-options three">
                {complexityOptions.map(([key, label]) => (
                  <button
                    type="button"
                    className={form.complexity === key ? 'selected' : ''}
                    onClick={() => update('complexity', key)}
                    key={key}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </Field>
            <Field title="4. Timeline">
              <div className="quote-options three">
                {timelineOptions.map(([key, label]) => (
                  <button
                    type="button"
                    className={form.timeline === key ? 'selected' : ''}
                    onClick={() => update('timeline', key)}
                    key={key}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </Field>
            <Field title="5. Add-ons">
              <div className="quote-addons">
                {addons.map(([key, label]) => (
                  <button
                    type="button"
                    className={form.addons.includes(key) ? 'selected' : ''}
                    onClick={() => toggleAddon(key)}
                    key={key}
                  >
                    <span>{form.addons.includes(key) ? <Check size={15} /> : null}</span>
                    {label}
                  </button>
                ))}
              </div>
            </Field>
          </div>
          <aside className="quote-result-panel">
            <p>Estimated range</p>
            <strong>
              {estimateLow} — {estimateHigh}
            </strong>
            <small>
              Based on your selections. This is a starting range, not a final quotation.
            </small>
            <Link to={`/${contactHash}`} className="quote-cta" onClick={() => setSubmitted(true)}>
              Get this estimate <ArrowRight size={17} />
            </Link>
            <button className="quote-reset" type="button" onClick={reset}>
              <RotateCcw size={14} /> Start over
            </button>
            {submitted ? (
              <div className="quote-saved">
                Your estimate is ready. Share your requirements in the enquiry form.
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </section>
  )
}

function Field({ title, children }) {
  return (
    <div className="quote-field">
      <h3>{title}</h3>
      {children}
    </div>
  )
}
