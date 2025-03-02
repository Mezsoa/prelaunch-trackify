import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCustomer } from "@/hooks/useCustomer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Users, BarChart3, TagIcon, Home } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DiscountForm from "@/components/discounts/DiscountForm";
import DiscountList from "@/components/discounts/DiscountList";
import { initializeTracking } from "@/lib/tracking";
import { toast } from "sonner";

const Dashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { customer, loading: customerLoading } = useCustomer();
  const [refreshDiscounts, setRefreshDiscounts] = useState(0);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [trackingInitialized, setTrackingInitialized] = useState(false);

  useEffect(() => {
    document.title = "Dashboard | Trackify";
    
    if (user && !trackingInitialized) {
      try {
        initializeTracking();
        setTrackingInitialized(true);
      } catch (error) {
        console.error("Failed to initialize tracking:", error);
        toast.error("Failed to initialize tracking");
      }
    }
  }, [user, trackingInitialized]);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
    } catch (error) {
      toast.error("Failed to sign out. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  };

  const isLoading = authLoading || customerLoading || isSigningOut;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!user) return null;

  const handleDiscountCreated = () => {
    setRefreshDiscounts((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-base">T</span>
            </div>
            <span className="font-medium text-lg">Trackify</span>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                <span>Back to Home</span>
              </Button>
            </Link>
            <div className="text-sm text-gray-700">{user?.email}</div>
            <Button
              variant="outline"
              onClick={handleSignOut}
              size="sm"
              disabled={isSigningOut}
            >
              {isSigningOut ? "Signing out..." : "Sign Out"}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Create Discount</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Discount Code</DialogTitle>
                <DialogDescription>
                  Create a new discount code for your customers.
                </DialogDescription>
              </DialogHeader>
              <DiscountForm onSuccess={handleDiscountCreated} />
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="customers" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="customers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Customers</span>
            </TabsTrigger>
            <TabsTrigger value="discounts" className="flex items-center gap-2">
              <TagIcon className="h-4 w-4" />
              <span>Discounts</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="customers"
            className="p-6 bg-white rounded-lg shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-4">Customer Tracking</h2>
            <p className="text-gray-600 mb-4">
              {customer
                ? `Welcome back, ${customer.first_name || customer.email}!`
                : "Your customer profile is being created."}
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Connect Shopify Store
            </Button>
          </TabsContent>

          <TabsContent
            value="discounts"
            className="p-6 bg-white rounded-lg shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-4">Discount Management</h2>
            <p className="text-gray-600 mb-6">
              Create and manage discount codes for your pre-launch or
              crowdfunding customers.
            </p>
            <DiscountList key={refreshDiscounts} />
          </TabsContent>

          <TabsContent
            value="analytics"
            className="p-6 bg-white rounded-lg shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-4">Analytics</h2>
            <p className="text-gray-600">
              Track the performance of your discount codes and customer
              acquisition.
            </p>
          </TabsContent>

          <TabsContent
            value="settings"
            className="p-6 bg-white rounded-lg shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-4">Settings</h2>
            <p className="text-gray-600">
              Configure your account and application settings.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
