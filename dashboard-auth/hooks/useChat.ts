import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  status: "sent" | "delivered" | "read";
  fileUrl?: string;
  isImportant?: boolean;
  decision?: "accepted" | "rejected";
}

interface User {
  id: string;
  name: string;
  status: "online" | "offline";
  lastSeen: Date;
  isCurrentUser?: boolean;
  userId: string;
}

export const useChat = () => {
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
  const [inputText, setInputText] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const socketRef = useRef<Socket | null>(null);

  const sendFileMessage = (fileUrl: string) => {
    if (!activeChat || !socketRef.current) return;

    const userInfo = localStorage.getItem("user");
    const currentUser = userInfo ? JSON.parse(userInfo) : null;
    const senderName =
      currentUser?.username || currentUser?.email || "Anonymous";
    const receiverUser = users.find((u) => u.userId === activeChat);

    if (!receiverUser) return;

    const tempId = `temp-${Date.now()}-${Math.random()}`;
    const tempMessage: Message = {
      id: tempId,
      text: "File",
      sender: "user",
      timestamp: new Date(),
      status: "sent",
      fileUrl,
    };

    setMessages((prev) => ({
      ...prev,
      [receiverUser.name]: [...(prev[receiverUser.name] || []), tempMessage],
    }));

    const messageData = {
      sender: senderName,
      receiver: receiverUser.name,
      receiverId: receiverUser.userId,
      fileUrl,
      tempId,
    };

    socketRef.current.emit("file_message", messageData);
  };

  // Mark messages as read when viewing a chat
  const readMessagesRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (activeChat && socketRef.current) {
      const receiverUser = users.find((u) => u.userId === activeChat);
      if (receiverUser) {
        const chatMessages = messages[receiverUser.name] || [];
        chatMessages.forEach((message) => {
          if (
            message.sender === "bot" &&
            message.status !== "read" &&
            message.id &&
            !readMessagesRef.current.has(message.id)
          ) {
            readMessagesRef.current.add(message.id);
            socketRef.current?.emit("message_read", { messageId: message.id });
          }
        });
      }
    }
  }, [activeChat, messages, users]);

  useEffect(() => {
    // Connect to Socket.IO server
    socketRef.current = io("http://localhost:5000");

    socketRef.current.on("connect", () => {
      setIsConnected(true);

      // Get user info and join with real name
      const userInfo = localStorage.getItem("user");
      if (userInfo) {
        const user = JSON.parse(userInfo);
        socketRef.current?.emit("user_join", {
          name: user.username || user.email || "Anonymous",
        });
        // Join user's personal room
        socketRef.current?.emit("join_room", user._id);
      }
    });

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
    });

    // Listen for file messages
    socketRef.current.on("file_message", (data) => {
      const userInfo = localStorage.getItem("user");
      const currentUser = userInfo ? JSON.parse(userInfo) : null;
      const currentUserName =
        currentUser?.username || currentUser?.email || "Anonymous";

      const newMessage: Message = {
        id: data.id || `${Date.now()}-${Math.random()}`,
        text: "File",
        sender: data.sender === currentUserName ? "user" : "bot",
        timestamp: new Date(data.timestamp),
        status:
          data.status ||
          (data.sender === currentUserName ? "sent" : "delivered"),
        fileUrl: data.fileUrl,
      };

      const chatKey =
        data.sender === currentUserName ? data.receiver : data.sender;

      setMessages((prev) => {
        const existingMessages = prev[chatKey] || [];
        // Check if message already exists to prevent duplicates
        const messageExists = existingMessages.some(
          (msg) =>
            msg.id === newMessage.id || (data.tempId && msg.id === data.tempId)
        );

        if (messageExists) {
          return prev;
        }

        return {
          ...prev,
          [chatKey]: [...existingMessages, newMessage],
        };
      });

      // Send read receipt for received file messages (only once)
      if (
        data.sender !== currentUserName &&
        data.id &&
        newMessage.status !== "read"
      ) {
        socketRef.current?.emit("message_read", { messageId: data.id });
        // Send acknowledgement
        socketRef.current?.emit("message_acknowledgement_ack", {
          messageId: data.id,
        });
      }
    });

    // Listen for incoming messages
    socketRef.current.on("private_message", (data) => {
      const userInfo = localStorage.getItem("user");
      const currentUser = userInfo ? JSON.parse(userInfo) : null;
      const currentUserName =
        currentUser?.username || currentUser?.email || "Anonymous";

      const newMessage: Message = {
        id: data.id || `${Date.now()}-${Math.random()}`,
        text: data.message,
        sender: data.sender === currentUserName ? "user" : "bot",
        timestamp: new Date(data.timestamp),
        status:
          data.status ||
          (data.sender === currentUserName ? "sent" : "delivered"),
        fileUrl: data.fileUrl,
        isImportant: data.isImportant,
        decision: data.decision,
      };

      const chatKey =
        data.sender === currentUserName ? data.receiver : data.sender;

      setMessages((prev) => {
        const existingMessages = prev[chatKey] || [];
        // Check if message already exists to prevent duplicates
        const messageExists = existingMessages.some(
          (msg) =>
            msg.id === newMessage.id || (data.tempId && msg.id === data.tempId)
        );

        if (messageExists) {
          return prev;
        }

        return {
          ...prev,
          [chatKey]: [...existingMessages, newMessage],
        };
      });
      // Send read receipt for received messages (only once)
      if (
        data.sender !== currentUserName &&
        data.id &&
        newMessage.status !== "read"
      ) {
        socketRef.current?.emit("message_read", { messageId: data.id });
        // Send acknowledgement
        socketRef.current?.emit("message_acknowledgement_ack", {
          messageId: data.id,
        });
      }
    });

    // Listen for message status updates
    socketRef.current.on("message_status_update", (data) => {
      console.log("[STATUS_UPDATE_RECEIVED]", data); // Debug log
      setMessages((prev) => {
        const updated = { ...prev };
        let statusUpdated = false;
        Object.keys(updated).forEach((chatKey) => {
          updated[chatKey] = updated[chatKey].map((msg) => {
            // Match by message ID or temp ID
            if (msg.id === data.messageId || msg.id === data.tempId) {
              statusUpdated = true;
              console.log(
                `[MESSAGE_STATUS_CHANGED] Message ${msg.id} status changed from ${msg.status} to ${data.status}`
              ); // Debug log
              return {
                ...msg,
                status: data.status as "sent" | "delivered" | "read",
                id: data.messageId || msg.id,
              };
            }
            return msg;
          });
        });

        // If status was updated to delivered, send acknowledgment
        if (statusUpdated && data.status === "delivered") {
          socketRef.current?.emit("message_acknowledgement_ack", {
            messageId: data.messageId,
          });
        }

        return updated;
      });
    });

    socketRef.current.on("user_connected", (user: any) => {
      const userInfo = localStorage.getItem("user");
      const currentUser = userInfo ? JSON.parse(userInfo) : null;
      const currentUserName =
        currentUser?.username || currentUser?.email || "Anonymous";

      setUsers((prev) => {
        const existingUser = prev.find((u) => u.name === user.name);
        if (existingUser) {
          return prev.map((u) =>
            u.name === user.name
              ? {
                  ...u,
                  id: user.id,
                  userId: user.userId,
                  status: "online" as const,
                  lastSeen: new Date(),
                }
              : u
          );
        } else {
          return [
            ...prev,
            {
              ...user,
              status: "online" as const,
              lastSeen: new Date(),
              isCurrentUser: user.name === currentUserName,
            },
          ];
        }
      });
    });

    socketRef.current.on("user_status_changed", (data) => {
      console.log("[USER_STATUS_CHANGED]", data); // Debug log
      setUsers((prev) => {
        const existingUser = prev.find((u) => u.name === data.name);
        if (existingUser) {
          // If user goes online, trigger a sync to get latest message statuses
          if (data.status === "online") {
            setTimeout(() => {
              socketRef.current?.emit("sync_users");
            }, 1000); // Small delay to ensure backend has processed status changes
          }
          return prev.map((u) =>
            u.name === data.name
              ? {
                  ...u,
                  id: data.id,
                  userId: data.userId,
                  status: data.status as "online" | "offline",
                  lastSeen: new Date(),
                }
              : u
          );
        } else {
          // Add new user if not exists
          const userInfo = localStorage.getItem("user");
          const currentUser = userInfo ? JSON.parse(userInfo) : null;
          const currentUserName =
            currentUser?.username || currentUser?.email || "Anonymous";
          return [
            ...prev,
            {
              ...data,
              status: data.status as "online" | "offline",
              lastSeen: new Date(),
              isCurrentUser: data.name === currentUserName,
            },
          ];
        }
      });
    });

    socketRef.current.on("users_list", (usersList: any[]) => {
      const userInfo = localStorage.getItem("user");
      const currentUser = userInfo ? JSON.parse(userInfo) : null;
      const currentUserName =
        currentUser?.username || currentUser?.email || "Anonymous";

      setUsers((prevUsers) => {
        const newUsers = usersList
          .filter((user: any) => user.id)
          .map((user: any) => ({
            ...user,
            status: user.status || ("online" as const),
            lastSeen: new Date(),
            isCurrentUser: user.name === currentUserName,
          }));

        // Merge with existing offline users to keep them visible
        const offlineUsers = prevUsers.filter(
          (prevUser) =>
            prevUser.status === "offline" &&
            !newUsers.find((newUser) => newUser.name === prevUser.name)
        );

        return [...newUsers, ...offlineUsers];
      });
    });

    // Handle acknowledgement requests
    socketRef.current.on("request_message_ack", (data) => {
      // Send acknowledgement back to server
      socketRef.current?.emit("message_acknowledgement_ack", {
        messageId: data.messageId,
      });
    });

    // Handle delivery confirmations
    socketRef.current.on("message_delivery_confirmed", (data) => {
      console.log(
        `[DELIVERY_CONFIRMED] Message delivered to ${data.receiverName}`
      );
      // You can show a toast notification here
      // toast.success(`Message delivered to ${data.receiverName}`);
    });

    // Listen for chat history
    socketRef.current.on("chat_history", (chatHistory: any[]) => {
      const userInfo = localStorage.getItem("user");
      const currentUser = userInfo ? JSON.parse(userInfo) : null;
      const currentUserName =
        currentUser?.username || currentUser?.email || "Anonymous";

      const groupedMessages: { [key: string]: Message[] } = {};

      chatHistory.forEach((chat: any) => {
        const senderName = chat.sender.username || chat.sender.email;
        const receiverName = chat.receiver.username || chat.receiver.email;
        const otherUser =
          senderName === currentUserName ? receiverName : senderName;

        // Use actual status from server
        let messageStatus: "sent" | "delivered" | "read";
        if (senderName === currentUserName) {
          messageStatus = chat.isRead ? "read" : chat.status || "sent";
        } else {
          messageStatus = chat.status || "delivered";
        }

        const message: Message = {
          id: chat._id || (Date.now() + Math.random()).toString(),
          text: chat.message,
          sender: senderName === currentUserName ? "user" : "bot",
          timestamp: new Date(chat.createdAt),
          status: messageStatus,
          fileUrl: chat.fileUrl || undefined,
          isImportant: chat.isImportant || false,
          decision: chat.decision || undefined,
        };

        if (!groupedMessages[otherUser]) {
          groupedMessages[otherUser] = [];
        }
        groupedMessages[otherUser].push(message);
      });

      setMessages(groupedMessages);
    });

    // Listen for decision updates on existing messages
    socketRef.current.on(
      "chat_decision_update",
      (data: { messageId: string; decision: "accepted" | "rejected" }) => {
        setMessages((prev) => {
          const updated = { ...prev };
          Object.keys(updated).forEach((chatKey) => {
            updated[chatKey] = updated[chatKey].map((msg) =>
              msg.id === data.messageId
                ? { ...msg, decision: data.decision }
                : msg
            );
          });
          return updated;
        });
      }
    );

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);



  const sendChatDecision = (
  messageId: string,
  decision: "accepted" | "rejected",
  receiverId: string,
  receiverName: string
) => {
  if (!socketRef.current) return;

  const userInfo = localStorage.getItem("user");
  const currentUser = userInfo ? JSON.parse(userInfo) : null;

  socketRef.current.emit("chat_decision", {
    messageId,
    decision,
    sender: currentUser?.username || currentUser?.email || "Anonymous",
    receiver: receiverName,
    receiverId,
  });
};


  const sendMessage = (options?: { text?: string; isImportant?: boolean }) => {
    if (!socketRef.current || !activeChat) return;
    
    const messageText = options?.text || inputText.trim();
    if (!messageText) return;

    const userInfo = localStorage.getItem("user");
    const currentUser = userInfo ? JSON.parse(userInfo) : null;
    const senderName =
      currentUser?.username || currentUser?.email || "Anonymous";
    const receiverUser = users.find((u) => u.userId === activeChat);

    if (!receiverUser) return;

    const tempId = `temp-${Date.now()}-${Math.random()}`;

    // Add message with "sent" status immediately
    const tempMessage: Message = {
      id: tempId,
      text: messageText,
      sender: "user",
      timestamp: new Date(),
      status: "sent",
      isImportant: options?.isImportant
    };

    setMessages((prev) => ({
      ...prev,
      [receiverUser.name]: [...(prev[receiverUser.name] || []), tempMessage],
    }));

    const messageData = {
      message: messageText,
      sender: senderName,
      receiver: receiverUser.name,
      receiverId: receiverUser.userId,
      timestamp: new Date().toISOString(),
      tempId,
      isImportant: options?.isImportant
    };

    socketRef.current.emit("private_message", messageData);
    if (!options?.text) setInputText("");
  };

  const syncUsers = () => {
    socketRef.current?.emit("sync_users");
  };

  const setStatus = (status: "online" | "offline") => {
    socketRef.current?.emit("set_status", { status });
  };

  return {
    messages,
    inputText,
    setInputText,
    isConnected,
    activeChat,
    setActiveChat,
    users,
    sendMessage,
    sendFileMessage,
    syncUsers,
    setStatus,
    sendChatDecision,
  };
};
