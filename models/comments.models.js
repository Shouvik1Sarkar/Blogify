import mongoose from "mongoose";

const commentsSchema = new mongoose.Schema(
  {
    createBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    comment: {
      type: String,
      required: true,
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  },
  { timestamps: true },
);

const Comments = mongoose.model("Comments", commentsSchema);

export default Comments;
