const mongoose = require("mongoose");
const { categoryList } = require("../constants/constants");

const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter the post title"],
    },
    category: {
      type: String,
      enum: categoryList,
      validate: {
        validator: function (value) {
          return categoryList.includes(value);
        },
        message: "Invalid category provided",
      },
      required: [true, "Please enter the post category"],
    },
    description: {
      type: String,
      required: [true, "Please enter the post description"],
    },
    creator: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    thumbnail: {
      type: String,
    },
  },
  { timestamps: true }
);

const PostModel = mongoose.model("post", postSchema);

module.exports = PostModel;
