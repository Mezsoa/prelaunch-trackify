
import { ArrowRight, ShoppingCart, Users, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useIntersectionObserver from '@/lib/useIntersectionObserver';

const Hero = () => {
  const { ref, isIntersecting } = useIntersectionObserver({ triggerOnce: true });

  return (
    <section className="relative pt-28 pb-20 overflow-hidden">
      <div className="hero-background backdrop-glow"></div>
      
      <div 
        ref={ref}
        className={`section-container flex flex-col items-center transition-opacity ${
          isIntersecting ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="bg-trackify-50 text-trackify-700 rounded-full px-4 py-1.5 text-sm font-medium mb-8 flex items-center animate-fade-in opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
          <span className="bg-trackify-100 rounded-full h-6 w-6 flex items-center justify-center mr-2">
            <ShoppingCart size={12} />
          </span>
          Made for Shopify stores with pre-launch campaigns
        </div>
        
        <h1 className="text-center text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl mb-6 max-w-4xl animate-fade-in opacity-0 text-balance" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          <span className="text-trackify-700">Track & Convert</span> Pre-Launch Customers
        </h1>
        
        <p className="text-center text-gray-600 text-lg md:text-xl max-w-2xl mb-12 animate-fade-in opacity-0 text-balance" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
          The lightweight Shopify app that tracks pre-login visitors, attributes discounts, and converts Kickstarter backers into loyal customers.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-fade-in opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
          <Button 
            size="lg"
            className="bg-trackify-600 hover:bg-trackify-700 text-white px-8 btn-hover-effect"
          >
            Start Free Trial <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
          <Button 
            size="lg"
            variant="outline" 
            className="border-gray-300"
          >
            See How It Works
          </Button>
        </div>
        
        <div className="w-full max-w-5xl relative animate-fade-in opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
          <div className="aspect-video bg-gradient-to-br from-trackify-50 to-gray-100 rounded-xl overflow-hidden shadow-lg border border-trackify-100 flex items-center justify-center">
            <div className="glass-card p-8 text-center max-w-md mx-auto">
              <h3 className="font-medium text-xl mb-4">Dashboard Preview</h3>
              <p className="text-gray-600 mb-6">Track pre-login visitors, manage discount eligibility, and convert more customers</p>
              <div className="flex items-center justify-center gap-6">
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-trackify-100 flex items-center justify-center mb-2">
                    <Users size={20} className="text-trackify-700" />
                  </div>
                  <span className="text-sm text-gray-600">Pre-login Visitors</span>
                  <span className="font-bold text-xl">2,458</span>
                </div>
                <div className="h-16 border-r border-gray-200"></div>
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-trackify-100 flex items-center justify-center mb-2">
                    <ShoppingCart size={20} className="text-trackify-700" />
                  </div>
                  <span className="text-sm text-gray-600">Conversions</span>
                  <span className="font-bold text-xl">347</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-full py-2 px-6 shadow-lg border border-gray-100 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            <span className="text-sm font-medium">Trusted by 200+ Shopify merchants</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
