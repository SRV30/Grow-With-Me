import { Enquiry } from '../models/Enquiry.js'

export const createEnquiry = async (req, res, next) => {
  try {
    const { name, email, phone, company, service, budget, message } = req.body
    if (!name || !email || !message) return res.status(400).json({ success: false, message: 'Name, email and message are required.' })
    const enquiry = await Enquiry.create({ name, email, phone, company, service, budget, message })
    res.status(201).json({ success: true, data: enquiry })
  } catch (error) { next(error) }
}

export const listEnquiries = async (req, res, next) => {
  try {
    const filter = req.query.status ? { status: req.query.status } : {}
    const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 }).lean()
    res.json({ success: true, data: enquiries })
  } catch (error) { next(error) }
}

export const updateEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true }).lean()
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found.' })
    res.json({ success: true, data: enquiry })
  } catch (error) { next(error) }
}

export const deleteEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id)
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found.' })
    res.json({ success: true, message: 'Enquiry deleted.' })
  } catch (error) { next(error) }
}
