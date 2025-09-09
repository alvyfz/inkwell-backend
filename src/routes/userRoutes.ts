import express from 'express'
import {
  userDetailController,
  usernameValidationController
} from '../controller/userController'
import keyMiddleware from '../middleware/keyMiddleware'
import authMiddleware from '../middleware/authMiddleware'

const router = express.Router()

// OAuth-only authentication - traditional email/password routes removed
router.get('/me', keyMiddleware, authMiddleware, userDetailController)
router.get('/username-validation', keyMiddleware, usernameValidationController)

export default router
