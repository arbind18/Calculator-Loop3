import React from 'react';
import { ChevronDown } from 'lucide-react';

export const PersonalLoanEMIContent = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Personal Loan EMI Calculator",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "description": "Calculate your Personal Loan EMI instantly. Check monthly installments, total interest, and amortization schedule with our free online tool."
  };

  return (
    <div className="space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">Comprehensive Guide to Personal Loan EMI</h2>
        <p className="text-base md:text-lg leading-relaxed mb-6">
          A Personal Loan is an unsecured loan that individuals can avail from financial institutions like banks, credit unions, or online lenders to meet various personal financial needs. Unlike home or car loans, personal loans are not backed by collateral, making them a popular choice for debt consolidation, medical emergencies, weddings, travel, or home renovations.
        </p>
        <p className="text-base md:text-lg leading-relaxed">
          The <strong>Equated Monthly Installment (EMI)</strong> is the fixed amount you pay every month to repay your personal loan. It consists of two components: the principal amount and the interest on the outstanding balance. Understanding how your EMI is calculated helps you plan your budget effectively and choose a loan tenure that suits your financial capacity.
        </p>
      </section>

      <section>
        <h3 className="text-xl md:text-2xl font-bold mb-4 text-foreground">How is Personal Loan EMI Calculated?</h3>
        <p className="mb-4 text-base md:text-lg">
          The formula used to calculate Personal Loan EMI is standard across the industry:
        </p>
        <div className="bg-secondary/20 p-6 rounded-xl border border-border mb-6 font-mono text-center text-base md:text-lg overflow-x-auto whitespace-nowrap">
          E = P × r × (1 + r)ⁿ / ((1 + r)ⁿ - 1)
        </div>
        <ul className="list-disc pl-6 space-y-2 mb-6 text-base md:text-lg">
          <li><strong>E</strong> is the EMI amount.</li>
          <li><strong>P</strong> is the Principal Loan Amount.</li>
          <li><strong>r</strong> is the monthly interest rate (Annual Rate / 12 / 100).</li>
          <li><strong>n</strong> is the loan tenure in months.</li>
        </ul>
        <p className="text-base md:text-lg">
          For example, if you borrow ₹5,00,000 at an interest rate of 12% p.a. for 3 years (36 months), your EMI will be calculated using this formula to ensure the loan is fully paid off by the end of the tenure.
        </p>
      </section>

      <section>
        <h3 className="text-xl md:text-2xl font-bold mb-4 text-foreground">Factors Affecting Your Personal Loan EMI</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <h4 className="font-bold text-lg mb-2 text-primary">1. Loan Amount</h4>
            <p className="text-sm md:text-base text-muted-foreground">The higher the principal amount, the higher your EMI will be. It's crucial to borrow only what you need to keep your monthly obligations manageable.</p>
          </div>
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <h4 className="font-bold text-lg mb-2 text-primary">2. Interest Rate</h4>
            <p className="text-sm md:text-base text-muted-foreground">Interest rates vary based on your credit score, income, and relationship with the bank. A lower rate significantly reduces your EMI and total interest payout.</p>
          </div>
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <h4 className="font-bold text-lg mb-2 text-primary">3. Loan Tenure</h4>
            <p className="text-sm md:text-base text-muted-foreground">Longer tenure reduces your monthly EMI but increases the total interest paid over the life of the loan. Shorter tenure increases EMI but saves on interest cost.</p>
          </div>
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
            <h4 className="font-bold text-lg mb-2 text-primary">4. Credit Score</h4>
            <p className="text-sm md:text-base text-muted-foreground">A high CIBIL or credit score (750+) gives you negotiating power for better interest rates, directly impacting your EMI burden.</p>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl md:text-2xl font-bold mb-4 text-foreground">Benefits of Using a Personal Loan EMI Calculator</h3>
        <ul className="space-y-4 text-base md:text-lg">
          <li className="flex gap-3">
            <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 p-1 rounded-full h-fit flex-shrink-0">✓</span>
            <div>
              <strong>Instant & Accurate Results:</strong> Manual calculations are prone to errors. Our calculator provides 100% accurate results instantly.
            </div>
          </li>
          <li className="flex gap-3">
            <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 p-1 rounded-full h-fit flex-shrink-0">✓</span>
            <div>
              <strong>Financial Planning:</strong> By knowing your EMI in advance, you can adjust your monthly budget and ensure you don't default on payments.
            </div>
          </li>
          <li className="flex gap-3">
            <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 p-1 rounded-full h-fit flex-shrink-0">✓</span>
            <div>
              <strong>Compare Scenarios:</strong> You can try different combinations of loan amounts and tenures to find the EMI that fits your pocket perfectly.
            </div>
          </li>
          <li className="flex gap-3">
            <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 p-1 rounded-full h-fit flex-shrink-0">✓</span>
            <div>
              <strong>Amortization Schedule:</strong> Get a detailed year-wise and month-wise breakup of your payments to see how much goes towards principal vs interest.
            </div>
          </li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl md:text-2xl font-bold mb-4 text-foreground">Tips to Reduce Your Personal Loan EMI</h3>
        <p className="mb-4 text-base md:text-lg">
          While personal loans are convenient, high EMIs can strain your finances. Here are some expert tips to keep your EMI low:
        </p>
        <ol className="list-decimal pl-6 space-y-3 text-base md:text-lg">
          <li><strong>Improve Your Credit Score:</strong> Maintain a score above 750 to qualify for the lowest interest rates in the market.</li>
          <li><strong>Choose a Longer Tenure:</strong> If the EMI is too high, extending the tenure will lower the monthly amount (though total interest increases).</li>
          <li><strong>Prepay When Possible:</strong> Use bonuses or surplus funds to make part-payments. This reduces the principal and subsequently the EMI or tenure.</li>
          <li><strong>Shop Around:</strong> Don't settle for the first offer. Compare rates from multiple banks and NBFCs to find the best deal.</li>
          <li><strong>Balance Transfer:</strong> If you have an existing high-interest loan, consider transferring it to another lender offering a lower rate.</li>
        </ol>
      </section>

      <section className="bg-muted/30 p-8 rounded-2xl">
        <h3 className="text-xl md:text-2xl font-bold mb-6 text-foreground">Frequently Asked Questions (FAQ)</h3>
        <div className="space-y-4">
          <details className="group bg-card p-4 rounded-xl border border-border shadow-sm [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-foreground list-none">
              <h4 className="font-bold text-base md:text-lg">1. Can I prepay my personal loan?</h4>
              <ChevronDown className="h-5 w-5 transition duration-300 group-open:-rotate-180 text-muted-foreground flex-shrink-0" />
            </summary>
            <p className="mt-4 leading-relaxed text-muted-foreground text-base md:text-lg">
              Yes, most lenders allow prepayment after a lock-in period (usually 6-12 months). However, prepayment charges of 2-5% may apply.
            </p>
          </details>

          <details className="group bg-card p-4 rounded-xl border border-border shadow-sm [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-foreground list-none">
              <h4 className="font-bold text-base md:text-lg">2. Does checking my eligibility affect my credit score?</h4>
              <ChevronDown className="h-5 w-5 transition duration-300 group-open:-rotate-180 text-muted-foreground flex-shrink-0" />
            </summary>
            <p className="mt-4 leading-relaxed text-muted-foreground text-base md:text-lg">
              Using a calculator or checking eligibility via soft inquiry does not affect your score. However, formally applying with multiple banks (hard inquiry) can lower it.
            </p>
          </details>

          <details className="group bg-card p-4 rounded-xl border border-border shadow-sm [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-foreground list-none">
              <h4 className="font-bold text-base md:text-lg">3. What is the ideal tenure for a personal loan?</h4>
              <ChevronDown className="h-5 w-5 transition duration-300 group-open:-rotate-180 text-muted-foreground flex-shrink-0" />
            </summary>
            <p className="mt-4 leading-relaxed text-muted-foreground text-base md:text-lg">
              The ideal tenure depends on your repayment capacity. A shorter tenure saves interest, while a longer tenure ensures a comfortable monthly EMI.
            </p>
          </details>

          <details className="group bg-card p-4 rounded-xl border border-border shadow-sm [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-foreground list-none">
              <h4 className="font-bold text-base md:text-lg">4. Is the interest rate fixed or floating?</h4>
              <ChevronDown className="h-5 w-5 transition duration-300 group-open:-rotate-180 text-muted-foreground flex-shrink-0" />
            </summary>
            <p className="mt-4 leading-relaxed text-muted-foreground text-base md:text-lg">
              Personal loans usually have fixed interest rates, meaning your EMI remains constant throughout the tenure. Some lenders may offer floating rates linked to benchmarks.
            </p>
          </details>
        </div>
      </section>
    </div>
  );
};
