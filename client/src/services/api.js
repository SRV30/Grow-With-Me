import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

export const getProjects = async (params = {}) => {
  const { data } = await api.get('/projects', { params })
  return data.data
}

export const getProject = async (slug) => {
  const { data } = await api.get(`/projects/${slug}`)
  return data.data
}

export const getHomepage = async () => {
  const { data } = await api.get('/homepage')
  return data.data
}

export const getServices = async () => {
  const { data } = await api.get('/services')
  return data.data
}

export const submitEnquiry = async (payload) => {
  const { data } = await api.post('/enquiries', payload)
  return data.data
}

export const getHealth = async () => {
  const { data } = await api.get('/health')
  return data
}
