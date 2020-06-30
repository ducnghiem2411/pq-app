require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const router = require('./api/index')
/*------------------------------------------*/

// const PORT = process.env.PORT || 8080

app.use(router)

//middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

mongoose.connect(
  process.env.MONGODB_URI ||
    'mongodb://dbadmin:01sirensong@ds235947.mlab.com:35947/heroku_g0k2zh6s',
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


app.listen(process.env.PORT || 8080, () => {
  console.log(`App is running on ${process.env.PORT} PORT `)
})

