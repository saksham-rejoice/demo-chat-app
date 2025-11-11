import mongoose from "mongoose";

const instagramImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    filename:{
        type: String,
        required: true
    },
    fileId:{
        type: String,
        required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const InstagramImage = mongoose.model("InstagramImage", instagramImageSchema);

export default InstagramImage;
