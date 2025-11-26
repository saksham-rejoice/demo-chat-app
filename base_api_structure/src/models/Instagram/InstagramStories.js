import mongoose, { Schema } from "mongoose";

const InstagramStoriesSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageId: {
      type: Schema.Types.ObjectId,
      ref: "InstagramImage",
      required: true,
    },
    caption: {
      type: String,
    },
    viewers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
  },
  {
    timestamps: true,
  }
);
const InstagramStories = mongoose.model(
  "InstagramStories",
  InstagramStoriesSchema
);

export default InstagramStories;
