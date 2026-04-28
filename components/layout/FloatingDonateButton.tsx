'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { DonationSheet } from './DonationSheet';

export function FloatingDonateButton() {
  const [isOpen, setIsOpen] = useState(false);

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
      <div className="fixed bottom-5 right-4 z-[100] transition-transform duration-300 sm:bottom-6 sm:right-5 lg:bottom-8 lg:right-8">
        <button
          onClick={() => setIsOpen(true)}
          className="donate-pulse relative flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg transition hover:scale-[1.03] hover:bg-accent/90 focus:outline-none lg:h-16 lg:w-16"
          aria-label="Open donation methods"
        >
          <Heart className="h-6 w-6 fill-white lg:h-7 lg:w-7" />
        </button>
      </div>

      {isOpen && <DonationSheet isOpen={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  );
}
