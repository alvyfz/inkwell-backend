import { Storage, ID } from 'appwrite'
import { appwrite, getFileUrl } from '../config/appwrite'
import ClientError from '../utils/ClientError'

const storage = new Storage(appwrite)

const BUCKET_ID = process.env.APPWRITE_BUCKET_ID as string

/**
 * Service for handling file storage operations with Appwrite Storage.
 */
export const storageService = {
  /**
   * Uploads a file to Appwrite Storage.
   * @param file The file to upload.
   * @returns A promise that resolves to the uploaded file object.
   * @throws {ClientError} If the file upload fails.
   */
  async uploadFile(file: File): Promise<{ fileUrl: string; fileId: string }> {
    try {
      const response = await storage.createFile(BUCKET_ID, ID.unique(), file)
      const fileUrl = getFileUrl(response.$id) as string
      return { fileUrl, fileId: response.$id }
    } catch (error: any) {
      console.error('Error uploading file:', error)
      throw new ClientError(error.message || 'Failed to upload file.')
    }
  },

  /**
   * Retrieves a preview URL for a file.
   * @param fileId The ID of the file to get a preview for.
   * @returns A promise that resolves to the URL of the file preview.
   * @throws {ClientError} If retrieving the file preview fails.
   */
  async getFilePreview(fileId: string): Promise<string> {
    try {
      const result = storage.getFilePreview(BUCKET_ID, fileId)
      return result
    } catch (error: any) {
      console.error('Error getting file preview:', error)
      throw new ClientError(error.message || 'Failed to get file preview.')
    }
  },

  /**
   * Deletes a file from Appwrite Storage.
   * @param fileId The ID of the file to delete.
   * @returns A promise that resolves when the file is deleted.
   * @throws {ClientError} If the file deletion fails.
   */
  async deleteFile(fileId: string): Promise<void> {
    try {
      await storage.deleteFile(BUCKET_ID, fileId)
    } catch (error: any) {
      console.error('Error deleting file:', error)
      throw new ClientError(error.message || 'Failed to delete file.')
    }
  }
}
