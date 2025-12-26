/**
 * Pure Logic Layer for Tax Calculators
 * Zero UI dependencies, Zero language dependencies.
 */

export interface IncomeTaxResult {
  tax: number;
  cess: number;
  total: number;
  inHand: number;
  breakdown: {
    baseTax: number;
    surcharge: number;
    cess: number;
  };
}

export interface GSTResult {
  netAmount: number;
  gstAmount: number;
  totalAmount: number;
  cgst: number;
  sgst: number;
}

export interface HRAResult {
  exemptHRA: number;
  taxableHRA: number;
  condition1: number; // Actual HRA
  condition2: number; // Rent - 10% Salary
  condition3: number; // 50% or 40% Salary
}

export interface AdvancedTaxResult {
  oldRegime: {
    taxableIncome: number;
    tax: number;
    cess: number;
    total: number;
  };
  newRegime: {
    taxableIncome: number;
    tax: number;
    cess: number;
    total: number;
  };
  recommendation: 'old' | 'new';
  savings: number;
}

/**
 * Calculates Basic Income Tax (Old vs New Regime)
 */
export const calculateIncomeTax = (
  income: number,
  regime: 'old' | 'new',
  age: number = 30 // For Old Regime slabs
): IncomeTaxResult => {
  let tax = 0;
  
  if (regime === 'new') {
    // New Regime Slabs (FY 2024-25)
    if (income <= 300000) tax = 0;
    else if (income <= 700000) {
        // Rebate u/s 87A applies if income <= 7L, so effectively 0 tax
        // But for calculation steps:
        if (income <= 600000) tax = (income - 300000) * 0.05;
        else tax = 15000 + (income - 600000) * 0.10;
        
        // Apply Rebate
        if (income <= 700000) tax = 0;
    }
    else if (income <= 900000) tax = 15000 + (income - 600000) * 0.10;
    else if (income <= 1200000) tax = 45000 + (income - 900000) * 0.15;
    else if (income <= 1500000) tax = 90000 + (income - 1200000) * 0.20;
    else tax = 150000 + (income - 1500000) * 0.30;
  } else {
    // Old Regime Slabs
    let basicExemption = 250000;
    if (age >= 60) basicExemption = 300000;
    if (age >= 80) basicExemption = 500000;

    if (income <= basicExemption) tax = 0;
    else if (income <= 500000) {
        tax = (income - basicExemption) * 0.05;
        // Rebate u/s 87A for Old Regime (Income <= 5L)
        if (income <= 500000) tax = 0;
    }
    else if (income <= 1000000) tax = 12500 + (income - 500000) * 0.20; // Assuming <60 age for slab calculation simplicity here, usually 12500 is for 2.5L base
    else tax = 112500 + (income - 1000000) * 0.30;
    
    // Adjust for Senior Citizens if needed, but keeping simple for now matching existing logic
    if (age >= 60 && age < 80 && income > 300000 && income <= 500000) {
        tax = (income - 300000) * 0.05;
        if (income <= 500000) tax = 0;
    }
  }

  const cess = tax * 0.04;
  const total = tax + cess;

  return {
    tax: Math.round(tax),
    cess: Math.round(cess),
    total: Math.round(total),
    inHand: Math.round(income - total),
    breakdown: {
      baseTax: Math.round(tax),
      surcharge: 0, // Simplified
      cess: Math.round(cess)
    }
  };
};

/**
 * Calculates GST
 */
export const calculateGST = (
  amount: number,
  rate: number,
  type: 'inclusive' | 'exclusive'
): GSTResult => {
  let netAmount = 0;
  let gstAmount = 0;
  let totalAmount = 0;

  if (type === 'exclusive') {
    gstAmount = (amount * rate) / 100;
    totalAmount = amount + gstAmount;
    netAmount = amount;
  } else {
    gstAmount = amount - (amount * (100 / (100 + rate)));
    netAmount = amount - gstAmount;
    totalAmount = amount;
  }

  return {
    netAmount: Number(netAmount.toFixed(2)),
    gstAmount: Number(gstAmount.toFixed(2)),
    totalAmount: Number(totalAmount.toFixed(2)),
    cgst: Number((gstAmount / 2).toFixed(2)),
    sgst: Number((gstAmount / 2).toFixed(2))
  };
};

/**
 * Calculates HRA Exemption
 */
