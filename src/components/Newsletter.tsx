
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import useIntersectionObserver from '@/lib/useIntersectionObserver';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { ref, isIntersecting } = useIntersectionObserver({ triggerOnce: true });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Thanks for subscribing!');
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };
  
  return (
    <section className="py-20 bg-trackify-50">
      <div 
        ref={ref}
        className={`section-container max-w-4xl transition-all duration-500 ${
          isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="glass-card bg-white/90 rounded-2xl p-8 md:p-12 shadow-lg border border-trackify-100 text-center">
          <div className="mb-4 flex justify-center">
            <span className="bg-trackify-100 text-trackify-700 text-sm font-medium px-4 py-1.5 rounded-full">
              Newsletter
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay updated</h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-8">
            Join our newsletter to receive the latest updates, e-commerce tips, and exclusive offers for your Shopify store.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow bg-white border-gray-200"
              required
            />
            <Button 
              type="submit" 
              className="bg-trackify-600 hover:bg-trackify-700 btn-hover-effect"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>
          
          <p className="text-sm text-gray-500 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
