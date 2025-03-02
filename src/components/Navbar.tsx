
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut, refreshSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Refresh auth session when navbar mounts
  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  // Smooth scroll to section
  const scrollToSection = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  // Handle login/dashboard navigation
  const handleDashboardClick = () => {
    console.log("Dashboard clicked, current user:", user);
    setIsOpen(false);
    navigate('/dashboard');
  };

  // Handle sign out
  const handleSignOut = async () => {
    setIsOpen(false);
    try {
      await signOut();
      console.log("Sign out completed");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Handle login
  const handleLogin = () => {
    setIsOpen(false);
    navigate('/login');
  };

  // Only show the dashboard button on the home page
  const showDashboardButton = location.pathname === '/';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-3 backdrop-blur-md bg-white/80 shadow-sm'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-md bg-gradient-primary flex items-center justify-center">
            <span className="text-white font-bold text-xl">T</span>
          </div>
          <span className="font-medium text-xl">Trackify</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6">
            <button
              onClick={() => scrollToSection('features')}
              className="text-gray-600 hover:text-trackify-600 transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-gray-600 hover:text-trackify-600 transition-colors"
            >
              How it Works
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-gray-600 hover:text-trackify-600 transition-colors"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-gray-600 hover:text-trackify-600 transition-colors"
            >
              FAQ
            </button>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                {showDashboardButton && (
                  <Button 
                    variant="ghost" 
                    className="font-medium"
                    onClick={handleDashboardClick}
                  >
                    Dashboard
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  className="font-medium"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className="font-medium"
                  onClick={handleLogin}
                >
                  Log in
                </Button>
                <Button 
                  className="bg-trackify-600 hover:bg-trackify-700 text-white flex items-center gap-1 btn-hover-effect"
                  onClick={handleLogin}
                >
                  Get Started <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden pt-24 px-6`}
      >
        <div className="flex flex-col gap-6 text-lg">
          <button
            onClick={() => scrollToSection('features')}
            className="py-3 border-b border-gray-100 text-left"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="py-3 border-b border-gray-100 text-left"
          >
            How it Works
          </button>
          <button
            onClick={() => scrollToSection('pricing')}
            className="py-3 border-b border-gray-100 text-left"
          >
            Pricing
          </button>
          <button
            onClick={() => scrollToSection('faq')}
            className="py-3 border-b border-gray-100 text-left"
          >
            FAQ
          </button>
          
          <div className="mt-6 flex flex-col gap-4">
            {user ? (
              <>
                {showDashboardButton && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-center"
                    onClick={handleDashboardClick}
                  >
                    Dashboard
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  className="w-full justify-center"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="w-full justify-center"
                  onClick={handleLogin}
                >
                  Log in
                </Button>
                <Button 
                  className="w-full justify-center bg-trackify-600 hover:bg-trackify-700"
                  onClick={handleLogin}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
