import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowUpRight,
  Bot,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  MessageCircle,
  RotateCcw,
  Send,
  Sparkles,
  X,
} from 'lucide-react'
import { getProjects, getServices, submitEnquiry } from '../services/api.js'

const fallbackServices = [
  'Social Media Management',
  'Reels & Video Editing',
  'Graphic Designing',
  'Social Media Advertising',
  'Business Promotion',
  'Website Design',
]
const budgets = ['Under ₹10,000', '₹10,000 – ₹25,000', '₹25,000 – ₹50,000', '₹50,000+']
const timelines = ['ASAP', '1–2 weeks', '2–4 weeks', '1–2 months', 'Flexible']
const goals = ['Get more customers', 'Build a stronger brand', 'Grow social media', 'Launch a website', 'Promote a product']
const quickReplies = [
  ['Our Services', 'services'],
  ['Help me choose', 'recommend'],
  ['See our work', 'portfolio'],
  ['Get a quote', 'contact'],
]

const normalize = (value = '') => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
const aliases = {
  social: ['social media management', 'social media', 'instagram', 'facebook'],
  reels: ['reels', 'reel', 'video editing', 'video', 'editing', 'short video'],
  graphics: ['graphic design', 'graphic designing', 'graphics', 'poster', 'thumbnail', 'creative'],
  ads: ['advertising', 'ads', 'paid ads', 'social media advertising', 'campaign'],
  promotion: ['business promotion', 'promotion', 'promote my business', 'marketing'],
  website: ['website', 'web design', 'web development', 'web site', 'site'],
}
const intents = {
  greeting: ['hi', 'hello', 'hey', 'namaste', 'good morning', 'good afternoon', 'good evening'],
  services: ['service', 'services', 'offer', 'provide', 'what do you do'],
  portfolio: ['portfolio', 'work', 'projects', 'case study', 'examples', 'show me'],
  pricing: ['price', 'pricing', 'cost', 'budget', 'rate', 'charge', 'how much', 'quote'],
  contact: ['contact', 'hire', 'start', 'book', 'quotation', 'requirement', 'need help', 'interested'],
  process: ['process', 'how does it work', 'steps', 'workflow', 'timeline', 'how long'],
  recommend: ['recommend', 'suggest', 'which service', 'what should', 'help me choose', 'not sure'],
}

function score(value, terms) {
  return terms.reduce((total, term) => total + (value.includes(term) ? term.split(' ').length + 1 : 0), 0)
}

function getIntent(input) {
  const value = normalize(input)
  if (!value) return 'fallback'
  const intentScores = Object.entries(intents).map(([key, terms]) => [key, score(value, terms)])
  const serviceScores = Object.entries(aliases).map(([key, terms]) => [key, score(value, terms)])
  const bestIntent = intentScores.sort((a, b) => b[1] - a[1])[0]
  const bestService = serviceScores.sort((a, b) => b[1] - a[1])[0]
  if (bestIntent[1] === 0 && bestService[1] === 0) return 'fallback'
  return bestIntent[1] >= bestService[1] ? bestIntent[0] : bestService[0]
}

function findService(services, intent) {
  const terms = aliases[intent] || []
  return services.find((item) => terms.some((term) => normalize(item.title || item).includes(term)))
}

function describeService(title = '') {
  const value = normalize(title)
  if (value.includes('social media management')) return 'Content planning, posting, captions, audience engagement and a consistent brand presence.'
  if (value.includes('reels') || value.includes('video')) return 'Short-form videos, clean editing, transitions, subtitles and engaging presentation.'
  if (value.includes('graphic')) return 'Posts, posters, offers, thumbnails and branded promotional creatives.'
  if (value.includes('advertising')) return 'Targeted paid campaigns designed to improve reach, leads, engagement and sales.'
  if (value.includes('promotion')) return 'Creative promotional content that helps products and services get noticed.'
  if (value.includes('website')) return 'Modern, responsive and professional websites for businesses and brands.'
  return 'A creative digital service tailored to your business goals.'
}

function BotMessage({ text, actions, onAction }) {
  return <div className="gwm-chat-message gwm-chat-bot-message">
    <div className="gwm-chat-avatar"><Bot size={15} /></div>
    <div className="gwm-chat-bubble"><p>{text}</p>{actions?.length ? <div className="gwm-chat-actions">{actions.map(([label, key]) => <button type="button" key={`${label}-${key}`} onClick={() => onAction(key, label)}>{label}<ChevronRight size={13} /></button>)}</div> : null}</div>
  </div>
}

