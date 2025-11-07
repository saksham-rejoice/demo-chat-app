import { Chat, User } from "../../models";

export const handleChatEvents = (io, socket) => {
  // Handle user connection
  socket.on("user_join", async (userData) => {
    try {
      const userName = userData.name || `User-${socket.id.slice(0, 6)}`;

      // Find and update user in database
      const dbUser = await User.findOneAndUpdate(
        { $or: [{ username: userName }, { email: userName }] },
        {
          socketId: socket.id,
          status: "online",
          lastSeen: new Date(),
        },
        { new: true }
      );

      if (!dbUser) {
        console.error(`User ${userName} not found in database`);
        return;
      }

      // Notify all clients about user connection
      io.emit("user_status_changed", {
        id: socket.id,
        name: userName,
        status: "online",
        userId: dbUser._id,
      });
      console.log(`User ${userName} connected`);

      // Send current users list to new user
      const allUsers = await User.find(
        {},
        "username email socketId status lastSeen"
      );
      const usersList = allUsers.map((user) => ({
        id: user.socketId,
        name: user.username || user.email,
        status: user.status,
        userId: user._id,
      }));
      socket.emit("users_list", usersList);

      // Send previous chat messages to user
      const previousChats = await Chat.find({
        $or: [{ sender: dbUser._id }, { receiver: dbUser._id }],
      })
        .populate("sender receiver", "username email")
        .sort({ createdAt: 1 });

      socket.emit("chat_history", previousChats);
    } catch (error) {
      console.error("Error in user_join:", error);
    }
  });

  socket.on("private_message", async (data) => {
    try {
      console.log("Received private message:", data);

      const { message, sender, receiver, receiverId, tempId } = data;

      // Validate required fields
      if (!message || !receiver || !receiverId) {
        console.error("Message, receiver and receiverId are required");
        socket.emit("error", { message: "Invalid message data" });
        return;
      }

      // Find sender and receiver users
      const senderUser = await User.findOne({
        $or: [{ username: sender }, { email: sender }],
      });
      const receiverUser = await User.findOne({
        $or: [{ username: receiver }, { email: receiver }],
      });

      if (!senderUser || !receiverUser) {
        socket.emit("error", { message: "User not found" });
        return;
      }

      // Save message to database
      const chatMessage = new Chat({
        sender: senderUser._id,
        receiver: receiverUser._id,
        message,
        isRead: false,
      });
      await chatMessage.save();

      const messageData = {
        id: chatMessage._id.toString(),
        sender,
        receiver,
        message,
        timestamp: chatMessage.createdAt,
        isRead: false,
        tempId
      };

      console.log("Sending private message:", messageData);

      // Update sender's message status to delivered
      if (tempId) {
        socket.emit("message_status_update", {
          messageId: chatMessage._id.toString(),
          tempId: tempId,
          status: "delivered"
        });
      }

      // Check if receiver is online
      if (receiverUser.status === "online" && receiverUser.socketId) {
        // Send to online receiver
        socket.to(receiverUser.socketId).emit("private_message", messageData);
        console.log(
          `Message sent to ${receiver} at socket ${receiverUser.socketId}`
        );
      } else {
        console.log(`Receiver ${receiver} is offline`);
      }
    } catch (error) {
      console.error("Error handling private message:", error);
      socket.emit("error", { message: "Failed to process message" });
    }
  });

  socket.on("disconnect", async () => {
    try {
      const user = await User.findOneAndUpdate(
        { socketId: socket.id },
        {
          status: "offline",
          lastSeen: new Date(),
          socketId: null,
        },
        { new: true }
      );

      if (user) {
        io.emit("user_status_changed", {
          id: socket.id,
          name: user.username || user.email,
          status: "offline",
          userId: user._id,
        });
        console.log(`User ${user.username || user.email} disconnected`);
      }
    } catch (error) {
      console.error("Error in disconnect:", error);
    }
  });

  socket.on("join_room", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on("leave_room", (userId) => {
    socket.leave(userId);
    console.log(`User ${userId} left room`);
  });

  socket.on("set_status", async (data) => {
    try {
      const { status } = data;
      const user = await User.findOneAndUpdate(
        { socketId: socket.id },
        {
          status: status,
          lastSeen: new Date(),
        },
        { new: true }
      );

      if (user && (status === "online" || status === "offline")) {
        io.emit("user_status_changed", {
          id: socket.id,
          name: user.username || user.email,
          status: status,
          userId: user._id,
        });

        console.log(
          `User ${user.username || user.email} set status to ${status}`
        );
      }
    } catch (error) {
      console.error("Error setting status:", error);
    }
  });

  socket.on("sync_users", async () => {
    try {
      const allUsers = await User.find(
        {},
        "username email socketId status lastSeen"
      );
      const usersList = allUsers.map((user) => ({
        id: user.socketId,
        name: user.username || user.email,
        status: user.status,
        userId: user._id,
      }));
      socket.emit("users_list", usersList);
    } catch (error) {
      console.error("Error syncing users:", error);
    }
  });

  socket.on("message_read", async (data) => {
    try {
      const { messageId } = data;
      
      // Update message as read in database
      const updatedMessage = await Chat.findByIdAndUpdate(
        messageId,
        { isRead: true },
        { new: true }
      ).populate("sender", "username email socketId");

      if (updatedMessage && updatedMessage.sender.socketId) {
        // Notify sender that message was read
        io.to(updatedMessage.sender.socketId).emit("message_status_update", {
          messageId: messageId,
          status: "read"
        });
      }
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  });
};
