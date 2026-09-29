import cors from 'cors'
import express from 'express'
import { connectDB } from './config/db.js'
import taskRoutes from './routes/taskRoutes.js'

const app = express()
const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173']
const port = Number(process.env.PORT) || 5000

app.use(cors({ origin: allowedOrigins }))
app.use(express.json())
app.use('/api/tasks', taskRoutes)

app.use((error, request, response, next) => {
  if (response.headersSent) {
    return next(error)
  }

  if (error instanceof SyntaxError && 'body' in error) {
    return response.status(400).json({ message: 'Request body must be valid JSON.' })
  }

  console.error(error)
  return response.status(500).json({ message: 'Something went wrong on the server.' })
})

async function startServer() {
  try {
    await connectDB()
    app.listen(port, () => {
      console.log(`Task API listening on port ${port}`)
    })
  } catch (error) {
    console.error(`Server failed to start: ${error.name}: ${error.message}`)
    process.exitCode = 1
  }
}

startServer()