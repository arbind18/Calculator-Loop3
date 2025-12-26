import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { premiumTiers, calculateYearlySavings } from '@/lib/premium';
import { Check, Star, Zap, Crown } from 'lucide-react';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing - Calculator Loop',
  description: 'Choose the perfect plan for your needs. Start free or upgrade for advanced features.',
  alternates: {
    canonical: '/pricing',
  },
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background">
      <div className="container mx-auto px-4 py-16 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Crown className="h-4 w-4 mr-2" />
            Pricing Plans
          </div>
          <h1 className="text-4xl md:text-6xl font-bold">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Start free and upgrade when you need more power. No credit card required.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {premiumTiers.map((tier) => {
            const yearlySavings = calculateYearlySavings(tier);
            const isPopular = tier.popular;

            return (
              <Card
                key={tier.id}
                className={`relative ${
                  isPopular ? 'border-primary shadow-lg scale-105' : ''
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="gap-1 px-4 py-1">
                      <Star className="h-3 w-3 fill-current" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-8">
                  <div className="mb-4">
                    {tier.id === 'free' && <Zap className="h-12 w-12 mx-auto text-muted-foreground" />}
                    {tier.id === 'pro' && <Star className="h-12 w-12 mx-auto text-primary" />}
                    {tier.id === 'business' && <Crown className="h-12 w-12 mx-auto text-amber-500" />}
                  </div>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                  
                  <div className="mt-6">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold">
                        {tier.price.currency === 'INR' ? '₹' : '$'}
                        {tier.price.monthly}
                      </span>
                      {tier.price.monthly > 0 && (
                        <span className="text-muted-foreground">/month</span>
                      )}
                    </div>
                    
                    {tier.price.yearly > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground">
                          or ₹{tier.price.yearly}/year
                        </p>
                        <Badge variant="secondary" className="mt-1">
                          Save ₹{yearlySavings}/year
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    variant={isPopular ? 'default' : 'outline'}
                    size="lg"
                    asChild
                  >
                    <Link href={tier.id === 'free' ? '/register' : '/contact'}>
                      {tier.id === 'free' ? 'Get Started' : 'Upgrade Now'}
                    </Link>
                  </Button>

                  {tier.id !== 'free' && (
                    <p className="text-xs text-center text-muted-foreground">
                      14-day money-back guarantee
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Feature Comparison */}
        <section className="max-w-4xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Feature Comparison</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Feature</th>
                  <th className="text-center p-4">Free</th>
                  <th className="text-center p-4 bg-primary/5">Pro</th>
                  <th className="text-center p-4">Business</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4">Calculations per month</td>
                  <td className="text-center p-4">100</td>
                  <td className="text-center p-4 bg-primary/5">Unlimited</td>
                  <td className="text-center p-4">Unlimited</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Save history</td>
                  <td className="text-center p-4">10</td>
                  <td className="text-center p-4 bg-primary/5">Unlimited</td>
                  <td className="text-center p-4">Unlimited</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Export formats</td>
                  <td className="text-center p-4">PDF</td>
                  <td className="text-center p-4 bg-primary/5">PDF, Excel, CSV</td>
                  <td className="text-center p-4">All formats</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Advanced calculators</td>
                  <td className="text-center p-4">✗</td>
                  <td className="text-center p-4 bg-primary/5">✓</td>
                  <td className="text-center p-4">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">API access</td>
                  <td className="text-center p-4">✗</td>
                  <td className="text-center p-4 bg-primary/5">1,000/month</td>
                  <td className="text-center p-4">10,000/month</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Ad-free experience</td>
                  <td className="text-center p-4">✗</td>
                  <td className="text-center p-4 bg-primary/5">✓</td>
                  <td className="text-center p-4">✓</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4">Priority support</td>
                  <td className="text-center p-4">✗</td>
                  <td className="text-center p-4 bg-primary/5">✓</td>
                  <td className="text-center p-4">✓</td>
                </tr>
                <tr>
                  <td className="p-4">Custom branding</td>
                  <td className="text-center p-4">✗</td>
                  <td className="text-center p-4 bg-primary/5">✗</td>
                  <td className="text-center p-4">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I switch plans anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect
                  immediately, and we'll prorate the charges.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We accept all major credit/debit cards, UPI, net banking, and digital wallets
                  through our secure payment partner.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is there a free trial?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The Free plan is available forever! For Pro and Business plans, we offer a
                  14-day money-back guarantee.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you offer discounts for students or NGOs?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! We offer 50% discounts for students and non-profit organizations. Contact
                  us with your details to get started.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <Card className="max-w-3xl mx-auto bg-primary/5 mt-16">
          <CardContent className="p-12 text-center">
            <h3 className="text-3xl font-bold mb-4">Ready to get started?</h3>
            <p className="text-muted-foreground mb-8">
              Join thousands of users who trust Calculator Loop for their financial planning
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" asChild>
                <Link href="/register">Start Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
