'use strict'

import { resErrorHandler } from './commons/exceptions/resHandler'
import { Response } from 'express'
import usersRouter from './routes/userRoutes'
import cors from 'cors'
import bodyParser from 'body-parser'
import express from 'express'
import * as dotenv from 'dotenv'

dotenv.config()
const app = express()

const port = process.env.PORT || 3001

const corsOptions = {
  credentials: true,
  origin: true
}

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use(cors(corsOptions))

app.use('/users', usersRouter)

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
app.use(function (error: any, req: Request, res: Response, next: NextFunction) {
  console.log(error, 'ini error')
  return resErrorHandler(res, error)
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
