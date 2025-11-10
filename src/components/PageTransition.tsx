import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(true);
  
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 100);
    return () => clearTimeout(timer);
  }, [location.pathname]);
  
  return (
    <>
      {/* Wind sweep overlay */}
      <div 
        className={`fixed inset-0 z-50 pointer-events-none transition-all duration-700 ease-smooth ${
          isTransitioning 
            ? 'translate-x-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent' 
            : 'translate-x-full'
        }`}
        style={{
          clipPath: 'polygon(0 0, 100% 0, 95% 100%, 5% 100%)',
        }}
      />
      
      {/* Page content with staggered animation */}
      <div 
        key={location.pathname}
        className="animate-fade-in"
        style={{
          animationDelay: '0.3s',
          animationFillMode: 'backwards',
          animationDuration: '0.6s'
        }}
      >
        <div className="animate-scale-in" style={{ animationDelay: '0.4s', animationFillMode: 'backwards' }}>
          {children}
        </div>
      </div>
    </>
  );
};

export default PageTransition;