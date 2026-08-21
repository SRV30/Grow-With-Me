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

export const getMedia = async (params = {}) => {
  const { data } = await api.get('/admin/media', { params })
  return data.data
}

export const uploadMedia = async (files, { folder, alt = '', tags = [] } = {}) => {
  const formData = new FormData()
  files.forEach((file) => formData.append('files', file))
  if (folder) formData.append('folder', folder)
  if (alt) formData.append('alt', alt)
  if (tags.length) formData.append('tags', tags.join(','))

  const { data } = await api.post('/admin/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.data
}

export const deleteMedia = async (id) => {
  const { data } = await api.delete(`/admin/media/${id}`)
  return data
}
