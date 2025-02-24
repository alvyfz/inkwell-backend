'use strict'

import { resErrorHandler } from './commons/exceptions/resHandler'
import { NextFunction, Response } from 'express'
import usersRouter from './routes/userRoutes'
const cors = require('cors')
const bodyParser = require('body-parser')
const express = require('express')
const dotenv = require('dotenv')

const app = express()

dotenv.config()
const port = process.env.PORT || 3001

const corsOptions = {
  credentials: true,
  origin: true
}

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use(cors(corsOptions))

app.use('/users', usersRouter)

app.use(function (error: any, req: Request, res: Response, next: NextFunction) {
  return resErrorHandler(res, error)
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})

export default app
