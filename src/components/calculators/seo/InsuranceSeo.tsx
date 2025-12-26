import React from 'react'
import { HelpCircle } from 'lucide-react'
import { FaqItem } from '@/components/ui/faq-item'

export const TermInsuranceSeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>Term Insurance Premium Calculator</h2>
    <p>
      Term insurance is the purest and most affordable form of life insurance. It provides high coverage 
      at low premiums, making it essential for financial planning and family protection.
    </p>
    <h3>Why Term Insurance?</h3>
    <ul>
      <li><strong>High Coverage:</strong> ₹1 crore coverage for as low as ₹500-1,000/month.</li>
      <li><strong>Pure Protection:</strong> No investment component, just pure risk cover.</li>
      <li><strong>Tax Benefits:</strong> Premiums deductible under Section 80C, claims tax-free under 10(10D).</li>
    </ul>
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="How much term insurance do I need?"
          answer="Thumb rule: 10-15 times your annual income. Example: ₹10 lakh salary = ₹1-1.5 crore cover. Also add outstanding debts (home loan, car loan) and subtract existing savings. Cover should sustain family for 15-20 years."
        />
        <FaqItem 
          question="What affects term insurance premium?"
          answer="5 factors: (1) Age (younger = cheaper), (2) Gender (women get 10-20% lower rates), (3) Smoking/tobacco use (+50% premium), (4) Health conditions (diabetes, BP increase cost), (5) Policy term (longer term = higher total)."
        />
        <FaqItem 
          question="Should I buy term insurance online or offline?"
          answer="Online is 15-30% cheaper (no agent commission). Buy direct from insurer's website or aggregators (PolicyBazaar, Coverfox). Medical tests same for both. Choose reputed insurers (HDFC Life, ICICI Pru, LIC, Max Life) with high claim settlement ratio (>95%)."
        />
      </div>
    </section>
  </div>
)

export const LifeInsuranceSeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>Life Insurance Need Calculator</h2>
    <p>
      Calculate the right amount of life insurance your family needs using the Human Life Value (HLV) approach. 
      This ensures your loved ones are financially secure even in your absence.
    </p>
    <h3>HLV Formula</h3>
    <p>Insurance Needed = (Annual Income × Years to Support) + Outstanding Loans - Existing Savings</p>
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="What is Human Life Value (HLV)?"
          answer="HLV = Present value of all future income you'll earn. It accounts for: (1) Annual income, (2) Years left to work (retirement age - current age), (3) Inflation adjustment, (4) Discount rate. Ensures family maintains lifestyle after you."
        />
        <FaqItem 
          question="Term insurance vs whole life vs ULIPs?"
          answer="Term: Pure protection, cheapest, highest cover. Whole Life: Lifelong cover + savings component, expensive. ULIPs: Insurance + investment, high charges, poor returns. Best strategy: Term insurance (protection) + separate mutual funds (wealth creation)."
        />
        <FaqItem 
          question="Can I have multiple term insurance policies?"
          answer="Yes! Absolutely allowed and recommended. Buy from 2-3 different insurers for: (1) Risk diversification if one rejects claim, (2) Different policy tenures (till 60, till 70), (3) Total cover splits (₹1cr + ₹50L better than single ₹1.5cr for claim safety)."
        />
      </div>
    </section>
  </div>
)

export const HealthInsuranceSeoContent = () => (
  <div className="prose dark:prose-invert max-w-none mt-8">
    <h2>Health Insurance Premium Calculator</h2>
    <p>
      With rising medical costs, health insurance is non-negotiable. A single hospitalization can wipe out years 
      of savings. Estimate premiums and choose the right coverage.
    </p>
    <h3>Coverage Guidelines</h3>
    <ul>
      <li><strong>Metro Cities:</strong> Minimum ₹10 lakh individual, ₹25 lakh family floater.</li>
      <li><strong>Tier 2/3 Cities:</strong> Minimum ₹5 lakh individual, ₹15 lakh family.</li>
      <li><strong>Add Super Top-Up:</strong> Extra ₹50 lakh-1 crore coverage at low cost.</li>
    </ul>
    <section className="mt-8">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-primary" />
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        <FaqItem 
          question="Individual vs Family Floater health insurance?"
          answer="Individual: Separate cover per person, no sharing. Family Floater: Shared sum for family, cheaper. Best: Individual for parents (age-based pricing), Family floater for self+spouse+kids. Add super top-up for catastrophic events."
        />
        <FaqItem 
          question="What is waiting period in health insurance?"
          answer="Initial waiting: 30 days (no claims except accidents). Pre-existing diseases: 2-4 years wait. Specific diseases: 1-2 years (hernia, cataracts). Choose policies with lowest waiting periods. Portability resets waiting, so switch carefully."
        />
        <FaqItem 
          question="How to choose best health insurance?"
          answer="Check: (1) Claim settlement ratio (>90%), (2) Network hospitals in your city, (3) No room rent limit (choose unlimited), (4) Copayment % (0% best), (5) Restoration benefit (sum insured restores if exhausted), (6) No disease sublimits."
        />
      </div>
    </section>
  </div>
)
