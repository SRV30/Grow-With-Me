import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowUpRight, Filter } from 'lucide-react'
import gsap from 'gsap'
import { Link } from 'react-router-dom'
import { getProjects } from '../services/api.js'
import SEO from '../components/SEO.jsx'
import CloudinaryImage from '../components/CloudinaryImage.jsx'
import { EmptyState, LoadingState, ErrorState } from '../components/StatusState.jsx'

const filters = [
  'All',
  'Social Media',
  'Video',
  'Graphic Design',
  'Digital Marketing',
  'Web Design',
]

export default function WorkPage() {
  const [projects, setProjects] = useState([]),
    [active, setActive] = useState('All'),
    [loading, setLoading] = useState(true),
    [error, setError] = useState('')
  const grid = useRef(null)
  const load = () => {
    setLoading(true)
    setError('')
    getProjects()
      .then(setProjects)
      .catch((e) => setError(e.response?.data?.message || 'Unable to load projects.'))
      .finally(() => setLoading(false))
  }
  useEffect(() => {
    load()
  }, [])
  const visible = useMemo(
    () =>
      active === 'All'
        ? projects
        : projects.filter(
            (project) =>
              (project.category || '').toLowerCase().replaceAll('-', ' ') === active.toLowerCase(),
          ),
    [projects, active],
  )
  const changeFilter = (next) => {
    if (next === active) return
    const cards = grid.current?.querySelectorAll('[data-work-card]')
    if (!cards?.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      return setActive(next)
    gsap.to(cards, {
      opacity: 0,
      y: 18,
      duration: 0.18,
      stagger: 0.025,
      onComplete: () => {
        setActive(next)
        requestAnimationFrame(() =>
          gsap.fromTo(
            grid.current?.querySelectorAll('[data-work-card]') || [],
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.55, stagger: 0.06, ease: 'power3.out' },
          ),
        )
      },
    })
  }
  return (
    <main className="work-page bg-[#f6f4ee] text-[#111]">
      <SEO
        title="Selected Work"
        description="Explore social campaigns, videos, graphic design, digital marketing and websites created through the Grow With Me studio."
        path="/work"
      />
      <section className="container-gwm pt-32 pb-20 md:pt-44 md:pb-28">
        <p className="eyebrow">Selected work</p>
        <h1 className="display mt-6 max-w-6xl">
          Work that
          <br />
          <span className="text-[#8b8980]">gets noticed.</span>
        </h1>
        <p className="mt-9 max-w-xl text-lg leading-8 text-[#68675f]">
          Explore social campaigns, videos, graphic design, digital marketing and websites created
          through the Grow With Me studio.
        </p>
      </section>
      <section className="container-gwm pb-10">
        <div
          className="flex flex-wrap gap-2 border-y border-black/10 py-5"
          role="group"
          aria-label="Filter projects"
        >
          <span className="mr-2 flex items-center gap-2 px-2 text-xs font-bold uppercase tracking-[.14em]">
            <Filter size={14} aria-hidden="true" /> Filter
          </span>
          {filters.map((filter) => (
            <button
              type="button"
              key={filter}
              aria-pressed={active === filter}
              onClick={() => changeFilter(filter)}
              className={`min-h-11 px-4 py-2 text-xs font-bold uppercase tracking-[.1em] transition ${active === filter ? 'bg-[#111] text-white' : 'border border-black/10 hover:bg-[#ebe8df]'}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>
      {loading ? (
        <section className="container-gwm pb-32">
          <LoadingState label="Loading selected work…" />
        </section>
      ) : error ? (
        <section className="container-gwm pb-32">
          <ErrorState message={error} onRetry={load} />
        </section>
      ) : (
        <section ref={grid} className="container-gwm grid gap-5 pb-32 md:grid-cols-2">
          {visible.map((project, index) => (
            <Link
              key={project._id}
              to={`/work/${project.slug}`}
              data-work-card
              data-cursor="View project"
              className={`group relative overflow-hidden bg-[#222] ${index === 0 ? 'md:col-span-2' : ''}`}
            >
              <div className={`${index === 0 ? 'aspect-[16/8]' : 'aspect-[4/5]'} overflow-hidden`}>
                <div className="h-full w-full transition-transform duration-700 group-hover:scale-105">
                  {project.coverImage?.url ? (
                    <CloudinaryImage
                      src={project.coverImage.url}
                      alt={project.coverImage.alt || project.title}
                      className="h-full w-full object-cover"
                      width={1600}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={index === 0}
                    />
                  ) : (
                    <div className="h-full w-full bg-[#2a2a27]" aria-hidden="true" />
                  )}
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
              <span
                className="absolute right-6 top-6 grid h-12 w-12 place-items-center rounded-full border border-white/40 text-white transition duration-500 group-hover:rotate-45 group-hover:bg-[#f5d90a] group-hover:text-[#111] group-hover:border-[#f5d90a]"
                aria-hidden="true"
              >
                <ArrowUpRight size={19} />
              </span>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-[10px] uppercase tracking-[.18em] text-white/55">
                  {project.category?.replaceAll('-', ' ') || 'Creative project'} ·{' '}
                  {project.year || ''}
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-[-.05em] md:text-5xl">
                  {project.title}
                </h2>
              </div>
            </Link>
          ))}
          {!visible.length && (
            <div className="md:col-span-2">
              <EmptyState
                title="No projects yet"
                description="Publish a project from the admin dashboard and it will appear here."
              />
            </div>
          )}
        </section>
      )}
    </main>
  )
}
