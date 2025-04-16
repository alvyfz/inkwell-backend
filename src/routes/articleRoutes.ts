import express from 'express'

import keyMiddleware from '../middleware/keyMiddleware'
import authMiddleware from '../middleware/authMiddleware'
import {
  draftUpdateController,
  getDraftController,
  getListMyArticleController,
  publishDraftController
} from '../controller/articleController'

const router = express.Router()

router.post('/draft', keyMiddleware, authMiddleware, draftUpdateController)
router.get('/draft', keyMiddleware, authMiddleware, getDraftController)
router.post('/publish', keyMiddleware, authMiddleware, publishDraftController)
router.get('/my-list', keyMiddleware, authMiddleware, getListMyArticleController)

export default router
