"use client";
import { Home, PlusSquare, Bookmark, Search } from "lucide-react";
import Link from "next/link";

const InstagramSidebar = () => {
  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-gray-800 p-6 sticky top-0 h-screen bg-gray-900">
      <nav className="flex-1 space-y-2">
        <Link
          href={"/dashboard/instagram/feed"}
          className="flex items-center gap-4 w-full p-3 hover:bg-gray-800 rounded-lg transition-colors text-white"
        >
          <Home className="w-6 h-6" />
          <span className="font-medium">Feed</span>
        </Link>
        <Link
          href={"/dashboard/instagram/create"}
          className="flex items-center gap-4 w-full p-3 hover:bg-gray-800 rounded-lg transition-colors text-gray-300"
        >
          <PlusSquare className="w-6 h-6" />
          <span>Create</span>
        </Link>
        <Link
          href={"/dashboard/instagram/save"}
          className="flex items-center gap-4 w-full p-3 hover:bg-gray-800 rounded-lg transition-colors text-gray-300"
        >
          <Bookmark className="w-6 h-6" />
          <span>Save</span>
        </Link>
        <Link
          href={"/dashboard/instagram/explore"}
          className="flex items-center gap-4 w-full p-3 hover:bg-gray-800 rounded-lg transition-colors text-gray-300"
        >
          <Search className="w-6 h-6" />
          <span>Explore</span>
        </Link>
      </nav>
    </aside>
  );
};

export default InstagramSidebar;