export const calculateHRAExemption = (
  basicSalary: number,
  da: number,
  hraReceived: number,
  rentPaid: number,
  isMetro: boolean
): HRAResult => {
  const salary = basicSalary + da;
  
  // 1. Actual HRA Received
  const condition1 = hraReceived;
  
  // 2. Rent paid in excess of 10% of salary
  const condition2 = Math.max(0, rentPaid - (0.10 * salary));
  
  // 3. 50% of salary (Metro) or 40% of salary (Non-Metro)
  const percentage = isMetro ? 0.50 : 0.40;
  const condition3 = percentage * salary;
  
  const exemptHRA = Math.min(condition1, condition2, condition3);
  const taxableHRA = Math.max(0, hraReceived - exemptHRA);

  return {
    exemptHRA: Math.round(exemptHRA),
    taxableHRA: Math.round(taxableHRA),
    condition1: Math.round(condition1),
    condition2: Math.round(condition2),
    condition3: Math.round(condition3)
  };
};

/**
 * Advanced Income Tax Calculation (Old vs New Comparison)
 */
export const calculateAdvancedTax = (
  grossIncome: number,
  deductions80C: number,
  deductions80D: number,
  deductions80CCD: number,
  hraExemption: number,
  homeLoanInterest: number,
  otherDeductions: number
): AdvancedTaxResult => {
  const STANDARD_DEDUCTION = 50000;
  
  // --- Old Regime ---
  const oldRegimeDeductions = Math.min(deductions80C, 150000) + 
                              deductions80D + 
                              Math.min(deductions80CCD, 50000) + 
                              hraExemption + 
                              Math.min(homeLoanInterest, 200000) + 
                              otherDeductions + 
                              STANDARD_DEDUCTION;

  const taxableIncomeOld = Math.max(0, grossIncome - oldRegimeDeductions);
  const oldTaxResult = calculateIncomeTax(taxableIncomeOld, 'old');

  // --- New Regime ---
  // Standard Deduction allowed in New Regime from FY 23-24
  const taxableIncomeNew = Math.max(0, grossIncome - STANDARD_DEDUCTION);
  const newTaxResult = calculateIncomeTax(taxableIncomeNew, 'new');

  return {
    oldRegime: {
      taxableIncome: taxableIncomeOld,
      tax: oldTaxResult.tax,
      cess: oldTaxResult.cess,
      total: oldTaxResult.total
    },
    newRegime: {
      taxableIncome: taxableIncomeNew,
      tax: newTaxResult.tax,
      cess: newTaxResult.cess,
      total: newTaxResult.total
    },
    recommendation: oldTaxResult.total < newTaxResult.total ? 'old' : 'new',
    savings: Math.abs(oldTaxResult.total - newTaxResult.total)
  };
};

// Cost Inflation Index (CII) Data
export const CII_DATA: Record<string, number> = {
  '2001-02': 100, '2002-03': 105, '2003-04': 109, '2004-05': 113, '2005-06': 117,
  '2006-07': 122, '2007-08': 129, '2008-09': 137, '2009-10': 148, '2010-11': 167,
  '2011-12': 184, '2012-13': 200, '2013-14': 220, '2014-15': 240, '2015-16': 254,
  '2016-17': 264, '2017-18': 272, '2018-19': 280, '2019-20': 289, '2020-21': 301,
  '2021-22': 317, '2022-23': 331, '2023-24': 348, '2024-25': 363 // Estimated/Provisional
}

export interface CapitalGainsResult {
  gain: number;
  tax: number;
  taxType: string;
  indexedCost: number;
  remarks: string;
}

export interface CapitalGainsInput {
  salePrice: number;
  purchasePrice: number;
  assetType: 'equity' | 'property' | 'debt' | 'gold';
  purchaseYear: string;
  saleYear: string;
}

