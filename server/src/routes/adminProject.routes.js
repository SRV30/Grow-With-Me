import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { createProject, deleteProject, getAdminProject, listAdminProjects, reorderProjects, setProjectFlags, updateProject } from '../controllers/adminProject.controller.js'

const router = Router()
router.use(requireAuth)
router.get('/', listAdminProjects)
router.get('/:id', getAdminProject)
router.post('/', createProject)
router.patch('/:id', updateProject)
router.delete('/:id', deleteProject)
router.patch('/:id/flags', setProjectFlags)
router.patch('/reorder', reorderProjects)

export default router
