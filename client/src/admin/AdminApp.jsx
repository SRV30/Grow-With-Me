import { useEffect, useState } from 'react'
import {
  FolderKanban,
  Image,
  LogOut,
  Plus,
  RefreshCw,
  ShieldCheck,
  Star,
  Trash2,
  BriefcaseBusiness,
  House,
  Inbox,
  Users,
} from 'lucide-react'
import {
  deleteAdminProject,
  getAdminProjects,
  getCurrentAdmin,
  loginAdmin,
  logoutAdmin,
  updateProjectFlags,
} from './api.js'
import MediaLibrary from './MediaLibrary.jsx'
import ProjectEditor from './ProjectEditor.jsx'
import ServicesManager from './ServicesManager.jsx'
import HomepageEditor from './HomepageEditor.jsx'
import Enquiries from './Enquiries.jsx'
import UserManagement from './UserManagement.jsx'

function Login({ onLogin }) {
  const [email, setEmail] = useState(''),
    [password, setPassword] = useState(''),
    [loading, setLoading] = useState(false),
    [error, setError] = useState('')
  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await loginAdmin({ email, password })
      onLogin()
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to sign in')
    } finally {
      setLoading(false)
    }
  }
  return (
    <main className="admin-login">
      <div className="admin-login-card">
        <div className="admin-mark">
          <ShieldCheck size={22} aria-hidden="true" /> GROW WITH ME
        </div>
        <p className="admin-eyebrow">Private workspace</p>
        <h1>Welcome back.</h1>
        <p className="admin-muted">Sign in to manage your portfolio and website content.</p>
        <form
          onSubmit={submit}
          className="admin-form"
          aria-describedby={error ? 'admin-login-error' : undefined}
        >
          <label htmlFor="admin-email">
            Email
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label htmlFor="admin-password">
            Password
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && (
            <p id="admin-login-error" className="admin-error" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="admin-primary" disabled={loading} aria-busy={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <a className="admin-back" href="/">
          ← Back to website
        </a>
      </div>
    </main>
  )
}

function Dashboard({ admin, onLogout }) {
  const [view, setView] = useState('projects'),
    [projects, setProjects] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(''),
    [editor, setEditor] = useState(null)
  const load = async () => {
    setLoading(true)
    setError('')
    try {
      setProjects(await getAdminProjects())
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to load projects')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    load()
  }, [])
  const toggle = async (id, field, value) => {
    try {
      await updateProjectFlags(id, { [field]: value })
      await load()
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to update project')
    }
  }
  const remove = async (id) => {
    if (!window.confirm('Delete this project permanently?')) return
    try {
      await deleteAdminProject(id)
      await load()
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to delete project')
    }
  }
  const saved = async () => {
    setEditor(null)
    await load()
  }
  const nav = (next) => {
    setView(next)
    if (next === 'projects') load()
  }

  if (editor)
    return (
      <ProjectEditor
        project={editor === 'new' ? null : editor}
        onBack={() => setEditor(null)}
        onSaved={saved}
      />
    )

  const navItems = [
    ['projects', FolderKanban, 'Projects'],
    ['media', Image, 'Media Library'],
    ['services', BriefcaseBusiness, 'Services'],
    ['homepage', House, 'Homepage'],
    ['enquiries', Inbox, 'Enquiries'],
    ['users', Users, 'Users & Security'],
  ]

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar" aria-label="Admin navigation">
        <div>
          <div className="admin-brand">
            GROW<span>.</span>WITH<span>.</span>ME
          </div>
          <p className="admin-side-label">CMS</p>
          {navItems.map(([key, Icon, label]) => (
            <button
              type="button"
              key={key}
              aria-current={view === key ? 'page' : undefined}
              className={view === key ? 'admin-nav-item active' : 'admin-nav-item'}
              onClick={() => nav(key)}
            >
              <Icon size={17} aria-hidden="true" /> {label}
            </button>
          ))}
        </div>
        <div>
          <div className="admin-user">
            <div className="admin-avatar" aria-hidden="true">
              {admin.name?.[0] || 'A'}
            </div>
            <div>
              <strong>{admin.name}</strong>
              <small>{admin.email}</small>
            </div>
          </div>
          <button type="button" className="admin-logout" onClick={onLogout}>
            <LogOut size={16} aria-hidden="true" /> Sign out
          </button>
          <a className="admin-back-side" href="/">
            View website ↗
          </a>
        </div>
      </aside>
      <main className="admin-content">
        {view === 'media' ? (
          <MediaLibrary />
        ) : view === 'services' ? (
          <ServicesManager />
        ) : view === 'homepage' ? (
          <HomepageEditor />
        ) : view === 'enquiries' ? (
          <Enquiries />
        ) : view === 'users' ? (
          <UserManagement />
        ) : (
          <>
            <header className="admin-topbar">
              <div>
                <p className="admin-eyebrow">Content management</p>
                <h1>Projects</h1>
              </div>
              <div className="admin-actions">
                <button
                  type="button"
                  className="admin-icon"
                  onClick={load}
                  title="Refresh"
                  aria-label="Refresh projects"
                >
                  <RefreshCw size={17} />
                </button>
                <button
                  type="button"
                  className="admin-primary admin-add"
                  onClick={() => setEditor('new')}
                >
                  <Plus size={17} aria-hidden="true" /> New project
                </button>
              </div>
            </header>
            {error && (
              <div className="admin-alert" role="alert">
                {error}
              </div>
            )}
            <section className="admin-stats" aria-label="Project statistics">
              <div>
                <span>Total projects</span>
                <strong>{projects.length}</strong>
              </div>
              <div>
                <span>Published</span>
                <strong>{projects.filter((p) => p.published).length}</strong>
              </div>
              <div>
                <span>Featured</span>
                <strong>{projects.filter((p) => p.featured).length}</strong>
              </div>
            </section>
            <section className="admin-table-wrap" aria-label="Projects">
              <div className="admin-table-head">
                <span>Project</span>
                <span>Category</span>
                <span>Status</span>
                <span>Actions</span>
              </div>
              {loading ? (
                <div className="admin-empty" role="status">
                  Loading projects…
                </div>
              ) : projects.length === 0 ? (
                <div className="admin-empty">No projects yet. Create your first project.</div>
              ) : (
                projects.map((project) => (
                  <article className="admin-project-row" key={project._id}>
                    <button
                      type="button"
                      className="admin-project-link"
                      onClick={() => setEditor(project)}
                    >
                      <strong>{project.title}</strong>
                      <small>
                        {project.client || 'No client'} · {project.year || '—'}
                      </small>
                    </button>
                    <span className="admin-category">{project.category.replace('-', ' ')}</span>
                    <div className="admin-statuses">
                      <button
                        type="button"
                        className={project.published ? 'status on' : 'status'}
                        onClick={() => toggle(project._id, 'published', !project.published)}
                        aria-label={`${project.published ? 'Unpublish' : 'Publish'} ${project.title}`}
                      >
                        {project.published ? 'Published' : 'Draft'}
                      </button>
                      <button
                        type="button"
                        className={project.featured ? 'status star on' : 'status star'}
                        title="Toggle featured"
                        aria-label={`Toggle featured for ${project.title}`}
                        onClick={() => toggle(project._id, 'featured', !project.featured)}
                      >
                        <Star
                          size={14}
                          aria-hidden="true"
                          fill={project.featured ? 'currentColor' : 'none'}
                        />
                      </button>
                    </div>
                    <button
                      type="button"
                      className="admin-danger"
                      onClick={() => remove(project._id)}
                      title="Delete"
                      aria-label={`Delete ${project.title}`}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </article>
                ))
              )}
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default function AdminApp() {
  const [admin, setAdmin] = useState(null),
    [checking, setChecking] = useState(true)
  useEffect(() => {
    getCurrentAdmin()
      .then(setAdmin)
      .catch(() => setAdmin(null))
      .finally(() => setChecking(false))
  }, [])
  if (checking)
    return (
      <div className="admin-loading" role="status">
        Loading workspace…
      </div>
    )
  if (!admin) return <Login onLogin={() => getCurrentAdmin().then(setAdmin)} />
  return (
    <Dashboard
      admin={admin}
      onLogout={async () => {
        await logoutAdmin()
        setAdmin(null)
      }}
    />
  )
}
