import React from "react";
import { Button } from "@/components/ui/button";

type User = {
  id: string;
  name: string;
  status: "online" | "offline";
  lastSeen: Date;
  isCurrentUser?: boolean;
  userId: string;
};

type Props = {
  users: User[];
  isConnected: boolean;
  activeChat: string | null;
  setActiveChat: (id: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onRefresh: () => void;
  onToggleStatus: () => void;
};

const Sidebar: React.FC<Props> = ({
  users,
  isConnected,
  activeChat,
  setActiveChat,
  sidebarOpen,
  setSidebarOpen,
  onRefresh,
  onToggleStatus,
}) => {
  return (
    <div
      className={`w-80 bg-gray-800 border-r border-gray-700 flex flex-col transition-transform duration-300 z-50 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:relative fixed inset-y-0 left-0`}
    >
      <div className="bg-gray-700 p-4 border-b border-gray-600">
        <h2 className="text-white text-lg font-semibold">Users ({users.length})</h2>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-2 text-sm">
            <div
              className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"}`}
            ></div>
            <span className="text-gray-300">{isConnected ? "Connected" : "Disconnected"}</span>
          </div>
          {isConnected && (
            <div className="flex space-x-2">
              <Button
                onClick={onRefresh}
                className="px-2 py-1 rounded text-xs bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                title="Refresh & Sync users"
              >
                ⟲
              </Button>
              <Button
                onClick={onToggleStatus}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  users.find((u) => u.isCurrentUser)?.status === "online"
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-gray-500 text-white hover:bg-gray-600"
                }`}
              >
                {users.find((u) => u.isCurrentUser)?.status === "online" ? "Go Offline" : "Go Online"}
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {users
          .sort((a, b) => {
            if (a.isCurrentUser) return -1;
            if (b.isCurrentUser) return 1;
            return 0;
          })
          .map((user) => (
            <div
              key={user.userId || user.id}
              onClick={() => {
                if (!user.isCurrentUser) {
                  setActiveChat(user.userId);
                  setSidebarOpen(false);
                }
              }}
              className={`p-4 border-b border-gray-700 transition-colors ${
                user.isCurrentUser ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-700"
              } ${activeChat === user.userId ? "bg-gray-700" : ""}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0)}
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${
                        user.status === "online" ? "bg-green-400" : "bg-gray-400"
                      }`}
                    ></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium">
                      {user.name} {user.isCurrentUser && "(You)"}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {user.status === "online" ? "Online" : `Last seen ${user.lastSeen.toLocaleTimeString()}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        {users.length === 0 && (
          <div className="p-4 text-center text-gray-400">No users connected</div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;


