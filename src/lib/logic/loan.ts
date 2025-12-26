export interface LoanInput {
  loanAmount: number;
  interestRate: number;
  tenureMonths: number;
}

export interface LoanResult {
  emi: number;
  totalAmount: number;
  totalInterest: number;
  principal: number;
  schedule: AmortizationScheduleItem[];
}

export interface AmortizationScheduleItem {
  month: number;
  year: number;
  principal: number;
  interest: number;
  balance: number;
  totalPayment: number;
  cumulativeInterest: number;
}

export const calculateLoanEMI = (input: LoanInput): LoanResult => {
  const { loanAmount, interestRate, tenureMonths } = input;
  const principal = loanAmount;
  const ratePerMonth = interestRate / 12 / 100;
  const n = tenureMonths;

  const emi =
    (principal * ratePerMonth * Math.pow(1 + ratePerMonth, n)) /
    (Math.pow(1 + ratePerMonth, n) - 1);
  const totalAmount = emi * n;
  const totalInterest = totalAmount - principal;

  // Generate Amortization Schedule
  let balance = principal;
  let totalInterestPaid = 0;
  const schedule: AmortizationScheduleItem[] = [];
  const currentYear = new Date().getFullYear();

  for (let i = 1; i <= n; i++) {
    const interest = balance * ratePerMonth;
    const principalComponent = emi - interest;
    balance = balance - principalComponent;
    totalInterestPaid += interest;

    if (balance < 0) balance = 0;

    schedule.push({
      month: i,
      year: currentYear + Math.floor((i - 1) / 12),
      principal: Math.round(principalComponent),
      interest: Math.round(interest),
      balance: Math.round(balance),
      totalPayment: Math.round(emi),
      cumulativeInterest: Math.round(totalInterestPaid),
    });
  }

  return {
    emi: Math.round(emi),
    totalAmount: Math.round(totalAmount),
    totalInterest: Math.round(totalInterest),
    principal: principal,
    schedule: schedule,
  };
};

export interface HomeLoanInput extends LoanInput {
  showPrepayment: boolean;
  monthlyExtra: number;
  annualExtra: number;
}

export interface HomeLoanResult extends LoanResult {
  originalTotalInterest: number;
  originalTenureMonths: number;
  savedInterest: number;
  savedTenureMonths: number;
  revisedTenureMonths: number;
}

export const calculateHomeLoanEMI = (input: HomeLoanInput): HomeLoanResult => {
  const {
    loanAmount,
    interestRate,
    tenureMonths,
    showPrepayment,
    monthlyExtra,
    annualExtra,
  } = input;
  const principal = loanAmount;
  const ratePerMonth = interestRate / 12 / 100;

  // Standard EMI Calculation (for reference and base EMI)
  const emi =
    (principal * ratePerMonth * Math.pow(1 + ratePerMonth, tenureMonths)) /
    (Math.pow(1 + ratePerMonth, tenureMonths) - 1);
  const standardTotalAmount = emi * tenureMonths;
  const standardTotalInterest = standardTotalAmount - principal;

  if (!showPrepayment) {
    const standardResult = calculateLoanEMI({
      loanAmount,
      interestRate,
      tenureMonths,
    });
    return {
      ...standardResult,
      originalTotalInterest: standardResult.totalInterest,
      originalTenureMonths: tenureMonths,
      savedInterest: 0,
      savedTenureMonths: 0,
      revisedTenureMonths: tenureMonths,
    };
  }

  // Calculation with Prepayments
  let balance = principal;
  let totalInterestPaid = 0;
  let months = 0;
  const schedule: AmortizationScheduleItem[] = [];
  const currentYear = new Date().getFullYear();

  while (balance > 0 && months < 360) { // Cap at 30 years to prevent infinite loops
    months++;
    const interest = balance * ratePerMonth;
    let principalComponent = emi - interest;
    
    // Add extra payments
    let extraPayment = 0;
    if (monthlyExtra > 0) extraPayment += monthlyExtra;
    if (annualExtra > 0 && months % 12 === 0) extraPayment += annualExtra;

    // Adjust if last payment
    if (principalComponent + extraPayment > balance) {
        principalComponent = balance;
        extraPayment = 0; // Absorbed into principalComponent
    }

    balance = balance - principalComponent - extraPayment;
    totalInterestPaid += interest;

    if (balance < 0) balance = 0;

    schedule.push({
      month: months,
      year: currentYear + Math.floor((months - 1) / 12),
      principal: Math.round(principalComponent + extraPayment),
      interest: Math.round(interest),
      balance: Math.round(balance),
      totalPayment: Math.round(emi + extraPayment),
      cumulativeInterest: Math.round(totalInterestPaid),
    });
  }

  return {
    emi: Math.round(emi),
    totalAmount: Math.round(principal + totalInterestPaid),
    totalInterest: Math.round(totalInterestPaid),
    principal: principal,
    schedule: schedule,
    originalTotalInterest: Math.round(standardTotalInterest),
    originalTenureMonths: tenureMonths,
    savedInterest: Math.round(standardTotalInterest - totalInterestPaid),
    savedTenureMonths: tenureMonths - months,
    revisedTenureMonths: months,
  };
};

