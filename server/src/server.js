import 'dotenv/config'
import app from './app.js'
import { connectDatabase } from './config/db.js'
import { cloudinary } from './config/cloudinary.js'

const PORT = process.env.PORT || 5000

const logSuccess = (message) => console.log(`\x1b[32m[OK]\x1b[0m ${message}`)
const logInfo = (message) => console.log(`\x1b[36m[INFO]\x1b[0m ${message}`)
const logError = (message) => console.error(`\x1b[31m[ERROR]\x1b[0m ${message}`)

const verifyCloudinary = async () => {
  await cloudinary.api.ping()
}

const startServer = async () => {
  try {
    logInfo('Connecting to MongoDB...')
    await connectDatabase()
    logSuccess('MongoDB connected')

    logInfo('Connecting to Cloudinary...')
    await verifyCloudinary()
    logSuccess('Cloudinary connected')

    app.listen(PORT, () => {
      logSuccess(`Grow With Me API running on port ${PORT}`)
    })
  } catch (error) {
    logError(`Server startup failed: ${error.message}`)
    process.exit(1)
  }
}

startServer()
