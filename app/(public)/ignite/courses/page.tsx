import { Metadata } from 'next';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Course Library | DICE Ministry',
};

export default function CourseLibraryPage() {
  const courses = [
    { 
      title: "Discipleship Foundations", 
      tagline: "Understanding the foundations of faith.",
      modules: [
        { title: "Foundations of Salvation & Identity in Christ", units: ["Understanding Salvation", "Identity in Christ", "Grace & Faith", "Repentance & Baptism", "Living as a Child of God"] },
        { title: "Spiritual Growth & Disciplines", units: ["Prayer as Communication", "Bible Study Methods", "Fasting & Worship", "Meditation on Scripture", "Personal Devotions", "Accountability Partnerships", "Spiritual Journaling"] },
        { title: "The Holy Spirit & Spiritual Maturity", units: ["The Person of the Holy Spirit", "The Gifts of the Holy Spirit", "Walking in the Spirit", "Fruit of the Spirit"] },
        { title: "Evangelism & Discipleship", units: ["Sharing Your Testimony", "The Gospel Message", "Making Disciples"] },
        { title: "Christian Community & Church Life", units: ["The Body of Christ", "Serving in the Church"] }
      ]
    },
    { 
      title: "Peer Mentoring & Practical Life Skills", 
      tagline: "Navigating choices and discovering purpose.",
      modules: [
        { title: "Self-awareness & Personal Growth", units: ["Understanding Your Personality", "Strengths & Weaknesses", "Emotional Intelligence", "Goal Setting", "Personal Values"] },
        { title: "Social Influence & Healthy Living", units: ["Peer Pressure & Choices", "Healthy Habits", "Mental Wellness"] },
        { title: "Foundations of Relationships", units: ["Types of Relationships", "Communication Skills", "Conflict Resolution", "Boundaries in Relationships", "Trust & Vulnerability", "Friendship vs Romance", "toxic Relationships"] },
        { title: "Intentional Dating & Relationship Decisions", units: ["Dating with Purpose", "Courtship Principles", "Red Flags in Dating", "Breaking Up Well", "Waiting for Marriage"] },
        { title: "Sexual Purity & Godly Relationships", units: ["God's Design for Sexuality", "Purity in Thought & Action", "Marriage Preparation"] }
      ]
    },
    { 
      title: "Digital Literacy", 
      tagline: "Digital Skills for Everyday Success.",
      modules: [
        { title: "Digital Literacy Foundations", units: ["Computer Basics", "Internet Safety", "Email & Communication"] },
        { title: "Office Productivity Tools", units: ["Word Processing", "Spreadsheets & Data", "Presentations"] },
        { title: "Data & Publication Tools", units: ["Document Formatting", "Basic Design Tools"] }
      ]
    },
  ];

  return (
    <div className="py-32 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">Ignite Course Library</h1>
        <p className="text-xl text-muted max-w-2xl mx-auto">A look inside our 6-month discipleship program.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {courses.map((c) => (
          <Card key={c.title} className="border-border/60 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-8">
              <CardTitle className="text-2xl mb-3 font-display text-primary">{c.title}</CardTitle>
              <p className="text-muted mb-8">{c.tagline}</p>
              
              <div className="mb-8">
                <Accordion className="w-full">
                  {c.modules.map((m, idx) => (
                    <AccordionItem key={idx} value={`item-${idx}`} className="border-border">
                      <AccordionTrigger className="hover:no-underline hover:text-accent font-medium text-left">
                        <span>{m.title} <span className="text-xs text-muted ml-2 font-normal">({m.units.length} units)</span></span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-3 pt-2">
                          {m.units.map((unit, uIdx) => (
                            <li key={uIdx} className="flex justify-between items-center text-sm text-gray-600 pl-4 border-l-2 border-gray-100 pb-1">
                              <span>{unit}</span>
                              <Lock className="w-3.5 h-3.5 text-gray-400 shrink-0 ml-2" />
                            </li>
                          ))}
                          <li className="text-xs text-center text-muted italic pt-4">
                            Log in to access content
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              <div className="pt-6 border-t border-border">
              <Button asChild className="w-full bg-[#F6AC55] font-bold text-white hover:bg-[#F6AC55]/90" size="lg">
                  <Link href="/apply">Enroll in Ignite</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
