import { NextFunction, Request, Response } from 'express'
import { createUser, getUserByEmail, sendEmail } from '@/repository/userCollection'
import ClientError from '@/commons/exceptions/ClientError'
import { EMAIL_TYPE } from '@/entities/user'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { resSuccessHandler } from '@/commons/exceptions/resHandler'

import * as dotenv from 'dotenv'
import { isEmpty } from 'lodash'
import { isValidEmail, isValidPassword } from '@/commons/utils/util'

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
      if (date > new Date(userExist.verifyTokenExpiry)) {
        console.log('expired')
        try {
          await sendEmail({
            email: reqBody.email,
            emailType: EMAIL_TYPE.VERIFY_EMAIL,
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
      id: userExist._id,
      name: userExist.name,
      email: userExist.email
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
      await sendEmail({
        email,
        emailType: EMAIL_TYPE.VERIFY_EMAIL,
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
