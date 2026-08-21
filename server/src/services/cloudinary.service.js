import { cloudinary } from '../config/cloudinary.js'
import { env } from '../config/env.js'

export const uploadBuffer = (buffer, options = {}) => new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream(
    {
      folder: options.folder || env.cloudinary.folder,
      resource_type: options.resourceType || 'auto',
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    },
    (error, result) => (error ? reject(error) : resolve(result)),
  )

  stream.end(buffer)
})

export const destroyMedia = async (publicId, resourceType = 'image') => {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
}
