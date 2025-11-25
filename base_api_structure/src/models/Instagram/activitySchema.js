import mongoose from "mongoose";
const ActivitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      required: true,
      enum: [
        "FOLLOW",
        "UNFOLLOW",
        "LOGIN",
        "POST_UPLOAD",
        "POST_DELETE",
        "UPDATE_PROFILE",
        "POST_LIKE",
        "POST_UNLIKE",
        "POST_COMMENT",
      ],
    },
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InstagramPost",
      default: null,
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);
export default mongoose.model("activity", ActivitySchema);
