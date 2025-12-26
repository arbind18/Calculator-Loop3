import React from 'react'
import { HelpCircle } from 'lucide-react'
import { FaqItem } from '@/components/ui/faq-item'

export const RentalYieldSeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>Rental Yield Calculator - Real Estate Investment Analysis</h2>
    <p>
      Rental yield measures the annual return on your real estate investment through rent. 
      It's a key metric to evaluate if a property is worth buying for rental income.
    </p>
    <h3>Understanding Rental Yield</h3>
    <ul>
      <li><strong>Gross Yield:</strong> (Annual Rent / Property Value) × 100</li>
      <li><strong>Net Yield:</strong> Gross Yield minus maintenance, taxes, vacancy costs.</li>
      <li><strong>Good Yield:</strong> 3-5% in metros, 5-8% in tier-2 cities (India).</li>
    </ul>
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="What is a good rental yield in India?"
          answer="Metro cities (Mumbai, Delhi, Bangalore): 2-3.5% (low yield, high appreciation). Tier-2 cities (Pune, Ahmedabad, Jaipur): 4-6%. Tier-3 cities: 6-8%. Compare with FD rates (6-7%). If rental yield < FD rate, property is overpriced for rental income."
        />
        <FaqItem 
          question="How to increase rental yield?"
          answer="5 strategies: (1) Buy in high-demand localities (near offices, metros), (2) Furnish property (20-30% higher rent), (3) Minimize vacancy (maintain well, good tenants), (4) Reduce maintenance costs (durable materials), (5) Buy at right price (negotiate 10-15% below asking)."
        />
        <FaqItem 
          question="Rental yield vs capital appreciation - which is better?"
          answer="Rental Yield: Steady cash flow, good for retirement income. Capital Appreciation: Wealth creation, 10-15% annual growth in good markets. Best strategy: Buy in developing areas (high appreciation potential) + rent out immediately (rental income). Hold 10-15 years for maximum returns."
        />
      </div>
    </section>
  </div>
)

export const HomeAffordabilitySeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>Home Affordability Calculator - How Much House Can I Afford?</h2>
    <p>
      Before searching for your dream home, know how much you can actually afford. Banks approve loans based on 
      debt-to-income ratio (DTI), typically allowing 50-60% of your income towards EMIs.
    </p>
    <h3>Affordability Formula</h3>
    <p>Max Home Price = Down Payment + Loan Amount (based on 50% of income available for EMI)</p>
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="What is the 50% EMI rule?"
          answer="Banks allow max 50-60% of your monthly income for all EMIs (home + car + personal loans). Example: ₹1L salary, ₹20K existing EMIs = ₹30K available for home loan EMI. At 8.5% for 20 years, this qualifies for ₹40L loan. Add ₹10L down payment = ₹50L home affordable."
        />
        <FaqItem 
          question="How much down payment should I make?"
          answer="Banks finance 75-90% (you pay 10-25% down payment). Bigger down payment benefits: (1) Lower EMI (₹20L down vs ₹10L saves ₹5,000/month EMI), (2) Better interest rates, (3) Faster loan approval, (4) Lower total interest. Aim for 20-30% down payment if possible."
        />
        <FaqItem 
          question="Hidden costs of buying a home?"
          answer="Beyond property cost: (1) Stamp duty & registration: 5-7% of property value, (2) GST on under-construction: 5%, (3) Home loan processing: 0.5-1%, (4) Lawyer fees: ₹15-50K, (5) Brokerage: 1-2%, (6) Society transfer: ₹10-50K. Budget 10-12% extra for total cost."
        />
      </div>
    </section>
  </div>
)

export const StampDutySeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>Stamp Duty Calculator India - Property Registration Charges</h2>
    <p>
      Stamp duty is a state tax on property transactions. It varies by state (3-7% of property value in most states). 
      Women buyers often get 1-2% discount. This is a major upfront cost when buying property.
    </p>
    <h3>Stamp Duty Rates by State</h3>
    <ul>
      <li><strong>Maharashtra:</strong> 5% (men), 4% (women) + 1% registration</li>
      <li><strong>Karnataka:</strong> 3-5% based on location + 1% registration</li>
      <li><strong>Delhi:</strong> 6% (men), 4% (women) + 1% registration</li>
    </ul>
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="Can I save stamp duty by showing lower property value?"
          answer="NO! Don't undervalue property. Authorities use Circle Rate/Guideline Value (government's minimum property value per area). Even if you agree ₹80L but circle rate is ₹1Cr, stamp duty charged on ₹1Cr. Plus penalty for underreporting + potential legal issues. Always use actual/circle rate, whichever is higher."
        />
        <FaqItem 
          question="How to reduce stamp duty legally?"
          answer="4 ways: (1) Buy in woman's name (1-2% discount in many states), (2) Joint ownership with wife/daughter, (3) Check state schemes (first-time buyers, affordable housing get rebates), (4) Time purchase during discount periods (some states offer seasonal discounts)."
        />
        <FaqItem 
          question="When and how to pay stamp duty?"
          answer="Pay within 30 days of sale agreement signing. Methods: (1) Online payment via state portal (e-stamping) - fastest, (2) Physical stamp paper from authorized vendors, (3) Bank draft. Get property registered within 30 days to avoid 10% penalty + interest. Keep payment receipts forever!"
        />
      </div>
    </section>
  </div>
)
