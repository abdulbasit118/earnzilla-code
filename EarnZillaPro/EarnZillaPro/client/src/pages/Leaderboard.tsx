import { useState, useEffect } from "react";
import { ArrowLeft, Crown, Trophy, Medal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useUser } from "@/contexts/UserContext";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface LeaderboardUser {
  uid: string;
  displayName: string;
  totalEarnings: number;
  totalAdsWatched: number;
}

export default function Leaderboard() {
  const [, setLocation] = useLocation();
  const { userData } = useUser();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [timeFilter, setTimeFilter] = useState<"week" | "allTime">("week");

  useEffect(() => {
    const q = query(
      collection(db, "users"),
      orderBy("totalEarnings", "desc"),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leaderboardData = snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })) as LeaderboardUser[];
      
      setLeaderboard(leaderboardData);
    });

    return () => unsubscribe();
  }, [timeFilter]);

  const getUserRank = () => {
    if (!userData) return 0;
    const index = leaderboard.findIndex(user => user.uid === userData.uid);
    return index >= 0 ? index + 1 : leaderboard.length + 1;
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-gold" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-yellow-600" />;
      default:
        return <span className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-sm">{rank}</span>;
    }
  };

  const getPodiumColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gold";
      case 2:
        return "bg-gray-300";
      case 3:
        return "bg-yellow-600";
      default:
        return "bg-gray-400";
    }
  };

  const getPodiumHeight = (rank: number) => {
    switch (rank) {
      case 1:
        return "h-20";
      case 2:
        return "h-16";
      case 3:
        return "h-12";
      default:
        return "h-8";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-navy text-white p-4 flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/dashboard")}
          className="mr-4 text-gold hover:text-yellow-300"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-xl font-semibold">Leaderboard</h2>
      </header>

      <main className="p-4 max-w-2xl mx-auto">
        {/* Time Period Toggle */}
        <Card className="mb-6">
          <CardContent className="p-2">
            <div className="flex">
              <Button
                onClick={() => setTimeFilter("week")}
                variant={timeFilter === "week" ? "default" : "ghost"}
                className={`flex-1 ${timeFilter === "week" ? "bg-gold text-white" : ""}`}
              >
                This Week
              </Button>
              <Button
                onClick={() => setTimeFilter("allTime")}
                variant={timeFilter === "allTime" ? "default" : "ghost"}
                className={`flex-1 ${timeFilter === "allTime" ? "bg-gold text-white" : ""}`}
              >
                All Time
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-navy mb-6 text-center">Top Earners</h3>
              <div className="flex items-end justify-center space-x-4">
                {/* 2nd Place */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mb-2">
                    <span className="text-white font-bold text-lg">
                      {leaderboard[1]?.displayName?.charAt(0) || "?"}
                    </span>
                  </div>
                  <div className={`${getPodiumColor(2)} w-20 ${getPodiumHeight(2)} rounded-t-lg flex items-center justify-center`}>
                    <span className="text-white font-bold text-2xl">2</span>
                  </div>
                  <p className="text-sm font-medium mt-2">
                    {leaderboard[1]?.displayName?.split(" ")[0] || "User"} 
                  </p>
                  <p className="text-sm text-gray-600">PKR {leaderboard[1]?.totalEarnings || 0}</p>
                </div>

                {/* 1st Place */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center mb-2">
                    <span className="text-white font-bold text-xl">
                      {leaderboard[0]?.displayName?.charAt(0) || "?"}
                    </span>
                  </div>
                  <div className={`${getPodiumColor(1)} w-24 ${getPodiumHeight(1)} rounded-t-lg flex items-center justify-center`}>
                    <span className="text-white font-bold text-3xl">1</span>
                  </div>
                  <p className="text-sm font-medium mt-2">
                    {leaderboard[0]?.displayName?.split(" ")[0] || "User"}
                  </p>
                  <p className="text-sm text-gray-600">PKR {leaderboard[0]?.totalEarnings || 0}</p>
                  <Crown className="text-gold mt-1 w-5 h-5 mx-auto" />
                </div>

                {/* 3rd Place */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mb-2">
                    <span className="text-white font-bold text-lg">
                      {leaderboard[2]?.displayName?.charAt(0) || "?"}
                    </span>
                  </div>
                  <div className={`${getPodiumColor(3)} w-20 ${getPodiumHeight(3)} rounded-t-lg flex items-center justify-center`}>
                    <span className="text-white font-bold text-2xl">3</span>
                  </div>
                  <p className="text-sm font-medium mt-2">
                    {leaderboard[2]?.displayName?.split(" ")[0] || "User"}
                  </p>
                  <p className="text-sm text-gray-600">PKR {leaderboard[2]?.totalEarnings || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Your Rank */}
        {userData && (
          <Card className="bg-gradient-to-r from-navy to-blue-900 text-white mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {userData.displayName?.charAt(0) || "Y"}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">Your Rank</p>
                    <p className="text-sm opacity-80">You</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">#{getUserRank()}</p>
                  <p className="text-sm opacity-80">PKR {userData.totalEarnings}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Full Rankings */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-navy mb-4">Full Rankings</h3>
            {leaderboard.length > 0 ? (
              <div className="space-y-3">
                {leaderboard.map((user, index) => (
                  <div key={user.uid} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getRankIcon(index + 1)}
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {user.displayName?.charAt(0) || "?"}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{user.displayName || "Anonymous User"}</p>
                        <p className="text-sm text-gray-600">{user.totalAdsWatched} ads watched</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-navy">PKR {user.totalEarnings}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No rankings available yet</p>
                <p className="text-sm">Start earning to appear on the leaderboard!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
