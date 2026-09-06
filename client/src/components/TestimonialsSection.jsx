import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Quote, Star, X } from 'lucide-react'
import { getTestimonials, submitTestimonial } from '../services/api.js'
import '../styles/testimonials.css'

const emptyForm = {
  name: '',
  company: '',
  role: '',
  quote: '',
  rating: 5,
}

export default function TestimonialsSection() {
  const [items, setItems] = useState([])
  const [index, setIndex] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const loadTestimonials = () => {
    getTestimonials()
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
  }

  useEffect(() => {
    loadTestimonials()
  }, [])

  const previous = () => setIndex((current) => (current - 1 + items.length) % items.length)
  const next = () => setIndex((current) => (current + 1) % items.length)

  const updateForm = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const closeForm = () => {
    if (submitting) return
    setShowForm(false)
    setSubmitted(false)
    setSubmitError('')
    setForm(emptyForm)
  }

  const submit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setSubmitError('')
    try {
      await submitTestimonial(form)
      setSubmitted(true)
      setForm(emptyForm)
    } catch (error) {
      setSubmitError(
        error.response?.data?.message || 'Unable to submit your testimonial. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="testimonials-section" id="testimonials">
      <div className="testimonials-container">
        <div className="testimonials-heading">
          <div>
            <p className="testimonials-eyebrow">Client words</p>
            <h2>What our clients say.</h2>
          </div>
          <div className="testimonials-heading-actions">
            {items.length > 0 && (
              <div className="testimonials-controls">
                <button type="button" onClick={previous} aria-label="Previous testimonial">
                  <ArrowLeft size={17} />
                </button>
                <span>
                  {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
                </span>
                <button type="button" onClick={next} aria-label="Next testimonial">
                  <ArrowRight size={17} />
                </button>
              </div>
            )}
            <button
              type="button"
              className="testimonial-submit-button"
              onClick={() => setShowForm(true)}
            >
              Share your experience
            </button>
          </div>
        </div>

        {items.length > 0 ? (
          <>
            <article className="testimonial-card">
              <Quote className="testimonial-quote-icon" size={42} />
              <div
                className="testimonial-stars"
                aria-label={`${items[index].rating || 5} out of 5 stars`}
              >
                {Array.from({ length: 5 }, (_, star) => (
                  <Star
                    key={star}
                    size={17}
                    fill={star < (items[index].rating || 5) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <blockquote>“{items[index].quote}”</blockquote>
              <div className="testimonial-author">
                {items[index].avatar?.url ? (
                  <img
                    src={items[index].avatar.url}
                    alt={items[index].avatar.alt || items[index].name}
                  />
                ) : (
                  <span className="testimonial-avatar-fallback">
                    {items[index].name?.charAt(0)?.toUpperCase()}
                  </span>
                )}
                <div>
                  <strong>{items[index].name}</strong>
                  <span>
                    {[items[index].role, items[index].company].filter(Boolean).join(' · ') ||
                      'Client'}
                  </span>
                </div>
              </div>
            </article>

            <div className="testimonials-dots" aria-label="Testimonials">
              {items.map((testimonial, dotIndex) => (
                <button
                  type="button"
                  key={testimonial._id || dotIndex}
                  className={dotIndex === index ? 'active' : ''}
                  onClick={() => setIndex(dotIndex)}
                  aria-label={`Show testimonial ${dotIndex + 1}`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="testimonials-empty">
            <p>Be the first client to share your experience.</p>
            <button
              type="button"
              className="testimonial-submit-button"
              onClick={() => setShowForm(true)}
            >
              Share your experience
            </button>
          </div>
        )}
      </div>

      {showForm && (
        <div className="testimonial-modal-backdrop" role="presentation" onMouseDown={closeForm}>
          <div
            className="testimonial-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="testimonial-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="testimonial-modal-header">
              <div>
                <p className="testimonials-eyebrow">Your experience</p>
                <h3 id="testimonial-modal-title">Tell us what you think.</h3>
              </div>
              <button
                type="button"
                className="testimonial-modal-close"
                onClick={closeForm}
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </div>

            {submitted ? (
              <div className="testimonial-success">
                <div className="testimonial-success-icon">✓</div>
                <h4>Thank you!</h4>
                <p>Your testimonial has been submitted and is waiting for admin approval.</p>
                <button type="button" className="testimonial-submit-button" onClick={closeForm}>
                  Done
                </button>
              </div>
            ) : (
              <form className="testimonial-form" onSubmit={submit}>
                <div className="testimonial-form-grid">
                  <label>
                    Name *
                    <input
                      value={form.name}
                      onChange={(e) => updateForm('name', e.target.value)}
                      required
                      maxLength={120}
                    />
                  </label>
                  <label>
                    Company
                    <input
                      value={form.company}
                      onChange={(e) => updateForm('company', e.target.value)}
                      maxLength={160}
                    />
                  </label>
                  <label>
                    Role
                    <input
                      value={form.role}
                      onChange={(e) => updateForm('role', e.target.value)}
                      maxLength={120}
                    />
                  </label>
                  <label>
                    Rating
                    <select
                      value={form.rating}
                      onChange={(e) => updateForm('rating', Number(e.target.value))}
                    >
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <option key={rating} value={rating}>
                          {rating} / 5
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <label>
                  Your testimonial *
                  <textarea
                    rows="5"
                    value={form.quote}
                    onChange={(e) => updateForm('quote', e.target.value)}
                    required
                    maxLength={1200}
                    placeholder="Tell us about your experience working with Grow With Me..."
                  />
                </label>
                {submitError && (
                  <p className="testimonial-form-error" role="alert">
                    {submitError}
                  </p>
                )}
                <p className="testimonial-form-note">
                  Your testimonial will be reviewed by our team before it appears on the website.
                </p>
                <button
                  type="submit"
                  className="testimonial-submit-button testimonial-submit-full"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting…' : 'Submit testimonial'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
