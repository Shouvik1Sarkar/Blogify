import mongoose from "mongoose";

const playListSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const PlayList = mongoose.model("PlayList", playListSchema);

export default PlayList;
