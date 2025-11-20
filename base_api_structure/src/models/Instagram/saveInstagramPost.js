import mongoose from "mongoose";

const saveInstgramPost = new mongoose.Schema(
  {
    collectionName: {
      type: String,
      required: true,
      default: "Saved Post",
    },
    savedPost: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "InstagramPost",
        default: [],
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const savedPost = mongoose.model("savepost", saveInstgramPost);
export default savedPost;
