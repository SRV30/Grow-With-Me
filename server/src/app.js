import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import { env } from './config/env.js'
import healthRoutes from './routes/health.routes.js'
import projectRoutes from './routes/project.routes.js'
import authRoutes from './routes/auth.routes.js'
import adminProjectRoutes from './routes/adminProject.routes.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

const app = express()

app.disable('x-powered-by')
app.set('trust proxy', 1)
app.use(helmet())
app.use(cors({ origin: env.clientUrl, credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))
app.use(cookieParser())
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-8', legacyHeaders: false }))

app.get('/', (_req, res) => res.json({ success: true, service: 'grow-with-me-api' }))
app.use('/api/health', healthRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/admin/projects', adminProjectRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
