import { Home, Users, Settings, MessageSquare } from "lucide-react";
import Link from "next/link";

const Sidebar = () => {
  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard", disable: false },
    { icon: Users, label: "Users", href: "/dashboard/users", disable: true },
    {
      icon: Settings,
      label: "Settings",
      href: "/dashboard/settings",
      disable: true,
    },
    {
      icon:MessageSquare,
      label: "Messages",
      href: "/dashboard/chat-section",
      disable: false,
    }
  ];

  return (
    <aside className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-lg font-semibold">Menu</h2>
      </div>
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors"
                aria-disabled={item.disable}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
