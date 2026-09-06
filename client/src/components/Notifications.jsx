import { useEffect, useState } from 'react'
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react'
import '../styles/notifications.css'

let nextId = 1
const listeners = new Set()

export function notify(message, type = 'success', duration = 3500) {
  const item = { id: nextId++, message, type, duration }
  listeners.forEach((listener) => listener(item))
  return item.id
}

export default function Notifications() {
  const [items, setItems] = useState([])

  useEffect(() => {
    const listener = (item) => {
      setItems((current) => [...current, item])
      window.setTimeout(() => {
        setItems((current) => current.filter((entry) => entry.id !== item.id))
      }, item.duration)
    }
    listeners.add(listener)
    return () => listeners.delete(listener)
  }, [])

  const dismiss = (id) => setItems((current) => current.filter((item) => item.id !== id))

  return (
    <div className="gwm-notifications" aria-live="polite" aria-atomic="false">
      {items.map((item) => {
        const Icon = item.type === 'error' ? TriangleAlert : item.type === 'info' ? Info : CheckCircle2
        return (
          <div className={`gwm-notification gwm-notification-${item.type}`} key={item.id} role={item.type === 'error' ? 'alert' : 'status'}>
            <Icon size={18} aria-hidden="true" />
            <span>{item.message}</span>
            <button type="button" onClick={() => dismiss(item.id)} aria-label="Dismiss notification">
              <X size={16} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
