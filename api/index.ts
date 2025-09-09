import { resErrorHandler } from '../src/commons/exceptions/resHandler'
import { Response } from 'express'
import usersRoutes from '../src/routes/userRoutes'
import filesRoutes from '../src/routes/fileRoutes'
import articlesRoutes from '../src/routes/articleRoutes'
import topicsRoutes from '../src/routes/topicRoutes'
import cors from 'cors'
import bodyParser from 'body-parser'
import express from 'express'
import * as dotenv from 'dotenv'

dotenv.config()

const app = express()

const corsOptions = {
  credentials: true,
  origin: true
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors(corsOptions))

// API routes
app.use('/api/users', usersRoutes)
app.use('/api/files', filesRoutes)
app.use('/api/articles', articlesRoutes)
app.use('/api/topics', topicsRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
})

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Inkwell API!' })
})

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
app.use(function (error: any, req: Request, res: Response, next: NextFunction) {
  return resErrorHandler(res, error)
})

// Export for Vercel
export default app
