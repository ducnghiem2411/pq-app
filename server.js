require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const router = require('./api/index')
const path = require('path')
/*------------------------------------------*/

//middleware
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//api
app.use(router)


mongoose.connect(
  process.env.MONGODB_URI ||
    process.env.MONGODB_URI2,
  {
    useNewUrlParser: true,
    useCreateIndex : true,
    useUnifiedTopology: true
  },
  err => {
    if (!err) {
      console.log('MONGODB CONNECTED')
    } else {
      console.error(err)
    }
  }
)

//heroku
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('/client/build'))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
  })
}

app.listen(process.env.PORT || 5000, () => {
  console.log(`App is running on ${process.env.PORT} PORT `)
})

