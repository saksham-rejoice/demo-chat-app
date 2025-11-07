import mongoose from "mongoose";

const onlineUserSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  socketId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["online", "offline"],
    default: "online"
  },
  lastSeen: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model("OnlineUser", onlineUserSchema);