import { success } from "../../helpers";
import { logInfo } from "../../services/loggerService.js";

export const healthController = async (request, response) => {
  // Test logging
  await logInfo("Health check performed", { action: "HEALTH_CHECK", ip: request.ip });
  
  success(response, "Health check successful", {
    health: "ok",
    uptime: process.uptime(),
  });
};
