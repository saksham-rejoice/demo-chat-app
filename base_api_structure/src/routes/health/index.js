import { healthController } from "../../controllers/health/index.js";

export const healthRouter = (app) => {
  app.get("/health", healthController);
  
  // Test logger endpoint
  app.get("/test-logger", async (req, res) => {
    const { logInfo } = await import("../../services/loggerService.js");
    await logInfo("Test log entry", { action: "TEST", timestamp: new Date() });
    res.json({ message: "Log test initiated" });
  });
};
