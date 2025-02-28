
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import useIntersectionObserver from '@/lib/useIntersectionObserver';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "How does pre-login tracking work?",
    answer: "Trackify uses a combination of browser fingerprinting and local storage to identify visitors before they create an account. When a visitor later registers or signs in, we match their pre-login activity with their account, ensuring proper discount attribution."
  },
  {
    question: "Can I import my existing Kickstarter backers?",
    answer: "Yes! You can easily import your Kickstarter, Indiegogo, or other crowdfunding backers via CSV upload. Simply export your backer list from the platform and import it into Trackify. You can also use our API for more advanced integration."
  },
  {
    question: "Will Trackify slow down my Shopify store?",
    answer: "No. Trackify is designed to be lightweight and efficient. Our tracking script loads asynchronously and doesn't block your page rendering. The impact on page load time is typically less than 100ms."
  },
  {
    question: "How do I set up discount eligibility rules?",
    answer: "Our intuitive rule builder lets you create conditions based on various criteria such as campaign source, referral link, pre-order status, and more. You can create as many rules as needed for different customer segments."
  },
  {
    question: "Does Trackify work with Shopify discount codes?",
    answer: "Yes, Trackify works seamlessly with Shopify's built-in discount functionality. It adds an additional layer of eligibility verification and tracking without requiring any changes to your existing discount system."
  },
  {
    question: "Is there a free trial available?",
    answer: "Yes, we offer a 14-day free trial with full access to all features. No credit card required to start. This gives you time to set up the system and see how it works with your store before committing."
  }
];

const FAQ = () => {
  const { ref, isIntersecting } = useIntersectionObserver({ triggerOnce: true });
  
  return (
    <section id="faq" className="py-20">
      <div 
        ref={ref}
        className={`section-container max-w-4xl transition-all duration-500 ${
          isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="text-center mb-12">
          <div className="mb-4 flex justify-center">
            <span className="bg-trackify-100 text-trackify-700 text-sm font-medium px-4 py-1.5 rounded-full">
              FAQ
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Frequently Asked Questions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get answers to the most common questions about Trackify.
          </p>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-medium py-4">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-4">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-2">Still have questions?</p>
          <a 
            href="#" 
            className="text-trackify-700 font-medium hover:underline inline-flex items-center"
          >
            Contact our support team
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
