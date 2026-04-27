import { Router } from 'express'
import { authController } from '../controller/authController'
import { sessionMiddleware } from '../middleware/sessionMiddleware'

const router = Router()

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/logout', sessionMiddleware, authController.logout)
router.get('/current-user', sessionMiddleware, authController.getCurrentUser)

export default router
