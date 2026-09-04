import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { changeAdminPassword, createAdminUser } from '../controllers/adminUser.controller.js'

const router = Router()
router.use(requireAuth)
router.post('/', createAdminUser)
router.patch('/password', changeAdminPassword)

export default router
