const mongoose = require("mongoose");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const ObjectId = mongoose.Types.ObjectId;

const schema = new mongoose.Schema(
  {
    targetUser: { type: ObjectId, ref: "User", required: true },
    fromUser: { type: ObjectId, ref: "User", required: true },
    targetPost: { type: ObjectId, ref: "Post" },
    targetComment: { type: ObjectId, ref: "Comment" },
    comment: { type: ObjectId, ref: "Comment" },
    type: {
      type: String,
      enum: ["like", "comment"],
      default: "like",
    },
    read: { type: Boolean, default: false },
    creationDate: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 7 },
  },
  { collection: "notifications" }
);

schema.plugin(aggregatePaginate);

module.exports = mongoose.model("Notification", schema);
