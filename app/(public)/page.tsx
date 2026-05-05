import { HeroSection } from '@/components/home/HeroSection';
import { QuickNavCards } from '@/components/home/QuickNavCards';
import { MissionStrip } from '@/components/home/MissionStrip';
import { ImpactStats } from '@/components/home/ImpactStats';
import { IgniteFeature } from '@/components/home/IgniteFeature';
import { TestimonialSection } from '@/components/home/TestimonialSection';
import { OurWorkPreview } from '@/components/home/OurWorkPreview';
import { PartnersStrip } from '@/components/home/PartnersStrip';
import { CTABanner } from '@/components/home/CTABanner';
import { AnnouncementBanner } from '@/components/layout/AnnouncementBanner';

export default function HomePage() {
  return (
    <>
      <AnnouncementBanner />
      <HeroSection />
      <QuickNavCards />
      <MissionStrip />
      <ImpactStats />
      <IgniteFeature />
      <TestimonialSection />
      <OurWorkPreview />
      <PartnersStrip />
      <CTABanner />
    </>
  );
}
