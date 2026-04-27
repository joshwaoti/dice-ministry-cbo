import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const metadata: Metadata = {
  title: 'Contact Us | DICE Ministry',
};

export default function ContactPage() {
  return (
    <div className="py-24 max-w-7xl mx-auto px-4">
      <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-16 text-center">Contact Us</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-2xl font-display font-bold text-primary mb-6">Send a Message</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="First Name" />
              <Input placeholder="Last Name" />
            </div>
            <Input placeholder="Email Address" type="email" />
            <textarea 
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:border-accent min-h-[150px]" 
              placeholder="Message"
            ></textarea>
            <Button size="lg" variant="primary" type="button">Send Message</Button>
          </form>
        </div>

        <div>
           <h2 className="text-2xl font-display font-bold text-primary mb-6">Contact Information</h2>
           <div className="space-y-6">
              <div className="bg-surface p-6 rounded-xl border border-border">
                <h4 className="font-bold text-primary mb-2">Address</h4>
                <p className="text-muted">Baba Dogo - Lucky Summer Road,<br/>Kanyoro House (opp. The Oasis Gym), 3rd Floor</p>
              </div>
              <div className="bg-surface p-6 rounded-xl border border-border">
                <h4 className="font-bold text-primary mb-2">Phone numbers</h4>
                <p className="text-muted">+254 725 248 788<br/>+254 115 447 886</p>
              </div>
              <div className="bg-surface p-6 rounded-xl border border-border">
                <h4 className="font-bold text-primary mb-2">Email</h4>
                <p className="text-muted">diceministrykenya@gmail.com</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
