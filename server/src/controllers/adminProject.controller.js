import { z } from 'zod'
import { Project } from '../models/Project.js'
import { connectDatabase } from '../config/db.js'

const imageSchema = z.object({ url: z.string().url(), publicId: z.string().optional().default(''), alt: z.string().max(200).optional().default('') })
const videoSchema = z.object({ url: z.string().url(), publicId: z.string().optional().default(''), thumbnail: z.string().url().optional().or(z.literal('')).default('') })

const projectSchema = z.object({
  title: z.string().min(2).max(160),
  slug: z.string().min(2).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().max(5000).optional().default(''),
  client: z.string().max(160).optional().default(''),
  category: z.enum(['social-media', 'posters', 'reels', 'advertisements', 'branding', 'websites', 'other']).default('social-media'),
  year: z.coerce.number().int().min(2000).max(2100).optional(),
  coverImage: imageSchema.nullable().optional().default(null),
  gallery: z.array(imageSchema).max(50).optional().default([]),
  videos: z.array(videoSchema).max(20).optional().default([]),
  services: z.array(z.string().trim().min(1).max(100)).max(20).optional().default([]),
  featured: z.boolean().optional().default(false),
  published: z.boolean().optional().default(false),
  order: z.coerce.number().int().min(0).optional().default(0),
  seo: z.object({ title: z.string().max(160).optional(), description: z.string().max(320).optional() }).optional().default({}),
})

export const listAdminProjects = async (req, res, next) => {
  try {
    await connectDatabase()
    const filter = {}
    if (req.query.published === 'true') filter.published = true
    if (req.query.published === 'false') filter.published = false
    if (req.query.featured === 'true') filter.featured = true
    const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 }).lean()
    res.json({ success: true, data: projects })
  } catch (error) { next(error) }
}

export const getAdminProject = async (req, res, next) => {
  try {
    await connectDatabase()
    const project = await Project.findById(req.params.id).lean()
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' })
    res.json({ success: true, data: project })
  } catch (error) { next(error) }
}

const saveProject = async (req, res, next, id = null) => {
  try {
    await connectDatabase()
    const payload = projectSchema.parse(req.body)
    const query = id ? { _id: id } : null
    const project = id
      ? await Project.findOneAndUpdate(query, payload, { new: true, runValidators: true })
      : await Project.create(payload)
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' })
    res.status(id ? 200 : 201).json({ success: true, data: project })
  } catch (error) { next(error) }
}

export const createProject = (req, res, next) => saveProject(req, res, next)
export const updateProject = (req, res, next) => saveProject(req, res, next, req.params.id)

export const deleteProject = async (req, res, next) => {
  try {
    await connectDatabase()
    const project = await Project.findByIdAndDelete(req.params.id)
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' })
    res.json({ success: true, message: 'Project deleted' })
  } catch (error) { next(error) }
}

export const setProjectFlags = async (req, res, next) => {
  try {
    await connectDatabase()
    const schema = z.object({ featured: z.boolean().optional(), published: z.boolean().optional() }).refine(v => Object.keys(v).length > 0)
    const payload = schema.parse(req.body)
    const project = await Project.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true })
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' })
    res.json({ success: true, data: project })
  } catch (error) { next(error) }
}

export const reorderProjects = async (req, res, next) => {
  try {
    await connectDatabase()
    const schema = z.object({ items: z.array(z.object({ id: z.string(), order: z.number().int().min(0) })).min(1).max(200) })
    const { items } = schema.parse(req.body)
    await Project.bulkWrite(items.map(({ id, order }) => ({ updateOne: { filter: { _id: id }, update: { $set: { order } } } })))
    res.json({ success: true })
  } catch (error) { next(error) }
}
