import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(error, info) { console.error('Grow With Me UI error:', error, info) }
  render() {
    if (!this.state.hasError) return this.props.children
    return <main className="min-h-screen bg-[#f6f4ee] px-6 py-32 text-[#111]" role="alert"><div className="mx-auto max-w-2xl"><p className="eyebrow">Something went wrong</p><h1 className="display mt-5">We hit a<br />creative glitch.</h1><p className="mt-7 max-w-lg leading-7 text-[#68675f]">Please refresh the page and try again. Your enquiry or saved CMS content is not affected by this display error.</p><button type="button" className="dark-button mt-8" onClick={() => window.location.reload()}>Reload website</button></div></main>
  }
}
