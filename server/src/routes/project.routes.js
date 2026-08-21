import { Router } from 'express'
import { Project } from '../models/Project.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const filter = { published: true }
    if (req.query.category) filter.category = req.query.category
    if (req.query.featured === 'true') filter.featured = true

    const projects = await Project.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .lean()

    res.json({ success: true, data: projects })
  } catch (error) {
    next(error)
  }
})

router.get('/:slug', async (req, res, next) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug, published: true }).lean()
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' })
    res.json({ success: true, data: project })
  } catch (error) {
    next(error)
  }
})

export default router
