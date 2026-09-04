import { z } from 'zod'
import { User } from '../models/User.js'
import { env } from '../config/env.js'

const createUserSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email().max(160),
})

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8).max(128),
    newPassword: z.string().min(8).max(128),
    confirmPassword: z.string().min(8).max(128),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New passwords do not match',
    path: ['confirmPassword'],
  })

const deleteUserSchema = z.object({
  userId: z.string().min(1),
})

export const createAdminUser = async (req, res, next) => {
  try {
    const { name, email } = createUserSchema.parse(req.body)
    const existing = await User.findOne({ email })
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: 'A user with this email already exists' })
    }

    if (!env.defaultUserPassword) {
      return res
        .status(500)
        .json({ success: false, message: 'Default user password is not configured' })
    }

    const user = await User.create({
      name,
      email,
      password: env.defaultUserPassword,
      role: 'admin',
      active: true,
    })

    res.status(201).json({
      success: true,
      data: { id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (error) {
    next(error)
  }
}

export const listAdminUsers = async (_req, res, next) => {
  try {
    const users = await User.find({ role: 'admin' })
      .select('name email role active lastLoginAt createdAt')
      .sort({ createdAt: -1 })
      .lean()

    res.json({ success: true, data: users })
  } catch (error) {
    next(error)
  }
}

export const deleteAdminUser = async (req, res, next) => {
  try {
    const { userId } = deleteUserSchema.parse(req.params)

    if (userId === req.user._id.toString()) {
      return res
        .status(400)
        .json({ success: false, message: 'You cannot delete your own admin account' })
    }

    const user = await User.findOneAndDelete({ _id: userId, role: 'admin' })
    if (!user) {
      return res.status(404).json({ success: false, message: 'Admin user not found' })
    }

    res.json({ success: true, message: 'Admin user deleted successfully' })
  } catch (error) {
    next(error)
  }
}

export const changeAdminPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body)
    const user = await User.findById(req.user._id).select('+password')
    if (!user || !user.active) {
      return res.status(401).json({ success: false, message: 'User account not found' })
    }

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' })
    }

    user.password = newPassword
    await user.save()

    res.json({ success: true, message: 'Password changed successfully' })
  } catch (error) {
    next(error)
  }
}
