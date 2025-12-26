import React from 'react'
import { HelpCircle } from 'lucide-react'
import { FaqItem } from '@/components/ui/faq-item'

export const ComprehensiveGSTSeo = () => (
  <div className="prose dark:prose-invert max-w-none mt-8 space-y-8">
    <section>
      <h2 className="text-2xl font-bold mb-4">Complete GST Calculator Guide - Master Goods & Services Tax with Examples</h2>
      <p className="text-lg leading-relaxed">
        GST (Goods and Services Tax) revolutionized India's tax system in 2017 by replacing multiple indirect taxes with 
        one unified tax. Whether you're a business owner, freelancer, or consumer, understanding GST calculation is crucial. 
        This comprehensive guide explains GST rates, calculations, and provides detailed real-world examples for Indian businesses.
      </p>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Understanding GST - The Complete Formula</h3>
      <div className="bg-primary/10 p-6 rounded-lg">
        <p className="font-semibold mb-4">GST Calculation Formulas:</p>
        
        <div className="space-y-4 text-sm">
          <div>
            <p className="font-semibold">1. Add GST to Base Price (Forward Calculation):</p>
            <p className="font-mono">Final Price = Base Price + (Base Price × GST Rate / 100)</p>
            <p className="font-mono">Or: Final Price = Base Price × (1 + GST Rate/100)</p>
            <p className="text-xs mt-1">Example: ₹1,000 + 18% GST = ₹1,000 × 1.18 = ₹1,180</p>
          </div>

          <div>
            <p className="font-semibold">2. Remove GST from Final Price (Reverse Calculation):</p>
            <p className="font-mono">Base Price = Final Price / (1 + GST Rate/100)</p>
            <p className="font-mono">GST Amount = Final Price - Base Price</p>
            <p className="text-xs mt-1">Example: ₹1,180 / 1.18 = ₹1,000 (Base), GST = ₹180</p>
          </div>

          <div className="bg-blue-500/10 p-3 rounded">
            <p className="font-semibold">For CGST + SGST (Intra-State):</p>
            <p className="text-xs">18% GST = 9% CGST + 9% SGST</p>
            <p className="text-xs">12% GST = 6% CGST + 6% SGST</p>
          </div>

          <div className="bg-purple-500/10 p-3 rounded">
            <p className="font-semibold">For IGST (Inter-State):</p>
            <p className="text-xs">18% IGST (no split)</p>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">GST Rate Slabs - Complete Guide</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary">
            <tr>
              <th className="p-3 text-left">GST Rate</th>
              <th className="p-3 text-left">Common Items/Services</th>
              <th className="p-3 text-left">Examples</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b bg-green-500/10">
              <td className="p-3 font-bold">0% (Nil)</td>
              <td className="p-3">Essential goods</td>
              <td className="p-3 text-xs">Fresh vegetables, milk, bread, newspapers, education, healthcare</td>
            </tr>
            <tr className="border-b">
              <td className="p-3 font-bold">5%</td>
              <td className="p-3">Necessities</td>
              <td className="p-3 text-xs">Packaged food items, coal, medicines, transport services, small restaurants</td>
            </tr>
            <tr className="border-b">
              <td className="p-3 font-bold">12%</td>
              <td className="p-3">Standard goods</td>
              <td className="p-3 text-xs">Butter, ghee, mobile phones, computers, processed food, business class travel</td>
            </tr>
            <tr className="border-b bg-yellow-500/10">
              <td className="p-3 font-bold">18%</td>
              <td className="p-3">Most goods & services</td>
              <td className="p-3 text-xs">Hair oil, toothpaste, soaps, capital goods, IT services, restaurant with AC</td>
            </tr>
            <tr className="border-b bg-red-500/10">
              <td className="p-3 font-bold">28%</td>
              <td className="p-3">Luxury & sin goods</td>
              <td className="p-3 text-xs">Cars, motorcycles, AC, refrigerator, cigarettes, aerated drinks, 5-star hotels</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-4 bg-blue-500/10 rounded-lg">
        <p className="font-semibold">Most Common Rate:</p>
        <p className="text-sm mt-2">
          <strong>18% GST</strong> applies to approximately 40% of goods and services, making it the standard rate for 
          most businesses. IT services, consulting, online services, electronics accessories all fall under 18%.
        </p>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Real-Life Example 1: Small Restaurant Owner</h3>
      <div className="border-l-4 border-primary pl-6">
        <p className="font-semibold mb-2">Profile: Raj's Dhaba (Non-AC Restaurant)</p>
        <ul className="space-y-1 text-sm">
          <li>• Location: Pune, Maharashtra</li>
          <li>• Type: Small restaurant without AC</li>
          <li>• GST Rate: 5% (CGST 2.5% + SGST 2.5%)</li>
          <li>• Annual Turnover: ₹60 lakh</li>
        </ul>

        <div className="mt-4 bg-secondary/20 p-4 rounded">
          <p className="font-semibold mb-2">Daily Transaction Example:</p>
          <p className="text-sm mb-2">Customer Bill Breakdown:</p>
          
          <div className="space-y-3 text-sm">
            <div className="bg-white/10 p-3 rounded">
              <p className="font-semibold">Order Details:</p>
              <ul className="ml-4 space-y-1">
                <li>• 2 × Thali @ ₹150 = ₹300</li>
                <li>• 3 × Roti @ ₹10 = ₹30</li>
                <li>• 2 × Lassi @ ₹40 = ₹80</li>
                <li>• <strong>Subtotal (Base Price): ₹410</strong></li>
              </ul>
            </div>

            <div className="bg-green-500/10 p-3 rounded">
              <p className="font-semibold">GST Calculation:</p>
              <ul className="ml-4 space-y-1">
                <li>• CGST @ 2.5%: ₹410 × 0.025 = ₹10.25</li>
                <li>• SGST @ 2.5%: ₹410 × 0.025 = ₹10.25</li>
                <li>• <strong>Total GST: ₹20.50</strong></li>
                <li>• <strong className="text-lg">Final Bill: ₹410 + ₹20.50 = ₹430.50</strong></li>
              </ul>
            </div>

            <div className="bg-blue-500/10 p-3 rounded">
              <p className="font-semibold">Monthly GST Liability (100 similar bills/day):</p>
              <ul className="ml-4 space-y-1">
                <li>• Daily GST Collection: ₹20.50 × 100 = ₹2,050</li>
                <li>• Monthly GST: ₹2,050 × 30 = ₹61,500</li>
                <li>• CGST to pay: ₹30,750</li>
                <li>• SGST to pay: ₹30,750</li>
              </ul>
              <p className="text-xs mt-2 italic">Filed via GSTR-1 and GSTR-3B monthly</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Example 2: Freelance Software Developer</h3>
      <div className="border-l-4 border-blue-500 pl-6">
        <p className="font-semibold mb-2">Profile: Priya Sharma (IT Consultant)</p>
        <ul className="space-y-1 text-sm">
          <li>• Location: Bangalore, Karnataka</li>
          <li>• Service: Software Development & Consulting</li>
          <li>• GST Rate: 18% (CGST 9% + SGST 9% for Karnataka clients)</li>
          <li>• GST Rate: 18% IGST for clients in other states</li>
          <li>• Annual Turnover: ₹35 lakh</li>
        </ul>

        <div className="mt-4 bg-secondary/20 p-4 rounded">
          <p className="font-semibold mb-3">Scenario A: Local Client (Intra-State)</p>
          
          <div className="space-y-3 text-sm">
            <div className="bg-white/10 p-3 rounded">
              <p className="font-semibold">Invoice for Website Development:</p>
              <ul className="ml-4 space-y-1">
                <li>• Service Fee (Base): ₹1,00,000</li>
                <li>• CGST @ 9%: ₹9,000</li>
                <li>• SGST @ 9%: ₹9,000</li>
                <li>• <strong className="text-lg">Invoice Total: ₹1,18,000</strong></li>
              </ul>
            </div>
          </div>

          <p className="font-semibold mb-3 mt-4">Scenario B: Client in Mumbai (Inter-State)</p>
          
          <div className="space-y-3 text-sm">
            <div className="bg-purple-500/10 p-3 rounded">
              <p className="font-semibold">Invoice for App Development:</p>
              <ul className="ml-4 space-y-1">
                <li>• Service Fee (Base): ₹2,00,000</li>
                <li>• IGST @ 18%: ₹36,000</li>
                <li>• <strong className="text-lg">Invoice Total: ₹2,36,000</strong></li>
              </ul>
              <p className="text-xs mt-2">Note: IGST (not CGST+SGST) for inter-state supply</p>
            </div>
          </div>

          <div className="bg-yellow-500/10 p-4 rounded mt-4">
            <p className="font-semibold">Input Tax Credit (ITC) Benefit:</p>
            <ul className="text-xs space-y-1 mt-2">
              <li>• Laptop purchased: ₹80,000 + 18% GST (₹14,400)</li>
              <li>• Software licenses: ₹30,000 + 18% GST (₹5,400)</li>
              <li>• Co-working space: ₹15,000/month + 18% GST (₹2,700)</li>
              <li>• <strong>Total ITC in a month: ₹22,500</strong></li>
              <li>• GST collected from clients: ₹50,000</li>
              <li>• <strong className="text-green-600">Net GST to pay: ₹50,000 - ₹22,500 = ₹27,500</strong></li>
            </ul>
            <p className="text-xs mt-2 italic text-green-600">
              💡 This is the power of ITC - you don't pay tax on tax!
            </p>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Example 3: E-commerce Seller</h3>
      <div className="border-l-4 border-purple-500 pl-6">
        <p className="font-semibold mb-2">Profile: Aarti's Handicrafts (Amazon Seller)</p>
        <ul className="space-y-1 text-sm">
          <li>• Product: Handmade home decor items</li>
          <li>• Selling on: Amazon, Flipkart</li>
          <li>• Location: Jaipur, Rajasthan</li>
          <li>• GST Rate: 12% on handicraft items</li>
          <li>• Monthly Sales: ₹5 lakh</li>
        </ul>

        <div className="mt-4 bg-secondary/20 p-4 rounded">
          <p className="font-semibold mb-2">Product Pricing Example:</p>
          
          <div className="space-y-3 text-sm">
            <div className="bg-white/10 p-3 rounded">
              <p className="font-semibold">Decorative Wall Hanging:</p>
              <ul className="ml-4 space-y-1">
                <li>• Manufacturing Cost: ₹300</li>
                <li>• Desired Profit: ₹200</li>
                <li>• Base Selling Price: ₹500</li>
                <li>• GST @ 12%: ₹60</li>
                <li>• <strong>MRP (including GST): ₹560</strong></li>
              </ul>
            </div>

            <div className="bg-blue-500/10 p-3 rounded mt-3">
              <p className="font-semibold">GST Split (Intra-State - Rajasthan buyer):</p>
              <ul className="ml-4 space-y-1">
                <li>• CGST @ 6%: ₹30</li>
                <li>• SGST @ 6%: ₹30</li>
              </ul>
            </div>

            <div className="bg-purple-500/10 p-3 rounded mt-3">
              <p className="font-semibold">GST Split (Inter-State - Delhi buyer):</p>
              <ul className="ml-4 space-y-1">
                <li>• IGST @ 12%: ₹60</li>
              </ul>
            </div>

            <div className="bg-red-500/10 p-4 rounded mt-4">
              <p className="font-semibold">E-commerce Platform Complications:</p>
              <ul className="text-xs space-y-1 mt-2">
                <li>• Amazon/Flipkart collects TCS (Tax Collected at Source) @ 1%</li>
                <li>• If you sell ₹5L/month, TCS = ₹5,000 deducted by platform</li>
                <li>• You can claim this ₹5,000 as credit against your GST liability</li>
                <li>• Must file GSTR-1, GSTR-3B monthly (quarterly if turnover &lt; ₹5 Cr)</li>
              </ul>
            </div>

            <div className="bg-green-500/10 p-4 rounded mt-4">
              <p className="font-semibold">Monthly GST Calculation:</p>
              <ul className="text-xs space-y-1 mt-2">
                <li>• Total Sales: ₹5,00,000</li>
                <li>• GST Collected: ₹5,00,000 × 12/112 = ₹53,571</li>
                <li>• Input GST (raw materials, packaging): ₹18,000</li>
                <li>• TCS by Amazon: ₹5,000</li>
                <li>• <strong>Net GST to Pay: ₹53,571 - ₹18,000 - ₹5,000 = ₹30,571</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Example 4: Reverse GST Calculation (MRP to Base Price)</h3>
      <p className="mb-4">Common scenario: You see final price on invoice and need to find base price + GST breakdown</p>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="border border-border rounded-lg p-4 bg-blue-500/5">
          <h4 className="font-semibold mb-2">Scenario A: Laptop Purchase</h4>
          <ul className="text-sm space-y-2">
            <li><strong>Final Price Paid:</strong> ₹59,000</li>
            <li><strong>GST Rate:</strong> 18%</li>
            <li className="mt-3"><strong>Calculation:</strong></li>
            <li className="ml-4">Base Price = ₹59,000 / 1.18</li>
            <li className="ml-4">Base Price = ₹50,000</li>
            <li className="ml-4">GST Amount = ₹59,000 - ₹50,000</li>
            <li className="ml-4 text-green-600"><strong>GST = ₹9,000</strong></li>
          </ul>
        </div>

        <div className="border border-border rounded-lg p-4 bg-purple-500/5">
          <h4 className="font-semibold mb-2">Scenario B: Hotel Bill</h4>
          <ul className="text-sm space-y-2">
            <li><strong>Final Bill:</strong> ₹3,840</li>
            <li><strong>GST Rate:</strong> 12% (non-AC hotel)</li>
            <li className="mt-3"><strong>Calculation:</strong></li>
            <li className="ml-4">Base Price = ₹3,840 / 1.12</li>
            <li className="ml-4">Base Price = ₹3,428.57</li>
            <li className="ml-4">GST Amount = ₹3,840 - ₹3,428.57</li>
            <li className="ml-4 text-green-600"><strong>GST = ₹411.43</strong></li>
          </ul>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">GST Registration - Who Needs It?</h3>
      
      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-6 rounded-lg">
        <h4 className="font-semibold text-lg mb-3">Mandatory Registration Criteria:</h4>
        
        <div className="space-y-3 text-sm">
          <div className="bg-white/10 p-4 rounded">
            <p className="font-semibold">1. Turnover Threshold</p>
            <ul className="ml-4 mt-2 space-y-1">
              <li>• <strong>₹40 lakh</strong> for goods supply (most states)</li>
              <li>• <strong>₹20 lakh</strong> for services</li>
              <li>• <strong>₹20/10 lakh</strong> for special category states (NE, Himachal, J&K, Uttarakhand)</li>
            </ul>
          </div>

          <div className="bg-white/10 p-4 rounded">
            <p className="font-semibold">2. Compulsory Registration (Even Below Threshold)</p>
            <ul className="ml-4 mt-2 space-y-1">
              <li>• Inter-state supply of goods/services</li>
              <li>• E-commerce sellers (Amazon, Flipkart, Etsy, etc.)</li>
              <li>• Casual taxable person</li>
              <li>• Agents and distributors</li>
              <li>• Input Service Distributor</li>
              <li>• Those liable to pay tax under reverse charge</li>
              <li>• Non-resident taxable person</li>
            </ul>
          </div>

          <div className="bg-green-500/20 p-4 rounded">
            <p className="font-semibold">Benefits of Voluntary Registration:</p>
            <ul className="ml-4 mt-2 space-y-1">
              <li>✓ Claim Input Tax Credit on purchases</li>
              <li>✓ Look professional to B2B clients</li>
              <li>✓ Legally compliant for future growth</li>
              <li>✓ Sell on e-commerce platforms</li>
              <li>✓ Participate in government tenders</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Common GST Mistakes to Avoid</h3>
      
      <div className="space-y-3">
        <div className="flex gap-3 p-3 bg-red-500/10 rounded">
          <span className="text-2xl">❌</span>
          <div>
            <p className="font-semibold">Not Charging GST When Required</p>
            <p className="text-sm">If you're registered, you MUST charge GST on all taxable supplies. Not charging = 
            you pay from pocket when filing returns. Many service providers make this mistake.</p>
          </div>
        </div>

        <div className="flex gap-3 p-3 bg-red-500/10 rounded">
          <span className="text-2xl">❌</span>
          <div>
            <p className="font-semibold">Wrong GST Rate Application</p>
            <p className="text-sm">Applying 18% instead of 12% (or vice versa) causes compliance issues. Always check 
            HSN/SAC code and current rate schedule. Rates change occasionally.</p>
          </div>
        </div>

        <div className="flex gap-3 p-3 bg-red-500/10 rounded">
          <span className="text-2xl">❌</span>
          <div>
            <p className="font-semibold">Ignoring Input Tax Credit</p>
            <p className="text-sm">Not claiming ITC on business purchases means paying more tax. Keep all GST invoices, 
            ensure supplier files GSTR-1 (your ITC reflects in GSTR-2B).</p>
          </div>
        </div>

        <div className="flex gap-3 p-3 bg-red-500/10 rounded">
          <span className="text-2xl">❌</span>
          <div>
            <p className="font-semibold">Missing Return Filing Deadlines</p>
            <p className="text-sm">Late filing = ₹50/day penalty (₹20 if NIL return). After 3 consecutive months, 
            GST number gets cancelled. File GSTR-1 by 11th, GSTR-3B by 20th monthly.</p>
          </div>
        </div>

        <div className="flex gap-3 p-3 bg-red-500/10 rounded">
          <span className="text-2xl">❌</span>
          <div>
            <p className="font-semibold">Mixing IGST and CGST+SGST</p>
            <p className="text-sm">Intra-state = CGST+SGST, Inter-state = IGST. Using wrong combination causes tax 
            mismatch and ITC issues for buyer.</p>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">GST Return Filing Timeline - Complete Schedule</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary">
            <tr>
              <th className="p-3 text-left">Return Type</th>
              <th className="p-3 text-left">Who Files</th>
              <th className="p-3 text-left">Frequency</th>
              <th className="p-3 text-left">Due Date</th>
              <th className="p-3 text-left">Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-3 font-semibold">GSTR-1</td>
              <td className="p-3">All registered</td>
              <td className="p-3">Monthly</td>
              <td className="p-3">11th of next month</td>
              <td className="p-3 text-xs">Outward supplies (sales)</td>
            </tr>
            <tr className="border-b bg-yellow-500/10">
              <td className="p-3 font-semibold">GSTR-3B</td>
              <td className="p-3">All registered</td>
              <td className="p-3">Monthly</td>
              <td className="p-3">20th of next month</td>
              <td className="p-3 text-xs">Summary return + tax payment</td>
            </tr>
            <tr className="border-b">
              <td className="p-3 font-semibold">GSTR-2B</td>
              <td className="p-3">Auto-generated</td>
              <td className="p-3">Monthly</td>
              <td className="p-3">14th of next month</td>
              <td className="p-3 text-xs">ITC available (no filing needed)</td>
            </tr>
            <tr className="border-b">
              <td className="p-3 font-semibold">GSTR-9</td>
              <td className="p-3">Turnover &gt; ₹2 Cr</td>
              <td className="p-3">Annual</td>
              <td className="p-3">31st December</td>
              <td className="p-3 text-xs">Annual return (FY reconciliation)</td>
            </tr>
            <tr className="border-b">
              <td className="p-3 font-semibold">GSTR-4</td>
              <td className="p-3">Composition scheme</td>
              <td className="p-3">Quarterly</td>
              <td className="p-3">18th of next month</td>
              <td className="p-3 text-xs">Quarterly return for composition</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-4 bg-red-500/10 rounded-lg">
        <p className="font-semibold text-red-600">Penalty for Late Filing:</p>
        <ul className="text-sm mt-2 space-y-1">
          <li>• Late GSTR-3B: ₹50/day (₹20 if NIL return), max ₹5,000</li>
          <li>• Late GSTR-1: ₹50/day, max ₹10,000</li>
          <li>• Interest @ 18% p.a. on delayed tax payment</li>
        </ul>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Input Tax Credit (ITC) - The Tax Saver</h3>
      
      <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 p-6 rounded-lg">
        <h4 className="font-semibold text-lg mb-3">What is ITC?</h4>
        <p className="text-sm mb-4">
          ITC allows you to reduce the GST you collected from customers by the GST you paid on business purchases. 
          This prevents "tax on tax" and ensures tax is paid only on value addition.
        </p>

        <div className="space-y-4">
          <div className="bg-white/10 p-4 rounded">
            <p className="font-semibold mb-2">Example: Clothing Manufacturer</p>
            <ul className="text-sm space-y-2">
              <li><strong>Step 1:</strong> Buy fabric ₹1,000 + 12% GST (₹120) = ₹1,120 paid</li>
              <li><strong>Step 2:</strong> Make shirts, sell for ₹2,000 + 12% GST (₹240) = ₹2,240 collected</li>
              <li><strong>Without ITC:</strong> Pay full ₹240 to government</li>
              <li className="text-green-600"><strong>With ITC:</strong> Pay ₹240 - ₹120 = ₹120 only!</li>
              <li className="text-xs italic">You saved ₹120 because you can claim ITC on fabric purchase</li>
            </ul>
          </div>

          <div className="bg-blue-500/20 p-4 rounded">
            <p className="font-semibold mb-2">Conditions for ITC Claim:</p>
            <ul className="text-xs space-y-1 ml-4">
              <li>✓ Must have tax invoice from registered supplier</li>
              <li>✓ Goods/services received</li>
              <li>✓ Supplier has filed GSTR-1 (check your GSTR-2B)</li>
              <li>✓ You have filed your returns</li>
              <li>✓ Tax has been paid to government by supplier</li>
              <li>✓ Used for business purposes only</li>
            </ul>
          </div>

          <div className="bg-red-500/20 p-4 rounded">
            <p className="font-semibold mb-2">ITC NOT allowed on:</p>
            <ul className="text-xs space-y-1 ml-4">
              <li>✗ Food and beverages, outdoor catering</li>
              <li>✗ Rent-a-cab, life and health insurance</li>
              <li>✗ Travel benefits to employees</li>
              <li>✗ Personal use items</li>
              <li>✗ Club membership fees</li>
              <li>✗ Works contract services for immovable property (with exceptions)</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section className="bg-gradient-to-r from-primary/20 to-secondary/20 p-6 rounded-lg">
      <h3 className="text-xl font-semibold mb-3">GST Compliance Checklist</h3>
      
      <div className="space-y-2 text-sm">
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span>Obtained GST registration (GSTIN)</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span>Issued tax invoices for all sales with correct GST rate</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span>Collected all purchase invoices for ITC claims</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span>Verified ITC in GSTR-2B before claiming</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span>Filed GSTR-1 by 11th of every month</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span>Filed GSTR-3B and paid tax by 20th of every month</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span>Maintained digital records of all transactions</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span>Reconciled bank statements with GST payments</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span>Responded to any GST notices within deadline</span>
        </label>
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-1" />
          <span>Filed annual return (GSTR-9) if applicable</span>
        </label>
      </div>
    </section>

    <section>
      <h3 className="text-xl font-semibold mb-3">Conclusion - Mastering GST for Business Success</h3>
      <p className="leading-relaxed">
        GST is complex but manageable with proper understanding. Whether you're a small business owner, freelancer, 
        or e-commerce seller, accurate GST calculation and timely filing are crucial for compliance and growth. 
        Use this calculator to quickly compute GST for your transactions, understand the breakdown, and price your 
        products/services correctly. Remember: GST is not a cost - it's a tax you collect from customers and pass 
        to the government after claiming your ITC!
      </p>
      <div className="mt-4 p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg">
        <p className="font-semibold text-lg">Pro Tips:</p>
        <ul className="mt-2 space-y-1 text-sm">
          <li>✓ Always keep invoices organized - digital copies backed up</li>
          <li>✓ File returns on time even if business is NIL for the month</li>
          <li>✓ Claim ITC diligently - it's free money you already paid</li>
          <li>✓ Use GST portal's e-way bill for goods transport above ₹50,000</li>
          <li>✓ Consider hiring a CA for complex cases or high turnover</li>
        </ul>
      </div>
      <p className="mt-4 text-sm font-semibold bg-primary/10 p-4 rounded">
        💡 Final Advice: GST laws evolve. Stay updated through GST portal notifications, follow CBIC circulars, 
        and when in doubt, consult a tax professional. A small investment in compliance today prevents huge penalties tomorrow!
      </p>
    </section>

    <section>
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions (FAQ)
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="What is the difference between CGST, SGST, and IGST?"
          answer="CGST (Central GST) and SGST (State GST) are applied on intra-state transactions (within the same state), with both center and state getting equal shares. IGST (Integrated GST) is applied on inter-state transactions (between different states), which goes entirely to the central government and is later distributed."
        />
        <FaqItem 
          question="Do I need GST registration for a small business?"
          answer="GST registration is mandatory if your annual turnover exceeds ₹40 lakhs for goods (₹20 lakhs for special category states) or ₹20 lakhs for services. However, you can opt for voluntary registration even below these limits to claim input tax credit."
        />
        <FaqItem 
          question="Can I claim Input Tax Credit (ITC) on all purchases?"
          answer="No, ITC cannot be claimed on certain items like food and beverages, personal use items, club memberships, life and health insurance, and employee travel benefits. ITC is allowed only for business-related purchases with valid tax invoices."
        />
        <FaqItem 
          question="What is the GST rate for my product or service?"
          answer="GST rates vary from 0% to 28% depending on the product/service category. Essential items are at 0-5%, most goods at 12-18%, and luxury/demerit goods at 28%. Check the HSN/SAC code for your specific item on the GST portal."
        />
        <FaqItem 
          question="What happens if I file GST returns late?"
          answer="Late filing attracts a penalty of ₹50/day (₹20/day for NIL returns) under CGST and SGST each, totaling ₹100/day, with a maximum cap of ₹5,000. Additionally, you'll also incur 18% interest per annum on the unpaid tax amount."
        />
        <FaqItem 
          question="How do I calculate reverse charge GST?"
          answer="Under reverse charge mechanism (RCM), the recipient pays GST instead of the supplier. Calculate it the same way but the buyer deposits it. This applies to transactions like advocate services, goods transport, imports from unregistered dealers, etc."
        />
      </div>
    </section>
  </div>
)
