import React from 'react'
import { HelpCircle } from 'lucide-react'
import { FaqItem } from '@/components/ui/faq-item'

export const ComprehensiveSIPSeo = () => (
  <div className="prose dark:prose-invert max-w-none mt-8 space-y-8">
    <section>
      <h2 className="text-2xl font-bold mb-4">Complete SIP Calculator Guide - Build Wealth Systematically with Real Examples</h2>
      <p className="text-lg leading-relaxed">
        Systematic Investment Plan (SIP) is the most powerful wealth creation tool for Indian investors. Instead of investing 
        a lump sum, SIP allows you to invest small amounts regularly - creating enormous wealth through the magic of compounding 
        and rupee cost averaging. This comprehensive guide shows you exactly how SIP works with detailed calculations and real-life examples.
      </p>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Understanding SIP - The Complete Formula</h3>
      <div className="bg-primary/10 p-6 rounded-lg">
        <p className="font-semibold mb-2">Future Value Formula:</p>
        <p className="font-mono text-lg">FV = P × [(1 + r)^n - 1] / r × (1 + r)</p>
        <ul className="mt-4 space-y-2 text-sm">
          <li><strong>FV</strong> = Future Value (maturity amount)</li>
          <li><strong>P</strong> = Monthly SIP amount</li>
          <li><strong>r</strong> = Monthly return rate (Annual return / 12 / 100)</li>
          <li><strong>n</strong> = Total number of months</li>
        </ul>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Real-Life Example 1: Young Professional Building First Crore</h3>
      <div className="border-l-4 border-primary pl-6">
        <p className="font-semibold mb-2">Profile: Rahul (Age 25, Software Engineer)</p>
        <ul className="space-y-1 text-sm">
          <li>• Monthly Salary: ₹80,000</li>
          <li>• SIP Amount: ₹10,000 per month</li>
          <li>• Expected Return: 12% per annum</li>
          <li>• Investment Period: 25 years (till age 50)</li>
          <li>• Goal: Build retirement corpus</li>
        </ul>

        <div className="mt-4 bg-secondary/20 p-4 rounded">
          <p className="font-semibold mb-2">SIP Calculation:</p>
          <ol className="space-y-2 text-sm">
            <li><strong>Step 1:</strong> Convert annual return to monthly
              <p>r = 12 / 12 / 100 = 0.01 (1% per month)</p>
            </li>
            <li><strong>Step 2:</strong> Calculate total months
              <p>n = 25 years × 12 = 300 months</p>
            </li>
            <li><strong>Step 3:</strong> Apply formula
              <p>FV = 10,000 × [(1.01)^300 - 1] / 0.01 × (1.01)</p>
              <p>FV = 10,000 × [19.788 - 1] / 0.01 × 1.01</p>
              <p>FV = 10,000 × 1,878.8 × 1.01</p>
              <p className="font-bold text-primary text-lg">FV = ₹1,89,76,000</p>
            </li>
          </ol>

          <div className="mt-4 p-3 bg-green-500/20 rounded">
            <p className="font-semibold">Investment vs Returns:</p>
            <ul className="text-sm space-y-1 mt-2">
              <li>• Total Invested: ₹10,000 × 300 months = ₹30,00,000</li>
              <li>• <strong className="text-green-600">Total Wealth Gained: ₹1,89,76,000</strong></li>
              <li>• <strong className="text-blue-600">Returns: ₹1,59,76,000 (533% growth!)</strong></li>
              <li>• Monthly investment: Just 12.5% of salary</li>
            </ul>
            <p className="text-xs mt-2 italic text-green-600">
              💡 Rahul becomes a crorepati by investing just ₹10,000/month consistently!
            </p>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Example 2: Power of Starting Early</h3>
      <p className="mb-4">Compare three friends with same goal but different start ages:</p>
      
      <div className="grid md:grid-cols-3 gap-4">
        <div className="border-2 border-green-500 rounded-lg p-4 bg-green-500/10">
          <h4 className="font-semibold text-lg mb-2">Early Starter: Amit (Age 25)</h4>
          <ul className="text-sm space-y-2">
            <li><strong>SIP:</strong> ₹5,000/month</li>
            <li><strong>Duration:</strong> 30 years (till 55)</li>
            <li><strong>Return:</strong> 12% p.a.</li>
            <li><strong>Total Invested:</strong> ₹18,00,000</li>
            <li className="text-lg font-bold text-green-600">Maturity: ₹1,76,49,568</li>
            <li className="text-green-600">✓ Smallest monthly amount</li>
            <li className="text-green-600">✓ Highest returns</li>
          </ul>
        </div>

        <div className="border border-border rounded-lg p-4 bg-yellow-500/10">
          <h4 className="font-semibold text-lg mb-2">Late Starter: Priya (Age 35)</h4>
          <ul className="text-sm space-y-2">
            <li><strong>SIP:</strong> ₹12,000/month</li>
            <li><strong>Duration:</strong> 20 years (till 55)</li>
            <li><strong>Return:</strong> 12% p.a.</li>
            <li><strong>Total Invested:</strong> ₹28,80,000</li>
            <li className="text-lg font-bold text-yellow-600">Maturity: ₹1,19,92,200</li>
            <li className="text-yellow-600">⚠ Higher monthly burden</li>
            <li className="text-red-500">✗ Lower final corpus</li>
          </ul>
        </div>

        <div className="border border-border rounded-lg p-4 bg-red-500/10">
          <h4 className="font-semibold text-lg mb-2">Very Late: Sunil (Age 45)</h4>
          <ul className="text-sm space-y-2">
            <li><strong>SIP:</strong> ₹35,000/month</li>
            <li><strong>Duration:</strong> 10 years (till 55)</li>
            <li><strong>Return:</strong> 12% p.a.</li>
            <li><strong>Total Invested:</strong> ₹42,00,000</li>
            <li className="text-lg font-bold text-red-600">Maturity: ₹80,52,600</li>
            <li className="text-red-500">✗ Very high monthly amount</li>
            <li className="text-red-500">✗ Lowest returns despite highest investment</li>
          </ul>
        </div>
      </div>

      <div className="mt-4 p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg">
        <p className="font-semibold">The Early Bird Advantage:</p>
        <p className="text-sm mt-2">
          Amit invested ₹18L and got ₹1.76 Cr. Sunil invested ₹42L (2.3× more) but got only ₹80L! 
          Starting 20 years early means <strong>2.2× more wealth with 57% less investment</strong>. 
          Time is the most powerful wealth multiplier. Start TODAY, not tomorrow!
        </p>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Example 3: SIP Step-Up Strategy - Increase Returns by 50%+</h3>
      <div className="border-l-4 border-blue-500 pl-6">
        <p className="mb-3">Anita (Age 30) starts with ₹10,000/month, increases 10% annually</p>
        
        <div className="space-y-4">
          <div className="bg-secondary/20 p-4 rounded">
            <h4 className="font-semibold">Scenario A: Fixed SIP (No Increase)</h4>
            <ul className="text-sm mt-2 space-y-1">
              <li>• Monthly SIP: ₹10,000 (constant for 20 years)</li>
              <li>• Total Invested: ₹24,00,000</li>
              <li>• Returns at 12%: ₹99,91,473</li>
              <li>• <strong>Maturity Amount: ₹99,91,473</strong></li>
            </ul>
          </div>

          <div className="bg-blue-500/20 p-4 rounded">
            <h4 className="font-semibold">Scenario B: Step-Up SIP (10% annual increase)</h4>
            <ul className="text-sm mt-2 space-y-1">
              <li>• Year 1: ₹10,000/month</li>
              <li>• Year 2: ₹11,000/month (10% increase)</li>
              <li>• Year 3: ₹12,100/month</li>
              <li>• ... and so on</li>
              <li>• Year 20: ₹60,449/month</li>
              <li>• Total Invested: ₹57,27,500</li>
              <li>• <strong className="text-blue-600 text-lg">Maturity Amount: ₹2,27,93,000</strong></li>
              <li>• <strong className="text-green-600">Extra Gain: ₹1,28,01,527 (128% more!)</strong></li>
            </ul>
            <p className="text-xs mt-2 italic">
              Note: As salary increases, increase SIP proportionally. Most people get 8-12% annual raises.
            </p>
          </div>

          <div className="bg-green-500/20 p-4 rounded">
            <h4 className="font-semibold">Why Step-Up Works Magic:</h4>
            <ul className="text-sm mt-2 space-y-1">
              <li>• Early years: Build habit with smaller amount</li>
              <li>• Mid years: Compound growth accelerates</li>
              <li>• Later years: Higher investments get less time but add significantly</li>
              <li>• Matches your income growth naturally</li>
              <li>• Inflation-adjusted investing</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Example 4: SIP for Different Life Goals</h3>
      
      <div className="space-y-4">
        <div className="border border-border rounded-lg p-4 bg-blue-500/5">
          <h4 className="font-semibold mb-2">🏠 Goal 1: House Down Payment in 5 Years</h4>
          <ul className="text-sm space-y-1">
            <li><strong>Target:</strong> ₹25 lakh down payment</li>
            <li><strong>Time:</strong> 5 years</li>
            <li><strong>Expected Return:</strong> 12% p.a.</li>
            <li><strong>Required SIP:</strong> ₹31,000/month</li>
            <li><strong>Investment:</strong> ₹18,60,000</li>
            <li><strong>Gains:</strong> ₹6,40,000</li>
            <li className="text-green-600 font-semibold">✓ Achievable goal</li>
          </ul>
        </div>

        <div className="border border-border rounded-lg p-4 bg-purple-500/5">
          <h4 className="font-semibold mb-2">🎓 Goal 2: Child's Education in 15 Years</h4>
          <ul className="text-sm space-y-1">
            <li><strong>Target:</strong> ₹50 lakh for engineering degree</li>
            <li><strong>Time:</strong> 15 years</li>
            <li><strong>Expected Return:</strong> 12% p.a.</li>
            <li><strong>Required SIP:</strong> ₹10,500/month</li>
            <li><strong>Investment:</strong> ₹18,90,000</li>
            <li><strong>Gains:</strong> ₹31,10,000</li>
            <li className="text-green-600 font-semibold">✓ Long-term goal perfectly suited for SIP</li>
          </ul>
        </div>

        <div className="border border-border rounded-lg p-4 bg-green-500/5">
          <h4 className="font-semibold mb-2">🏖️ Goal 3: Retirement Corpus at 60</h4>
          <ul className="text-sm space-y-1">
            <li><strong>Current Age:</strong> 30 years</li>
            <li><strong>Target:</strong> ₹5 crore retirement corpus</li>
            <li><strong>Time:</strong> 30 years</li>
            <li><strong>Expected Return:</strong> 12% p.a.</li>
            <li><strong>Required SIP:</strong> ₹14,000/month</li>
            <li><strong>Investment:</strong> ₹50,40,000</li>
            <li><strong>Gains:</strong> ₹4,49,60,000</li>
            <li className="text-green-600 font-semibold">✓ Just ₹14k/month creates ₹5 Cr!</li>
          </ul>
        </div>

        <div className="border border-border rounded-lg p-4 bg-yellow-500/5">
          <h4 className="font-semibold mb-2">🚗 Goal 4: Dream Car in 3 Years</h4>
          <ul className="text-sm space-y-1">
            <li><strong>Target:</strong> ₹12 lakh for car</li>
            <li><strong>Time:</strong> 3 years</li>
            <li><strong>Expected Return:</strong> 10% p.a. (lower risk, shorter duration)</li>
            <li><strong>Required SIP:</strong> ₹29,500/month</li>
            <li><strong>Investment:</strong> ₹10,62,000</li>
            <li><strong>Gains:</strong> ₹1,38,000</li>
            <li className="text-yellow-600">⚠ Short-term: Consider debt funds for stability</li>
          </ul>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">SIP Returns Across Different Market Scenarios</h3>
      <p className="mb-4">Same SIP: ₹10,000/month for 15 years with different return scenarios</p>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary">
            <tr>
              <th className="p-3 text-left">Scenario</th>
              <th className="p-3 text-left">Annual Return</th>
              <th className="p-3 text-left">Total Invested</th>
              <th className="p-3 text-left">Maturity Value</th>
              <th className="p-3 text-left">Gains</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b bg-red-500/10">
              <td className="p-3">Conservative (Debt)</td>
              <td className="p-3">7%</td>
              <td className="p-3">₹18,00,000</td>
              <td className="p-3">₹31,88,000</td>
              <td className="p-3">₹13,88,000</td>
            </tr>
            <tr className="border-b bg-yellow-500/10">
              <td className="p-3">Balanced (Hybrid)</td>
              <td className="p-3">10%</td>
              <td className="p-3">₹18,00,000</td>
              <td className="p-3">₹41,63,000</td>
              <td className="p-3">₹23,63,000</td>
            </tr>
            <tr className="border-b bg-green-500/10">
              <td className="p-3">Moderate (Large Cap)</td>
              <td className="p-3">12%</td>
              <td className="p-3">₹18,00,000</td>
              <td className="p-3">₹49,95,000</td>
              <td className="p-3">₹31,95,000</td>
            </tr>
            <tr className="border-b bg-blue-500/10">
              <td className="p-3">Aggressive (Mid/Small Cap)</td>
              <td className="p-3">15%</td>
              <td className="p-3">₹18,00,000</td>
              <td className="p-3">₹66,78,000</td>
              <td className="p-3 font-bold">₹48,78,000</td>
            </tr>
            <tr className="border-b bg-purple-500/10">
              <td className="p-3">Very Aggressive</td>
              <td className="p-3">18%</td>
              <td className="p-3">₹18,00,000</td>
              <td className="p-3">₹89,97,000</td>
              <td className="p-3 font-bold text-green-600">₹71,97,000</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-4 bg-yellow-500/10 rounded-lg">
        <p className="font-semibold">Risk vs Return Balance:</p>
        <p className="text-sm mt-2">
          Higher returns come with higher volatility. For long-term goals (15+ years), equity funds are best. 
          For short-term (3-5 years), prefer debt or balanced funds. Diversify across fund types for optimal results.
        </p>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Rupee Cost Averaging - SIP's Secret Weapon</h3>
      
      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 rounded-lg">
        <h4 className="font-semibold text-lg mb-3">Example: Market Volatility Works in Your Favor</h4>
        
        <div className="space-y-3">
          <p className="text-sm">Priya invests ₹10,000/month in a fund. See how rupee cost averaging helps:</p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-white/10">
                <tr>
                  <th className="p-2">Month</th>
                  <th className="p-2">Investment</th>
                  <th className="p-2">NAV (₹)</th>
                  <th className="p-2">Units Bought</th>
                  <th className="p-2">Total Units</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">Jan</td>
                  <td className="p-2">₹10,000</td>
                  <td className="p-2">₹100</td>
                  <td className="p-2">100.00</td>
                  <td className="p-2">100.00</td>
                </tr>
                <tr className="border-b bg-red-500/10">
                  <td className="p-2">Feb</td>
                  <td className="p-2">₹10,000</td>
                  <td className="p-2">₹80 (crash!)</td>
                  <td className="p-2">125.00</td>
                  <td className="p-2">225.00</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Mar</td>
                  <td className="p-2">₹10,000</td>
                  <td className="p-2">₹90</td>
                  <td className="p-2">111.11</td>
                  <td className="p-2">336.11</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Apr</td>
                  <td className="p-2">₹10,000</td>
                  <td className="p-2">₹95</td>
                  <td className="p-2">105.26</td>
                  <td className="p-2">441.37</td>
                </tr>
                <tr className="border-b bg-green-500/10">
                  <td className="p-2">May</td>
                  <td className="p-2">₹10,000</td>
                  <td className="p-2">₹110</td>
                  <td className="p-2">90.91</td>
                  <td className="p-2">532.28</td>
                </tr>
                <tr className="border-b bg-green-500/10">
                  <td className="p-2">Jun</td>
                  <td className="p-2">₹10,000</td>
                  <td className="p-2">₹120</td>
                  <td className="p-2">83.33</td>
                  <td className="p-2 font-bold">615.61</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-green-500/20 p-4 rounded mt-3">
            <p className="font-semibold">Final Result:</p>
            <ul className="text-sm space-y-1 mt-2">
              <li>• Total Invested: ₹60,000</li>
              <li>• Total Units: 615.61</li>
              <li>• Current NAV: ₹120</li>
              <li>• <strong>Current Value: 615.61 × 120 = ₹73,873</strong></li>
              <li>• <strong className="text-green-600">Profit: ₹13,873 (23% return in 6 months!)</strong></li>
              <li>• Average buy price: ₹97.47 (vs market high of ₹120)</li>
            </ul>
            <p className="text-xs mt-2 italic text-green-600">
              💡 Market crash in Feb actually helped! Priya bought 125 units cheap. This is rupee cost averaging magic.
            </p>
          </div>

          <div className="bg-yellow-500/20 p-4 rounded">
            <p className="font-semibold">Key Lesson:</p>
            <p className="text-sm mt-2">
              Don't fear market crashes when doing SIP. Lower prices = more units = higher returns when market recovers. 
              NEVER stop SIP during market falls. That's when you benefit most!
            </p>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Common SIP Mistakes to Avoid</h3>
      
      <div className="space-y-3">
        <div className="flex gap-3 p-3 bg-red-500/10 rounded">
          <span className="text-2xl">❌</span>
          <div>
            <p className="font-semibold">Stopping SIP During Market Fall</p>
            <p className="text-sm">This is the WORST mistake. Market falls are when you accumulate most units cheaply. 
            Continue SIP, or even better, increase it during crashes.</p>
          </div>
        </div>

        <div className="flex gap-3 p-3 bg-red-500/10 rounded">
          <span className="text-2xl">❌</span>
          <div>
            <p className="font-semibold">Choosing Based on Past Returns Only</p>
            <p className="text-sm">Last year's top performer may not repeat. Check 5-year, 10-year consistency. 
            Look at fund manager experience, expense ratio, and investment strategy.</p>
          </div>
        </div>

        <div className="flex gap-3 p-3 bg-red-500/10 rounded">
          <span className="text-2xl">❌</span>
          <div>
            <p className="font-semibold">Not Diversifying</p>
            <p className="text-sm">Don't put all SIPs in one fund. Spread across: Large cap (40%), Mid cap (30%), 
            Small cap (20%), Debt (10%) for balanced risk.</p>
          </div>
        </div>

        <div className="flex gap-3 p-3 bg-red-500/10 rounded">
          <span className="text-2xl">❌</span>
          <div>
            <p className="font-semibold">Expecting Linear Growth</p>
            <p className="text-sm">Markets don't grow steadily. Some years +40%, some -20%. Focus on long-term 
            (10+ years) average returns, not yearly volatility.</p>
          </div>
        </div>

        <div className="flex gap-3 p-3 bg-red-500/10 rounded">
          <span className="text-2xl">❌</span>
          <div>
            <p className="font-semibold">Redeeming Too Early</p>
            <p className="text-sm">SIP needs minimum 5 years to show real power. Redeeming in 1-2 years means missing 
            compounding magic. Have emergency fund separately.</p>
          </div>
        </div>

        <div className="flex gap-3 p-3 bg-red-500/10 rounded">
          <span className="text-2xl">❌</span>
          <div>
            <p className="font-semibold">Not Increasing SIP Amount</p>
            <p className="text-sm">Your salary increases 10-15% annually. If SIP stays same, you're actually reducing 
            your savings rate. Increase SIP by 10-15% every year (Step-Up SIP).</p>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Smart SIP Strategies - Maximize Your Returns</h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-green-500/10 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">✅ Best Practices</h4>
          <ul className="text-sm space-y-2">
            <li>• Start with ₹1,000 if needed, but START</li>
            <li>• Set SIP date 2-3 days after salary credit</li>
            <li>• Use Step-Up SIP (auto 10% annual increase)</li>
            <li>• Diversify: Large + Mid + Small cap</li>
            <li>• Review annually, don't check daily</li>
            <li>• Continue during market crashes</li>
            <li>• Target minimum 10-year horizon</li>
            <li>• Choose direct plans (lower expense ratio)</li>
          </ul>
        </div>

        <div className="bg-blue-500/10 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">💡 Pro Tips</h4>
          <ul className="text-sm space-y-2">
            <li>• Bonus/increment? Start new SIP with 50% of it</li>
            <li>• Use SIP for child's education from birth</li>
            <li>• Keep SIP auto-debit, avoid manual payment</li>
            <li>• Rebalance portfolio once a year</li>
            <li>• Tax benefit: ELSS has 3-year lock, 80C benefit</li>
            <li>• Compare funds on Value Research/Morningstar</li>
            <li>• Index funds for passive investing (low cost)</li>
            <li>• Don't time the market, time IN market matters</li>
          </ul>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Tax on SIP Returns - Know Before You Invest</h3>
      
      <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-6 rounded-lg">
        <h4 className="font-semibold text-lg mb-3">Taxation Rules (as of 2024)</h4>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white/10 p-4 rounded">
            <p className="font-semibold mb-2">Equity Mutual Funds</p>
            <ul className="text-sm space-y-2">
              <li><strong>Short Term (less than 1 year):</strong></li>
              <li>• Capital Gains: 15% tax</li>
              <li className="ml-4">Example: Gain ₹1L → Tax ₹15k</li>
              
              <li className="mt-2"><strong>Long Term (more than 1 year):</strong></li>
              <li>• Up to ₹1 lakh gain: NIL tax</li>
              <li>• Above ₹1 lakh: 10% tax (no indexation)</li>
              <li className="ml-4">Example: Gain ₹5L → Tax on ₹4L = ₹40k</li>
            </ul>
          </div>

          <div className="bg-white/10 p-4 rounded">
            <p className="font-semibold mb-2">Debt Mutual Funds</p>
            <ul className="text-sm space-y-2">
              <li><strong>Short Term (less than 3 years):</strong></li>
              <li>• Added to income, taxed at slab rate</li>
              <li className="ml-4">30% bracket → 30% + cess tax</li>
              
              <li className="mt-2"><strong>Long Term (more than 3 years):</strong></li>
              <li>• 20% tax with indexation benefit</li>
              <li>• Indexation reduces taxable gain significantly</li>
              <li className="ml-4">Effective tax often 10-12% only</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 p-4 bg-green-500/20 rounded">
          <p className="font-semibold">Tax Saving Example:</p>
          <p className="text-sm mt-2">
            Rajesh's SIP: ₹10,000/month for 10 years in equity fund. Invested ₹12L, value ₹25L, gain ₹13L.
            <br/>Tax: First ₹1L exempt, remaining ₹12L taxed at 10% = <strong>₹1.2 lakh tax</strong>.
            <br/>Net gain after tax: ₹11.8 lakh (98% of gains retained!)
          </p>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">SIP vs Other Investment Options</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary">
            <tr>
              <th className="p-3 text-left">Investment</th>
              <th className="p-3 text-left">Expected Return</th>
              <th className="p-3 text-left">Risk</th>
              <th className="p-3 text-left">Liquidity</th>
              <th className="p-3 text-left">Best For</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-3 font-semibold">Equity SIP</td>
              <td className="p-3 text-green-600">12-15%</td>
              <td className="p-3">High</td>
              <td className="p-3">High (exit anytime)</td>
              <td className="p-3">Long-term wealth (10+ years)</td>
            </tr>
            <tr className="border-b">
              <td className="p-3">PPF</td>
              <td className="p-3">7.1%</td>
              <td className="p-3">Zero</td>
              <td className="p-3">Low (15 year lock)</td>
              <td className="p-3">Safe, tax-free retirement</td>
            </tr>
            <tr className="border-b">
              <td className="p-3">Fixed Deposit</td>
              <td className="p-3">6-7%</td>
              <td className="p-3">Zero</td>
              <td className="p-3">Medium (penalty on early exit)</td>
              <td className="p-3">Short-term, capital preservation</td>
            </tr>
            <tr className="border-b">
              <td className="p-3">Debt SIP</td>
              <td className="p-3">7-9%</td>
              <td className="p-3">Low</td>
              <td className="p-3">High</td>
              <td className="p-3">Medium-term (3-5 years)</td>
            </tr>
            <tr className="border-b">
              <td className="p-3">Real Estate</td>
              <td className="p-3">8-10%</td>
              <td className="p-3">Medium</td>
              <td className="p-3">Very Low (months to sell)</td>
              <td className="p-3">Long-term, high investment</td>
            </tr>
            <tr className="border-b bg-green-500/10">
              <td className="p-3 font-semibold">Gold (SIP)</td>
              <td className="p-3">8-10%</td>
              <td className="p-3">Medium</td>
              <td className="p-3">High</td>
              <td className="p-3">Inflation hedge, diversification</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-sm mt-4 italic">
        💡 Best strategy: Diversify! 60% Equity SIP + 20% PPF/Debt + 10% Gold + 10% Emergency FD
      </p>
    </section>

    <section className="bg-gradient-to-r from-primary/20 to-secondary/20 p-6 rounded-lg">
      <h3 className="text-xl font-semibold mb-3">Your SIP Action Plan - Start Today!</h3>
      
      <div className="space-y-2 text-sm">
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span>Decide monthly SIP amount (start with 15-20% of income)</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span>Define goal (retirement, house, education) and timeline</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span>Research 3-5 funds (check 5-year returns, ratings, expense ratio)</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span>Choose diversified portfolio (large + mid cap mix)</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span>Select direct plans (lower expense ratio = higher returns)</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span>Complete KYC (PAN, Aadhaar, bank details)</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span>Set SIP date 2-3 days after salary credit</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span>Enable auto-debit mandate (never miss installment)</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span>Opt for Step-Up SIP (10% annual increase)</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span>Set calendar reminder for annual review (not daily checking!)</span>
        </label>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Conclusion - Your Wealth Journey Starts with One SIP</h3>
      <p className="leading-relaxed">
        SIP is not a get-rich-quick scheme. It's a disciplined approach to building serious wealth over time. 
        The examples above show that starting early, staying consistent, and letting compounding work its magic can turn 
        small monthly investments into crores. Don't wait for the "right time" or to "save more first". Start with whatever 
        you can - even ₹500 or ₹1,000 - and increase gradually. The journey of becoming a crorepati begins with a single SIP!
      </p>
      <div className="mt-4 p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg">
        <p className="font-semibold text-lg">Remember:</p>
        <ul className="mt-2 space-y-1 text-sm">
          <li>✓ Time IN the market beats timing the market</li>
          <li>✓ Consistency is more important than amount</li>
          <li>✓ Market crashes are SIP investor's best friend</li>
          <li>✓ The best time to start was yesterday, second best is TODAY</li>
        </ul>
      </div>
      <p className="mt-4 text-sm font-semibold bg-primary/10 p-4 rounded">
        💡 Pro Tip: Use this calculator to experiment with different scenarios. See how much corpus you need, 
        what monthly SIP can achieve, and plan your step-up strategy. Small changes in inputs can show dramatically 
        different outcomes - helping you make informed decisions for YOUR financial future!
      </p>
    </section>

    <section>
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions (FAQ)
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="What is the minimum amount to start a SIP?"
          answer="Most mutual funds allow SIPs starting from ₹500 per month. Some funds even allow ₹100 SIPs. However, we recommend starting with at least ₹1,000 to see meaningful wealth creation over time."
        />
        <FaqItem 
          question="Can I stop or pause my SIP anytime?"
          answer="Yes, SIPs are completely flexible. You can pause for up to 6 months or stop permanently without any penalty. However, it's recommended to continue during market downturns as you accumulate more units at lower prices (rupee cost averaging)."
        />
        <FaqItem 
          question="What is the ideal SIP duration?"
          answer="The longer, the better. For optimal results, maintain SIPs for at least 5-10 years. Equity mutual funds historically deliver 12-15% returns over 10+ year periods, making long-term SIPs extremely powerful for wealth creation."
        />
        <FaqItem 
          question="Should I increase my SIP amount over time?"
          answer="Absolutely! Use a Step-Up SIP that automatically increases your investment by 5-10% annually. As your income grows, increasing SIP contributions significantly boosts your final corpus. Even a 10% annual increase can double your maturity amount."
        />
        <FaqItem 
          question="What happens if the market crashes during my SIP?"
          answer="Market crashes are a blessing for SIP investors! When prices fall, your fixed monthly investment buys more units. This 'rupee cost averaging' reduces your average cost and increases returns when the market recovers. Never stop SIPs during downturns."
        />
        <FaqItem 
          question="Which is better: SIP or lump sum investment?"
          answer="For most investors, SIPs are better because they: (1) Reduce market timing risk, (2) Build disciplined investing habits, (3) Are affordable for regular earners, (4) Average out volatility. Lump sum works only if you have a large amount and market expertise."
        />
      </div>
    </section>
  </div>
)
