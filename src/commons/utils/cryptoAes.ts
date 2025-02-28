import CryptoJS from 'crypto-js'
import { isEmpty } from 'lodash'
import * as dotenv from 'dotenv'

dotenv.config()

export const encryptAES = (text: string) =>
  CryptoJS.AES.encrypt(text, process.env.AES_SECRET as string).toString()

export const decryptAES = (text: string) => {
  console.log(process.env.AES_SECRET)
  if (isEmpty(text)) return undefined
  return CryptoJS.AES.decrypt(text, process.env.AES_SECRET as string)?.toString(CryptoJS.enc.Utf8)
}
