import { cloudinary } from '../config/cloudinary.js'
import { env } from '../config/env.js'

const getCloudinaryError = (error, fallbackMessage) => {
  const statusCode = error?.http_code || error?.status || 502
  const details = {
    httpCode: statusCode,
    name: error?.name,
    message: error?.message,
    requestId: error?.request_id || error?.requestId,
    cldError: error?.headers?.['x-cld-error'] || error?.headers?.['X-Cld-Error'],
  }

  const message = details.cldError || details.message || fallbackMessage
  const uploadError = new Error(message)
  uploadError.statusCode = statusCode
  uploadError.code = error?.code || statusCode
  uploadError.details = details

  return uploadError
}

export const uploadBuffer = (buffer, options = {}) =>
  new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: options.folder || env.cloudinary.folder,
      resource_type: options.resourceType || 'auto',
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    }

    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) {
        const uploadError = getCloudinaryError(error, 'Cloudinary upload failed')
        console.error('[Cloudinary] Upload failed:', uploadError.details)
        reject(uploadError)
        return
      }

      resolve(result)
    })

    stream.on('error', (error) => {
      const uploadError = getCloudinaryError(error, 'Cloudinary upload stream failed')
      console.error('[Cloudinary] Upload stream failed:', uploadError.details)
      reject(uploadError)
    })

    stream.end(buffer)
  })

export const destroyMedia = async (publicId, resourceType = 'image') => {
  try {
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    })
  } catch (error) {
    const destroyError = getCloudinaryError(error, 'Cloudinary delete failed')
    console.error('[Cloudinary] Delete failed:', destroyError.details)
    throw destroyError
  }
}
