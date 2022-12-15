const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const User = mongoose.model(
  "User",
  new mongoose.Schema(
    {
      username: { type: String, required: true, unique: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      spotifyAccessToken: { type: String },
      spotifyRefreshToken: { type: String },
      posts: [{ type: ObjectId, ref: "Post" }],
      comments: [{ type: ObjectId, ref: "Comment" }],
      timestamp: { type: Date, default: Date.now },
    },
    { collection: "users" }
  )
);

module.exports = User;
