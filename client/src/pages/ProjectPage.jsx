import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { getProject } from '../services/api.js'

export default function ProjectPage() {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getProject(slug).then(setProject).catch((e) => setError(e.response?.data?.message || 'Project not found')).finally(() => setLoading(false))
  }, [slug])

  if (loading) return <main className="container-gwm min-h-screen pt-40">Loading project…</main>
  if (error || !project) return <main className="container-gwm min-h-screen pt-40"><p>{error || 'Project not found'}</p><Link to="/" className="mt-6 inline-flex items-center gap-2 underline"><ArrowLeft size={16} /> Back</Link></main>

  return <main className="bg-[#f6f4ee] text-[#111]">
    <section className="container-gwm pt-32 pb-20 md:pt-40 md:pb-28">
      <Link to="/#work" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em]"><ArrowLeft size={15} /> Back to work</Link>
      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_.7fr] lg:items-end">
        <div><p className="eyebrow">{project.category.replaceAll('-', ' ')} · {project.year || '—'}</p><h1 className="display mt-5">{project.title}</h1></div>
        <div><p className="text-sm leading-7 text-[#68675f]">{project.description}</p>{project.client && <p className="mt-6 text-xs font-bold uppercase tracking-[.14em]">Client · {project.client}</p>}</div>
      </div>
    </section>
    {project.coverImage?.url && <div className="container-gwm"><img className="w-full max-h-[80vh] object-cover" src={project.coverImage.url} alt={project.coverImage.alt || project.title} /></div>}
    <section className="container-gwm py-20 md:py-28">
      {project.services?.length > 0 && <div className="mb-16 flex flex-wrap gap-2">{project.services.map((service) => <span key={service} className="border border-black/15 px-4 py-2 text-xs font-bold uppercase tracking-[.12em]">{service}</span>)}</div>}
      <div className="grid gap-5 md:grid-cols-2">
        {project.gallery?.map((image, index) => <figure key={`${image.publicId}-${index}`} className={index === 0 ? 'md:col-span-2' : ''}><img className="w-full object-cover" src={image.url} alt={image.alt || `${project.title} ${index + 1}`} loading="lazy" /></figure>)}
        {project.videos?.map((video, index) => <figure key={`${video.publicId}-${index}`} className="overflow-hidden bg-black"><video className="w-full" src={video.url} poster={video.thumbnail || undefined} controls playsInline preload="metadata" /></figure>)}
      </div>
    </section>
    <section className="bg-[#111] py-24 text-white md:py-32"><div className="container-gwm flex flex-col justify-between gap-8 md:flex-row md:items-end"><div><p className="eyebrow text-[#f5d90a]">Grow with us</p><h2 className="section-title mt-4">Ready for<br />your next<br /><span className="text-[#777]">project?</span></h2></div><a href="mailto:growithmeayush@gmail.com" className="yellow-button">Start a project <ArrowUpRight size={17} /></a></div></section>
  </main>
}
