import express from 'express'

import keyMiddleware from '@/middleware/keyMiddleware'
import authMiddleware from '@/middleware/authMiddleware'
import { getFileController, uploadFileController } from '@/controller/fileController'

const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const router = express.Router()

router.post('/', keyMiddleware, authMiddleware, upload.single('file'), uploadFileController)
router.get('/', keyMiddleware, authMiddleware, getFileController)

export default router
