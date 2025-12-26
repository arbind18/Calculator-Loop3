import React from 'react'
import { HelpCircle } from 'lucide-react'
import { FaqItem } from '@/components/ui/faq-item'

export const ComprehensiveIncomeTaxSeo = () => (
  <div className="prose dark:prose-invert max-w-none mt-8 space-y-8">
    <section>
      <h2 className="text-2xl font-bold mb-4">Complete Guide to Income Tax Calculation in India</h2>
      <p className="text-lg leading-relaxed">
        Income tax is a direct tax levied by the Government of India on the income earned by individuals, Hindu Undivided Families (HUFs), 
        companies, firms, and other entities. Understanding how income tax is calculated is crucial for effective financial planning and 
        ensuring compliance with tax regulations. This comprehensive guide will walk you through every aspect of income tax calculation 
        with detailed examples and practical scenarios.
      </p>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Understanding Income Tax Basics</h3>
      <p>
        The Indian income tax system is progressive, meaning the tax rate increases as your income increases. For the financial year 2024-25, 
        taxpayers can choose between two tax regimes: the Old Tax Regime with deductions and the New Tax Regime with lower rates but fewer deductions.
      </p>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Old Tax Regime vs New Tax Regime - Detailed Comparison</h3>
      
      <div className="bg-secondary/20 p-6 rounded-lg mb-4">
        <h4 className="font-semibold text-lg mb-2">Old Tax Regime Slabs (FY 2024-25)</h4>
        <ul className="space-y-2">
          <li>• Up to ₹2.5 lakh: Nil</li>
          <li>• ₹2.5 lakh to ₹5 lakh: 5%</li>
          <li>• ₹5 lakh to ₹10 lakh: 20%</li>
          <li>• Above ₹10 lakh: 30%</li>
        </ul>
        <p className="mt-3 text-sm">
          <strong>Key Benefits:</strong> Deductions under Section 80C (₹1.5 lakh), 80D (₹25,000-₹100,000), HRA exemption, 
          Home Loan interest (₹2 lakh), and Standard Deduction (₹50,000).
        </p>
      </div>

      <div className="bg-secondary/20 p-6 rounded-lg">
        <h4 className="font-semibold text-lg mb-2">New Tax Regime Slabs (FY 2024-25)</h4>
        <ul className="space-y-2">
          <li>• Up to ₹3 lakh: Nil</li>
          <li>• ₹3 lakh to ₹6 lakh: 5%</li>
          <li>• ₹6 lakh to ₹9 lakh: 10%</li>
          <li>• ₹9 lakh to ₹12 lakh: 15%</li>
          <li>• ₹12 lakh to ₹15 lakh: 20%</li>
          <li>• Above ₹15 lakh: 30%</li>
        </ul>
        <p className="mt-3 text-sm">
          <strong>Key Benefits:</strong> Higher basic exemption limit, lower tax rates. Limited deductions: Only Standard Deduction (₹50,000) 
          and employer NPS contribution (80CCD(2)) allowed.
        </p>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Step-by-Step Income Tax Calculation with Examples</h3>
      
      <div className="border-l-4 border-primary pl-6 my-6">
        <h4 className="font-semibold text-lg mb-3">Example 1: Salaried Employee with Investments (Old Regime)</h4>
        <p className="mb-3"><strong>Profile:</strong> Rahul, 32 years old, working in Bangalore</p>
        <div className="space-y-2 text-sm">
          <p>• <strong>Gross Salary:</strong> ₹12,00,000 per annum</p>
          <p>• <strong>HRA Received:</strong> ₹3,60,000 (₹30,000/month)</p>
          <p>• <strong>Rent Paid:</strong> ₹4,20,000 (₹35,000/month)</p>
          <p>• <strong>Basic Salary:</strong> ₹6,00,000</p>
          <p>• <strong>Investments:</strong></p>
          <ul className="ml-6">
            <li>- PPF: ₹1,00,000</li>
            <li>- ELSS Mutual Funds: ₹50,000</li>
            <li>- Life Insurance Premium: ₹25,000</li>
            <li>- Health Insurance: ₹15,000</li>
          </ul>
        </div>

        <div className="mt-4 bg-primary/10 p-4 rounded">
          <p className="font-semibold mb-2">Calculation Steps:</p>
          <ol className="space-y-2 text-sm">
            <li><strong>Step 1: Calculate Gross Total Income</strong>
              <p>Gross Salary = ₹12,00,000</p>
            </li>
            <li><strong>Step 2: Calculate HRA Exemption</strong>
              <p>HRA exemption is minimum of:</p>
              <ul className="ml-4">
                <li>a) Actual HRA = ₹3,60,000</li>
                <li>b) 50% of Basic (Bangalore is metro) = ₹3,00,000</li>
                <li>c) Rent - 10% of Basic = ₹4,20,000 - ₹60,000 = ₹3,60,000</li>
              </ul>
              <p className="font-semibold">HRA Exemption = ₹3,00,000</p>
            </li>
            <li><strong>Step 3: Standard Deduction</strong>
              <p>Standard Deduction = ₹50,000</p>
            </li>
            <li><strong>Step 4: Calculate Taxable Income</strong>
              <p>Gross Income - HRA - Standard Deduction</p>
              <p>= ₹12,00,000 - ₹3,00,000 - ₹50,000 = ₹8,50,000</p>
            </li>
            <li><strong>Step 5: Apply Section 80C Deductions</strong>
              <p>Total 80C investments = ₹1,75,000 (limited to ₹1,50,000)</p>
              <p>Deduction claimed = ₹1,50,000</p>
            </li>
            <li><strong>Step 6: Apply Section 80D (Health Insurance)</strong>
              <p>Health Insurance Premium = ₹15,000</p>
            </li>
            <li><strong>Step 7: Calculate Final Taxable Income</strong>
              <p>₹8,50,000 - ₹1,50,000 - ₹15,000 = ₹6,85,000</p>
            </li>
            <li><strong>Step 8: Calculate Tax</strong>
              <ul className="ml-4">
                <li>• Up to ₹2.5 lakh: Nil = ₹0</li>
                <li>• ₹2.5L to ₹5L: 5% of ₹2.5L = ₹12,500</li>
                <li>• ₹5L to ₹6.85L: 20% of ₹1.85L = ₹37,000</li>
              </ul>
              <p className="font-semibold">Total Tax = ₹49,500</p>
            </li>
            <li><strong>Step 9: Apply Rebate u/s 87A</strong>
              <p>Not applicable (income &gt; ₹5 lakh)</p>
            </li>
            <li><strong>Step 10: Add Cess</strong>
              <p>4% Health & Education Cess = ₹1,980</p>
              <p className="font-bold text-primary">Final Tax Payable = ₹51,480</p>
            </li>
          </ol>
        </div>
      </div>

      <div className="border-l-4 border-secondary pl-6 my-6">
        <h4 className="font-semibold text-lg mb-3">Example 2: Same Person under New Tax Regime</h4>
        <div className="mt-4 bg-secondary/10 p-4 rounded">
          <p className="font-semibold mb-2">Calculation Steps:</p>
          <ol className="space-y-2 text-sm">
            <li><strong>Step 1: Gross Income</strong>
              <p>₹12,00,000 (no HRA exemption in new regime)</p>
            </li>
            <li><strong>Step 2: Standard Deduction</strong>
              <p>₹50,000 (allowed in new regime from FY 2023-24)</p>
            </li>
            <li><strong>Step 3: Taxable Income</strong>
              <p>₹12,00,000 - ₹50,000 = ₹11,50,000</p>
            </li>
            <li><strong>Step 4: Calculate Tax</strong>
              <ul className="ml-4">
                <li>• Up to ₹3 lakh: Nil = ₹0</li>
                <li>• ₹3L to ₹6L: 5% of ₹3L = ₹15,000</li>
                <li>• ₹6L to ₹9L: 10% of ₹3L = ₹30,000</li>
                <li>• ₹9L to ₹11.5L: 15% of ₹2.5L = ₹37,500</li>
              </ul>
              <p className="font-semibold">Total Tax = ₹82,500</p>
            </li>
            <li><strong>Step 5: Add Cess</strong>
              <p>4% Cess = ₹3,300</p>
              <p className="font-bold text-primary">Final Tax Payable = ₹85,800</p>
            </li>
          </ol>
          <div className="mt-4 p-3 bg-yellow-500/20 rounded">
            <p className="font-semibold">Comparison:</p>
            <p>• Old Regime Tax: ₹51,480</p>
            <p>• New Regime Tax: ₹85,800</p>
            <p className="text-green-600 font-bold">Savings with Old Regime: ₹34,320</p>
            <p className="mt-2 text-xs">
              <strong>Conclusion:</strong> For Rahul, the Old Regime is better because of significant deductions available 
              (HRA, 80C, 80D). New Regime is beneficial only when you have minimal investments and deductions.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">More Real-Life Examples</h3>
      
      <div className="space-y-6">
        <div className="bg-blue-500/10 p-5 rounded-lg">
          <h4 className="font-semibold mb-2">Example 3: Freelancer/Business Owner</h4>
          <p className="text-sm mb-2"><strong>Profile:</strong> Priya, Freelance Graphic Designer</p>
          <ul className="text-sm space-y-1">
            <li>• Gross Income: ₹8,00,000</li>
            <li>• Business Expenses: ₹1,50,000</li>
            <li>• Net Income: ₹6,50,000</li>
            <li>• Section 80C: ₹1,50,000</li>
            <li>• Health Insurance: ₹25,000</li>
          </ul>
          <p className="text-sm mt-3">
            <strong>Tax Calculation:</strong> Taxable Income = ₹6,50,000 - ₹1,50,000 - ₹25,000 - ₹50,000 = ₹4,25,000<br/>
            Tax = 5% of ₹1.75 lakh = ₹8,750 + Cess = <strong>₹9,100</strong>
          </p>
        </div>

        <div className="bg-green-500/10 p-5 rounded-lg">
          <h4 className="font-semibold mb-2">Example 4: Senior Citizen (Age 65)</h4>
          <p className="text-sm mb-2"><strong>Profile:</strong> Mr. Sharma, Retired</p>
          <ul className="text-sm space-y-1">
            <li>• Pension Income: ₹4,00,000</li>
            <li>• Bank Interest: ₹1,00,000</li>
            <li>• Total Income: ₹5,00,000</li>
            <li>• Standard Deduction: ₹50,000</li>
            <li>• Section 80D: ₹50,000 (higher limit for senior citizens)</li>
            <li>• Section 80TTB: ₹50,000 (interest income exemption)</li>
          </ul>
          <p className="text-sm mt-3">
            <strong>Tax Calculation:</strong> Taxable Income = ₹5,00,000 - ₹50,000 - ₹50,000 - ₹50,000 = ₹3,50,000<br/>
            Basic exemption for senior citizen = ₹3,00,000<br/>
            Taxable = ₹50,000, Tax = 5% = ₹2,500 + Cess = <strong>₹2,600</strong>
          </p>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Important Deductions and Their Limits</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="border border-border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Section 80C - ₹1.5 Lakh</h4>
          <ul className="text-sm space-y-1">
            <li>✓ Employee Provident Fund (EPF)</li>
            <li>✓ Public Provident Fund (PPF)</li>
            <li>✓ Life Insurance Premium</li>
            <li>✓ ELSS Mutual Funds</li>
            <li>✓ National Savings Certificate</li>
            <li>✓ Tuition Fees (2 children)</li>
            <li>✓ Principal Repayment of Home Loan</li>
            <li>✓ Sukanya Samriddhi Yojana</li>
          </ul>
        </div>

        <div className="border border-border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Section 80D - Health Insurance</h4>
          <ul className="text-sm space-y-1">
            <li>✓ Self & Family: ₹25,000</li>
            <li>✓ Self (Senior Citizen): ₹50,000</li>
            <li>✓ Parents: Additional ₹25,000</li>
            <li>✓ Parents (Senior): Additional ₹50,000</li>
            <li>✓ Maximum: ₹1,00,000</li>
            <li>✓ Preventive Health Checkup: ₹5,000</li>
          </ul>
        </div>

        <div className="border border-border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Section 24 - Home Loan Interest</h4>
          <ul className="text-sm space-y-1">
            <li>✓ Self-Occupied: Up to ₹2 lakh</li>
            <li>✓ Let-Out Property: Full amount</li>
            <li>✓ Pre-Construction Interest: 1/5th over 5 years</li>
            <li>✓ First-Time Buyers (80EEA): Additional ₹1.5 lakh</li>
          </ul>
        </div>

        <div className="border border-border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Other Key Deductions</h4>
          <ul className="text-sm space-y-1">
            <li>✓ 80CCD(1B): NPS - ₹50,000</li>
            <li>✓ 80E: Education Loan Interest</li>
            <li>✓ 80G: Donations</li>
            <li>✓ 80TTA/TTB: Interest Income</li>
            <li>✓ 80EEB: Electric Vehicle Loan</li>
          </ul>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Common Tax Planning Mistakes to Avoid</h3>
      <div className="space-y-3">
        <div className="flex gap-3">
          <span className="text-2xl">❌</span>
          <div>
            <p className="font-semibold">Last-Minute Tax Planning</p>
            <p className="text-sm">Start planning from April, not March. This gives you better investment choices.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="text-2xl">❌</span>
          <div>
            <p className="font-semibold">Not Comparing Tax Regimes</p>
            <p className="text-sm">Always calculate tax under both regimes before choosing.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="text-2xl">❌</span>
          <div>
            <p className="font-semibold">Ignoring HRA Benefits</p>
            <p className="text-sm">If you pay rent, claim HRA exemption even if you own property elsewhere.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="text-2xl">❌</span>
          <div>
            <p className="font-semibold">Missing Form 12BB Submission</p>
            <p className="text-sm">Submit investment proofs to employer to avoid excessive TDS.</p>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Tax Saving Tips for Different Income Groups</h3>
      
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-blue-500/20 to-transparent p-4 rounded-lg">
          <h4 className="font-semibold">Income: ₹3-5 Lakh (Entry Level)</h4>
          <ul className="text-sm mt-2 space-y-1">
            <li>• Choose New Tax Regime (₹3L exemption)</li>
            <li>• Start SIP in ELSS (₹500/month)</li>
            <li>• Take health insurance (₹15,000/year)</li>
            <li>• Expected Tax: ₹0-₹10,000</li>
          </ul>
        </div>

        <div className="bg-gradient-to-r from-green-500/20 to-transparent p-4 rounded-lg">
          <h4 className="font-semibold">Income: ₹5-10 Lakh (Mid Level)</h4>
          <ul className="text-sm mt-2 space-y-1">
            <li>• Compare both regimes carefully</li>
            <li>• Maximize 80C (PPF + ELSS + EPF)</li>
            <li>• Claim HRA if paying rent</li>
            <li>• Invest ₹50k in NPS (80CCD(1B))</li>
            <li>• Expected Tax: ₹20,000-₹80,000</li>
          </ul>
        </div>

        <div className="bg-gradient-to-r from-purple-500/20 to-transparent p-4 rounded-lg">
          <h4 className="font-semibold">Income: ₹10-20 Lakh (Senior Level)</h4>
          <ul className="text-sm mt-2 space-y-1">
            <li>• Old Regime usually better</li>
            <li>• Max out 80C + 80D + NPS</li>
            <li>• Consider home loan for tax benefits</li>
            <li>• Review investment portfolio regularly</li>
            <li>• Expected Tax: ₹80,000-₹3,00,000</li>
          </ul>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Frequently Made Tax Calculation Errors</h3>
      <ol className="space-y-3">
        <li>
          <strong>1. Not accounting for TDS already deducted</strong>
          <p className="text-sm">Your employer deducts TDS. Calculate net tax payable = Total Tax - TDS Deducted.</p>
        </li>
        <li>
          <strong>2. Forgetting Standard Deduction</strong>
          <p className="text-sm">₹50,000 standard deduction is automatic for salaried individuals in both regimes.</p>
        </li>
        <li>
          <strong>3. Wrong HRA calculation</strong>
          <p className="text-sm">HRA exemption is MINIMUM of three calculations, not maximum.</p>
        </li>
        <li>
          <strong>4. Exceeding 80C limit</strong>
          <p className="text-sm">80C has a combined limit of ₹1.5 lakh. Investments beyond this don't give tax benefit.</p>
        </li>
      </ol>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Important Deadlines</h3>
      <div className="bg-red-500/10 p-4 rounded-lg">
        <ul className="space-y-2 text-sm">
          <li><strong>31st July:</strong> File ITR for individuals (not requiring audit)</li>
          <li><strong>31st October:</strong> File ITR for businesses requiring audit</li>
          <li><strong>15th March:</strong> Last date for tax-saving investments (FY closing)</li>
          <li><strong>31st March:</strong> Financial Year ends</li>
          <li><strong>Quarterly:</strong> Advance tax payment dates (15 Jun, 15 Sep, 15 Dec, 15 Mar)</li>
        </ul>
      </div>
    </section>

    <section className="bg-primary/10 p-6 rounded-lg">
      <h3 className="text-xl font-semibold mb-3">Conclusion</h3>
      <p className="leading-relaxed">
        Income tax calculation may seem complex, but understanding the basics and planning throughout the year can significantly 
        reduce your tax liability. Use this calculator to estimate your taxes under both regimes and make informed decisions. 
        Remember, tax planning is not just about saving tax but also about building wealth through disciplined investments. 
        Start early, invest regularly, and review your tax strategy annually to optimize your finances.
      </p>
      <p className="mt-3 text-sm font-semibold">
        💡 Pro Tip: Consult a Chartered Accountant for personalized tax planning, especially if you have income from multiple sources, 
        capital gains, or business income.
      </p>
    </section>

    <section>
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions (FAQ)
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="Should I choose Old Tax Regime or New Tax Regime?"
          answer="It depends on your deductions. If you have significant deductions like 80C (₹1.5L), HRA, home loan interest (₹2L), choose Old Regime. If you have minimal deductions and income over ₹7.5L, New Regime might be better. Use our calculator to compare both and decide."
        />
        <FaqItem 
          question="What is the standard deduction for salaried employees?"
          answer="The standard deduction is ₹50,000 for salaried individuals and pensioners. It is automatically available in both Old and New Tax Regimes, reducing your taxable income."
        />
        <FaqItem 
          question="How much can I save under Section 80C?"
          answer="You can claim a maximum deduction of ₹1.5 lakh under Section 80C by investing in ELSS, PPF, EPF, LIC, NSC, tax-saver FDs, home loan principal, tuition fees, or Sukanya Samriddhi Yojana."
        />
        <FaqItem 
          question="Do I need to pay advance tax?"
          answer="Yes, if your total tax liability exceeds ₹10,000 in a financial year, you must pay advance tax in four installments: 15% by June 15, 45% by September 15, 75% by December 15, and 100% by March 15."
        />
        <FaqItem 
          question="What happens if I miss the ITR filing deadline?"
          answer="You can file a belated return by December 31st of the assessment year, but you'll face a penalty of ₹5,000 (₹1,000 if income is below ₹5 lakh) and cannot carry forward capital losses."
        />
        <FaqItem 
          question="How is HRA exemption calculated?"
          answer="HRA exemption is the MINIMUM of: (1) Actual HRA received, (2) 50% of salary for metro cities or 40% for non-metros, (3) Rent paid minus 10% of salary. The least amount is exempt from tax."
        />
      </div>
    </section>
  </div>
)

export default ComprehensiveIncomeTaxSeo
