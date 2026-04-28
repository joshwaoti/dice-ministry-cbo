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
      title: "Discipleship 101", 
      desc: "Understanding the foundations of faith.", 
      modules: [
        { title: "Introduction to Faith", units: ["What is Faith?", "The Grace of God", "Repentance", "Assignment: Reflection"] },
        { title: "The Bible", units: ["How to Read the Bible", "Old Testament Overview", "New Testament Overview"] }
      ]
    },
    { 
      title: "Career Guidance", 
      desc: "Navigating choices and discovering purpose.", 
      modules: [
        { title: "Discovering Gifts", units: ["Spiritual Gifts", "Talents & Skills", "Personality Tests"] },
        { title: "Practical Steps", units: ["CV Writing", "Interview Skills", "Workplace Ethics"] }
      ]
    },
    { 
      title: "Digital Literacy", 
      desc: "Essential computer skills.", 
      modules: [
        { title: "Computer Basics", units: ["Hardware vs Software", "Operating Systems", "File Management"] },
        { title: "Office Suite", units: ["Word Processing", "Spreadsheets", "Presentations"] }
      ]
    },
  ];

  return (
    <div className="py-32 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">Ignite Course Library</h1>
        <p className="text-xl text-muted max-w-2xl mx-auto">A look inside our 6-month discipleship program.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {courses.map((c) => (
          <Card key={c.title} className="flex flex-col border-border/60 shadow-sm hover:shadow-md transition-shadow h-full">
            <CardContent className="p-8 flex-1 flex flex-col">
              <CardTitle className="text-2xl mb-3 font-display text-primary">{c.title}</CardTitle>
              <p className="text-muted flex-grow mb-8">{c.desc}</p>
              
              <div className="mb-8 flex-1">
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

              <div className="pt-6 border-t border-border mt-auto">
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
