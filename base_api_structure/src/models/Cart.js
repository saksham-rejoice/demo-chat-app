import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  products: [{
    productId: {
      type: Number,
      required: true
    },
    title: String,
    price: Number,
    quantity: {
      type: Number,
      default: 1
    },
    thumbnail: String
  }]
}, {
  timestamps: true
});

export default mongoose.model("Cart", cartSchema);