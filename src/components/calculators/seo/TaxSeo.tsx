import React from 'react'
import { HelpCircle } from 'lucide-react'
import { FaqItem } from '@/components/ui/faq-item'

export const IncomeTaxSeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>Income Tax Calculator</h2>
    <p>
      Income tax is a direct tax that a government levies on the income of its citizens and businesses. 
      In India, income tax is progressive, meaning higher income earners pay a higher percentage of tax.
    </p>
    <h3>Tax Regimes</h3>
    <ul>
      <li><strong>Old Regime:</strong> Offers various deductions and exemptions (e.g., 80C, HRA).</li>
      <li><strong>New Regime:</strong> Offers lower tax rates but fewer deductions.</li>
    </ul>
    <p>
      This calculator helps you estimate your tax liability under both regimes to choose the best option.
    </p>
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="Which tax regime should I choose?"
          answer="Old Regime: Better if you have deductions (80C, HRA, home loan). New Regime: Better if income > ₹7.5L with minimal deductions. Use our calculator to compare both. You can switch regimes annually if salaried."
        />
        <FaqItem 
          question="What are the income tax slabs for FY 2024-25?"
          answer="New Regime: 0-₹3L (0%), 3-6L (5%), 6-9L (10%), 9-12L (15%), 12-15L (20%), >15L (30%). Old Regime: 0-2.5L (0%), 2.5-5L (5%), 5-10L (20%), >10L (30%). Plus 4% cess on tax."
        />
        <FaqItem 
          question="What deductions are available under Section 80C?"
          answer="80C allows ₹1.5L deduction for: ELSS, PPF, EPF, Life Insurance, NSC, Tax-saver FD, Sukanya Samriddhi, Home loan principal, Tuition fees. Choose a mix based on liquidity needs and returns."
        />
      </div>
    </section>
  </div>
)

export const HRASeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>House Rent Allowance (HRA) Exemption</h2>
    <p>
      HRA is a component of salary provided by employers to employees for meeting their accommodation expenses. 
      A portion of HRA can be claimed as an exemption under Section 10(13A) of the Income Tax Act.
    </p>
    <h3>Calculation Logic</h3>
    <p>The exemption is the least of the following:</p>
    <ol>
      <li>Actual HRA received.</li>
      <li>50% of salary (for metro cities) or 40% (for non-metro cities).</li>
      <li>Rent paid minus 10% of salary.</li>
    </ol>
    <p>
      Use this calculator to determine the taxable and exempt portion of your HRA.
    </p>
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="Can I claim HRA if I live with parents?"
          answer="Yes, you can claim HRA by paying rent to parents and getting rent receipts. Parents must show this as rental income in their tax return. Not allowed if living in parents' own house without paying rent."
        />
        <FaqItem 
          question="Which cities are considered metro for HRA?"
          answer="Metro cities: Delhi, Mumbai, Kolkata, Chennai (50% of basic salary exemption). Non-metros: All other cities (40% exemption). Classification is based on where you live, not where the office is located."
        />
        <FaqItem 
          question="Do I need rent receipts for HRA exemption?"
          answer="Receipts required if annual rent > ₹1 lakh. Below ₹1L, self-declaration sufficient. For rent > ₹1L/month, provide landlord's PAN. Keep receipts for 6 years for potential IT scrutiny."
        />
      </div>
    </section>
  </div>
)

export const NPSSeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>National Pension System (NPS)</h2>
    <p>
      NPS is a voluntary, long-term retirement savings scheme designed to enable systematic savings. 
      It is regulated by the PFRDA.
    </p>
    <h3>Tax Benefits</h3>
    <ul>
      <li><strong>Section 80CCD(1):</strong> Deduction up to ₹1.5 lakh (within the overall 80C limit).</li>
      <li><strong>Section 80CCD(1B):</strong> Additional deduction up to ₹50,000.</li>
      <li><strong>Section 80CCD(2):</strong> Employer's contribution is deductible up to 10% of salary (14% for central govt employees).</li>
    </ul>
    <p>
      This calculator helps you estimate the pension and lump sum amount you can receive upon retirement.
    </p>
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="What is the maximum NPS tax benefit?"
          answer="Maximum: ₹2 lakh/year deduction. 80CCD(1): ₹1.5L (within 80C limit), 80CCD(1B): Additional ₹50,000, 80CCD(2): Employer contribution up to 10% of basic (over and above 80C). Total possible: ₹2L+."
        />
        <FaqItem 
          question="Can I withdraw NPS before retirement?"
          answer="Partial withdrawal: Allowed after 3 years for specific purposes (children education, marriage, medical emergency, house purchase) - max 25% of contributions, max 3 times. Full withdrawal before 60: Not allowed except in extreme cases."
        />
        <FaqItem 
          question="What happens to NPS at retirement?"
          answer="At 60: Mandatory to buy annuity with 40% of corpus (for monthly pension), 60% can be withdrawn lump sum (tax-free). Can defer till 70. Annuity provides lifelong pension - choose joint life or return of purchase price options."
        />
      </div>
    </section>
  </div>
)

