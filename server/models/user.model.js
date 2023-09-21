const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const bcrypt = require("bcrypt-nodejs");

const userSchema = new mongoose.Schema(
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
      select: false,
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

  { collection: "users" }
);

userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function (password) {
  return User.findById(this._id)
    .select("password")
    .exec(function (err, user) {
      return bcrypt.compareSync(password, user.password);
    });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
