import { useEffect, useMemo, useRef, useState } from 'react'
import {
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

const fallbackServices = ['Social Media Management', 'Reels & Video Editing', 'Graphic Designing', 'Social Media Advertising', 'Business Promotion', 'Website Design']
const budgets = ['Under ₹10,000', '₹10,000 – ₹25,000', '₹25,000 – ₹50,000', '₹50,000+']
const timelines = ['ASAP', '1–2 weeks', '2–4 weeks', '1–2 months', 'Flexible']
const goals = [
  ['More customers', 'growth'],
  ['Better branding', 'brand'],
  ['Social growth', 'social'],
  ['New website', 'website'],
  ['Promote product', 'promotion'],
]
const quickReplies = [['Services', 'services'], ['Recommend', 'recommend'], ['Portfolio', 'portfolio'], ['Get a quote', 'contact']]

const normalize = (value = '') => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
const aliases = {
  social: ['social media', 'instagram', 'facebook', 'followers', 'engagement'],
  reels: ['reels', 'reel', 'video editing', 'video', 'editing', 'short video', 'youtube'],
  graphics: ['graphic design', 'graphic designing', 'graphics', 'poster', 'thumbnail', 'creative'],
  ads: ['advertising', 'ads', 'paid ads', 'campaign', 'meta ads'],
  promotion: ['business promotion', 'promotion', 'promote my business', 'product launch', 'marketing'],
  website: ['website', 'web design', 'web development', 'web site', 'site', 'online store'],
}
const intentTerms = {
  greeting: ['hi', 'hello', 'hey', 'namaste', 'good morning', 'good afternoon', 'good evening'],
  services: ['service', 'services', 'offer', 'provide', 'what do you do'],
  portfolio: ['portfolio', 'work', 'projects', 'case study', 'examples', 'show me'],
  pricing: ['price', 'pricing', 'cost', 'budget', 'rate', 'charge', 'how much', 'quote'],
  contact: ['contact', 'hire', 'start', 'book', 'quotation', 'requirement', 'need help', 'interested'],
  process: ['process', 'how does it work', 'steps', 'workflow', 'timeline', 'how long'],
  recommend: ['recommend', 'suggest', 'which service', 'what should', 'help me choose', 'not sure'],
  growth: ['more customers', 'customers', 'leads', 'sales', 'sell more', 'grow business'],
  brand: ['branding', 'brand identity', 'professional look', 'brand'],
}

function score(value, terms) { return terms.reduce((sum, term) => sum + (value.includes(term) ? term.split(' ').length + 1 : 0), 0) }
function getIntent(input) {
  const value = normalize(input)
  if (!value) return 'fallback'
  const all = [...Object.entries(intentTerms), ...Object.entries(aliases)]
  const best = all.map(([key, terms]) => [key, score(value, terms)]).sort((a, b) => b[1] - a[1])[0]
  return best[1] ? best[0] : 'fallback'
}
function findService(services, key) {
  const terms = aliases[key] || []
  return services.find((service) => terms.some((term) => normalize(service.title).includes(term)))
}
function serviceDescription(title = '') {
  const value = normalize(title)
  if (value.includes('social media')) return 'Content planning, posting, captions, audience engagement and consistent brand presence.'
  if (value.includes('reel') || value.includes('video')) return 'Short-form videos, clean editing, transitions, subtitles and engaging presentation.'
  if (value.includes('graphic')) return 'Social posts, posters, offers, thumbnails and branded promotional creatives.'
  if (value.includes('advertising')) return 'Targeted paid campaigns designed to improve reach, leads, engagement and sales.'
  if (value.includes('promotion')) return 'Creative promotional content that helps products and services get noticed.'
  if (value.includes('website')) return 'Modern, responsive and professional websites for businesses and brands.'
  return 'A creative digital service tailored to your business goals.'
}

function BotMessage({ text, actions, onAction }) {
  return <div className="gwm-chat-message gwm-chat-bot-message"><div className="gwm-chat-avatar"><Bot size={15} /></div><div className="gwm-chat-bubble"><p>{text}</p>{actions?.length ? <div className="gwm-chat-actions">{actions.map(([label, key]) => <button type="button" key={`${label}-${key}`} onClick={() => onAction(key, label)}>{label}<ChevronRight size={13} /></button>)}</div> : null}</div></div>
}

function ProjectForm({ services, initialService, onCancel }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', service: initialService || '', budget: '', message: '' })
  const [timeline, setTimeline] = useState('')
  const [state, setState] = useState('idle')
  const [error, setError] = useState('')
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const submit = async (event) => {
    event.preventDefault(); setState('loading'); setError('')
    try { await submitEnquiry({ ...form, message: `${form.message}\n\nPreferred timeline: ${timeline || 'Not specified'}` }); setState('success') }
    catch (requestError) { setState('error'); setError(requestError.response?.data?.message || 'Could not send the enquiry. Please try again.') }
  }
  if (state === 'success') return <div className="gwm-chat-project-success"><CheckCircle2 size={28} /><strong>Enquiry sent successfully</strong><p>Thanks. Your project details are with us. We will get back to you soon.</p><button type="button" onClick={onCancel}>Back to chat</button></div>
  return <form className="gwm-chat-project-form" onSubmit={submit}>
    <div className="gwm-chat-form-heading"><div><strong>Start your project</strong><span>Tell us what you want to achieve.</span></div><button type="button" onClick={onCancel} aria-label="Back to chat"><X size={16} /></button></div>
    <input required placeholder="Your name *" value={form.name} onChange={(e) => update('name', e.target.value)} />
    <input required type="email" placeholder="Email *" value={form.email} onChange={(e) => update('email', e.target.value)} />
    <div className="gwm-chat-form-row"><input type="tel" placeholder="Phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} /><input placeholder="Company / brand" value={form.company} onChange={(e) => update('company', e.target.value)} /></div>
    <select value={form.service} onChange={(e) => update('service', e.target.value)}><option value="">Select service</option>{services.map((service) => <option key={service} value={service}>{service}</option>)}</select>
    <div className="gwm-chat-form-row"><select value={form.budget} onChange={(e) => update('budget', e.target.value)}><option value="">Budget</option>{budgets.map((item) => <option key={item}>{item}</option>)}</select><select value={timeline} onChange={(e) => setTimeline(e.target.value)}><option value="">Timeline</option>{timelines.map((item) => <option key={item}>{item}</option>)}</select></div>
    <textarea required rows="4" placeholder="Tell us about your project *" value={form.message} onChange={(e) => update('message', e.target.value)} />
    {state === 'error' ? <p className="gwm-chat-form-error">{error}</p> : null}<button className="gwm-chat-submit" type="submit" disabled={state === 'loading'}>{state === 'loading' ? 'Sending…' : 'Send enquiry'} <Send size={15} /></button>
  </form>
}

export default function ManualChatbot() {
  const [open, setOpen] = useState(false), [input, setInput] = useState(''), [typing, setTyping] = useState(false)
  const [showProjectForm, setShowProjectForm] = useState(false), [formService, setFormService] = useState('')
  const [services, setServices] = useState(fallbackServices.map((title) => ({ title }))), [projectCount, setProjectCount] = useState(null)
  const [profile, setProfile] = useState(() => { try { return JSON.parse(localStorage.getItem('gwm-chat-profile')) || {} } catch { return {} } })
  const [messages, setMessages] = useState(() => { try { const saved = JSON.parse(localStorage.getItem('gwm-chat-history')); return Array.isArray(saved) && saved.length ? saved : [{ id: 1, type: 'bot', text: 'Hi! I’m the Grow With Me assistant. Tell me your goal and I’ll help you choose the right service.', actions: quickReplies }] } catch { return [{ id: 1, type: 'bot', text: 'Hi! I’m the Grow With Me assistant. Tell me your goal and I’ll help you choose the right service.', actions: quickReplies }] } })
  const messagesRef = useRef(null)

  useEffect(() => { Promise.allSettled([getServices(), getProjects()]).then(([a, b]) => { if (a.status === 'fulfilled' && Array.isArray(a.value) && a.value.length) setServices(a.value); if (b.status === 'fulfilled' && Array.isArray(b.value)) setProjectCount(b.value.length) }) }, [])
  useEffect(() => { localStorage.setItem('gwm-chat-history', JSON.stringify(messages.slice(-60))); localStorage.setItem('gwm-chat-profile', JSON.stringify(profile)); if (open && messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight }, [messages, profile, open, typing])
  const currentPage = useMemo(() => { const path = window.location.pathname; if (path === '/work') return 'portfolio'; if (path.startsWith('/work/')) return 'project'; return 'home' }, [])

  const pushBot = (text, actions = []) => { setTyping(true); window.setTimeout(() => { setTyping(false); setMessages((current) => [...current, { id: `${Date.now()}-bot`, type: 'bot', text, actions }]) }, 380) }
  const showServices = () => pushBot(`We currently have ${services.length} services. Pick one for details and related work.`, services.slice(0, 6).map((service) => [service.title, `service:${service.title}`]))
  const recommend = (goal) => {
    const value = normalize(goal); let key = 'social'
    if (/website|web|online store/.test(value)) key = 'website'; else if (/video|reel|youtube|short/.test(value)) key = 'reels'; else if (/design|poster|thumbnail|creative/.test(value)) key = 'graphics'; else if (/ads|advertising|leads|sales|paid/.test(value)) key = 'ads'; else if (/promot|product|launch/.test(value)) key = 'promotion'
    const service = findService(services, key); const title = service?.title || fallbackServices.find((item) => normalize(item).includes(key)) || 'Social Media Management'
    setProfile((current) => ({ ...current, goal, recommendedService: title })); pushBot(`For “${goal || 'your goal'}”, I’d start with ${title}. ${serviceDescription(title)}`, [['See related work', `service:${title}`], ['Get a quote', 'contact']])
  }
  const respond = (intent, raw = '') => {
    if (intent === 'greeting') return pushBot('Hello! I can recommend a service, explain pricing, show work, explain our process, or collect your project requirements.', quickReplies)
    if (intent === 'services') return showServices()
    if (intent === 'portfolio') return pushBot(`Our portfolio currently contains ${projectCount ?? 'published'} project${projectCount === 1 ? '' : 's'}. You can browse by service.`, [['Open portfolio', 'portfolio-link'], ['Start a project', 'contact']])
    if (intent === 'pricing') return pushBot('Pricing depends on service, scope, deliverables, complexity and timeline. I can collect your requirements and send a proper enquiry.', [['Get a quote', 'contact'], ['See services', 'services']])
    if (intent === 'process') return pushBot('Our usual flow is Discuss → Plan → Create → Review → Publish → Grow. Your timeline depends on the project scope.', [['Choose a service', 'services'], ['Start a project', 'contact']])
    if (intent === 'recommend') return recommend(raw)
    if (['growth', 'brand'].includes(intent)) return recommend(intent === 'growth' ? 'more customers and leads' : 'stronger branding')
    if (aliases[intent]) { const service = findService(services, intent); const title = service?.title || intent; setProfile((current) => ({ ...current, lastService: title })); return pushBot(`${title}: ${serviceDescription(title)}`, [['See related work', `service:${title}`], ['Get a quote', 'contact']]) }
    if (intent === 'contact') { setFormService(profile.recommendedService || profile.lastService || ''); return setShowProjectForm(true) }
    return pushBot('I can help with services, recommendations, portfolio, pricing, process and project enquiries. Try “I need more customers from Instagram” or “I need a website”.', quickReplies)
  }
  const handleAction = (key, label) => {
    setMessages((current) => [...current, { id: `${Date.now()}-user`, type: 'user', text: label }])
    if (key === 'contact') return respond('contact')
    if (key === 'portfolio-link' || key.startsWith('service:')) { window.location.href = key === 'portfolio-link' ? '/work' : `/work?service=${encodeURIComponent(key.slice(8))}`; return }
    respond(key, label)
  }
  const submit = (event) => { event.preventDefault(); const value = input.trim(); if (!value || typing) return; setInput(''); const intent = getIntent(value); setMessages((current) => [...current, { id: `${Date.now()}-user`, type: 'user', text: value }]); respond(intent, value) }
  const clearChat = () => { localStorage.removeItem('gwm-chat-history'); localStorage.removeItem('gwm-chat-profile'); setProfile({}); setShowProjectForm(false); setMessages([{ id: Date.now(), type: 'bot', text: 'New conversation started. What are you trying to achieve?', actions: quickReplies }]) }

  return <div className="gwm-chatbot" aria-live="polite">
    {open ? <section className="gwm-chat-window" aria-label="Grow With Me chatbot">
      <header className="gwm-chat-header"><div className="gwm-chat-brand"><div className="gwm-chat-brand-icon"><Bot size={19} /></div><div><strong>Grow With Me</strong><span>Smart business assistant</span></div></div><div className="gwm-chat-header-actions"><button type="button" onClick={clearChat} aria-label="Start new chat"><RotateCcw size={15} /></button><button type="button" onClick={() => setOpen(false)} aria-label="Close chat"><X size={18} /></button></div></header>
      {showProjectForm ? <div className="gwm-chat-project-wrap"><ProjectForm services={services.map((item) => item.title)} initialService={formService} onCancel={() => setShowProjectForm(false)} /></div> : <>
        <div className="gwm-chat-context"><Sparkles size={13} /> {currentPage === 'portfolio' ? 'Portfolio mode · I can help you find relevant work.' : currentPage === 'project' ? 'Project mode · Ask about services or start your own project.' : profile.recommendedService ? `Recommended: ${profile.recommendedService}` : 'Tell me your goal and I’ll recommend a starting point.'}</div>
        <div className="gwm-chat-messages" ref={messagesRef}>{messages.map((message) => message.type === 'bot' ? <BotMessage key={message.id} text={message.text} actions={message.actions} onAction={handleAction} /> : <div className="gwm-chat-message gwm-chat-user-message" key={message.id}><div className="gwm-chat-bubble"><p>{message.text}</p></div></div>)}{typing ? <div className="gwm-chat-message gwm-chat-bot-message"><div className="gwm-chat-avatar"><Bot size={15} /></div><div className="gwm-chat-typing"><i /><i /><i /></div></div> : null}</div>
        <div className="gwm-chat-goals">{goals.map(([label, key]) => <button type="button" key={key} onClick={() => { setMessages((current) => [...current, { id: `${Date.now()}-user`, type: 'user', text: label }]); recommend(label) }}>{label}</button>)}</div>
        <div className="gwm-chat-suggestions">{quickReplies.map(([label, key]) => <button type="button" key={key} onClick={() => handleAction(key, label)}>{label}</button>)}</div>
        <form className="gwm-chat-input" onSubmit={submit}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Tell me your goal or ask a question..." aria-label="Type your question" maxLength={500} /><button type="submit" disabled={typing} aria-label="Send message"><Send size={17} /></button></form>
      </>}
      <div className="gwm-chat-footer"><Clock3 size={10} /> Manual smart assistant · No AI/API</div>
    </section> : null}
    <button type="button" className={`gwm-chat-launcher${open ? ' gwm-chat-launcher-open' : ''}`} onClick={() => setOpen((value) => !value)} aria-label={open ? 'Close chatbot' : 'Open Grow With Me chatbot'} aria-expanded={open}>{open ? <X size={23} /> : <MessageCircle size={23} />}{!open && <span>Chat with us</span>}</button>
  </div>
}
