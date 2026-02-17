import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: 5,
      maxLength: 200,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      minLength: 10,
    },

    description: {
      type: String,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    playList: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlayList",
    },

    coverImage: {
      type: String,
    },
  },
  { timestamps: true },
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
