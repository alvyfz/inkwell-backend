'use strict'

import { resErrorHandler } from './src/commons/exceptions/resHandler'
import { Response } from 'express'
import usersRoutes from './src/routes/userRoutes'
import filesRoutes from './src/routes/fileRoutes'
import articlesRoutes from './src/routes/articleRoutes'
import topicsRoutes from './src/routes/topicRoutes'
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

app.use('/users', usersRoutes)
app.use('/files', filesRoutes)
app.use('/articles', articlesRoutes)
app.use('/topics', topicsRoutes)

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
app.use(function (error: any, req: Request, res: Response, next: NextFunction) {
  return resErrorHandler(res, error)
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
