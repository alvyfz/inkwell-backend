import cors from 'cors'
import bodyParser from 'body-parser'
import express, { Request, Response, NextFunction } from 'express'
import * as dotenv from 'dotenv'
dotenv.config()
import errorHandler from './middleware/errorHandler'
import authRoutes from './routes/authRoutes'
import todoRoutes from './routes/todoRoutes' // Import todoRoutes
import storageRoutes from './routes/storageRoutes' // Import storageRoutes

const app = express()

const port = process.env.PORT || 80

const corsOptions = {
  credentials: true,
  origin: true
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors(corsOptions))

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
})

// Use auth routes
app.use('/api/auth', authRoutes)
// Use todo routes
app.use('/api/todos', todoRoutes)
// Use storage routes
app.use('/api/storage', storageRoutes)

// Global error handler
app.use((error: any, req: Request, res: Response, next: NextFunction): void => {
  errorHandler(error, req, res, next)
})
// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
  })
}

// Export for Vercel
export default app
