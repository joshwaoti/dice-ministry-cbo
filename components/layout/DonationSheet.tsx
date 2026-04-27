'use client';

import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function DonationSheet({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[101]"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-[102] bg-surface rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-display font-bold text-primary">Support DICE Ministry</h3>
                  <p className="text-sm text-muted-foreground">Choose a donation method below.</p>
                </div>
                <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="space-y-4">
                <Card className="border-border">
                  <CardContent className="p-4">
                    <h4 className="font-bold text-primary mb-2">MPESA Paybill</h4>
                    <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm">
                      <p>Paybill: <strong>898989</strong></p>
                      <p>Account: <strong>Your Name</strong></p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-4">
                    <h4 className="font-bold text-primary mb-2">Bank Transfer</h4>
                    <div className="bg-gray-50 p-3 rounded-lg font-mono text-sm">
                      <p>Bank: <strong>Equity Bank Kenya</strong></p>
                      <p>Account Name: <strong>DICE Ministry</strong></p>
                      <p>Account Number: <strong>1234567890</strong></p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border bg-gradient-to-br from-primary to-primary/95 text-white">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white mb-1">Online via Donorbox</h4>
                      <p className="text-white/70 text-sm">Cards & Paypal accepted</p>
                    </div>
                    <Button variant="outline" className="bg-white text-primary hover:bg-gray-100 border-none shrink-0 font-bold">Donate</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
