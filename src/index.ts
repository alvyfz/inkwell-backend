'use strict'

import { resErrorHandler } from './commons/exceptions/resHandler'
import { Response } from 'express'
import usersRouter from './routes/userRoutes'
import filesRouter from './routes/fileRoutes'
import articlesRouter from './routes/articleRoutes'
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

app.use(bodyParser.json())

app.use(bodyParser.urlencoded())

app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors(corsOptions))

app.use('/users', usersRouter)
app.use('/files', filesRouter)
app.use('/articles', articlesRouter)

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
app.use(function (error: any, req: Request, res: Response, next: NextFunction) {
  return resErrorHandler(res, error)
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
