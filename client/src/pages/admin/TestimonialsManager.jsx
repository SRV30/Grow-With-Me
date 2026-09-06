import { useEffect, useMemo, useState } from 'react'
import { Check, Edit3, MessageSquareQuote, RefreshCw, Trash2, X } from 'lucide-react'
import { api } from '../../services/api.js'
import './testimonials-manager.css'

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
  const [filter, setFilter] = useState('pending')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/testimonials/admin')
      setItems(data.data || [])
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to load testimonials')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    load()
  }, [])

  const pending = useMemo(() => items.filter((item) => !item.published), [items])
  const published = useMemo(() => items.filter((item) => item.published), [items])
  const visibleItems = filter === 'pending' ? pending : filter === 'published' ? published : items
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const startEdit = (item) => {
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
  const cancelEdit = () => {
    setEditing(null)
    setForm(empty)
  }

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editing) await api.put(`/testimonials/${editing}`, form)
      else await api.post('/testimonials', form)
      cancelEdit()
      await load()
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to save testimonial')
    } finally {
      setSaving(false)
    }
  }

  const setPublished = async (item, publishedValue) => {
    try {
      await api.put(`/testimonials/${item._id}`, { published: publishedValue })
      await load()
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to update testimonial')
    }
  }

  const remove = async (item) => {
    const action = item.published ? 'delete this published testimonial' : 'reject this testimonial'
    if (!window.confirm(`Are you sure you want to ${action}?`)) return
    try {
      await api.delete(`/testimonials/${item._id}`)
      await load()
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to delete testimonial')
    }
  }

  return (
    <section className="testimonial-admin-page">
      <header className="testimonial-admin-header">
        <div>
          <p className="admin-eyebrow">Social proof</p>
          <h1>Testimonials</h1>
          <p className="testimonial-admin-subtitle">
            Review client feedback before it appears on the website.
          </p>
        </div>
        <button type="button" className="admin-icon" onClick={load} title="Refresh testimonials" aria-label="Refresh testimonials">
          <RefreshCw size={17} />
        </button>
      </header>
      {error && <div className="admin-alert" role="alert">{error}</div>}

      <section className="testimonial-admin-stats" aria-label="Testimonial statistics">
        <button type="button" className={filter === 'pending' ? 'active' : ''} onClick={() => setFilter('pending')}>
          <span>Pending approval</span><strong>{pending.length}</strong>
        </button>
        <button type="button" className={filter === 'published' ? 'active' : ''} onClick={() => setFilter('published')}>
          <span>Published</span><strong>{published.length}</strong>
        </button>
        <button type="button" className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
          <span>Total</span><strong>{items.length}</strong>
        </button>
      </section>

      {editing && (
        <form className="testimonial-admin-form" onSubmit={submit}>
          <div className="testimonial-admin-form-title">
            <div><span>Edit testimonial</span><small>Changes are saved directly to the CMS.</small></div>
            <button type="button" className="testimonial-admin-close" onClick={cancelEdit} aria-label="Cancel editing"><X size={18} /></button>
          </div>
          <div className="testimonial-admin-form-grid">
            <label>Name *<input value={form.name} onChange={(e) => update('name', e.target.value)} required /></label>
            <label>Company<input value={form.company} onChange={(e) => update('company', e.target.value)} /></label>
            <label>Role<input value={form.role} onChange={(e) => update('role', e.target.value)} /></label>
            <label>Rating<select value={form.rating} onChange={(e) => update('rating', Number(e.target.value))}>{[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} / 5</option>)}</select></label>
          </div>
          <label>Testimonial *<textarea rows="5" value={form.quote} onChange={(e) => update('quote', e.target.value)} required maxLength={1200} /></label>
          <div className="testimonial-admin-form-options">
            <label><input type="checkbox" checked={form.featured} onChange={(e) => update('featured', e.target.checked)} /> Featured</label>
            <label><input type="checkbox" checked={form.published} onChange={(e) => update('published', e.target.checked)} /> Published</label>
            <label>Order<input type="number" value={form.order} onChange={(e) => update('order', Number(e.target.value))} /></label>
          </div>
          <div className="testimonial-admin-form-actions">
            <button type="submit" className="admin-primary" disabled={saving}>{saving ? 'Saving…' : 'Save testimonial'}</button>
            <button type="button" className="admin-secondary" onClick={cancelEdit}>Cancel</button>
          </div>
        </form>
      )}

      <section className="testimonial-admin-list" aria-label="Testimonials">
        <div className="testimonial-admin-list-header">
          <div>
            <h2>{filter === 'pending' ? 'Awaiting approval' : filter === 'published' ? 'Published testimonials' : 'All testimonials'}</h2>
            <span>{visibleItems.length} {visibleItems.length === 1 ? 'testimonial' : 'testimonials'}</span>
          </div>
        </div>
        {loading ? <div className="testimonial-admin-empty">Loading testimonials…</div> : visibleItems.length === 0 ? (
          <div className="testimonial-admin-empty">
            <MessageSquareQuote size={28} />
            <strong>{filter === 'pending' ? 'No testimonials waiting for approval.' : 'No testimonials here yet.'}</strong>
            <span>New client submissions will appear here automatically.</span>
          </div>
        ) : visibleItems.map((item) => (
          <article className={item.published ? 'testimonial-review-card published' : 'testimonial-review-card'} key={item._id}>
            <div className="testimonial-review-main">
              <div className="testimonial-review-meta">
                <span className={item.published ? 'testimonial-status approved' : 'testimonial-status pending'}>{item.published ? 'Published' : 'Pending approval'}</span>
                <span>{item.rating}/5</span>
              </div>
              <blockquote>“{item.quote}”</blockquote>
              <div className="testimonial-review-author">
                <span className="testimonial-review-avatar">{item.name?.charAt(0)?.toUpperCase()}</span>
                <div><strong>{item.name}</strong><span>{[item.role, item.company].filter(Boolean).join(' · ') || 'Client'}</span></div>
              </div>
            </div>
            <div className="testimonial-review-actions">
              {!item.published ? (
                <button type="button" className="testimonial-approve" onClick={() => setPublished(item, true)}><Check size={16} /> Approve & publish</button>
              ) : (
                <button type="button" className="testimonial-unpublish" onClick={() => setPublished(item, false)}>Unpublish</button>
              )}
              <button type="button" className="testimonial-edit" onClick={() => startEdit(item)}><Edit3 size={15} /> Edit</button>
              <button type="button" className="testimonial-reject" onClick={() => remove(item)}><Trash2 size={15} /> {item.published ? 'Delete' : 'Reject'}</button>
            </div>
          </article>
        ))}
      </section>
    </section>
  )
}
