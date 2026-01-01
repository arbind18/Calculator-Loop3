'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ApiKeysManager from '@/components/api/ApiKeysManager';
import {
  Code,
  Book,
  Key,
  Zap,
  Shield,
  TrendingUp,
  Copy,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';

export default function ApiDocsPage() {
  const [activeEndpoint, setActiveEndpoint] = useState('emi');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    toast.success('Code copied to clipboard');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const codeExamples = {
    emi: {
      javascript: `// Using fetch API
const response = await fetch('https://calculatorloop.com/api/v1/calculators/emi?principal=1000000&interestRate=8.5&tenure=20', {
  headers: {
    'X-API-Key': 'YOUR_API_KEY'
  }
});

const data = await response.json();
console.log(data.data.results.monthlyEMI); // ₹8,679`,

      python: `import requests

url = "https://calculatorloop.com/api/v1/calculators/emi"
headers = {"X-API-Key": "YOUR_API_KEY"}
params = {
    "principal": 1000000,
    "interestRate": 8.5,
    "tenure": 20
}

response = requests.get(url, headers=headers, params=params)
data = response.json()
print(data["data"]["results"]["monthlyEMI"])`,

      curl: `curl -X GET "https://calculatorloop.com/api/v1/calculators/emi?principal=1000000&interestRate=8.5&tenure=20" \\
  -H "X-API-Key: YOUR_API_KEY"`,

      postExample: `// POST request with amortization schedule
const response = await fetch('https://calculatorloop.com/api/v1/calculators/emi', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'YOUR_API_KEY'
  },
  body: JSON.stringify({
    principal: 1000000,
    interestRate: 8.5,
    tenure: 20,
    includeSchedule: true
  })
});

const data = await response.json();
console.log(data.data.schedule); // Full amortization schedule`,
    },
    bmi: {
      javascript: `// Using fetch API
const response = await fetch('https://calculatorloop.com/api/v1/calculators/bmi?weight=70&height=170&unit=metric', {
  headers: {
    'X-API-Key': 'YOUR_API_KEY'
  }
});

const data = await response.json();
console.log(data.data.results.bmi); // 24.2
console.log(data.data.results.category); // "Normal weight"`,

      python: `import requests

url = "https://calculatorloop.com/api/v1/calculators/bmi"
headers = {"X-API-Key": "YOUR_API_KEY"}
params = {
    "weight": 70,
    "height": 170,
    "unit": "metric"
}

response = requests.get(url, headers=headers, params=params)
data = response.json()
print(f"BMI: {data['data']['results']['bmi']}")
print(f"Category: {data['data']['results']['category']}")`,

      curl: `curl -X GET "https://calculatorloop.com/api/v1/calculators/bmi?weight=70&height=170&unit=metric" \\
  -H "X-API-Key: YOUR_API_KEY"`,

      postExample: `// POST request with calorie calculation
const response = await fetch('https://calculatorloop.com/api/v1/calculators/bmi', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'YOUR_API_KEY'
  },
  body: JSON.stringify({
    weight: 70,
    height: 170,
    unit: 'metric',
    age: 30,
    gender: 'male'
  })
});

const data = await response.json();
console.log(data.data.results.dailyCalories); // Calorie needs by activity level`,
    },
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold mb-4">Calculator API</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Powerful RESTful API to integrate our calculators into your applications.
          Fast, reliable, and easy to use.
        </p>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <Card>
          <CardContent className="p-6 text-center">
            <Zap className="h-10 w-10 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-2">Fast & Reliable</h3>
            <p className="text-sm text-muted-foreground">
              Sub-100ms response times with 99.9% uptime
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Shield className="h-10 w-10 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-2">Secure</h3>
            <p className="text-sm text-muted-foreground">
              API key authentication with rate limiting
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Code className="h-10 w-10 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-2">Easy Integration</h3>
            <p className="text-sm text-muted-foreground">
              RESTful design with JSON responses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-10 w-10 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-2">Scalable</h3>
            <p className="text-sm text-muted-foreground">
              From 100 to 10,000 requests/hour
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="docs" className="space-y-6">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
          <TabsTrigger value="docs">
            <Book className="h-4 w-4 mr-2" />
            Documentation
          </TabsTrigger>
          <TabsTrigger value="keys">
            <Key className="h-4 w-4 mr-2" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="pricing">
            <TrendingUp className="h-4 w-4 mr-2" />
            Pricing
          </TabsTrigger>
        </TabsList>

        {/* Documentation Tab */}
        <TabsContent value="docs" className="space-y-8">
          {/* Quick Start */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Start</CardTitle>
              <CardDescription>Get started with the Calculator API in minutes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">1. Get your API key</h4>
                <p className="text-sm text-muted-foreground">
                  Click on the "API Keys" tab to generate your free API key
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">2. Make your first request</h4>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto relative">
                  <code>
                    GET https://calculatorloop.com/api/v1/calculators/emi?principal=1000000&interestRate=8.5&tenure=20
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => copyCode('GET https://calculatorloop.com/api/v1/calculators/emi?principal=1000000&interestRate=8.5&tenure=20', 'quickstart')}
                  >
                    {copiedCode === 'quickstart' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">3. Add authentication header</h4>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  <code>X-API-Key: YOUR_API_KEY</code>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Base URL */}
          <Card>
            <CardHeader>
              <CardTitle>Base URL</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg font-mono">
                https://calculatorloop.com/api/v1
              </div>
            </CardContent>
          </Card>

          {/* Endpoints */}
          <Card>
            <CardHeader>
              <CardTitle>Available Endpoints</CardTitle>
              <CardDescription>Choose a calculator to see detailed documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeEndpoint} onValueChange={setActiveEndpoint}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="emi">EMI Calculator</TabsTrigger>
                  <TabsTrigger value="bmi">BMI Calculator</TabsTrigger>
                </TabsList>

                {/* EMI Endpoint */}
                <TabsContent value="emi" className="space-y-6 mt-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">EMI Calculator API</h3>
                    <p className="text-muted-foreground mb-4">
                      Calculate Equated Monthly Installment for loans
                    </p>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">GET /api/v1/calculators/emi</h4>
                        <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                          <div>
                            <span className="font-medium">principal</span> (number, required) - Loan amount in INR
                          </div>
                          <div>
                            <span className="font-medium">interestRate</span> (number, required) - Annual interest rate %
                          </div>
                          <div>
                            <span className="font-medium">tenure</span> (number, required) - Loan tenure in years
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Code Examples</h4>
                        <Tabs defaultValue="js">
                          <TabsList>
                            <TabsTrigger value="js">JavaScript</TabsTrigger>
                            <TabsTrigger value="py">Python</TabsTrigger>
                            <TabsTrigger value="curl">cURL</TabsTrigger>
                            <TabsTrigger value="post">POST</TabsTrigger>
                          </TabsList>
                          <TabsContent value="js">
                            <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto relative">
                              <pre><code>{codeExamples.emi.javascript}</code></pre>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="absolute top-2 right-2"
                                onClick={() => copyCode(codeExamples.emi.javascript, 'emi-js')}
                              >
                                {copiedCode === 'emi-js' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              </Button>
                            </div>
                          </TabsContent>
                          <TabsContent value="py">
                            <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto relative">
                              <pre><code>{codeExamples.emi.python}</code></pre>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="absolute top-2 right-2"
                                onClick={() => copyCode(codeExamples.emi.python, 'emi-py')}
                              >
                                {copiedCode === 'emi-py' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              </Button>
                            </div>
                          </TabsContent>
                          <TabsContent value="curl">
                            <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto relative">
                              <pre><code>{codeExamples.emi.curl}</code></pre>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="absolute top-2 right-2"
                                onClick={() => copyCode(codeExamples.emi.curl, 'emi-curl')}
                              >
                                {copiedCode === 'emi-curl' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              </Button>
                            </div>
                          </TabsContent>
                          <TabsContent value="post">
                            <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto relative">
                              <pre><code>{codeExamples.emi.postExample}</code></pre>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="absolute top-2 right-2"
                                onClick={() => copyCode(codeExamples.emi.postExample, 'emi-post')}
                              >
                                {copiedCode === 'emi-post' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              </Button>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Response Example</h4>
                        <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
                          <pre><code>{`{
  "success": true,
  "data": {
    "calculator": "EMI Calculator",
    "inputs": {
      "principal": 1000000,
      "interestRate": 8.5,
      "tenure": 20
    },
    "results": {
      "monthlyEMI": 8679,
      "totalAmount": 2082960,
      "totalInterest": 1082960,
      "principalAmount": 1000000
    },
    "currency": "INR"
  },
  "timestamp": "2026-01-02T10:30:00.000Z"
}`}</code></pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* BMI Endpoint */}
                <TabsContent value="bmi" className="space-y-6 mt-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">BMI Calculator API</h3>
                    <p className="text-muted-foreground mb-4">
                      Calculate Body Mass Index and health metrics
                    </p>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">GET /api/v1/calculators/bmi</h4>
                        <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                          <div>
                            <span className="font-medium">weight</span> (number, required) - Weight in kg or lbs
                          </div>
                          <div>
                            <span className="font-medium">height</span> (number, required) - Height in cm or inches
                          </div>
                          <div>
                            <span className="font-medium">unit</span> (string, optional) - "metric" or "imperial" (default: metric)
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Code Examples</h4>
                        <Tabs defaultValue="js">
                          <TabsList>
                            <TabsTrigger value="js">JavaScript</TabsTrigger>
                            <TabsTrigger value="py">Python</TabsTrigger>
                            <TabsTrigger value="curl">cURL</TabsTrigger>
                            <TabsTrigger value="post">POST</TabsTrigger>
                          </TabsList>
                          <TabsContent value="js">
                            <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto relative">
                              <pre><code>{codeExamples.bmi.javascript}</code></pre>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="absolute top-2 right-2"
                                onClick={() => copyCode(codeExamples.bmi.javascript, 'bmi-js')}
                              >
                                {copiedCode === 'bmi-js' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              </Button>
                            </div>
                          </TabsContent>
                          <TabsContent value="py">
                            <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto relative">
                              <pre><code>{codeExamples.bmi.python}</code></pre>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="absolute top-2 right-2"
                                onClick={() => copyCode(codeExamples.bmi.python, 'bmi-py')}
                              >
                                {copiedCode === 'bmi-py' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              </Button>
                            </div>
                          </TabsContent>
                          <TabsContent value="curl">
                            <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto relative">
                              <pre><code>{codeExamples.bmi.curl}</code></pre>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="absolute top-2 right-2"
                                onClick={() => copyCode(codeExamples.bmi.curl, 'bmi-curl')}
                              >
                                {copiedCode === 'bmi-curl' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              </Button>
                            </div>
                          </TabsContent>
                          <TabsContent value="post">
                            <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto relative">
                              <pre><code>{codeExamples.bmi.postExample}</code></pre>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="absolute top-2 right-2"
                                onClick={() => copyCode(codeExamples.bmi.postExample, 'bmi-post')}
                              >
                                {copiedCode === 'bmi-post' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              </Button>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Error Codes */}
          <Card>
            <CardHeader>
              <CardTitle>Error Codes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between p-3 bg-muted rounded">
                  <span className="font-mono">400</span>
                  <span>Bad Request - Invalid parameters</span>
                </div>
                <div className="flex justify-between p-3 bg-muted rounded">
                  <span className="font-mono">401</span>
                  <span>Unauthorized - Missing or invalid API key</span>
                </div>
                <div className="flex justify-between p-3 bg-muted rounded">
                  <span className="font-mono">429</span>
                  <span>Too Many Requests - Rate limit exceeded</span>
                </div>
                <div className="flex justify-between p-3 bg-muted rounded">
                  <span className="font-mono">500</span>
                  <span>Internal Server Error</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Keys Tab */}
        <TabsContent value="keys">
          <ApiKeysManager />
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>Perfect for testing and small projects</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-4xl font-bold">₹0<span className="text-lg font-normal text-muted-foreground">/month</span></div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    100 requests/hour
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    All calculators
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    Standard support
                  </li>
                </ul>
                <Button className="w-full" variant="outline">Current Plan</Button>
              </CardContent>
            </Card>

            <Card className="border-primary">
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription>For production applications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-4xl font-bold">₹999<span className="text-lg font-normal text-muted-foreground">/month</span></div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    1,000 requests/hour
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    All calculators
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    Priority support
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    Usage analytics
                  </li>
                </ul>
                <Button className="w-full">Upgrade to Pro</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>For large-scale applications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-4xl font-bold">Custom</div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    10,000+ requests/hour
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    All calculators
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    24/7 dedicated support
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    Custom SLA
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    On-premise deployment
                  </li>
                </ul>
                <Button className="w-full" variant="outline">Contact Sales</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
