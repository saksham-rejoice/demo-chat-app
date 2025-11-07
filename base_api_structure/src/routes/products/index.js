import { getProducts, getProductById } from "../../controllers/products";

export const productRouter = (app) => {
  app.get("/api/products", getProducts);
  app.get("/api/products/:id", getProductById);
};