import express from 'express'

import keyMiddleware from '@/middleware/keyMiddleware'
import authMiddleware from '@/middleware/authMiddleware'
import {
  draftUpdateController,
  getDraftController,
  publishDraftController
} from '@/controller/articleController'

const router = express.Router()

router.post('/draft', keyMiddleware, authMiddleware, draftUpdateController)
router.get('/draft', keyMiddleware, authMiddleware, getDraftController)
router.post('/publish', keyMiddleware, authMiddleware, publishDraftController)

export default router
