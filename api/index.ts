import { Response } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import express from 'express'
import * as dotenv from 'dotenv'
import errorHandler from '@/middleware/errorHandler'
import authRoutes from '@/routes/authRoutes'
import storageRoutes from '@/routes/storageRoutes'

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
app.use('/api/auth', authRoutes)
app.use('/api/files', storageRoutes)

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
  return errorHandler(error, req, res, next)
})

// Export for Vercel
export default app
