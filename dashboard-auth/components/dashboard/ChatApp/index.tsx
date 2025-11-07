"use client";
import React, { useState } from "react";
import { MessageSquare } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import MessageTicks from "./MessageTicks";

const ChatApp = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    messages,
    inputText,
    setInputText,
    isConnected,
    activeChat,
    setActiveChat,
    users,
    sendMessage,
    syncUsers,
    setStatus,
  } = useChat();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`w-80 bg-gray-800 border-r border-gray-700 flex flex-col transition-transform duration-300 z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative fixed inset-y-0 left-0`}
      >
        {/* Sidebar Header */}
        <div className="bg-gray-700 p-4 border-b border-gray-600">
          <h2 className="text-white text-lg font-semibold">
            Users ({users.length})
          </h2>
          <div className={`flex items-center justify-between mt-2`}>
            <div className={`flex items-center space-x-2 text-sm`}>
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-green-400" : "bg-red-400"
                }`}
              ></div>
              <span className="text-gray-300">
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
            {isConnected && (
              <div className="flex space-x-2">
                <button
                  onClick={syncUsers}
                  className="px-2 py-1 rounded text-xs bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                  title="Sync users"
                >
                  ⟲
                </button>
                <button
                  onClick={() => {
                    const currentUser = users.find((u) => u.isCurrentUser);
                    const newStatus =
                      currentUser?.status === "online" ? "offline" : "online";
                    setStatus(newStatus);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    users.find((u) => u.isCurrentUser)?.status === "online"
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gray-500 text-white hover:bg-gray-600"
                  }`}
                >
                  {users.find((u) => u.isCurrentUser)?.status === "online"
                    ? "Go Offline"
                    : "Go Online"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => {
                if (!user.isCurrentUser) {
                  setActiveChat(user.id);
                  setSidebarOpen(false);
                }
              }}
              className={`p-4 border-b border-gray-700 transition-colors ${
                user.isCurrentUser
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:bg-gray-700"
              } ${activeChat === user.id ? "bg-gray-700" : ""}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0)}
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${
                        user.status === "online"
                          ? "bg-green-400"
                          : "bg-gray-400"
                      }`}
                    ></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium">
                      {user.name} {user.isCurrentUser && "(You)"}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {user.status === "online"
                        ? "Online"
                        : `Last seen ${user.lastSeen.toLocaleTimeString()}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <div className="p-4 text-center text-gray-400">
              No users connected
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg p-4">
          <div className="flex items-center space-x-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageSquare size={20} />
              </div>
              <h1 className="text-xl font-bold">
                {activeChat
                  ? users.find((u) => u.id === activeChat)?.name
                  : "Select a user"}
              </h1>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          {!activeChat ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="text-6xl mb-4">
                <MessageSquare className="text-gray-600" size={75} />
              </div>
              <p className="text-lg">Select a user to start messaging</p>
            </div>
          ) : !messages[users.find((u) => u.id === activeChat)?.name || ""] ||
            messages[users.find((u) => u.id === activeChat)?.name || ""]
              .length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="text-6xl mb-4">
                <MessageSquare className="text-gray-600" size={75} />
              </div>
              <p className="text-lg">Start your conversation...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {(
                messages[users.find((u) => u.id === activeChat)?.name || ""] ||
                []
              ).map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="flex flex-col items-end">
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-md ${
                        message.sender === "user"
                          ? "bg-linear-to-r from-blue-500 to-purple-600 text-white"
                          : "bg-gray-700 text-white border border-gray-600"
                      }`}
                    >
                      {message.text}
                    </div>
                    {message.sender === "user" && (
                      <MessageTicks status={message.status} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        {activeChat && (
          <div className="bg-gray-800 border-t border-gray-700 p-4">
            <div className="flex items-center space-x-3 bg-gray-700 rounded-md border border-gray-600 p-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 bg-transparent focus:outline-none text-white placeholder-gray-400"
              />
              <button
                onClick={sendMessage}
                disabled={!inputText.trim()}
                className="bg-linear-to-r from-blue-500 to-purple-600 text-white p-3 rounded-full hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
