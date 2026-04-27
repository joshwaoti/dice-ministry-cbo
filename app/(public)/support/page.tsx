import { Metadata } from 'next';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Support Us | DICE Ministry',
};

export default function SupportPage() {
  return (
    <div className="py-24 max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">Let&apos;s Make A Change</h1>
        <p className="text-xl text-muted max-w-2xl mx-auto">Your gifts provide resources and training for teenagers and young adults.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <Card>
          <CardContent className="p-8">
            <CardTitle className="text-2xl mb-4 text-primary">Bank Deposit</CardTitle>
            <p className="text-muted mb-2"><strong>Bank:</strong> Co-operative Bank</p>
            <p className="text-muted mb-2"><strong>Branch:</strong> Thika Road Mall</p>
            <p className="text-muted mb-2"><strong>A/c Name:</strong> DICE Ministry CBO</p>
            <p className="text-muted"><strong>A/c No.:</strong> 01100178076001</p>
          </CardContent>
        </Card>
        
        <Card className="border-accent shadow-md">
          <CardContent className="p-8 text-center flex flex-col items-center">
            <CardTitle className="text-2xl mb-4 text-primary">Online</CardTitle>
            <p className="text-muted mb-6 flex-1">Make a fast, secure, and tax deductible donation online via Donorbox.</p>
            <a href="https://donorbox.org/dice-ministries-kenya" target="_blank" rel="noreferrer" className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-3 rounded-md transition-colors block">
              Click to Give
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-8">
            <CardTitle className="text-2xl mb-4 text-primary">M-PESA</CardTitle>
            <div className="bg-green-100 text-green-800 p-4 rounded-xl mb-4 text-center font-bold">
              Paybill: 400200
            </div>
            <div className="bg-gray-100 text-gray-800 p-4 rounded-xl text-center font-bold">
              Account: 6458
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
