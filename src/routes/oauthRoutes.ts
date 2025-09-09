import { Router } from 'express'
import {
  githubAuth,
  githubCallback,
  googleAuth,
  googleCallback,
  oauthSignin,
  logout,
  getCurrentUser
} from '../controller/oauthController'
import authMiddleware from '../middleware/authMiddleware'

const router = Router()

// GitHub OAuth routes
router.get('/github', githubAuth)
router.get('/github/callback', githubCallback)

// Google OAuth routes
router.get('/google', googleAuth)
router.get('/google/callback', googleCallback)

// OAuth signin endpoint for next-auth
router.post('/oauth-signin', oauthSignin)

// Logout
router.post('/logout', logout)

// Get current user
router.get('/me', authMiddleware, getCurrentUser)

export default router