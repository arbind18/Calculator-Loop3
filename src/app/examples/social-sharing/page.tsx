'use client';

import ShareButton from '@/components/social/ShareButton';
import ShareCalculationButton from '@/components/social/ShareCalculationButton';
import { Card } from '@/components/ui/card';
import { useShare } from '@/hooks/useShare';
import { Button } from '@/components/ui/button';

export default function SocialSharingExample() {
  const { shareToWhatsApp, shareToTwitter, shareToFacebook, copyToClipboard } = useShare();

  const sampleResults = {
    monthlyEMI: 23178,
    loanAmount: 2500000,
    totalInterest: 788400,
    totalAmount: 3288400,
    interestRate: 8.5,
    tenure: 20,
  };

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Social Sharing Features</h1>
        <p className="text-muted-foreground">
          Comprehensive social media sharing and calculation result sharing components
        </p>
      </div>

      {/* Basic Share Button */}
      <Card className="p-6 space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Basic Share Button</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Generic share button with multiple platform options
          </p>
        </div>
        <ShareButton
          title="Calculator Pro - Best Online Calculators"
          text="Check out this amazing calculator tool! Calculate EMI, SIP, BMI and more."
          hashtags={['Calculator', 'Finance', 'Tools']}
        />
      </Card>

      {/* Calculation Share Button */}
      <Card className="p-6 space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Calculation Results Share</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Share formatted calculation results with auto-generated message
          </p>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Loan Amount</p>
              <p className="text-xl font-bold">₹25,00,000</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly EMI</p>
              <p className="text-xl font-bold text-primary">₹23,178</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Interest</p>
              <p className="text-xl font-bold text-destructive">₹7,88,400</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tenure</p>
              <p className="text-xl font-bold">20 years</p>
            </div>
          </div>
          <ShareCalculationButton
            calculatorName="Home Loan EMI Calculator"
            results={sampleResults}
            customMessage="I just calculated my dream home loan EMI! 🏡"
            hashtags={['HomeLoan', 'EMI', 'RealEstate', 'Finance']}
          />
        </div>
      </Card>

      {/* Individual Share Methods */}
      <Card className="p-6 space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Individual Share Methods</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Use the useShare hook for custom sharing logic
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => shareToWhatsApp('Check out Calculator Pro! 🧮\n\nBest online calculators for all your needs.')}
            className="bg-green-600 hover:bg-green-700"
          >
            Share on WhatsApp
          </Button>
          <Button
            onClick={() => shareToTwitter(
              'Just discovered Calculator Pro - the best free online calculator tools! 🎯',
              window.location.href,
              ['Calculator', 'Tools', 'Free']
            )}
            className="bg-blue-400 hover:bg-blue-500"
          >
            Share on Twitter
          </Button>
          <Button
            onClick={() => shareToFacebook(window.location.href)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Share on Facebook
          </Button>
          <Button
            onClick={() => copyToClipboard(window.location.href)}
            variant="outline"
          >
            Copy Link
          </Button>
        </div>
      </Card>

      {/* Features List */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Implemented Features</h2>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span><strong>Multi-platform support:</strong> WhatsApp, Twitter, Facebook, LinkedIn</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span><strong>Native share API:</strong> Uses Web Share API on mobile devices</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span><strong>Copy to clipboard:</strong> Instant link copying with visual feedback</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span><strong>Toast notifications:</strong> User feedback for all actions</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span><strong>Formatted messages:</strong> Auto-generates beautiful share text</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span><strong>Custom hashtags:</strong> SEO-optimized hashtags for each platform</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span><strong>Open Graph images:</strong> Dynamic OG image generation API</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">✓</span>
            <span><strong>Social meta utils:</strong> Helper functions for all platforms</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
