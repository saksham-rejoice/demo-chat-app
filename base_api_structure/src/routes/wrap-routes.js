import { healthRouter } from "./health";
import { authRouter } from "./auth";
import { productRouter } from "./products";
import { cartRouter } from "./cart";

export const wrapRoutes = (app) => {
  healthRouter(app);
  authRouter(app);
  productRouter(app);
  cartRouter(app);
};
