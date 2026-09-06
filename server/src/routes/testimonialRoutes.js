import express from 'express'
import {
  listTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonialController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.get('/', listTestimonials)
router.get('/:id', protect, getTestimonial)
router.post('/', protect, createTestimonial)
router.put('/:id', protect, updateTestimonial)
router.delete('/:id', protect, deleteTestimonial)

export default router
