import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { type } from "os";

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
      select: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
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

    forgotToken: {
      type: String,
    },
    forgotTokenExpiry: {
      type: Date,
    },
    resetToken: {
      type: String,
    },
    resetTokenExpiry: {
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

userSchema.methods.generateEmailVerificationToken = function () {
  const unhashedToken = crypto.randomBytes(256).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(unhashedToken)
    .digest("hex");

  const expiresIn = Date.now() + 20 * 60 * 1000;
  // Save to user document
  this.emailVerificationToken = hashedToken;
  this.emailVerificationTokenExpiry = expiresIn;

  return { unhashedToken, hashedToken, expiresIn };
};

userSchema.pre("save", async function () {
  if (!this.isModified("forgotToken") || !this.forgotToken) return;

  this.forgotToken = crypto
    .createHash("sha256")
    .update(this.forgotToken)
    .digest("hex");
});

userSchema.pre("save", async function () {
  if (!this.isModified("resetToken") || !this.resetToken) return;

  this.resetToken = crypto
    .createHash("sha256")
    .update(this.resetToken)
    .digest("hex");
});

const User = mongoose.model("User", userSchema);

export default User;
