import React from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  
  return (
    <div 
      key={location.pathname}
      className="page-transition animate-fade-in"
      style={{
        animationDelay: '0.1s',
        animationFillMode: 'backwards'
      }}
    >
      {children}
    </div>
  );
};

export default PageTransition;