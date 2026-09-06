import { useState } from 'react'
import { ArrowLeft, ImagePlus, Save, Trash2, Video } from 'lucide-react'
import MediaPicker from './MediaPicker.jsx'
import { createAdminProject, updateAdminProject } from './api.js'

const categories = [
  { value: 'social-media', label: 'Social Media Management' },
  { value: 'reels', label: 'Reels & Video Editing' },
  { value: 'graphic-design', label: 'Graphic Designing' },
  { value: 'social-media-advertising', label: 'Social Media Advertising' },
  { value: 'business-promotion', label: 'Business Promotion' },
  { value: 'posters', label: 'Posters' },
  { value: 'advertisements', label: 'Advertisements' },
  { value: 'branding', label: 'Branding' },
  { value: 'websites', label: 'Websites' },
  { value: 'other', label: 'Other' },
]

const emptyProject = {
  title: '',
  slug: '',
  description: '',
  client: '',
  category: 'social-media',
  year: new Date().getFullYear(),
  liveUrl: '',
  services: [],
  featured: false,
  published: false,
  order: 0,
  coverImage: null,
  gallery: [],
  videos: [],
  seo: { title: '', description: '' },
}

const normalize = (project) => ({
  ...emptyProject,
  ...project,
  liveUrl: project?.liveUrl || '',
  services: Array.isArray(project?.services) ? project.services : [],
  gallery: Array.isArray(project?.gallery) ? project.gallery : [],
  videos: Array.isArray(project?.videos) ? project.videos : [],
  seo: {
    title: project?.seo?.title || '',
    description: project?.seo?.description || '',
  },
  featured: project?.featured === true,
  published: project?.published === true,
  order: Number.isFinite(Number(project?.order)) ? Number(project.order) : 0,
})

const imagePayload = (item) => ({
  url: item.secureUrl || item.url,
  publicId: item.publicId || '',
  alt: item.alt || '',
})

const videoPayload = (item) => ({
  url: item.secureUrl || item.url,
  publicId: item.publicId || '',
  thumbnail: item.thumbnail || '',
})

const mediaKey = (item, index) => item.publicId || item.url || `${index}`

