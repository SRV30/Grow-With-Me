import { useEffect, useMemo, useRef, useState } from 'react'
import { Bot, ChevronRight, MessageCircle, Send, X } from 'lucide-react'

const quickReplies = [
  { label: 'Our Services', key: 'services' },
  { label: 'View Portfolio', key: 'portfolio' },
  { label: 'Website Design', key: 'website' },
  { label: 'Social Media', key: 'social' },
  { label: 'Reels & Video', key: 'reels' },
  { label: 'Start a Project', key: 'contact' },
]

const responses = {
  services: {
    text: 'We help businesses grow online with social media management, reels & video editing, graphic designing, social media advertising, business promotion and website design.',
    actions: [
      ['Social Media', 'social'],
      ['Website Design', 'website'],
      ['Start a Project', 'contact'],
    ],
  },
  portfolio: {
    text: 'You can explore our work and open any project to see the complete details, images and videos.',
    actions: [['View Portfolio', 'portfolio-link']],
  },
  website: {
    text: 'We create modern, responsive and professional websites for businesses and brands. Tell us what you need and we can discuss the project.',
    actions: [
      ['Start a Project', 'contact'],
      ['View Portfolio', 'portfolio-link'],
    ],
  },
  social: {
    text: 'Our social media service covers content planning, posting, captions, audience engagement and a consistent brand presence.',
    actions: [
      ['See Social Work', 'social-link'],
      ['Start a Project', 'contact'],
    ],
  },
  reels: {
    text: 'We create short-form reels and videos with clean editing, transitions, subtitles and attention-grabbing presentation.',
    actions: [
      ['See Reels Work', 'reels-link'],
      ['Start a Project', 'contact'],
    ],
  },
  contact: {
    text: 'Great! You can use the Contact section on this website to share your requirements. We can discuss your business, goals, budget and timeline from there.',
    actions: [['Go to Contact', 'contact-link']],
  },
}

function getResponse(input) {
  const value = input.toLowerCase().trim()
  if (!value) return null
  if (/service|services|what do you do|offer|provide/.test(value)) return 'services'
  if (/portfolio|work|project|projects|example|examples/.test(value)) return 'portfolio'
  if (/website|web design|web development|site/.test(value)) return 'website'
  if (/social media|instagram|facebook|social/.test(value)) return 'social'
  if (/reel|video|editing|edit/.test(value)) return 'reels'
  if (/contact|start|hire|work with|book|requirement|need help/.test(value)) return 'contact'
  if (/price|pricing|cost|budget|rate|charge/.test(value)) {
    return 'pricing'
  }
  if (/hello|hi|hey|namaste/.test(value)) return 'greeting'
  return 'fallback'
}

function BotMessage({ text, actions, onAction }) {
  return (
    <div className="gwm-chat-message gwm-chat-bot-message">
      <div className="gwm-chat-avatar">
        <Bot size={15} />
      </div>
      <div className="gwm-chat-bubble">
        <p>{text}</p>
        {actions?.length ? (
          <div className="gwm-chat-actions">
            {actions.map(([label, key]) => (
              <button type="button" key={key} onClick={() => onAction(key)}>
                {label}
                <ChevronRight size={14} />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default function ManualChatbot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hi! Welcome to Grow With Me. How can I help you today?',
      actions: quickReplies.map(({ label, key }) => [label, key]),
    },
  ])
  const messagesRef = useRef(null)

  useEffect(() => {
    if (open && messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages, open])

  const availableQuickReplies = useMemo(() => quickReplies.slice(0, 4), [])

  const navigateAction = (key) => {
    const links = {
      'portfolio-link': '/work',
      'social-link': '/work?service=social-media-management',
      'reels-link': '/work?service=reels-video-editing',
      'contact-link': '/#contact',
    }
    if (links[key]) window.location.href = links[key]
  }

  const addBotResponse = (key) => {
    if (key === 'greeting') {
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          type: 'bot',
          text: 'Hello! What would you like to know about Grow With Me?',
          actions: quickReplies.slice(0, 5).map(({ label, key: actionKey }) => [label, actionKey]),
        },
      ])
      return
    }

    if (key === 'pricing') {
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          type: 'bot',
          text: 'Pricing depends on the service, scope and requirements. Share your project details through the Contact section and we can discuss the right option for you.',
          actions: [
            ['Go to Contact', 'contact-link'],
            ['Our Services', 'services'],
          ],
        },
      ])
      return
    }

    if (key === 'fallback') {
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          type: 'bot',
          text: 'I can help with our services, portfolio, website design, social media, reels/video editing, pricing and starting a project. Try one of these options:',
          actions: availableQuickReplies.map(({ label, key: actionKey }) => [label, actionKey]),
        },
      ])
      return
    }

    const response = responses[key]
    if (response) {
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          type: 'bot',
          text: response.text,
          actions: response.actions,
        },
      ])
    }
  }

  const handleAction = (key, label) => {
    if (key.endsWith('-link') || key === 'contact-link') {
      navigateAction(key)
      return
    }
    setMessages((current) => [...current, { id: Date.now(), type: 'user', text: label }])
    window.setTimeout(() => addBotResponse(key), 180)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const value = input.trim()
    if (!value) return
    setInput('')
    const key = getResponse(value)
    setMessages((current) => [...current, { id: Date.now(), type: 'user', text: value }])
    window.setTimeout(() => addBotResponse(key), 180)
  }

  return (
    <div className="gwm-chatbot" aria-live="polite">
      {open ? (
        <section className="gwm-chat-window" aria-label="Grow With Me chatbot">
          <header className="gwm-chat-header">
            <div className="gwm-chat-brand">
              <div className="gwm-chat-brand-icon">
                <Bot size={19} />
              </div>
              <div>
                <strong>Grow With Me</strong>
                <span>Manual assistant</span>
              </div>
            </div>
            <button
              type="button"
              className="gwm-chat-close"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <X size={19} />
            </button>
          </header>

          <div className="gwm-chat-messages" ref={messagesRef}>
            {messages.map((message) =>
              message.type === 'bot' ? (
                <BotMessage
                  key={message.id}
                  text={message.text}
                  actions={message.actions}
                  onAction={handleAction}
                />
              ) : (
                <div className="gwm-chat-message gwm-chat-user-message" key={message.id}>
                  <div className="gwm-chat-bubble">
                    <p>{message.text}</p>
                  </div>
                </div>
              ),
            )}
          </div>

          <form className="gwm-chat-input" onSubmit={handleSubmit}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type your question..."
              aria-label="Type your question"
              maxLength={300}
            />
            <button type="submit" aria-label="Send message">
              <Send size={17} />
            </button>
          </form>
          <div className="gwm-chat-footer">Manual replies • No AI/API</div>
        </section>
      ) : null}

      <button
        type="button"
        className={`gwm-chat-launcher${open ? ' gwm-chat-launcher-open' : ''}`}
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? 'Close chatbot' : 'Open Grow With Me chatbot'}
        aria-expanded={open}
      >
        {open ? <X size={23} /> : <MessageCircle size={23} />}
        {!open && <span>Chat with us</span>}
      </button>
    </div>
  )
}
