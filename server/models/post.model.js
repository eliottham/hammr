const mongoose = require("mongoose");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const ObjectId = mongoose.Types.ObjectId;

const schema = new mongoose.Schema(
  {
    author: { type: ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    spotifyTrack: { type: Object, required: true },
    description: { type: String },
    comments: [{ type: ObjectId, ref: "Comment" }],
    likedUsers: [{ type: ObjectId, ref: "User" }],
    creationDate: { type: Date, default: Date.now },
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

schema.plugin(aggregatePaginate);

module.exports = mongoose.model("Post", schema);
