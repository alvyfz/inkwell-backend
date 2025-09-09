import { NextFunction, Request, Response } from 'express'
import passport from '../config/passport'
import jwt from 'jsonwebtoken'
import { resSuccessHandler } from '../commons/exceptions/resHandler'
import User from '../models/userModel'
import * as dotenv from 'dotenv'

dotenv.config()

// GitHub OAuth login
export const githubAuth = passport.authenticate('github', {
  scope: ['user:email']
})

// GitHub OAuth callback
export const githubCallback = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('github', { session: false }, (err: any, user: any) => {
    if (err) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_error`)
    }
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`)
    }

    res.redirect(`${process.env.FRONTEND_URL}/app`)
  })(req, res, next)
}

// Google OAuth login
export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email']
})

// Google OAuth callback
export const googleCallback = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('google', { session: false }, (err: any, user: any) => {
    if (err) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_error`)
    }
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`)
    }

    res.redirect(`${process.env.FRONTEND_URL}/app`)
  })(req, res, next)
}

// OAuth signin endpoint for next-auth
export const oauthSignin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { provider, providerId, email, name, avatar, accessToken, refreshToken } = req.body

    // Check if user already exists with this provider ID
    let user = await User.findOne({
      'oauthProviders.provider': provider,
      'oauthProviders.providerId': providerId
    })

    if (user) {
      // Update tokens
      const providerIndex = user.oauthProviders.findIndex(
        (p: any) => p.provider === provider && p.providerId === providerId
      )
      if (providerIndex !== -1) {
        user.oauthProviders[providerIndex].accessToken = accessToken
        user.oauthProviders[providerIndex].refreshToken = refreshToken
        await user.save()
      }

      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          username: user.username,
          name: user.name,
          authType: user.authType
        },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      )

      return resSuccessHandler(res, 'User signed in successfully', {
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          name: user.name,
          avatar: user.avatar,
          authType: user.authType
        },
        accessToken: token
      })
    }

    // Check if user exists with same email
    if (email) {
      user = await User.findOne({ email })
      if (user) {
        // Add provider to existing user
        user.oauthProviders.push({
          provider,
          providerId,
          email,
          accessToken,
          refreshToken
        })
        user.authType = user.authType === 'email' ? 'hybrid' : user.authType
        user.isVerified = true
        await user.save()
        resSuccessHandler(res, 'User signed in successfully', {
          user: {
            id: user._id,
            email: user.email,
            username: user.username,
            name: user.name,
            avatar: user.avatar,
            authType: user.authType
          }
        })
        return
      }
    }

    // Create new user
    const username = name?.replace(/\s+/g, '').toLowerCase() || `${provider}_${providerId}`
    let finalUsername = username
    let counter = 1

    // Ensure unique username
    while (await User.findOne({ username: finalUsername })) {
      finalUsername = `${username}_${counter}`
      counter++
    }

    user = new User({
      email: email || `${providerId}@${provider}.local`,
      name: name,
      username: finalUsername,
      avatar: avatar,
      isVerified: true,
      authType: 'oauth',
      oauthProviders: [
        {
          provider,
          providerId,
          email,
          accessToken,
          refreshToken
        }
      ]
    })

    await user.save()
    resSuccessHandler(res, 'User created and signed in successfully', {
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        name: user.name,
        avatar: user.avatar,
        authType: user.authType
      }
    })
  } catch (error) {
    console.error('OAuth signin error:', error)
    next(error)
  }
}

// Logout
export const logout = (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie('Authorization')
  resSuccessHandler(res, 'Logged out successfully', null)
}

// Get current user from token
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user
    if (!user) {
      res.status(401).json({ message: 'Not authenticated' })
      return
    }

    resSuccessHandler(res, 'User retrieved successfully', {
      id: user._id,
      email: user.email,
      username: user.username,
      name: user.name,
      avatar: user.avatar,
      bio: user.bio,
      authType: user.authType,
      isVerified: user.isVerified
    })
    return
  } catch (error) {
    next(error)
  }
}