function ProjectForm({ services, onCancel }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', service: '', budget: '', message: '' })
  const [timeline, setTimeline] = useState('')
  const [state, setState] = useState('idle')
  const [error, setError] = useState('')
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const submit = async (event) => {
    event.preventDefault(); setState('loading'); setError('')
    try {
      await submitEnquiry({ ...form, message: `${form.message}\n\nPreferred timeline: ${timeline || 'Not specified'}` })
      setState('success')
    } catch (requestError) {
      setState('error'); setError(requestError.response?.data?.message || 'Could not send the enquiry. Please try again.')
    }
  }
  if (state === 'success') return <div className="gwm-chat-project-success"><CheckCircle2 size={28} /><strong>Enquiry sent successfully</strong><p>Thanks. Your project details are with us. We will get back to you soon.</p><button type="button" onClick={onCancel}>Back to chat</button></div>
  return <form className="gwm-chat-project-form" onSubmit={submit}>
    <div className="gwm-chat-form-heading"><div><strong>Start your project</strong><span>Get a tailored conversation, not a generic form.</span></div><button type="button" onClick={onCancel} aria-label="Back to chat"><X size={16} /></button></div>
    <input required placeholder="Your name *" value={form.name} onChange={(e) => update('name', e.target.value)} />
    <input required type="email" placeholder="Email *" value={form.email} onChange={(e) => update('email', e.target.value)} />
    <div className="gwm-chat-form-row"><input type="tel" placeholder="Phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} /><input placeholder="Company / brand" value={form.company} onChange={(e) => update('company', e.target.value)} /></div>
    <select value={form.service} onChange={(e) => update('service', e.target.value)}><option value="">Select service</option>{services.map((service) => <option key={service} value={service}>{service}</option>)}</select>
    <div className="gwm-chat-form-row"><select value={form.budget} onChange={(e) => update('budget', e.target.value)}><option value="">Budget</option>{budgets.map((item) => <option key={item}>{item}</option>)}</select><select value={timeline} onChange={(e) => setTimeline(e.target.value)}><option value="">Timeline</option>{timelines.map((item) => <option key={item}>{item}</option>)}</select></div>
    <textarea required rows="4" placeholder="Tell us about your project *" value={form.message} onChange={(e) => update('message', e.target.value)} />
    {state === 'error' ? <p className="gwm-chat-form-error">{error}</p> : null}
    <button className="gwm-chat-submit" type="submit" disabled={state === 'loading'}>{state === 'loading' ? 'Sending…' : 'Send enquiry'} <Send size={15} /></button>
  </form>
}