export const calculateCapitalGains = (input: CapitalGainsInput): CapitalGainsResult => {
  const { salePrice, purchasePrice, assetType, purchaseYear, saleYear } = input;
  const ciiPurchase = CII_DATA[purchaseYear] || 100
  const ciiSale = CII_DATA[saleYear] || 348
  
  let indexedCost = purchasePrice
  let gain = 0
  let tax = 0
  let taxType = ''
  let remarks = ''

  if (assetType === 'property') {
    if (purchaseYear === saleYear) {
      // STCG
      taxType = 'STCG (Short Term)'
      gain = salePrice - purchasePrice
      tax = gain * 0.30 // Slab rate assumption
      remarks = 'Taxed at your income slab rate (assumed 30% here)'
      indexedCost = purchasePrice
    } else {
      // LTCG
      taxType = 'LTCG (Long Term)'
      indexedCost = purchasePrice * (ciiSale / ciiPurchase)
      gain = salePrice - indexedCost
      tax = gain * 0.20 // 20% with indexation
      remarks = '20% tax on indexed gain'
    }
  } else if (assetType === 'equity') {
    // No indexation for equity
    indexedCost = purchasePrice
    gain = salePrice - purchasePrice
    
    if (purchaseYear === saleYear) {
      taxType = 'STCG'
      tax = gain * 0.15
      remarks = '15% flat rate'
    } else {
      taxType = 'LTCG'
      const taxableGain = Math.max(0, gain - 100000)
      tax = taxableGain * 0.10
      remarks = '10% on gains above ?1 Lakh'
    }
  } else if (assetType === 'gold') {
     if (purchaseYear === saleYear) {
      taxType = 'STCG'
      gain = salePrice - purchasePrice
      tax = gain * 0.30
      remarks = 'Taxed at slab rate'
      indexedCost = purchasePrice
    } else {
      taxType = 'LTCG'
      indexedCost = purchasePrice * (ciiSale / ciiPurchase)
      gain = salePrice - indexedCost
      tax = gain * 0.20
      remarks = '20% with indexation'
    }
  } else if (assetType === 'debt') {
     const startYear = parseInt(purchaseYear.split('-')[0])
     if (startYear >= 2023) {
       taxType = 'STCG (New Rules)'
       gain = salePrice - purchasePrice
       tax = gain * 0.30
       remarks = 'Taxed at slab rate (No Indexation)'
       indexedCost = purchasePrice
     } else {
       if (purchaseYear === saleYear) {
          taxType = 'STCG'
          gain = salePrice - purchasePrice
          tax = gain * 0.30
          indexedCost = purchasePrice
       } else {
          taxType = 'LTCG'
          indexedCost = purchasePrice * (ciiSale / ciiPurchase)
          gain = salePrice - indexedCost
          tax = gain * 0.20
          remarks = '20% with indexation'
       }
     }
  }
  
  return { gain, tax, taxType, indexedCost, remarks }
}

export const calculate80C = (epf: number, ppf: number, elss: number, lic: number, principal: number) => {
  const total = epf + ppf + elss + lic + principal
  const deductible = Math.min(total, 150000)
  return { total, deductible }
}

export const calculate80D = (selfPremium: number, parentsPremium: number, selfAge: number, parentsAge: number) => {
  const selfLimit = selfAge >= 60 ? 50000 : 25000
  const parentsLimit = parentsAge >= 60 ? 50000 : 25000
  
  const selfDeduction = Math.min(selfPremium, selfLimit)
  const parentsDeduction = Math.min(parentsPremium, parentsLimit)
  
  return selfDeduction + parentsDeduction
}

export const calculate80G = (donationAmount: number, category: number) => {
  return donationAmount * (category / 100)
}

export const calculate80TTA = (interestIncome: number, age: number) => {
  const limit = age >= 60 ? 50000 : 10000 // 80TTB for seniors (50k), 80TTA for others (10k)
  const section = age >= 60 ? '80TTB' : '80TTA'
  const deduction = Math.min(interestIncome, limit)
  return { deduction, section }
}

export const calculateCapitalGainsIndexation = (purchasePrice: number, salePrice: number, purchaseYearCII: number, saleYearCII: number) => {
  const indexedCost = purchasePrice * (saleYearCII / purchaseYearCII)
  const capitalGain = salePrice - indexedCost
  const tax = capitalGain > 0 ? capitalGain * 0.20 : 0 // 20% LTCG
  return { indexedCost, capitalGain, tax }
}

export const calculateCryptoTax = (profit: number, tdsDeducted: number) => {
  const tax = profit * 0.30
  const cess = tax * 0.04
  const totalTax = tax + cess
  const payable = totalTax - tdsDeducted
  return { totalTax, payable }
}

export const calculateLotteryTax = (winnings: number) => {
  const tax = winnings * 0.30
  const cess = tax * 0.04
  const totalTax = tax + cess
  const inHand = winnings - totalTax
  return { totalTax, inHand }
}

