import { useMemo, useState } from 'react'
import { ArrowRight, Check, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'
import '../styles/quote-calculator.css'

const options = {
  service: [
    ['social', 'Social Media Management', 5000],
    ['reels', 'Reels & Video Editing', 2500],
    ['design', 'Graphic Designing', 1500],
    ['ads', 'Social Media Advertising', 3500],
    ['promotion', 'Business Promotion', 2500],
    ['website', 'Website Design', 6000],
  ],
  size: [
    ['small', 'Starter', 1],
    ['medium', 'Growth', 1.35],
    ['large', 'Scale', 1.8],
  ],
  complexity: [
    ['simple', 'Simple', 1],
    ['standard', 'Standard', 1.2],
    ['premium', 'Premium', 1.45],
  ],
  timeline: [
    ['flexible', 'Flexible timeline', 1],
    ['standard', 'Standard timeline', 1.08],
    ['rush', 'Rush delivery', 1.2],
  ],
}
const addons = [
  ['strategy', 'Strategy & planning', 1000],
  ['content', 'Content calendar', 800],
  ['extra', 'Extra revision round', 500],
]

const money = (value) => `₹${Math.round(value).toLocaleString('en-IN')}`

export default function QuoteCalculator() {
  const [form, setForm] = useState({
    service: 'social',
    size: 'small',
    complexity: 'standard',
    timeline: 'flexible',
    addons: [],
  })
  const [submitted, setSubmitted] = useState(false)
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const toggleAddon = (key) =>
    setForm((current) => ({
      ...current,
      addons: current.addons.includes(key)
        ? current.addons.filter((item) => item !== key)
        : [...current.addons, key],
    }))

  const estimate = useMemo(() => {
    const base = options.service.find(([key]) => key === form.service)?.[2] || 0
    const multiplier =
      (options.size.find(([key]) => key === form.size)?.[2] || 1) *
      (options.complexity.find(([key]) => key === form.complexity)?.[2] || 1) *
      (options.timeline.find(([key]) => key === form.timeline)?.[2] || 1)
    const extras = addons
      .filter(([key]) => form.addons.includes(key))
      .reduce((sum, [, , price]) => sum + price, 0)
    const total = base * multiplier + extras
    return { low: total * 0.9, high: total * 1.1 }
  }, [form])

  const selectedService = options.service.find(([key]) => key === form.service)?.[1] || ''
  const estimateLow = money(estimate.low)
  const estimateHigh = money(estimate.high)
  const contactHash = `#contact?service=${encodeURIComponent(selectedService)}&low=${encodeURIComponent(estimateLow)}&high=${encodeURIComponent(estimateHigh)}`

  const reset = () => {
    setForm({
      service: 'social',
      size: 'small',
      complexity: 'standard',
      timeline: 'flexible',
      addons: [],
    })
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
              <div className="quote-options">
                {options.service.map(([key, label]) => (
                  <button
                    type="button"
                    className={form.service === key ? 'selected' : ''}
                    onClick={() => update('service', key)}
                    key={key}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </Field>
            <Field title="2. Project size">
              <div className="quote-options three">
                {options.size.map(([key, label]) => (
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
                {options.complexity.map(([key, label]) => (
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
                {options.timeline.map(([key, label]) => (
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
