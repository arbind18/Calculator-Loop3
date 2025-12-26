import React from 'react'
import { HelpCircle } from 'lucide-react'
import { FaqItem } from '@/components/ui/faq-item'

export const GSTSeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>Understanding GST (Goods and Services Tax)</h2>
    <p>
      GST is a comprehensive, multi-stage, destination-based tax that is levied on every value addition. 
      It has replaced many indirect taxes in India and other countries, simplifying the tax structure.
    </p>
    <h3>Key Components of GST</h3>
    <ul>
      <li><strong>CGST:</strong> Central Goods and Services Tax, collected by the Central Government.</li>
      <li><strong>SGST:</strong> State Goods and Services Tax, collected by the State Government.</li>
      <li><strong>IGST:</strong> Integrated Goods and Services Tax, collected by the Central Government for inter-state trade.</li>
    </ul>
    <p>
      Calculating GST correctly is crucial for businesses to ensure compliance and for consumers to understand the final price of goods and services.
      This calculator helps you determine the net price, GST amount, and total price easily.
    </p>
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="How do I calculate GST on a product?"
          answer="To add GST: Final Price = Base Price × (1 + GST%/100). To remove GST: Base Price = Final Price / (1 + GST%/100). For 18% GST on ₹1,000: Final = ₹1,000 × 1.18 = ₹1,180."
        />
        <FaqItem 
          question="What is the difference between inclusive and exclusive GST?"
          answer="GST Exclusive means GST is added on top of the base price. GST Inclusive means the displayed price already includes GST. Most retail prices are GST inclusive, while B2B invoices often show GST exclusive."
        />
        <FaqItem 
          question="Can I claim GST refund?"
          answer="Businesses can claim Input Tax Credit (ITC) for GST paid on business purchases. Tourists can claim GST refund on goods purchased and taken out of the country. File GSTR-3B monthly to claim ITC."
        />
      </div>
    </section>
  </div>
)

export const MarginSeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>Profit Margin Analysis</h2>
    <p>
      Profit margin is one of the most commonly used profitability ratios to gauge the degree to which a company or a business activity makes money.
      It represents what percentage of sales has turned into profits.
    </p>
    <h3>Types of Margins</h3>
    <ul>
      <li><strong>Gross Margin:</strong> Total Revenue minus Cost of Goods Sold (COGS).</li>
      <li><strong>Net Margin:</strong> The percentage of revenue remaining after all operating expenses, interest, taxes and preferred stock dividends have been deducted.</li>
    </ul>
    <p>
      Understanding your margin is essential for pricing strategies and ensuring the long-term sustainability of your business.
    </p>
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="What is a good profit margin?"
          answer="It varies by industry: Retail (5-10%), Restaurants (3-5%), Software (70-90%), Consulting (20-30%). Net margins above 10% are considered healthy. Compare with industry benchmarks, not absolute numbers."
        />
        <FaqItem 
          question="What's the difference between markup and margin?"
          answer="Markup is profit as % of cost. Margin is profit as % of selling price. Example: Cost ₹100, Sell ₹150. Markup = 50/100 = 50%. Margin = 50/150 = 33%. Margin is always lower than markup."
        />
        <FaqItem 
          question="How can I increase my profit margin?"
          answer="Four strategies: (1) Increase prices (if demand allows), (2) Reduce COGS (negotiate with suppliers), (3) Reduce operating expenses, (4) Increase sales volume to spread fixed costs over more units."
        />
      </div>
    </section>
  </div>
)

