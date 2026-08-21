import { useEffect, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
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

export default function ServicesManager() {
  const [services, setServices] = useState([])
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)
  const load = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/services')
      setServices(data.data)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    load()
  }, [])
  const save = async (e) => {
    e.preventDefault()
    if (editing) await api.patch(`/services/${editing}`, form)
    else await api.post('/services', form)
    setForm(empty)
    setEditing(null)
    await load()
  }
  const edit = (service) => {
    setEditing(service._id)
    setForm({
      title: service.title,
      slug: service.slug,
      description: service.description,
      icon: service.icon || '',
      featured: service.featured,
      active: service.active,
      order: service.order,
    })
  }
  const remove = async (id) => {
    if (!confirm('Delete this service?')) return
    await api.delete(`/services/${id}`)
    await load()
  }
  return (
    <div className="admin-services">
      <div className="admin-topbar">
        <div>
          <p className="admin-eyebrow">Content management</p>
          <h1>Services</h1>
        </div>
        <button
          className="admin-primary"
          onClick={() => {
            setEditing(null)
            setForm(empty)
          }}
        >
          <Plus size={17} /> New service
        </button>
      </div>
      <div className="admin-service-layout">
        <form className="admin-form admin-service-form" onSubmit={save}>
          <h2>{editing ? 'Edit service' : 'New service'}</h2>
          <label>
            Title
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </label>
          <label>
            Slug
            <input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="auto-generated if empty"
            />
          </label>
          <label>
            Description
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </label>
          <label>
            Icon
            <input
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              placeholder="icon identifier"
            />
          </label>
          <div className="admin-checks">
            <label>
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
              />{' '}
              Active
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />{' '}
              Featured
            </label>
          </div>
          <button className="admin-primary" type="submit">
            {editing ? 'Update service' : 'Create service'}
          </button>
        </form>
        <section className="admin-service-list">
          {loading ? (
            <div className="admin-empty">Loading…</div>
          ) : (
            services.map((service) => (
              <article className="admin-service-row" key={service._id}>
                <div>
                  <strong>{service.title}</strong>
                  <p>{service.description}</p>
                </div>
                <span>{service.active ? 'Active' : 'Hidden'}</span>
                <button className="admin-icon" onClick={() => edit(service)}>
                  <Pencil size={16} />
                </button>
                <button className="admin-danger" onClick={() => remove(service._id)}>
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
