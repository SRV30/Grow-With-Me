import { lazy, Suspense, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import App from './App.jsx'
import WorkPage from './pages/WorkPage.jsx'
import ProjectPage from './pages/ProjectPage.jsx'
import AdminApp from './admin/AdminApp.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import ScrollChoreography from './components/ScrollChoreography.jsx'
import PageTransition from './components/PageTransition.jsx'
import PageMotion from './components/PageMotion.jsx'
import HeaderEnhancer from './components/HeaderEnhancer.jsx'
import './styles/index.css'
import './styles/accessibility.css'
import './styles/responsive.css'
import './styles/contact.css'
import './styles/figma-overrides.css'
import './styles/brand-theme.css'
import './styles/professional-type.css'
import './styles/senior-polish.css'
import './styles/row-layout.css'
import './styles/header-responsive.css'
import './styles/senior-motion.css'
import './styles/cup-animation.css'
import './admin/admin.css'

const Hero3D = lazy(() => import('./components/Hero3D.jsx'))

const isAdminRoute =
  window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/')

function DeferredHero3D() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const start = () => setReady(true)
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(start, { timeout: 1800 })
      return () => window.cancelIdleCallback(id)
    }

    const id = window.setTimeout(start, 1200)
    return () => window.clearTimeout(id)
  }, [])

  if (!ready) return null
  return (
    <Suspense fallback={null}>
      <Hero3D />
    </Suspense>
  )
}

function PublicShell() {
  const location = useLocation()
  const isWorkRoute = location.pathname === '/work'

  return (
    <>
      {!isWorkRoute && <PageTransition />}
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/work/:slug" element={<ProjectPage />} />
      </Routes>
      <PageMotion />
      <DeferredHero3D />
      <HeaderEnhancer />
    </>
  )
}

function PublicApp() {
  return (
    <BrowserRouter>
      <PublicShell />
    </BrowserRouter>
  )
}

function Root() {
  return (
    <ErrorBoundary>
      {isAdminRoute ? (
        <AdminApp />
      ) : (
        <>
          <PublicApp />
          <ScrollChoreography />
        </>
      )}
    </ErrorBoundary>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />)
