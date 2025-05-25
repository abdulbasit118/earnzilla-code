import { useState, useEffect } from "react";
import { ArrowLeft, Wallet, CreditCard, AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/useToast";
import { collection, addDoc, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface WithdrawalRequest {
  id: string;
  amount: number;
  method: string;
  accountNumber: string;
  fullName: string;
  status: "pending" | "paid" | "rejected";
  requestDate: any;
  uid: string;
}

export default function Payout() {
  const [, setLocation] = useLocation();
  const { userData } = useUser();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    amount: "",
    method: "",
    accountNumber: "",
    fullName: user?.displayName || ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [withdrawalHistory, setWithdrawalHistory] = useState<WithdrawalRequest[]>([]);

  // Fetch withdrawal history
  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "withdrawals"),
      where("uid", "==", user.uid),
      orderBy("requestDate", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as WithdrawalRequest[];
      
      setWithdrawalHistory(requests);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    const amount = parseFloat(formData.amount);
    return (
      amount >= 250 &&
      amount <= (userData?.balance || 0) &&
      formData.method &&
      formData.accountNumber &&
      formData.fullName.trim()
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "withdrawals"), {
        uid: user?.uid,
        amount: parseFloat(formData.amount),
        method: formData.method,
        accountNumber: formData.accountNumber,
        fullName: formData.fullName,
        status: "pending",
        requestDate: new Date()
      });

      showToast("Withdrawal request submitted successfully!", "success");
      
      // Reset form
      setFormData({
        amount: "",
        method: "",
        accountNumber: "",
        fullName: user?.displayName || ""
      });

    } catch (error) {
      console.error("Error submitting withdrawal:", error);
      showToast("Failed to submit withdrawal request", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "text-green-600";
      case "pending": return "text-orange-600";
      case "rejected": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid": return <CheckCircle className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      case "rejected": return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-royal-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payout data...</p>
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
        <h2 className="text-xl font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>Payout</h2>
      </header>

      <main className="p-4 max-w-2xl mx-auto">
        {/* Current Balance Card */}
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white mb-6 shadow-xl fade-in">
          <CardContent className="p-6 text-center">
            <Wallet className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Your Wallet Balance</h3>
            <div className="text-4xl font-bold mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              PKR {userData.balance || 0}
            </div>
            <p className="text-sm opacity-90">Available for withdrawal</p>
          </CardContent>
        </Card>

        {/* Withdrawal Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-royal-blue" style={{ fontFamily: 'Inter, sans-serif' }}>
              Request Withdrawal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Amount */}
              <div>
                <Label htmlFor="amount">Withdrawal Amount (PKR)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount (Min PKR 250)"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  min="250"
                  max={userData.balance || 0}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum: PKR 250 | Maximum: PKR {userData.balance || 0}
                </p>
              </div>

              {/* Payment Method */}
              <div>
                <Label htmlFor="method">Payment Method</Label>
                <Select value={formData.method} onValueChange={(value) => handleInputChange("method", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easypaisa">Easypaisa</SelectItem>
                    <SelectItem value="jazzcash">JazzCash</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Account Number */}
              <div>
                <Label htmlFor="accountNumber">
                  {formData.method === "bank" ? "IBAN" : "Account Number"}
                </Label>
                <Input
                  id="accountNumber"
                  placeholder={
                    formData.method === "bank" 
                      ? "Enter valid IBAN" 
                      : "Enter account number"
                  }
                  value={formData.accountNumber}
                  onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* Full Name */}
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Full name (must match account)"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must match the name on your account
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!isFormValid() || isSubmitting}
                className="w-full bg-royal-blue hover:bg-blue-700 text-white font-semibold py-3 button-hover rounded-xl"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <CreditCard className="w-5 h-5 mr-2" />
                {isSubmitting ? "Submitting..." : "Request Withdrawal"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Conditions Note */}
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-orange-800 mb-2">Important Notes</h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Minimum withdrawal: PKR 250</li>
                  <li>• Processing time: 1-3 business days</li>
                  <li>• Ensure account details are correct</li>
                  <li>• One withdrawal request at a time</li>
                  <li>• Incorrect details may cause delays</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Withdrawal History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-royal-blue" style={{ fontFamily: 'Inter, sans-serif' }}>
              Withdrawal History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {withdrawalHistory.length > 0 ? (
              <div className="space-y-3">
                {withdrawalHistory.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">PKR {request.amount}</span>
                          <span className="text-gray-500">via {request.method}</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {request.requestDate ? new Date(request.requestDate.toDate()).toLocaleDateString() : "Recent"}
                        </p>
                        <p className="text-xs text-gray-500">{request.accountNumber}</p>
                      </div>
                      <div className={`flex items-center space-x-2 ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        <span className="font-medium capitalize">{request.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No withdrawal requests yet</p>
                <p className="text-sm">Submit your first withdrawal above!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}