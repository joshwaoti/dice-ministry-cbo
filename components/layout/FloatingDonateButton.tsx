'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { DonationSheet } from './DonationSheet';
import { useIsMobile } from '@/hooks/use-mobile';

export function FloatingDonateButton() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 1; }
          40% { transform: scale(1.4); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }
        .donate-pulse::before {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background-color: #E8621A;
          animation: pulse-ring 2s infinite;
          opacity: 0.4;
          z-index: -1;
        }
      `}} />
      <div className="fixed bottom-6 right-5 z-[100] transition-transform duration-300">
        <button
          onClick={() => setIsOpen(true)}
          className="relative w-14 h-14 bg-accent text-white rounded-full flex items-center justify-center shadow-lg hover:bg-accent/90 focus:outline-none donate-pulse"
        >
          <Heart className="w-6 h-6 fill-white" />
        </button>
      </div>

      {isOpen && (
        <DonationSheet isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}
