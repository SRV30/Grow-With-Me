import { useEffect, useState } from 'react'
import { Save, Plus, Trash2 } from 'lucide-react'
import { api } from '../services/api.js'

const empty = { hero: {}, about: {}, process: [], industries: [], cta: {}, marquee: [] }
const MAX_PROCESS = 20
const MAX_INDUSTRIES = 30

const unwrapHomepage = (payload) => {
  const value = payload?.data ?? payload
  return value && typeof value === 'object' ? value : empty
}

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback

const asText = (value, max = 5000) =>
  String(value ?? '')
    .trim()
    .slice(0, max)

const normalizePage = (value) => {
  const source = unwrapHomepage(value)
  return {
    ...empty,
    ...source,
    hero: { ...empty.hero, ...(source.hero || {}) },
    about: { ...empty.about, ...(source.about || {}) },
    cta: { ...empty.cta, ...(source.cta || {}) },
    process: Array.isArray(source.process) ? source.process.slice(0, MAX_PROCESS) : [],
    industries: Array.isArray(source.industries) ? source.industries.slice(0, MAX_INDUSTRIES) : [],
    marquee: Array.isArray(source.marquee) ? source.marquee.slice(0, MAX_INDUSTRIES) : [],
  }
}

const cleanPage = (source) => ({
  hero: {
    eyebrow: asText(source.hero?.eyebrow, 160),
    title: asText(source.hero?.title, 300),
    description: asText(source.hero?.description, 1000),
    primaryCtaText: asText(source.hero?.primaryCtaText, 120),
    primaryCtaLink: asText(source.hero?.primaryCtaLink, 500),
    secondaryCtaText: asText(source.hero?.secondaryCtaText, 120),
    secondaryCtaLink: asText(source.hero?.secondaryCtaLink, 500),
    ...(source.hero?.media && typeof source.hero.media === 'object'
      ? {
          media: {
            publicId: asText(source.hero.media.publicId, 300),
            url: asText(source.hero.media.url, 1000),
            alt: asText(source.hero.media.alt, 300),
          },
        }
      : {}),
  },
  about: {
    eyebrow: asText(source.about?.eyebrow, 160),
    title: asText(source.about?.title, 300),
    description: asText(source.about?.description, 1500),
    experienceYear: Number.isFinite(Number(source.about?.experienceYear))
      ? Number(source.about.experienceYear)
      : 2020,
  },
  process: (Array.isArray(source.process) ? source.process : [])
    .slice(0, MAX_PROCESS)
    .map((item, index) => ({
      number: asText(item?.number, 20),
      title: asText(item?.title, 200),
      text: asText(item?.text, 1000),
      order: Number.isFinite(Number(item?.order)) ? Number(item.order) : index + 1,
    })),
  industries: (Array.isArray(source.industries) ? source.industries : [])
    .slice(0, MAX_INDUSTRIES)
    .map((item, index) => ({
      name: asText(item?.name, 160),
      active: item?.active !== false,
      order: Number.isFinite(Number(item?.order)) ? Number(item.order) : index,
    }))
    .filter((item) => item.name),
  cta: {
    eyebrow: asText(source.cta?.eyebrow, 160),
    title: asText(source.cta?.title, 300),
    primaryText: asText(source.cta?.primaryText, 120),
    primaryLink: asText(source.cta?.primaryLink, 500),
    secondaryText: asText(source.cta?.secondaryText, 120),
    secondaryLink: asText(source.cta?.secondaryLink, 500),
  },
  marquee: (Array.isArray(source.marquee) ? source.marquee : [])
    .slice(0, MAX_INDUSTRIES)
    .map((item, index) => ({
      text: asText(item?.text, 160),
      order: Number.isFinite(Number(item?.order)) ? Number(item.order) : index,
    }))
    .filter((item) => item.text),
})

