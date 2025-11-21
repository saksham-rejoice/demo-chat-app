"use client";
import { Menu } from "lucide-react";
import InstagramIcon from "../../ui/InstagramIcon";
import { useUser } from "../../../hooks/useUser";

export default function Header() {
  const { user } = useUser();

  const getInitials = (nameOrEmail?: string) => {
    if (!nameOrEmail) return "G";
    return nameOrEmail.charAt(0).toUpperCase();
  };

  return (
    <>
      <header className="bg-gray-900 border-b border-gray-700 shadow-xl px-4 py-4">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-linear-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <InstagramIcon size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wide">
              Instagram
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username || user.email || "User avatar"}
                  className="w-9 h-9 rounded-full object-cover border border-gray-700"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gray-700 text-white flex items-center justify-center font-medium">
                  {getInitials(user?.username || user?.email)}
                </div>
              )}
              <span className="text-white font-medium">
                {user?.username || user?.email || "Guest"}
              </span>
            </div>
          </div>
        </div>
      </header>
      {/* <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} /> */}
    </>
  );
}
