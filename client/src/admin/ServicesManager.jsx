import { useEffect, useState } from 'react'
import { Pencil, Plus, Trash2, X } from 'lucide-react'
import { api } from '../services/api.js'

const empty = {
  title: '',
  slug: '',
  description: '',
  icon: '',
  featured: false,
  active: true,
  order: 0,
}

const unwrapServices = (value) => {
  if (Array.isArray(value)) return value
  if (Array.isArray(value?.services)) return value.services
  if (Array.isArray(value?.data)) return value.data
  return []
}

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback

export default function ServicesManager() {
  const [services, setServices] = useState([])
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/services')
      setServices(unwrapServices(data?.data))
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Unable to load services.'))
      setServices([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const resetForm = () => {
    setEditing(null)
    setForm({ ...empty })
  }

  const save = async (event) => {
    event.preventDefault()
    if (saving) return

    setSaving(true)
    setError('')
    try {
      const payload = {
        ...form,
        title: form.title.trim(),
        slug: form.slug.trim(),
        description: form.description.trim(),
        icon: form.icon.trim(),
        order: Number(form.order) || 0,
      }

      if (!payload.title || !payload.description) {
        setError('Title and description are required.')
        return
      }

      if (editing) await api.patch(`/services/${editing}`, payload)
      else await api.post('/services', payload)

      resetForm()
      await load()
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Unable to save service.'))
    } finally {
      setSaving(false)
    }
  }

  const edit = (service) => {
    setError('')
    setEditing(service._id)
    setForm({
      title: service.title || '',
      slug: service.slug || '',
      description: service.description || '',
      icon: service.icon || '',
      featured: Boolean(service.featured),
      active: service.active !== false,
      order: Number(service.order) || 0,
    })
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this service?')) return

    setError('')
    try {
      await api.delete(`/services/${id}`)
      if (editing === id) resetForm()
      await load()
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Unable to delete service.'))
    }
  }

  return (
    <div className="admin-services">
      <div className="admin-topbar">
        <div>
          <p className="admin-eyebrow">Content management</p>
          <h1>Services</h1>
        </div>
        <button className="admin-primary" type="button" onClick={resetForm} disabled={saving}>
          <Plus size={17} /> New service
        </button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-service-layout">
        <form className="admin-form admin-service-form" onSubmit={save}>
          <div className="admin-panel-title">
            <div>
              <h2>{editing ? 'Edit service' : 'New service'}</h2>
              {editing && <p>Update the service details used across the website.</p>}
            </div>
            {editing && (
              <button className="admin-icon" type="button" onClick={resetForm} aria-label="Cancel editing">
                <X size={16} />
              </button>
            )}
          </div>

          <label>
            Title
            <input
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              required
            />
          </label>

          <label>
            Slug
            <input
              value={form.slug}
              onChange={(event) => setForm({ ...form, slug: event.target.value })}
              placeholder="auto-generated if empty"
            />
          </label>

          <label>
            Description
            <textarea
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              required
            />
          </label>

          <label>
            Icon
            <input
              value={form.icon}
              onChange={(event) => setForm({ ...form, icon: event.target.value })}
              placeholder="icon identifier"
            />
          </label>

          <label>
            Display order
            <input
              type="number"
              min="0"
              value={form.order}
              onChange={(event) => setForm({ ...form, order: event.target.value })}
            />
          </label>

          <div className="admin-checks">
            <label>
              <input
                type="checkbox"
                checked={form.active}
                onChange={(event) => setForm({ ...form, active: event.target.checked })}
              />{' '}
              Active
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) => setForm({ ...form, featured: event.target.checked })}
              />{' '}
              Featured
            </label>
          </div>

          <button className="admin-primary" type="submit" disabled={saving}>
            {saving ? 'Saving…' : editing ? 'Update service' : 'Create service'}
          </button>
        </form>

        <section className="admin-service-list" aria-label="Services list">
          {loading ? (
            <div className="admin-empty">Loading…</div>
          ) : services.length === 0 ? (
            <div className="admin-empty">
              <p>No services found.</p>
              <button className="admin-secondary" type="button" onClick={resetForm}>
                <Plus size={16} /> Add your first service
              </button>
            </div>
          ) : (
            services.map((service) => (
              <article className="admin-service-row" key={service._id}>
                <div>
                  <strong>{service.title}</strong>
                  <p>{service.description}</p>
                </div>
                <span>{service.active ? 'Active' : 'Hidden'}</span>
                <button
                  className="admin-icon"
                  type="button"
                  onClick={() => edit(service)}
                  aria-label={`Edit ${service.title}`}
                >
                  <Pencil size={16} />
                </button>
                <button
                  className="admin-danger"
                  type="button"
                  onClick={() => remove(service._id)}
                  aria-label={`Delete ${service.title}`}
                  disabled={saving}
                >
                  <Trash2 size={16} />
                </button>
              </article>
            ))
          )}
        </section>
      </div>
    </div>
  )
}
