
import React from 'react';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Logo: React.FC<LogoProps> = ({ 
  className = "", 
  showTagline = false, 
  variant = 'dark',
  size = 'md' 
}) => {
  // Size scaling
  const scale = {
    sm: 0.6,
    md: 1,
    lg: 1.5,
    xl: 2
  }[size];

  const textColor1 = variant === 'dark' ? '#003B6F' : '#FFFFFF'; // Dark Blue
  const textColor2 = variant === 'dark' ? '#0077C8' : '#60A5FA'; // Lighter Blue
  const taglineColor = variant === 'dark' ? '#1e293b' : '#cbd5e1';
  const squareColor = variant === 'dark' ? '#003B6F' : '#FFFFFF';
  const dotColor = '#38bdf8'; // Cyan/Light blue dot

  return (
    <div className={`flex flex-col justify-center ${className}`} style={{ width: 'fit-content' }}>
      <div className="flex items-center gap-3">
        {/* Icon: 3x3 Grid */}
        <svg 
          width={36 * scale} 
          height={36 * scale} 
          viewBox="0 0 36 36" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Row 1 */}
          <rect x="0" y="0" width="10" height="10" fill={squareColor} />
          <rect x="13" y="0" width="10" height="10" fill={squareColor} />
          <rect x="26" y="0" width="10" height="10" fill={squareColor} />
          
          {/* Row 2 */}
          <rect x="0" y="13" width="10" height="10" fill={squareColor} />
          {/* Center Dot */}
          <circle cx="18" cy="18" r="5" fill="url(#paint0_radial)" />
          <rect x="26" y="13" width="10" height="10" fill={squareColor} />
          
          {/* Row 3 */}
          <rect x="0" y="26" width="10" height="10" fill={squareColor} />
          <rect x="13" y="26" width="10" height="10" fill={squareColor} />
          <rect x="26" y="26" width="10" height="10" fill={squareColor} />

          <defs>
            <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(16 16) rotate(45) scale(10)">
              <stop stopColor="#BAE6FD" />
              <stop offset="1" stopColor="#0284C7" />
            </radialGradient>
          </defs>
        </svg>

        {/* Text */}
        <div className="flex items-baseline" style={{ transform: `scale(${scale})`, transformOrigin: 'left center' }}>
          <span className="font-sans font-bold text-3xl tracking-tight" style={{ color: textColor1 }}>Invest</span>
          <span className="font-sans font-medium text-3xl tracking-tight" style={{ color: textColor2 }}>Corp</span>
        </div>
      </div>
      
      {showTagline && (
        <div 
          className="font-sans text-xs font-medium tracking-widest uppercase mt-1 ml-12" 
          style={{ color: taglineColor, transform: `scale(${scale})`, transformOrigin: 'top left' }}
        >
          Premier Investment Banking
        </div>
      )}
    </div>
  );
};

export default Logo;