export const calculateRemainingBalance = (
  principal: number,
  annualInterestRate: number,
  tenureMonths: number,
  paidMonths: number
): number => {
  const r = annualInterestRate / 12 / 100;
  const n = tenureMonths;
  const p = paidMonths;

  if (r === 0) {
      return principal * (1 - p / n);
  }

  const numerator = Math.pow(1 + r, n) - Math.pow(1 + r, p);
  const denominator = Math.pow(1 + r, n) - 1;
  
  return Math.round(principal * (numerator / denominator));
};

export interface EligibilityInput {
    monthlyIncome: number;
    existingEMI: number;
    interestRate: number;
    tenureMonths: number;
    foir?: number; // Fixed Obligation to Income Ratio, default 0.5
}

export interface EligibilityResult {
    eligibleAmount: number;
    maxLoanAmount: number;
    affordableEMI: number;
    disposableIncome: number;
    dtiRatio: number;
}

export const calculateLoanEligibility = (input: EligibilityInput): EligibilityResult => {
    const { monthlyIncome, existingEMI, interestRate, tenureMonths, foir = 0.5 } = input;
    
    const availableIncome = (monthlyIncome * foir) - existingEMI;
    
    if (availableIncome <= 0) {
        return {
            eligibleAmount: 0,
            maxLoanAmount: 0,
            affordableEMI: 0,
            disposableIncome: monthlyIncome - existingEMI,
            dtiRatio: Math.round((existingEMI / monthlyIncome) * 100 * 100) / 100
        };
    }

    const r = interestRate / 12 / 100;
    const n = tenureMonths;

    // P = EMI * [(1+r)^n - 1] / [r * (1+r)^n]
    const maxLoan = availableIncome * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
    const dtiRatio = ((existingEMI + availableIncome) / monthlyIncome) * 100;

    return {
        eligibleAmount: Math.round(maxLoan),
        maxLoanAmount: Math.round(maxLoan),
        affordableEMI: Math.round(availableIncome),
        disposableIncome: Math.round(monthlyIncome - existingEMI - availableIncome),
        dtiRatio: Math.round(dtiRatio * 100) / 100
    };
}

export interface FlatVsReducingInput {
  loanAmount: number;
  flatRate: number;
  tenureYears: number;
}

export interface FlatVsReducingResult {
  emiFlat: number;
  totalInterestFlat: number;
  effectiveRate: number;
  emiReducing: number;
  totalInterestReducing: number;
  difference: number;
}

export const calculateFlatVsReducing = (input: FlatVsReducingInput): FlatVsReducingResult => {
  const { loanAmount, flatRate, tenureYears } = input;
  
  // Flat Rate Calculation
  const totalInterestFlat = loanAmount * (flatRate / 100) * tenureYears;
  const totalAmountFlat = loanAmount + totalInterestFlat;
  const emiFlat = totalAmountFlat / (tenureYears * 12);

  // Calculate Effective Reducing Rate (IRR)
  let rate = flatRate / 12 / 100; // Initial guess
  const n = tenureYears * 12;
  const payment = emiFlat;
  const pv = loanAmount;

  for (let i = 0; i < 20; i++) {
    const f = payment * (1 - Math.pow(1 + rate, -n)) / rate - pv;
    const df = payment * ((Math.pow(1 + rate, -n - 1) * n * rate - (1 - Math.pow(1 + rate, -n))) / (rate * rate));
    const newRate = rate - f / df;
    if (Math.abs(newRate - rate) < 0.0000001) {
      rate = newRate;
      break;
    }
    rate = newRate;
  }

  const effectiveRate = rate * 12 * 100;

  // Reducing Balance Calculation
  const rReducing = flatRate / 12 / 100;
  const emiReducing = loanAmount * rReducing * Math.pow(1 + rReducing, n) / (Math.pow(1 + rReducing, n) - 1);
  const totalAmountReducing = emiReducing * n;
  const totalInterestReducing = totalAmountReducing - loanAmount;

  return {
    emiFlat: Math.round(emiFlat),
    totalInterestFlat: Math.round(totalInterestFlat),
    effectiveRate: Number(effectiveRate.toFixed(2)),
    emiReducing: Math.round(emiReducing),
    totalInterestReducing: Math.round(totalInterestReducing),
    difference: Math.round(totalInterestFlat - totalInterestReducing)
  };
};

