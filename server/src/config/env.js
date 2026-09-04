import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Load the backend .env first. This makes `cd server && npm run dev`
// work reliably, while the root .env remains supported for workspace usage.
const currentDir = path.dirname(fileURLToPath(import.meta.url))
const serverRoot = path.resolve(currentDir, '../..')
const projectRoot = path.resolve(serverRoot, '..')

dotenv.config({ path: path.join(serverRoot, '.env') })
dotenv.config({ path: path.join(projectRoot, '.env'), override: false })

const required = (...names) => {
  const value = names.map((name) => process.env[name]?.trim()).find(Boolean)
  if (!value && process.env.NODE_ENV === 'production') {
    throw new Error(`Missing required environment variable: ${names.join(' or ')}`)
  }
  return value
}

const normalizeOrigin = (value) => value?.trim().replace(/\/+$/, '')

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  clientUrl: normalizeOrigin(
    process.env.FRONTEND_URL || process.env.CLIENT_URL || 'http://localhost:5173',
  ),
  frontendWwwUrl: normalizeOrigin(process.env.FRONTEND_WWW_URL),
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

if (env.nodeEnv !== 'production' && !env.mongodbUri) {
  console.warn('[WARN] MongoDB URL is not configured. Add MONGODB_URL to server/.env')
}
