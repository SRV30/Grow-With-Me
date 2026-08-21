import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AdminApp from './admin/AdminApp.jsx'
import './styles/index.css'
import './admin/admin.css'

const isAdminRoute = window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isAdminRoute ? <AdminApp /> : <App />}
  </React.StrictMode>,
)
