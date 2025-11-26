import mongoose from "mongoose";

const instagramPostSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      required: true,
      trim: true,
    },
    imageDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InstagramImage",
    },
    location: {
      type: String,
      trim: true,
    },
    hashtagRefs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hashtags",
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
          trim: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const InstagramPost = mongoose.model("InstagramPost", instagramPostSchema);

export default InstagramPost;
