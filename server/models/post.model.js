const mongoose = require('mongoose')

const Post = mongoose.model(
  'Post',
  new mongoose.Schema(
    {
      user_id: { type: mongoose.Types.ObjectId, required: true },
      username: { type: String, required: true },
      title: { type: String, required: true },
      spotifyTrack: { type: Object },
      description: { type: String },
      comments: { type: Array }
    },
    { collection: 'posts' }
  )
)

module.exports = Post