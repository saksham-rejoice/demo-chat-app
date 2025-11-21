"use client";
import { useState, useEffect } from "react";
import { followUser, getSuggestedUsers } from "@/services/instagramService";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";
import { Badge } from "@/components/ui/badge";
export default function SuggestedUsersSection() {
  const loggedUser = useUser();
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getSuggestedUsers();
        console.log(data);

        setSuggestedUsers(data.data?.users || []);
      } catch (error) {
        console.error("Failed to fetch suggested users:", error);
        toast.error("Failed to fetch suggested users");
      }
    };
    fetchUsers();
  }, []);

  const handleFollowing = async (id: string) => {
    try {
      const data = await followUser(id);
      if (data.success) {
        toast.success("User followed successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to follow user");
    }
  };

  return (
    <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-4 h-48">
      <h3 className="text-white font-medium mb-3 text-sm">Suggested</h3>
      <ScrollArea className="h-32">
        <div className="space-y-2 pr-4">
          {suggestedUsers.map((user, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-1 rounded hover:bg-gray-700/50"
            >
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                {(user.username || user.name).charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm truncate">
                  {user.username || user.name}
                </p>
              </div>

              {loggedUser?.user?._id !== user._id ? (
                <Button
                  onClick={() => {
                    handleFollowing(user._id);
                  }}
                  className="text-white text-sm bg-gray-600 hover:bg-gray-400 rounded-full w-5 h-5 flex items-center justify-center"
                >
                  +
                </Button>
              ) : (
                <Badge className="bg-green-600/20 text-green-400 border-green-500/30 text-xs px-2 py-1">
                  you
                </Badge>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