export const calculateGiftTax = (giftValue: number, relationship: number) => {
  if (relationship === 0) return 0 // Exempt
  if (giftValue <= 50000) return 0 // Exempt
  
  // If > 50k from non-relative, fully taxable
  // Assuming 30% slab for simplicity, or user input slab
  const tax = giftValue * 0.30 // Max slab assumption
  return tax
}

export const calculateRentalIncomeTax = (annualRent: number, municipalTaxes: number, interestPaid: number) => {
  const nav = annualRent - municipalTaxes // Net Annual Value
  const standardDeduction = nav * 0.30 // 30% of NAV
  const taxable = nav - standardDeduction - interestPaid
  return Math.max(0, taxable)
}

export const calculatePresumptiveTax = (turnover: number, profession: number) => {
  let minProfit = 0
  if (profession === 0) {
    // Business: 6% for digital, 8% for cash. Let's avg 8% for safety or 6%
    minProfit = turnover * 0.08 
  } else {
    // Profession: 50%
    minProfit = turnover * 0.50
  }
  return minProfit
}

export const calculateAdvanceTaxInstallments = (estimatedTax: number) => {
  return {
    jun: estimatedTax * 0.15,
    sep: estimatedTax * 0.45,
    dec: estimatedTax * 0.75,
    mar: estimatedTax * 1.00
  }
}

export const calculateSurcharge = (income: number, tax: number) => {
  let rate = 0
  if (income > 5000000 && income <= 10000000) rate = 10
  else if (income > 10000000 && income <= 20000000) rate = 15
  else if (income > 20000000 && income <= 50000000) rate = 25
  else if (income > 50000000) rate = 37 // 25 under new regime usually
  
  const surchargeAmount = tax * (rate / 100)
  return { rate, surchargeAmount }
}

export const calculateMarginalRelief = (income: number) => {
  // Simplified logic for 50L threshold
  if (income <= 5000000) return 0
  
  // Tax on actual income
  // Assuming 30% slab for simplicity of relief demo
  const taxOnIncome = (income - 1000000) * 0.30 + 112500 // Old regime approx
  const surcharge = taxOnIncome * 0.10
  const totalTax = taxOnIncome + surcharge
  
  // Tax on 50L
  const taxOn50L = (5000000 - 1000000) * 0.30 + 112500
  // No surcharge on 50L
  
  const extraIncome = income - 5000000
  const extraTax = totalTax - taxOn50L
  
  if (extraTax > extraIncome) {
    return extraTax - extraIncome
  }
  return 0
}

export const calculate87ARebate = (income: number, regime: number) => {
  const limit = regime === 1 ? 700000 : 500000
  const maxRebate = regime === 1 ? 25000 : 12500
  
  if (income <= limit) {
    return maxRebate // Or actual tax, whichever is lower. Displaying eligibility.
  }
  return 0
}

export const calculateAgriculturalIncomeImpact = (nonAgriIncome: number, agriIncome: number) => {
  const totalIncome = nonAgriIncome + agriIncome
  return totalIncome
}


export const calculatePF = (basic: number, years: number) => {
  const monthly = basic * 0.12 * 2 // Employee + Employer
  const total = monthly * 12 * years
  const interest = total * 0.30 // Approx 8.15% annual
  const maturity = total + interest
  return { monthly: Math.round(monthly), total: Math.round(total), interest: Math.round(interest), maturity: Math.round(maturity) }
}

export const calculateGratuity = (basic: number, years: number) => {
  if (years < 5) {
    return { gratuity: 0, eligible: false }
  }
  const gratuity = (basic * years * 15) / 26
  return { gratuity: Math.round(gratuity), eligible: true }
}

export const calculateTDS = (income: number, category: string) => {
  let tdsRate = 0
  if (category === 'salary') tdsRate = income > 250000 ? 10 : 0
  else if (category === 'professional') tdsRate = 10
  else if (category === 'interest') tdsRate = 10
  else if (category === 'rent') tdsRate = income > 50000 ? 5 : 0
  else if (category === 'commission') tdsRate = 5

  const tds = (income * tdsRate) / 100
  const net = income - tds
  return { tds: Math.round(tds), rate: tdsRate, net: Math.round(net) }
}

