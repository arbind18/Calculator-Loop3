import React from 'react'
import { HelpCircle } from 'lucide-react'
import { FaqItem } from '@/components/ui/faq-item'

export const CurrencyConverterSeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>Global Currency Exchange</h2>
    <p>
      In our interconnected world, currency conversion is a daily necessity for travelers, businesses, and investors.
      Exchange rates fluctuate constantly based on economic indicators, geopolitical events, and market sentiment.
    </p>
    <h3>Factors Affecting Exchange Rates</h3>
    <ul>
      <li><strong>Interest Rates:</strong> Higher interest rates offer lenders in an economy a higher return relative to other countries.</li>
      <li><strong>Inflation:</strong> A country with a consistently lower inflation rate exhibits a rising currency value.</li>
      <li><strong>Political Stability:</strong> Foreign capital seeks countries with strong political and economic performance.</li>
    </ul>
    <p>
      This calculator provides real-time estimates for major world currencies, helping you make informed decisions 
      whether you are planning a trip or making an international purchase.
    </p>
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="How do I convert currency?"
          answer="Multiply amount by exchange rate. Example: Convert ₹1,000 to USD at rate 1 USD = ₹83. Result = 1,000/83 = $12.05. For reverse: $100 to INR = 100 × 83 = ₹8,300. Always check current rates as they fluctuate hourly."
        />
        <FaqItem 
          question="What is the best time to exchange currency?"
          answer="Monitor rates for a week before travel. Avoid airport exchanges (worst rates, 5-10% markup). Best: ATMs in destination country (1-3% fee), Credit cards (2-3% fee), Online forex (best rates). Exchange major currencies (USD, EUR) easier than exotic ones."
        />
        <FaqItem 
          question="What affects currency exchange rates?"
          answer="5 main factors: (1) Interest rates (higher = stronger currency), (2) Inflation (lower = stronger), (3) Economic growth (higher = stronger), (4) Political stability (more stable = stronger), (5) Trade balance (surplus = stronger). USD, EUR are most stable."
        />
        <FaqItem 
          question="Should I exchange all my money before travel?"
          answer="No! Exchange 20-30% before departure for initial expenses (taxi, food). Use ATMs abroad for rest (better rates). Keep emergency USD/EUR cash (₹10,000-20,000 equivalent). Notify your bank before international travel to avoid card blocks."
        />
      </div>
    </section>
  </div>
)
