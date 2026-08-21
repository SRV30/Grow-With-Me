import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import WorkPage from './pages/WorkPage.jsx'
import ProjectPage from './pages/ProjectPage.jsx'
import AdminApp from './admin/AdminApp.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import ScrollChoreography from './components/ScrollChoreography.jsx'
import PageTransition from './components/PageTransition.jsx'
import Hero3D from './components/Hero3D.jsx'
import HeaderEnhancer from './components/HeaderEnhancer.jsx'
import './styles/index.css'
import './styles/accessibility.css'
import './styles/responsive.css'
import './styles/contact.css'
import './styles/figma-overrides.css'
import './admin/admin.css'

const isAdminRoute =
  window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/')

function PublicApp() {
  return (
    <BrowserRouter>
      <PageTransition />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/work/:slug" element={<ProjectPage />} />
      </Routes>
      <Hero3D />
      <HeaderEnhancer />
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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
