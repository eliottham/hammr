const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const User = mongoose.model(
  "User",
  new mongoose.Schema(
    {
      username: { type: String, required: true, unique: true },
      email: { type: String, required: true, unique: true },
      avatar: { type: String },
      password: { type: String, required: true, minLength: 5 },
      name: { type: String },
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
    {
      toJSON: {
        transform(doc, ret) {
          delete ret.password;
          delete ret.spotifyAccessToken;
          delete ret.spotifyRefreshToken;
        },
      },
    },
    { collection: "users" }
  )
);

module.exports = User;
