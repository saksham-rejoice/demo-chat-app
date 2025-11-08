import { Chat, User } from "../../models";

export const handleChatEvents = (io, socket) => {
  // Handle user connection
  socket.on("user_join", async (userData) => {
    try {
      const userName = userData.name || `User-${socket.id.slice(0, 6)}`;

      // Find and update user in database
      let dbUser = await User.findOneAndUpdate(
        { $or: [{ username: userName }, { email: userName }] },
        {
          socketId: socket.id,
          status: "online",
          lastSeen: new Date(),
        },
        { new: true }
      );

      console.log(dbUser);

      if (!dbUser) {
        console.log(
          `User ${userName} not found in chat system, checking if exists in auth...`
        );
        // Try to find user by email or username separately
        dbUser = await User.findOne({
          $or: [{ username: userName }, { email: userName }],
        });

        if (dbUser) {
          // User exists, just update socket info
          dbUser.socketId = socket.id;
          dbUser.status = "online";
          dbUser.lastSeen = new Date();
          await dbUser.save();
        } else {
          console.error(`User ${userName} not found in database`);
          socket.emit("error", { message: "User not found in system" });
          return;
        }
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

      // Mark all unread messages to this user as read (including delivered and sent)
      const updatedMessages = await Chat.updateMany(
        { receiver: dbUser._id, isRead: false },
        { status: "read", isRead: true }
      );

      console.log(
        `Marked ${updatedMessages.modifiedCount} messages as read for user ${userName}`
      );

      // Notify senders of read status updates
      if (updatedMessages.modifiedCount > 0) {
        const readMessages = await Chat.find({
          receiver: dbUser._id,
          status: "read",
          isRead: true,
        }).populate("sender", "username email socketId");

        readMessages.forEach((msg) => {
          if (msg.sender.socketId) {
            io.to(msg.sender.socketId).emit("message_status_update", {
              messageId: msg._id.toString(),
              status: "read",
            });
          }
        });
      }

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

      // Save message to database with initial status
      const chatMessage = new Chat({
        sender: senderUser._id,
        receiver: receiverUser._id,
        message,
        status: "sent",
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
        tempId,
      };

      // Check if receiver is online and send message
      if (receiverUser.status === "online" && receiverUser.socketId) {
        socket.to(receiverUser.socketId).emit("private_message", messageData);

        // Update status to delivered when sent to online user
        await Chat.findByIdAndUpdate(chatMessage._id, { status: "delivered" });

        socket.emit("message_status_update", {
          messageId: chatMessage._id.toString(),
          tempId,
          status: "delivered",
        });
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
        { isRead: true, status: "read" },
        { new: true }
      ).populate("sender", "username email socketId");

      if (updatedMessage && updatedMessage.sender.socketId) {
        // Notify sender that message was read
        io.to(updatedMessage.sender.socketId).emit("message_status_update", {
          messageId: messageId,
          status: "read",
        });
      }
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  });

  socket.on("file_message", async (data) => {
    try {
      const { sender, receiver, receiverId, fileUrl, tempId } = data;

      if (!receiver || !receiverId || !fileUrl) {
        socket.emit("error", { message: "Invalid file message data" });
        return;
      }

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

      const chatMessage = new Chat({
        sender: senderUser._id,
        receiver: receiverUser._id,
        message: "File",
        fileUrl,
        status: "sent",
        isRead: false,
      });
      await chatMessage.save();

      const messageData = {
        id: chatMessage._id.toString(),
        sender,
        receiver,
        message: "File",
        fileUrl,
        timestamp: chatMessage.createdAt,
        isRead: false,
        tempId,
      };

      if (receiverUser.status === "online" && receiverUser.socketId) {
        socket.to(receiverUser.socketId).emit("file_message", messageData);
        await Chat.findByIdAndUpdate(chatMessage._id, { status: "delivered" });
        socket.emit("message_status_update", {
          messageId: chatMessage._id.toString(),
          tempId,
          status: "delivered",
        });
      }
    } catch (error) {
      console.error("Error handling file message:", error);
      socket.emit("error", { message: "Failed to process file message" });
    }
  });
};
