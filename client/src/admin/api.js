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

export const createAdminUser = async (payload) => {
  const { data } = await api.post('/auth/users', payload)
  return data.data
}

export const changeAdminPassword = async (payload) => {
  const { data } = await api.patch('/auth/password', payload)
  return data
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

const uploadDirectToCloudinary = async (file, options = {}) => {
  const resourceType = file.type.startsWith('video/') ? 'video' : 'image'
  const { folder, alt = '', tags = [] } = options

  const { data: signatureResponse } = await api.post('/admin/media/signature', {
    folder,
    resourceType,
  })
  const signature = signatureResponse.data

  const body = new FormData()
  body.append('file', file)
  body.append('api_key', signature.apiKey)
  body.append('timestamp', String(signature.timestamp))
  body.append('signature', signature.signature)
  body.append('folder', signature.folder)

  const endpoint = `https://api.cloudinary.com/v1_1/${signature.cloudName}/${resourceType}/upload`
  const response = await fetch(endpoint, {
    method: 'POST',
    body,
  })

  const result = await response.json()
  if (!response.ok) {
    throw new Error(result?.error?.message || 'Cloudinary upload failed')
  }

  const { data } = await api.post('/admin/media/complete', {
    ...result,
    original_filename: file.name,
    alt,
    tags: tags.join(','),
  })

  return data.data
}

export const uploadMedia = async (files, options = {}) => {
  const uploaded = []
  for (const file of files) {
    uploaded.push(await uploadDirectToCloudinary(file, options))
  }
  return uploaded
}

export const deleteMedia = async (id) => {
  const { data } = await api.delete(`/admin/media/${id}`)
  return data
}
