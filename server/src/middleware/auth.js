import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { User } from '../models/User.js'

const getToken = (req) => {
  if (req.cookies?.gwm_token) return req.cookies.gwm_token

  const authorization = req.headers.authorization
  if (authorization?.startsWith('Bearer ')) {
    return authorization.slice(7).trim()
  }

  return null
}

export const requireAuth = async (req, res, next) => {
  try {
    const token = getToken(req)
    if (!token || token === 'null') {
      return res.status(401).json({ success: false, message: 'Authentication required' })
    }

    const payload = jwt.verify(token, env.jwtSecret)
    const user = await User.findById(payload.sub).lean()

    if (!user || !user.active || user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Invalid authentication' })
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Invalid or expired session' })
    }

    next(error)
  }
}
