const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const User = require("./user.model.js");
const Post = require("./post.model.js");

const schema = new mongoose.Schema(
  {
    author: { type: ObjectId, ref: "User", required: true },
    spotifyTrack: { type: Object },
    comment: { type: String },
    post: { type: ObjectId, ref: "Post" },
    timestamp: { type: Date, default: Date.now },
  },
  { collection: "comments" }
);

schema.post("save", async (doc) => {
  await User.findByIdAndUpdate(doc.author, {
    $push: { comments: doc._id },
  });
  if (doc.post) {
    await Post.findByIdAndUpdate(doc.post, {
      $push: { comments: doc._id },
    });
  }
});

schema.post("deleteOne", { document: true }, async (doc) => {
  await User.findByIdAndUpdate(doc.author, {
    $pull: { comments: doc._id },
  });
  if (doc.post) {
    await Post.findByIdAndUpdate(doc.post, {
      $pull: { comments: doc._id },
    });
  }
});

module.exports = mongoose.model("Comment", schema);
