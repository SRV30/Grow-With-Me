import '../config/env.js'
import { connectDatabase } from '../config/db.js'
import { User } from '../models/User.js'

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
const password = process.env.ADMIN_PASSWORD
const name = process.env.ADMIN_NAME || 'Grow With Me Admin'

if (!email || !password) {
  throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required to create an admin')
}

if (password.length < 8) {
  throw new Error('ADMIN_PASSWORD must be at least 8 characters')
}

await connectDatabase()

const existing = await User.findOne({ email })
if (existing) {
  console.log(`Admin already exists: ${email}`)
  await import('mongoose').then(({ default: mongoose }) => mongoose.disconnect())
  process.exit(0)
}

await User.create({ name, email, password, role: 'admin' })
console.log(`Admin created: ${email}`)
await import('mongoose').then(({ default: mongoose }) => mongoose.disconnect())
process.exit(0)
