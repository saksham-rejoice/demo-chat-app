import { Cart } from "../../models";
import { success, badRequest, internalServerError } from "../../helpers";

export const addToCart = async (req, res) => {
  try {
    const { products } = req.body;
    const userId = req.user._id;

    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = new Cart({ userId, products });
    } else {
      cart.products = products;
    }
    
    await cart.save();
    success(res, "Added to cart successfully", {});
  } catch (error) {
    internalServerError(res, "Error adding to cart");
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return success(res, "Cart is empty", { items: [] });
    }
    
    success(res, "Cart fetched successfully", { items: [cart.products] });
  } catch (error) {
    internalServerError(res, "Failed to fetch cart items");
  }
};

export const updateCart = async (req, res) => {
  try {
    const { products } = req.body;
    const userId = req.user._id;

    await Cart.findOneAndUpdate(
      { userId },
      { products },
      { new: true, upsert: true }
    );

    success(res, "Cart updated successfully", {});
  } catch (error) {
    internalServerError(res, "Error updating cart");
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { products } = req.body;
    const userId = req.user._id;

    await Cart.findOneAndUpdate(
      { userId },
      { products }
    );

    success(res, "Cart item removed successfully", {});
  } catch (error) {
    internalServerError(res, "Error removing cart item");
  }
};