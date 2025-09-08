import { resErrorHandler } from './commons/exceptions/resHandler'
import { Response } from 'express'
import usersRoutes from './routes/userRoutes'
import filesRoutes from './routes/fileRoutes'
import articlesRoutes from './routes/articleRoutes'
import topicsRoutes from './routes/topicRoutes'
import cors from 'cors'
import bodyParser from 'body-parser'
import express from 'express'
import * as dotenv from 'dotenv'

dotenv.config()

const app = express()

const port = process.env.PORT || 80

const corsOptions = {
  credentials: true,
  origin: true
}

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors(corsOptions))

// API routes dengan prefix /api untuk Vercel
app.use('/api/users', usersRoutes)
app.use('/api/files', filesRoutes)
app.use('/api/articles', articlesRoutes)
app.use('/api/topics', topicsRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
})

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
app.use(function (error: any, req: Request, res: Response, next: NextFunction) {
  return resErrorHandler(res, error)
})

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
  })
}

// Export for Vercel
export default app
