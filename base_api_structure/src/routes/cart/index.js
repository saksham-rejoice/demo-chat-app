import { addToCart, getCart, updateCart, removeFromCart } from "../../controllers/cart/index.js";
import { authenticate } from "../../middleware/auth.js";

export const cartRouter = (app) => {
  app.post("/api/cart/create", authenticate, addToCart);
  app.get("/api/cart/list", authenticate, getCart);
  app.put("/api/cart/update", authenticate, updateCart);
  app.delete("/api/cart/remove", authenticate, removeFromCart);
};