export interface SimpleInterestInput {
  principal: number;
  rate: number;
  timeYears: number;
}

export interface SimpleInterestResult {
  interest: number;
  totalAmount: number;
  principal: number;
  schedule: {
    year: number;
    principal: number;
    interest: number;
    totalInterest: number;
    balance: number;
  }[];
}

export const calculateSimpleInterest = (input: SimpleInterestInput): SimpleInterestResult => {
  const { principal, rate, timeYears } = input;
  const interest = (principal * rate * timeYears) / 100;
  const totalAmount = principal + interest;

  const schedule = [];
  let currentYear = new Date().getFullYear();
  let accumulatedInterest = 0;
  
  for (let i = 1; i <= timeYears; i++) {
    const yearlyInterest = (principal * rate) / 100;
    accumulatedInterest += yearlyInterest;
    
    schedule.push({
      year: currentYear + i - 1,
      principal: principal,
      interest: Math.round(yearlyInterest),
      totalInterest: Math.round(accumulatedInterest),
      balance: Math.round(principal + accumulatedInterest)
    });
  }

  return {
    interest: Math.round(interest),
    totalAmount: Math.round(totalAmount),
    principal: principal,
    schedule: schedule
  };
};

export interface CompoundInterestInput {
  principal: number;
  rate: number;
  timeYears: number;
  frequency: number; // 12 for monthly, 4 for quarterly, 1 for yearly
}

export interface CompoundInterestResult {
  interest: number;
  totalAmount: number;
  principal: number;
  schedule: {
    year: number;
    principal: number;
    interest: number;
    balance: number;
  }[];
}

export const calculateCompoundInterest = (input: CompoundInterestInput): CompoundInterestResult => {
  const { principal, rate, timeYears, frequency } = input;
  const r = rate / 100;
  const n = frequency;
  const t = timeYears;
  
  const amount = principal * Math.pow((1 + r/n), n*t);
  const interest = amount - principal;

  const schedule = [];
  let currentYear = new Date().getFullYear();
  let currentPrincipal = principal;
  
  for (let i = 1; i <= t; i++) {
    const yearEndAmount = principal * Math.pow((1 + r/n), n*i);
    const yearInterest = yearEndAmount - currentPrincipal;
    
    schedule.push({
      year: currentYear + i - 1,
      principal: Math.round(currentPrincipal),
      interest: Math.round(yearInterest),
      balance: Math.round(yearEndAmount)
    });
    currentPrincipal = yearEndAmount;
  }

  return {
    interest: Math.round(interest),
    totalAmount: Math.round(amount),
    principal: principal,
    schedule: schedule
  };
};

export interface BalanceTransferInput {
  outstandingPrincipal: number;
  currentRate: number;
  remainingTenureMonths: number;
  newRate: number;
  processingFees: number;
}

export interface BalanceTransferResult {
  currentEMI: number;
  newEMI: number;
  totalInterestCurrent: number;
  totalInterestNew: number;
  processingFees: number;
  netSavings: number;
  isBeneficial: boolean;
  breakEvenMonths: number;
}

