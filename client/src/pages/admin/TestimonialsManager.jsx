import { useEffect, useState } from 'react'
import { api } from '../../services/api.js'

const empty = {
  name: '',
  company: '',
  role: '',
  quote: '',
  rating: 5,
  featured: false,
  published: false,
  order: 0,
}

export default function TestimonialsManager() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)
  const load = () => api.get('/testimonials').then(({ data }) => setItems(data.data || []))
  useEffect(() => {
    load()
  }, [])
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const submit = async (event) => {
    event.preventDefault()
    if (editing) await api.put(`/testimonials/${editing}`, form)
    else await api.post('/testimonials', form)
    setForm(empty)
    setEditing(null)
    load()
  }
  const edit = (item) => {
    setEditing(item._id)
    setForm({
      name: item.name || '',
      company: item.company || '',
      role: item.role || '',
      quote: item.quote || '',
      rating: item.rating || 5,
      featured: !!item.featured,
      published: !!item.published,
      order: item.order || 0,
    })
  }
  const remove = async (id) => {
    if (window.confirm('Delete this testimonial?')) {
      await api.delete(`/testimonials/${id}`)
      load()
    }
  }
  return (
    <section className="admin-section">
      <h1>Testimonials</h1>
      <form onSubmit={submit} className="admin-form">
        {['name', 'company', 'role'].map((key) => (
          <label key={key}>
            {key}
            <input
              value={form[key]}
              onChange={(e) => update(key, e.target.value)}
              required={key === 'name'}
            />
          </label>
        ))}
        <label>
          Quote
          <textarea
            rows="5"
            value={form.quote}
            onChange={(e) => update('quote', e.target.value)}
            required
          />
        </label>
        <label>
          Rating
          <select value={form.rating} onChange={(e) => update('rating', Number(e.target.value))}>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label>
          Order
          <input
            type="number"
            value={form.order}
            onChange={(e) => update('order', Number(e.target.value))}
          />
        </label>
        <label>
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => update('featured', e.target.checked)}
          />{' '}
          Featured
        </label>
        <label>
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => update('published', e.target.checked)}
          />{' '}
          Published
        </label>
        <button type="submit">{editing ? 'Update testimonial' : 'Add testimonial'}</button>
        {editing ? (
          <button
            type="button"
            onClick={() => {
              setEditing(null)
              setForm(empty)
            }}
          >
            Cancel
          </button>
        ) : null}
      </form>
      <div>
        {items.map((item) => (
          <article key={item._id}>
            <strong>{item.name}</strong>
            <p>{item.quote}</p>
            <small>
              {item.published ? 'Published' : 'Draft'} · {item.rating}/5
            </small>
            <button type="button" onClick={() => edit(item)}>
              Edit
            </button>
            <button type="button" onClick={() => remove(item._id)}>
              Delete
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
