import { LogOut, Wallet, Play, Users, Award, Flame, CheckCircle, Clock, Share } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/UserContext";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { userData, checkDailyLimits } = useUser();
  const [, setLocation] = useLocation();
  const { canSpin, adsRemaining } = checkDailyLimits();

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-royal-blue text-white p-4 shadow-lg">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="bg-white w-10 h-10 rounded-xl flex items-center justify-center shadow-md">
              <Wallet className="text-royal-blue w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ fontFamily: 'Inter, sans-serif' }}>EarnZilla</h1>
              <p className="text-sm opacity-80">{user?.email}</p>
            </div>
          </div>
          <Button
            onClick={logout}
            variant="ghost"
            size="sm"
            className="text-white hover:text-gray-200 button-hover"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4">
        {/* Balance Card */}
        <Card className="bg-gradient-to-r from-royal-blue to-blue-600 text-white mb-6 shadow-xl fade-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm opacity-90">Your Wallet Balance</p>
                <h2 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>PKR {userData.balance || 0}</h2>
                <p className="text-sm opacity-90 mb-4">Total earned: PKR {userData.totalEarnings || 0}</p>
                <Button
                  onClick={() => setLocation("/payout")}
                  className="bg-white text-royal-blue hover:bg-gray-100 font-semibold px-6 py-2 button-hover rounded-xl"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                  disabled={!userData.balance || userData.balance < 250}
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  {userData.balance >= 250 ? "Request Payout" : "Min PKR 250"}
                </Button>
              </div>
              <div className="text-6xl opacity-20">
                <Wallet className="w-16 h-16" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Play className="text-blue-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ads Watched</p>
                  <p className="text-2xl font-bold text-royal-blue" style={{ fontFamily: 'Inter, sans-serif' }}>{userData.totalAdsWatched}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Users className="text-green-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Referrals</p>
                  <p className="text-2xl font-bold text-navy">{userData.referralCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Award className="text-purple-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Badges</p>
                  <p className="text-2xl font-bold text-navy">{userData.badges.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Flame className="text-orange-600 w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Daily Ads</p>
                  <p className="text-2xl font-bold text-navy">{adsRemaining}/20</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Tasks */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-navy mb-4 flex items-center">
              <CheckCircle className="text-gold mr-2 w-5 h-5" />
              Daily Tasks
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    userData.dailyAdsToday >= 5 ? 'bg-success' : 'bg-gray-300'
                  }`}>
                    <CheckCircle className="text-white w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium">Watch 5 ads</p>
                    <p className="text-sm text-gray-600">+PKR 25</p>
                  </div>
                </div>
                <span className={`font-semibold ${
                  userData.dailyAdsToday >= 5 ? 'text-success' : 'text-gray-500'
                }`}>
                  {Math.min(userData.dailyAdsToday, 5)}/5
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    !canSpin ? 'bg-success' : 'bg-gray-300'
                  }`}>
                    <Clock className="text-white w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium">Daily spin</p>
                    <p className="text-sm text-gray-600">+PKR 5-50</p>
                  </div>
                </div>
                <span className={`font-semibold ${
                  !canSpin ? 'text-success' : 'text-gray-500'
                }`}>
                  {!canSpin ? '1/1' : '0/1'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <Share className="text-gray-600 w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium">Share referral</p>
                    <p className="text-sm text-gray-600">+PKR 10</p>
                  </div>
                </div>
                <span className="text-gray-500">0/1</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Badges */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-navy mb-4 flex items-center">
              <Award className="text-gold mr-2 w-5 h-5" />
              Achievements
            </h3>
            {userData.badges.length > 0 ? (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {userData.badges.map((badge, index) => (
                  <div key={index} className="flex-shrink-0 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-gold to-yellow-500 rounded-full flex items-center justify-center mb-2">
                      <Award className="text-white w-6 h-6" />
                    </div>
                    <p className="text-xs font-medium">{badge}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Complete tasks to earn your first badge!
              </p>
            )}
          </CardContent>
        </Card>
      </main>

      <BottomNavigation />
    </div>
  );
}
