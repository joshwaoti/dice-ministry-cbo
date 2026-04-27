import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Our Team | DICE Ministry',
};

export default function TeamPage() {
  const team = [
    { name: "Maurice Agunda", role: "Founder & President", photo: "https://picsum.photos/seed/t1/200/200" },
    { name: "Christine Sharon", role: "Executive Team Member", photo: "https://picsum.photos/seed/t2/200/200" },
    { name: "Salim Kwatsima", role: "Executive Team Member", photo: "https://picsum.photos/seed/t3/200/200" },
    { name: "Robert Ochieng", role: "Executive Team Member", photo: "https://picsum.photos/seed/t4/200/200" },
    { name: "Faith Magale", role: "Executive Team Member", photo: "https://picsum.photos/seed/t5/200/200" },
    { name: "Pst. Albert Shitakwa", role: "Patron", photo: "https://picsum.photos/seed/t6/200/200" },
    { name: "Jane Watetu", role: "Discipleship Trainer", photo: "https://picsum.photos/seed/t7/200/200" },
    { name: "Zipporah Ntabo", role: "Discipleship Trainer", photo: "https://picsum.photos/seed/t8/200/200" }
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
