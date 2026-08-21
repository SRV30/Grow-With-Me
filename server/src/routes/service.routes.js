import { Router } from 'express'
import { listServices, createService, updateService, deleteService } from '../controllers/service.controller.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.get('/', listServices)
router.post('/', requireAuth, createService)
router.patch('/:id', requireAuth, updateService)
router.delete('/:id', requireAuth, deleteService)
export default router