export const calculateProfessionalTax = (salary: number, state: string) => {
  let annual = 0
  if (state === 'maharashtra') {
    if (salary <= 10000) annual = 0
    else if (salary <= 25000) annual = 1750
    else annual = 2500
  } else if (state === 'karnataka') {
    if (salary <= 15000) annual = 0
    else annual = 2400
  } else if (state === 'west-bengal') {
    if (salary <= 10000) annual = 0
    else if (salary <= 20000) annual = 1300
    else annual = 2500
  }
  const monthly = Math.round(annual / 12)
  return { monthly, annual }
}

export const calculateAdvanceTaxLiability = (income: number) => {
  let tax = 0
  if (income <= 300000) tax = 0
  else if (income <= 600000) tax = (income - 300000) * 0.05
  else if (income <= 900000) tax = 15000 + (income - 600000) * 0.10
  else if (income <= 1200000) tax = 45000 + (income - 900000) * 0.15
  else if (income <= 1500000) tax = 90000 + (income - 1200000) * 0.20
  else tax = 150000 + (income - 1500000) * 0.30
  
  const cess = tax * 0.04
  const total = tax + cess
  const q1 = total * 0.15
  const q2 = total * 0.45 - q1
  const q3 = total * 0.75 - q1 - q2
  const q4 = total - q1 - q2 - q3
  
  return { 
    total: Math.round(total), 
    q1: Math.round(q1), 
    q2: Math.round(q2), 
    q3: Math.round(q3), 
    q4: Math.round(q4) 
  }
}

export const calculatePostTaxIncome = (income: number, deductions: number) => {
  const taxable = income - deductions
  let tax = 0
  if (taxable <= 300000) tax = 0
  else if (taxable <= 600000) tax = (taxable - 300000) * 0.05
  else if (taxable <= 900000) tax = 15000 + (taxable - 600000) * 0.10
  else if (taxable <= 1200000) tax = 45000 + (taxable - 900000) * 0.15
  else if (taxable <= 1500000) tax = 90000 + (taxable - 1200000) * 0.20
  else tax = 150000 + (taxable - 1500000) * 0.30
  
  const cess = tax * 0.04
  const totalTax = tax + cess
  const postTax = income - totalTax
  const monthly = postTax / 12
  
  return { 
    taxable: Math.round(taxable), 
    tax: Math.round(totalTax), 
    postTax: Math.round(postTax), 
    monthly: Math.round(monthly) 
  }
}

export const calculateLeaveEncashment = (basicSalary: number, yearsService: number, leaveBalance: number, amountReceived: number) => {
  const limit = 2500000
  const tenMonthsSalary = 10 * basicSalary
  const cashEquivalent = (leaveBalance / 30) * basicSalary
  
  const exempt = Math.min(amountReceived, limit, tenMonthsSalary, cashEquivalent)
  const taxable = Math.max(0, amountReceived - exempt)
  
  return { exempt: Math.round(exempt), taxable: Math.round(taxable) }
}

export const calculateVRS = (amountReceived: number) => {
  const exempt = Math.min(amountReceived, 500000)
  const taxable = Math.max(0, amountReceived - exempt)
  return { exempt, taxable }
}

export const calculateRegimeComparison = (income: number, currentDeductions: number) => {
  const stdDedNew = 75000
  const stdDedOld = 50000
  
  const taxableNew = Math.max(0, income - stdDedNew)
  const taxNewResult = calculateIncomeTax(taxableNew, 'new')
  const taxNew = taxNewResult.total
  
  const taxableOld = Math.max(0, income - currentDeductions - stdDedOld)
  const taxOldResult = calculateIncomeTax(taxableOld, 'old')
  const taxOld = taxOldResult.total
  
  let low = 0, high = income, breakeven = 0
  for(let i=0; i<50; i++) {
      const mid = (low + high) / 2
      const testTaxableOld = Math.max(0, income - mid - stdDedOld)
      const testTaxResult = calculateIncomeTax(testTaxableOld, 'old')
      
      if (testTaxResult.total > taxNew) {
          low = mid
      } else {
          high = mid
          breakeven = mid
      }
  }
  
  return {
    taxNew,
    taxOld,
    savings: Math.abs(taxNew - taxOld),
    betterRegime: taxNew <= taxOld ? 'New Regime' : 'Old Regime',
    breakevenDeductions: Math.round(breakeven)
  }
}
