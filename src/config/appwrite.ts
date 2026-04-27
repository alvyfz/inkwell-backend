import { Client } from 'appwrite'

const client = new Client()

const bucketId = process.env.APPWRITE_BUCKET_ID as string
const projectId = process.env.APPWRITE_PROJECT_ID as string

client
  .setEndpoint(process.env.APPWRITE_ENDPOINT as string) // Your API Endpoint
  .setProject(process.env.APPWRITE_PROJECT_ID as string) // Your Project ID

export const appwrite = client

export const getFileUrl = (fileId: string) => {
  return process.env.APPWRITE_FILE_URL?.replace('BUCKET_ID', bucketId)
    .replace('FILE_ID', fileId)
    .replace('PROJECT_ID', projectId)
}
