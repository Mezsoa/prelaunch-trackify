
import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverProps {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useIntersectionObserver({
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true,
}: UseIntersectionObserverProps = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Save the current ref value to avoid closure issues
    const currentRef = ref.current;

    // If the element doesn't exist, don't do anything
    if (!currentRef) return;

    // Create a new intersection observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // We only care about the first element (our target)
        const [entry] = entries;
        setIsIntersecting(entry.isIntersecting);

        // If it should only trigger once and it's intersecting, unobserve
        if (triggerOnce && entry.isIntersecting && observerRef.current) {
          observerRef.current.unobserve(currentRef);
        }
      },
      { threshold, rootMargin }
    );

    // Start observing
    observerRef.current.observe(currentRef);

    // Clean up when component unmounts
    return () => {
      if (observerRef.current && currentRef) {
        observerRef.current.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isIntersecting };
}

export default useIntersectionObserver;
