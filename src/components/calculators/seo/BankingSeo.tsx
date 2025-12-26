import React from 'react'
import { HelpCircle } from 'lucide-react'
import { FaqItem } from '@/components/ui/faq-item'

export const FDSeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>Fixed Deposit (FD) Investment</h2>
    <p>
      A Fixed Deposit is a financial instrument provided by banks or NBFCs which provides investors a higher rate of interest than a regular savings account, until the given maturity date.
      It is considered one of the safest investment options.
    </p>
    <h3>Benefits of FD</h3>
    <ul>
      <li><strong>Guaranteed Returns:</strong> Interest rates are fixed at the time of opening the account.</li>
      <li><strong>Flexible Tenure:</strong> Choose a tenure ranging from 7 days to 10 years.</li>
      <li><strong>Liquidity:</strong> Loans can be availed against FD in case of emergencies.</li>
    </ul>
    <p>
      Use this calculator to estimate the maturity amount and interest earned on your Fixed Deposit investment.
    </p>
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="What is the minimum amount to open an FD?"
          answer="Most banks require a minimum deposit of ₹1,000 to ₹10,000 to open a Fixed Deposit account. Some banks also offer special FDs for senior citizens with higher interest rates."
        />
        <FaqItem 
          question="Can I withdraw FD before maturity?"
          answer="Yes, you can prematurely withdraw your FD, but banks typically charge a penalty of 0.5-1% on the interest rate. Some banks also have restrictions on minimum tenure before premature withdrawal is allowed."
        />
        <FaqItem 
          question="Is FD interest taxable?"
          answer="Yes, FD interest is fully taxable as per your income tax slab. Banks deduct TDS at 10% if interest exceeds ₹40,000 per year (₹50,000 for senior citizens). Submit Form 15G/15H if your total income is below taxable limit to avoid TDS."
        />
      </div>
    </section>
  </div>
)

export const RDSeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>Recurring Deposit (RD) Savings</h2>
    <p>
      Recurring Deposit is a special kind of term deposit offered by banks which helps people with regular incomes to deposit a fixed amount every month into their Recurring Deposit account and earn interest at the rate applicable to Fixed Deposits.
    </p>
    <h3>Why Choose RD?</h3>
    <ul>
      <li><strong>Disciplined Savings:</strong> Encourages a habit of saving a fixed amount monthly.</li>
      <li><strong>Small Investments:</strong> Start with a small amount and build a corpus over time.</li>
      <li><strong>Interest Rates:</strong> Similar to FD rates, offering better returns than savings accounts.</li>
    </ul>
    <p>
      This calculator helps you plan your monthly savings to achieve a specific financial goal.
    </p>
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="What happens if I miss an RD installment?"
          answer="If you miss an RD installment, banks typically charge a penalty (₹5-₹50 per missed installment). Multiple missed installments can lead to account closure. It's best to maintain sufficient balance for auto-debit."
        />
        <FaqItem 
          question="Can I increase my RD amount mid-way?"
          answer="No, you cannot increase the monthly deposit amount in an existing RD account. However, you can open a new RD account with a higher amount. Some banks offer flexible RD schemes where you can deposit varying amounts."
        />
        <FaqItem 
          question="Is RD better than saving in a regular savings account?"
          answer="Yes, RDs offer 1-2% higher interest rates than savings accounts (typically 5-7% vs 3-4%). RDs also enforce financial discipline through monthly commitments, helping you save consistently for specific goals."
        />
      </div>
    </section>
  </div>
)

