'use client';

import { Heart, BookOpen, Star, Users, GraduationCap, Zap } from 'lucide-react';
import { BeliefCard } from './BeliefCard';

const beliefs = [
  {
    icon: Heart,
    title: 'Faith',
    description: 'We believe that a personal relationship with Jesus Christ is the foundation for a transformed life. Our faith drives everything we do.'
  },
  {
    icon: BookOpen,
    title: 'The Word',
    description: 'The Bible is our ultimate guide and authority. We believe in studying, understanding, and applying its timeless truths to modern challenges.'
  },
  {
    icon: Star,
    title: 'Prayer',
    description: 'We believe in the power of prayer to change circumstances and hearts. It is our constant connection to God’s guidance and strength.'
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Faith is not meant to be lived in isolation. We foster authentic community where young people are known, loved, and supported.'
  },
  {
    icon: GraduationCap,
    title: 'Discipleship',
    description: 'True growth happens through intentional mentorship. We walk alongside students to help them mature in character and conviction.'
  },
  {
    icon: Zap,
    title: 'Empowerment',
    description: 'Young people are not just the church of tomorrow; they are leaders today. We equip them with practical skills to impact their world.'
  }
];

export function BeliefGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
      {beliefs.map((belief, i) => (
        <BeliefCard 
          key={i}
          icon={belief.icon}
          title={belief.title}
          description={belief.description}
          delay={i * 0.1}
        />
      ))}
    </div>
  );
}
