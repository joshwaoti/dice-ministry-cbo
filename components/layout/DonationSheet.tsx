'use client';

import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { wixPublicContent } from '@/lib/wix-public-content';

export function DonationSheet({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const support = wixPublicContent.support;

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
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-[102] max-h-[85vh] overflow-y-auto rounded-t-3xl bg-surface shadow-2xl md:bottom-8 md:left-auto md:right-8 md:w-[440px] md:max-h-[calc(100vh-4rem)] md:rounded-[28px]"
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
                    <h4 className="mb-2 font-bold text-primary">{support.methods[1].title}</h4>
                    <div className="rounded-lg bg-gray-50 p-3 font-mono text-sm">
                      <p>Paybill: <strong>400200</strong></p>
                      <p>Account: <strong>6458</strong></p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="p-4">
                    <h4 className="mb-2 font-bold text-primary">{support.methods[0].title}</h4>
                    <div className="rounded-lg bg-gray-50 p-3 font-mono text-sm">
                      <p>Bank: <strong>Co-operative Bank</strong></p>
                      <p>Branch: <strong>Thika Road Mall</strong></p>
                      <p>Account Name: <strong>DICE Ministry CBO</strong></p>
                      <p>Account Number: <strong>01100178076001</strong></p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border bg-gradient-to-br from-primary to-primary/95 text-white">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white mb-1">Online via Donorbox</h4>
                      <p className="text-white/70 text-sm">Cards & Paypal accepted</p>
                    </div>
                    <Button
                      variant="outline"
                      className="shrink-0 border-none bg-white font-bold text-primary hover:bg-gray-100"
                      asChild
                    >
                      <a href={support.methods[2].href} target="_blank" rel="noreferrer">
                        Donate
                      </a>
                    </Button>
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
