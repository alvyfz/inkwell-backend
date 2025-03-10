import { NextFunction, Request, Response } from 'express'
import {
  createUser,
  getUserByEmail,
  getUserDetail,
  getVerifyEmail
} from '@/repository/userCollection'
import ClientError from '@/commons/exceptions/ClientError'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { resSuccessHandler } from '@/commons/exceptions/resHandler'
import * as dotenv from 'dotenv'
import { isEmpty } from 'lodash'
import { isValidEmail, isValidPassword } from '@/commons/utils/util'
import { sendOtpEmail } from '@/controller/emailController'

dotenv.config()

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  const reqBody: { email: string; password: string } = req.body
  try {
    if (isEmpty(reqBody.email) || isEmpty(reqBody.password)) {
      throw new ClientError('email or password cannot empty.', 400)
    }
    // check if user already exist
    const userExist = await getUserByEmail(reqBody.email)

    if (!userExist) {
      throw new ClientError('Email or password is incorrect.', 401)
    }

    if (!userExist.isVerified) {
      const date = new Date(Date.now() + 5 * 60 * 1000)
      if (!userExist.verifyOtpExpiry || date > new Date(userExist.verifyOtpExpiry)) {
        try {
          await sendOtpEmail({
            email: reqBody.email,
            userId: userExist._id,
            name: userExist.name
          })
        } catch (e) {
          console.log(e)
        }
      }
      throw new ClientError('Please check your email to verify this user.', 402)
    }

    // check password is correct
    const validPassword = await bcryptjs.compare(reqBody.password, userExist.password)

    if (!validPassword) {
      throw new ClientError('Email or password is incorrect.', 401)
    }

    //  create token data
    const tokenData = {
      ...userExist._doc,
      password: undefined,
      verifyOtpExpiry: undefined,
      verifyOtp: undefined,
      id: userExist._id
    }

    const token = jwt.sign(tokenData, process.env.SECRET_TOKEN as string, {
      expiresIn: '14h'
    })

    resSuccessHandler(res, 'Login success.', { token })
  } catch (error) {
    next(error)
  }
}

export const signupController = async (req: Request, res: Response, next: NextFunction) => {
  const { email, name, password }: { email: string; password: string; name: string } = req.body

  try {
    if (
      (isEmpty(email) && !isValidEmail(email)) ||
      (isEmpty(password) && !isValidPassword(password)) ||
      isEmpty(name)
    ) {
      throw new ClientError('name, email or password is invalid', 400)
    }
    // check if user already exist
    const userExist = await getUserByEmail(email)

    if (userExist) {
      throw new ClientError('User already exists, please use another email.')
    }

    const savedUser = await createUser({ name, password, email })
    try {
      await sendOtpEmail({
        email,
        userId: savedUser._id,
        name
      })
    } catch (e) {
      console.log(e)
    }

    resSuccessHandler(res, 'Signup success.', { ...savedUser._doc, password: undefined })
  } catch (error) {
    next(error)
  }
}

export const verifyEmailController = async (req: Request, res: Response, next: NextFunction) => {
  const { otp, action, password, email } = req.query

  const actionType = ['forgot-password', 'verify-email']

  try {
    if (isEmpty(email) || !isValidEmail(email as string)) {
      throw new ClientError('Email is invalid.', 400)
    }

    if (!actionType.includes(action as string)) {
      throw new ClientError('Action not provided.', 400)
    }

    if (action === 'forgot-password' && !isValidPassword(password as string)) {
      throw new ClientError('Password is invalid.', 400)
    }

    if (isEmpty(otp)) {
      throw new ClientError('OTP not provided.', 400)
    }

    const user = await getVerifyEmail(email as string)

    if (!user) {
      throw new ClientError('Invalid OTP.', 404)
    }

    if (action === 'verify-email' && !!user.isVerified) {
      throw new ClientError('Email already verified, Please login.', 400)
    }

    const validOtp = await bcryptjs.compare(otp as string, user.verifyOtp)

    if (!validOtp) {
      throw new ClientError('OTP is invalid.', 400)
    }

    if (action === 'verify-email') {
      user.isVerified = true
    }

    if (action === 'forgot-password') {
      const salt = await bcryptjs.genSalt(10)
      const hashedPassword = await bcryptjs.hash(password as string, salt)
      user.password = hashedPassword
    }

    user.verifyOtp = undefined
    user.verifyOtpExpiry = undefined
    await user.save()

    let data

    if (action === 'verify-email') {
      const tokenData = {
        ...user._doc,
        password: undefined,
        verifyOtpExpiry: undefined,
        verifyOtp: undefined,
        id: user._id
      }

      data = jwt.sign(tokenData, process.env.SECRET_TOKEN as string, {
        expiresIn: '14h'
      })
    }

    const message =
      action === 'verify-email'
        ? 'Email success verify.'
        : 'Password success change, Please to login.'

    resSuccessHandler(res, message, { data })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

export const userDetailController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getUserDetail(res.locals.user.id)

    resSuccessHandler(res, 'Success.', user)
  } catch (error) {
    next(error)
  }
}

export const sendOtpController = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.query

  try {
    if (isEmpty(email)) {
      throw new ClientError('Email is required.', 400)
    }

    const user = await getUserByEmail(email as string)

    if (!user) {
      throw new ClientError('User not found.', 404)
    }

    try {
      await sendOtpEmail({
        email: email as string,
        userId: user._id,
        name: user.name
      })
    } catch (e) {
      console.log(e)
    }

    resSuccessHandler(res, 'OTP sent. Please check your email.')
  } catch (error) {
    next(error)
  }
}
