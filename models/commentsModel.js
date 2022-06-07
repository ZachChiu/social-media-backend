const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, "comment 未填寫"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "使用者 ID 未填寫"],
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
      required: [true, "使用者 ID 未填寫"],
    },
  },
  {
    versionKey: false,
  }
);

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name id createdAt photo",
  });
  next();
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
