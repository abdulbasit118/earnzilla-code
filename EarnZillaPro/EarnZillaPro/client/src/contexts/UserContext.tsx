import { createContext, useContext, useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc, increment, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/useToast";

interface UserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  referralCode: string;
  balance: number;
  totalEarnings: number;
  totalAdsWatched: number;
  referralCount: number;
  badges: string[];
  lastSpinDate: any;
  dailyAdsToday: number;
  lastAdDate: any;
  createdAt: any;
}

interface UserContextType {
  userData: UserData | null;
  updateBalance: (amount: number) => Promise<void>;
  updateAdsWatched: () => Promise<void>;
  updateSpinDate: () => Promise<void>;
  checkDailyLimits: () => { canWatchAds: boolean; canSpin: boolean; adsRemaining: number };
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (!user) {
      setUserData(null);
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        setUserData(doc.data() as UserData);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const updateBalance = async (amount: number) => {
    if (!user) return;
    
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        balance: increment(amount),
        totalEarnings: increment(amount)
      });
      
      showToast(`PKR ${amount} added to your balance!`, "success");
    } catch (error: any) {
      showToast(`Failed to update balance: ${error.message}`, "error");
    }
  };

  const updateAdsWatched = async () => {
    if (!user) return;
    
    try {
      const userRef = doc(db, "users", user.uid);
      const today = new Date().toDateString();
      const isNewDay = !userData?.lastAdDate || new Date(userData.lastAdDate.toDate()).toDateString() !== today;
      
      await updateDoc(userRef, {
        totalAdsWatched: increment(1),
        dailyAdsToday: isNewDay ? 1 : increment(1),
        lastAdDate: serverTimestamp()
      });
      
      await updateBalance(5); // PKR 5 per ad
    } catch (error: any) {
      showToast(`Failed to update ads watched: ${error.message}`, "error");
    }
  };

  const updateSpinDate = async () => {
    if (!user) return;
    
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        lastSpinDate: serverTimestamp()
      });
    } catch (error: any) {
      showToast(`Failed to update spin date: ${error.message}`, "error");
    }
  };

  const checkDailyLimits = () => {
    if (!userData) return { canWatchAds: false, canSpin: false, adsRemaining: 0 };
    
    const today = new Date().toDateString();
    const lastAdDate = userData.lastAdDate ? new Date(userData.lastAdDate.toDate()).toDateString() : null;
    const lastSpinDate = userData.lastSpinDate ? new Date(userData.lastSpinDate.toDate()).toDateString() : null;
    
    const isNewDay = lastAdDate !== today;
    const dailyAds = isNewDay ? 0 : userData.dailyAdsToday;
    const canWatchAds = dailyAds < 20;
    const canSpin = lastSpinDate !== today;
    const adsRemaining = Math.max(0, 20 - dailyAds);
    
    return { canWatchAds, canSpin, adsRemaining };
  };

  const value = {
    userData,
    updateBalance,
    updateAdsWatched,
    updateSpinDate,
    checkDailyLimits,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
