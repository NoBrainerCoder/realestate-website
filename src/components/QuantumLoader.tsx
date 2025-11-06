import { useEffect } from 'react';
import { useTheme } from 'next-themes';

// Declare the custom element type
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'l-quantum': {
        size?: string | number;
        speed?: string | number;
        color?: string | number;
      };
    }
  }
}

interface QuantumLoaderProps {
  size?: string;
  speed?: string;
  className?: string;
}

const QuantumLoader = ({ 
  size = "45", 
  speed = "1.75",
  className = ""
}: QuantumLoaderProps) => {
  const { theme } = useTheme();

  useEffect(() => {
    // Dynamically import and register the quantum loader
    import('ldrs').then((ldrs) => {
      ldrs.quantum.register();
    });
  }, []);

  // Set color based on theme
  const color = theme === 'dark' ? 'white' : 'hsl(221, 83%, 53%)';

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <l-quantum
        size={size}
        speed={speed}
        color={color}
      />
    </div>
  );
};

export default QuantumLoader;
