const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
require('dotenv').config()
const cors = require('cors')
const routes = require('./routes/index')

const connectDb = require('./config/db')

app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))

app.use(express.json())

app.use('/api', routes)
//   /api/auth/ - > Auth route 
//   /api/user/ - > User route 

const PORT = process.env.PORT || 5050

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

connectDb()
