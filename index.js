import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

// Import routers
import postRoutes from './routes/posts.js'
import userRoutes from './routes/users.js'

const app = express()
dotenv.config()

const PORT = process.env.PORT || 5000

// Middlewares
app.use(express.json({
  limit: '30mb',
  extended: true
}))
app.use(express.urlencoded({
  limit: '30mb',
  extended: true
}))
app.use(cors())

// Routes
app.use('/posts', postRoutes)
app.use('/users', userRoutes)

app.get('/', (req, res) => {
  res.send('Hello to memories API')
})

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on PORT ${ PORT }...`)
    })
  })
  .catch( error => {
    console.log(error)
  })

mongoose.set('useFindAndModify', false)