'use client';

import { useState } from 'react';
import { Mail, Send, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

interface EmailDialogProps {
  calculatorName: string;
  inputs: Record<string, any>;
  results: Record<string, any>;
  triggerButton?: React.ReactNode;
}

export default function EmailDialog({
  calculatorName,
  inputs,
  results,
  triggerButton,
}: EmailDialogProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(session?.user?.email || '');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/email/send-calculation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          calculatorName,
          inputs,
          results,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      setSent(true);
      toast.success('Email sent successfully! Check your inbox.');
      
      // Close dialog after 2 seconds
      setTimeout(() => {
        setOpen(false);
        setSent(false);
      }, 2000);
    } catch (error: any) {
      console.error('Send email error:', error);
      toast.error(error.message || 'Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button variant="outline" className="gap-2">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Email Results</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Email Calculation Results</DialogTitle>
          <DialogDescription>
            Send your {calculatorName.toLowerCase()} results to your email inbox
          </DialogDescription>
        </DialogHeader>

        {sent ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Email Sent!</h3>
            <p className="text-sm text-muted-foreground">
              Check your inbox at {email}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="text-sm font-medium">What you'll receive:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• All calculation inputs</li>
                <li>• Detailed results breakdown</li>
                <li>• Professional PDF-ready format</li>
                <li>• Easy to save and share</li>
              </ul>
            </div>

            <Button
              onClick={handleSend}
              disabled={loading || !email}
              className="w-full gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Email
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Your email will only be used to send calculation results
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
