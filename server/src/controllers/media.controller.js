import { z } from 'zod'
import { Media } from '../models/Media.js'
import { uploadBuffer, destroyMedia } from '../services/cloudinary.service.js'
import { env } from '../config/env.js'

const uploadSchema = z.object({
  folder: z.string().trim().max(120).regex(/^[a-zA-Z0-9_\-/]+$/).optional(),
  alt: z.string().trim().max(255).optional(),
  tags: z.string().trim().max(500).optional(),
})

const resolveFolder = (requested) => {
  const base = env.cloudinary.folder
  const folder = requested || 'media'
  return `${base}/${folder}`
}

export const listMedia = async (req, res, next) => {
  try {
    const filter = {}
    if (req.query.type) filter.resourceType = req.query.type
    const limit = Math.min(Math.max(Number(req.query.limit) || 30, 1), 100)
    const skip = Math.max(Number(req.query.skip) || 0, 0)

    const [items, total] = await Promise.all([
      Media.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Media.countDocuments(filter),
    ])

    res.json({ success: true, data: { items, total, limit, skip } })
  } catch (error) {
    next(error)
  }
}

export const uploadMediaFiles = async (req, res, next) => {
  try {
    if (!req.files?.length) return res.status(400).json({ success: false, message: 'No media files supplied' })

    const { folder, alt, tags } = uploadSchema.parse(req.body)
    const tagList = tags ? tags.split(',').map((tag) => tag.trim()).filter(Boolean).slice(0, 20) : []

    const uploaded = await Promise.all(req.files.map(async (file) => {
      const result = await uploadBuffer(file.buffer, {
        folder: resolveFolder(folder),
        resourceType: file.mimetype.startsWith('video/') ? 'video' : 'image',
      })

      const media = await Media.create({
        publicId: result.public_id,
        url: result.url,
        secureUrl: result.secure_url,
        resourceType: result.resource_type,
        format: result.format,
        folder: result.folder || resolveFolder(folder),
        filename: file.originalname,
        bytes: result.bytes,
        width: result.width,
        height: result.height,
        duration: result.duration,
        alt: alt || '',
        tags: tagList,
      })

      return media.toObject()
    }))

    res.status(201).json({ success: true, data: uploaded })
  } catch (error) {
    next(error)
  }
}

export const deleteMedia = async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id)
    if (!media) return res.status(404).json({ success: false, message: 'Media not found' })

    await destroyMedia(media.publicId, media.resourceType)
    await media.deleteOne()

    res.json({ success: true, message: 'Media deleted' })
  } catch (error) {
    next(error)
  }
}
