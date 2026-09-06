import mongoose from 'mongoose'
import { Enquiry } from '../models/Enquiry.js'

const STATUSES = ['new', 'contacted', 'qualified', 'closed']
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const clean = (value) => (typeof value === 'string' ? value.trim() : '')

export const createEnquiry = async (req, res, next) => {
  try {
    const name = clean(req.body.name)
    const email = clean(req.body.email).toLowerCase()
    const phone = clean(req.body.phone)
    const company = clean(req.body.company)
    const service = clean(req.body.service)
    const budget = clean(req.body.budget)
    const message = clean(req.body.message)

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ success: false, message: 'Name, email and message are required.' })
    }
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' })
    }
    if (name.length > 120 || email.length > 160 || phone.length > 30 || company.length > 160 || service.length > 120 || budget.length > 80 || message.length > 3000) {
      return res.status(400).json({ success: false, message: 'One or more fields exceed the allowed length.' })
    }

    const enquiry = await Enquiry.create({ name, email, phone, company, service, budget, message })
    res.status(201).json({ success: true, data: enquiry })
  } catch (error) {
    next(error)
  }
}

export const listEnquiries = async (req, res, next) => {
  try {
    const requestedStatus = clean(req.query.status).toLowerCase()
    if (requestedStatus && !STATUSES.includes(requestedStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid enquiry status.' })
    }

    const filter = requestedStatus ? { status: requestedStatus } : {}
    const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 }).lean()
    res.json({ success: true, data: enquiries })
  } catch (error) {
    next(error)
  }
}

export const updateEnquiry = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid enquiry id.' })
    }

    const updates = {}
    if (Object.prototype.hasOwnProperty.call(req.body, 'status')) {
      const status = clean(req.body.status).toLowerCase()
      if (!STATUSES.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid enquiry status.' })
      }
      updates.status = status
    }
    if (Object.prototype.hasOwnProperty.call(req.body, 'notes')) {
      const notes = clean(req.body.notes)
      if (notes.length > 3000) {
        return res.status(400).json({ success: false, message: 'Notes cannot exceed 3000 characters.' })
      }
      updates.notes = notes
    }

    if (!Object.keys(updates).length) {
      return res.status(400).json({ success: false, message: 'No valid fields to update.' })
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true },
    ).lean()
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found.' })
    res.json({ success: true, data: enquiry })
  } catch (error) {
    next(error)
  }
}

export const deleteEnquiry = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid enquiry id.' })
    }
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id)
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found.' })
    res.json({ success: true, message: 'Enquiry deleted.' })
  } catch (error) {
    next(error)
  }
}
