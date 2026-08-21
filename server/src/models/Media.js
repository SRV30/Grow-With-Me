import mongoose from 'mongoose'

const mediaSchema = new mongoose.Schema({
  publicId: { type: String, required: true, unique: true },
  url: { type: String, required: true },
  secureUrl: { type: String, required: true },
  resourceType: { type: String, enum: ['image', 'video', 'raw'], required: true },
  format: String,
  folder: String,
  filename: String,
  bytes: Number,
  width: Number,
  height: Number,
  duration: Number,
  alt: { type: String, default: '' },
  tags: [{ type: String, trim: true }],
}, { timestamps: true })

mediaSchema.index({ createdAt: -1 })
mediaSchema.index({ resourceType: 1, folder: 1 })

export const Media = mongoose.model('Media', mediaSchema)
