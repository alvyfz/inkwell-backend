import express from 'express'
import {createUserController,  } from '../controller/userController'

const router = express.Router()

router.post('/signup', createUserController)



export default router
