import { useEffect, useMemo, useState } from 'react'
import { Check, ImagePlus, X } from 'lucide-react'
import { getMedia } from './api.js'

export default function MediaPicker({
  mode = 'image',
  multiple = false,
  selected = [],
  onChange,
  onClose,
}) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    getMedia({ limit: 200 })
      .then((result) => setItems(result.items || []))
      .catch((e) => setError(e.response?.data?.message || 'Unable to load media'))
      .finally(() => setLoading(false))
  }, [])

  const allowed = mode === 'video' ? ['video'] : ['image']
  const filtered = useMemo(
    () =>
      items.filter(
        (item) =>
          allowed.includes(item.resourceType) &&
          `${item.filename || ''} ${item.publicId || ''}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [items, search, mode],
  )
  const selectedIds = new Set(selected.map((item) => item.publicId))

  const choose = (item) => {
    if (multiple) {
      onChange(
        selectedIds.has(item.publicId)
          ? selected.filter((value) => value.publicId !== item.publicId)
          : [...selected, item],
      )
    } else {
      onChange([item])
      onClose()
    }
  }

  return (
    <div
      className="admin-picker-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <section className="admin-picker" role="dialog" aria-modal="true" aria-label="Select media">
        <header className="admin-picker-head">
          <div>
            <p className="admin-eyebrow">Cloudinary Media</p>
            <h2>
              Select {mode === 'video' ? 'video' : 'image'}
              {multiple ? 's' : ''}
            </h2>
          </div>
          <button className="admin-close" onClick={onClose}>
            <X />
          </button>
        </header>
        <input
          className="admin-picker-search"
          placeholder="Search media…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {error && <p className="admin-error">{error}</p>}
        <div className="admin-picker-grid">
          {loading ? (
            <div className="admin-empty">Loading media…</div>
          ) : filtered.length === 0 ? (
            <div className="admin-empty">No matching media found.</div>
          ) : (
            filtered.map((item) => {
              const active = selectedIds.has(item.publicId)
              return (
                <button
                  type="button"
                  className={`admin-picker-item ${active ? 'selected' : ''}`}
                  key={item._id}
                  onClick={() => choose(item)}
                >
                  {item.resourceType === 'video' ? (
                    <video src={item.secureUrl} muted preload="metadata" />
                  ) : (
                    <img
                      src={item.secureUrl}
                      alt={item.alt || item.filename || ''}
                      loading="lazy"
                    />
                  )}
                  <span>
                    {active ? <Check size={16} /> : <ImagePlus size={16} />}
                    {item.filename || item.publicId.split('/').pop()}
                  </span>
                </button>
              )
            })
          )}
        </div>
        {multiple && (
          <footer className="admin-picker-foot">
            <span>{selected.length} selected</span>
            <button className="admin-primary" onClick={onClose}>
              Use selected
            </button>
          </footer>
        )}
      </section>
    </div>
  )
}
