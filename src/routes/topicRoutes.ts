import express from 'express'

import keyMiddleware from '../middleware/keyMiddleware'
import { createTopicController, getListTopicController } from '../controller/topicController'

const router = express.Router()

router.post('/', keyMiddleware, createTopicController)
router.get('/all', keyMiddleware, getListTopicController)

export default router
