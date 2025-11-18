import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

import { bugRoutes } from './api/bug/bug.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { authRoutes } from './api/auth/auth.routes.js'
import { loggerMiddleware } from './middlewares/logger.middleware.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3030

// CORS setup
const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL, 
]

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
)

app.use(express.json())
app.use(cookieParser())
app.use(loggerMiddleware)

// API routes
app.use('/api/bug', bugRoutes)
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)

// Static hosting (production mode)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
  })
}

app.listen(PORT, () => console.log('Server ready at port', PORT))
