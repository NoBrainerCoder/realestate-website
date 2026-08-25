import { useEffect, useState } from 'react';

interface QuantumLoaderProps {
  size?: string;
  speed?: string;
  color?: string;
  className?: string;
}

const QuantumLoader = ({ size = "45", speed = "1.75", color = "#FFA500", className = "" }: QuantumLoaderProps) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    import('ldrs')
      .then(({ quantum }) => {
        quantum.register();
        if (mounted) setReady(true);
      })
      .catch(() => {
        if (mounted) setReady(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const px = parseInt(size, 10) || 45;

  if (!ready) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width: px, height: px }} />
    );
  }

  const Quantum = 'l-quantum' as any;

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Quantum size={size} speed={speed} color={color} />
    </div>
  );
};

export default QuantumLoader;