export default function ProjectEditor({ project, onBack, onSaved }) {
  const [form, setForm] = useState(normalize(project))
  const [picker, setPicker] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const update = (patch) => setForm((current) => ({ ...current, ...patch }))

  const slugify = (value) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

  const save = async (event) => {
    event.preventDefault()
    if (saving) return

    const title = form.title.trim()
    const slug = slugify(form.slug)
    const category = form.category.trim().toLowerCase()
    const liveUrl = form.liveUrl.trim()

    if (!title) return setError('Project title is required.')
    if (!slug) return setError('Project slug is required.')
    if (!category) return setError('Project category is required.')
    if (form.coverImage && !(form.coverImage.secureUrl || form.coverImage.url)) {
      return setError('The selected cover image is missing its URL. Please choose it again.')
    }
    if (category === 'websites' && liveUrl) {
      try {
        const url = new URL(liveUrl)
        if (!['http:', 'https:'].includes(url.protocol)) throw new Error()
      } catch {
        return setError('Live website URL must start with http:// or https://.')
      }
    }
    if (category !== 'websites' && liveUrl) {
      return setError('Live website URL is only available for Websites projects.')
    }

    setSaving(true)
    setError('')
    try {
      const numericYear = Number(form.year)
      const numericOrder = Number(form.order)
      const payload = {
        title,
        slug,
        description: form.description.trim(),
        client: form.client.trim(),
        category,
        ...(Number.isFinite(numericYear) && numericYear > 0 ? { year: numericYear } : {}),
        liveUrl: category === 'websites' ? liveUrl : '',
        services: Array.isArray(form.services)
          ? form.services.map((service) => service.trim()).filter(Boolean)
          : [],
        featured: form.featured === true,
        published: form.published === true,
        order: Number.isFinite(numericOrder) && numericOrder >= 0 ? numericOrder : 0,
        coverImage: form.coverImage ? imagePayload(form.coverImage) : null,
        gallery: Array.isArray(form.gallery)
          ? form.gallery.filter((item) => item?.secureUrl || item?.url).map(imagePayload)
          : [],
        videos: Array.isArray(form.videos)
          ? form.videos.filter((item) => item?.secureUrl || item?.url).map(videoPayload)
          : [],
        seo: {
          title: form.seo.title.trim(),
          description: form.seo.description.trim(),
        },
      }

      const saved = form._id
        ? await updateAdminProject(form._id, payload)
        : await createAdminProject(payload)
      onSaved(saved)
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to save project')
    } finally {
      setSaving(false)
    }
  }

  const removeGallery = (item) =>
    update({
      gallery: form.gallery.filter(
        (current) =>
          current !== item && current.publicId !== item.publicId && current.url !== item.url,
      ),
    })

  const removeVideo = (item) =>
    update({
      videos: form.videos.filter(
        (current) =>
          current !== item && current.publicId !== item.publicId && current.url !== item.url,
      ),
    })

  return (
    <section className="admin-editor-page">
      <header className="admin-topbar">
        <div>
          <button type="button" className="admin-back-button" onClick={onBack} disabled={saving}>
            <ArrowLeft size={16} /> Projects
          </button>
          <p className="admin-eyebrow">Portfolio editor</p>
          <h1>{form._id ? 'Edit project' : 'New project'}</h1>
        </div>
        <button
          type="submit"
          form="project-editor-form"
          className="admin-primary"
          disabled={saving}
          aria-busy={saving}
        >
          <Save size={16} />
          {saving ? 'Saving…' : 'Save project'}
        </button>
      </header>
      {error && (
        <div className="admin-alert" role="alert">
          {error}
        </div>
      )}
      <form id="project-editor-form" className="admin-editor-grid" onSubmit={save}>
        <div className="admin-editor-main">
          <section className="admin-panel">
            <h2>Project details</h2>
            <div className="admin-form-grid">
              <label>
                Title
                <input
                  value={form.title}
                  onChange={(e) =>
                    update({
                      title: e.target.value,
                      slug: form._id ? form.slug : slugify(e.target.value),
                    })
                  }
                  maxLength="160"
                  required
                />
              </label>
              <label>
                Slug
                <input
                  value={form.slug}
                  onChange={(e) => update({ slug: slugify(e.target.value) })}
                  maxLength="160"
                  required
                />
              </label>
              <label>
                Client
                <input
                  value={form.client}
                  onChange={(e) => update({ client: e.target.value })}
                  maxLength="160"
                />
              </label>
              <label>
                Year
                <input
                  type="number"
                  min="2000"
                  max="2100"
                  value={form.year || ''}
                  onChange={(e) => update({ year: e.target.value })}
                />
              </label>
              <label>
                Category
                <select
                  value={form.category}
                  onChange={(e) => update({ category: e.target.value })}
                  required
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Services
                <input
                  value={form.services.join(', ')}
                  placeholder="Social Media, Design"
                  onChange={(e) =>
                    update({
                      services: e.target.value
                        .split(',')
                        .map((v) => v.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </label>
              {form.category === 'websites' ? (
                <label className="full">
                  Live website URL
                  <input
                    type="url"
                    value={form.liveUrl}
                    placeholder="https://example.com"
                    maxLength="500"
                    onChange={(e) => update({ liveUrl: e.target.value })}
                  />
                  <small>
                    Shown only for Websites projects so visitors can open the live site.
                  </small>
                </label>
              ) : null}
              <label className="full">
                Description
                <textarea
                  rows="7"
                  maxLength="5000"
                  value={form.description}
                  onChange={(e) => update({ description: e.target.value })}
                />
              </label>
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-title">
              <div>
                <h2>Cover image</h2>
                <p>Primary visual shown on project cards and detail pages.</p>
              </div>
              <button
                type="button"
                className="admin-secondary"
                onClick={() => setPicker({ type: 'cover' })}
                disabled={saving}
              >
                <ImagePlus size={15} /> Choose image
              </button>
            </div>
            {form.coverImage ? (
              <div className="admin-cover-preview">
                <img
                  src={form.coverImage.secureUrl || form.coverImage.url}
                  alt={form.coverImage.alt || form.title}
                />
                <button
                  type="button"
                  className="admin-danger"
                  onClick={() => update({ coverImage: null })}
                  disabled={saving}
                  aria-label="Remove cover image"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ) : (
              <div className="admin-media-placeholder">No cover image selected.</div>
            )}
          </section>

          <section className="admin-panel">
            <div className="admin-panel-title">
              <div>
                <h2>Gallery</h2>
                <p>Multiple images for the project detail page.</p>
              </div>
              <button
                type="button"
                className="admin-secondary"
                onClick={() => setPicker({ type: 'gallery' })}
                disabled={saving}
              >
                <ImagePlus size={15} /> Add images
              </button>
            </div>
            <div className="admin-selected-grid">
              {form.gallery.length ? (
                form.gallery.map((item, index) => (
                  <div className="admin-selected-media" key={mediaKey(item, index)}>
                    <img src={item.secureUrl || item.url} alt={item.alt || ''} />
                    <button
                      type="button"
                      className="admin-danger"
                      onClick={() => removeGallery(item)}
                      disabled={saving}
                      aria-label="Remove gallery image"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="admin-media-placeholder">No gallery images selected.</div>
              )}
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-title">
              <div>
                <h2>Videos</h2>
                <p>Reels and video work from your Cloudinary library.</p>
              </div>
              <button
                type="button"
                className="admin-secondary"
                onClick={() => setPicker({ type: 'videos' })}
                disabled={saving}
              >
                <Video size={15} /> Add videos
              </button>
            </div>
            <div className="admin-selected-grid">
              {form.videos.length ? (
                form.videos.map((item, index) => (
                  <div className="admin-selected-media" key={mediaKey(item, index)}>
                    <video src={item.secureUrl || item.url} muted controls preload="metadata" />
                    <button
                      type="button"
                      className="admin-danger"
                      onClick={() => removeVideo(item)}
                      disabled={saving}
                      aria-label="Remove video"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="admin-media-placeholder">No videos selected.</div>
              )}
            </div>
          </section>
        </div>

        <aside className="admin-editor-side">
          <section className="admin-panel">
            <h2>Publishing</h2>
            <label className="admin-switch">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => update({ published: e.target.checked })}
                disabled={saving}
              />
              <span>Published</span>
            </label>
            <label className="admin-switch">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => update({ featured: e.target.checked })}
                disabled={saving}
              />
              <span>Featured project</span>
            </label>
            <label>
              Display order
              <input
                type="number"
                min="0"
                value={form.order}
                onChange={(e) => update({ order: Number(e.target.value) })}
                disabled={saving}
              />
            </label>
          </section>

          <section className="admin-panel">
            <h2>SEO</h2>
            <label>
              SEO title
              <input
                maxLength="160"
                value={form.seo.title}
                onChange={(e) => update({ seo: { ...form.seo, title: e.target.value } })}
                disabled={saving}
              />
            </label>
            <label>
              SEO description
              <textarea
                maxLength="320"
                rows="6"
                value={form.seo.description}
                onChange={(e) => update({ seo: { ...form.seo, description: e.target.value } })}
                disabled={saving}
              />
            </label>
          </section>
        </aside>
      </form>

      {picker?.type === 'cover' && (
        <MediaPicker
          mode="image"
          selected={form.coverImage ? [form.coverImage] : []}
          onChange={(items) => update({ coverImage: items[0] || null })}
          onClose={() => setPicker(null)}
        />
      )}
      {picker?.type === 'gallery' && (
        <MediaPicker
          mode="image"
          multiple
          selected={form.gallery}
          onChange={(items) => update({ gallery: items })}
          onClose={() => setPicker(null)}
        />
      )}
      {picker?.type === 'videos' && (
        <MediaPicker
          mode="video"
          multiple
          selected={form.videos}
          onChange={(items) => update({ videos: items })}
          onClose={() => setPicker(null)}
        />
      )}
    </section>
  )
}
