import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  status: "sent" | "delivered" | "read";
}

interface User {
  id: string;
  name: string;
  status: "online" | "offline";
  lastSeen: Date;
  isCurrentUser?: boolean;
}

export const useChat = () => {
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
  const [inputText, setInputText] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Connect to Socket.IO server
    socketRef.current = io("http://localhost:5000");

    socketRef.current.on("connect", () => {
      setIsConnected(true);
      console.log("Connected to server");

      // Get user info and join with real name
      const userInfo = localStorage.getItem("user");
      if (userInfo) {
        const user = JSON.parse(userInfo);
        socketRef.current?.emit("user_join", {
          name: user.username || user.email || "Anonymous",
        });
      }
    });

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
      console.log("Disconnected from server");
    });

    // Listen for incoming messages
    socketRef.current.on("private_message", (data) => {
      const userInfo = localStorage.getItem("user");
      const currentUser = userInfo ? JSON.parse(userInfo) : null;
      const currentUserName =
        currentUser?.username || currentUser?.email || "Anonymous";

      const newMessage: Message = {
        id: data.id || Date.now().toString(),
        text: data.message,
        sender: data.sender === currentUserName ? "user" : "bot",
        timestamp: new Date(data.timestamp),
        status: data.sender === currentUserName ? "delivered" : "read",
      };

      const chatKey =
        data.sender === currentUserName ? data.receiver : data.sender;
      setMessages((prev) => ({
        ...prev,
        [chatKey]: [...(prev[chatKey] || []), newMessage],
      }));

      // Send read receipt for received messages
      if (data.sender !== currentUserName) {
        socketRef.current?.emit("message_read", { messageId: data.id });
      }
    });

    // Listen for message status updates
    socketRef.current.on("message_status_update", (data) => {
      setMessages((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach(chatKey => {
          updated[chatKey] = updated[chatKey].map(msg => {
            // Match by tempId or actual message id
            if (msg.id === data.messageId || msg.id === data.tempId) {
              return { ...msg, status: data.status, id: data.messageId || msg.id };
            }
            return msg;
          });
        });
        return updated;
      });
    });

    socketRef.current.on("user_connected", (user: any) => {
      const userInfo = localStorage.getItem("user");
      const currentUser = userInfo ? JSON.parse(userInfo) : null;
      const currentUserName = currentUser?.username || currentUser?.email || "Anonymous";
      
      setUsers((prev) => {
        const existingUser = prev.find(u => u.name === user.name);
        if (existingUser) {
          return prev.map(u => 
            u.name === user.name 
              ? { ...u, id: user.id, status: "online" as const, lastSeen: new Date() }
              : u
          );
        } else {
          return [...prev, {
            ...user,
            status: "online" as const,
            lastSeen: new Date(),
            isCurrentUser: user.name === currentUserName
          }];
        }
      });
    });

    socketRef.current.on("user_status_changed", (data) => {
      setUsers((prev) =>
        prev.map((u) =>
          u.name === data.name
            ? { ...u, id: data.id, status: data.status as "online" | "offline", lastSeen: new Date() }
            : u
        )
      );
    });

    socketRef.current.on("users_list", (usersList: any[]) => {
      const userInfo = localStorage.getItem("user");
      const currentUser = userInfo ? JSON.parse(userInfo) : null;
      const currentUserName = currentUser?.username || currentUser?.email || "Anonymous";
      
      setUsers(
        usersList
          .filter((user: any) => user.id) // Filter out users with null IDs
          .map((user: any) => ({
            ...user,
            status: user.status || "online" as const,
            lastSeen: new Date(),
            isCurrentUser: user.name === currentUserName
          }))
      );
    });

    // Listen for chat history
    socketRef.current.on("chat_history", (chatHistory: any[]) => {
      const userInfo = localStorage.getItem("user");
      const currentUser = userInfo ? JSON.parse(userInfo) : null;
      const currentUserName = currentUser?.username || currentUser?.email || "Anonymous";
      
      const groupedMessages: {[key: string]: Message[]} = {};
      
      chatHistory.forEach((chat: any) => {
        const senderName = chat.sender.username || chat.sender.email;
        const receiverName = chat.receiver.username || chat.receiver.email;
        const otherUser = senderName === currentUserName ? receiverName : senderName;
        
        const message: Message = {
          id: chat._id || (Date.now() + Math.random()).toString(),
          text: chat.message,
          sender: senderName === currentUserName ? "user" : "bot",
          timestamp: new Date(chat.createdAt),
          status: chat.isRead ? "read" : "delivered"
        };
        
        if (!groupedMessages[otherUser]) {
          groupedMessages[otherUser] = [];
        }
        groupedMessages[otherUser].push(message);
      });
      
      setMessages(groupedMessages);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!inputText.trim() || !socketRef.current || !activeChat) return;

    const userInfo = localStorage.getItem("user");
    const currentUser = userInfo ? JSON.parse(userInfo) : null;
    const senderName =
      currentUser?.username || currentUser?.email || "Anonymous";
    const receiverUser = users.find((u) => u.id === activeChat);

    if (!receiverUser) return;

    const tempId = Date.now().toString();
    const messageText = inputText;
    
    // Add message with "sent" status immediately
    const tempMessage: Message = {
      id: tempId,
      text: messageText,
      sender: "user",
      timestamp: new Date(),
      status: "sent"
    };
    
    setMessages((prev) => ({
      ...prev,
      [receiverUser.name]: [...(prev[receiverUser.name] || []), tempMessage],
    }));

    const messageData = {
      message: messageText,
      sender: senderName,
      receiver: receiverUser.name,
      receiverId: activeChat,
      timestamp: new Date().toISOString(),
      tempId
    };

    socketRef.current.emit("private_message", messageData);
    setInputText("");
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
    syncUsers,
    setStatus
  };
};