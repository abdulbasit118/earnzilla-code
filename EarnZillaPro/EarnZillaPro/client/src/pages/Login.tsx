import { useState } from "react";
import { Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const [referralCode, setReferralCode] = useState("");
  const { signInWithGoogle } = useAuth();

  const handleSignIn = () => {
    signInWithGoogle(referralCode || undefined);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, hsl(var(--royal-blue)) 0%, #1e40af 100%)" }}
    >
      <Card className="w-full max-w-md fade-in shadow-xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-royal-blue to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Coins className="text-white text-2xl w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-royal-blue mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>EarnZilla</h1>
            <p className="text-gray-600">Start earning money by watching ads</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="referralCode" className="text-sm font-medium text-gray-700">
                Referral Code (Optional)
              </Label>
              <Input
                id="referralCode"
                type="text"
                maxLength={10}
                placeholder="Enter referral code"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                className="mt-2"
              />
            </div>

            <Button
              onClick={handleSignIn}
              className="w-full bg-white border-2 border-royal-blue text-royal-blue hover:bg-blue-50 button-hover rounded-xl"
              variant="outline"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <Button
              onClick={handleSignIn}
              className="w-full bg-royal-blue hover:bg-blue-700 text-white font-semibold button-hover rounded-xl"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Sign In & Start Earning
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
