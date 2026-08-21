import 'dotenv/config'
import { v2 as cloudinary } from 'cloudinary'
import { env } from '../config/env.js'

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
  secure: true,
})

const buffer = Buffer.from('Grow With Me Cloudinary upload test')

try {
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `${env.cloudinary.folder}/diagnostics`,
        resource_type: 'raw',
        public_id: `connection-test-${Date.now()}`,
      },
      (error, uploadResult) => {
        if (error) reject(error)
        else resolve(uploadResult)
      },
    )

    stream.end(buffer)
  })

  console.log('[OK] Cloudinary upload works')
  console.log(`[OK] Public ID: ${result.public_id}`)
} catch (error) {
  console.error('[ERROR] Cloudinary upload failed')
  console.error(`[ERROR] HTTP: ${error.http_code || error.status || 'unknown'}`)
  console.error(`[ERROR] Message: ${error.message || 'unknown'}`)
  console.error(`[ERROR] Name: ${error.name || 'unknown'}`)
  console.error(`[ERROR] Request ID: ${error.request_id || 'unknown'}`)
  console.error('[ERROR] Full Cloudinary response:', error)
  process.exitCode = 1
}
