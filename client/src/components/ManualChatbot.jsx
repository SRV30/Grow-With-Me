import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Bot,
  ChevronRight,
  CircleHelp,
  Clock3,
  MessageCircle,
  RotateCcw,
  Send,
  Sparkles,
  X,
} from 'lucide-react'
import { getServices, submitEnquiry } from '../services/api.js'

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

const quickReplies = [
  ['Our Services', 'services'],
  ['Portfolio', 'portfolio'],
  ['Pricing', 'pricing'],
  ['Start a Project', 'contact'],
]

const slugify = (value = '') =>
  value
    .toLowerCase()
    .replaceAll('&', 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const normalize = (value = '') => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()

const serviceAliases = {
  social: ['social media management', 'social media', 'instagram', 'facebook'],
  reels: ['reels', 'reel', 'video editing', 'video', 'editing'],
  graphics: ['graphic design', 'graphic designing', 'graphics', 'designing', 'poster', 'creative'],
  ads: ['advertising', 'ads', 'paid ads', 'social media advertising', 'campaign'],
  promotion: ['business promotion', 'promotion', 'promote my business'],
  website: ['website', 'web design', 'web development', 'web site'],
}

function getIntent(input) {
  const value = normalize(input)
  if (!value) return null
  if (/^(hi|hello|hey|namaste|good morning|good afternoon|good evening)/.test(value)) return 'greeting'
  if (/service|services|what do you do|offer|provide/.test(value)) return 'services'
  if (/portfolio|work|project example|examples|case stud/.test(value)) return 'portfolio'
  if (/price|pricing|cost|budget|rate|charge|how much/.test(value)) return 'pricing'
  if (/contact|hire|start|book|quote|quotation|requirement|need help/.test(value)) return 'contact'
  if (serviceAliases.website.some((item) => value.includes(item))) return 'website'
  if (serviceAliases.social.some((item) => value.includes(item))) return 'social'
  if (serviceAliases.reels.some((item) => value.includes(item))) return 'reels'
  if (serviceAliases.graphics.some((item) => value.includes(item))) return 'graphics'
  if (serviceAliases.ads.some((item) => value.includes(item))) return 'ads'
  if (serviceAliases.promotion.some((item) => value.includes(item))) return 'promotion'
  if (/faq|question|how does it work|process|timeline|time/.test(value)) return 'faq'
  return 'fallback'
}

const responseFor = (key) => {
  const responses = {
    greeting: {
      text: 'Hi! I can help you choose a service, explore our work, understand pricing, or start a project right here.',
      actions: quickReplies,
    },
    portfolio: {
      text: 'Explore selected projects, then open any project for its full case details, images and videos.',
      actions: [['Open Portfolio', 'portfolio-link'], ['Start a Project', 'contact']],
    },
    pricing: {
      text: 'We do not use one fixed price for every project. Cost depends on the service, scope, content, timeline and requirements. I can collect your details and send an enquiry now.',
      actions: [['Get a Quote', 'contact'], ['See Services', 'services']],
    },
    website: {
      text: 'Website Design includes a modern, responsive and professional website for your business or brand.',
      actions: [['See Website Work', 'service-link:Website Design'], ['Start a Project', 'contact']],
    },
    social: {
      text: 'Social Media Management focuses on content planning, posting, captions, audience engagement and a consistent brand presence.',
      actions: [['See Social Work', 'service-link:Social Media Management'], ['Start a Project', 'contact']],
    },
    reels: {
      text: 'Reels & Video Editing covers short-form videos, clean cuts, transitions, subtitles and attention-grabbing presentation.',
      actions: [['See Reels Work', 'service-link:Reels & Video Editing'], ['Start a Project', 'contact']],
    },
    graphics: {
      text: 'Graphic Designing covers posters, promotional creatives, social posts, offers, thumbnails and campaign visuals.',
      actions: [['See Design Work', 'service-link:Graphic Designing'], ['Start a Project', 'contact']],
    },
    ads: {
      text: 'Social Media Advertising helps put your business in front of the right audience through targeted campaigns.',
      actions: [['Start a Project', 'contact'], ['View Portfolio', 'portfolio-link']],
    },
    promotion: {
      text: 'Business Promotion focuses on creative promotional content that helps products and services get noticed.',
      actions: [['Start a Project', 'contact'], ['View Portfolio', 'portfolio-link']],
    },
    faq: {
      text: 'Typical flow: Discuss → Plan → Create → Review → Publish → Grow. You can also tell me your service and I will guide you from there.',
      actions: [['Start a Project', 'contact'], ['Our Services', 'services']],
    },
    fallback: {
      text: 'I can help with services, portfolio, pricing, project enquiries, website design, social media, reels, graphics, advertising and promotion. What would you like to do?',
      actions: quickReplies,
    },
  }
  return responses[key] || responses.fallback
}

function BotMessage({ text, actions, onAction }) {
  return (
    <div className="gwm-chat-message gwm-chat-bot-message">
      <div className="gwm-chat-avatar"><Bot size={15} /></div>
      <div className="gwm-chat-bubble">
        <p>{text}</p>
        {actions?.length ? (
          <div className="gwm-chat-actions">
            {actions.map(([label, key]) => (
              <button type="button" key={`${label}-${key}`} onClick={() => onAction(key, label)}>
                {label}<ChevronRight size={13} />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

function ProjectForm({ services, onCancel, onSuccess }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', service: '', budget: '', message: '' })
  const [timeline, setTimeline] = useState('')
  const [state, setState] = useState('idle')
  const [error, setError] = useState('')

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const submit = async (event) => {
    event.preventDefault()
    setState('loading')
    setError('')
    try {
      await submitEnquiry({ ...form, message: `${form.message}\n\nPreferred timeline: ${timeline || 'Not specified'}` })
      setState('success')
      onSuccess()
    } catch (requestError) {
      setState('error')
      setError(requestError.response?.data?.message || 'Could not send the enquiry. Please try again.')
    }
  }

  if (state === 'success') {
    return (
      <div className="gwm-chat-project-success">
        <Sparkles size={25} />
        <strong>Enquiry sent!</strong>
        <p>Thanks. Your project details are with us. We will get back to you soon.</p>
        <button type="button" onClick={onCancel}>Back to chat</button>
      </div>
    )
  }

  return (
    <form className="gwm-chat-project-form" onSubmit={submit}>
      <div className="gwm-chat-form-heading">
        <div><strong>Start your project</strong><span>Tell us a little about it.</span></div>
        <button type="button" onClick={onCancel} aria-label="Back to chat"><X size={16} /></button>
      </div>
      <input required placeholder="Your name *" value={form.name} onChange={(e) => update('name', e.target.value)} />
      <input required type="email" placeholder="Email *" value={form.email} onChange={(e) => update('email', e.target.value)} />
      <div className="gwm-chat-form-row">
        <input type="tel" placeholder="Phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
        <input placeholder="Company" value={form.company} onChange={(e) => update('company', e.target.value)} />
      </div>
      <select value={form.service} onChange={(e) => update('service', e.target.value)}>
        <option value="">Select service</option>
        {services.map((service) => <option key={service} value={service}>{service}</option>)}
      </select>
      <div className="gwm-chat-form-row">
        <select value={form.budget} onChange={(e) => update('budget', e.target.value)}>
          <option value="">Budget</option>
          {budgets.map((budget) => <option key={budget}>{budget}</option>)}
        </select>
        <select value={timeline} onChange={(e) => setTimeline(e.target.value)}>
          <option value="">Timeline</option>
          {timelines.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      <textarea required rows="4" placeholder="Tell us about your project *" value={form.message} onChange={(e) => update('message', e.target.value)} />
      {state === 'error' ? <p className="gwm-chat-form-error">{error}</p> : null}
      <button className="gwm-chat-submit" type="submit" disabled={state === 'loading'}>
        {state === 'loading' ? 'Sending…' : 'Send enquiry'} <Send size={15} />
      </button>
    </form>
  )
}

export default function ManualChatbot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [services, setServices] = useState(fallbackServices)
  const [messages, setMessages] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('gwm-chat-history'))
      return Array.isArray(saved) && saved.length ? saved : [{ id: 1, type: 'bot', text: 'Hi! I’m the Grow With Me assistant. What can I help you with?', actions: quickReplies }]
    } catch {
      return [{ id: 1, type: 'bot', text: 'Hi! I’m the Grow With Me assistant. What can I help you with?', actions: quickReplies }]
    }
  })
  const messagesRef = useRef(null)

  useEffect(() => {
    getServices().then((data) => {
      if (Array.isArray(data) && data.length) setServices(data.map((item) => item.title).filter(Boolean))
    }).catch(() => {})
  }, [])

  useEffect(() => {
    localStorage.setItem('gwm-chat-history', JSON.stringify(messages.slice(-40)))
    if (open && messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight
  }, [messages, open, typing])

  const currentPage = useMemo(() => {
    const path = window.location.pathname
    if (path === '/work') return 'portfolio'
    if (path.startsWith('/work/')) return 'project'
    if (path.includes('admin')) return 'admin'
    return 'home'
  }, [])

  const addBot = (key) => {
    const response = responseFor(key)
    setTyping(true)
    window.setTimeout(() => {
      setTyping(false)
      setMessages((current) => [...current, { id: `${Date.now()}-bot`, type: 'bot', text: response.text, actions: response.actions }])
    }, 420)
  }

  const navigate = (key) => {
    if (key === 'portfolio-link') window.location.href = '/work'
    else if (key.startsWith('service-link:')) window.location.href = `/work?service=${encodeURIComponent(key.split(':')[1])}`
    else if (key === 'contact-link') window.location.href = '/#contact'
  }

  const handleAction = (key, label) => {
    if (key === 'contact') {
      setMessages((current) => [...current, { id: `${Date.now()}-user`, type: 'user', text: label }])
      setShowProjectForm(true)
      return
    }
    if (key.endsWith('-link') || key.startsWith('service-link:')) {
      navigate(key)
      return
    }
    setMessages((current) => [...current, { id: `${Date.now()}-user`, type: 'user', text: label }])
    addBot(key)
  }

  const submit = (event) => {
    event.preventDefault()
    const value = input.trim()
    if (!value || typing) return
    setInput('')
    const intent = getIntent(value)
    setMessages((current) => [...current, { id: `${Date.now()}-user`, type: 'user', text: value }])
    if (intent === 'services') {
      addBot('services')
      return
    }
    addBot(intent || 'fallback')
  }

  const clearChat = () => {
    localStorage.removeItem('gwm-chat-history')
    setShowProjectForm(false)
    setMessages([{ id: Date.now(), type: 'bot', text: 'Chat cleared. Hi again! What would you like help with?', actions: quickReplies }])
  }

  return (
    <div className="gwm-chatbot" aria-live="polite">
      {open ? (
        <section className="gwm-chat-window" aria-label="Grow With Me chatbot">
          <header className="gwm-chat-header">
            <div className="gwm-chat-brand">
              <div className="gwm-chat-brand-icon"><Bot size={19} /></div>
              <div><strong>Grow With Me</strong><span>Website assistant · Online</span></div>
            </div>
            <div className="gwm-chat-header-actions">
              <button type="button" onClick={clearChat} aria-label="Clear chat"><RotateCcw size={15} /></button>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close chat"><X size={18} /></button>
            </div>
          </header>

          {showProjectForm ? (
            <div className="gwm-chat-project-wrap">
              <ProjectForm services={services} onCancel={() => setShowProjectForm(false)} onSuccess={() => {}} />
            </div>
          ) : (
            <>
              <div className="gwm-chat-context">
                {currentPage === 'portfolio' ? <Sparkles size={13} /> : <CircleHelp size={13} />}
                {currentPage === 'portfolio' ? 'You’re browsing our portfolio.' : 'Ask me anything about Grow With Me.'}
              </div>
              <div className="gwm-chat-messages" ref={messagesRef}>
                {messages.map((message) => message.type === 'bot' ? (
                  <BotMessage key={message.id} text={message.text} actions={message.actions} onAction={handleAction} />
                ) : (
                  <div className="gwm-chat-message gwm-chat-user-message" key={message.id}><div className="gwm-chat-bubble"><p>{message.text}</p></div></div>
                ))}
                {typing ? <div className="gwm-chat-message gwm-chat-bot-message"><div className="gwm-chat-avatar"><Bot size={15} /></div><div className="gwm-chat-typing"><i /><i /><i /></div></div> : null}
              </div>
              <div className="gwm-chat-suggestions">
                {quickReplies.slice(0, 3).map(([label, key]) => <button type="button" key={key} onClick={() => handleAction(key, label)}>{label}</button>)}
              </div>
              <form className="gwm-chat-input" onSubmit={submit}>
                <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about services, pricing..." aria-label="Type your question" maxLength={300} />
                <button type="submit" disabled={typing} aria-label="Send message"><Send size={17} /></button>
              </form>
            </>
          )}
          <div className="gwm-chat-footer"><Clock3 size={10} /> Manual assistant · No AI/API</div>
        </section>
      ) : null}

      <button type="button" className={`gwm-chat-launcher${open ? ' gwm-chat-launcher-open' : ''}`} onClick={() => setOpen((value) => !value)} aria-label={open ? 'Close chatbot' : 'Open Grow With Me chatbot'} aria-expanded={open}>
        {open ? <X size={23} /> : <MessageCircle size={23} />}
        {!open && <span>Chat with us</span>}
      </button>
    </div>
  )
}
