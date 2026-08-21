import mongoose from 'mongoose'

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 160 },
    phone: { type: String, trim: true, maxlength: 30 },
    company: { type: String, trim: true, maxlength: 160 },
    service: { type: String, trim: true, maxlength: 120 },
    budget: { type: String, trim: true, maxlength: 80 },
    message: { type: String, required: true, trim: true, maxlength: 3000 },
    status: { type: String, enum: ['new', 'contacted', 'qualified', 'closed'], default: 'new' },
    notes: { type: String, default: '', maxlength: 3000 },
  },
  { timestamps: true },
)

enquirySchema.index({ status: 1, createdAt: -1 })

export const Enquiry = mongoose.model('Enquiry', enquirySchema)
