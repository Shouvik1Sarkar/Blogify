// models/tag.model.js

import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      // required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true },
); // ← this automatically adds createdAt & updatedAt

export const Tag = mongoose.model("Tag", tagSchema);
