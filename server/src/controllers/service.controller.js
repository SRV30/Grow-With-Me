import { Service } from '../models/Service.js'

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export const listServices = async (req, res, next) => {
  try {
    const filter = {}
    if (!req.user) filter.active = true
    const services = await Service.find(filter).sort({ order: 1, createdAt: -1 }).lean()
    res.json({ success: true, data: services })
  } catch (e) {
    next(e)
  }
}
export const createService = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      slug: req.body.slug ? slugify(req.body.slug) : slugify(req.body.title),
    }
    const service = await Service.create(data)
    res.status(201).json({ success: true, data: service })
  } catch (e) {
    next(e)
  }
}
export const updateService = async (req, res, next) => {
  try {
    const data = { ...req.body }
    if (data.slug) data.slug = slugify(data.slug)
    const service = await Service.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    })
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' })
    res.json({ success: true, data: service })
  } catch (e) {
    next(e)
  }
}
export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id)
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' })
    res.json({ success: true })
  } catch (e) {
    next(e)
  }
}
