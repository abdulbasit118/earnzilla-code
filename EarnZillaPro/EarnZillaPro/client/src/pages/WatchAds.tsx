import { useState, useEffect } from "react";
import { ArrowLeft, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";
import { useUser } from "@/contexts/UserContext";

export default function WatchAds() {
  const [, setLocation] = useLocation();
  const { updateAdsWatched, checkDailyLimits } = useUser();
  const [adProgress, setAdProgress] = useState(0);
  const [adTimer, setAdTimer] = useState(30);
  const [isWatching, setIsWatching] = useState(false);
  const [canClaim, setCanClaim] = useState(false);
  
  const { canWatchAds, adsRemaining } = checkDailyLimits();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isWatching && adTimer > 0) {
      interval = setInterval(() => {
        setAdTimer(prev => {
          const newTimer = prev - 1;
          setAdProgress((30 - newTimer) / 30 * 100);
          
          if (newTimer <= 0) {
            setCanClaim(true);
            setIsWatching(false);
          }
          
          return newTimer;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isWatching, adTimer]);

  const startAd = () => {
    if (!canWatchAds) return;
    
    setAdProgress(0);
    setAdTimer(30);
    setCanClaim(false);
    setIsWatching(true);
  };

  const claimReward = async () => {
    if (!canClaim) return;
    
    await updateAdsWatched();
    setCanClaim(false);
    
    // Reset for next ad
    setTimeout(() => {
      if (canWatchAds) {
        startAd();
      }
    }, 2000);
  };

  useEffect(() => {
    // Auto-start first ad when page loads
    if (canWatchAds && !isWatching && !canClaim) {
      startAd();
    }
  }, [canWatchAds]);

  return (
    <div className="min-h-screen bg-gray-900 pb-24">
      <header className="bg-royal-blue text-white p-4 flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/dashboard")}
          className="mr-4 text-white hover:text-gray-200 button-hover"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-xl font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>Watch Ads</h2>
      </header>

      <main className="p-4 max-w-4xl mx-auto">
        {/* Daily Progress */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-navy">Daily Progress</h3>
              <span className="text-sm bg-gold text-white px-3 py-1 rounded-full">
                {20 - adsRemaining}/20
              </span>
            </div>
            <Progress value={(20 - adsRemaining) / 20 * 100} className="h-3 mb-2" />
            <p className="text-sm text-gray-600">
              {adsRemaining > 0 ? `${adsRemaining} more ads to reach daily limit` : "Daily limit reached!"}
            </p>
          </CardContent>
        </Card>

        {!canWatchAds ? (
          <Card className="mb-6">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold text-royal-blue mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Daily Limit Reached!</h3>
              <p className="text-gray-600 mb-4">
                You've watched the maximum number of ads for today. Come back tomorrow for more earning opportunities!
              </p>
              <Button
                onClick={() => setLocation("/dashboard")}
                className="bg-royal-blue hover:bg-blue-700 text-white button-hover rounded-xl"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Mock Ad Container */}
            <Card className="mb-6">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  {/* Mock advertisement content */}
                  <div className="bg-gray-800 rounded-lg p-8 mb-4">
                    <div className="w-full h-48 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-lg flex items-center justify-center mb-4">
                      <div className="text-center text-white">
                        <h3 className="text-2xl font-bold mb-2">Brand Advertisement</h3>
                        <p className="text-lg opacity-90">Premium Product Showcase</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Ad Progress */}
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <span className="text-sm text-gray-600">Ad Progress:</span>
                    <div className="w-32">
                      <Progress value={adProgress} className="h-2" />
                    </div>
                    <span className="text-sm text-gray-600">{adTimer}s</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">Watch the full ad to earn PKR 5</p>
                </div>

                <Button
                  onClick={canClaim ? claimReward : undefined}
                  disabled={!canClaim}
                  className="bg-royal-blue hover:bg-blue-700 text-white font-semibold px-8 py-3 button-hover rounded-xl"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <Coins className="w-5 h-5 mr-2" />
                  {canClaim ? "Claim PKR 5" : `Watch Ad (${adTimer}s)`}
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {/* Earnings Summary */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-navy mb-4">Today's Earnings</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gold">PKR {(20 - adsRemaining) * 5}</p>
                <p className="text-sm text-gray-600">From Ads</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">PKR 0</p>
                <p className="text-sm text-gray-600">Referrals</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">PKR 0</p>
                <p className="text-sm text-gray-600">Bonuses</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
