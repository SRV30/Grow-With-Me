import { useEffect, useMemo, useState } from 'react'
import { Check, ImagePlus, X } from 'lucide-react'
import { getMedia } from './api.js'

const unwrapMedia = (value) => {
  if (Array.isArray(value)) return value
  if (Array.isArray(value?.items)) return value.items
  if (Array.isArray(value?.media)) return value.media
  if (Array.isArray(value?.data)) return value.data
  return []
}

const mediaId = (item) => item?.publicId || item?._id || item?.secureUrl || item?.url

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
    let active = true
    setLoading(true)
    setError('')
    getMedia({ limit: 200 })
      .then((result) => {
        if (active) setItems(unwrapMedia(result))
      })
      .catch((e) => {
        if (active) setError(e.response?.data?.message || 'Unable to load media')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const filtered = useMemo(() => {
    const resourceType = mode === 'video' ? 'video' : 'image'
    const term = search.trim().toLowerCase()
    return items.filter((item) => {
      if (item.resourceType !== resourceType) return false
      if (!term) return true
      return `${item.filename || ''} ${item.publicId || ''}`.toLowerCase().includes(term)
    })
  }, [items, search, mode])

  const selectedIds = new Set((Array.isArray(selected) ? selected : []).map(mediaId))

  const choose = (item) => {
    const id = mediaId(item)
    if (!id) return
    if (multiple) {
      onChange(
        selectedIds.has(id)
          ? selected.filter((value) => mediaId(value) !== id)
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
          <button
            type="button"
            className="admin-close"
            onClick={onClose}
            aria-label="Close media picker"
          >
            <X />
          </button>
        </header>
        <input
          className="admin-picker-search"
          placeholder="Search media…"
          aria-label="Search media"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {error && (
          <p className="admin-error" role="alert">
            {error}
          </p>
        )}
        <div className="admin-picker-grid">
          {loading ? (
            <div className="admin-empty" role="status">
              Loading media…
            </div>
          ) : filtered.length === 0 ? (
            <div className="admin-empty">No matching media found.</div>
          ) : (
            filtered.map((item) => {
              const id = mediaId(item)
              const active = selectedIds.has(id)
              const url = item.secureUrl || item.url
              return (
                <button
                  type="button"
                  className={`admin-picker-item ${active ? 'selected' : ''}`}
                  key={id}
                  onClick={() => choose(item)}
                  aria-pressed={multiple ? active : undefined}
                >
                  {item.resourceType === 'video' ? (
                    <video src={url} muted preload="metadata" />
                  ) : (
                    <img src={url} alt={item.alt || item.filename || ''} loading="lazy" />
                  )}
                  <span>
                    {active ? <Check size={16} /> : <ImagePlus size={16} />}
                    {item.filename || item.publicId?.split('/').pop() || 'Untitled media'}
                  </span>
                </button>
              )
            })
          )}
        </div>
        {multiple && (
          <footer className="admin-picker-foot">
            <span>{selected.length} selected</span>
            <button type="button" className="admin-primary" onClick={onClose}>
              Use selected
            </button>
          </footer>
        )}
      </section>
    </div>
  )
}