export default function HomepageEditor() {
  const [page, setPage] = useState(empty)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    api
      .get('/homepage')
      .then(({ data }) => {
        if (!active) return
        setPage(normalizePage(data))
      })
      .catch((requestError) => {
        if (!active) return
        setError(getErrorMessage(requestError, 'Unable to load homepage.'))
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const update = (section, key, value) =>
    setPage((current) => ({
      ...current,
      [section]: { ...(current[section] || {}), [key]: value },
    }))

  const save = async () => {
    if (saving) return
    setSaving(true)
    setMessage('')
    setError('')
    try {
      const payload = cleanPage(page)
      if (!payload.hero.title) throw new Error('Hero title is required.')
      if (!payload.about.title) throw new Error('About title is required.')
      const { data } = await api.patch('/homepage', payload)
      setPage(normalizePage(data))
      setMessage('Homepage saved successfully.')
    } catch (saveError) {
      setError(getErrorMessage(saveError, 'Unable to save homepage.'))
    } finally {
      setSaving(false)
    }
  }

  const addProcess = () => {
    setPage((current) => {
      if (current.process.length >= MAX_PROCESS) return current
      const order = current.process.length + 1
      return {
        ...current,
        process: [
          ...current.process,
          { number: String(order).padStart(2, '0'), title: '', text: '', order },
        ],
      }
    })
  }

  const updateProcess = (index, key, value) =>
    setPage((current) => ({
      ...current,
      process: current.process.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    }))

  const removeProcess = (index) =>
    setPage((current) => ({
      ...current,
      process: current.process.filter((_, itemIndex) => itemIndex !== index),
    }))

  const addIndustry = () => {
    setPage((current) => {
      if (current.industries.length >= MAX_INDUSTRIES) return current
      return {
        ...current,
        industries: [
          ...current.industries,
          { name: '', active: true, order: current.industries.length },
        ],
      }
    })
  }

  const updateIndustry = (index, key, value) =>
    setPage((current) => ({
      ...current,
      industries: current.industries.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    }))

  const removeIndustry = (index) =>
    setPage((current) => ({
      ...current,
      industries: current.industries.filter((_, itemIndex) => itemIndex !== index),
    }))

  if (loading) return <div className="admin-empty">Loading homepage…</div>

  return (
    <div>
      <header className="admin-topbar">
        <div>
          <p className="admin-eyebrow">Content management</p>
          <h1>Homepage</h1>
        </div>
        <button
          className="admin-primary admin-add"
          onClick={save}
          disabled={saving}
          aria-busy={saving}
        >
          <Save size={17} /> {saving ? 'Saving…' : 'Save changes'}
        </button>
      </header>
      {message && <div className="admin-alert">{message}</div>}
      {error && (
        <div className="admin-error" role="alert">
          {error}
        </div>
      )}
      <div className="admin-editor-grid">
        <section className="admin-card">
          <h2>Hero</h2>
          <label>
            Eyebrow
            <input
              maxLength={160}
              value={page.hero?.eyebrow || ''}
              onChange={(e) => update('hero', 'eyebrow', e.target.value)}
            />
          </label>
          <label>
            Title
            <textarea
              maxLength={300}
              rows="3"
              value={page.hero?.title || ''}
              onChange={(e) => update('hero', 'title', e.target.value)}
            />
          </label>
          <label>
            Description
            <textarea
              maxLength={1000}
              rows="4"
              value={page.hero?.description || ''}
              onChange={(e) => update('hero', 'description', e.target.value)}
            />
          </label>
          <div className="admin-two">
            <label>
              Primary CTA
              <input
                maxLength={120}
                value={page.hero?.primaryCtaText || ''}
                onChange={(e) => update('hero', 'primaryCtaText', e.target.value)}
              />
            </label>
            <label>
              Primary Link
              <input
                maxLength={500}
                value={page.hero?.primaryCtaLink || ''}
                onChange={(e) => update('hero', 'primaryCtaLink', e.target.value)}
              />
            </label>
            <label>
              Secondary CTA
              <input
                maxLength={120}
                value={page.hero?.secondaryCtaText || ''}
                onChange={(e) => update('hero', 'secondaryCtaText', e.target.value)}
              />
            </label>
            <label>
              Secondary Link
              <input
                maxLength={500}
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
              maxLength={160}
              value={page.about?.eyebrow || ''}
              onChange={(e) => update('about', 'eyebrow', e.target.value)}
            />
          </label>
          <label>
            Title
            <input
              maxLength={300}
              value={page.about?.title || ''}
              onChange={(e) => update('about', 'title', e.target.value)}
            />
          </label>
          <label>
            Description
            <textarea
              maxLength={1500}
              rows="6"
              value={page.about?.description || ''}
              onChange={(e) => update('about', 'description', e.target.value)}
            />
          </label>
          <label>
            Experience Since
            <input
              type="number"
              min="2000"
              max={new Date().getFullYear()}
              value={page.about?.experienceYear || 2020}
              onChange={(e) => update('about', 'experienceYear', Number(e.target.value))}
            />
          </label>
        </section>

        <section className="admin-card">
          <div className="admin-card-heading">
            <h2>Process</h2>
            <button
              type="button"
              className="admin-icon"
              onClick={addProcess}
              disabled={saving || page.process.length >= MAX_PROCESS}
              aria-label="Add process step"
            >
              <Plus size={16} />
            </button>
          </div>
          {page.process?.map((item, i) => (
            <div className="admin-repeat" key={i}>
              <input
                maxLength={20}
                aria-label={`Process ${i + 1} number`}
                value={item.number || ''}
                onChange={(e) => updateProcess(i, 'number', e.target.value)}
              />
              <input
                maxLength={200}
                placeholder="Title"
                aria-label={`Process ${i + 1} title`}
                value={item.title || ''}
                onChange={(e) => updateProcess(i, 'title', e.target.value)}
              />
              <textarea
                maxLength={1000}
                placeholder="Description"
                aria-label={`Process ${i + 1} description`}
                value={item.text || ''}
                onChange={(e) => updateProcess(i, 'text', e.target.value)}
              />
              <button
                type="button"
                className="admin-danger"
                onClick={() => removeProcess(i)}
                disabled={saving}
                aria-label={`Remove process ${i + 1}`}
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
              type="button"
              className="admin-icon"
              onClick={addIndustry}
              disabled={saving || page.industries.length >= MAX_INDUSTRIES}
              aria-label="Add industry"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="admin-repeat-list">
            {page.industries?.map((item, i) => (
              <div className="admin-repeat" key={i}>
                <input
                  maxLength={160}
                  placeholder="Industry"
                  aria-label={`Industry ${i + 1}`}
                  value={item.name || ''}
                  onChange={(e) => updateIndustry(i, 'name', e.target.value)}
                />
                <label className="admin-check">
                  <input
                    type="checkbox"
                    checked={item.active !== false}
                    onChange={(e) => updateIndustry(i, 'active', e.target.checked)}
                  />{' '}
                  Active
                </label>
                <button
                  type="button"
                  className="admin-danger"
                  onClick={() => removeIndustry(i)}
                  disabled={saving}
                  aria-label={`Remove industry ${i + 1}`}
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
              maxLength={160}
              value={page.cta?.eyebrow || ''}
              onChange={(e) => update('cta', 'eyebrow', e.target.value)}
            />
          </label>
          <label>
            Title
            <textarea
              maxLength={300}
              rows="3"
              value={page.cta?.title || ''}
              onChange={(e) => update('cta', 'title', e.target.value)}
            />
          </label>
          <div className="admin-two">
            <label>
              Primary Text
              <input
                maxLength={120}
                value={page.cta?.primaryText || ''}
                onChange={(e) => update('cta', 'primaryText', e.target.value)}
              />
            </label>
            <label>
              Primary Link
              <input
                maxLength={500}
                value={page.cta?.primaryLink || ''}
                onChange={(e) => update('cta', 'primaryLink', e.target.value)}
              />
            </label>
            <label>
              Secondary Text
              <input
                maxLength={120}
                value={page.cta?.secondaryText || ''}
                onChange={(e) => update('cta', 'secondaryText', e.target.value)}
              />
            </label>
            <label>
              Secondary Link
              <input
                maxLength={500}
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
