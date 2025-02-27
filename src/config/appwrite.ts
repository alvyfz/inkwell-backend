import * as sdk from 'node-appwrite'
import * as dotenv from 'dotenv'
dotenv.config()

const client = new sdk.Client()

client
  .setEndpoint(process.env.APPWRITE_ENDPOINT as string)
  .setProject(process.env.APPWRITE_PROJECT as string)
  .setKey(process.env.APPWRITE_KEY as string)

const ID = sdk.ID

const account = new sdk.Account(client)

export { client, ID, account }
