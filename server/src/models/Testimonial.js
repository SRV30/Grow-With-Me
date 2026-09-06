import mongoose from 'mongoose'

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    company: { type: String, default: '', trim: true, maxlength: 160 },
    role: { type: String, default: '', trim: true, maxlength: 120 },
    quote: { type: String, required: true, trim: true, maxlength: 1200 },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    avatar: { url: String, publicId: String, alt: String },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
)

testimonialSchema.index({ published: 1, featured: 1, order: 1 })

export const Testimonial = mongoose.model('Testimonial', testimonialSchema)
