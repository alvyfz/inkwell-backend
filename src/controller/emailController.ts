import bcryptjs from 'bcryptjs'
import User from '../models/userModel'
import { EmailParams, MailerSend, Recipient, Sender } from 'mailersend'
import * as dotenv from 'dotenv'
import { connect } from '../config/mongo'

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

    const mailerSend = new MailerSend({
      apiKey: process.env.MAILER_API_KEY as string
    })

    const sentFrom = new Sender(
      `inkwell-no-reply.${process.env.MAILER_DOMAIN}`,
      process.env.PRODUCT_NAME as string
    )

    const recipients = [new Recipient(email, name)]

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject('Verify your email').setHtml(`
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
      `)

    return await mailerSend.email.send(emailParams)
  } catch (err: any) {
    throw new Error(err.body.message)
  }
}
