import { useEffect, useRef, useState } from 'react'
import { ImagePlus, RefreshCw, Trash2, UploadCloud, Video } from 'lucide-react'
import { deleteMedia, getMedia, uploadMedia } from './api.js'

const folders = [
  'portfolio/images',
  'portfolio/videos',
  'portfolio/thumbnails',
  'homepage/hero',
  'homepage/about',
  'homepage/cta',
  'services',
  'testimonials',
  'branding',
]

const MAX_FILE_SIZE = 50 * 1024 * 1024
const allowedTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
  'video/mp4',
  'video/webm',
  'video/quicktime',
])

const unwrapMedia = (value) => {
  if (Array.isArray(value)) return value
  if (Array.isArray(value?.items)) return value.items
  if (Array.isArray(value?.media)) return value.media
  if (Array.isArray(value?.data)) return value.data
  return []
}

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback

export default function MediaLibrary() {
  const inputRef = useRef(null)
  const [items, setItems] = useState([])
  const [folder, setFolder] = useState('portfolio/images')
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await getMedia()
      setItems(unwrapMedia(result))
    } catch (e) {
      setError(getErrorMessage(e, 'Unable to load media'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const chooseFiles = (event) => {
    const selected = Array.from(event.target.files || [])
    const invalid = selected.filter(
      (file) => !allowedTypes.has(file.type) || file.size > MAX_FILE_SIZE,
    )
    if (invalid.length) {
      setError(
        `${invalid.length} file${invalid.length === 1 ? '' : 's'} rejected. Use supported image/video formats up to 50 MB each.`,
      )
    } else {
      setError('')
    }
    setFiles(selected.filter((file) => allowedTypes.has(file.type) && file.size <= MAX_FILE_SIZE))
  }

  const submit = async (event) => {
    event.preventDefault()
    if (!files.length || uploading) return
    setUploading(true)
    setError('')
    setMessage('')
    try {
      await uploadMedia(files, { folder })
      setFiles([])
      if (inputRef.current) inputRef.current.value = ''
      setMessage('Media uploaded successfully.')
      await load()
    } catch (e) {
      setError(getErrorMessage(e, 'Upload failed'))
    } finally {
      setUploading(false)
    }
  }

  const remove = async (id) => {
    if (!id || deleting) return
    if (!window.confirm('Delete this media from Cloudinary and the media library?')) return
    setDeleting(id)
    setError('')
    setMessage('')
    try {
      await deleteMedia(id)
      setItems((current) => current.filter((item) => item._id !== id))
      setMessage('Media deleted successfully.')
    } catch (e) {
      setError(getErrorMessage(e, 'Unable to delete media'))
    } finally {
      setDeleting(null)
    }
  }

  return (
    <section className="admin-media-page">
      <div className="admin-media-toolbar">
        <div>
          <p className="admin-eyebrow">Cloudinary media</p>
          <h2>Media Library</h2>
          <p className="admin-muted">
            Upload images and videos into your Growwithme Cloudinary folders.
          </p>
        </div>
        <button
          type="button"
          className="admin-icon"
          onClick={load}
          title="Refresh"
          aria-label="Refresh media"
          disabled={loading || uploading}
        >
          <RefreshCw size={17} />
        </button>
      </div>
      <form className="admin-upload-box" onSubmit={submit}>
        <div className="admin-upload-main">
          <UploadCloud size={28} />
          <div>
            <strong>Upload media</strong>
            <span>JPG, PNG, WebP, AVIF, GIF, MP4, WebM or MOV · up to 50 MB each</span>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif,video/mp4,video/webm,video/quicktime"
            multiple
            disabled={uploading}
            onChange={chooseFiles}
          />
        </div>
        <div className="admin-upload-controls">
          <select value={folder} onChange={(e) => setFolder(e.target.value)} disabled={uploading}>
            {folders.map((value) => (
              <option key={value} value={value}>
                Growwithme/{value}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="admin-primary"
            disabled={!files.length || uploading}
            aria-busy={uploading}
          >
            {uploading ? 'Uploading…' : `Upload ${files.length || ''}`}
          </button>
        </div>
        {files.length > 0 && (
          <div className="admin-file-list">
            {files.map((file) => (
              <span key={`${file.name}-${file.size}-${file.lastModified}`}>{file.name}</span>
            ))}
          </div>
        )}
        {message && (
          <p className="admin-success" role="status">
            {message}
          </p>
        )}
        {error && (
          <p className="admin-error" role="alert">
            {error}
          </p>
        )}
      </form>
      <div className="admin-media-grid">
        {loading ? (
          <div className="admin-empty" role="status">
            Loading media…
          </div>
        ) : items.length === 0 ? (
          <div className="admin-empty">No media uploaded yet.</div>
        ) : (
          items.map((item) => {
            const url = item.secureUrl || item.url
            return (
              <article className="admin-media-card" key={item._id || item.publicId || url}>
                <div className="admin-media-preview">
                  {item.resourceType === 'video' ? (
                    <>
                      <video src={url} muted preload="metadata" controls />
                      <span className="admin-media-type">
                        <Video size={13} /> Video
                      </span>
                    </>
                  ) : (
                    <>
                      <img
                        src={url}
                        alt={item.alt || item.filename || 'Grow With Me media'}
                        loading="lazy"
                      />
                      <span className="admin-media-type">
                        <ImagePlus size={13} /> Image
                      </span>
                    </>
                  )}
                </div>
                <div className="admin-media-meta">
                  <strong title={item.filename || item.publicId || ''}>
                    {item.filename || item.publicId?.split('/').pop() || 'Untitled media'}
                  </strong>
                  <small>
                    {item.folder || 'Growwithme'} · {Math.round((item.bytes || 0) / 1024)} KB
                  </small>
                  <button
                    type="button"
                    className="admin-danger"
                    onClick={() => remove(item._id)}
                    title="Delete"
                    aria-label={`Delete ${item.filename || 'media'}`}
                    disabled={deleting !== null}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </article>
            )
          })
        )}
      </div>
    </section>
  )
}
