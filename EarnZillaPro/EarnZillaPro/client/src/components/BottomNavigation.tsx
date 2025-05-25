import { Home, Play, Dice6, Users, Trophy } from "lucide-react";
import { useLocation } from "wouter";

const navItems = [
  { path: "/dashboard", icon: Home, label: "Home" },
  { path: "/watch", icon: Play, label: "Watch" },
  { path: "/spin", icon: Dice6, label: "Spin" },
  { path: "/referrals", icon: Users, label: "Refer" },
  { path: "/leaderboard", icon: Trophy, label: "Rank" },
];

export function BottomNavigation() {
  const [location, setLocation] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => (
          <button
            key={path}
            onClick={() => setLocation(path)}
            className={`flex flex-col items-center py-2 px-3 transition-colors button-hover ${
              location === path ? "text-royal-blue" : "text-gray-500 hover:text-royal-blue"
            }`}
          >
            <Icon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
