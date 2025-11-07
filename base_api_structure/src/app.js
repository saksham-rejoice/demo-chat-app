import express, { json } from "express";
import { wrapRoutes } from "./routes/wrap-routes";
import connectDB from "./config/db";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
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
app.use(json());

const PORT = process.env.PORT || 5000;
wrapRoutes(app);

import { handleChatEvents } from "./events";

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
