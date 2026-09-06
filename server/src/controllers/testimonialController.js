import { Testimonial } from '../models/Testimonial.js'

export const listTestimonials = async (req, res, next) => {
  try {
    const filter = req.user ? {} : { published: true }
    const testimonials = await Testimonial.find(filter).sort({
      featured: -1,
      order: 1,
      createdAt: -1,
    })
    res.json({ success: true, data: testimonials })
  } catch (error) {
    next(error)
  }
}

export const getTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id)
    if (!testimonial)
      return res.status(404).json({ success: false, message: 'Testimonial not found' })
    res.json({ success: true, data: testimonial })
  } catch (error) {
    next(error)
  }
}

export const createPublicTestimonial = async (req, res, next) => {
  try {
    const { name, company, role, quote, rating } = req.body
    if (!name?.trim() || !quote?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Name and testimonial are required',
      })
    }

    const testimonial = await Testimonial.create({
      name: name.trim(),
      company: company?.trim() || '',
      role: role?.trim() || '',
      quote: quote.trim(),
      rating: Math.min(5, Math.max(1, Number(rating) || 5)),
      published: false,
      featured: false,
    })

    res.status(201).json({
      success: true,
      data: testimonial,
      message: 'Testimonial submitted for review',
    })
  } catch (error) {
    next(error)
  }
}

export const createTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.create(req.body)
    res.status(201).json({ success: true, data: testimonial })
  } catch (error) {
    next(error)
  }
}

export const updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!testimonial)
      return res.status(404).json({ success: false, message: 'Testimonial not found' })
    res.json({ success: true, data: testimonial })
  } catch (error) {
    next(error)
  }
}

export const deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id)
    if (!testimonial)
      return res.status(404).json({ success: false, message: 'Testimonial not found' })
    res.json({ success: true, data: testimonial })
  } catch (error) {
    next(error)
  }
}
