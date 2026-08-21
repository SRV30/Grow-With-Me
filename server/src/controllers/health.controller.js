import { connectDatabase } from '../config/db.js'
import { cloudinary } from '../config/cloudinary.js'

export const health = async (_req, res, next) => {
  try {
    const db = await connectDatabase()
    const cloudinaryCheck = await cloudinary.api.ping()

    res.json({
      success: true,
      service: 'grow-with-me-api',
      status: 'ok',
      database: db.readyState === 1 ? 'connected' : 'disconnected',
      cloudinary: cloudinaryCheck.status === 'ok' ? 'connected' : 'error',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    next(error)
  }
}
