import bcryptjs from 'bcryptjs'
import User from '../models/userModel'
import * as dotenv from 'dotenv'
import { connect } from '../config/mongo'
const nodemailer = require('nodemailer')
dotenv.config()

connect()

export const sendOtpEmail = async ({
  email,
  userId,
  name
}: {
  email: string
  userId: string
  name: string
}) => {
  try {
    if (!userId) {
      throw new Error('User Id is required')
    }

    if (!email) {
      throw new Error('Email is required')
    }

    if (!name) {
      throw new Error('Name is required')
    }

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_SMTP,
      port: process.env.MAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_LOGIN,
        pass: process.env.MAIL_KEY
      }
    })

    const otp = Math.floor(100000 + Math.random() * 900000)

    // create a hased token
    const hashedToken = await bcryptjs.hash(otp.toString(), 10)

    await User.findByIdAndUpdate(
      userId,
      {
        verifyOtp: hashedToken,
        verifyOtpExpiry: Date.now() + 15 * 60 * 1000
      },
      { new: true, runValidators: true }
    )

    const html = `
      <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>OTP Email</title>
          </head>
          <body style="font-family: Arial, sans-serif; background-color: #f4f4f9; margin: 0; padding: 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
              <tr>
                <td style="background-color: #000000; padding: 20px; text-align: center;">
                  <h1 style="color: #ffffff; font-size: 24px; margin: 0;">OTP Verification</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px;">
                  <p style="font-size: 16px; color: #333333; margin: 0 0 20px 0;">
                    Hello, ${name}.
                  </p>
                  <p style="font-size: 16px; color: #333333; margin: 0 0 20px 0;">
                    We have sent you an OTP to verify your account. Please use the following code:
                  </p>
                  <div style="background-color: #f8f9fa; padding: 15px; text-align: center; border-radius: 8px; margin-bottom: 20px;">
                    <h2 style="font-size: 28px; color: #000000; margin: 0; letter-spacing: 5px;">${otp}</h2>
                  </div>
                  <p style="font-size: 14px; color: #666666; margin: 0 0 20px 0;">
                    This code will expire in <strong>15 minutes</strong>. Do not share this code with anyone.
                  </p>
                  <p style="font-size: 16px; color: #333333; margin: 0;">
                    Thank you,
                  </p>
                  <p style="font-size: 16px; color: #333333; margin: 0;">
                    The Inkwells Team
                  </p>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f8f9fa; padding: 15px; text-align: center;">
                  <p style="font-size: 12px; color: #666666; margin: 0;">
                    If you did not request this code, please ignore this email.
                  </p>
                </td>
              </tr>
            </table>
          </body>
          </html>
      `

    const mail = {
      from: `"Inkwells" <inkwell.fauzi@gmail.com>`,
      to: email,
      subject: 'Verify your email',
      html: html
    }

    return await await transporter.sendMail(mail)
  } catch (err: any) {
    console.log(err)
    throw new Error(err.body.message)
  }
}
