const sdk = require('node-appwrite')
import * as dotenv from 'dotenv'

dotenv.config()

export const client = new sdk.Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || '')
  .setProject(process.env.APPWRITE_PROJECT || '')
  .setKey(process.env.APPWRITE_KEY || '')

export const storage = new sdk.Storage(client)
