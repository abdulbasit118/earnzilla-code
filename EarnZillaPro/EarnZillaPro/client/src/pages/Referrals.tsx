import { useState, useEffect } from "react";
import { ArrowLeft, Copy, Users, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/useToast";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Referral {
  uid: string;
  displayName: string;
  email: string;
  createdAt: any;
}

export default function Referrals() {
  const [, setLocation] = useLocation();
  const { userData } = useUser();
  const { showToast } = useToast();
  const [referrals, setReferrals] = useState<Referral[]>([]);

  useEffect(() => {
    if (!userData?.referralCode) return;

    const q = query(
      collection(db, "users"),
      where("usedReferralCode", "==", userData.referralCode)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const referralData = snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })) as Referral[];
      
      setReferrals(referralData);
    });

    return () => unsubscribe();
  }, [userData?.referralCode]);

  const copyReferralCode = async () => {
    if (!userData?.referralCode) return;
    
    try {
      await navigator.clipboard.writeText(userData.referralCode);
      showToast("Referral code copied to clipboard!", "success");
    } catch (error) {
      showToast("Failed to copy referral code", "error");
    }
  };

  const shareReferralCode = (platform: string) => {
    if (!userData?.referralCode) return;
    
    const message = `Join EarnZilla and start earning money by watching ads! Use my referral code: ${userData.referralCode}`;
    const url = window.location.origin;
    
    switch (platform) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(message + " " + url)}`, "_blank");
        break;
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`, "_blank");
        break;
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`, "_blank");
        break;
      case "generic":
        if (navigator.share) {
          navigator.share({
            title: "EarnZilla - Earn Money Watching Ads",
            text: message,
            url: url
          });
        } else {
          copyReferralCode();
        }
        break;
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Loading referral data...</p>
        </div>
      </div>
    );
  }

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
        <h2 className="text-xl font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>Referral Program</h2>
      </header>

      <main className="p-4 max-w-2xl mx-auto">
        {/* Referral Code Card */}
        <Card className="bg-gradient-to-r from-royal-blue to-blue-600 text-white mb-6 shadow-xl fade-in">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Your Referral Code</h3>
            <div className="bg-white/20 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-mono font-bold tracking-wider">
                  {userData.referralCode}
                </span>
                <Button
                  onClick={copyReferralCode}
                  className="bg-white text-royal-blue hover:bg-gray-100 button-hover rounded-xl"
                  size="sm"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
            </div>
            <p className="text-sm opacity-90">Share this code and earn PKR 50 for each friend who joins!</p>
          </CardContent>
        </Card>

        {/* Referral Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-royal-blue mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>{userData.referralCount}</div>
              <p className="text-gray-600">Total Referrals</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-success mb-2">PKR {userData.referralCount * 50}</div>
              <p className="text-gray-600">Total Earned</p>
            </CardContent>
          </Card>
        </div>

        {/* Share Options */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-navy mb-4">Share Your Code</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => shareReferralCode("whatsapp")}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                WhatsApp
              </Button>
              <Button
                onClick={() => shareReferralCode("facebook")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </Button>
              <Button
                onClick={() => shareReferralCode("twitter")}
                className="bg-blue-400 hover:bg-blue-500 text-white"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                Twitter
              </Button>
              <Button
                onClick={() => shareReferralCode("generic")}
                className="bg-gray-600 hover:bg-gray-700 text-white"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                More
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Referral List */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-navy mb-4">Your Referrals</h3>
            {referrals.length > 0 ? (
              <div className="space-y-3">
                {referrals.map((referral) => (
                  <div key={referral.uid} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {referral.displayName?.charAt(0) || referral.email?.charAt(0) || "?"}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{referral.displayName || "Anonymous User"}</p>
                        <p className="text-sm text-gray-600">
                          Joined {referral.createdAt ? new Date(referral.createdAt.toDate()).toLocaleDateString() : "recently"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-success">+PKR 50</p>
                      <p className="text-xs text-gray-500">Bonus earned</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No referrals yet</p>
                <p className="text-sm">Share your code to start earning!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
