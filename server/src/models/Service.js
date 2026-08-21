import mongoose from 'mongoose'

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true, maxlength: 1000 },
    icon: { type: String, default: '' },
    image: { publicId: String, url: String, alt: String },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
)

export const Service = mongoose.model('Service', serviceSchema)
