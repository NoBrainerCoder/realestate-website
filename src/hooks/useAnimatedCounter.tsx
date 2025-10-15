import { useState, useEffect, useRef } from 'react';

interface UseAnimatedCounterProps {
  start?: number;
  end: number;
  duration?: number;
  decimals?: number;
}

export const useAnimatedCounter = ({ 
  start = 0, 
  end, 
  duration = 2000, 
  decimals = 0 
}: UseAnimatedCounterProps) => {
  const [count, setCount] = useState(start);
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  // Wait for DOM to be fully loaded before observing
  useEffect(() => {
    // Ensure DOM is ready
    if (document.readyState === 'loading') {
      const handleLoad = () => {
        setupObserver();
      };
      document.addEventListener('DOMContentLoaded', handleLoad);
      return () => document.removeEventListener('DOMContentLoaded', handleLoad);
    } else {
      setupObserver();
    }

    function setupObserver() {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasAnimated) {
            setIsInView(true);
            setHasAnimated(true);
          }
        },
        { threshold: 0.1, rootMargin: '100px' }
      );

      const currentElement = elementRef.current;
      if (currentElement) {
        observer.observe(currentElement);
      }

      return () => {
        if (currentElement) {
          observer.unobserve(currentElement);
        }
      };
    }
  }, [hasAnimated]);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    const startValue = start;
    const endValue = end;
    const totalDuration = duration;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      const currentCount = startValue + (endValue - startValue) * easeOutQuart;
      setCount(Number(currentCount.toFixed(decimals)));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, start, end, duration, decimals]);

  return { count, elementRef };
};