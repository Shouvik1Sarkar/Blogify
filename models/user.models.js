import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minLength: 2,
      maxLength: 35,
    },
    userName: {
      type: String,
      required: [true, "User Name is required"],
      unique: true,
      trim: true,
      minLength: 6,
      maxLength: 25,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      minLength: 4,
      maxLength: 25,
    },

    emailVerificationToken: {
      type: String,
    },
    emailVerificationTokenExpiry: {
      type: Date,
    },

    accessToken: {},
    accessTokenExpiresIn: {},

    refreshToken: {},
    refreshTokenExpiresIn: {},
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified(this.password)) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

userSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
