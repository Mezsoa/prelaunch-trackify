
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useIntersectionObserver from '@/lib/useIntersectionObserver';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "Trackify allowed us to easily convert our Kickstarter backers into Shopify customers with the right discounts. It saved us countless hours of manual work and prevented discount abuse.",
    author: "Sarah Johnson",
    role: "Founder",
    company: "MinimalGoods"
  },
  {
    quote: "After our Indiegogo campaign ended, we were struggling to track which backers had claimed their discounts. Trackify solved this instantly and increased our conversion rate by 32%.",
    author: "Michael Chen",
    role: "Marketing Director",
    company: "Ecologic Bags"
  },
  {
    quote: "The pre-login tracking feature is a game-changer. We can now attribute sales properly even when customers use different devices or browsers. Worth every penny!",
    author: "Emma Rodriguez",
    role: "E-commerce Manager",
    company: "PeakPerformance"
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { ref, isIntersecting } = useIntersectionObserver({ triggerOnce: true });
  
  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };
  
  const currentTestimonial = testimonials[currentIndex];
  
  return (
    <section className="py-20">
      <div 
        ref={ref}
        className={`section-container max-w-5xl transition-all duration-700 ${
          isIntersecting ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="text-center mb-12">
          <div className="mb-4 flex justify-center">
            <span className="bg-trackify-100 text-trackify-700 text-sm font-medium px-4 py-1.5 rounded-full">
              Testimonials
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Trusted by Shopify merchants</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            See how brands like yours are using Trackify to improve their pre-launch conversions.
          </p>
        </div>
        
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-100 relative">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-2/3">
              <svg className="text-trackify-200 h-12 w-12 mb-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-gray-800 text-lg md:text-xl mb-6 italic">
                "{currentTestimonial.quote}"
              </p>
              <div>
                <p className="font-medium text-lg">{currentTestimonial.author}</p>
                <p className="text-gray-600">
                  {currentTestimonial.role}, {currentTestimonial.company}
                </p>
              </div>
            </div>
            
            <div className="md:w-1/3 flex justify-center">
              <div className="rounded-xl bg-gradient-to-br from-trackify-50 to-gray-100 p-1 shadow">
                <div className="aspect-square w-full max-w-[180px] bg-white rounded-lg p-4 flex items-center justify-center">
                  <div className="text-center">
                    <div className="h-16 w-16 bg-trackify-100 rounded-full mx-auto mb-3"></div>
                    <div className="h-3 w-24 bg-gray-200 rounded mx-auto mb-2"></div>
                    <div className="h-2 w-16 bg-gray-100 rounded mx-auto"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-8 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-trackify-600' : 'bg-gray-200'
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              ></button>
            ))}
          </div>
          
          <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2">
            <Button
              size="icon"
              variant="outline"
              className="h-10 w-10 rounded-full shadow-sm"
              onClick={prevTestimonial}
            >
              <ChevronLeft size={18} />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="h-10 w-10 rounded-full shadow-sm"
              onClick={nextTestimonial}
            >
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
