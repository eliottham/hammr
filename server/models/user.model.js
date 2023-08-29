const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const User = mongoose.model(
  "User",
  new mongoose.Schema(
    {
      email: {
        type: String,
        required: true,
        unique: true,
        validate: {
          validator: (v) => {
            return /([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])/.test(
              v
            );
          },
          message: "Email is not valid",
        },
      },
      username: {
        type: String,
        required: true,
        unique: true,
        validate: {
          validator: (v) => {
            return v.length >= 4;
          },
          message: "Username must be at least 4 characters long",
        },
      },
      avatarUrl: { type: String },
      avatarPublicId: { type: String },
      password: {
        type: String,
        required: true,
        select: false,
        validate: {
          validator: (v) => {
            return v.length >= 8;
          },
          message: "Password must be at least 8 characters long",
        },
      },
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
