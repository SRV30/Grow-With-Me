import axios from 'axios'
import { notify } from '../components/Notifications.jsx'

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

const mutationMethods = new Set(['post', 'put', 'patch', 'delete'])
api.interceptors.response.use((response) => {
  if (mutationMethods.has(response.config?.method?.toLowerCase())) {
    const method = response.config.method.toLowerCase()
    notify(method === 'delete' ? 'Deleted successfully.' : 'Changes saved successfully.', 'success')
  }
  return response
}, (error) => {
  const method = error.config?.method?.toLowerCase()
  if (mutationMethods.has(method)) notify(error.response?.data?.message || (error.response?.status === 401 ? 'Your session has expired. Please sign in again.' : 'Something went wrong. Please try again.'), 'error', 5000)
  return Promise.reject(error)
})

export const getProjects = async (params = {}) => { const { data } = await api.get('/projects', { params }); return data.data }
export const getProject = async (slug) => { const { data } = await api.get(`/projects/${slug}`); return data.data }
export const getHomepage = async () => { const { data } = await api.get('/homepage'); return data.data }
export const getServices = async () => { const { data } = await api.get('/services'); return data.data }
export const getTestimonials = async () => { const { data } = await api.get('/testimonials'); return data.data }
export const submitEnquiry = async (payload) => { const { data } = await api.post('/enquiries', payload); return data.data }
export const getHealth = async () => { const { data } = await api.get('/health'); return data }
