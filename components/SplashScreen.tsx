
import React, { useEffect, useState } from 'react';
import Logo from './Logo';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setAnimate(true);

    // Wait for animation then trigger completion
    const timer = setTimeout(() => {
      onComplete();
    }, 2800); // Total splash duration

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center overflow-hidden">
      <div className={`transition-all duration-1000 transform ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <Logo size="xl" showTagline={true} />
      </div>
      
      {/* Loading Line */}
      <div className="mt-12 w-48 h-1 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r from-invest-900 to-blue-500 transition-all duration-[2000ms] ease-out ${animate ? 'w-full' : 'w-0'}`}></div>
      </div>

      <div className={`absolute bottom-10 text-slate-400 text-xs font-medium tracking-widest uppercase transition-opacity duration-1000 delay-500 ${animate ? 'opacity-100' : 'opacity-0'}`}>
        Secure Banking Systems
      </div>
    </div>
  );
};

export default SplashScreen;
