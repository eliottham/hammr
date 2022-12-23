const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const schema = new mongoose.Schema(
  {
    author: { type: ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    spotifyTrack: { type: Object },
    description: { type: String },
    comments: [{ type: ObjectId, ref: "Comment" }],
    liked_users: [{ type: ObjectId, ref: "User" }],
    timestamp: { type: Date, default: Date.now },
  },
  { collection: "posts" }
);

schema.post("save", async (doc) => {
  await mongoose.model("User").findByIdAndUpdate(doc.author, {
    $push: { posts: doc._id },
  });
});

schema.post("deleteOne", { document: true }, async (doc) => {
  await mongoose.model("User").findByIdAndUpdate(doc.author, {
    $pull: { posts: doc._id, comments: { $in: doc.comments } },
  });
  if (doc.comments) {
    await mongoose.model("Comment").deleteMany({ _id: { $in: doc.comments } });
  }
});

module.exports = mongoose.model("Post", schema);
