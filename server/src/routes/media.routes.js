import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { uploadMedia } from '../middleware/upload.js'
import { deleteMedia, listMedia, uploadMediaFiles } from '../controllers/media.controller.js'

const router = Router()
router.use(requireAuth)
router.get('/', listMedia)
router.post('/upload', uploadMedia.array('files', 10), uploadMediaFiles)
router.delete('/:id', deleteMedia)

export default router
