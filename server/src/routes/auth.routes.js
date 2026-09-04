import { Router } from 'express'
import { login, logout, me } from '../controllers/auth.controller.js'
import { changeAdminPassword, createAdminUser } from '../controllers/adminUser.controller.js'
import { requireAuth } from '../middleware/auth.js'
import { loginRateLimit } from '../middleware/rateLimits.js'

const router = Router()

router.post('/login', loginRateLimit, login)
router.post('/logout', logout)
router.get('/me', requireAuth, me)
router.post('/users', requireAuth, createAdminUser)
router.patch('/password', requireAuth, changeAdminPassword)

export default router
