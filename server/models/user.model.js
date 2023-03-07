const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const User = mongoose.model(
  "User",
  new mongoose.Schema(
    {
      username: { type: String, required: true, unique: true, minLength: 4 },
      email: { type: String, required: true, unique: true },
      avatarUrl: { type: String },
      avatarPublicId: { type: String },
      password: { type: String, required: true, minLength: 5, select: false },
      firstName: { type: String },
      lastName: { type: String },
      spotifyAccessToken: { type: String },
      spotifyRefreshToken: { type: String },
      followers: [{ type: ObjectId, ref: "User" }],
      following: [{ type: ObjectId, ref: "User" }],
      bio: { type: String, maxLength: 150 },
      posts: [{ type: ObjectId, ref: "Post" }],
      comments: [{ type: ObjectId, ref: "Comment" }],
      likedPosts: [{ type: ObjectId, ref: "Post" }],
      likedComments: [{ type: ObjectId, ref: "Comment" }],
      creationDate: { type: Date, default: Date.now },
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
