import React from 'react'

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
