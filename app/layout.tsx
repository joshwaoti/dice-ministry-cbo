import type {Metadata} from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Plus_Jakarta_Sans, Space_Grotesk, Geist, Outfit, DM_Serif_Display } from 'next/font/google';
import './globals.css';
import { cn } from "@/lib/utils";
import { AppProviders } from '@/components/providers/AppProviders';

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

const space = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-dm-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'DICE Ministry CBO',
  description: 'Empowering Teenagers & Young Adults in Kenya',
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/icon.png', type: 'image/png' },
    ],
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={cn("scroll-smooth", jakarta.variable, space.variable, outfit.variable, dmSerif.variable, "font-sans", geist.variable)}>
      <body className="font-sans antialiased bg-white text-[#111827]" suppressHydrationWarning>
        <ClerkProvider>
          <AppProviders>{children}</AppProviders>
        </ClerkProvider>
      </body>
    </html>
  );
}
