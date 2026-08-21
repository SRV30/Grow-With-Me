import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: '', maxlength: 5000 },
    client: { type: String, default: '', trim: true, maxlength: 160 },
    category: {
      type: String,
      enum: ['social-media', 'posters', 'reels', 'advertisements', 'branding', 'websites', 'other'],
      default: 'social-media',
    },
    year: { type: Number, min: 2000, max: 2100 },
    coverImage: {
      url: String,
      publicId: String,
      alt: String,
    },
    gallery: [{ url: String, publicId: String, alt: String }],
    videos: [{ url: String, publicId: String, thumbnail: String }],
    services: [{ type: String, trim: true }],
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    seo: {
      title: { type: String, maxlength: 160 },
      description: { type: String, maxlength: 320 },
    },
  },
  { timestamps: true },
)

projectSchema.index({ published: 1, featured: 1, order: 1 })
projectSchema.index({ title: 'text', description: 'text', client: 'text' })

export const Project = mongoose.model('Project', projectSchema)
