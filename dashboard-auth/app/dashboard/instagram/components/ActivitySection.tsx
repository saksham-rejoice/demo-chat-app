"use client";

export default function ActivitySection() {
  const activities = [
    { user: "sarah_art", action: "liked", time: "2m" },
    { user: "mike_dev", action: "followed", time: "5m" },
    { user: "emma_lens", action: "commented", time: "10m" },
  ];

  return (
    <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-4 h-48">
      <h3 className="text-white font-medium mb-3 text-sm">Activity</h3>
      <div className="space-y-2">
        {activities.map((activity, index) => (
          <div key={index} className="p-1 rounded hover:bg-gray-700/50">
            <p className="text-white text-xs">
              <span className="font-medium">{activity.user}</span>
              <span className="text-gray-400 ml-1">{activity.action}</span>
            </p>
            <p className="text-gray-500 text-xs">{activity.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}