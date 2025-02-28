
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useIntersectionObserver from '@/lib/useIntersectionObserver';

interface StepProps {
  number: number;
  title: string;
  description: string;
  delay: number;
}

const Step = ({ number, title, description, delay }: StepProps) => {
  const { ref, isIntersecting } = useIntersectionObserver({ triggerOnce: true });
  
  return (
    <div 
      ref={ref}
      className={`flex gap-6 transition-all duration-500 ${
        isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex-shrink-0">
        <div className="h-12 w-12 rounded-full bg-trackify-100 text-trackify-700 flex items-center justify-center font-bold text-xl">
          {number}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-medium mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

const HowItWorks = () => {
  const { ref, isIntersecting } = useIntersectionObserver({ triggerOnce: true });
  
  return (
    <section id="how-it-works" className="py-20">
      <div className="section-container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <div 
              ref={ref}
              className={`transition-all duration-500 ${
                isIntersecting ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}
            >
              <div className="mb-4">
                <span className="bg-trackify-100 text-trackify-700 text-sm font-medium px-4 py-1.5 rounded-full">
                  How It Works
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Simple setup, powerful results</h2>
              <p className="text-gray-600 mb-8">
                Getting started with Trackify takes minutes, not days. Our intuitive setup process gets you tracking pre-login customers right away.
              </p>
              
              <div className="space-y-8">
                <Step 
                  number={1}
                  title="Install the Trackify app"
                  description="Add Trackify to your Shopify store with just a few clicks. No code changes required."
                  delay={100}
                />
                
                <Step 
                  number={2}
                  title="Import your customer list"
                  description="Upload your Kickstarter backers or pre-launch email subscribers via CSV or API."
                  delay={200}
                />
                
                <Step 
                  number={3}
                  title="Set up discount rules"
                  description="Create eligibility rules for your different customer segments and discount levels."
                  delay={300}
                />
                
                <Step 
                  number={4}
                  title="Start tracking & converting"
                  description="Watch as your pre-launch customers are recognized and properly attributed."
                  delay={400}
                />
              </div>
              
              <div className="mt-10">
                <Button 
                  size="lg" 
                  className="bg-trackify-600 hover:bg-trackify-700 text-white px-8 btn-hover-effect"
                >
                  Get Started <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="order-1 md:order-2">
            <div 
              className={`transition-all duration-500 ${
                isIntersecting ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              <div className="bg-gradient-to-br from-trackify-50 to-gray-100 rounded-xl p-1 shadow-lg">
                <div className="bg-white rounded-lg p-6">
                  <div className="p-4 border border-gray-100 rounded-md mb-6">
                    <div className="h-3 w-24 bg-trackify-100 rounded mb-3"></div>
                    <div className="h-6 w-full bg-trackify-50 rounded"></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 border border-gray-100 rounded-md">
                      <div className="h-3 w-16 bg-trackify-100 rounded mb-3"></div>
                      <div className="h-6 w-full bg-trackify-50 rounded"></div>
                    </div>
                    <div className="p-4 border border-gray-100 rounded-md">
                      <div className="h-3 w-20 bg-trackify-100 rounded mb-3"></div>
                      <div className="h-6 w-full bg-trackify-50 rounded"></div>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-100 rounded-md mb-6">
                    <div className="flex justify-between mb-3">
                      <div className="h-3 w-24 bg-trackify-100 rounded"></div>
                      <div className="h-3 w-16 bg-trackify-100 rounded"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-trackify-50 rounded"></div>
                      <div className="h-4 w-full bg-trackify-50 rounded"></div>
                      <div className="h-4 w-3/4 bg-trackify-50 rounded"></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <div className="h-9 w-28 bg-trackify-600 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
