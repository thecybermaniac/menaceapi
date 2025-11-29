import { useState, useEffect } from 'react';

export function useDeviceDetect() {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState<boolean | null>(null);

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      
      // Check for mobile/tablet user agents
      const mobileKeywords = [
        'android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry',
        'windows phone', 'opera mini', 'mobile', 'tablet'
      ];
      
      const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));
      
      // Also check for touch-only devices with small screens
      const isSmallScreen = window.innerWidth < 1024;
      const isTouchOnly = 'ontouchstart' in window && !window.matchMedia('(pointer: fine)').matches;
      
      setIsMobileOrTablet(isMobileUA || (isSmallScreen && isTouchOnly));
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return isMobileOrTablet;
}
