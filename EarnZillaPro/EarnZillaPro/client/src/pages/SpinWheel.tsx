import { useState } from "react";
import { ArrowLeft, Star, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/useToast";

export default function SpinWheel() {
  const [, setLocation] = useLocation();
  const { updateBalance, updateSpinDate, checkDailyLimits } = useUser();
  const { showToast } = useToast();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  
  const { canSpin } = checkDailyLimits();

  const spinWheel = async () => {
    if (!canSpin || isSpinning) return;
    
    setIsSpinning(true);
    
    // Random rotation between 1440-2160 degrees (4-6 full rotations)
    const newRotation = rotation + Math.random() * 720 + 1440;
    setRotation(newRotation);
    
    setTimeout(async () => {
      const prizes = [5, 10, 15, 20, 25, 50];
      const prize = prizes[Math.floor(Math.random() * prizes.length)];
      
      await updateBalance(prize);
      await updateSpinDate();
      
      showToast(`You won PKR ${prize}!`, "success");
      setIsSpinning(false);
    }, 3000);
  };

  const timeUntilNextSpin = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeDiff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-royal-blue text-white p-4 flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/dashboard")}
          className="mr-4 text-white hover:text-gray-200 button-hover"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-xl font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>Spin & Earn</h2>
      </header>

      <main className="p-4 max-w-md mx-auto">
        {/* Spin Status */}
        <Card className="mb-6">
          <CardContent className="p-6 text-center">
            {canSpin ? (
              <>
                <h3 className="text-lg font-semibold text-royal-blue mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Daily Spin Available!</h3>
                <p className="text-gray-600 mb-4">Spin the wheel to win up to PKR 100</p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-navy mb-2">Spin Used Today</h3>
                <p className="text-gray-600 mb-4">Come back tomorrow for another spin</p>
                <div className="text-gold text-sm">Next spin available in {timeUntilNextSpin()}</div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Spin Wheel */}
        <Card className="mb-6">
          <CardContent className="p-8">
            <div className="relative w-64 h-64 mx-auto mb-6">
              {/* Wheel Container */}
              <div 
                className="w-full h-full rounded-full border-8 border-navy relative overflow-hidden transition-transform duration-3000 ease-out"
                style={{ 
                  transform: `rotate(${rotation}deg)`,
                  background: "conic-gradient(from 0deg, #f39c12 0deg 60deg, #e74c3c 60deg 120deg, #27ae60 120deg 180deg, #3498db 180deg 240deg, #9b59b6 240deg 300deg, #f39c12 300deg 360deg)"
                }}
              >
                {/* Center Circle */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white rounded-full border-4 border-navy flex items-center justify-center">
                    <Star className="text-gold w-6 h-6" />
                  </div>
                </div>
                
                {/* Prize Labels */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white font-bold text-sm">PKR 10</div>
                <div className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white font-bold text-sm">PKR 5</div>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white font-bold text-sm">PKR 20</div>
                <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white font-bold text-sm">PKR 15</div>
              </div>
              
              {/* Pointer */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-navy"></div>
              </div>
            </div>

            <Button
              onClick={spinWheel}
              disabled={!canSpin || isSpinning}
              className="w-full bg-royal-blue hover:bg-blue-700 text-white font-bold py-4 px-6 text-lg button-hover rounded-xl"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <Star className="w-5 h-5 mr-2" />
              {isSpinning ? "SPINNING..." : canSpin ? "SPIN NOW!" : "USED TODAY"}
            </Button>
            
            {canSpin && (
              <p className="text-xs text-gray-500 text-center mt-3">
                One spin per day - Good luck!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Prize History */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-navy mb-4">Recent Wins</h3>
            <div className="space-y-3">
              <div className="text-center text-gray-500 py-8">
                <Gift className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No spins yet today</p>
                <p className="text-sm">Start spinning to see your wins here!</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
