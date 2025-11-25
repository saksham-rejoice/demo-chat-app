import {
  register,
  login,
  refreshToken,
  userDetailsByToken,
} from "../../controllers/auth/index.js";
import {authenticate} from "../../middleware/auth.js";
export const authRouter = (app) => {
  app.post("/api/auth/register", register);
  app.post("/api/auth/login", login);
  app.post("/api/auth/refresh", refreshToken);
  app.get("/api/auth/user",authenticate, userDetailsByToken);
};
