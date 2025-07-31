import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const userSchema = new mongoose.Schema(
  {
    identifier: {
      // Email
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },

    about: {
      type: String,
      default: "",
    },
    profilePic: { type: String }, // URL to avatar
    isOnline: { type: Boolean, default: false }, // optional if using Redis

    lastSeen: { type: Date, default: Date.now },
    socketId: { type: String }, // optional: to target sockets
    accessToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Generate JWT
userSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, identifier: this.identifier },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const UserNo = mongoose.model("UserNo", userSchema);
