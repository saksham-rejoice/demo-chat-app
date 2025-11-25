import { getProducts, getProductById } from "../../controllers/products/index.js";

export const productRouter = (app) => {
  app.get("/api/products", getProducts);
  app.get("/api/products/:id", getProductById);
};