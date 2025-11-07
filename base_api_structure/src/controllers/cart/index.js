import { Cart } from "../../models";
import { success, badRequest } from "../../helpers";

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
    success(req, res, { message: "Added to cart successfully" });
  } catch (error) {
    badRequest(req, res, error, "Error adding to cart");
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return success(req, res, { items: [] });
    }
    
    success(req, res, { items: [cart.products] });
  } catch (error) {
    badRequest(req, res, error, "Failed to fetch cart items");
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

    success(req, res, { message: "Cart updated successfully" });
  } catch (error) {
    badRequest(req, res, error, "Error updating cart");
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

    success(req, res, { message: "Cart item removed successfully" });
  } catch (error) {
    badRequest(req, res, error, "Error removing cart item");
  }
};