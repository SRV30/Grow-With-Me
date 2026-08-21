import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import ProjectPage from './pages/ProjectPage.jsx'
import AdminApp from './admin/AdminApp.jsx'
import './styles/index.css'
import './admin/admin.css'

const isAdminRoute = window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/')

function PublicApp() {
  return <BrowserRouter><Routes><Route path="/" element={<App />} /><Route path="/work/:slug" element={<ProjectPage />} /></Routes></BrowserRouter>
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isAdminRoute ? <AdminApp /> : <PublicApp />}
  </React.StrictMode>,
)