export const calculateBalanceTransfer = (input: BalanceTransferInput): BalanceTransferResult => {
  const { outstandingPrincipal, currentRate, remainingTenureMonths, newRate, processingFees } = input;

  // Current Scenario
  const r1 = currentRate / 12 / 100;
  const emi1 = outstandingPrincipal * r1 * Math.pow(1 + r1, remainingTenureMonths) / (Math.pow(1 + r1, remainingTenureMonths) - 1);
  const totalPayment1 = emi1 * remainingTenureMonths;
  const totalInterest1 = totalPayment1 - outstandingPrincipal;

  // New Scenario
  const r2 = newRate / 12 / 100;
  const emi2 = outstandingPrincipal * r2 * Math.pow(1 + r2, remainingTenureMonths) / (Math.pow(1 + r2, remainingTenureMonths) - 1);
  const totalPayment2 = emi2 * remainingTenureMonths;
  const totalInterest2 = totalPayment2 - outstandingPrincipal;
  
  const totalCostNew = totalInterest2 + processingFees;
  const savings = totalInterest1 - totalCostNew;
  const monthlySavings = emi1 - emi2;
  const breakEvenMonths = monthlySavings > 0 ? Math.ceil(processingFees / monthlySavings) : 0;

  return {
    currentEMI: Math.round(emi1),
    newEMI: Math.round(emi2),
    totalInterestCurrent: Math.round(totalInterest1),
    totalInterestNew: Math.round(totalInterest2),
    processingFees: processingFees,
    netSavings: Math.round(savings),
    isBeneficial: savings > 0,
    breakEvenMonths: breakEvenMonths
  };
};

export interface TopUpLoanInput {
  existingLoan: number;
  existingEMI: number;
  topUpAmount: number;
  interestRate: number;
  tenureMonths: number;
}

export interface TopUpLoanResult {
  newEMI: number;
  additionalEMI: number;
  totalAmount: number;
  totalInterest: number;
  topUpAmount: number;
  existingEMI: number;
}

export const calculateTopUpLoan = (input: TopUpLoanInput): TopUpLoanResult => {
  const { existingLoan, existingEMI, topUpAmount, interestRate, tenureMonths } = input;
  
  const totalLoanAmount = existingLoan + topUpAmount;
  const ratePerMonth = interestRate / 12 / 100;
  const n = tenureMonths;

  // Calculate new EMI for combined loan
  const newEMI = totalLoanAmount * ratePerMonth * Math.pow(1 + ratePerMonth, n) / (Math.pow(1 + ratePerMonth, n) - 1);
  
  const totalAmount = newEMI * n;
  const totalInterest = totalAmount - totalLoanAmount;
  const additionalEMI = newEMI - existingEMI;

  return {
    newEMI: Math.round(newEMI),
    additionalEMI: Math.round(additionalEMI),
    totalAmount: Math.round(totalAmount),
    totalInterest: Math.round(totalInterest),
    topUpAmount,
    existingEMI
  };
};

export interface StepUpEMIInput {
  loanAmount: number;
  interestRate: number;
  tenureYears: number;
  annualIncreasePercent: number;
}

export interface StepUpEMIResult {
  initialEMI: number;
  finalEMI: number;
  standardEMI: number;
  totalInterest: number;
  totalPayment: number;
  schedule: {
    year: number;
    emi: number;
    principalPaid: number;
    interestPaid: number;
    balance: number;
  }[];
}

export const calculateStepUpEMI = (input: StepUpEMIInput): StepUpEMIResult => {
  const { loanAmount, interestRate, tenureYears, annualIncreasePercent } = input;
  const r = interestRate / 12 / 100;
  const n = tenureYears * 12;

  // Standard EMI for reference
  const standardEMI = loanAmount * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);

  // Calculate Start EMI using binary search
  let low = 0;
  let high = standardEMI * 2;
  let startEMI = standardEMI;
  
  for(let iter=0; iter<50; iter++) {
    startEMI = (low + high) / 2;
    let balance = loanAmount;
    let currentEMI = startEMI;
    
    for (let m = 1; m <= n; m++) {
      const interest = balance * r;
      const principal = currentEMI - interest;
      balance -= principal;
      
      if (m % 12 === 0) {
        currentEMI *= (1 + annualIncreasePercent / 100);
      }
    }
    
    if (Math.abs(balance) < 10) break;
    if (balance > 0) {
      low = startEMI;
    } else {
      high = startEMI;
    }
  }

  // Generate Schedule
  let balance = loanAmount;
  let currentEMI = startEMI;
  let totalInterest = 0;
  let totalPayment = 0;
  const schedule = [];
  
  for (let y = 1; y <= tenureYears; y++) {
    let yearPrincipal = 0;
    let yearInterest = 0;
    let yearEMI = currentEMI;
    
    for (let m = 1; m <= 12; m++) {
      const interest = balance * r;
      const principal = currentEMI - interest;
      balance -= principal;
      yearPrincipal += principal;
      yearInterest += interest;
      totalInterest += interest;
      totalPayment += currentEMI;
    }
    
    schedule.push({
      year: y,
      emi: Math.round(yearEMI),
      principalPaid: Math.round(yearPrincipal),
      interestPaid: Math.round(yearInterest),
      balance: Math.round(balance > 0 ? balance : 0)
    });
    
    currentEMI *= (1 + annualIncreasePercent / 100);
  }

  return {
    initialEMI: Math.round(startEMI),
    finalEMI: Math.round(schedule[schedule.length - 1].emi),
    standardEMI: Math.round(standardEMI),
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(totalPayment),
    schedule
  };
}

