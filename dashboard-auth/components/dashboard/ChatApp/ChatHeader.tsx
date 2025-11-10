import React from "react";
import { MessageSquare } from "lucide-react";

type User = {
  userId: string;
  name: string;
};

type Props = {
  users: User[];
  activeChat: string | null;
  onOpenSidebar: () => void;
};

const ChatHeader: React.FC<Props> = ({ users, activeChat, onOpenSidebar }) => {
  return (
    <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg p-4">
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenSidebar}
          className="md:hidden p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <MessageSquare size={20} />
          </div>
          <h1 className="text-xl font-bold">
            {activeChat ? users.find((u) => u.userId === activeChat)?.name : "Select a user"}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;


