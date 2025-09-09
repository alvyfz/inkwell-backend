import passport from 'passport'
import { Strategy as GitHubStrategy } from 'passport-github2'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import User from '../models/userModel'
import * as dotenv from 'dotenv'

dotenv.config()

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user._id)
})

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id)
    done(null, user)
  } catch (error) {
    done(error, null)
  }
})

// GitHub OAuth Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: 'http://localhost:3001/api/auth/github/callback'
    },
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
      try {
        // Check if user already exists with this GitHub ID
        let user = await User.findOne({
          'oauthProviders.provider': 'github',
          'oauthProviders.providerId': profile.id
        })

        if (user) {
          // Update tokens
          const providerIndex = user.oauthProviders.findIndex(
            (p: any) => p.provider === 'github' && p.providerId === profile.id
          )
          if (providerIndex !== -1) {
            user.oauthProviders[providerIndex].accessToken = accessToken
            user.oauthProviders[providerIndex].refreshToken = refreshToken
            await user.save()
          }
          return done(null, user)
        }

        // Check if user exists with same email
        const email = profile.emails?.[0]?.value
        if (email) {
          user = await User.findOne({ email })
          if (user) {
            // Add GitHub provider to existing user
            user.oauthProviders.push({
              provider: 'github',
              providerId: profile.id,
              email,
              accessToken,
              refreshToken
            })
            user.authType = user.authType === 'email' ? 'hybrid' : user.authType
            user.isVerified = true
            await user.save()
            return done(null, user)
          }
        }

        // Create new user
        const username = profile.username || profile.displayName?.replace(/\s+/g, '').toLowerCase() || `github_${profile.id}`
        let finalUsername = username
        let counter = 1
        
        // Ensure unique username
        while (await User.findOne({ username: finalUsername })) {
          finalUsername = `${username}_${counter}`
          counter++
        }

        user = new User({
          email: email || `${profile.id}@github.local`,
          name: profile.displayName,
          username: finalUsername,
          avatar: profile.photos?.[0]?.value,
          isVerified: true,
          authType: 'oauth',
          oauthProviders: [{
            provider: 'github',
            providerId: profile.id,
            email,
            accessToken,
            refreshToken
          }]
        })

        await user.save()
        done(null, user)
      } catch (error) {
        done(error, null)
      }
    }
  )
)

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: 'http://localhost:3001/api/auth/google/callback'
    },
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
      try {
        // Check if user already exists with this Google ID
        let user = await User.findOne({
          'oauthProviders.provider': 'google',
          'oauthProviders.providerId': profile.id
        })

        if (user) {
          // Update tokens
          const providerIndex = user.oauthProviders.findIndex(
            (p: any) => p.provider === 'google' && p.providerId === profile.id
          )
          if (providerIndex !== -1) {
            user.oauthProviders[providerIndex].accessToken = accessToken
            user.oauthProviders[providerIndex].refreshToken = refreshToken
            await user.save()
          }
          return done(null, user)
        }

        // Check if user exists with same email
        const email = profile.emails?.[0]?.value
        if (email) {
          user = await User.findOne({ email })
          if (user) {
            // Add Google provider to existing user
            user.oauthProviders.push({
              provider: 'google',
              providerId: profile.id,
              email,
              accessToken,
              refreshToken
            })
            user.authType = user.authType === 'email' ? 'hybrid' : user.authType
            user.isVerified = true
            await user.save()
            return done(null, user)
          }
        }

        // Create new user
        const username = profile.displayName?.replace(/\s+/g, '').toLowerCase() || `google_${profile.id}`
        let finalUsername = username
        let counter = 1
        
        // Ensure unique username
        while (await User.findOne({ username: finalUsername })) {
          finalUsername = `${username}_${counter}`
          counter++
        }

        user = new User({
          email: email || `${profile.id}@google.local`,
          name: profile.displayName,
          username: finalUsername,
          avatar: profile.photos?.[0]?.value,
          isVerified: true,
          authType: 'oauth',
          oauthProviders: [{
            provider: 'google',
            providerId: profile.id,
            email,
            accessToken,
            refreshToken
          }]
        })

        await user.save()
        done(null, user)
      } catch (error) {
        done(error, null)
      }
    }
  )
)

export default passport