export interface BalloonPaymentInput {
  loanAmount: number;
  interestRate: number;
  tenureYears: number;
  balloonPercent: number;
}

export interface BalloonPaymentResult {
  monthlyEMI: number;
  balloonAmount: number;
  totalInterest: number;
  totalPayment: number;
  schedule: {
    year: number;
    balance: number;
    interestPaid: number;
    principalPaid: number;
  }[];
}

export const calculateBalloonPayment = (input: BalloonPaymentInput): BalloonPaymentResult => {
  const { loanAmount, interestRate, tenureYears, balloonPercent } = input;
  const r = interestRate / 12 / 100;
  const n = tenureYears * 12;
  
  const balloonAmount = loanAmount * (balloonPercent / 100);
  
  // PV of Balloon
  const pvBalloon = balloonAmount / Math.pow(1 + r, n);
  
  // Loan to be amortized by EMI
  const loanToAmortize = loanAmount - pvBalloon;
  
  // Calculate EMI
  const emi = loanToAmortize * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  
  // Schedule
  let balance = loanAmount;
  let totalInterest = 0;
  const schedule = [];
  
  for (let y = 1; y <= tenureYears; y++) {
    let yearPrincipal = 0;
    let yearInterest = 0;
    
    for (let m = 1; m <= 12; m++) {
      const interest = balance * r;
      let principal = emi - interest;
      
      balance -= principal;
      yearPrincipal += principal;
      yearInterest += interest;
      totalInterest += interest;
    }
    
    schedule.push({
      year: y,
      balance: Math.round(balance),
      interestPaid: Math.round(yearInterest),
      principalPaid: Math.round(yearPrincipal)
    });
  }
  
  const totalPayment = (emi * n) + balloonAmount;
  
  return {
    monthlyEMI: Math.round(emi),
    balloonAmount: Math.round(balloonAmount),
    totalInterest: Math.round(totalPayment - loanAmount),
    totalPayment: Math.round(totalPayment),
    schedule
  };
}

export interface OverdraftInterestInput {
  totalLimit: number;
  limitUsed: number;
  daysUsed: number;
  interestRate: number;
}

export interface OverdraftInterestResult {
  interestAmount: number;
  totalRepayment: number;
  availableLimit: number;
}

export const calculateOverdraftInterest = (input: OverdraftInterestInput): OverdraftInterestResult => {
  const { totalLimit, limitUsed, daysUsed, interestRate } = input;
  const dailyRate = interestRate / 100 / 365;
  const interest = limitUsed * dailyRate * daysUsed;
  
  return {
    interestAmount: Math.round(interest),
    totalRepayment: Math.round(limitUsed + interest),
    availableLimit: totalLimit - limitUsed
  };
}

export interface LoanSettlementInput {
  outstandingAmount: number;
  settlementOffer: number;
}

export interface LoanSettlementResult {
  savings: number;
  waiverPercentage: number;
  creditScoreImpact: string;
}

export const calculateLoanSettlement = (input: LoanSettlementInput): LoanSettlementResult => {
  const { outstandingAmount, settlementOffer } = input;
  const savings = outstandingAmount - settlementOffer;
  const percentage = (savings / outstandingAmount) * 100;
  const creditScoreImpact = percentage > 50 ? "High Negative" : "Moderate Negative";
  
  return {
    savings: Math.round(savings),
    waiverPercentage: Number(percentage.toFixed(2)),
    creditScoreImpact: creditScoreImpact
  };
}
