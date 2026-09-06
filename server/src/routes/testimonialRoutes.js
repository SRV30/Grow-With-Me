import express from 'express'
import {
  listTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonialController.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/', listTestimonials)
router.get('/:id', requireAuth, getTestimonial)
router.post('/', requireAuth, createTestimonial)
router.put('/:id', requireAuth, updateTestimonial)
router.delete('/:id', requireAuth, deleteTestimonial)

export default router
