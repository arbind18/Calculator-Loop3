import React from 'react'
import { HelpCircle } from 'lucide-react'
import { FaqItem } from '@/components/ui/faq-item'

export const ComprehensiveHomeLoanSeo = () => (
  <div className="prose dark:prose-invert max-w-none mt-8 space-y-8">
    <section>
      <h2 className="text-2xl font-bold mb-4">Complete Home Loan EMI Calculator Guide - Examples & Strategies</h2>
      <p className="text-lg leading-relaxed">
        Buying a home is one of the biggest financial decisions of your life. A home loan helps you purchase your dream property 
        without depleting your savings. This comprehensive guide will help you understand home loan EMI calculation, compare different 
        loan scenarios, and make informed decisions with real-life examples from India.
      </p>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Understanding Home Loan EMI - The Complete Formula</h3>
      <div className="bg-primary/10 p-6 rounded-lg">
        <p className="font-semibold mb-2">EMI Formula:</p>
        <p className="font-mono text-lg">EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]</p>
        <ul className="mt-4 space-y-2 text-sm">
          <li><strong>P</strong> = Principal loan amount</li>
          <li><strong>R</strong> = Monthly interest rate (Annual Rate / 12 / 100)</li>
          <li><strong>N</strong> = Loan tenure in months</li>
        </ul>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Real-Life Example 1: First-Time Home Buyer in Mumbai</h3>
      <div className="border-l-4 border-primary pl-6">
        <p className="font-semibold mb-2">Profile: Amit & Priya (Age 28 & 26)</p>
        <ul className="space-y-1 text-sm">
          <li>• Property Cost: ₹75 lakh (2BHK in Thane)</li>
          <li>• Down Payment: ₹15 lakh (20%)</li>
          <li>• Loan Amount: ₹60 lakh</li>
          <li>• Interest Rate: 8.5% per annum</li>
          <li>• Tenure: 20 years (240 months)</li>
          <li>• Combined Monthly Income: ₹1,20,000</li>
        </ul>

        <div className="mt-4 bg-secondary/20 p-4 rounded">
          <p className="font-semibold mb-2">EMI Calculation:</p>
          <ol className="space-y-2 text-sm">
            <li><strong>Step 1:</strong> Convert annual rate to monthly
              <p>R = 8.5 / 12 / 100 = 0.00708</p>
            </li>
            <li><strong>Step 2:</strong> Calculate (1+R)^N
              <p>(1.00708)^240 = 5.871</p>
            </li>
            <li><strong>Step 3:</strong> Apply formula
              <p>EMI = [60,00,000 × 0.00708 × 5.871] / (5.871 - 1)</p>
              <p>EMI = 2,49,684 / 4.871</p>
              <p className="font-bold text-primary">EMI = ₹51,246 per month</p>
            </li>
          </ol>

          <div className="mt-4 p-3 bg-yellow-500/10 rounded">
            <p className="font-semibold">Total Payment Breakdown:</p>
            <ul className="text-sm space-y-1 mt-2">
              <li>• Total EMI paid over 20 years: ₹51,246 × 240 = ₹1,22,99,040</li>
              <li>• Principal: ₹60,00,000</li>
              <li>• <strong className="text-red-500">Total Interest: ₹62,99,040</strong></li>
              <li>• EMI to Income Ratio: 43% (manageable for dual income)</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Example 2: Impact of Tenure on EMI & Interest</h3>
      <p className="mb-4">Same loan (₹60L at 8.5%) with different tenures:</p>
      
      <div className="grid md:grid-cols-3 gap-4">
        <div className="border border-border rounded-lg p-4 bg-blue-500/10">
          <h4 className="font-semibold text-lg mb-2">10 Years (120 months)</h4>
          <ul className="text-sm space-y-2">
            <li><strong>EMI:</strong> ₹74,331</li>
            <li><strong>Total Payment:</strong> ₹89,19,720</li>
            <li><strong>Interest:</strong> ₹29,19,720</li>
            <li className="text-green-600">✓ Lower total interest</li>
            <li className="text-red-500">✗ High monthly burden</li>
          </ul>
        </div>

        <div className="border-2 border-primary rounded-lg p-4 bg-primary/10">
          <h4 className="font-semibold text-lg mb-2">20 Years (240 months)</h4>
          <ul className="text-sm space-y-2">
            <li><strong>EMI:</strong> ₹51,246</li>
            <li><strong>Total Payment:</strong> ₹1,22,99,040</li>
            <li><strong>Interest:</strong> ₹62,99,040</li>
            <li className="text-green-600">✓ Balanced approach</li>
            <li className="text-green-600">✓ Comfortable EMI</li>
          </ul>
        </div>

        <div className="border border-border rounded-lg p-4 bg-red-500/10">
          <h4 className="font-semibold text-lg mb-2">30 Years (360 months)</h4>
          <ul className="text-sm space-y-2">
            <li><strong>EMI:</strong> ₹46,134</li>
            <li><strong>Total Payment:</strong> ₹1,66,08,240</li>
            <li><strong>Interest:</strong> ₹1,06,08,240</li>
            <li className="text-green-600">✓ Lowest EMI</li>
            <li className="text-red-500">✗ Highest total interest</li>
          </ul>
        </div>
      </div>

      <div className="mt-4 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg">
        <p className="font-semibold">Key Insight:</p>
        <p className="text-sm mt-2">
          Increasing tenure from 20 to 30 years reduces EMI by only ₹5,112 but increases total interest by ₹43 lakh! 
          Choose tenure based on your repayment capacity and long-term financial goals.
        </p>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Example 3: Power of Prepayment</h3>
      <div className="border-l-4 border-green-500 pl-6">
        <p className="mb-3">Continuing with Amit & Priya's loan (₹60L at 8.5% for 20 years, EMI ₹51,246)</p>
        
        <div className="space-y-4">
          <div className="bg-secondary/20 p-4 rounded">
            <h4 className="font-semibold">Scenario A: Regular Payment (No Prepayment)</h4>
            <ul className="text-sm mt-2 space-y-1">
              <li>• Tenure: 20 years</li>
              <li>• Total Interest: ₹62,99,040</li>
              <li>• Total Cost: ₹1,22,99,040</li>
            </ul>
          </div>

          <div className="bg-green-500/20 p-4 rounded">
            <h4 className="font-semibold">Scenario B: Yearly Prepayment of ₹1 Lakh</h4>
            <ul className="text-sm mt-2 space-y-1">
              <li>• They prepay ₹1 lakh from annual bonus</li>
              <li>• <strong>New Tenure: 13 years 8 months (saves 6.5 years!)</strong></li>
              <li>• Total Interest: ₹42,15,000</li>
              <li>• <strong className="text-green-600">Interest Saved: ₹20,84,040</strong></li>
            </ul>
            <p className="text-xs mt-2 italic">
              Note: For floating rate loans, no prepayment charges (RBI mandate since 2014)
            </p>
          </div>

          <div className="bg-blue-500/20 p-4 rounded">
            <h4 className="font-semibold">Scenario C: Increase EMI by ₹5,000 monthly</h4>
            <ul className="text-sm mt-2 space-y-1">
              <li>• New EMI: ₹56,246</li>
              <li>• <strong>New Tenure: 16 years 3 months</strong></li>
              <li>• Total Interest: ₹50,12,000</li>
              <li>• <strong className="text-blue-600">Interest Saved: ₹12,87,040</strong></li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Example 4: Impact of Interest Rate - Rate Shopping Matters!</h3>
      <p className="mb-4">Loan Amount: ₹60 lakh, Tenure: 20 years</p>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary">
            <tr>
              <th className="p-3 text-left">Bank</th>
              <th className="p-3 text-left">Interest Rate</th>
              <th className="p-3 text-left">EMI</th>
              <th className="p-3 text-left">Total Interest</th>
              <th className="p-3 text-left">Difference vs Best Rate</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b bg-green-500/10">
              <td className="p-3">Bank A (Best Rate)</td>
              <td className="p-3 font-semibold">8.0%</td>
              <td className="p-3">₹50,184</td>
              <td className="p-3">₹60,44,160</td>
              <td className="p-3 text-green-600">Baseline</td>
            </tr>
            <tr className="border-b">
              <td className="p-3">Bank B</td>
              <td className="p-3">8.5%</td>
              <td className="p-3">₹51,246</td>
              <td className="p-3">₹62,99,040</td>
              <td className="p-3 text-red-500">+₹2,54,880</td>
            </tr>
            <tr className="border-b">
              <td className="p-3">Bank C</td>
              <td className="p-3">9.0%</td>
              <td className="p-3">₹52,324</td>
              <td className="p-3">₹65,57,760</td>
              <td className="p-3 text-red-500">+₹5,13,600</td>
            </tr>
            <tr className="border-b bg-red-500/10">
              <td className="p-3">Bank D (Highest)</td>
              <td className="p-3">9.5%</td>
              <td className="p-3">₹53,418</td>
              <td className="p-3">₹68,20,320</td>
              <td className="p-3 text-red-500 font-bold">+₹7,76,160</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-4 bg-red-500/10 rounded-lg">
        <p className="font-semibold text-red-600">Warning:</p>
        <p className="text-sm mt-2">
          A difference of just 1.5% interest rate (8% vs 9.5%) costs you ₹7.76 lakh extra over 20 years! 
          Always compare rates from at least 4-5 banks. Use your credit score (750+) to negotiate better rates.
        </p>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Example 5: Real Estate in Different Cities</h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="border border-border rounded-lg p-4">
          <h4 className="font-semibold mb-2">🏙️ Metro City (Bangalore) - IT Professional</h4>
          <ul className="text-sm space-y-1">
            <li><strong>Property:</strong> 2BHK, ₹80 lakh</li>
            <li><strong>Down Payment:</strong> ₹20 lakh (25%)</li>
            <li><strong>Loan:</strong> ₹60 lakh at 8.5% for 20 years</li>
            <li><strong>EMI:</strong> ₹51,246</li>
            <li><strong>Monthly Salary:</strong> ₹1,50,000</li>
            <li><strong>EMI Ratio:</strong> 34% (Good)</li>
            <li className="text-green-600">✓ High appreciation potential</li>
            <li className="text-red-500">✗ High property prices</li>
          </ul>
        </div>

        <div className="border border-border rounded-lg p-4">
          <h4 className="font-semibold mb-2">🏘️ Tier-2 City (Pune) - Bank Manager</h4>
          <ul className="text-sm space-y-1">
            <li><strong>Property:</strong> 3BHK, ₹50 lakh</li>
            <li><strong>Down Payment:</strong> ₹10 lakh (20%)</li>
            <li><strong>Loan:</strong> ₹40 lakh at 8.5% for 20 years</li>
            <li><strong>EMI:</strong> ₹34,164</li>
            <li><strong>Monthly Salary:</strong> ₹90,000</li>
            <li><strong>EMI Ratio:</strong> 38% (Acceptable)</li>
            <li className="text-green-600">✓ Bigger home, lower cost</li>
            <li className="text-green-600">✓ Comfortable EMI</li>
          </ul>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Tax Benefits on Home Loans - Save Lakhs!</h3>
      
      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 rounded-lg">
        <h4 className="font-semibold text-lg mb-3">Complete Tax Benefit Breakdown</h4>
        
        <div className="space-y-4">
          <div className="bg-white/10 p-4 rounded">
            <p className="font-semibold">Section 80C - Principal Repayment</p>
            <ul className="text-sm mt-2 space-y-1">
              <li>• Maximum Deduction: ₹1,50,000 per year</li>
              <li>• Combined limit with other 80C investments</li>
              <li>• Example: Principal in 1st year EMI ≈ ₹18,000 (Amit's case)</li>
            </ul>
          </div>

          <div className="bg-white/10 p-4 rounded">
            <p className="font-semibold">Section 24(b) - Interest Payment</p>
            <ul className="text-sm mt-2 space-y-1">
              <li>• Maximum Deduction: ₹2,00,000 per year (self-occupied)</li>
              <li>• Full interest deductible for rented property</li>
              <li>• Example: Interest in 1st year ≈ ₹5,13,000 (limit applies: ₹2L)</li>
            </ul>
          </div>

          <div className="bg-white/10 p-4 rounded">
            <p className="font-semibold">Section 80EEA - First-Time Buyers (Additional)</p>
            <ul className="text-sm mt-2 space-y-1">
              <li>• Additional ₹1,50,000 interest deduction</li>
              <li>• Property value up to ₹45 lakh</li>
              <li>• Loan sanctioned between 01-Apr-2019 to 31-Mar-2022</li>
            </ul>
          </div>

          <div className="bg-green-500/20 p-4 rounded mt-4">
            <p className="font-semibold">Total Annual Tax Benefit Example:</p>
            <ul className="text-sm mt-2 space-y-1">
              <li>• 80C (Principal): ₹1,50,000</li>
              <li>• 24(b) (Interest): ₹2,00,000</li>
              <li>• Total Deduction: ₹3,50,000</li>
              <li>• <strong>Tax Saved (30% bracket): ₹1,05,000 per year</strong></li>
              <li>• Over 20 years: Potential savings of ₹15-20 lakh!</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Common Home Loan Mistakes to Avoid</h3>
      
      <div className="space-y-3">
        <div className="flex gap-3 p-3 bg-red-500/10 rounded">
          <span className="text-2xl">❌</span>
          <div>
            <p className="font-semibold">Ignoring Processing Fees & Other Charges</p>
            <p className="text-sm">Processing fees (0.5-1% of loan), stamp duty (5-7%), registration (1%), GST add up. 
            Budget extra 8-10% of property value.</p>
          </div>
        </div>

        <div className="flex gap-3 p-3 bg-red-500/10 rounded">
          <span className="text-2xl">❌</span>
          <div>
            <p className="font-semibold">Maximum Tenure = Better?</p>
            <p className="text-sm">Longer tenure means lower EMI but MUCH higher interest. Balance is key. 
            Opt for 15-20 years, not 30 years.</p>
          </div>
        </div>

        <div className="flex gap-3 p-3 bg-red-500/10 rounded">
          <span className="text-2xl">❌</span>
          <div>
            <p className="font-semibold">Not Reading Fine Print</p>
            <p className="text-sm">Check for prepayment penalties (should be zero for floating rate), 
            EMI bounce charges, and foreclosure terms.</p>
          </div>
        </div>

        <div className="flex gap-3 p-3 bg-red-500/10 rounded">
          <span className="text-2xl">❌</span>
          <div>
            <p className="font-semibold">Ignoring Credit Score</p>
            <p className="text-sm">750+ score gets you 0.5-1% lower interest rate. Clean your credit report 
            6 months before applying.</p>
          </div>
        </div>

        <div className="flex gap-3 p-3 bg-red-500/10 rounded">
          <span className="text-2xl">❌</span>
          <div>
            <p className="font-semibold">Stretching EMI to 50%+ of Income</p>
            <p className="text-sm">Keep EMI below 40% of monthly income. Leave room for emergencies, 
            lifestyle, and other investments.</p>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Smart Home Loan Strategies</h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-green-500/10 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">✅ Do This</h4>
          <ul className="text-sm space-y-2">
            <li>• Compare at least 5 banks</li>
            <li>• Negotiate rate using credit score</li>
            <li>• Choose floating rate (usually better)</li>
            <li>• Prepay annually from bonus</li>
            <li>• Claim full tax benefits</li>
            <li>• Keep 6-month EMI emergency fund</li>
            <li>• Consider joint loan for higher eligibility</li>
            <li>• Review insurance (term + home insurance)</li>
          </ul>
        </div>

        <div className="bg-red-500/10 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">❌ Avoid This</h4>
          <ul className="text-sm space-y-2">
            <li>• Don't apply to multiple banks simultaneously</li>
            <li>• Don't hide existing loans</li>
            <li>• Don't choose shortest tenure to save interest</li>
            <li>• Don't skip reading loan agreement</li>
            <li>• Don't forget about maintenance costs</li>
            <li>• Don't compromise on property verification</li>
            <li>• Don't take personal loan for down payment</li>
            <li>• Don't ignore future expenses (kids, education)</li>
          </ul>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Home Loan Eligibility - Quick Formula</h3>
      
      <div className="bg-primary/10 p-6 rounded-lg">
        <p className="font-semibold mb-3">Basic Eligibility Formula:</p>
        <p className="font-mono mb-4">Loan Amount = (Monthly Income × 60) - Existing EMIs</p>
        
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-semibold">Example:</p>
            <ul className="ml-4 space-y-1">
              <li>• Monthly Salary: ₹1,00,000</li>
              <li>• Existing Car Loan EMI: ₹15,000</li>
              <li>• Eligible Amount: (₹1,00,000 × 60) - (₹15,000 × 60)</li>
              <li>• <strong>Eligible Loan: ₹60,00,000 - ₹9,00,000 = ₹51,00,000</strong></li>
            </ul>
          </div>

          <div className="bg-yellow-500/20 p-3 rounded mt-3">
            <p className="font-semibold">Factors Affecting Eligibility:</p>
            <ul className="ml-4 mt-2 space-y-1">
              <li>• Age (25-60 years ideal, higher age = shorter tenure)</li>
              <li>• Credit Score (750+ gets best rates & eligibility)</li>
              <li>• Employment Type (salaried &gt; self-employed for banks)</li>
              <li>• Company Profile (MNC/Govt &gt; startup)</li>
              <li>• Existing Obligations (lower EMIs = higher eligibility)</li>
              <li>• Co-applicant Income (spouse income adds 50-100%)</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section className="bg-gradient-to-r from-primary/20 to-secondary/20 p-6 rounded-lg">
      <h3 className="text-xl font-semibold mb-3">Final Checklist Before Taking Home Loan</h3>
      
      <div className="space-y-2 text-sm">
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span>Credit score checked and above 750</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span>Compared at least 5 banks for interest rates</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span>EMI is less than 40% of monthly income</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span>6-month EMI emergency fund ready</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span>Property legal verification done</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span>Understood all charges (processing, stamp duty, registration)</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span>Read loan agreement completely</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span>Term insurance and home insurance planned</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span>Calculated tax benefits (Section 80C + 24(b))</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span>Planned for prepayment strategy</span>
        </label>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Conclusion</h3>
      <p className="leading-relaxed">
        A home loan is a 20-year commitment. Take time to understand EMI calculations, compare offers thoroughly, 
        and plan your finances carefully. Use this calculator to experiment with different scenarios - tenure, interest rates, 
        and prepayment options. Remember: A difference of even 0.5% in interest rate or 2-3 years in tenure can save you lakhs of rupees. 
        Start with a comfortable EMI, build an emergency fund, and prepay whenever possible. Your dream home is worth the planning!
      </p>
      <p className="mt-4 text-sm font-semibold bg-primary/10 p-4 rounded">
        💡 Pro Tip: After taking the loan, review your interest rate annually. If market rates drop by 0.75%+, consider refinancing 
        or requesting your bank for rate reduction. Many banks offer rate reductions to retain good customers.
      </p>
    </section>

    <section>
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions (FAQ)
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="How much home loan can I get on my salary?"
          answer="Most banks offer home loans up to 60 times your monthly salary. For example, if you earn ₹50,000/month, you can get up to ₹30 lakh loan. The exact amount depends on your credit score, existing EMIs, and other liabilities."
        />
        <FaqItem 
          question="What is the ideal down payment percentage?"
          answer="Banks finance up to 80-90% of the property value, so you need 10-20% down payment. A larger down payment (20-30%) reduces your loan amount, lowers EMI, and often gets you better interest rates."
        />
        <FaqItem 
          question="Should I take a floating or fixed interest rate?"
          answer="Floating rates are generally 1-2% lower than fixed rates and adjust with market conditions. Fixed rates remain constant for the initial 2-5 years. For long tenures (15-20 years), floating rates typically result in lower overall interest."
        />
        <FaqItem 
          question="Can I prepay my home loan without penalty?"
          answer="For floating rate loans, there's no prepayment penalty as per RBI guidelines. For fixed rate loans, banks may charge 2-5% penalty. Always check your loan agreement for specific prepayment terms."
        />
        <FaqItem 
          question="What are the tax benefits on home loans?"
          answer="You can claim: (1) Up to ₹1.5 lakh deduction on principal repayment under Section 80C, (2) Up to ₹2 lakh deduction on interest under Section 24(b), (3) Additional ₹1.5 lakh under 80EEA for first-time buyers. Total potential benefit: ₹5 lakh deduction."
        />
        <FaqItem 
          question="What is the minimum credit score required for a home loan?"
          answer="While 650+ is the minimum, a score of 750+ significantly improves approval chances and gets you better interest rates (0.5-1% lower). Scores above 800 may qualify for premium customer rates."
        />
      </div>
    </section>
  </div>
)
