import { api } from '../services/api.js'

export const loginAdmin = async (payload) => {
  const { data } = await api.post('/auth/login', payload)
  return data.data
}

export const logoutAdmin = async () => {
  const { data } = await api.post('/auth/logout')
  return data
}

export const getCurrentAdmin = async () => {
  const { data } = await api.get('/auth/me')
  return data.data
}

export const getAdminProjects = async (params = {}) => {
  const { data } = await api.get('/admin/projects', { params })
  return data.data
}

export const getAdminProject = async (id) => {
  const { data } = await api.get(`/admin/projects/${id}`)
  return data.data
}

export const createAdminProject = async (payload) => {
  const { data } = await api.post('/admin/projects', payload)
  return data.data
}

export const updateAdminProject = async (id, payload) => {
  const { data } = await api.patch(`/admin/projects/${id}`, payload)
  return data.data
}

export const deleteAdminProject = async (id) => {
  const { data } = await api.delete(`/admin/projects/${id}`)
  return data
}

export const updateProjectFlags = async (id, payload) => {
  const { data } = await api.patch(`/admin/projects/${id}/flags`, payload)
  return data.data
}