export const BreakEvenSeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>Break-Even Point Analysis</h2>
    <p>
      The break-even point is the level of production at which the costs of production equal the revenues for a product.
      At this point, there is neither profit nor loss.
    </p>
    <h3>Why Calculate Break-Even?</h3>
    <ul>
      <li><strong>Pricing:</strong> Helps in setting the right price for products.</li>
      <li><strong>Risk Assessment:</strong> Determines the minimum sales volume needed to avoid losses.</li>
      <li><strong>Cost Control:</strong> Highlights the relationship between fixed and variable costs.</li>
    </ul>
    <p>
      This calculator helps entrepreneurs and managers determine the sales volume required to cover costs and start generating profit.
    </p>
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="How do I calculate break-even point?"
          answer="Break-Even Point (units) = Fixed Costs / (Selling Price per Unit - Variable Cost per Unit). Example: Fixed costs ₹50,000, Sell at ₹200, Variable cost ₹120. Break-even = 50,000/(200-120) = 625 units."
        />
        <FaqItem 
          question="What are fixed vs variable costs?"
          answer="Fixed Costs don't change with sales volume (rent, salaries, insurance). Variable Costs change with production (raw materials, packaging, commissions). Semi-variable costs have both components (electricity, phone bills)."
        />
        <FaqItem 
          question="Why is break-even analysis important?"
          answer="It helps determine: (1) Minimum sales to avoid losses, (2) Pricing strategy, (3) Impact of cost changes, (4) Feasibility of new products, (5) Safety margin. Essential for startups and new product launches."
        />
      </div>
    </section>
  </div>
)

export const ROISeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>Return on Investment (ROI)</h2>
    <p>
      ROI is a performance measure used to evaluate the efficiency of an investment or compare the efficiency of a number of different investments.
      It measures the amount of return on an investment, relative to the investment's cost.
    </p>
    <h3>Interpreting ROI</h3>
    <ul>
      <li><strong>Positive ROI:</strong> The investment has generated more money than it cost.</li>
      <li><strong>Negative ROI:</strong> The investment has lost value.</li>
      <li><strong>Comparison:</strong> Higher ROI indicates a better investment opportunity.</li>
    </ul>
    <p>
      Use this calculator to evaluate potential business ventures, marketing campaigns, or capital expenditures.
    </p>
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="What is a good ROI percentage?"
          answer="ROI depends on industry and risk: Stock market (7-10% annually is average), Real estate (8-12%), Business investments (15-20%+), Marketing campaigns (200-500% is excellent). Higher risk should demand higher ROI."
        />
        <FaqItem 
          question="How do I calculate ROI?"
          answer="ROI = (Net Profit / Cost of Investment) × 100. Example: Invest ₹1,00,000 in equipment, earn ₹1,50,000 profit. ROI = (50,000/1,00,000) × 100 = 50%. Can also be calculated as (Final Value - Initial Value) / Initial Value × 100."
        />
        <FaqItem 
          question="What's the difference between ROI and ROE?"
          answer="ROI (Return on Investment) measures return on any investment. ROE (Return on Equity) specifically measures return on shareholders' equity. ROI is broader and used for any investment decision, ROE is specific to company performance analysis."
        />
      </div>
    </section>
  </div>
)

export const DiscountSeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>Discount Strategies</h2>
    <p>
      Discounts are a powerful tool for driving sales, clearing inventory, and attracting new customers.
      However, it's crucial to calculate the impact of discounts on your profit margins.
    </p>
    <h3>Common Discount Types</h3>
    <ul>
      <li><strong>Percentage Discount:</strong> A specific percentage off the original price (e.g., 20% off).</li>
      <li><strong>Fixed Amount Discount:</strong> A specific dollar amount off (e.g., $10 off).</li>
      <li><strong>Volume Discount:</strong> Discounts for buying in bulk.</li>
    </ul>
    <p>
      This calculator helps shoppers determine the final price and savings, and helps businesses plan their promotional strategies.
    </p>
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="How do I calculate the final price after discount?"
          answer="Final Price = Original Price × (1 - Discount%/100). Example: ₹5,000 with 20% discount = ₹5,000 × 0.8 = ₹4,000. Saved amount = ₹5,000 - ₹4,000 = ₹1,000."
        />
        <FaqItem 
          question="Can I apply multiple discounts together?"
          answer="Discounts are typically applied sequentially, not added. 20% + 10% ≠ 30% off. Instead: ₹100 - 20% = ₹80, then ₹80 - 10% = ₹72. Total discount is 28%, not 30%. Always calculate step-by-step."
        />
        <FaqItem 
          question="What discount percentage should I offer?"
          answer="Consider your margin: If margin is 40%, max discount is 30-35% to stay profitable. Psychological pricing works: 25% off feels better than 'Save ₹250'. Test different levels and analyze sales impact vs. margin reduction."
        />
      </div>
    </section>
  </div>
)

