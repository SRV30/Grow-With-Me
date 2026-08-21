import { Router } from 'express'
import { login, logout, me } from '../controllers/auth.controller.js'
import { requireAuth } from '../middleware/auth.js'
import { loginRateLimit } from '../middleware/rateLimits.js'

const router = Router()

router.post('/login', loginRateLimit, login)
router.post('/logout', logout)
router.get('/me', requireAuth, me)

export default router
