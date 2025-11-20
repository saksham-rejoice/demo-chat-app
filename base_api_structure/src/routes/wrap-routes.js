import { healthRouter } from "./health";
import { authRouter } from "./auth";
import { productRouter } from "./products";
import { cartRouter } from "./cart";
import { fileRouter } from "./files";
import { instagramPostsRouter } from "../routes/instagram";
import { instagramCommentsRouter } from "../routes/instagram/comments";
import { instagramSavedPostRouter } from "../routes/instagram/savedPost";
//import chatRouter from "./chat/index.js";

export const wrapRoutes = (app) => {
  healthRouter(app);
  authRouter(app);
  productRouter(app);
  cartRouter(app);
  fileRouter(app);
  instagramPostsRouter(app);
  instagramCommentsRouter(app);
  instagramSavedPostRouter(app);
  //app.use("/api/chat", chatRouter);
};
