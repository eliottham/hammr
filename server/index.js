const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const User = require('./models/user.model.js')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const axios = require('axios')
const bodyParser = require('body-parser')

const JWT_SECRET = 'secret123'
const SPOTIFY_CLIENT_ID = '2f11b20a4be74840a549fb4d5d6783c1'
const SPOTIFY_CLIENT_SECRET_KEY = 'b852a8dc6a27420a9df7c0b8ed2a79ce'
const SPOTIFY_REDIRECT_URI = 'http://localhost:1337/spotifyAuthorizationCallback'
const SPOTIFY_USER_SCOPE = 'user-read-private user-read-email user-read-playback-state user-modify-playback-state user-follow-read user-library-modify user-library-read streaming playlist-modify-private user-read-currently-playing user-read-recently-played'

app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json())

// // Add headers before the routes are defined
// app.use(function (req, res, next) {

//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')

//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')

//   // Request headers you wish to allow
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader('Access-Control-Allow-Credentials', true)

//   // Pass to next layer of middleware
//   next()
// })

mongoose.connect('mongodb://localhost:27017/zam')


app.get('/token', (req, res) => res.json({ status: 200, token: req.cookies.token }))

app.post('/register', async (req, res) => {
  console.log(req.body)
  try {
    await User.create({
      email: req.body.email,
      password: req.body.password
    })
    res.json({ status: 200 })
  } catch (err) {
    res.json({ status: 400, error: 'Email already exists' })
  }
})

app.post('/login', async (req, res) => {
  console.log(req.body)
  try {
    const user = await User.findOne({
      email: req.body.email,
      password: req.body.password
    })

    if (user) {
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email
        },
        JWT_SECRET,
        {
          // expiresIn: '72h'
        })
      res.cookie('token', token, { httpOnly: true })
      return res.json({ success: true, user })
    } else {
      return res.json({ success: false })
    }
  } catch (err) {
    res.json({ status: 401, error: err })
  }
})

app.get('/user', useAuth(async (req, res, user) => {
  if (user) {
    res.json({ success: true, user })
  }
}))

function useAuth(handler) {
  return async (req, res) => {
    try {
      const token = req.cookies['token']
      const decoded = jwt.verify(token, JWT_SECRET)
      const user = await User.findById(ObjectId(decoded.id))
      handler(req, res, user)
    } catch (err) {
      res.json({ success: false, errors: [ err.message ] })
    }
  }
}

function generateRandomString(length) {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

async function getSpotifyTokens({ user, code }) {
  const params = code ?
    {
      code: code || null,
      redirect_uri: SPOTIFY_REDIRECT_URI,
      grant_type: 'authorization_code'
    } :
    {
      grant_type: 'refresh_token',
      refresh_token: user.spotifyRefreshToken
    }
  try {
    const response = await axios({
      url: 'https://accounts.spotify.com/api/token',
      method: 'post',
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET_KEY).toString('base64'))
      },
      params: params
    })
    let spotifyAccessToken, spotifyRefreshToken
    if (response.status === 200) {
      if (response.data.access_token && response.data.refresh_token) {
        spotifyAccessToken = response.data.access_token
        spotifyRefreshToken = response.data.refresh_token
        await User.findOneAndUpdate(
          {
            _id: user._id
          },
          {
            spotifyAccessToken: spotifyAccessToken,
            spotifyRefreshToken: spotifyRefreshToken
          }
        )
      } else if (response.data.access_token) {
        spotifyAccessToken = response.data.access_token
        await User.findOneAndUpdate(
          {
            _id: user._id
          },
          {
            spotifyAccessToken: spotifyAccessToken
          }
        )
      }
    }
    return {
      spotifyAccessToken,
      spotifyRefreshToken
    }
  } catch (err) {
    console.log(err)
    return {}
  }
}

app.get('/spotifyTokens', useAuth(async (req, res, user) => {
  res.json(await getSpotifyTokens({ user }))
}))

app.get('/spotifyAuthorizationCallback', useAuth((req, res, user) => {
  const state = req.query.state || null
  if (state === null) {
    res.redirect('/#' +
      new URLSearchParams({
        error: 'state_mismatch'
      })).toString()
  } else {
    getSpotifyTokens({ user, code: req.query.code })
    res.redirect('http://localhost:3000/')
  }
}))

app.get('/spotifyAuthorization', (req, res) => {
  const state = generateRandomString(16)
  const scope = SPOTIFY_USER_SCOPE
  res.redirect('https://accounts.spotify.com/authorize?' +
    new URLSearchParams({
      response_type: 'code',
      client_id: SPOTIFY_CLIENT_ID,
      scope: scope,
      redirect_uri: SPOTIFY_REDIRECT_URI,
      state: state,
      show_dialog: true
    }).toString())
})

function spotifyApi(axiosArgs) {
  axiosArgs.config.headers = { 'Authorization': `Bearer ${axiosArgs.user.spotifyAccessToken}` }
  axios(axiosArgs.config)
    .then(response => {
      if (axiosArgs.success && typeof axiosArgs.success === 'function') {
        response.newTokens = axiosArgs.newTokens
        axiosArgs.success(response)
      }
    })
    .catch(async error => {
      if (typeof error.toJSON === 'function') {
        error = await error.toJSON()
      }
      // Bad or expired token, need to re-authenticate with refresh token
      if (error.status === 401) {
        let { spotifyAccessToken, spotifyRefreshToken } = await getSpotifyTokens({ user: axiosArgs.user })
        // new tokens have been added to user, but use returned values to avoid another db lookup for the updated user
        axiosArgs.user.spotifyAccessToken = spotifyAccessToken
        axiosArgs.user.spotifyRefreshToken = spotifyRefreshToken
        axiosArgs.newTokens = true
        spotifyApi(axiosArgs)
      } else {
        if (axiosArgs.failure && typeof axiosArgs.failure === 'function') {
          axiosArgs.failure(error)
        }
      }
    })
}

app.post('/spotifySearch', useAuth((req, res, user) => {
  spotifyApi({
    user,
    config: {
      url: 'https://api.spotify.com/v1/search',
      method: 'get',
      params: {
        q: req.body.q,
        type: req.body.type || 'album,artist,track'
      }
    },
    success: (response) => {
      res.status(200).json({ response: response.data })
    },
    failure: (error) => {
      res.status(400).json({ error })
    }
  })
}))

app.post('/spotifyGetTracks', useAuth((req, res, user) => {
  spotifyApi({
    user,
    config: {
      url: 'https://api.spotify.com/v1/tracks/',
      method: 'get',
      params: {
        id: req.body.id
      }
    },
    success: (response) => {
      res.status(200).json({ response: response.data })
    },
    failure: (error) => {
      res.status(400).json({ error })
    }
  })
}))

app.post('/playSpotifyTrack', useAuth((req, res, user) => {
  const { track, deviceId } = req.body
  spotifyApi({
    user,
    config: {
      url: `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
      method: 'put',
      data: {
        uris: [ track.uri ]
      }
    },
    success: (response) => {
      res.status(200).json({ response: response.data })
    },
    failure: (error) => {
      res.status(400).json({ error })
    }
  })
}))

function ObjectId(id) {
  return mongoose.Types.ObjectId(id)
}

app.listen(1337, () => {
  console.log('Server started on 1337')
})