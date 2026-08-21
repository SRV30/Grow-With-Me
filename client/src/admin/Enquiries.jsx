import { useEffect, useMemo, useState } from 'react'
import { Check, Mail, MessageCircle, Phone, Trash2, X } from 'lucide-react'
import { api } from '../services/api.js'

const statuses = ['new', 'contacted', 'qualified', 'closed']

export default function Enquiries() {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('all')
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/enquiries', { params: status === 'all' ? {} : { status } })
      setItems(data.data || [])
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    load()
  }, [status])

  const counts = useMemo(
    () =>
      statuses.reduce(
        (acc, key) => ({ ...acc, [key]: items.filter((item) => item.status === key).length }),
        {},
      ),
    [items],
  )

  const update = async (id, payload) => {
    await api.patch(`/enquiries/${id}`, payload)
    await load()
    if (selected?._id === id) setSelected((current) => ({ ...current, ...payload }))
  }
  const remove = async (id) => {
    if (!window.confirm('Delete this enquiry?')) return
    await api.delete(`/enquiries/${id}`)
    setSelected(null)
    await load()
  }

  return (
    <section className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-kicker">Lead management</p>
          <h1>Enquiries</h1>
          <p>Track every potential client from first message to closed project.</p>
        </div>
      </div>
      <div className="admin-stat-grid">
        {statuses.map((key) => (
          <button
            key={key}
            className={`admin-stat-card ${status === key ? 'is-active' : ''}`}
            onClick={() => setStatus(status === key ? 'all' : key)}
          >
            <strong>{counts[key]}</strong>
            <span>{key}</span>
          </button>
        ))}
      </div>
      <div className="admin-filter-row">
        <button
          className={status === 'all' ? 'admin-filter active' : 'admin-filter'}
          onClick={() => setStatus('all')}
        >
          All
        </button>
        {statuses.map((key) => (
          <button
            key={key}
            className={status === key ? 'admin-filter active' : 'admin-filter'}
            onClick={() => setStatus(key)}
          >
            {key}
          </button>
        ))}
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Company</th>
              <th>Service</th>
              <th>Status</th>
              <th>Received</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5">Loading enquiries…</td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan="5">No enquiries found.</td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item._id} onClick={() => setSelected(item)} className="cursor-pointer">
                  <td>
                    <strong>{item.name}</strong>
                    <small>{item.email}</small>
                  </td>
                  <td>{item.company || '—'}</td>
                  <td>{item.service || '—'}</td>
                  <td>
                    <span className={`status-pill ${item.status}`}>{item.status}</span>
                  </td>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {selected && (
        <div className="admin-drawer-backdrop" onClick={() => setSelected(null)}>
          <aside className="admin-drawer" onClick={(event) => event.stopPropagation()}>
            <div className="admin-drawer-head">
              <div>
                <p className="admin-kicker">Enquiry</p>
                <h2>{selected.name}</h2>
              </div>
              <button onClick={() => setSelected(null)}>
                <X />
              </button>
            </div>
            <div className="admin-drawer-actions">
              <a href={`mailto:${selected.email}`}>
                <Mail size={16} /> Email
              </a>
              {selected.phone && (
                <a href={`tel:${selected.phone}`}>
                  <Phone size={16} /> Call
                </a>
              )}
              {selected.phone && (
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={`https://wa.me/${selected.phone.replace(/\D/g, '')}`}
                >
                  <MessageCircle size={16} /> WhatsApp
                </a>
              )}
            </div>
            <dl className="admin-detail-list">
              <div>
                <dt>Email</dt>
                <dd>{selected.email}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{selected.phone || '—'}</dd>
              </div>
              <div>
                <dt>Company</dt>
                <dd>{selected.company || '—'}</dd>
              </div>
              <div>
                <dt>Service</dt>
                <dd>{selected.service || '—'}</dd>
              </div>
              <div>
                <dt>Budget</dt>
                <dd>{selected.budget || '—'}</dd>
              </div>
              <div>
                <dt>Message</dt>
                <dd>{selected.message}</dd>
              </div>
            </dl>
            <label className="admin-field">
              <span>Status</span>
              <select
                value={selected.status}
                onChange={(e) => update(selected._id, { status: e.target.value })}
              >
                {statuses.map((key) => (
                  <option key={key}>{key}</option>
                ))}
              </select>
            </label>
            <label className="admin-field">
              <span>Internal notes</span>
              <textarea
                defaultValue={selected.notes}
                onBlur={(e) => update(selected._id, { notes: e.target.value })}
                placeholder="Add private notes…"
              />
            </label>
            <div className="admin-danger-row">
              <button onClick={() => update(selected._id, { status: 'contacted' })}>
                <Check size={16} /> Mark contacted
              </button>
              <button onClick={() => remove(selected._id)}>
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </aside>
        </div>
      )}
    </section>
  )
}
