import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { User } from '../models/User.js'

export const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.gwm_token
    if (!token) return res.status(401).json({ success: false, message: 'Authentication required' })

    const payload = jwt.verify(token, env.jwtSecret)
    const user = await User.findById(payload.sub).lean()
    if (!user || !user.active || user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Invalid authentication' })
    }

    req.user = user
    next()
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired session' })
  }
}
