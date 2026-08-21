import { useState } from 'react'
import { ArrowLeft, ImagePlus, Save, Trash2, Video } from 'lucide-react'
import MediaPicker from './MediaPicker.jsx'
import { createAdminProject, updateAdminProject } from './api.js'

const categories = ['social-media', 'posters', 'reels', 'advertisements', 'branding', 'websites', 'other']
const emptyProject = { title: '', slug: '', description: '', client: '', category: 'social-media', year: new Date().getFullYear(), services: [], featured: false, published: false, order: 0, coverImage: null, gallery: [], videos: [], seo: { title: '', description: '' } }

const normalize = (project) => ({ ...emptyProject, ...project, services: project?.services || [], gallery: project?.gallery || [], videos: project?.videos || [], seo: project?.seo || { title: '', description: '' } })
const imagePayload = (item) => ({ url: item.secureUrl || item.url, publicId: item.publicId || '', alt: item.alt || '' })
const videoPayload = (item) => ({ url: item.secureUrl || item.url, publicId: item.publicId || '', thumbnail: item.thumbnail || '' })

export default function ProjectEditor({ project, onBack, onSaved }) {
  const [form, setForm] = useState(normalize(project))
  const [picker, setPicker] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const update = (patch) => setForm((current) => ({ ...current, ...patch }))
  const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const save = async (event) => {
    event.preventDefault(); setSaving(true); setError('')
    try {
      const payload = { ...form, services: Array.isArray(form.services) ? form.services : [], coverImage: form.coverImage ? imagePayload(form.coverImage) : null, gallery: form.gallery.map(imagePayload), videos: form.videos.map(videoPayload), seo: form.seo }
      const saved = form._id ? await updateAdminProject(form._id, payload) : await createAdminProject(payload)
      onSaved(saved)
    } catch (e) { setError(e.response?.data?.message || 'Unable to save project') } finally { setSaving(false) }
  }

  const removeGallery = (publicId) => update({ gallery: form.gallery.filter((item) => item.publicId !== publicId) })
  const removeVideo = (publicId) => update({ videos: form.videos.filter((item) => item.publicId !== publicId) })

  return <section className="admin-editor-page">
    <header className="admin-topbar"><div><button className="admin-back-button" onClick={onBack}><ArrowLeft size={16} /> Projects</button><p className="admin-eyebrow">Portfolio editor</p><h1>{form._id ? 'Edit project' : 'New project'}</h1></div><button className="admin-primary" onClick={save} disabled={saving}><Save size={16} />{saving ? 'Saving…' : 'Save project'}</button></header>
    {error && <div className="admin-alert">{error}</div>}
    <form className="admin-editor-grid" onSubmit={save}>
      <div className="admin-editor-main">
        <section className="admin-panel"><h2>Project details</h2><div className="admin-form-grid"><label>Title<input value={form.title} onChange={(e) => update({ title: e.target.value, slug: form._id ? form.slug : slugify(e.target.value) })} required /></label><label>Slug<input value={form.slug} onChange={(e) => update({ slug: slugify(e.target.value) })} required /></label><label>Client<input value={form.client} onChange={(e) => update({ client: e.target.value })} /></label><label>Year<input type="number" value={form.year || ''} onChange={(e) => update({ year: e.target.value })} /></label><label>Category<select value={form.category} onChange={(e) => update({ category: e.target.value })}>{categories.map((category) => <option key={category} value={category}>{category.replace('-', ' ')}</option>)}</select></label><label>Services<input value={form.services.join(', ')} placeholder="Social Media, Design" onChange={(e) => update({ services: e.target.value.split(',').map((v) => v.trim()).filter(Boolean) })} /></label><label className="full">Description<textarea rows="7" value={form.description} onChange={(e) => update({ description: e.target.value })} /></label></div></section>
        <section className="admin-panel"><div className="admin-panel-title"><div><h2>Cover image</h2><p>Primary visual shown on project cards and detail pages.</p></div><button type="button" className="admin-secondary" onClick={() => setPicker({ type: 'cover' })}><ImagePlus size={15} /> Choose image</button></div>{form.coverImage ? <div className="admin-cover-preview"><img src={form.coverImage.secureUrl || form.coverImage.url} alt={form.coverImage.alt || form.title} /><button type="button" className="admin-danger" onClick={() => update({ coverImage: null })}><Trash2 size={16} /></button></div> : <div className="admin-media-placeholder">No cover image selected.</div>}</section>
        <section className="admin-panel"><div className="admin-panel-title"><div><h2>Gallery</h2><p>Multiple images for the project detail page.</p></div><button type="button" className="admin-secondary" onClick={() => setPicker({ type: 'gallery' })}><ImagePlus size={15} /> Add images</button></div><div className="admin-selected-grid">{form.gallery.length ? form.gallery.map((item) => <div className="admin-selected-media" key={item.publicId}><img src={item.secureUrl || item.url} alt={item.alt || ''} /><button type="button" className="admin-danger" onClick={() => removeGallery(item.publicId)}><Trash2 size={15} /></button></div>) : <div className="admin-media-placeholder">No gallery images selected.</div>}</div></section>
        <section className="admin-panel"><div className="admin-panel-title"><div><h2>Videos</h2><p>Reels and video work from your Cloudinary library.</p></div><button type="button" className="admin-secondary" onClick={() => setPicker({ type: 'videos' })}><Video size={15} /> Add videos</button></div><div className="admin-selected-grid">{form.videos.length ? form.videos.map((item) => <div className="admin-selected-media" key={item.publicId}><video src={item.secureUrl || item.url} muted controls preload="metadata" /><button type="button" className="admin-danger" onClick={() => removeVideo(item.publicId)}><Trash2 size={15} /></button></div>) : <div className="admin-media-placeholder">No videos selected.</div>}</div></section>
      </div>
      <aside className="admin-editor-side"><section className="admin-panel"><h2>Publishing</h2><label className="admin-switch"><input type="checkbox" checked={form.published} onChange={(e) => update({ published: e.target.checked })} /><span>Published</span></label><label className="admin-switch"><input type="checkbox" checked={form.featured} onChange={(e) => update({ featured: e.target.checked })} /><span>Featured project</span></label><label>Display order<input type="number" min="0" value={form.order} onChange={(e) => update({ order: Number(e.target.value) })} /></label></section><section className="admin-panel"><h2>SEO</h2><label>SEO title<input maxLength="160" value={form.seo.title} onChange={(e) => update({ seo: { ...form.seo, title: e.target.value } })} /></label><label>SEO description<textarea maxLength="320" rows="6" value={form.seo.description} onChange={(e) => update({ seo: { ...form.seo, description: e.target.value } })} /></label></section></aside>
    </form>
    {picker?.type === 'cover' && <MediaPicker mode="image" selected={form.coverImage ? [form.coverImage] : []} onChange={(items) => update({ coverImage: items[0] || null })} onClose={() => setPicker(null)} />}
    {picker?.type === 'gallery' && <MediaPicker mode="image" multiple selected={form.gallery} onChange={(items) => update({ gallery: items })} onClose={() => setPicker(null)} />}
    {picker?.type === 'videos' && <MediaPicker mode="video" multiple selected={form.videos} onChange={(items) => update({ videos: items })} onClose={() => setPicker(null)} />}
  </section>
}
