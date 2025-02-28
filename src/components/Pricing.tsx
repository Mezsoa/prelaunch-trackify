
import { useState } from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import useIntersectionObserver from '@/lib/useIntersectionObserver';

interface PricingTierProps {
  title: string;
  price: number;
  annualPrice?: number;
  description: string;
  features: string[];
  isPopular?: boolean;
  isAnnual: boolean;
  delay: number;
}

const PricingTier = ({
  title,
  price,
  annualPrice,
  description,
  features,
  isPopular,
  isAnnual,
  delay,
}: PricingTierProps) => {
  const { ref, isIntersecting } = useIntersectionObserver({ triggerOnce: true });
  const actualPrice = isAnnual && annualPrice ? annualPrice : price;
  
  return (
    <div 
      ref={ref}
      className={`rounded-xl border ${
        isPopular ? 'border-trackify-200 shadow-lg' : 'border-gray-200'
      } bg-white p-8 transition-all duration-500 transform ${
        isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {isPopular && (
        <div className="bg-trackify-50 text-trackify-700 text-xs font-medium px-3 py-1 rounded-full w-fit mb-4">
          Most Popular
        </div>
      )}
      
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-gray-600 mb-5">{description}</p>
      
      <div className="mb-6">
        <div className="flex items-end">
          <span className="text-3xl font-bold">${actualPrice}</span>
          <span className="text-gray-500 ml-1">/month</span>
        </div>
        {isAnnual && annualPrice && (
          <div className="text-sm text-trackify-700 mt-1">
            Save ${(price - annualPrice) * 12} yearly
          </div>
        )}
      </div>
      
      <div className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <div key={index} className="flex gap-3 items-start">
            <div className="flex-shrink-0 mt-1">
              <div className="h-5 w-5 rounded-full bg-trackify-100 flex items-center justify-center">
                <Check size={12} className="text-trackify-700" />
              </div>
            </div>
            <span className="text-gray-600">{feature}</span>
          </div>
        ))}
      </div>
      
      <Button 
        className={`w-full ${
          isPopular
            ? 'bg-trackify-600 hover:bg-trackify-700 text-white'
            : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-800'
        } btn-hover-effect`}
      >
        Choose Plan <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </div>
  );
};

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const { ref, isIntersecting } = useIntersectionObserver({ triggerOnce: true });
  
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="section-container">
        <div 
          ref={ref}
          className={`section-title transition-all duration-500 ${
            isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="mb-4 flex justify-center">
            <span className="bg-trackify-100 text-trackify-700 text-sm font-medium px-4 py-1.5 rounded-full">
              Pricing Plans
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Choose the right plan for your store</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Simple, transparent pricing that scales with your business. No hidden fees or surprise charges.
          </p>
          
          <div className="flex items-center justify-center mt-8 mb-4">
            <span className={`mr-3 ${!isAnnual ? 'font-medium' : 'text-gray-500'}`}>Monthly</span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-trackify-600"
            />
            <span className={`ml-3 ${isAnnual ? 'font-medium' : 'text-gray-500'}`}>
              Annual <span className="text-trackify-700 text-sm font-medium">(Save 20%)</span>
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <PricingTier
            title="Starter"
            price={29}
            annualPrice={24}
            description="Perfect for small stores just launching their first campaign."
            features={[
              "Pre-login visitor tracking",
              "Basic discount eligibility rules",
              "CSV import (up to 5,000 contacts)",
              "Single-use discount enforcement",
              "Email support"
            ]}
            isAnnual={isAnnual}
            delay={100}
          />
          
          <PricingTier
            title="Growth"
            price={79}
            annualPrice={63}
            description="Best for growing brands with active crowdfunding campaigns."
            features={[
              "Everything in Starter",
              "Advanced eligibility rules",
              "CSV import (up to 25,000 contacts)",
              "Campaign URL tracking",
              "API access",
              "Priority support"
            ]}
            isPopular={true}
            isAnnual={isAnnual}
            delay={200}
          />
          
          <PricingTier
            title="Enterprise"
            price={149}
            annualPrice={119}
            description="For established brands with complex tracking needs."
            features={[
              "Everything in Growth",
              "Custom discount rule logic",
              "Unlimited CSV imports",
              "Advanced analytics",
              "Multi-campaign management",
              "Dedicated account manager"
            ]}
            isAnnual={isAnnual}
            delay={300}
          />
        </div>
        
        <div 
          className={`mt-16 text-center transition-all duration-500 ${
            isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
          <p className="text-gray-600 mb-4">
            Need a custom plan for your specific needs?
          </p>
          <Button variant="outline">Contact Sales</Button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
