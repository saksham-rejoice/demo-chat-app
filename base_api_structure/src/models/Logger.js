import mongoose from "mongoose";

const LoggerSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      required: true,
      enum: ["info", "warn", "error", "debug"],
    },
    message: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    action: {
      type: String,
      default: null,
    },
    metadata: {
      type: Object,
      default: {},
    },
    ip: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Logger", LoggerSchema);