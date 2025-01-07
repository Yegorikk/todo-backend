import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import taskRoutes from './routes/tasks.js'

dotenv.config()

const app = express()

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // URL вашого React застосунку
  credentials: true
}))
app.use(express.json())

// Логування запитів для дебагу
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/', taskRoutes)

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Something broke!' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})