/**
 * Premium Features Configuration
 */

export interface PremiumTier {
  id: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
    currency: string;
  };
  features: string[];
  limits: {
    calculationsPerMonth: number;
    apiCallsPerMonth: number;
    exportFormats: string[];
    advancedCalculators: boolean;
    prioritySupport: boolean;
    adFree: boolean;
    customBranding: boolean;
  };
  popular?: boolean;
}

export const premiumTiers: PremiumTier[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for personal use',
    price: {
      monthly: 0,
      yearly: 0,
      currency: 'INR',
    },
    features: [
      'All basic calculators',
      'Save up to 10 calculations',
      'Basic charts and graphs',
      'Email support',
      'Standard calculations',
    ],
    limits: {
      calculationsPerMonth: 100,
      apiCallsPerMonth: 0,
      exportFormats: ['PDF'],
      advancedCalculators: false,
      prioritySupport: false,
      adFree: false,
      customBranding: false,
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For professionals and frequent users',
    price: {
      monthly: 299,
      yearly: 2999,
      currency: 'INR',
    },
    features: [
      'All calculators including advanced',
      'Unlimited calculations',
      'Save unlimited history',
      'Export to PDF, Excel, CSV',
      'Advanced charts and analysis',
      'Priority email support',
      'Ad-free experience',
      'Comparison tools',
    ],
    limits: {
      calculationsPerMonth: -1, // Unlimited
      apiCallsPerMonth: 1000,
      exportFormats: ['PDF', 'Excel', 'CSV'],
      advancedCalculators: true,
      prioritySupport: true,
      adFree: true,
      customBranding: false,
    },
    popular: true,
  },
  {
    id: 'business',
    name: 'Business',
    description: 'For teams and businesses',
    price: {
      monthly: 999,
      yearly: 9999,
      currency: 'INR',
    },
    features: [
      'Everything in Pro',
      'API access (10,000 calls/month)',
      'White-label calculators',
      'Custom branding',
      'Team collaboration',
      'Dedicated account manager',
      'SLA guarantee',
      'Custom integrations',
      'Advanced analytics',
    ],
    limits: {
      calculationsPerMonth: -1,
      apiCallsPerMonth: 10000,
      exportFormats: ['PDF', 'Excel', 'CSV', 'JSON'],
      advancedCalculators: true,
      prioritySupport: true,
      adFree: true,
      customBranding: true,
    },
  },
];

/**
 * Check if user has access to a feature
 */
export function hasFeatureAccess(
  userTier: string,
  feature: keyof PremiumTier['limits']
): boolean {
  const tier = premiumTiers.find((t) => t.id === userTier);
  if (!tier) return false;

  const featureValue = tier.limits[feature];
  
  if (typeof featureValue === 'boolean') {
    return featureValue;
  }
  
  if (typeof featureValue === 'number') {
    return featureValue !== 0;
  }
  
  if (Array.isArray(featureValue)) {
    return featureValue.length > 0;
  }
  
  return false;
}

/**
 * Get tier by ID
 */
export function getTierById(tierId: string): PremiumTier | undefined {
  return premiumTiers.find((t) => t.id === tierId);
}

/**
 * Calculate savings for yearly plan
 */
export function calculateYearlySavings(tier: PremiumTier): number {
  const monthlyTotal = tier.price.monthly * 12;
  const yearlySavings = monthlyTotal - tier.price.yearly;
  return Math.round(yearlySavings);
}

/**
 * Premium features list
 */
export const premiumFeatures = {
  advancedCalculators: [
    'Tax Optimization Calculator',
    'Portfolio Rebalancing Calculator',
    'Retirement Planning Calculator',
    'Estate Planning Calculator',
    'Business Loan Calculator with Amortization',
    'Investment Comparison Tool',
  ],
  exportFormats: {
    pdf: 'Professional PDF reports with charts',
    excel: 'Editable Excel spreadsheets',
    csv: 'CSV for data analysis',
    json: 'JSON for API integration',
  },
  apiFeatures: [
    'REST API access',
    'Webhook support',
    'Custom integrations',
    'Bulk calculations',
    'Real-time data updates',
  ],
};

/**
 * Feature gates for free vs premium
 */
export const featureGates = {
  // Features that require Pro or higher
  requiresPro: [
    'export-excel',
    'export-csv',
    'unlimited-history',
    'advanced-charts',
    'comparison-mode',
    'ad-free',
  ],
  
  // Features that require Business tier
  requiresBusiness: [
    'api-access',
    'white-label',
    'custom-branding',
    'team-collaboration',
    'dedicated-support',
  ],
  
  // Features available to all
  freeFeatures: [
    'basic-calculators',
    'save-history',
    'export-pdf',
    'basic-charts',
    'email-support',
  ],
};
