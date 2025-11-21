"use client";
import { Heart, Home, Search, PlusSquare } from "lucide-react";
import Header from "../../../components/dashboard/Instagram/Header";
import InstagramSidebar from "./components/InstagramSidebar";
import InstagramStories from "./components/InstagramStories";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import FollowersSection from "./components/FollowersSection";
import SuggestedUsersSection from "./components/SuggestedUsersSection";
import TrendingSection from "./components/TrendingSection";
import ActivitySection from "./components/ActivitySection";
import FollowingSection from "./components/FollowingSection";
import BreadCrumbSection from "./components/BreadCrumbSection";

// Types
interface Stories {
  id: number;
  username: string;
  avatar: string;
  isYour: boolean;
}

export default function InstagramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex h-screen bg-gray-900 overflow-hidden">
        {/* LEFT SIDEBAR */}
        <InstagramSidebar />

        {/* MAIN CONTENT + FOLLOWERS PANEL */}
        <main className="flex-1 bg-gray-900 flex">
          {/* CENTER CONTENT */}
          <div className="flex-1 max-w-2xl mx-0 px-4 py-6 lg:pl-6">
            {/* Stories */}
            <InstagramStories />
            <Separator className="my-4 bg-gray-700" />
            {/* Breadcrumbs */}
            <BreadCrumbSection />
            {/* DYNAMIC CHILD CONTENT */}
            <ScrollArea className="h-[calc(100vh-200px)]">
              {children}
            </ScrollArea>
          </div>
          {/* RIGHT PANEL - STICKY */}
          <div className="hidden lg:block w-130 border-l border-gray-800 bg-gray-900 p-4 sticky top-0 h-screen overflow-y-auto">
            <h2 className="text-white text-lg font-semibold mb-4">
              Community Hub
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {/* Top Row */}
              <div className="grid grid-cols-2 gap-3">
                <FollowersSection />
                <FollowingSection />
                <SuggestedUsersSection />
                <TrendingSection />
                <ActivitySection />
              </div>
            </div>
          </div>
        </main>

        {/* MOBILE BOTTOM NAV */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 px-4 py-2">
          <div className="flex items-center justify-around">
            <button className="p-2">
              <Home className="w-6 h-6 text-white" />
            </button>
            <button className="p-2">
              <Search className="w-6 h-6 text-gray-400" />
            </button>
            <button className="p-2">
              <PlusSquare className="w-6 h-6 text-gray-400" />
            </button>
            <button className="p-2">
              <Heart className="w-6 h-6 text-gray-400" />
            </button>
            <button className="p-2">
              <div className="w-6 h-6 rounded-full bg-linear-to-br from-purple-400 to-pink-400 flex items-center justify-center text-xs text-white font-bold">
                OM
              </div>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
