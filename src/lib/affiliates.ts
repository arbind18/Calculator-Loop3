/**
 * Affiliate Link Tracking and Management
 */

export interface AffiliatePartner {
  id: string;
  name: string;
  category: 'bank' | 'loan' | 'insurance' | 'investment' | 'credit-card';
  logoUrl: string;
  description: string;
  affiliateUrl: string;
  commission: {
    type: 'percentage' | 'fixed';
    value: number;
    currency?: string;
  };
  features: string[];
  rating?: number;
  minimumAmount?: number;
  isActive: boolean;
}

/**
 * Affiliate Partners Database
 */
export const affiliatePartners: AffiliatePartner[] = [
  // Home Loan Partners
  {
    id: 'sbi-home-loan',
    name: 'SBI Home Loan',
    category: 'loan',
    logoUrl: '/partners/sbi.png',
    description: 'Competitive interest rates starting at 8.50%. Quick approval process.',
    affiliateUrl: 'https://www.onlinesbi.sbi/home-loan?ref=calculatorloop',
    commission: { type: 'fixed', value: 5000, currency: 'INR' },
    features: ['8.50% interest rate', 'Quick approval', 'Flexible tenure', 'Tax benefits'],
    rating: 4.5,
    minimumAmount: 500000,
    isActive: true,
  },
  {
    id: 'hdfc-home-loan',
    name: 'HDFC Home Loan',
    category: 'loan',
    logoUrl: '/partners/hdfc.png',
    description: 'Special rates for women borrowers. Online application process.',
    affiliateUrl: 'https://www.hdfc.com/home-loans?ref=calculatorloop',
    commission: { type: 'fixed', value: 5500, currency: 'INR' },
    features: ['Special rates for women', 'Online process', 'Balance transfer available', 'Top-up loans'],
    rating: 4.6,
    minimumAmount: 500000,
    isActive: true,
  },
  {
    id: 'icici-home-loan',
    name: 'ICICI Home Loan',
    category: 'loan',
    logoUrl: '/partners/icici.png',
    description: 'Pre-approved offers for salary account holders. Instant sanction.',
    affiliateUrl: 'https://www.icicibank.com/home-loan?ref=calculatorloop',
    commission: { type: 'fixed', value: 4800, currency: 'INR' },
    features: ['Instant sanction', 'Pre-approved offers', 'Digital documentation', 'EMI calculator'],
    rating: 4.4,
    minimumAmount: 500000,
    isActive: true,
  },

  // Personal Loan Partners
  {
    id: 'bajaj-personal-loan',
    name: 'Bajaj Finserv Personal Loan',
    category: 'loan',
    logoUrl: '/partners/bajaj.png',
    description: 'Get instant personal loans up to ₹25 lakh. Minimal documentation.',
    affiliateUrl: 'https://www.bajajfinserv.in/personal-loan?ref=calculatorloop',
    commission: { type: 'percentage', value: 2 },
    features: ['Instant approval', 'Minimal docs', 'Flexible repayment', 'Online process'],
    rating: 4.3,
    minimumAmount: 50000,
    isActive: true,
  },

  // Investment Partners
  {
    id: 'groww-mutual-funds',
    name: 'Groww - Mutual Funds',
    category: 'investment',
    logoUrl: '/partners/groww.png',
    description: 'Start SIP with ₹100. Zero commission on direct mutual funds.',
    affiliateUrl: 'https://groww.in/mutual-funds?ref=calculatorloop',
    commission: { type: 'fixed', value: 500, currency: 'INR' },
    features: ['Zero commission', 'Start with ₹100', '5000+ funds', 'Easy tracking'],
    rating: 4.7,
    isActive: true,
  },
  {
    id: 'zerodha-stocks',
    name: 'Zerodha - Stock Trading',
    category: 'investment',
    logoUrl: '/partners/zerodha.png',
    description: 'India\'s largest broker. Free equity delivery trades.',
    affiliateUrl: 'https://zerodha.com/?ref=calculatorloop',
    commission: { type: 'fixed', value: 1000, currency: 'INR' },
    features: ['Free delivery', 'Low brokerage', 'Advanced tools', 'Educational resources'],
    rating: 4.6,
    isActive: true,
  },

  // Insurance Partners
  {
    id: 'policybazaar-health',
    name: 'PolicyBazaar Health Insurance',
    category: 'insurance',
    logoUrl: '/partners/policybazaar.png',
    description: 'Compare 40+ health insurance plans. Get instant quotes.',
    affiliateUrl: 'https://www.policybazaar.com/health-insurance?ref=calculatorloop',
    commission: { type: 'percentage', value: 15 },
    features: ['Compare 40+ plans', 'Instant quotes', 'Claim support', 'Cashless hospitals'],
    rating: 4.4,
    isActive: true,
  },

  // Credit Card Partners
  {
    id: 'hdfc-credit-card',
    name: 'HDFC Credit Cards',
    category: 'credit-card',
    logoUrl: '/partners/hdfc.png',
    description: 'Lifetime free credit cards with amazing rewards.',
    affiliateUrl: 'https://www.hdfcbank.com/credit-cards?ref=calculatorloop',
    commission: { type: 'fixed', value: 2000, currency: 'INR' },
    features: ['Lifetime free', 'Rewards program', 'Fuel surcharge waiver', 'Airport lounge access'],
    rating: 4.5,
    isActive: true,
  },
];

/**
 * Track affiliate click
 */
export async function trackAffiliateClick(
  partnerId: string,
  userId?: string,
  metadata?: Record<string, any>
) {
  try {
    // Log to analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'affiliate_click', {
        partner_id: partnerId,
        user_id: userId,
        ...metadata,
      });
    }

    // Send to your backend for commission tracking
    await fetch('/api/affiliate/track-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        partnerId,
        userId,
        timestamp: new Date().toISOString(),
        metadata,
      }),
    });
  } catch (error) {
    console.error('Failed to track affiliate click:', error);
  }
}

/**
 * Get partners by category
 */
export function getPartnersByCategory(category: AffiliatePartner['category']) {
  return affiliatePartners.filter((p) => p.category === category && p.isActive);
}

/**
 * Get recommended partners based on calculation
 */
export function getRecommendedPartners(
  calculationType: string,
  amount?: number
): AffiliatePartner[] {
  const categoryMap: Record<string, AffiliatePartner['category']> = {
    'emi-calculator': 'loan',
    'home-loan-calculator': 'loan',
    'personal-loan-calculator': 'loan',
    'car-loan-calculator': 'loan',
    'sip-calculator': 'investment',
    'lumpsum-calculator': 'investment',
    'fd-calculator': 'investment',
    'bmi-calculator': 'insurance',
    'health-insurance-calculator': 'insurance',
  };

  const category = categoryMap[calculationType];
  if (!category) return [];

  let partners = getPartnersByCategory(category);

  // Filter by minimum amount if applicable
  if (amount) {
    partners = partners.filter(
      (p) => !p.minimumAmount || amount >= p.minimumAmount
    );
  }

  // Sort by rating
  return partners.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3);
}

/**
 * Generate affiliate link with tracking
 */
export function generateAffiliateLink(
  partner: AffiliatePartner,
  userId?: string,
  source?: string
): string {
  const url = new URL(partner.affiliateUrl);
  
  if (userId) {
    url.searchParams.set('user', userId);
  }
  
  if (source) {
    url.searchParams.set('source', source);
  }
  
  url.searchParams.set('timestamp', Date.now().toString());
  
  return url.toString();
}
