const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "請輸入名字"],
    },
    email: {
      type: String,
      required: [true, "請輸入 Email"],
      unique: true,
      lowercase: true,
      select: false,
    },
    password: {
      type: String,
      required: [true, "請輸入密碼"],
      minlength: 8,
      select: false,
    },
    sex: {
      type: String,
      enum: ["male", "female", "none"],
      default: "none",
    },
    photo: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    googleId: {
      type: String,
    },
    followers: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    following: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { versionKey: false }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
