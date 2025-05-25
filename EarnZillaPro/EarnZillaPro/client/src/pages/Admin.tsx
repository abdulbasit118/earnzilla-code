import { useState, useEffect } from "react";
import { ArrowLeft, Users, DollarSign, Settings, BarChart3, Shield, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

export default function Admin() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    adsEnabled: true,
    spinEnabled: true,
    referralsEnabled: true,
    adReward: 5,
    maxAdsPerDay: 20,
    referralBonus: 50,
    spinMinPrize: 5,
    spinMaxPrize: 100,
    maintenanceMode: false
  });

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEarnings: 0,
    todayAds: 0,
    todaySpins: 0,
    todayReferrals: 0
  });

  // Check if user is admin (you can modify this logic)
  const isAdmin = user?.email?.includes('admin') || user?.email === 'your-admin@email.com';

  useEffect(() => {
    if (!isAdmin) {
      setLocation('/dashboard');
    }
  }, [isAdmin, setLocation]);

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    // Here you would save to backend
    console.log('Saving settings:', settings);
    alert('Settings saved successfully!');
  };

  const resetUserData = () => {
    if (confirm('Are you sure you want to reset all user data? This cannot be undone.')) {
      // Here you would call backend to reset data
      console.log('Resetting user data...');
      alert('User data reset successfully!');
    }
  };

  const exportData = () => {
    // Here you would export data from backend
    console.log('Exporting data...');
    alert('Data export initiated! Check your downloads.');
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">You don't have permission to access the admin panel.</p>
            <Button 
              onClick={() => setLocation('/dashboard')}
              className="bg-royal-blue hover:bg-blue-700 text-white rounded-xl"
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
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
        <h2 className="text-xl font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>Admin Panel</h2>
      </header>

      <main className="p-4 max-w-6xl mx-auto">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-royal-blue mx-auto mb-2" />
              <div className="text-2xl font-bold text-royal-blue" style={{ fontFamily: 'Inter, sans-serif' }}>
                {stats.totalUsers}
              </div>
              <p className="text-gray-600 text-sm">Total Users</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                PKR {stats.totalEarnings}
              </div>
              <p className="text-gray-600 text-sm">Total Paid</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                {stats.todayAds}
              </div>
              <p className="text-gray-600 text-sm">Ads Today</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Settings className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                {stats.todaySpins}
              </div>
              <p className="text-gray-600 text-sm">Spins Today</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                {stats.todayReferrals}
              </div>
              <p className="text-gray-600 text-sm">Referrals Today</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-royal-blue" style={{ fontFamily: 'Inter, sans-serif' }}>
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Feature Toggles */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Ads System</Label>
                    <p className="text-xs text-gray-500">Enable/disable ad watching</p>
                  </div>
                  <Switch
                    checked={settings.adsEnabled}
                    onCheckedChange={(checked) => updateSetting('adsEnabled', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Spin Wheel</Label>
                    <p className="text-xs text-gray-500">Enable/disable daily spins</p>
                  </div>
                  <Switch
                    checked={settings.spinEnabled}
                    onCheckedChange={(checked) => updateSetting('spinEnabled', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Referrals</Label>
                    <p className="text-xs text-gray-500">Enable/disable referral system</p>
                  </div>
                  <Switch
                    checked={settings.referralsEnabled}
                    onCheckedChange={(checked) => updateSetting('referralsEnabled', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Maintenance Mode</Label>
                    <p className="text-xs text-gray-500">Show maintenance page</p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => updateSetting('maintenanceMode', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reward Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-royal-blue" style={{ fontFamily: 'Inter, sans-serif' }}>
                Reward Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="adReward">Ad Reward (PKR)</Label>
                <Input
                  id="adReward"
                  type="number"
                  value={settings.adReward}
                  onChange={(e) => updateSetting('adReward', parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="maxAds">Max Ads Per Day</Label>
                <Input
                  id="maxAds"
                  type="number"
                  value={settings.maxAdsPerDay}
                  onChange={(e) => updateSetting('maxAdsPerDay', parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="referralBonus">Referral Bonus (PKR)</Label>
                <Input
                  id="referralBonus"
                  type="number"
                  value={settings.referralBonus}
                  onChange={(e) => updateSetting('referralBonus', parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="spinMin">Spin Min Prize</Label>
                  <Input
                    id="spinMin"
                    type="number"
                    value={settings.spinMinPrize}
                    onChange={(e) => updateSetting('spinMinPrize', parseInt(e.target.value))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="spinMax">Spin Max Prize</Label>
                  <Input
                    id="spinMax"
                    type="number"
                    value={settings.spinMaxPrize}
                    onChange={(e) => updateSetting('spinMaxPrize', parseInt(e.target.value))}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-4">
          <Button
            onClick={saveSettings}
            className="bg-royal-blue hover:bg-blue-700 text-white rounded-xl button-hover"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <Settings className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
          
          <Button
            onClick={exportData}
            variant="outline"
            className="border-royal-blue text-royal-blue hover:bg-blue-50 rounded-xl button-hover"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          
          <Button
            onClick={resetUserData}
            variant="destructive"
            className="rounded-xl button-hover"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            Reset User Data
          </Button>
        </div>

        {/* Warning Notice */}
        <Card className="mt-6 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-orange-800">Admin Access</h4>
                <p className="text-sm text-orange-700 mt-1">
                  You have administrative privileges. Changes made here will affect all users immediately. 
                  Please use these controls responsibly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}