export default function ManualChatbot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [services, setServices] = useState(fallbackServices.map((title) => ({ title })))
  const [projectCount, setProjectCount] = useState(null)
  const [messages, setMessages] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('gwm-chat-history'))
      return Array.isArray(saved) && saved.length ? saved : [{ id: 1, type: 'bot', text: 'Hi! I’m the Grow With Me assistant. Tell me what you want to achieve and I’ll guide you.', actions: quickReplies }]
    } catch { return [{ id: 1, type: 'bot', text: 'Hi! I’m the Grow With Me assistant. Tell me what you want to achieve and I’ll guide you.', actions: quickReplies }] }
  })
  const messagesRef = useRef(null)

  useEffect(() => {
    Promise.allSettled([getServices(), getProjects()]).then(([serviceResult, projectResult]) => {
      if (serviceResult.status === 'fulfilled' && Array.isArray(serviceResult.value) && serviceResult.value.length) setServices(serviceResult.value)
      if (projectResult.status === 'fulfilled' && Array.isArray(projectResult.value)) setProjectCount(projectResult.value.length)
    })
  }, [])
  useEffect(() => {
    localStorage.setItem('gwm-chat-history', JSON.stringify(messages.slice(-50)))
    if (open && messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight
  }, [messages, open, typing])

  const currentPage = useMemo(() => {
    const path = window.location.pathname
    if (path === '/work') return 'portfolio'
    if (path.startsWith('/work/')) return 'project'
    return 'home'
  }, [])

  const pushBot = (text, actions = []) => {
    setTyping(true)
    window.setTimeout(() => { setTyping(false); setMessages((current) => [...current, { id: `${Date.now()}-bot`, type: 'bot', text, actions }]) }, 420)
  }
  const showServices = () => pushBot(`We currently offer ${services.length} services. Pick one and I’ll explain what it includes and show the relevant work.`, services.slice(0, 6).map((service) => [service.title, `service:${service.title}`]))
  const recommend = (goal = '') => {
    const value = normalize(goal)
    let intent = 'social'
    if (/website|web/.test(value)) intent = 'website'
    else if (/video|reel|youtube|short/.test(value)) intent = 'reels'
    else if (/design|poster|creative/.test(value)) intent = 'graphics'
    else if (/ads|advertising|leads|sales|paid/.test(value)) intent = 'ads'
    else if (/promot|product|launch/.test(value)) intent = 'promotion'
    const service = findService(services, intent)
    const title = service?.title || fallbackServices.find((item) => normalize(item).includes(intent)) || 'Social Media Management'
    pushBot(`Based on that goal, I’d start with ${title}. ${describeService(title)}`, [['See this service', `service:${title}`], ['Start a project', 'contact']])
  }
  const respond = (intent, raw = '') => {
    if (intent === 'greeting') return pushBot('Hello! I can recommend a service, explain pricing, show portfolio work, explain the process, or collect your project requirements.', quickReplies)
    if (intent === 'services') return showServices()
    if (intent === 'portfolio') return pushBot(`Our portfolio has ${projectCount ?? 'selected'} published projects. Open it to browse projects by service.`, [['Open portfolio', 'portfolio-link'], ['Start a project', 'contact']])
    if (intent === 'pricing') return pushBot('There is no one fixed price. Pricing depends on service, scope, content, timeline and requirements. I can collect your details now so the enquiry is specific.', [['Get a quote', 'contact'], ['See services', 'services']])
    if (intent === 'process') return pushBot('Our usual process is: Discuss → Plan → Create → Review → Publish → Grow.', [['Choose a service', 'services'], ['Start a project', 'contact']])
    if (intent === 'recommend') return recommend(raw)
    if (['social', 'reels', 'graphics', 'ads', 'promotion', 'website'].includes(intent)) {
      const service = findService(services, intent); const title = service?.title || intent
      return pushBot(`${title}: ${describeService(title)}`, [['See related work', `service:${title}`], ['Get a quote', 'contact']])
    }
    if (intent === 'contact') return setShowProjectForm(true)
    return pushBot('I can help with services, portfolio, pricing, process and project requirements. Try: “I want more customers from Instagram” or “I need a website”.', quickReplies)
  }

  const handleAction = (key, label) => {
    if (key === 'contact') { setMessages((current) => [...current, { id: `${Date.now()}-user`, type: 'user', text: label }]); setShowProjectForm(true); return }
    if (key === 'portfolio-link' || key.startsWith('service:')) { window.location.href = key === 'portfolio-link' ? '/work' : `/work?service=${encodeURIComponent(key.slice(8))}`; return }
    setMessages((current) => [...current, { id: `${Date.now()}-user`, type: 'user', text: label }]); respond(key, label)
  }
  const submit = (event) => {
    event.preventDefault(); const value = input.trim(); if (!value || typing) return
    setInput(''); const intent = getIntent(value)
    setMessages((current) => [...current, { id: `${Date.now()}-user`, type: 'user', text: value }]); respond(intent, value)
  }
  const clearChat = () => {
    localStorage.removeItem('gwm-chat-history'); setShowProjectForm(false)
    setMessages([{ id: Date.now(), type: 'bot', text: 'New conversation started. What would you like to achieve?', actions: quickReplies }])
  }
  const contextText = currentPage === 'portfolio' ? 'Portfolio mode · I can help you find the right service.' : currentPage === 'project' ? 'Project mode · Ask about this work or start your own project.' : 'Online · Ask about services, pricing or your project.'

  return <div className="gwm-chatbot" aria-live="polite">
    {open ? <section className="gwm-chat-window" aria-label="Grow With Me chatbot">
      <header className="gwm-chat-header"><div className="gwm-chat-brand"><div className="gwm-chat-brand-icon"><Bot size={19} /></div><div><strong>Grow With Me</strong><span>Smart website assistant</span></div></div><div className="gwm-chat-header-actions"><button type="button" onClick={clearChat} aria-label="Start new chat"><RotateCcw size={15} /></button><button type="button" onClick={() => setOpen(false)} aria-label="Close chat"><X size={18} /></button></div></header>
      {showProjectForm ? <div className="gwm-chat-project-wrap"><ProjectForm services={services.map((item) => item.title)} onCancel={() => setShowProjectForm(false)} /></div> : <>
        <div className="gwm-chat-context"><Sparkles size={13} /> {contextText}</div>
        <div className="gwm-chat-messages" ref={messagesRef}>{messages.map((message) => message.type === 'bot' ? <BotMessage key={message.id} text={message.text} actions={message.actions} onAction={handleAction} /> : <div className="gwm-chat-message gwm-chat-user-message" key={message.id}><div className="gwm-chat-bubble"><p>{message.text}</p></div></div>)}{typing ? <div className="gwm-chat-message gwm-chat-bot-message"><div className="gwm-chat-avatar"><Bot size={15} /></div><div className="gwm-chat-typing"><i /><i /><i /></div></div> : null}</div>
        <div className="gwm-chat-goals">{goals.map((goal) => <button type="button" key={goal} onClick={() => { setMessages((current) => [...current, { id: `${Date.now()}-user`, type: 'user', text: goal }]); recommend(goal) }}>{goal}</button>)}</div>
        <div className="gwm-chat-suggestions">{quickReplies.map(([label, key]) => <button type="button" key={key} onClick={() => handleAction(key, label)}>{label}</button>)}</div>
        <form className="gwm-chat-input" onSubmit={submit}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Try: I need more customers..." aria-label="Type your question" maxLength={400} /><button type="submit" disabled={typing} aria-label="Send message"><Send size={17} /></button></form>
      </>}
      <div className="gwm-chat-footer"><Clock3 size={10} /> Manual smart assistant · No AI/API <span><CircleHelp size={10} /> Private browser chat</span></div>
    </section> : null}
    <button type="button" className={`gwm-chat-launcher${open ? ' gwm-chat-launcher-open' : ''}`} onClick={() => setOpen((value) => !value)} aria-label={open ? 'Close chatbot' : 'Open Grow With Me chatbot'} aria-expanded={open}>{open ? <X size={23} /> : <MessageCircle size={23} />}{!open && <span>Chat with us</span>}</button>
  </div>
}