export const CPMSeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>Cost Per Mille (CPM) in Advertising</h2>
    <p>
      CPM, or Cost Per Thousand impressions, is a marketing term used to denote the price of 1,000 advertisement impressions on one webpage.
      It is a standard metric for pricing web ads.
    </p>
    <h3>Using CPM Effectively</h3>
    <ul>
      <li><strong>Budgeting:</strong> Helps in estimating the cost of an advertising campaign.</li>
      <li><strong>Comparison:</strong> Allows comparison of costs across different media channels.</li>
      <li><strong>Performance:</strong> While it measures cost, it should be analyzed alongside CTR (Click-Through Rate) for effectiveness.</li>
    </ul>
    <p>
      This calculator is essential for digital marketers and advertisers to plan and optimize their ad spend.
    </p>
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="What is a good CPM rate?"
          answer="CPM varies by platform and industry: Facebook (₹100-₹500), Google Display (₹200-₹800), YouTube (₹50-₹300), LinkedIn (₹500-₹2,000). B2B and niche audiences typically have higher CPM than B2C mass markets."
        />
        <FaqItem 
          question="How do I calculate total impressions from CPM?"
          answer="Total Impressions = (Total Cost / CPM) × 1000. Example: Budget ₹10,000, CPM ₹200. Impressions = (10,000/200) × 1000 = 50,000 impressions. Use this to forecast campaign reach."
        />
        <FaqItem 
          question="Should I optimize for CPM or CPC?"
          answer="Use CPM for brand awareness campaigns (maximize reach). Use CPC (Cost Per Click) for performance campaigns (conversions, sales). CPM is cheaper for mass visibility, CPC is better for targeted actions. Test both for your audience."
        />
      </div>
    </section>
  </div>
)

export const CACSeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>Customer Acquisition Cost (CAC)</h2>
    <p>
      CAC is the cost of winning a customer to purchase a product or service.
      It is an important metric for growing businesses and investors.
    </p>
    <h3>Components of CAC</h3>
    <ul>
      <li><strong>Marketing Costs:</strong> Ad spend, content creation, etc.</li>
      <li><strong>Sales Costs:</strong> Salaries, commissions, tools.</li>
      <li><strong>Time Period:</strong> Calculated over a specific period (e.g., monthly, quarterly).</li>
    </ul>
    <p>
      Keeping CAC lower than the Customer Lifetime Value (LTV) is critical for a sustainable business model.
    </p>
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="How do I calculate CAC?"
          answer="CAC = Total Marketing & Sales Costs / Number of New Customers Acquired. Example: Spent ₹1,00,000 on marketing, acquired 50 customers. CAC = 1,00,000/50 = ₹2,000 per customer."
        />
        <FaqItem 
          question="What is a good CAC to LTV ratio?"
          answer="Ideal ratio is 1:3 (LTV should be 3x CAC). Example: If CAC = ₹2,000, LTV should be ₹6,000+. Ratio below 1:1 means you're losing money. Above 1:5 means you're underinvesting in growth."
        />
        <FaqItem 
          question="How can I reduce my CAC?"
          answer="Strategies: (1) Improve conversion rates (better landing pages), (2) Optimize ad targeting, (3) Use organic channels (SEO, content marketing), (4) Referral programs, (5) Improve sales efficiency. A 10% improvement in conversion can cut CAC by 10%."
        />
      </div>
    </section>
  </div>
)

