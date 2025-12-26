'use client';

import { useState } from 'react';
import { Mail, Send, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface NewsletterSignupProps {
  variant?: 'default' | 'compact' | 'footer';
  className?: string;
}

export default function NewsletterSignup({
  variant = 'default',
  className = '',
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/email/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      setSubscribed(true);
      toast.success('Successfully subscribed! Check your email for confirmation.');
      setEmail('');
      setName('');
    } catch (error: any) {
      console.error('Newsletter subscription error:', error);
      toast.error(error.message || 'Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading || subscribed}
          className="flex-1"
        />
        <Button type="submit" disabled={loading || subscribed} size="sm">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : subscribed ? (
            <Check className="h-4 w-4" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={className}>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Newsletter
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Get calculator tips, financial insights, and updates delivered to your inbox.
        </p>
        <form onSubmit={handleSubmit} className="space-y-2">
          <Input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading || subscribed}
          />
          <Button
            type="submit"
            disabled={loading || subscribed}
            className="w-full"
            variant="outline"
          >
            {loading ? 'Subscribing...' : subscribed ? 'Subscribed!' : 'Subscribe'}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <Card className={`p-6 ${className}`}>
      {subscribed ? (
        <div className="text-center py-8">
          <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">You're Subscribed!</h3>
          <p className="text-muted-foreground">
            Check your inbox for a confirmation email.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Stay Updated</h3>
            <p className="text-muted-foreground">
              Subscribe to our newsletter for calculator tips, financial insights, and exclusive
              updates.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Input
                type="text"
                placeholder="Your name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full gap-2">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Subscribing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Subscribe Now
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      )}
    </Card>
  );
}