export const CapitalGainsSeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>Capital Gains Tax</h2>
    <p>
      Capital gains tax is levied on the profit realized from the sale of a non-inventory asset. 
      The most common capital gains are realized from the sale of stocks, bonds, precious metals, and property.
    </p>
    <h3>Types of Capital Gains</h3>
    <ul>
      <li><strong>Short-Term Capital Gains (STCG):</strong> Gains from assets held for a short period (definition varies by asset).</li>
      <li><strong>Long-Term Capital Gains (LTCG):</strong> Gains from assets held for a longer period, often taxed at a lower rate.</li>
    </ul>
    <p>
      Use this calculator to estimate your tax liability on investment gains.
    </p>
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="What is the difference between STCG and LTCG?"
          answer="Holding period matters: Equity (STCG <1 year = 15%, LTCG >1 year = 10% above ₹1L), Debt (STCG <3 years = slab rate, LTCG >3 years = 20% with indexation). Property (STCG <2 years, LTCG >2 years)."
        />
        <FaqItem 
          question="How can I save tax on capital gains?"
          answer="Strategies: (1) Hold >1 year for equity (LTCG), (2) Use indexation for debt/property, (3) Invest LTCG in Sec 54/54F (property) or 54EC bonds, (4) Offset gains with losses (tax-loss harvesting), (5) Use ₹1L LTCG equity exemption annually."
        />
        <FaqItem 
          question="What is indexation benefit?"
          answer="Indexation adjusts purchase price for inflation (using Cost Inflation Index) before calculating gains. Example: Bought land in 2015 for ₹10L, sold in 2024 for ₹20L. With indexation, taxable gain reduces from ₹10L to ₹5L, saving significant tax."
        />
      </div>
    </section>
  </div>
)

export const SukanyaSamriddhiSeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>Sukanya Samriddhi Yojana (SSY)</h2>
    <p>
      SSY is a government-backed savings scheme launched as part of the "Beti Bachao, Beti Padhao" campaign. 
      It is designed to secure the future of the girl child.
    </p>
    <h3>Key Features</h3>
    <ul>
      <li><strong>High Interest Rate:</strong> Offers one of the highest interest rates among small savings schemes.</li>
      <li><strong>Tax Benefits:</strong> EEE status (Exempt-Exempt-Exempt) for contributions, interest, and maturity.</li>
      <li><strong>Eligibility:</strong> Can be opened for a girl child below 10 years of age.</li>
    </ul>
    <p>
      This calculator helps you project the maturity amount for your daughter's education or marriage.
    </p>
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="What is the SSY interest rate and deposit limit?"
          answer="Current interest: 8.2% per annum (revised quarterly). Minimum: ₹250/year, Maximum: ₹1.5 lakh/year. Account can be opened till girl child is 10 years old. Deposits for 15 years, matures at 21 years."
        />
        <FaqItem 
          question="Can I withdraw from SSY before maturity?"
          answer="Partial withdrawal: 50% allowed after girl turns 18 for education/marriage. Premature closure: Allowed in case of girl's death or extreme medical emergency. Otherwise, withdrawal only after 21 years (or marriage after 18)."
        />
        <FaqItem 
          question="What are SSY tax benefits?"
          answer="Triple tax benefit (EEE): (1) Contribution eligible for 80C deduction (up to ₹1.5L), (2) Interest earned is tax-free, (3) Maturity amount fully tax-free. One of the best tax-free investment options in India."
        />
      </div>
    </section>
  </div>
)

export const GratuitySeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>Gratuity Calculator</h2>
    <p>
      Gratuity is a monetary benefit given by an employer to an employee at the time of retirement, resignation, or layoff. 
      It is a token of appreciation for the employee's service.
    </p>
    <h3>Eligibility</h3>
    <p>
      Employees who have completed at least 5 years of continuous service are eligible for gratuity.
    </p>
    <h3>Formula</h3>
    <p>
      Gratuity = (15 * Last Drawn Salary * Tenure) / 26
    </p>
    <p>
      Use this calculator to estimate the gratuity amount you are entitled to receive.
    </p>
  </div>
)
