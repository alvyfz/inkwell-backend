import { storage } from '@/config/appwrite'
import { ID } from 'node-appwrite'

export const uploadFile = async (file: File) => {
  const promise = storage.createFile(process.env.APPWRITE_STORAGE_ID || '', ID.unique(), file)

  return promise
}

export const getFile = async (fileId: string) => {
  const promise = storage.getFileView(process.env.APPWRITE_STORAGE_ID as string, fileId)

  return promise
}

export const updateFile = async (fileId: string) => {
  const promise = storage.updateFile(process.env.APPWRITE_STORAGE_ID as string, fileId)

  return promise
}

export const deleteFile = async (fileId: string) => {
  const promise = storage.deleteFile(process.env.APPWRITE_STORAGE_ID as string, fileId)

  return promise
}
