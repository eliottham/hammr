const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema(
    {
      username: { type: String, required: true, unique: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      spotifyAccessToken: { type: String },
      spotifyRefreshToken: { type: String },
      post_ids: { type: Array },
      comment_ids: { type: Array },
    },
    { collection: "users" }
  )
);

module.exports = User;
