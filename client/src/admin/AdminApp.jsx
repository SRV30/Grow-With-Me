import { useEffect, useState } from 'react'
import { ArrowLeft, FolderKanban, LogOut, Plus, RefreshCw, ShieldCheck, Star, Trash2 } from 'lucide-react'
import { createAdminProject, deleteAdminProject, getAdminProjects, getCurrentAdmin, loginAdmin, logoutAdmin, updateProjectFlags } from './api.js'

const emptyProject = { title: '', slug: '', description: '', client: '', category: 'social-media', year: new Date().getFullYear(), services: [], featured: false, published: false, order: 0 }
const categories = ['social-media', 'posters', 'reels', 'advertisements', 'branding', 'websites', 'other']

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const submit = async (event) => {
    event.preventDefault(); setError(''); setLoading(true)
    try { await loginAdmin({ email, password }); onLogin() } catch (e) { setError(e.response?.data?.message || 'Unable to sign in') } finally { setLoading(false) }
  }
  return <main className="admin-login"><div className="admin-login-card"><div className="admin-mark"><ShieldCheck size={22} /> GROW WITH ME</div><p className="admin-eyebrow">Private workspace</p><h1>Welcome back.</h1><p className="admin-muted">Sign in to manage your portfolio and website content.</p><form onSubmit={submit} className="admin-form"><label>Email<input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required /></label><label>Password<input type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required /></label>{error && <p className="admin-error">{error}</p>}<button className="admin-primary" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button></form><a className="admin-back" href="/">← Back to website</a></div></main>
}

function Dashboard({ admin, onLogout }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState(emptyProject)
  const [saving, setSaving] = useState(false)

  const load = async () => { setLoading(true); setError(''); try { setProjects(await getAdminProjects()) } catch (e) { setError(e.response?.data?.message || 'Unable to load projects') } finally { setLoading(false) } }
  useEffect(() => { load() }, [])

  const create = async (event) => {
    event.preventDefault(); setSaving(true); setError('')
    try { await createAdminProject({ ...form, services: form.servicesText ? form.servicesText.split(',').map(s => s.trim()).filter(Boolean) : [] }); setForm(emptyProject); setShowCreate(false); await load() } catch (e) { setError(e.response?.data?.message || 'Unable to create project') } finally { setSaving(false) }
  }

  const toggle = async (id, field, value) => { try { await updateProjectFlags(id, { [field]: value }); await load() } catch (e) { setError(e.response?.data?.message || 'Unable to update project') } }
  const remove = async (id) => { if (!window.confirm('Delete this project permanently?')) return; try { await deleteAdminProject(id); await load() } catch (e) { setError(e.response?.data?.message || 'Unable to delete project') } }

  return <div className="admin-shell"><aside className="admin-sidebar"><div><div className="admin-brand">GROW<span>.</span>WITH<span>.</span>ME</div><p className="admin-side-label">CMS</p><div className="admin-nav-item active"><FolderKanban size={17} /> Projects</div></div><div><div className="admin-user"><div className="admin-avatar">{admin.name?.[0] || 'A'}</div><div><strong>{admin.name}</strong><small>{admin.email}</small></div></div><button className="admin-logout" onClick={onLogout}><LogOut size={16} /> Sign out</button><a className="admin-back-side" href="/">View website ↗</a></div></aside><main className="admin-content"><header className="admin-topbar"><div><p className="admin-eyebrow">Content management</p><h1>Projects</h1></div><div className="admin-actions"><button className="admin-icon" onClick={load} title="Refresh"><RefreshCw size={17} /></button><button className="admin-primary admin-add" onClick={() => setShowCreate(true)}><Plus size={17} /> New project</button></div></header>{error && <div className="admin-alert">{error}</div>}<section className="admin-stats"><div><span>Total projects</span><strong>{projects.length}</strong></div><div><span>Published</span><strong>{projects.filter(p => p.published).length}</strong></div><div><span>Featured</span><strong>{projects.filter(p => p.featured).length}</strong></div></section><section className="admin-table-wrap"><div className="admin-table-head"><span>Project</span><span>Category</span><span>Status</span><span>Actions</span></div>{loading ? <div className="admin-empty">Loading projects…</div> : projects.length === 0 ? <div className="admin-empty">No projects yet. Create your first project.</div> : projects.map(project => <article className="admin-project-row" key={project._id}><div><strong>{project.title}</strong><small>{project.client || 'No client'} · {project.year || '—'}</small></div><span className="admin-category">{project.category.replace('-', ' ')}</span><div className="admin-statuses"><button className={project.published ? 'status on' : 'status'} onClick={() => toggle(project._id, 'published', !project.published)}>{project.published ? 'Published' : 'Draft'}</button><button className={project.featured ? 'status star on' : 'status star'} title="Toggle featured" onClick={() => toggle(project._id, 'featured', !project.featured)}><Star size={14} fill={project.featured ? 'currentColor' : 'none'} /></button></div><button className="admin-danger" onClick={() => remove(project._id)} title="Delete"><Trash2 size={16} /></button></article>)}</section>{showCreate && <div className="admin-modal-backdrop" onMouseDown={e => e.target === e.currentTarget && setShowCreate(false)}><form className="admin-modal" onSubmit={create}><div className="admin-modal-head"><div><p className="admin-eyebrow">Portfolio</p><h2>New project</h2></div><button type="button" className="admin-close" onClick={() => setShowCreate(false)}>×</button></div><div className="admin-form-grid"><label>Title<input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></label><label>Slug<input placeholder="my-project" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} required /></label><label>Client<input value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} /></label><label>Year<input type="number" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} /></label><label>Category<select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{categories.map(c => <option key={c} value={c}>{c.replace('-', ' ')}</option>)}</select></label><label>Services<input placeholder="Design, Social Media" value={form.servicesText || ''} onChange={e => setForm({ ...form, servicesText: e.target.value })} /></label><label className="full">Description<textarea rows="5" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></label></div><div className="admin-checks"><label><input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} /> Publish immediately</label><label><input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} /> Featured project</label></div><button className="admin-primary" disabled={saving}>{saving ? 'Creating…' : 'Create project'}</button></form></div>}</main></div>
}

export default function AdminApp() {
  const [admin, setAdmin] = useState(null)
  const [checking, setChecking] = useState(true)
  useEffect(() => { getCurrentAdmin().then(setAdmin).catch(() => setAdmin(null)).finally(() => setChecking(false)) }, [])
  if (checking) return <div className="admin-loading">Loading workspace…</div>
  if (!admin) return <Login onLogin={() => getCurrentAdmin().then(setAdmin)} />
  return <Dashboard admin={admin} onLogout={async () => { await logoutAdmin(); setAdmin(null) }} />
}
