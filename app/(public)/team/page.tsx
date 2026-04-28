import { Metadata } from 'next';
import Image from 'next/image';
import mauricePhoto from '@/images/diceministry/Maurice Agunda.jpg';
import christinePhoto from '@/images/diceministry/Christine Sharon.jpg';
import salimPhoto from '@/images/diceministry/Salim Kwatsima.jpg';
import rovertPhoto from '@/images/diceministry/Rovert Ochieng.jpg';
import faithPhoto from '@/images/diceministry/Faith Mugale.jpg';
import pstAlbertPhoto from '@/images/diceministry/Pst Albert Shitakwa.jpg';
import janePhoto from '@/images/diceministry/Jane Watetu.jpg';
import zipporahPhoto from '@/images/diceministry/Zipporah Ntabo.jpg';

export const metadata: Metadata = {
  title: 'Our Team | DICE Ministry',
};

export default function TeamPage() {
  const team = [
    { name: 'Maurice Agunda', role: 'Founder & President', photo: mauricePhoto },
    { name: 'Christine Sharon', role: 'Executive Team Member', photo: christinePhoto },
    { name: 'Salim Kwatsima', role: 'Executive Team Member', photo: salimPhoto },
    { name: 'Rovert Ochieng', role: 'Executive Team Member', photo: rovertPhoto },
    { name: 'Faith Mugale', role: 'Executive Team Member', photo: faithPhoto },
    { name: 'Pst Albert Shitakwa', role: 'Patron', photo: pstAlbertPhoto },
    { name: 'Jane Watetu', role: 'Discipleship Trainer', photo: janePhoto },
    { name: 'Zipporah Ntabo', role: 'Discipleship Trainer', photo: zipporahPhoto },
  ];

  return (
    <div className="py-24 max-w-7xl mx-auto px-4">
      <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-16 text-center">Our Team</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {team.map((member) => (
          <div key={member.name} className="text-center group cursor-pointer">
            <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden mb-4 border-4 border-surface shadow-md group-hover:border-accent transition-colors">
              <Image src={member.photo} alt={member.name} fill className="object-cover" />
            </div>
            <h3 className="font-display font-bold text-xl text-primary">{member.name}</h3>
            <p className="text-accent text-sm font-medium">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
