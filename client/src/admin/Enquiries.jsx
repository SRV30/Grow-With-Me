import { useEffect, useMemo, useState } from 'react'
import { Check, Mail, MessageCircle, Phone, RefreshCw, Trash2, X } from 'lucide-react'
import { api } from '../services/api.js'
import './enquiries.css'

const statuses = ['new', 'contacted', 'qualified', 'closed']

const errorMessage = (error, fallback) => error?.response?.data?.message || fallback

export default function Enquiries() {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('all')
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [action, setAction] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/enquiries', {
        params: status === 'all' ? {} : { status },
      })
      setItems(Array.isArray(data?.data) ? data.data : [])
    } catch (e) {
      setError(errorMessage(e, 'Unable to load enquiries.'))
      setItems([])
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
        (acc, key) => ({
          ...acc,
          [key]: items.filter((item) => item.status === key).length,
        }),
        {},
      ),
    [items],
  )

  const update = async (id, payload) => {
    const key = `${id}:${Object.keys(payload)[0]}`
    setAction(key)
    setError('')
    try {
      const { data } = await api.patch(`/enquiries/${id}`, payload)
      const updated = data?.data
      if (updated) {
        setItems((current) =>
          current.map((item) => (item._id === id ? { ...item, ...updated } : item)),
        )
        if (selected?._id === id) setSelected((current) => ({ ...current, ...updated }))
      }
      if (payload.status && status !== 'all' && payload.status !== status) {
        setSelected(null)
        await load()
      }
    } catch (e) {
      setError(errorMessage(e, 'Unable to update enquiry.'))
    } finally {
      setAction('')
    }
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this enquiry?')) return
    setAction(`${id}:delete`)
    setError('')
    try {
      await api.delete(`/enquiries/${id}`)
      setSelected(null)
      await load()
    } catch (e) {
      setError(errorMessage(e, 'Unable to delete enquiry.'))
    } finally {
      setAction('')
    }
  }

  return (
    <section className="admin-page">
      <header className="admin-page-header">
        <div>
          <p className="admin-kicker">Lead management</p>
          <h1>Enquiries</h1>
          <p>Track every potential client from first message to closed project.</p>
        </div>
        <button
          type="button"
          className="admin-icon"
          onClick={load}
          disabled={loading}
          title="Refresh"
          aria-label="Refresh enquiries"
        >
          <RefreshCw size={17} />
        </button>
      </header>

      {error && (
        <div className="admin-alert" role="alert">
          {error}
        </div>
      )}

      <div className="admin-stat-grid" aria-label="Enquiry statistics">
        {statuses.map((key) => (
          <button
            key={key}
            type="button"
            className={`admin-stat-card ${status === key ? 'is-active' : ''}`}
            onClick={() => setStatus(status === key ? 'all' : key)}
            aria-pressed={status === key}
          >
            <strong>{counts[key]}</strong>
            <span>{key}</span>
          </button>
        ))}
      </div>

      <div className="admin-filter-row" role="group" aria-label="Filter enquiries">
        <button
          type="button"
          className={status === 'all' ? 'admin-filter active' : 'admin-filter'}
          onClick={() => setStatus('all')}
          aria-pressed={status === 'all'}
        >
          All
        </button>
        {statuses.map((key) => (
          <button
            type="button"
            key={key}
            className={status === key ? 'admin-filter active' : 'admin-filter'}
            onClick={() => setStatus(key)}
            aria-pressed={status === key}
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
                <tr
                  key={item._id}
                  onClick={() => setSelected(item)}
                  tabIndex="0"
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      setSelected(item)
                    }
                  }}
                >
                  <td>
                    <strong>{item.name || '—'}</strong>
                    <small>{item.email || '—'}</small>
                  </td>
                  <td>{item.company || '—'}</td>
                  <td>{item.service || '—'}</td>
                  <td>
                    <span className={`status-pill ${item.status}`}>{item.status || 'new'}</span>
                  </td>
                  <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div
          className="admin-drawer-backdrop"
          role="presentation"
          onClick={() => setSelected(null)}
        >
          <aside
            className="admin-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="enquiry-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-drawer-head">
              <div>
                <p className="admin-kicker">Enquiry</p>
                <h2 id="enquiry-title">{selected.name || 'Enquiry'}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close enquiry details"
              >
                <X size={20} />
              </button>
            </div>
            <div className="admin-drawer-actions">
              <a href={`mailto:${selected.email}`}>
                <Mail size={16} />
                Email
              </a>
              {selected.phone && (
                <a href={`tel:${selected.phone}`}>
                  <Phone size={16} />
                  Call
                </a>
              )}
              {selected.phone && (
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={`https://wa.me/${selected.phone.replace(/\D/g, '')}`}
                >
                  <MessageCircle size={16} />
                  WhatsApp
                </a>
              )}
            </div>
            <dl className="admin-detail-list">
              <div>
                <dt>Email</dt>
                <dd>{selected.email || '—'}</dd>
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
                <dd>{selected.message || '—'}</dd>
              </div>
            </dl>
            <label className="admin-field">
              <span>Status</span>
              <select
                value={selected.status || 'new'}
                disabled={action.startsWith(`${selected._id}:`)}
                onChange={(event) => update(selected._id, { status: event.target.value })}
              >
                {statuses.map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </label>
            <label className="admin-field">
              <span>Internal notes</span>
              <textarea
                defaultValue={selected.notes || ''}
                onBlur={(event) => {
                  if (event.target.value !== (selected.notes || ''))
                    update(selected._id, { notes: event.target.value })
                }}
                placeholder="Add private notes…"
                disabled={action.startsWith(`${selected._id}:`)}
              />
            </label>
            <div className="admin-danger-row">
              <button
                type="button"
                onClick={() => update(selected._id, { status: 'contacted' })}
                disabled={action.startsWith(`${selected._id}:`)}
              >
                <Check size={16} />
                {action === `${selected._id}:status` ? 'Updating…' : 'Mark contacted'}
              </button>
              <button
                type="button"
                onClick={() => remove(selected._id)}
                disabled={action === `${selected._id}:delete`}
              >
                <Trash2 size={16} />
                {action === `${selected._id}:delete` ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </aside>
        </div>
      )}
    </section>
  )
}
