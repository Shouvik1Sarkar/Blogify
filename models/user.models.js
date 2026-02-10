import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

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

    emailVerificationToken: {
      type: String,
    },
    emailVerificationTokenExpiry: {
      type: Date,
    },

    accessToken: {
      type: String,
    },
    accessTokenExpiresIn: {
      type: Date,
    },

    refreshToken: {
      type: String,
    },
    refreshTokenExpiresIn: {
      type: Date,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

userSchema.methods.generateAccessToken = async function () {
  return await jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};
userSchema.methods.generateRefreshToken = async function () {
  return await jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );
};

userSchema.methods.generateEmailVerificationToken = async function () {
  const unhashedToken = await crypto.randomBytes(256).toString("hex");

  const hashedToken = await crypto
    .createHash("sha256")
    .update(unhashedToken)
    .digest("hex");

  const expiresIn = Date.now() + 20 * 60 * 1000;

  return { unhashedToken, hashedToken, expiresIn };
};

const User = mongoose.model("User", userSchema);

export default User;
