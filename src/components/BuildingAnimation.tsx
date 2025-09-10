import { useEffect, useState } from 'react';

const buildings = [
  { height: 'h-32', delay: 0 },
  { height: 'h-24', delay: 200 },
  { height: 'h-40', delay: 400 },
  { height: 'h-28', delay: 600 },
  { height: 'h-36', delay: 800 },
  { height: 'h-20', delay: 1000 },
  { height: 'h-44', delay: 1200 },
];

const BuildingAnimation = () => {
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartAnimation(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-2 overflow-hidden">
      {buildings.map((building, index) => (
        <div
          key={index}
          className={`${building.height} w-8 bg-gradient-primary opacity-80 ${
            startAnimation ? 'building-rise' : 'translate-y-full opacity-0'
          }`}
          style={{
            animationDelay: `${building.delay}ms`,
          }}
        />
      ))}
    </div>
  );
};

export default BuildingAnimation;