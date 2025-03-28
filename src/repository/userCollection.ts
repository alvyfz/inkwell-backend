import bcryptjs from 'bcryptjs'

import User from '../models/userModel'
import * as dotenv from 'dotenv'
import { connect } from '../config/mongo'

dotenv.config()

connect()

export const getUserByEmail = async (email: string) => User.findOne({ email: email })

export const createUser = async (user: { name: string; password: string; email: string }) => {
  const salt = await bcryptjs.genSalt(10)
  const hashedPassword = await bcryptjs.hash(user.password, salt)
  return new User({
    name: user.name,
    password: hashedPassword,
    email: user.email
  }).save()
}

export const getVerifyEmail = async (email: string) =>
  User.findOne({ email: email, verifyOtpExpiry: { $gt: Date.now() } })

export const getUserDetail = async (userId: string) =>
  User.findOne({ _id: userId }).select('-password -verifyOtp -verifyOtpExpiry -__v')
