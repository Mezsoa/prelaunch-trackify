
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Users, BarChart3, TagIcon } from 'lucide-react';

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    document.title = 'Dashboard | Trackify';
  }, []);

  // Redirect if not logged in
  if (!loading && !user) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-base">T</span>
            </div>
            <span className="font-medium text-lg">Trackify</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-700">
              {user?.email}
            </div>
            <Button variant="outline" onClick={signOut} size="sm">
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
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
              Your pre-login customer tracking dashboard will appear here. Connect your Shopify store to get started.
            </p>
            <Button className="bg-trackify-600 hover:bg-trackify-700">
              Connect Shopify Store
            </Button>
          </TabsContent>
          
          <TabsContent value="discounts" className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Discount Management</h2>
            <p className="text-gray-600">
              Create and manage discount codes for your pre-launch or crowdfunding customers.
            </p>
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
