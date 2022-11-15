const mongoose = require('mongoose')

const Comment = mongoose.model(
  'Comment',
  new mongoose.Schema(
    {
      user_id: { type: mongoose.Types.ObjectId, required: true },
      username: { type: String, required: true },
      spotifyTrack: { type: Object },
      comment: { type: String, required: true },
      post_id: { type: mongoose.Types.ObjectId }
    },
    { collection: 'comments' }
  )
)

module.exports = Comment