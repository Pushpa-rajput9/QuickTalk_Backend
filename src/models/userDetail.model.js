import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    realUserId: { type: mongoose.Schema.Types.ObjectId, ref: "UserNo" },
    username: {
      type: String,
      default: "",
    },
    email: {
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
  },
  { timestamps: true }
);
export const User = mongoose.model("User", UserSchema);
