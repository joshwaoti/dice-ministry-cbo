import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our History | DICE Ministry',
};

export default function HistoryPage() {
  const milestones = [
    { year: "2004", title: "The Observation", desc: "Maurice Agunda notices a troubling pattern—many young people were coming to faith with passion and excitement, but over time, that initial fire for Jesus would fade." },
    { year: "2007", title: "The Vision", desc: "Maurice received a clear vision: to create a ministry that would provide a strong, lasting foundation for youth and new believers." },
    { year: "2008", title: "Partnership with Baptist Chapel", desc: "Maurice partnered with Baptist Chapel in Lucky Summer to launch a 9-month discipleship training program using the New Life Training Curriculum by Campus Crusade for Christ." },
    { year: "2009", title: "Expansion", desc: "Training expanded with programs at Baptist Chapel and Highridge Baptist Church in Korogocho." },
    { year: "2010", title: "High School Ministry", desc: "Launched at St. Mary's Keris High School in Lucky Summer." },
    { year: "2012", title: "Inaugural SURGE (now Ignite)", desc: "First SURGE program launched — 9-month discipleship training covering Evangelism, Peer Education, Life Skills, and Computer Skills." },
    { year: "2015", title: "Short-term Missions", desc: "Partnership with Reign Ministries begins, hosting Royal Servants and Kairos mission trips." }
  ];

  return (
    <div className="py-32 px-4 max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-16 text-center">Our History</h1>
      <div className="relative border-l-4 border-primary space-y-12 pl-8">
        {milestones.map((m, i) => (
          <div key={i} className="relative">
            <div className="absolute w-6 h-6 bg-accent rounded-full -left-[43px] top-1 border-4 border-white shadow-sm" />
            <div className="bg-surface p-6 rounded-2xl shadow-sm">
              <span className="inline-block bg-accent/10 text-accent font-bold px-3 py-1 rounded-full text-sm mb-3">{m.year}</span>
              <h3 className="font-display text-2xl font-bold text-primary mb-2">{m.title}</h3>
              <p className="text-muted">{m.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
