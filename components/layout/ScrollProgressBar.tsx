'use client';

import { useEffect, useState } from 'react';

export function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      if (documentHeight === windowHeight) {
        setProgress(0);
        return;
      }
      
      const scrollY = window.scrollY;
      const progressPercent = (scrollY / (documentHeight - windowHeight)) * 100;
      setProgress(progressPercent);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-[9999] pointer-events-none">
      <div 
        className="h-full bg-[#F6AC55] transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
