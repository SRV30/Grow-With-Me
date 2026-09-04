import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { User } from '../models/User.js'
import { connectDatabase } from '../config/db.js'
import { env } from '../config/env.js'

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(160),
  password: z.string().min(8).max(128),
})

const cookieOptions = () => ({
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: env.nodeEnv === 'production' ? 'none' : 'lax',
  maxAge: env.cookieExpire * 24 * 60 * 60 * 1000,
  path: '/',
})

const signToken = (user) =>
  jwt.sign({ sub: user._id.toString(), role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  })

export const login = async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body)
    await connectDatabase()

    const user = await User.findOne({ email, active: true }).select('+password')
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    user.lastLoginAt = new Date()
    await user.save()

    res.cookie('gwm_token', signToken(user), cookieOptions())
    res.json({
      success: true,
      data: { id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (error) {
    next(error)
  }
}

export const logout = (_req, res) => {
  res.clearCookie('gwm_token', cookieOptions())
  res.json({ success: true })
}

export const me = (req, res) => {
  res.json({
    success: true,
    data: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role },
  })
}
