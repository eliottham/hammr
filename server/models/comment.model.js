const mongoose = require("mongoose");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const ObjectId = mongoose.Types.ObjectId;

const schema = new mongoose.Schema(
  {
    author: { type: ObjectId, ref: "User", required: true },
    spotifyTrack: { type: Object },
    comment: { type: String },
    post: { type: ObjectId, ref: "Post" },
    likedUsers: [{ type: ObjectId, ref: "User" }],
    edited: { type: Boolean, default: false },
    creationDate: { type: Date, default: Date.now },
  },
  { collection: "comments" }
);

schema.post("save", async (doc) => {
  await mongoose.model("User").findByIdAndUpdate(doc.author, {
    $push: { comments: doc._id },
  });
  if (doc.post) {
    await mongoose.model("Post").findByIdAndUpdate(doc.post, {
      $push: { comments: doc._id },
    });
  }
});

schema.post("deleteOne", { document: true }, async (doc) => {
  await mongoose.model("User").findByIdAndUpdate(doc.author, {
    $pull: { comments: doc._id },
  });
  if (doc.post) {
    await mongoose.model("Post").findByIdAndUpdate(doc.post, {
      $pull: { comments: doc._id },
    });
  }
});

schema.plugin(aggregatePaginate);

module.exports = mongoose.model("Comment", schema);
