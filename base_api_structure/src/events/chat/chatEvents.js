// ...existing code...
import { Chat, User } from "../../models";

export const handleChatEvents = (io, socket) => {
  // Handle user connection
  socket.on("user_join", async (userData) => {
    try {
      console.info(
        `[USER_JOIN_ATTEMPT] Socket ${socket.id} attempting to join with data:`,
        userData
      );

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

      if (!dbUser) {
        console.warn(
          `[USER_NOT_FOUND_FALLBACK] User ${userName} not found, trying alternate lookup`
        );

        // Try to find user by email or username separately
        dbUser = await User.findOne({
          $or: [{ username: userName }, { email: userName }],
        });

        if (dbUser) {
          console.info(
            `[USER_FOUND_ALTERNATE] User ${userName} (${dbUser._id}) found, updating socket info`
          );

          // User exists, just update socket info
          dbUser.socketId = socket.id;
          dbUser.status = "online";
          dbUser.lastSeen = new Date();
          await dbUser.save();
        } else {
          console.error(
            `[AUTH_ERROR] User ${userName} not found in database - rejecting connection`
          );
          socket.emit("error", { message: "User not found in system" });
          return;
        }
      }

      socket.join(dbUser._id.toString());
      console.info(
        `[ROOM_JOINED] Socket ${socket.id} joined room ${dbUser._id.toString()}`
      );

      // Notify all clients about user connection
      io.emit("user_status_changed", {
        id: socket.id,
        name: userName,
        status: "online",
        userId: dbUser._id,
      });
      console.info(
        `[USER_JOIN_SUCCESS] ${userName} (${dbUser._id}) connected with socket ${socket.id}`
      );

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
      console.info(
        `[USERS_LIST_SENT] Sent ${usersList.length} users to ${dbUser._id}`
      );

      // Update undelivered messages to delivered (not read)
      const undeliveredMessages = await Chat.updateMany(
        { receiver: dbUser._id, status: "sent" },
        { status: "delivered" }
      );

      const updatedCount = undeliveredMessages.modifiedCount || 0;
      if (updatedCount > 0) {
        console.info(
          `[UNDELIVERED_UPDATED] Updated ${updatedCount} messages to 'delivered' for user ${dbUser._id}`
        );

        const deliveredMessages = await Chat.find({
          receiver: dbUser._id,
          status: "delivered",
        }).populate("sender", "username email _id");

        // Notify senders that messages are now delivered
        deliveredMessages.forEach((msg) => {
          console.info(
            `[NOTIFY_SENDER_DELIVERED] Notifying sender ${msg.sender._id} that message ${msg._id} was delivered`
          );
          io.to(msg.sender._id.toString()).emit("message_status_update", {
            messageId: msg._id.toString(),
            status: "delivered",
          });
        });

        // Send acknowledgement requests to newly online user
        deliveredMessages.forEach((msg) => {
          console.info(
            `[REQUEST_ACK_SENT] Requesting ack from user ${dbUser._id} for message ${msg._id}`
          );
          socket.emit("request_message_ack", {
            messageId: msg._id.toString(),
          });
        });
      } else {
        console.info(
          `[NO_UNDELIVERED_MSGS] No undelivered messages for user ${dbUser._id}`
        );
      }

      // Send previous chat messages to user
      const previousChats = await Chat.find({
        $or: [{ sender: dbUser._id }, { receiver: dbUser._id }],
      })
        .populate("sender receiver", "username email")
        .sort({ createdAt: 1 });

      console.info(
        `[CHAT_HISTORY_SENT] Sent ${previousChats.length} messages to user ${dbUser._id}`
      );
      socket.emit("chat_history", previousChats);
    } catch (error) {
      console.error("[USER_JOIN_ERROR] Error in user_join:", error);
      socket.emit("error", { message: "Failed to process user join" });
    }
  });

  socket.on("private_message", async (data) => {
    try {
      console.info("[PRIVATE_MSG_RECEIVED] Data:", data);

      const { message, sender, receiver, receiverId, tempId } = data;

      // Validate required fields
      if (!message || !receiver || !receiverId) {
        console.error(
          "[PRIVATE_MSG_VALIDATION_ERROR] Missing required fields:",
          { message: !!message, receiver: !!receiver, receiverId: !!receiverId }
        );
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

      if (!senderUser) {
        console.error(
          `[SENDER_NOT_FOUND] Sender ${sender} not found in database`
        );
        socket.emit("error", { message: "Sender not found" });
        return;
      }

      if (!receiverUser) {
        console.error(
          `[RECEIVER_NOT_FOUND] Receiver ${receiver} not found in database`
        );
        socket.emit("error", { message: "Receiver not found" });
        return;
      }

      console.info(
        `[USERS_RESOLVED] Sender: ${senderUser._id}, Receiver: ${receiverUser._id}`
      );

      // Save message to database with initial status
      const chatMessage = new Chat({
        sender: senderUser._id,
        receiver: receiverUser._id,
        message,
        status: "sent",
        isRead: false,
      });
      await chatMessage.save();

      console.info(
        `[MSG_SAVED] id=${chatMessage._id} from=${senderUser._id} to=${receiverUser._id} tempId=${tempId} status=sent`
      );

      const messageData = {
        id: chatMessage._id.toString(),
        senderId: senderUser._id.toString(),
        receiverId: receiverUser._id.toString(),
        sender: senderUser.username || senderUser.email,
        receiver: receiverUser.username || receiverUser.email,
        message,
        timestamp: chatMessage.createdAt,
        isRead: false,
        tempId,
        status: "sent",
      };

      // Check if receiver is actually online (both socket presence AND database status)
      const receiverSockets = await io
        .in(receiverUser._id.toString())
        .fetchSockets();
      const isReceiverOnline =
        receiverSockets.length > 0 && receiverUser.status === "online";

      console.info(
        `[RECEIVER_STATUS_CHECK] Receiver ${receiverUser._id}: socketCount=${receiverSockets.length}, dbStatus=${receiverUser.status}, isOnline=${isReceiverOnline}`
      );

      if (isReceiverOnline) {
        // Receiver is actually connected and online
        io.to(receiverUser._id.toString()).emit("private_message", messageData);
        console.info(
          `[MSG_EMITTED] Sent message ${chatMessage._id} to receiver ${receiverUser._id}`
        );

        // Update status to delivered since receiver is online
        await Chat.findByIdAndUpdate(chatMessage._id, { status: "delivered" });

        // Notify sender that message was delivered
        socket.emit("message_status_update", {
          messageId: chatMessage._id.toString(),
          tempId,
          status: "delivered",
        });

        console.info(
          `[MSG_DELIVERED] id=${chatMessage._id} from=${senderUser._id} to=${receiverUser._id} tempId=${tempId}`
        );
      } else {
        // Receiver is offline, message stays as "sent"
        console.warn(
          `[MSG_QUEUED] id=${chatMessage._id} from=${senderUser._id} to=${receiverUser._id} - receiver offline, message queued`
        );
      }
    } catch (error) {
      console.error(
        "[PRIVATE_MSG_ERROR] Error handling private message:",
        error
      );
      socket.emit("error", { message: "Failed to process message" });
    }
  });

  socket.on("disconnect", async () => {
    try {
      console.info(`[DISCONNECT_INITIATED] Socket ${socket.id} disconnecting`);

      // 1️⃣ Find the user by socket ID and mark them offline
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
        // 2️⃣ Leave all rooms associated with this socket
        socket.leave(user._id.toString());
        console.info(
          `[ROOM_LEFT] Socket ${socket.id} left room ${user._id.toString()}`
        );

        // 3️⃣ Notify everyone (or optionally only friends / contacts)
        io.emit("user_status_changed", {
          userId: user._id.toString(),
          name: user.username || user.email,
          status: "offline",
        });

        console.info(
          `[USER_DISCONNECT_SUCCESS] ${user.username || user.email} (${
            user._id
          }) disconnected - status broadcast sent`
        );
      } else {
        console.warn(
          `[USER_NOT_FOUND_DISCONNECT] No user found for socket ${socket.id}`
        );
      }
    } catch (error) {
      console.error("[DISCONNECT_ERROR] Error in disconnect:", error);
    }
  });

  socket.on("join_room", (userId) => {
    console.info(
      `[ROOM_JOIN_REQUEST] Socket ${socket.id} joining room ${userId}`
    );
    socket.join(userId);
    console.info(
      `[ROOM_JOIN_SUCCESS] Socket ${socket.id} successfully joined room ${userId}`
    );
  });

  socket.on("leave_room", (userId) => {
    console.info(
      `[ROOM_LEAVE_REQUEST] Socket ${socket.id} leaving room ${userId}`
    );
    socket.leave(userId);
    console.info(
      `[ROOM_LEAVE_SUCCESS] Socket ${socket.id} successfully left room ${userId}`
    );
  });

  socket.on("set_status", async (data) => {
    try {
      const { status } = data;
      console.info(
        `[STATUS_CHANGE_REQUEST] Socket ${socket.id} requesting status change to: ${status}`
      );

      const user = await User.findOneAndUpdate(
        { socketId: socket.id },
        {
          status: status,
          lastSeen: new Date(),
        },
        { new: true }
      );

      if (!user) {
        console.warn(
          `[STATUS_CHANGE_USER_NOT_FOUND] No user found for socket ${socket.id}`
        );
        return;
      }

      if (status === "online" || status === "offline") {
        io.emit("user_status_changed", {
          id: socket.id,
          name: user.username || user.email,
          status: status,
          userId: user._id,
        });
        console.info(
          `[STATUS_CHANGE_BROADCAST] User ${user._id} status changed to ${status}`
        );

        // When user goes online, update undelivered messages to delivered
        if (status === "online") {
          const undeliveredMessages = await Chat.updateMany(
            { receiver: user._id, status: "sent" },
            { status: "delivered" }
          );

          const updatedCount = undeliveredMessages.modifiedCount || 0;
          if (updatedCount > 0) {
            console.info(
              `[UNDELIVERED_UPDATED_STATUS] Updated ${updatedCount} messages to 'delivered' for user ${user._id} on status change to online`
            );

            const deliveredMessages = await Chat.find({
              receiver: user._id,
              status: "delivered",
            }).populate("sender", "username email _id");

            // Notify senders that messages are now delivered
            deliveredMessages.forEach((msg) => {
              console.info(
                `[NOTIFY_SENDER_DELIVERED_STATUS] Notifying sender ${msg.sender._id} that message ${msg._id} was delivered (via status change)`
              );
              io.to(msg.sender._id.toString()).emit("message_status_update", {
                messageId: msg._id.toString(),
                status: "delivered",
              });
            });
          } else {
            console.info(
              `[NO_UNDELIVERED_MSGS_STATUS] No undelivered messages for user ${user._id} on status change`
            );
          }
        }
      } else {
        console.warn(
          `[INVALID_STATUS] Socket ${socket.id} attempted to set invalid status: ${status}`
        );
      }
    } catch (error) {
      console.error("[SET_STATUS_ERROR] Error setting status:", error);
    }
  });

  socket.on("message_read", async (data) => {
    try {
      const { messageId } = data;

      if (!messageId) {
        console.error(
          "[MSG_READ_NO_ID] Message ID is required for read receipt"
        );
        return;
      }

      console.info(
        `[MSG_READ_REQUEST] Processing read receipt for message ${messageId}`
      );

      // Update message status to read
      const updatedMessage = await Chat.findByIdAndUpdate(
        messageId,
        {
          status: "read",
          isRead: true,
          readAt: new Date(),
        },
        { new: true }
      ).populate("sender receiver", "username email _id");

      if (updatedMessage) {
        // Notify the sender that message was read
        io.to(updatedMessage.sender._id.toString()).emit(
          "message_status_update",
          {
            messageId: updatedMessage._id.toString(),
            status: "read",
          }
        );

        console.info(
          `[MSG_READ_SUCCESS] messageId=${updatedMessage._id} sender=${updatedMessage.sender._id} receiver=${updatedMessage.receiver._id} - sender notified`
        );
      } else {
        console.warn(
          `[MSG_READ_NOT_FOUND] Message ${messageId} not found for read receipt`
        );
      }
    } catch (error) {
      console.error("[MSG_READ_ERROR] Error handling message read:", error);
    }
  });

  socket.on("message_acknowledgement_ack", async (data) => {
    try {
      const { messageId } = data;

      if (!messageId) {
        console.error(
          "[MSG_ACK_NO_ID] Message ID is required for acknowledgement"
        );
        return;
      }

      console.info(
        `[MSG_ACK_REQUEST] Processing acknowledgement for message ${messageId}`
      );

      const message = await Chat.findById(messageId).populate(
        "sender receiver",
        "username email _id"
      );

      if (message) {
        // Send acknowledgement back to sender with current status
        io.to(message.sender._id.toString()).emit(
          "message_delivery_confirmed",
          {
            messageId: message._id.toString(),
            status: message.status,
            deliveredAt: new Date(),
            receiverName: message.receiver.username || message.receiver.email,
          }
        );

        console.info(
          `[MSG_ACK_SUCCESS] Delivery confirmed: messageId=${
            message._id
          } status=${message.status} sentTo=${message.sender._id} receiver=${
            message.receiver.username || message.receiver.email
          }`
        );
      } else {
        console.warn(
          `[MSG_ACK_NOT_FOUND] Message ${messageId} not found for acknowledgement`
        );
      }
    } catch (error) {
      console.error(
        "[MSG_ACK_ERROR] Error handling message acknowledgement:",
        error
      );
    }
  });

  socket.on("sync_users", async () => {
    try {
      console.info(`[SYNC_REQUEST] Socket ${socket.id} requesting user sync`);

      // Find current user
      const currentUser = await User.findOne({ socketId: socket.id });
      if (!currentUser) {
        console.warn(
          `[SYNC_USER_NOT_FOUND] No user found for socket ${socket.id}`
        );
        return;
      }

      // Send users list
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
      console.info(
        `[SYNC_USERS_LIST_SENT] Sent ${usersList.length} users to ${currentUser._id}`
      );

      // Send updated chat history with current message statuses
      const previousChats = await Chat.find({
        $or: [{ sender: currentUser._id }, { receiver: currentUser._id }],
      })
        .populate("sender receiver", "username email")
        .sort({ createdAt: 1 });

      socket.emit("chat_history", previousChats);
      console.info(
        `[SYNC_SUCCESS] Sent sync to user ${currentUser._id} with ${previousChats.length} messages`
      );
    } catch (error) {
      console.error("[SYNC_ERROR] Error syncing users:", error);
    }
  });

  socket.on("file_message", async (data) => {
    try {
      console.info("[FILE_MSG_RECEIVED] Data:", data);

      const { sender, receiver, receiverId, fileUrl, tempId } = data;

      // Validate
      if (!receiverId || !fileUrl) {
        console.error(
          "[FILE_MSG_VALIDATION_ERROR] Missing receiverId or fileUrl"
        );
        socket.emit("error", { message: "Invalid file message data" });
        return;
      }

      // Find sender/receiver in DB
      const senderUser = await User.findOne({
        $or: [{ username: sender }, { email: sender }],
      });
      const receiverUser = await User.findById(receiverId);

      if (!senderUser) {
        console.error(
          `[FILE_SENDER_NOT_FOUND] Sender ${sender} not found in database`
        );
        socket.emit("error", { message: "Sender not found" });
        return;
      }

      if (!receiverUser) {
        console.error(
          `[FILE_RECEIVER_NOT_FOUND] Receiver ${receiverId} not found in database`
        );
        socket.emit("error", { message: "Receiver not found" });
        return;
      }

      console.info(
        `[FILE_USERS_RESOLVED] Sender: ${senderUser._id}, Receiver: ${receiverUser._id}`
      );

      // Save to DB
      const chatMessage = new Chat({
        sender: senderUser._id,
        receiver: receiverUser._id,
        message: "File",
        fileUrl,
        status: "sent",
        isRead: false,
      });
      await chatMessage.save();

      console.info(
        `[FILE_SAVED] id=${chatMessage._id} from=${senderUser._id} to=${receiverUser._id} fileUrl=${fileUrl} tempId=${tempId} status=sent`
      );

      const messageData = {
        id: chatMessage._id.toString(),
        senderId: senderUser._id.toString(),
        receiverId: receiverUser._id.toString(),
        sender,
        receiver,
        message: "File",
        fileUrl,
        timestamp: chatMessage.createdAt,
        isRead: false,
        tempId,
        status: "sent",
      };

      // Check if receiver is actually online (both socket presence AND database status)
      const receiverSockets = await io
        .in(receiverUser._id.toString())
        .fetchSockets();
      const isReceiverOnline =
        receiverSockets.length > 0 && receiverUser.status === "online";

      console.info(
        `[FILE_RECEIVER_STATUS_CHECK] Receiver ${receiverUser._id}: socketCount=${receiverSockets.length}, dbStatus=${receiverUser.status}, isOnline=${isReceiverOnline}`
      );

      if (isReceiverOnline) {
        // Receiver is online - send message and update to delivered
        io.to(receiverUser._id.toString()).emit("file_message", messageData);
        console.info(
          `[FILE_MSG_EMITTED] Sent file message ${chatMessage._id} to receiver ${receiverUser._id}`
        );

        await Chat.findByIdAndUpdate(chatMessage._id, { status: "delivered" });

        // Notify sender that message was delivered
        socket.emit("message_status_update", {
          messageId: chatMessage._id.toString(),
          tempId,
          status: "delivered",
        });

        console.info(
          `[FILE_DELIVERED] id=${chatMessage._id} from=${senderUser._id} to=${receiverUser._id} tempId=${tempId}`
        );
      } else {
        // Receiver is offline, message stays as "sent"
        console.warn(
          `[FILE_QUEUED] id=${chatMessage._id} from=${senderUser._id} to=${receiverUser._id} - receiver offline, file message queued`
        );
      }
    } catch (error) {
      console.error("[FILE_MSG_ERROR] Error handling file message:", error);
      socket.emit("error", { message: "Failed to process file message" });
    }
  });
};
// ...existing code...