export const CLVSeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>Customer Lifetime Value (CLV)</h2>
    <p>
      CLV is a prediction of the net profit attributed to the entire future relationship with a customer.
      It helps businesses understand how much they can afford to spend on acquiring new customers.
    </p>
    <h3>Improving CLV</h3>
    <ul>
      <li><strong>Retention:</strong> Keeping customers longer increases their value.</li>
      <li><strong>Upselling:</strong> Encouraging customers to buy premium products.</li>
      <li><strong>Customer Service:</strong> Excellent service leads to repeat business.</li>
    </ul>
    <p>
      This calculator helps you estimate the long-term value of your customer base and make strategic decisions about retention and acquisition.
    </p>
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="How do I calculate Customer Lifetime Value?"
          answer="Simple CLV = Average Purchase Value × Purchase Frequency × Customer Lifespan. Example: Avg order ₹500, buys 4 times/year, stays 3 years. CLV = 500 × 4 × 3 = ₹6,000. Advanced formula includes profit margin and discount rate."
        />
        <FaqItem 
          question="Why is CLV important?"
          answer="CLV determines how much you can spend on customer acquisition (CAC should be <33% of CLV). It helps prioritize high-value customers, improve retention strategies, and forecast revenue. Increasing CLV by 10% can double profitability."
        />
        <FaqItem 
          question="How can I increase CLV?"
          answer="Five strategies: (1) Increase purchase frequency (loyalty programs), (2) Increase average order value (upselling, bundles), (3) Extend customer lifespan (better service, engagement), (4) Reduce churn (address pain points), (5) Cross-sell related products."
        />
      </div>
    </section>
  </div>
)

export const NPVSeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>Net Present Value (NPV)</h2>
    <p>
      NPV is the difference between the present value of cash inflows and the present value of cash outflows over a period of time.
      It is used in capital budgeting and investment planning to analyze the profitability of a projected investment or project.
    </p>
    <h3>Decision Rule</h3>
    <ul>
      <li><strong>Positive NPV:</strong> The project is expected to add value and should be accepted.</li>
      <li><strong>Negative NPV:</strong> The project is expected to subtract value and should be rejected.</li>
      <li><strong>Zero NPV:</strong> The project is expected to break even.</li>
    </ul>
    <p>
      This calculator is a vital tool for financial analysts and business owners evaluating long-term projects.
    </p>
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="What is NPV and why is it important?"
          answer="NPV (Net Present Value) shows today's value of future cash flows minus initial investment. Positive NPV = profitable project. It accounts for time value of money (money today is worth more than same amount in future)."
        />
        <FaqItem 
          question="What discount rate should I use for NPV?"
          answer="Use your cost of capital or required rate of return. Typical ranges: Low-risk projects (8-10%), Medium-risk (12-15%), High-risk startups (20-30%). Some use WACC (Weighted Average Cost of Capital) for accuracy."
        />
        <FaqItem 
          question="How do I interpret NPV results?"
          answer="NPV > 0: Accept project (adds value). NPV < 0: Reject project (destroys value). NPV = 0: Breakeven (no value added). When comparing projects, choose the one with highest positive NPV, not just positive NPV."
        />
      </div>
    </section>
  </div>
)

export const VATSeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>Value Added Tax (VAT)</h2>
    <p>
      VAT is a consumption tax placed on a product whenever value is added at each stage of the supply chain, from production to the point of sale.
      It is widely used in the European Union and many other regions.
    </p>
    <h3>VAT vs. Sales Tax</h3>
    <p>
      Unlike sales tax, which is collected only at the final sale to the consumer, VAT is collected at every stage of production and distribution.
      Businesses can usually claim back the VAT they have paid on business expenses.
    </p>
    <p>
      This calculator helps you calculate the VAT amount to add to a net price or extract the VAT amount from a gross price.
    </p>
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="What is the difference between VAT and GST?"
          answer="VAT (Value Added Tax) was India's old tax system, replaced by GST in 2017. VAT was state-level, GST is nationwide. Internationally, VAT is still used (EU, UK use 15-27% VAT). The calculation method is similar."
        />
        <FaqItem 
          question="How do I calculate VAT?"
          answer="To add VAT: Total = Price × (1 + VAT%/100). To extract VAT: VAT Amount = (Total × VAT%) / (100 + VAT%). Example: ₹120 gross with 20% VAT. VAT = (120 × 20)/120 = ₹20, Net = ₹100."
        />
        <FaqItem 
          question="Can businesses claim back VAT?"
          answer="Yes, registered businesses can reclaim VAT on purchases used for business (Input VAT). They charge VAT on sales (Output VAT) and pay only the difference. This prevents tax cascading and double taxation."
        />
      </div>
    </section>
  </div>
)
