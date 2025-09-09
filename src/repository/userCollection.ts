import User from '../models/userModel'
import * as dotenv from 'dotenv'
import { connect } from '../config/mongo'

dotenv.config()

connect()

export const getUserByEmail = async (email: string) => User.findOne({ email: email })

// OAuth-only user creation
export const createUser = async (user: {
  name: string
  email: string
  username: string
  authType?: string
  oauthProviders?: any[]
}) => {
  return new User({
    name: user.name,
    email: user.email,
    username: user.username,
    authType: user.authType || 'oauth',
    oauthProviders: user.oauthProviders || [],
    isVerified: true
  }).save()
}

export const getUserDetail = async (userId: string) =>
  User.findOne({ _id: userId }).select('-__v')

export const getUserByUsername = async (username: string) => User.findOne({ username: username })
