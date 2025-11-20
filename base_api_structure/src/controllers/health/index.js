import { success } from "../../helpers";

export const healthController = (request, response) => {
  success(response, "Health check successful", {
    health: "ok",
    uptime: process.uptime(),
  });
};
