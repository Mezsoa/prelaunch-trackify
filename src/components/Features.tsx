
import { useRef } from 'react';
import useIntersectionObserver from '@/lib/useIntersectionObserver';
import { ShoppingCart, Users, Database, Link, CreditCard } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard = ({ icon, title, description, delay }: FeatureCardProps) => {
  const { ref, isIntersecting } = useIntersectionObserver({ triggerOnce: true });
  
  return (
    <div 
      ref={ref}
      className={`glass-card p-8 rounded-xl transition-all duration-500 transform ${
        isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="h-12 w-12 rounded-lg bg-trackify-100 text-trackify-700 flex items-center justify-center mb-5">
        {icon}
      </div>
      <h3 className="text-xl font-medium mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const Features = () => {
  const headingRef = useRef<HTMLDivElement>(null);
  const { ref, isIntersecting } = useIntersectionObserver({ triggerOnce: true });
  
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="section-container">
        <div 
          ref={ref}
          className={`section-title transition-all duration-500 ${
            isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="mb-4 flex justify-center">
            <span className="bg-trackify-100 text-trackify-700 text-sm font-medium px-4 py-1.5 rounded-full">Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Complete pre-launch tracking solution</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Everything you need to track, attribute, and convert customers from your crowdfunding or pre-launch campaigns.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          <FeatureCard
            icon={<Users size={24} />}
            title="Pre-login Visitor Tracking"
            description="Identify and track users before they create an account or make a purchase on your Shopify store."
            delay={100}
          />
          
          <FeatureCard
            icon={<ShoppingCart size={24} />}
            title="Discount Eligibility Rules"
            description="Set up custom rules to ensure Kickstarter backers, early birds, and referrals get the correct discounts."
            delay={200}
          />
          
          <FeatureCard
            icon={<CreditCard size={24} />}
            title="Single-use Enforcement"
            description="Prevent discount abuse with sophisticated single-use tracking that works across devices and browsers."
            delay={300}
          />
          
          <FeatureCard
            icon={<Database size={24} />}
            title="CSV Import & Shopify Sync"
            description="Easily bulk upload pre-qualified users from Kickstarter, Indiegogo, or your email list."
            delay={400}
          />
          
          <FeatureCard
            icon={<Link size={24} />}
            title="Campaign URL Tracking"
            description="Create and track special URLs for your marketing campaigns to measure performance."
            delay={500}
          />
          
          <FeatureCard
            icon={<ShoppingCart size={24} />}
            title="Seamless Shopify Integration"
            description="Works with your existing Shopify store without affecting page load times or customer experience."
            delay={600}
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