export const PPFSeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>Public Provident Fund (PPF)</h2>
    <p>
      PPF is a long-term investment scheme backed by the Government of India. It offers an attractive interest rate and returns that are fully exempted from tax.
      It is a popular choice for retirement planning and tax saving.
    </p>
    <h3>Key Features of PPF</h3>
    <ul>
      <li><strong>Tax Benefits:</strong> Contributions, interest earned, and maturity amount are all tax-free (EEE status).</li>
      <li><strong>Long Tenure:</strong> The account has a lock-in period of 15 years.</li>
      <li><strong>Safety:</strong> Being government-backed, it offers the highest level of safety.</li>
    </ul>
    <p>
      Use this calculator to project the growth of your PPF account over its 15-year tenure.
    </p>
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="What is the minimum and maximum PPF contribution?"
          answer="Minimum: ₹500 per year (or account becomes inactive). Maximum: ₹1.5 lakh per financial year. You can deposit in lump sum or installments (max 12 deposits/year)."
        />
        <FaqItem 
          question="Can I withdraw money from PPF before 15 years?"
          answer="Partial withdrawals are allowed from the 7th year onwards (up to 50% of balance at end of 4th year). Premature closure is allowed after 5 years only for specific reasons like medical emergency or higher education, but with reduced interest rate."
        />
        <FaqItem 
          question="What happens after PPF matures in 15 years?"
          answer="You have three options: (1) Close the account and withdraw full amount, (2) Extend for 5-year blocks without deposits (continue earning interest), (3) Extend with deposits of up to ₹1.5 lakh/year. Most people extend to maximize tax-free returns."
        />
      </div>
    </section>
  </div>
)

export const SimpleInterestSeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>Simple Interest Calculation</h2>
    <p>
      Simple interest is a quick and easy method of calculating the interest charge on a loan. 
      Simple interest is determined by multiplying the daily interest rate by the principal by the number of days that elapse between payments.
    </p>
    <h3>Formula</h3>
    <p>
      $A = P(1 + rt)$ where:
    </p>
    <ul>
      <li><strong>A:</strong> Total Accrued Amount (principal + interest)</li>
      <li><strong>P:</strong> Principal Amount</li>
      <li><strong>r:</strong> Rate of Interest per year (in decimal)</li>
      <li><strong>t:</strong> Time Period involved in months or years</li>
    </ul>
    <p>
      This calculator is useful for short-term loans and basic investment calculations.
    </p>
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="What is the difference between simple and compound interest?"
          answer="Simple interest is calculated only on the principal amount. Compound interest is calculated on principal plus accumulated interest. For example, ₹10,000 at 10% for 2 years: Simple = ₹2,000 total interest, Compound = ₹2,100 total interest."
        />
        <FaqItem 
          question="When is simple interest used?"
          answer="Simple interest is commonly used for short-term loans (car loans, personal loans, payday loans), promissory notes, and some government bonds. It's easier to calculate and more transparent for borrowers."
        />
        <FaqItem 
          question="How do I calculate simple interest for months?"
          answer="Use time (t) as a fraction of a year. For 6 months: t = 6/12 = 0.5. For 90 days: t = 90/365 = 0.246. Formula remains the same: SI = P × R × T / 100."
        />
      </div>
    </section>
  </div>
)

export const CompoundInterestSeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>The Power of Compound Interest</h2>
    <p>
      Compound interest is the addition of interest to the principal sum of a loan or deposit, or in other words, "interest on interest". 
      It is the result of reinvesting interest, rather than paying it out, so that interest in the next period is then earned on the principal sum plus previously accumulated interest.
    </p>
    <h3>Why It Matters</h3>
    <ul>
      <li><strong>Wealth Creation:</strong> Over long periods, compounding can significantly increase the value of an investment.</li>
      <li><strong>Debt Growth:</strong> Conversely, it can make debts grow rapidly if interest is not paid off.</li>
    </ul>
    <p>
      This calculator demonstrates how small regular investments can grow into substantial sums over time due to compounding.
    </p>
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="What is compounding frequency?"
          answer="Compounding frequency refers to how often interest is calculated and added to the principal. Common frequencies: Daily, Monthly, Quarterly, Semi-Annually, Annually. More frequent compounding = higher returns. Daily compounding gives the best results."
        />
        <FaqItem 
          question="What is the Rule of 72 in compound interest?"
          answer="The Rule of 72 is a quick way to estimate how long it takes to double your money. Divide 72 by the interest rate. Example: At 8% interest, money doubles in 72/8 = 9 years. At 12%, it doubles in 72/12 = 6 years."
        />
        <FaqItem 
          question="How does compound interest create wealth?"
          answer="Compound interest creates exponential growth. Example: ₹1 lakh at 12% annually becomes ₹3.1 lakh in 10 years, ₹9.6 lakh in 20 years, and ₹29.9 lakh in 30 years. Starting early and staying invested is key to building substantial wealth."
        />
      </div>
    </section>
  </div>
)
