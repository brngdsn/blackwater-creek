const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const multer = require('multer')
const cookieParser = require('cookie-parser')
const { version } = require('../package.json')
const crypto = require('crypto')

// helpers functions
const randomString = function (len) {
  var buf = []
    , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    , charlen = chars.length;

  for (var i = 0; i < len; ++i) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }

  return buf.join('');
};

const getKey = () => new Promise((resolve, reject) => {
  const key = crypto.randomBytes(48, (error, buffer) => {
    const key = buffer.toString('hex')
    resolve(key)
  })
})

// instantiate web server
const storage = multer.memoryStorage()
const upload = multer({ storage, preservePath: true })
const app = express()
const port = process.env.PORT || 5000
const PROTOCOL = process.env.CORS_PROTOCOL || 'https'
const HOST = process.env.CORS_HOST || 'brngdsn.github.io'
const API_PORT = process.env.CORS_PORT || 80

// configure api server
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(cors({ credentials: true, origin: `${PROTOCOL}://${HOST}:${API_PORT}` }))
app.use(morgan('tiny'))
app.use((req, res, next) => {
  res.set('X-Blackwater-Creek-API-Version', `v${version}`)
  next()
})

// api routes
app.get('/', async (req, res) => {
  const key = await getKey()
  res.send({
    message: key,
    version
  })
  res.end()
})

// web app serverp
app.listen(port, () => console.log(`Blackwater Creek API listening at ${PROTOCOL}://${HOST}:${port}`))
