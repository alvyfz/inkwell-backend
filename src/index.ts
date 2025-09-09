import { resErrorHandler } from './commons/exceptions/resHandler'
import { Response } from 'express'
import usersRoutes from './routes/userRoutes'
import filesRoutes from './routes/fileRoutes'
import articlesRoutes from './routes/articleRoutes'
import topicsRoutes from './routes/topicRoutes'
import oauthRoutes from './routes/oauthRoutes'
import cors from 'cors'
import bodyParser from 'body-parser'
import express from 'express'
import passport from './config/passport'
import session from 'express-session'
import { connect } from './config/mongo'
import * as dotenv from 'dotenv'

dotenv.config()

// Connect to MongoDB
connect()

const app = express()

const port = process.env.PORT || 80

const corsOptions = {
  credentials: true,
  origin: true
}

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors(corsOptions))

// Session configuration for passport
app.use(session({
  secret: process.env.SECRET_TOKEN || 'fallback-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}))

// Initialize passport
app.use(passport.initialize())
app.use(passport.session())

// API routes dengan prefix /api untuk Vercel
app.use('/api/users', usersRoutes)
app.use('/api/files', filesRoutes)
app.use('/api/articles', articlesRoutes)
app.use('/api/topics', topicsRoutes)
app.use('/api/auth', oauthRoutes)

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
