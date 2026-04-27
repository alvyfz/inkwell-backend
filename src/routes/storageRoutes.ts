import { Router } from 'express'
import { storageController } from '../controller/storageController'
import { sessionMiddleware } from '../middleware/sessionMiddleware'

const storageRoutes = Router()

storageRoutes.post(
  '/upload',
  sessionMiddleware,
  storageController.uploadMiddleware,
  storageController.uploadFile
)
storageRoutes.get('/preview/:fileId', sessionMiddleware, storageController.getFilePreview)
storageRoutes.delete('/:fileId', sessionMiddleware, storageController.deleteFile)

export default storageRoutes
