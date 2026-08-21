import { Router } from 'express'
import { getHomepage, updateHomepage } from '../controllers/homepage.controller.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.get('/', getHomepage)
router.patch('/', requireAuth, updateHomepage)
export default router
