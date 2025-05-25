import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";
import { ToastProvider } from "./hooks/useToast";

import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import WatchAds from "@/pages/WatchAds";
import SpinWheel from "@/pages/SpinWheel";
import Referrals from "@/pages/Referrals";
import Leaderboard from "@/pages/Leaderboard";
import Admin from "@/pages/Admin";
import Payout from "@/pages/Payout";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Redirect to="/login" />;
  }
  
  return <>{children}</>;
}

function Router() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/login">
        {user ? <Redirect to="/dashboard" /> : <Login />}
      </Route>
      
      <Route path="/dashboard">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      
      <Route path="/watch">
        <ProtectedRoute>
          <WatchAds />
        </ProtectedRoute>
      </Route>
      
      <Route path="/spin">
        <ProtectedRoute>
          <SpinWheel />
        </ProtectedRoute>
      </Route>
      
      <Route path="/referrals">
        <ProtectedRoute>
          <Referrals />
        </ProtectedRoute>
      </Route>
      
      <Route path="/leaderboard">
        <ProtectedRoute>
          <Leaderboard />
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin">
        <ProtectedRoute>
          <Admin />
        </ProtectedRoute>
      </Route>
      
      <Route path="/payout">
        <ProtectedRoute>
          <Payout />
        </ProtectedRoute>
      </Route>
      
      <Route path="/">
        {user ? <Redirect to="/dashboard" /> : <Redirect to="/login" />}
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ToastProvider>
          <AuthProvider>
            <UserProvider>
              <Router />
            </UserProvider>
          </AuthProvider>
        </ToastProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
