'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import EmailDialog from '@/components/email/EmailDialog';
import NewsletterSignup from '@/components/email/NewsletterSignup';
import { Mail, Send, Calculator } from 'lucide-react';

export default function EmailExamplePage() {
  const { data: session } = useSession();
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  // Sample calculation
  const monthlyRate = interestRate / 12 / 100;
  const months = tenure * 12;
  const emi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1)
  );
  const totalAmount = emi * months;
  const totalInterest = totalAmount - loanAmount;

  const inputs = {
    loan_amount: loanAmount,
    interest_rate: interestRate,
    tenure_years: tenure,
  };

  const results = {
    monthly_emi: emi,
    total_amount: totalAmount,
    total_interest: totalInterest,
    principal_amount: loanAmount,
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Email Integration Examples</h1>
        <p className="text-muted-foreground text-lg">
          Test email functionality including calculation results and newsletter signup
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Email Calculation Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Email Calculation Results
            </CardTitle>
            <CardDescription>
              Send detailed calculation results directly to your email inbox
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sample Calculator */}
            <div className="space-y-4 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold">Sample EMI Calculator</h3>

              <div className="space-y-2">
                <Label>Loan Amount: ₹{loanAmount.toLocaleString('en-IN')}</Label>
                <Input
                  type="range"
                  min="100000"
                  max="10000000"
                  step="100000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label>Interest Rate: {interestRate}%</Label>
                <Input
                  type="range"
                  min="5"
                  max="20"
                  step="0.5"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label>Tenure: {tenure} years</Label>
                <Input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                />
              </div>

              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly EMI:</span>
                  <span className="font-semibold">₹{emi.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Amount:</span>
                  <span className="font-semibold">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Interest:</span>
                  <span className="font-semibold">₹{totalInterest.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Email Dialog */}
            <EmailDialog
              calculatorName="EMI Calculator"
              inputs={inputs}
              results={results}
              triggerButton={
                <Button className="w-full gap-2">
                  <Mail className="h-4 w-4" />
                  Email These Results
                </Button>
              }
            />

            <div className="text-sm text-muted-foreground space-y-2">
              <p className="font-medium">Features:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Professional HTML email template</li>
                <li>Detailed inputs and results breakdown</li>
                <li>Auto-fills email from session if logged in</li>
                <li>Beautiful responsive design</li>
                <li>PDF-ready format</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Newsletter Signup */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Newsletter Signup
              </CardTitle>
              <CardDescription>
                Subscribe to receive calculator tips and financial insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NewsletterSignup variant="default" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compact Variant</CardTitle>
              <CardDescription>Newsletter signup in compact form</CardDescription>
            </CardHeader>
            <CardContent>
              <NewsletterSignup variant="compact" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Footer Variant</CardTitle>
              <CardDescription>Newsletter signup for footer sections</CardDescription>
            </CardHeader>
            <CardContent>
              <NewsletterSignup variant="footer" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Setup Instructions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">1. Environment Variables</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Add these to your <code className="bg-muted px-1 rounded">.env.local</code> file:
            </p>
            <pre className="bg-muted p-3 rounded-lg text-sm overflow-x-auto">
              {`RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM=Calculator Pro <noreply@calculatorloop.com>
NEXT_PUBLIC_SITE_URL=https://calculatorloop.com`}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">2. Get Resend API Key</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground ml-2">
              <li>Sign up at <a href="https://resend.com" target="_blank" className="text-primary hover:underline">resend.com</a></li>
              <li>Verify your domain (or use their test domain)</li>
              <li>Create an API key in the dashboard</li>
              <li>Add the key to your environment variables</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold mb-2">3. Database Setup</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Run Prisma migration to add Newsletter model:
            </p>
            <pre className="bg-muted p-3 rounded-lg text-sm overflow-x-auto">
              {`npx prisma db push`}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">4. Test Email Sending</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-2">
              <li>Use the calculator above and click "Email These Results"</li>
              <li>Enter your email address and click "Send Email"</li>
              <li>Check your inbox for the calculation results</li>
              <li>Try subscribing to the newsletter</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
