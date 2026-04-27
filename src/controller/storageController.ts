import { Request, Response, NextFunction } from 'express'
import { storageService } from '../services/storageService'
import multer from 'multer'
import ClientError from '../utils/ClientError'

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() })

export const storageController = {
  // Middleware for single file upload
  uploadMiddleware: upload.single('file'),

  async uploadFile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new ClientError('No file uploaded.', 400)
      }
      // req.file.buffer is available when using memoryStorage
      // We need to convert the buffer to a File object for Appwrite SDK
      const file = new File([req.file.buffer], req.file.originalname, { type: req.file.mimetype })
      const uploadedFile = await storageService.uploadFile(file)
      res.status(201).json({ status: 'success', data: uploadedFile })
    } catch (error) {
      next(error)
    }
  },

  async getFilePreview(req: Request, res: Response, next: NextFunction) {
    try {
      const { fileId } = req.params
      const previewUrl = await storageService.getFilePreview(fileId)
      res.status(200).json({ status: 'success', data: { previewUrl: previewUrl.toString() } })
    } catch (error) {
      next(error)
    }
  },

  async deleteFile(req: Request, res: Response, next: NextFunction) {
    try {
      const { fileId } = req.params
      await storageService.deleteFile(fileId)
      res.status(200).json({ status: 'success', message: 'File deleted successfully' })
    } catch (error) {
      next(error)
    }
  }
}
