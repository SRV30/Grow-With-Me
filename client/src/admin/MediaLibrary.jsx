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

export default function MediaLibrary() {
  const inputRef = useRef(null)
  const [items, setItems] = useState([])
  const [folder, setFolder] = useState('portfolio/images')
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await getMedia()
      setItems(result.items)
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to load media')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    load()
  }, [])

  const submit = async (event) => {
    event.preventDefault()
    if (!files.length) return
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
      setError(e.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this media from Cloudinary and the media library?')) return
    try {
      await deleteMedia(id)
      await load()
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to delete media')
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
        <button className="admin-icon" onClick={load} title="Refresh">
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
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
          />
        </div>
        <div className="admin-upload-controls">
          <select value={folder} onChange={(e) => setFolder(e.target.value)}>
            {folders.map((value) => (
              <option key={value} value={value}>
                Growwithme/{value}
              </option>
            ))}
          </select>
          <button className="admin-primary" disabled={!files.length || uploading}>
            {uploading ? 'Uploading…' : `Upload ${files.length || ''}`}
          </button>
        </div>
        {files.length > 0 && (
          <div className="admin-file-list">
            {files.map((file) => (
              <span key={`${file.name}-${file.size}`}>{file.name}</span>
            ))}
          </div>
        )}
        {message && <p className="admin-success">{message}</p>}
        {error && <p className="admin-error">{error}</p>}
      </form>
      <div className="admin-media-grid">
        {loading ? (
          <div className="admin-empty">Loading media…</div>
        ) : items.length === 0 ? (
          <div className="admin-empty">No media uploaded yet.</div>
        ) : (
          items.map((item) => (
            <article className="admin-media-card" key={item._id}>
              <div className="admin-media-preview">
                {item.resourceType === 'video' ? (
                  <>
                    <video src={item.secureUrl} muted preload="metadata" controls />
                    <span className="admin-media-type">
                      <Video size={13} /> Video
                    </span>
                  </>
                ) : (
                  <>
                    <img
                      src={item.secureUrl}
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
                <strong title={item.filename}>
                  {item.filename || item.publicId.split('/').pop()}
                </strong>
                <small>
                  {item.folder || 'Growwithme'} · {Math.round((item.bytes || 0) / 1024)} KB
                </small>
                <button className="admin-danger" onClick={() => remove(item._id)} title="Delete">
                  <Trash2 size={15} />
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  )
}
