/**
 * Pure Logic Layer for Real Estate Calculators
 * Zero UI dependencies, Zero language dependencies.
 */

export interface RentVsBuyResult {
  breakevenYear: number | null;
  finalWealthBuy: number;
  finalWealthRent: number;
  recommendation: 'buy' | 'rent';
  data: Array<{
    year: number;
    wealthBuy: number;
    wealthRent: number;
  }>;
}

export interface RentalYieldResult {
  grossYield: number;
  netYield: number;
}

/**
 * Calculates Rent vs Buy Scenario
 */
export const calculateRentVsBuy = (
  propertyPrice: number,
  downPaymentPercent: number,
  loanRate: number,
  loanTenure: number,
  appreciationRate: number,
  maintenanceCost: number,
  monthlyRent: number,
  rentIncreaseRate: number,
  investmentReturnRate: number
): RentVsBuyResult => {
  const downPayment = propertyPrice * (downPaymentPercent / 100);
  const loanAmount = propertyPrice - downPayment;
  const monthlyRate = loanRate / 12 / 100;
  const totalMonths = loanTenure * 12;
  
  // EMI Calculation
  const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) / (Math.pow(1 + monthlyRate, totalMonths) - 1);

  let rentNetWorth = downPayment; // Initial cash saved (invested)
  
  let currentPropertyValue = propertyPrice;
  let currentRent = monthlyRent;
  let currentMaintenance = maintenanceCost;
  
  const data = [];
  let breakevenYear = null;

  for (let year = 1; year <= loanTenure; year++) {
    // BUY SCENARIO
    // 1. Property Appreciates
    currentPropertyValue = currentPropertyValue * (1 + appreciationRate / 100);
    
    // 2. Pay Maintenance (Cost)
    const yearlyMaintenance = currentMaintenance * 12;
    currentMaintenance = currentMaintenance * (1 + 3/100); // Assume 3% inflation on maintenance

    // Calculate Outstanding Loan
    const monthsPassed = year * 12;
    let outstandingLoan = 0;
    if (monthsPassed < totalMonths) {
        outstandingLoan = loanAmount * (Math.pow(1 + monthlyRate, totalMonths) - Math.pow(1 + monthlyRate, monthsPassed)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    }
    
    const wealthBuy = currentPropertyValue - outstandingLoan;

    // RENT SCENARIO
    // 1. Pay Rent (Cost)
    const yearlyRent = currentRent * 12;
    currentRent = currentRent * (1 + rentIncreaseRate / 100);

    // 2. Invest the difference
    const costOfBuyingMonthly = emi + (yearlyMaintenance / 12);
    const costOfRentingMonthly = yearlyRent / 12;
    
    const monthlyDifference = costOfBuyingMonthly - costOfRentingMonthly;
    
    // Update Rent Wealth (Investment Portfolio)
    rentNetWorth = rentNetWorth * (1 + investmentReturnRate / 100);
    
    if (monthlyDifference > 0) {
      const monthlyInvRate = investmentReturnRate / 12 / 100;
      const yearlySavingsValue = monthlyDifference * ((Math.pow(1 + monthlyInvRate, 12) - 1) / monthlyInvRate);
      rentNetWorth += yearlySavingsValue;
    } else {
      const deficit = Math.abs(monthlyDifference);
      const yearlyDeficit = deficit * 12;
      rentNetWorth -= yearlyDeficit;
    }

    if (wealthBuy > rentNetWorth && breakevenYear === null) {
      breakevenYear = year;
    }

    data.push({
      year,
      wealthBuy: Math.round(wealthBuy),
      wealthRent: Math.round(rentNetWorth)
    });
  }

  return {
    breakevenYear,
    finalWealthBuy: Math.round(data[data.length - 1].wealthBuy),
    finalWealthRent: Math.round(data[data.length - 1].wealthRent),
    recommendation: data[data.length - 1].wealthBuy > data[data.length - 1].wealthRent ? 'buy' : 'rent',
    data
  };
};

/**
 * Calculates Rental Yield
 */
export const calculateRentalYield = (
  propertyValue: number,
  monthlyRent: number,
  annualMaintenance: number
): RentalYieldResult => {
  const annualRent = monthlyRent * 12;
  const netAnnualIncome = annualRent - annualMaintenance;
  
  if (propertyValue === 0) return { grossYield: 0, netYield: 0 };

  return {
    grossYield: Number(((annualRent / propertyValue) * 100).toFixed(2)),
    netYield: Number(((netAnnualIncome / propertyValue) * 100).toFixed(2))
  };
};

/**
 * Calculates Home Affordability
 */
export const calculateHomeAffordability = (
  monthlyIncome: number,
  existingEMIs: number,
  downPayment: number,
  interestRate: number,
  tenureYears: number
): number => {
  // Rule of thumb: EMI should not exceed 40-50% of income
  const maxEMI = (monthlyIncome * 0.50) - existingEMIs;
  if (maxEMI <= 0) return 0;
  
  const r = interestRate / 12 / 100;
  const n = tenureYears * 12;
  
  // P = EMI * ((1+r)^n - 1) / (r * (1+r)^n)
  const maxLoan = maxEMI * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
  
  return Math.round(maxLoan + downPayment);
};

export interface StampDutyResult {
  duty: number;
  registration: number;
  total: number;
}

/**
 * Calculates Stamp Duty
 */
export const calculateStampDuty = (
  propertyValue: number,
  state: string,
  gender: string
): StampDutyResult => {
  let rate = 5; // Default
  if (state === 'Maharashtra') rate = 6; // 5 + 1 cess
  if (state === 'Karnataka') rate = 5.6;
  if (state === 'Delhi') rate = gender === 'female' ? 4 : 6;
  
  const duty = propertyValue * (rate / 100);
  const registration = Math.min(propertyValue * 0.01, 30000); // Max 30k usually
  
  return { 
    duty: Math.round(duty), 
    registration: Math.round(registration), 
    total: Math.round(duty + registration) 
  };
};

