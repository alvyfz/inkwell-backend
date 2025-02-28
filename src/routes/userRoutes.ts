import express from 'express'
import { loginController, signupController } from '@/controller/userController'
import { keyMiddleware } from '@/middleware/keyMiddleware'

const router = express.Router()

router.post('/login', keyMiddleware, loginController)
router.post('/signup', keyMiddleware, signupController)

export default router
