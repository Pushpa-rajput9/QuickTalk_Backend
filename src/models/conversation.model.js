import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    isGroup: { type: Boolean, default: false },
    name: { type: String }, // Group name
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },

    groupAvatar: { type: String }, // Optional for group chat
  },
  { timestamps: true }
);

export const Conversation = mongoose.model("Conversation", ConversationSchema);
