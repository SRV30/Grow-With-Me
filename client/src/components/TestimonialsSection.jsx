import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Quote, Star } from 'lucide-react'
import { getTestimonials } from '../services/api.js'
import '../styles/testimonials.css'

export default function TestimonialsSection() {
  const [items, setItems] = useState([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    getTestimonials()
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
  }, [])

  if (!items.length) return null

  const item = items[index]
  const previous = () => setIndex((current) => (current - 1 + items.length) % items.length)
  const next = () => setIndex((current) => (current + 1) % items.length)

  return (
    <section className="testimonials-section" id="testimonials">
      <div className="testimonials-container">
        <div className="testimonials-heading">
          <div>
            <p className="testimonials-eyebrow">Client words</p>
            <h2>What our clients say.</h2>
          </div>
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
        </div>

        <article className="testimonial-card">
          <Quote className="testimonial-quote-icon" size={42} />
          <div className="testimonial-stars" aria-label={`${item.rating || 5} out of 5 stars`}>
            {Array.from({ length: 5 }, (_, star) => (
              <Star
                key={star}
                size={17}
                fill={star < (item.rating || 5) ? 'currentColor' : 'none'}
              />
            ))}
          </div>
          <blockquote>“{item.quote}”</blockquote>
          <div className="testimonial-author">
            {item.avatar?.url ? (
              <img src={item.avatar.url} alt={item.avatar.alt || item.name} />
            ) : (
              <span className="testimonial-avatar-fallback">
                {item.name?.charAt(0)?.toUpperCase()}
              </span>
            )}
            <div>
              <strong>{item.name}</strong>
              <span>{[item.role, item.company].filter(Boolean).join(' · ') || 'Client'}</span>
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
      </div>
    </section>
  )
}
