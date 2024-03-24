// post.js

const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    caption: { type: String, required: true },
    image: { type: String, required: true },
    ingredients: [{ type: String }], // Change type to array of strings
    keywords: [{ type: String }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }], // Array of User references
    reviews: [{
      reviewText: { type: String, required: true },
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
      // add ratings here
    }], // Array of review objects containing review text and user reference
    ratings: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
      rating: { type: Number, default: 0, min: 0, max: 5 }
    }], // Array of User references with ratings
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;