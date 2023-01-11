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
      followers: [{ type: ObjectId, ref: "User" }],
      following: [{ type: ObjectId, ref: "User" }],
      bio: { type: String, maxLength: 150 },
      posts: [{ type: ObjectId, ref: "Post" }],
      comments: [{ type: ObjectId, ref: "Comment" }],
      liked_posts: [{ type: ObjectId, ref: "Post" }],
      liked_comments: [{ type: ObjectId, ref: "Comment" }],
      timestamp: { type: Date, default: Date.now },
    },
    { collection: "users" }
  )
);

module.exports = User;
