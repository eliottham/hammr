const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Post = require("./post.model.js");
const Comment = require("./comment.model.js");

const schema = new mongoose.Schema(
  {
    user_id: { type: ObjectId, required: true },
    post_id: { type: ObjectId },
    comment_id: { type: ObjectId },
    timestamp: { type: Date, default: Date.now },
  },
  { collection: "likes" }
);

schema.post("save", function (doc) {
  if (doc.post_id) {
    Post.findByIdAndUpdate(doc.post_id, {
      $push: { like_user_ids: doc.user_id },
    });
  } else if (doc.comment_id) {
    Comment.findByIdAndUpdate(doc.comment_id, {
      $push: { like_user_ids: doc.user_id },
    });
  }
});

module.exports = mongoose.model("Like", schema);
