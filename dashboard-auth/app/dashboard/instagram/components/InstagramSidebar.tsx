import React from 'react';
import {
  Home,
  Search,
  Compass,
  Film,
  MessageSquare,
  Heart,
  PlusSquare,
  Menu,
} from 'lucide-react';

const InstagramSidebar = () => {
  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-gray-800 p-6 sticky top-0 h-screen bg-gray-900">
      <nav className="flex-1 space-y-2">
        <button className="flex items-center gap-4 w-full p-3 hover:bg-gray-800 rounded-lg transition-colors text-white">
          <Home className="w-6 h-6" />
          <span className="font-medium">Home</span>
        </button>
        <button className="flex items-center gap-4 w-full p-3 hover:bg-gray-800 rounded-lg transition-colors text-gray-300">
          <Search className="w-6 h-6" />
          <span>Search</span>
        </button>
        <button className="flex items-center gap-4 w-full p-3 hover:bg-gray-800 rounded-lg transition-colors text-gray-300">
          <Compass className="w-6 h-6" />
          <span>Explore</span>
        </button>
        <button className="flex items-center gap-4 w-full p-3 hover:bg-gray-800 rounded-lg transition-colors text-gray-300">
          <Film className="w-6 h-6" />
          <span>Reels</span>
        </button>
        <button className="flex items-center gap-4 w-full p-3 hover:bg-gray-800 rounded-lg transition-colors text-gray-300">
          <MessageSquare className="w-6 h-6" />
          <span>Messages</span>
        </button>
        <button className="flex items-center gap-4 w-full p-3 hover:bg-gray-800 rounded-lg transition-colors text-gray-300">
          <Heart className="w-6 h-6" />
          <span>Notifications</span>
        </button>
        <button className="flex items-center gap-4 w-full p-3 hover:bg-gray-800 rounded-lg transition-colors text-gray-300">
          <PlusSquare className="w-6 h-6" />
          <span>Create</span>
        </button>
      </nav>

      <div className="border-t border-gray-800 pt-4">
        <button className="flex items-center gap-4 w-full p-3 hover:bg-gray-800 rounded-lg transition-colors text-gray-300">
          <Menu className="w-6 h-6" />
          <span>More</span>
        </button>
      </div>

      <div className="mt-4 p-3 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
            OM
          </div>
          <div>
            <p className="font-semibold text-sm text-white">Olivia Malone</p>
            <p className="text-xs text-gray-400">Auckland, NZ</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default InstagramSidebar;