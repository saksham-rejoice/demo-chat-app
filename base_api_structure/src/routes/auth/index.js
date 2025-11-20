import { register, login, refreshToken } from "../../controllers/auth";

export const authRouter = (app) => {
  app.post("/api/auth/register", register);
  app.post("/api/auth/login", login);
  app.post("/api/auth/refresh", refreshToken);
};