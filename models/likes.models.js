import mongoose from "mongoose";

const likesSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetId: {
      // comment or Blog Id
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    targetType: {
      // comment or Blog Id
      type: String,
      enum: ["Blog", "Comment"],
      required: true,
    },
  },
  { timestamps: true },
);
// Prevent double-like
likesSchema.index({ user: 1, targetId: 1, targetType: 1 }, { unique: true });

const Likes = mongoose.model("Likes", likesSchema);

export default Likes;
