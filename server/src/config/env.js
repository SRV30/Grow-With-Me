import dotenv from 'dotenv'

dotenv.config()

const required = (...names) => {
  const value = names.map((name) => process.env[name]?.trim()).find(Boolean)
  if (!value && process.env.NODE_ENV === 'production') {
    throw new Error(`Missing required environment variable: ${names.join(' or ')}`)
  }
  return value
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5173',
  mongodbUri: required('MONGODB_URL', 'MONGODB_URI'),
  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRE || process.env.JWT_EXPIRES_IN || '7d',
  cookieExpire: Number(process.env.COOKIE_EXPIRE || 7),
  cloudinary: {
    cloudName: required('CLOUDINARY_NAME', 'CLOUDINARY_CLOUD_NAME'),
    apiKey: required('CLOUDINARY_API_KEY'),
    apiSecret: required('CLOUDINARY_API_SECRET'),
    folder: process.env.CLOUDINARY_FOLDER || 'Growwithme',
  },
}
