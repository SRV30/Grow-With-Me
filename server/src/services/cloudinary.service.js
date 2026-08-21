import { cloudinary } from '../config/cloudinary.js'
import { env } from '../config/env.js'

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
        const uploadError = new Error(error.message || 'Cloudinary upload failed')
        uploadError.statusCode = error.http_code || error.status || 502
        uploadError.code = error.http_code || error.code || 'CLOUDINARY_UPLOAD_ERROR'
        uploadError.details = {
          httpCode: error.http_code,
          name: error.name,
          message: error.message,
        }
        reject(uploadError)
        return
      }

      resolve(result)
    })

    stream.on('error', reject)
    stream.end(buffer)
  })

export const destroyMedia = async (publicId, resourceType = 'image') => {
  try {
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    })
  } catch (error) {
    const destroyError = new Error(error.message || 'Cloudinary delete failed')
    destroyError.statusCode = error.http_code || error.status || 502
    destroyError.code = error.http_code || error.code || 'CLOUDINARY_DELETE_ERROR'
    throw destroyError
  }
}
