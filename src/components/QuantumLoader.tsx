import { Loader2 } from 'lucide-react';

interface QuantumLoaderProps {
  size?: string;
  speed?: string;
  className?: string;
}

const QuantumLoader = ({ size = "45", className = "" }: QuantumLoaderProps) => {
  const px = parseInt(size, 10) || 45;
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className="animate-spin text-primary" style={{ width: px, height: px }} />
    </div>
  );
};

export default QuantumLoader;
