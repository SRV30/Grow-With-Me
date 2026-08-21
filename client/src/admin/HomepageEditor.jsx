import { useEffect, useState } from 'react'
import { Save, Plus, Trash2 } from 'lucide-react'
import { api } from '../services/api.js'

const empty = { hero: {}, about: {}, process: [], industries: [], cta: {}, marquee: [] }

export default function HomepageEditor() {
  const [page, setPage] = useState(empty)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    api
      .get('/homepage')
      .then(({ data }) => setPage(data.data))
      .finally(() => setLoading(false))
  }, [])
  const update = (section, key, value) =>
    setPage((p) => ({ ...p, [section]: { ...p[section], [key]: value } }))
  const save = async () => {
    setSaving(true)
    setMessage('')
    try {
      const { data } = await api.patch('/homepage', page)
      setPage(data.data)
      setMessage('Homepage saved successfully.')
    } catch (e) {
      setMessage(e.response?.data?.message || 'Unable to save homepage.')
    } finally {
      setSaving(false)
    }
  }
  if (loading) return <div className="admin-empty">Loading homepage…</div>
  return (
    <div>
      <header className="admin-topbar">
        <div>
          <p className="admin-eyebrow">Content management</p>
          <h1>Homepage</h1>
        </div>
        <button className="admin-primary admin-add" onClick={save} disabled={saving}>
          <Save size={17} /> {saving ? 'Saving…' : 'Save changes'}
        </button>
      </header>
      {message && <div className="admin-alert">{message}</div>}
      <div className="admin-editor-grid">
        <section className="admin-card">
          <h2>Hero</h2>
          <label>
            Eyebrow
            <input
              value={page.hero?.eyebrow || ''}
              onChange={(e) => update('hero', 'eyebrow', e.target.value)}
            />
          </label>
          <label>
            Title
            <textarea
              rows="3"
              value={page.hero?.title || ''}
              onChange={(e) => update('hero', 'title', e.target.value)}
            />
          </label>
          <label>
            Description
            <textarea
              rows="4"
              value={page.hero?.description || ''}
              onChange={(e) => update('hero', 'description', e.target.value)}
            />
          </label>
          <div className="admin-two">
            <label>
              Primary CTA
              <input
                value={page.hero?.primaryCtaText || ''}
                onChange={(e) => update('hero', 'primaryCtaText', e.target.value)}
              />
            </label>
            <label>
              Primary Link
              <input
                value={page.hero?.primaryCtaLink || ''}
                onChange={(e) => update('hero', 'primaryCtaLink', e.target.value)}
              />
            </label>
            <label>
              Secondary CTA
              <input
                value={page.hero?.secondaryCtaText || ''}
                onChange={(e) => update('hero', 'secondaryCtaText', e.target.value)}
              />
            </label>
            <label>
              Secondary Link
              <input
                value={page.hero?.secondaryCtaLink || ''}
                onChange={(e) => update('hero', 'secondaryCtaLink', e.target.value)}
              />
            </label>
          </div>
        </section>
        <section className="admin-card">
          <h2>About</h2>
          <label>
            Eyebrow
            <input
              value={page.about?.eyebrow || ''}
              onChange={(e) => update('about', 'eyebrow', e.target.value)}
            />
          </label>
          <label>
            Title
            <input
              value={page.about?.title || ''}
              onChange={(e) => update('about', 'title', e.target.value)}
            />
          </label>
          <label>
            Description
            <textarea
              rows="6"
              value={page.about?.description || ''}
              onChange={(e) => update('about', 'description', e.target.value)}
            />
          </label>
          <label>
            Experience Since
            <input
              type="number"
              value={page.about?.experienceYear || 2020}
              onChange={(e) => update('about', 'experienceYear', Number(e.target.value))}
            />
          </label>
        </section>
        <section className="admin-card">
          <div className="admin-card-heading">
            <h2>Process</h2>
            <button
              className="admin-icon"
              onClick={() =>
                setPage((p) => ({
                  ...p,
                  process: [
                    ...p.process,
                    {
                      number: String(p.process.length + 1).padStart(2, '0'),
                      title: '',
                      text: '',
                      order: p.process.length + 1,
                    },
                  ],
                }))
              }
            >
              <Plus size={16} />
            </button>
          </div>
          {page.process?.map((item, i) => (
            <div className="admin-repeat" key={i}>
              <input
                value={item.number || ''}
                onChange={(e) =>
                  setPage((p) => ({
                    ...p,
                    process: p.process.map((x, j) =>
                      j === i ? { ...x, number: e.target.value } : x,
                    ),
                  }))
                }
              />
              <input
                value={item.title || ''}
                placeholder="Title"
                onChange={(e) =>
                  setPage((p) => ({
                    ...p,
                    process: p.process.map((x, j) =>
                      j === i ? { ...x, title: e.target.value } : x,
                    ),
                  }))
                }
              />
              <textarea
                value={item.text || ''}
                placeholder="Description"
                onChange={(e) =>
                  setPage((p) => ({
                    ...p,
                    process: p.process.map((x, j) =>
                      j === i ? { ...x, text: e.target.value } : x,
                    ),
                  }))
                }
              />
              <button
                className="admin-danger"
                onClick={() =>
                  setPage((p) => ({ ...p, process: p.process.filter((_, j) => j !== i) }))
                }
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </section>
        <section className="admin-card">
          <div className="admin-card-heading">
            <h2>Industries</h2>
            <button
              className="admin-icon"
              onClick={() =>
                setPage((p) => ({
                  ...p,
                  industries: [
                    ...p.industries,
                    { name: '', active: true, order: p.industries.length },
                  ],
                }))
              }
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="admin-repeat-list">
            {page.industries?.map((item, i) => (
              <div className="admin-repeat" key={i}>
                <input
                  value={item.name || ''}
                  placeholder="Industry"
                  onChange={(e) =>
                    setPage((p) => ({
                      ...p,
                      industries: p.industries.map((x, j) =>
                        j === i ? { ...x, name: e.target.value } : x,
                      ),
                    }))
                  }
                />
                <label className="admin-check">
                  <input
                    type="checkbox"
                    checked={item.active !== false}
                    onChange={(e) =>
                      setPage((p) => ({
                        ...p,
                        industries: p.industries.map((x, j) =>
                          j === i ? { ...x, active: e.target.checked } : x,
                        ),
                      }))
                    }
                  />{' '}
                  Active
                </label>
                <button
                  className="admin-danger"
                  onClick={() =>
                    setPage((p) => ({ ...p, industries: p.industries.filter((_, j) => j !== i) }))
                  }
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </section>
        <section className="admin-card">
          <h2>CTA</h2>
          <label>
            Eyebrow
            <input
              value={page.cta?.eyebrow || ''}
              onChange={(e) => update('cta', 'eyebrow', e.target.value)}
            />
          </label>
          <label>
            Title
            <textarea
              rows="3"
              value={page.cta?.title || ''}
              onChange={(e) => update('cta', 'title', e.target.value)}
            />
          </label>
          <div className="admin-two">
            <label>
              Primary Text
              <input
                value={page.cta?.primaryText || ''}
                onChange={(e) => update('cta', 'primaryText', e.target.value)}
              />
            </label>
            <label>
              Primary Link
              <input
                value={page.cta?.primaryLink || ''}
                onChange={(e) => update('cta', 'primaryLink', e.target.value)}
              />
            </label>
            <label>
              Secondary Text
              <input
                value={page.cta?.secondaryText || ''}
                onChange={(e) => update('cta', 'secondaryText', e.target.value)}
              />
            </label>
            <label>
              Secondary Link
              <input
                value={page.cta?.secondaryLink || ''}
                onChange={(e) => update('cta', 'secondaryLink', e.target.value)}
              />
            </label>
          </div>
        </section>
      </div>
    </div>
  )
}
