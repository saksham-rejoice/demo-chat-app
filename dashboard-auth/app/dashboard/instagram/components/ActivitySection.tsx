"use client";
import {
  Heart,
  UserPlus,
  UserMinus,
  LogIn,
  Upload,
  Trash2,
  User,
  MessageCircle,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { getActivity } from "@/services/instagramService";
import { Activity } from "@/types/instagram";
import { useAppSelector } from "@/store/hooks";
const getActivityDisplay = (type: Activity["type"]) => {
  switch (type) {
    case "FOLLOW":
      return { icon: UserPlus, text: "followed you", color: "text-green-400" };
    case "UNFOLLOW":
      return { icon: UserMinus, text: "unfollowed you", color: "text-red-400" };
    case "LOGIN":
      return { icon: LogIn, text: "logged in", color: "text-blue-400" };
    case "POST_UPLOAD":
      return {
        icon: Upload,
        text: "uploaded a post",
        color: "text-purple-400",
      };
    case "POST_DELETE":
      return { icon: Trash2, text: "deleted a post", color: "text-red-400" };
    case "UPDATE_PROFILE":
      return { icon: User, text: "updated profile", color: "text-yellow-400" };
    case "POST_LIKE":
      return { icon: Heart, text: "liked your post", color: "text-pink-400" };
    case "POST_UNLIKE":
      return { icon: Heart, text: "unliked your post", color: "text-gray-400" };
    case "POST_COMMENT":
      return {
        icon: MessageCircle,
        text: "commented on post",
        color: "text-cyan-400",
      };
    default:
      return { icon: User, text: "had activity", color: "text-gray-400" };
  }
};

export default function ActivitySection() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const activityRefreshTrigger = useAppSelector(
    (state) => state.instagram.activityRefreshTrigger
  );

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await getActivity();
        setActivities(response.data || []);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [activityRefreshTrigger]);

  return (
    <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-4">
      <h3 className="text-white font-medium mb-3 text-sm">Activity</h3>
      <ScrollArea className="h-48">
        <div className="space-y-2">
          {loading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-2 p-2">
                  <Skeleton className="w-4 h-4 rounded" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-2 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center text-gray-400 text-xs py-4">
              No activities yet
            </div>
          ) : (
            activities.map((activity, index) => {
              const {
                icon: Icon,
                text,
                color,
              } = getActivityDisplay(activity.type);
              return (
                <div
                  key={activity._id || index}
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-700/50"
                >
                  <Icon className={`w-4 h-4 ${color}`} />
                  <div className="flex-1">
                    <p className="text-white text-xs">
                      <span className="font-medium">
                        {activity.user.username}
                      </span>
                      <span className="text-gray-400 ml-1">{text}</span>
                      {activity.post && (
                        <span className="text-gray-500 ml-1">
                          on "{activity.post.caption}"
                        </span>
                      )}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {activity.createdAt
                        ? new Date(activity.createdAt).toLocaleDateString()
                        : "Recently"}
                      {activity.metadata?.comment && (
                        <span className="ml-2 text-gray-400">
                          • "{activity.metadata.comment}"
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
