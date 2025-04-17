import express from 'express'
import {
  loginController,
  sendOtpController,
  signupController,
  userDetailController,
  usernameValidationController,
  verifyEmailController
} from '../controller/userController'
import keyMiddleware from '../middleware/keyMiddleware'
import authMiddleware from '../middleware/authMiddleware'

const router = express.Router()

router.post('/login', keyMiddleware, loginController)
router.post('/signup', keyMiddleware, signupController)
router.get('/verify-email', keyMiddleware, verifyEmailController)
router.get('/me', keyMiddleware, authMiddleware, userDetailController)
router.get('/send-otp', keyMiddleware, sendOtpController)
router.get('/username-validation', keyMiddleware, usernameValidationController)

export default router
