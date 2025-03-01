
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCustomer } from '@/hooks/useCustomer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Users, BarChart3, TagIcon, Home } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import DiscountForm from '@/components/discounts/DiscountForm';
import DiscountList from '@/components/discounts/DiscountList';
import { initializeTracking } from '@/lib/tracking';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user, loading: authLoading, signOut, refreshSession } = useAuth();
  const { customer, loading: customerLoading } = useCustomer();
  const [refreshDiscounts, setRefreshDiscounts] = useState(0);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Refresh session only once on mount
  useEffect(() => {
    console.log("Dashboard: Refreshing session on mount");
    refreshSession();
  }, []);

  useEffect(() => {
    document.title = 'Dashboard | Trackify';
    
    try {
      // Initialize session tracking only if we have a user
      if (user) {
        console.log("Dashboard: Initializing tracking for user", user.email);
        initializeTracking();
      }
    } catch (error) {
      console.error("Error initializing tracking:", error);
    }
  }, [user]);

  // Handle sign out with better error handling
  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      // No need to navigate here as the signOut function in useAuth already handles navigation
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out. Please try again.");
      setIsSigningOut(false);
    }
  };

  console.log("Dashboard: Auth loading:", authLoading, "Customer loading:", customerLoading, "User:", !!user);

  // Early return for loading states with console logging for debugging
  if (authLoading) {
    console.log("Dashboard: Auth is still loading");
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Only check if user exists - if not, the ProtectedRoute component will handle the redirect
  if (!user) {
    console.log("Dashboard: No user found in Dashboard component");
    return null;
  }

  if (customerLoading || isSigningOut) {
    console.log("Dashboard: Customer loading or signing out");
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const handleDiscountCreated = () => {
    setRefreshDiscounts(prev => prev + 1);
  };

  console.log("Dashboard: Rendering dashboard content for user", user.email);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard header */}
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
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span>Back to Home</span>
              </Button>
            </Link>
            <div className="text-sm text-gray-700">
              {user?.email}
            </div>
            <Button variant="outline" onClick={handleSignOut} size="sm" disabled={isSigningOut}>
              {isSigningOut ? "Signing out..." : "Sign Out"}
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard content */}
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
          
          <TabsContent value="customers" className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Customer Tracking</h2>
            <p className="text-gray-600 mb-4">
              {customer 
                ? `Welcome back, ${customer.first_name || customer.email}!` 
                : 'Your customer profile is being created.'}
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Connect Shopify Store
            </Button>
          </TabsContent>
          
          <TabsContent value="discounts" className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Discount Management</h2>
            <p className="text-gray-600 mb-6">
              Create and manage discount codes for your pre-launch or crowdfunding customers.
            </p>
            <DiscountList key={refreshDiscounts} />
          </TabsContent>
          
          <TabsContent value="analytics" className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Analytics</h2>
            <p className="text-gray-600">
              Track the performance of your discount codes and customer acquisition.
            </p>
          </TabsContent>
          
          <TabsContent value="settings" className="p-6 bg-white rounded-lg shadow-sm">
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
