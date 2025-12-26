/**
 * Pure Logic Layer for Investment Calculators
 * Zero UI dependencies, Zero language dependencies.
 */

export interface SIPResult {
  totalInvested: number;
  totalValue: number;
  totalReturns: number;
  schedule: Array<{
    month: number;
    year: number;
    invested: number;
    value: number;
    returns: number;
  }>;
}

/**
 * Calculates SIP Returns with optional Step-Up
 * @param monthlyInvestment Initial monthly investment amount
 * @param expectedReturnAnnual Annual expected return rate (percentage)
 * @param years Investment duration in years
 * @param stepUpRateAnnual Annual step-up percentage (default 0)
 * @returns SIPResult object containing totals and schedule
 */
export const calculateSIP = (
  monthlyInvestment: number,
  expectedReturnAnnual: number,
  years: number,
  stepUpRateAnnual: number = 0
): SIPResult => {
  let P = monthlyInvestment;
  const r = expectedReturnAnnual / 100 / 12;
  const n = years * 12;
  const stepUp = stepUpRateAnnual / 100;

  let currentBalance = 0;
  let totalInvested = 0;
  let schedule = [];
  let currentYear = new Date().getFullYear();

  for (let i = 1; i <= n; i++) {
    // Add investment
    totalInvested += P;
    currentBalance += P;
    
    // Add interest
    currentBalance += currentBalance * r;

    // Record schedule data
    schedule.push({
      month: i,
      year: currentYear + Math.floor((i - 1) / 12),
      invested: Math.round(totalInvested),
      value: Math.round(currentBalance),
      returns: Math.round(currentBalance - totalInvested)
    });

    // Step Up every year (every 12th month, increase P for next month)
    if (i % 12 === 0 && i < n) {
      P = P * (1 + stepUp);
    }
  }

  return {
    totalInvested: Math.round(totalInvested),
    totalValue: Math.round(currentBalance),
    totalReturns: Math.round(currentBalance - totalInvested),
    schedule
  };
};

/**
 * Adjusts a value for inflation
 * @param value Future value
 * @param inflationRate Annual inflation rate
 * @param years Number of years
 * @returns Present value adjusted for inflation
 */
export const adjustForInflation = (value: number, inflationRate: number, years: number): number => {
  return Math.round(value / Math.pow(1 + inflationRate / 100, years));
};

/**
 * Calculates Long Term Capital Gains Tax
 * @param totalReturns Total profit
 * @param taxRate Tax rate percentage (usually 10% or 12.5% for equity > 1L)
 * @param exemptionLimit Exemption limit (e.g., 100000 or 125000)
 * @returns Tax amount
 */
export const calculateLTCG = (totalReturns: number, taxRate: number = 12.5, exemptionLimit: number = 125000): number => {
  if (totalReturns <= exemptionLimit) return 0;
  return Math.round((totalReturns - exemptionLimit) * (taxRate / 100));
};

export interface SWPResult {
  finalBalance: number;
  totalWithdrawn: number;
  totalInterest: number;
  schedule: Array<{
    year: number;
    balance: number;
    withdrawn: number;
    interestEarned: number;
  }>;
}

/**
 * Calculates Systematic Withdrawal Plan (SWP)
 * @param totalInvestment Initial lump sum investment
 * @param withdrawalPerMonth Monthly withdrawal amount
 * @param expectedReturnAnnual Annual expected return rate
 * @param years Duration in years
 * @returns SWPResult object
 */
export const calculateSWP = (
  totalInvestment: number,
  withdrawalPerMonth: number,
  expectedReturnAnnual: number,
  years: number
): SWPResult => {
  let balance = totalInvestment;
  let totalWithdrawn = 0;
  const monthlyRate = expectedReturnAnnual / 100 / 12;
  const months = years * 12;
  const schedule = [];
  let currentYear = new Date().getFullYear();

  for (let i = 1; i <= months; i++) {
    // 1. Add returns for the month
    const interest = balance * monthlyRate;
    balance += interest;
    
    // 2. Subtract withdrawal
    let actualWithdrawal = withdrawalPerMonth;
    if (balance < withdrawalPerMonth) {
      actualWithdrawal = balance;
      balance = 0;
    } else {
      balance -= withdrawalPerMonth;
    }
    
    totalWithdrawn += actualWithdrawal;

    if (i % 12 === 0 || balance === 0) {
      schedule.push({
        year: currentYear + (i / 12),
        balance: Math.round(balance),
        withdrawn: Math.round(totalWithdrawn),
        interestEarned: Math.round(totalWithdrawn + balance - totalInvestment)
      });
    }

    if (balance === 0) break;
  }

  return {
    finalBalance: Math.round(balance),
    totalWithdrawn: Math.round(totalWithdrawn),
    totalInterest: Math.round(totalWithdrawn + balance - totalInvestment),
    schedule
  };
};
