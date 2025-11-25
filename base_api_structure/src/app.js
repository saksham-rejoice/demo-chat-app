import express, { json } from "express";
import { wrapRoutes } from "./routes/wrap-routes.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import morgan from "morgan";
import { logInfo } from "./services/loggerService.js";
import { handleChatEvents } from "./events/index.js";
import "./services/loggerService.js";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
app.use(cors());
app.use(morgan("dev"));
app.use(json());

const PORT = process.env.PORT || 5000;
wrapRoutes(app);

// Test logger queue on startup
setTimeout(() => {
  const isEnable = process.env.IS_REDIS_ENABLE;
  if (isEnable === "true") {
    logInfo("Server started", { 
      action: "SERVER_START",
      metadata: {
        port: PORT,
        timestamp: new Date().toISOString()
      }
    });
  }
  console.log("initilized!!!");
}, 2000);

// Socket.IO event handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Handle chat events
  handleChatEvents(io, socket);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => console.log(`Server listening at port ${PORT}`));
