import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";
import { auth, googleProvider, db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useToast } from "@/hooks/useToast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: (referralCode?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
      
      if (user) {
        // Check if user document exists, create if not
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          // Generate referral code
          const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
          
          await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            referralCode,
            balance: 0,
            totalEarnings: 0,
            totalAdsWatched: 0,
            referralCount: 0,
            badges: [],
            lastSpinDate: null,
            dailyAdsToday: 0,
            lastAdDate: null,
            createdAt: new Date()
          });
          
          showToast("Welcome to EarnZilla! Start earning now!", "success");
        }
      }
    });

    return () => unsubscribe();
  }, [showToast]);

  const signInWithGoogle = async (referralCode?: string) => {
    try {
      // Store referral code for later use
      if (referralCode) {
        localStorage.setItem("pendingReferralCode", referralCode);
      }
      
      const result = await signInWithPopup(auth, googleProvider);
      if (result) {
        showToast("Successfully signed in!", "success");
      }
    } catch (error: any) {
      showToast(`Sign in failed: ${error.message}`, "error");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      showToast("Successfully logged out!", "info");
    } catch (error: any) {
      showToast(`Logout failed: ${error.message}`, "error");
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
