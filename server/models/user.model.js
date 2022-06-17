const mongoose = require('mongoose')

const User = mongoose.model(
  'User',
  new mongoose.Schema(
    {
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      spotifyAccessToken: { type: String },
      spotifyRefreshToken: { type: String }
    },
    { collection: 'users' }
  )
)

module.exports = User