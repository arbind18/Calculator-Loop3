export interface Tool {
  id: string;
  title: string;
  description: string;
  icon: string;
  action?: string;
  url?: string;
}

export interface Subcategory {
  name: string;
  icon: string;
  calculators: Tool[];
}

export interface CategoryData {
  subcategories: Record<string, Subcategory>;
}

export const toolsData: Record<string, CategoryData> = {
  financial: {
    subcategories: {
      'loan': {
        name: '💸 Loan & EMI Calculators',
        icon: 'fas fa-hand-holding-usd',
        calculators: [
          { id: 'personal-loan-emi', title: 'Personal Loan EMI Calculator', description: 'Calculate your Personal Loan EMI instantly. Check monthly installments, total interest, and amortization schedule with our free online tool.', icon: 'fas fa-user-tie', action: 'Calculate Now' },
          { id: 'home-loan-emi', title: 'Home Loan EMI Calculator', description: 'Calculate home loan monthly installments.', icon: 'fas fa-home', action: 'Calculate Now' },
          { id: 'car-loan-emi', title: 'Car Loan EMI Calculator', description: 'Calculate car loan EMI and interest.', icon: 'fas fa-car', action: 'Calculate Now' },
          { id: 'education-loan-emi', title: 'Education Loan EMI Calculator', description: 'Calculate education loan payments.', icon: 'fas fa-graduation-cap', action: 'Calculate Now' },
          { id: 'business-loan-emi', title: 'Business Loan EMI Calculator', description: 'Calculate business loan installments.', icon: 'fas fa-briefcase', action: 'Calculate Now' },
          { id: 'gold-loan-emi', title: 'Gold Loan EMI Calculator', description: 'Calculate EMI for gold-backed loans.', icon: 'fas fa-coins', action: 'Calculate Now' },
          { id: 'two-wheeler-loan', title: 'Two Wheeler Loan Calculator', description: 'Calculate bike loan EMI.', icon: 'fas fa-motorcycle', action: 'Calculate Now' },
          { id: 'loan-prepayment-impact', title: 'Loan Prepayment Impact Calculator', description: 'See impact of prepaying loans.', icon: 'fas fa-forward', action: 'Calculate Now' },
          { id: 'loan-eligibility', title: 'Loan Eligibility Calculator', description: 'Check maximum loan eligibility.', icon: 'fas fa-check-circle', action: 'Calculate Now' },
          { id: 'loan-comparison', title: 'Loan Comparison Calculator', description: 'Compare multiple loan offers.', icon: 'fas fa-exchange-alt', action: 'Calculate Now' },
          { id: 'simple-interest-loan', title: 'Simple Interest Loan Calculator', description: 'Calculate simple interest on loans.', icon: 'fas fa-percent', action: 'Calculate Now' },
          { id: 'compound-interest-loan', title: 'Compound Interest Loan Calculator', description: 'Calculate compound interest loans.', icon: 'fas fa-percentage', action: 'Calculate Now' },
          { id: 'loan-amortization', title: 'Loan Amortization Schedule', description: 'View detailed loan payment schedule.', icon: 'fas fa-calendar-alt', action: 'Calculate Now' },
          { id: 'remaining-loan-balance', title: 'Remaining Loan Balance Calculator', description: 'Calculate outstanding loan amount.', icon: 'fas fa-balance-scale', action: 'Calculate Now' },
          { id: 'top-up-loan', title: 'Top-Up Loan Calculator', description: 'Calculate top-up loan on existing EMI.', icon: 'fas fa-arrow-up', action: 'Calculate Now' }
        ]
      },
      'investment': {
        name: '📈 Investment & Returns Calculators',
        icon: 'fas fa-chart-line',
        calculators: [
          { id: 'sip-calculator', title: 'SIP Calculator', description: 'Calculate Systematic Investment Plan returns.', icon: 'fas fa-chart-line', action: 'Calculate Now' },
          { id: 'step-up-sip', title: 'Step-Up SIP Calculator', description: 'Calculate returns with annual investment increase.', icon: 'fas fa-layer-group', action: 'Calculate Now' },
          { id: 'mutual-fund-returns', title: 'Mutual Fund Returns Calculator', description: 'Calculate mutual fund investment returns.', icon: 'fas fa-briefcase', action: 'Calculate Now' },
          { id: 'compound-interest-investment', title: 'Compound Interest Calculator', description: 'Calculate compound investment growth.', icon: 'fas fa-percentage', action: 'Calculate Now' },
          { id: 'cagr-calculator', title: 'CAGR Calculator', description: 'Calculate Compound Annual Growth Rate.', icon: 'fas fa-chart-area', action: 'Calculate Now' },
          { id: 'roi-calculator', title: 'ROI Calculator', description: 'Calculate return on investment.', icon: 'fas fa-chart-pie', action: 'Calculate Now' },
          { id: 'fd-calculator', title: 'Fixed Deposit Calculator', description: 'Calculate FD maturity amount.', icon: 'fas fa-university', action: 'Calculate Now' },
          { id: 'rd-calculator', title: 'Recurring Deposit Calculator', description: 'Calculate RD returns.', icon: 'fas fa-redo-alt', action: 'Calculate Now' },
          { id: 'ppf-calculator', title: 'PPF Calculator', description: 'Calculate Public Provident Fund maturity.', icon: 'fas fa-piggy-bank', action: 'Calculate Now' },
          { id: 'lumpsum-calculator', title: 'Lumpsum Investment Calculator', description: 'Calculate one-time investment returns.', icon: 'fas fa-hand-holding-usd', action: 'Calculate Now' },
          { id: 'inflation-impact', title: 'Inflation Impact on Returns', description: 'Calculate real returns after inflation.', icon: 'fas fa-chart-line-down', action: 'Calculate Now' }
        ]
      },
      'tax': {
        name: '🧾 Tax & Income Calculators',
        icon: 'fas fa-file-invoice-dollar',
        calculators: [
          { id: 'income-tax-calculator', title: 'Income Tax Calculator', description: 'Calculate annual income tax liability.', icon: 'fas fa-file-invoice-dollar', action: 'Calculate Now' },
          { id: 'salary-breakup', title: 'Salary Breakup Calculator', description: 'Calculate CTC vs in-hand salary.', icon: 'fas fa-money-bill-wave', action: 'Calculate Now' },
          { id: 'hra-calculator', title: 'HRA Calculator', description: 'Calculate House Rent Allowance exemption.', icon: 'fas fa-home', action: 'Calculate Now' },
          { id: 'pf-calculator', title: 'PF Calculator', description: 'Calculate Provident Fund maturity.', icon: 'fas fa-wallet', action: 'Calculate Now' },
          { id: 'gratuity-calculator', title: 'Gratuity Calculator', description: 'Calculate gratuity amount on retirement.', icon: 'fas fa-gift', action: 'Calculate Now' },
          { id: 'tds-calculator', title: 'TDS Calculator', description: 'Calculate Tax Deducted at Source.', icon: 'fas fa-receipt', action: 'Calculate Now' },
          { id: 'gst-calculator', title: 'GST Calculator', description: 'Calculate GST inclusive/exclusive prices.', icon: 'fas fa-file-invoice', action: 'Calculate Now' },
          { id: 'professional-tax', title: 'Professional Tax Calculator', description: 'Calculate professional tax deductions.', icon: 'fas fa-briefcase', action: 'Calculate Now' },
          { id: 'advance-tax-calculator', title: 'Advance Tax Calculator', description: 'Calculate quarterly advance tax.', icon: 'fas fa-calendar-check', action: 'Calculate Now' },
          { id: 'post-tax-income', title: 'Post-Tax Income Calculator', description: 'Calculate income after all taxes.', icon: 'fas fa-hand-holding-usd', action: 'Calculate Now' },
          { id: 'capital-gains-tax', title: 'Capital Gains Tax (LTCG/STCG)', description: 'Calculate tax on stock & property profits.', icon: 'fas fa-chart-line', action: 'Calculate Now' },
          { id: 'old-vs-new-regime', title: 'Old vs New Tax Regime', description: 'Compare tax savings under both regimes.', icon: 'fas fa-balance-scale', action: 'Calculate Now' }
        ]
      },
      'currency': {
        name: '💱 Currency & Forex Calculators',
        icon: 'fas fa-exchange-alt',
        calculators: [
          { id: 'currency-converter', title: 'Currency Converter', description: 'Convert between world currencies.', icon: 'fas fa-exchange-alt', action: 'Calculate Now' },
          { id: 'crypto-profit-loss', title: 'Crypto Profit & Loss Calculator', description: 'Calculate cryptocurrency trading P&L.', icon: 'fab fa-bitcoin', action: 'Calculate Now' },
          { id: 'forex-margin', title: 'Forex Margin Calculator', description: 'Calculate forex trading margin.', icon: 'fas fa-chart-line', action: 'Calculate Now' },
          { id: 'exchange-rate-impact', title: 'Exchange Rate Impact Calculator', description: 'Calculate currency fluctuation impact.', icon: 'fas fa-globe', action: 'Calculate Now' },
          { id: 'bitcoin-converter', title: 'Bitcoin to INR Converter', description: 'Convert Bitcoin to Indian Rupees.', icon: 'fab fa-bitcoin', action: 'Calculate Now' },
          { id: 'import-export-duty', title: 'Import/Export Duty Calculator', description: 'Calculate customs duties.', icon: 'fas fa-ship', action: 'Calculate Now' },
          { id: 'gold-silver-price', title: 'Gold/Silver Price Calculator', description: 'Calculate precious metal prices.', icon: 'fas fa-coins', action: 'Calculate Now' },
          { id: 'international-transfer', title: 'International Transfer Fee Calculator', description: 'Calculate wire transfer costs.', icon: 'fas fa-paper-plane', action: 'Calculate Now' }
        ]
      },
      'banking': {
        name: '🏦 Banking & Savings Calculators',
        icon: 'fas fa-university',
        calculators: [
          { id: 'savings-account-interest', title: 'Savings Account Interest Calculator', description: 'Calculate savings account interest.', icon: 'fas fa-piggy-bank', action: 'Calculate Now' },
          { id: 'deposit-maturity', title: 'FD/RD Maturity Calculator', description: 'Calculate deposit maturity amounts.', icon: 'fas fa-certificate', action: 'Calculate Now' },
          { id: 'interest-rate-comparison', title: 'Interest Rate Comparison Tool', description: 'Compare bank interest rates.', icon: 'fas fa-percentage', action: 'Calculate Now' },
          { id: 'deposit-growth', title: 'Deposit Growth Calculator', description: 'Calculate savings growth over time.', icon: 'fas fa-chart-line', action: 'Calculate Now' },
          { id: 'rd-planner', title: 'RD Installment Planner', description: 'Plan recurring deposit schedule.', icon: 'fas fa-calendar-alt', action: 'Calculate Now' },
          { id: 'bank-charges', title: 'Bank Charges Calculator', description: 'Calculate bank penalty charges.', icon: 'fas fa-exclamation-triangle', action: 'Calculate Now' },
          { id: 'atm-withdrawal-charges', title: 'ATM Withdrawal Charges', description: 'Calculate ATM transaction fees.', icon: 'fas fa-credit-card', action: 'Calculate Now' },
          { id: 'loan-against-fd', title: 'Loan Against FD Calculator', description: 'Calculate loan against fixed deposit.', icon: 'fas fa-file-contract', action: 'Calculate Now' },
          { id: 'money-market-calculator', title: 'Money Market Calculator', description: 'Calculate money market returns.', icon: 'fas fa-chart-area', action: 'Calculate Now' },
          { id: 'ssy-calculator', title: 'Sukanya Samriddhi Yojana (SSY)', description: 'Calculate returns for girl child scheme.', icon: 'fas fa-child', action: 'Calculate Now' },
          { id: 'scss-calculator', title: 'Senior Citizen Savings Scheme', description: 'Calculate quarterly interest for seniors.', icon: 'fas fa-user-clock', action: 'Calculate Now' }
        ]
      },
      'insurance': {
        name: '🛡️ Insurance Calculators',
        icon: 'fas fa-shield-alt',
        calculators: [
          { id: 'life-insurance-calculator', title: 'Life Insurance Calculator', description: 'Calculate required life insurance coverage.', icon: 'fas fa-user-shield', action: 'Calculate Now' }
        ]
      },
      'real-estate': {
        name: '🏠 Real Estate Calculators',
        icon: 'fas fa-home',
        calculators: [
          { id: 'rent-vs-buy', title: 'Rent vs Buy Calculator', description: 'Decide whether to rent or buy a home.', icon: 'fas fa-home', action: 'Calculate Now' }
        ]
      },
      'credit-card': {
        name: '💳 Credit Card Calculators',
        icon: 'fas fa-credit-card',
        calculators: [
          { id: 'credit-card-payoff', title: 'Credit Card Payoff Calculator', description: 'Calculate time to pay off credit card debt.', icon: 'fas fa-credit-card', action: 'Calculate Now' }
        ]
      },
      'retirement': {
        name: '🏖️ Retirement Calculators',
        icon: 'fas fa-umbrella-beach',
        calculators: [
          { id: 'fire-calculator', title: 'FIRE Calculator', description: 'Plan your Financial Independence & Early Retirement.', icon: 'fas fa-fire', action: 'Calculate Now' },
          { id: 'nps-calculator', title: 'NPS Calculator', description: 'Calculate National Pension Scheme returns.', icon: 'fas fa-umbrella-beach', action: 'Calculate Now' },
          { id: 'retirement-corpus', title: 'Retirement Corpus Calculator', description: 'Calculate retirement savings needed.', icon: 'fas fa-user-clock', action: 'Calculate Now' }
        ]
      },
      'business': {
        name: '📊 Business & Profitability Calculators',
        icon: 'fas fa-chart-pie',
        calculators: [
          { id: 'profit-margin', title: 'Profit Margin Calculator', description: 'Calculate gross and net profit margins.', icon: 'fas fa-percentage', action: 'Calculate Now' },
          { id: 'break-even-calculator', title: 'Break-Even Analysis Calculator', description: 'Calculate break-even point.', icon: 'fas fa-balance-scale', action: 'Calculate Now' },
          { id: 'discount-calculator', title: 'Discount Calculator', description: 'Calculate discount amounts.', icon: 'fas fa-tags', action: 'Calculate Now' },
          { id: 'roas-calculator', title: 'ROAS Calculator', description: 'Calculate return on ad spend.', icon: 'fas fa-calculator', action: 'Calculate Now' },
          { id: 'working-capital', title: 'Working Capital Calculator', description: 'Calculate working capital.', icon: 'fas fa-boxes', action: 'Calculate Now' },
          { id: 'markup-calculator', title: 'Markup Calculator', description: 'Calculate markup on products.', icon: 'fas fa-bullhorn', action: 'Calculate Now' },
          { id: 'commission-calculator', title: 'Commission Calculator', description: 'Calculate sales commission.', icon: 'fas fa-building', action: 'Calculate Now' },
          { id: 'startup-runway', title: 'Startup Runway Calculator', description: 'Calculate how long your cash will last.', icon: 'fas fa-plane-departure', action: 'Calculate Now' },
          { id: 'freelance-tax', title: 'Freelance Tax (44ADA)', description: 'Calculate presumptive tax for professionals.', icon: 'fas fa-laptop-code', action: 'Calculate Now' },
          { id: 'inventory-turnover', title: 'Inventory Turnover Ratio', description: 'Measure inventory efficiency.', icon: 'fas fa-boxes', action: 'Calculate Now' },
          { id: 'operating-margin', title: 'Operating Margin Calculator', description: 'Calculate operating profit margin.', icon: 'fas fa-chart-pie', action: 'Calculate Now' }
        ]
      },
      'misc': {
        name: '🧮 Miscellaneous Financial Tools',
        icon: 'fas fa-calculator',
        calculators: [
          { id: 'percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily.', icon: 'fas fa-percent', action: 'Calculate Now' },
          { id: 'tip-calculator', title: 'Tip Calculator', description: 'Calculate tips and split bills.', icon: 'fas fa-receipt', action: 'Calculate Now' },
          { id: 'age-calculator', title: 'Age Calculator', description: 'Calculate age from date of birth.', icon: 'fas fa-birthday-cake', action: 'Calculate Now' },
          { id: 'date-difference', title: 'Date Difference Calculator', description: 'Calculate difference between dates.', icon: 'fas fa-calendar-alt', action: 'Calculate Now' },
          { id: 'date-plus-duration', title: 'Date + Duration Calculator', description: 'Add or subtract time from a date.', icon: 'fas fa-clock', action: 'Calculate Now' },
          { id: 'fuel-cost-calculator', title: 'Fuel Cost Calculator', description: 'Calculate trip fuel costs.', icon: 'fas fa-gas-pump', action: 'Calculate Now' },
          { id: 'bmi-calculator', title: 'BMI Calculator', description: 'Calculate Body Mass Index.', icon: 'fas fa-weight', action: 'Calculate Now' },
          { id: 'emergency-fund', title: 'Emergency Fund Calculator', description: 'Calculate required safety net amount.', icon: 'fas fa-shield-alt', action: 'Calculate Now' }
        ]
      }
    }
  },
  health: {
    subcategories: {
      'body-measurements': {
        name: '🔸 Body Measurements',
        icon: 'fas fa-ruler-vertical',
        calculators: [
          { id: 'bmi-calculator', title: 'BMI Calculator', description: 'Calculate your Body Mass Index.', icon: 'fas fa-weight-scale', url: './fitness-health/bmi-calculator.html' },
          { id: 'bmr-calculator', title: 'BMR Calculator', description: 'Calculate your Basal Metabolic Rate.', icon: 'fas fa-fire', action: 'Calculate Now' },
          { id: 'body-fat-calculator', title: 'Body Fat Calculator', description: 'Estimate your body fat percentage.', icon: 'fas fa-percentage', action: 'Calculate Now' },
          { id: 'lean-body-mass', title: 'Lean Body Mass Calculator', description: 'Calculate your lean body mass.', icon: 'fas fa-dumbbell', action: 'Calculate Now' },
          { id: 'body-surface-area', title: 'Body Surface Area Calculator', description: 'Calculate BSA for medical purposes.', icon: 'fas fa-user-md', action: 'Calculate Now' },
          { id: 'waist-hip-ratio', title: 'Waist-to-Hip Ratio', description: 'Measure body fat distribution.', icon: 'fas fa-ruler-horizontal', action: 'Calculate Now' },
        ]
      },
      'nutrition-calories': {
        name: '🔸 Nutrition & Calorie Tracking',
        icon: 'fas fa-apple-alt',
        calculators: [
          { id: 'calorie-calculator', title: 'Calorie Calculator', description: 'Estimate your daily calorie needs.', icon: 'fas fa-apple-alt', url: './fitness-health/calorie-calculator.html' },
          { id: 'macro-calculator', title: 'Macro Calculator', description: 'Calculate your optimal macronutrient intake.', icon: 'fas fa-utensils', action: 'Calculate Now' },
          { id: 'tdee-calculator', title: 'TDEE Calculator', description: 'Calculate Total Daily Energy Expenditure.', icon: 'fas fa-battery-full', action: 'Calculate Now' },
          { id: 'protein-calculator', title: 'Protein Calculator', description: 'Calculate daily protein requirements.', icon: 'fas fa-drumstick-bite', action: 'Calculate Now' },
          { id: 'water-intake-calculator', title: 'Water Intake Calculator', description: 'Calculate daily water needs.', icon: 'fas fa-glass-water', action: 'Calculate Now' },
          { id: 'meal-planner', title: 'Meal Planner Calculator', description: 'Plan balanced meals and portions.', icon: 'fas fa-plate-wheat', action: 'Calculate Now' },
        ]
      },
      'exercise-performance': {
        name: '🔸 Exercise & Performance',
        icon: 'fas fa-running',
        calculators: [
          { id: 'calories-burned', title: 'Calories Burned Calculator', description: 'Estimate calories burned during exercise.', icon: 'fas fa-fire-alt', action: 'Calculate Now' },
          { id: 'pace-calculator', title: 'Pace Calculator', description: 'Calculate running/walking pace.', icon: 'fas fa-running', action: 'Calculate Now' },
          { id: 'one-rep-max', title: 'One Rep Max Calculator', description: 'Calculate maximum lifting capacity.', icon: 'fas fa-dumbbell', action: 'Calculate Now' },
          { id: 'vo2-max-calculator', title: 'VO2 Max Calculator', description: 'Measure aerobic fitness level.', icon: 'fas fa-lungs', action: 'Calculate Now' },
          { id: 'training-zone-calculator', title: 'Training Zone Calculator', description: 'Calculate optimal training zones.', icon: 'fas fa-heartbeat', action: 'Calculate Now' },
          { id: 'workout-intensity', title: 'Workout Intensity Calculator', description: 'Calculate exercise intensity levels.', icon: 'fas fa-tachometer-alt', action: 'Calculate Now' },
        ]
      },
      'heart-vital-health': {
        name: '🔸 Heart & Vital Health',
        icon: 'fas fa-heartbeat',
        calculators: [
          { id: 'target-heart-rate', title: 'Target Heart Rate Calculator', description: 'Find your target heart rate zones.', icon: 'fas fa-heart-pulse', action: 'Calculate Now' },
          { id: 'blood-pressure-calculator', title: 'Blood Pressure Calculator', description: 'Interpret blood pressure readings.', icon: 'fas fa-heart', action: 'Calculate Now' },
          { id: 'resting-heart-rate', title: 'Resting Heart Rate Calculator', description: 'Calculate your RHR and fitness level.', icon: 'fas fa-bed', action: 'Calculate Now' },
          { id: 'cardiovascular-risk', title: 'Cardiovascular Risk Calculator', description: 'Assess heart disease risk.', icon: 'fas fa-heartbeat', action: 'Calculate Now' },
          { id: 'pulse-pressure-calculator', title: 'Pulse Pressure Calculator', description: 'Calculate pulse pressure from BP.', icon: 'fas fa-wave-square', action: 'Calculate Now' },
        ]
      },
      'pregnancy-fertility': {
        name: '🔸 Pregnancy & Fertility',
        icon: 'fas fa-baby',
        calculators: [
          { id: 'pregnancy-calculator', title: 'Pregnancy Calculator', description: 'Track pregnancy and due date.', icon: 'fas fa-baby', action: 'Calculate Now' },
          { id: 'due-date-calculator', title: 'Due Date Calculator', description: 'Calculate baby due date.', icon: 'fas fa-calendar-alt', action: 'Calculate Now' },
          { id: 'ovulation-calculator', title: 'Ovulation Calculator', description: 'Predict most fertile days.', icon: 'fas fa-leaf', action: 'Calculate Now' },
          { id: 'conception-calculator', title: 'Conception Calculator', description: 'Estimate conception date.', icon: 'fas fa-heart', action: 'Calculate Now' },
          { id: 'pregnancy-weight-gain', title: 'Pregnancy Weight Gain Calculator', description: 'Track healthy pregnancy weight.', icon: 'fas fa-weight-scale', action: 'Calculate Now' },
          { id: 'fertility-window', title: 'Fertility Window Calculator', description: 'Calculate fertility period.', icon: 'fas fa-calendar-check', action: 'Calculate Now' },
        ]
      },
      'sleep-lifestyle': {
        name: '🔸 Sleep & Lifestyle',
        icon: 'fas fa-bed',
        calculators: [
          { id: 'sleep-calculator', title: 'Sleep Calculator', description: 'Calculate optimal sleep and wake times.', icon: 'fas fa-bed', action: 'Calculate Now' },
          { id: 'sleep-cycle-calculator', title: 'Sleep Cycle Calculator', description: 'Find best wake-up time for REM cycles.', icon: 'fas fa-moon', action: 'Calculate Now' },
          { id: 'caffeine-calculator', title: 'Caffeine Calculator', description: 'Calculate safe caffeine intake.', icon: 'fas fa-coffee', action: 'Calculate Now' },
          { id: 'stress-level-calculator', title: 'Stress Level Calculator', description: 'Assess your stress levels.', icon: 'fas fa-brain', action: 'Calculate Now' },
          { id: 'screen-time-calculator', title: 'Screen Time Calculator', description: 'Track and manage screen time.', icon: 'fas fa-mobile-alt', action: 'Calculate Now' },
        ]
      },
      'weight-goal-management': {
        name: '🔸 Weight & Goal Management',
        icon: 'fas fa-bullseye',
        calculators: [
          { id: 'ideal-weight-calculator', title: 'Ideal Weight Calculator', description: 'Find your ideal healthy weight range.', icon: 'fas fa-balance-scale-right', action: 'Calculate Now' },
          { id: 'weight-loss-calculator', title: 'Weight Loss Calculator', description: 'Calculate weight loss timeline.', icon: 'fas fa-weight', action: 'Calculate Now' },
          { id: 'calorie-deficit-calculator', title: 'Calorie Deficit Calculator', description: 'Calculate deficit for weight loss.', icon: 'fas fa-minus-circle', action: 'Calculate Now' },
          { id: 'body-frame-calculator', title: 'Body Frame Calculator', description: 'Determine your body frame size.', icon: 'fas fa-user', action: 'Calculate Now' },
          { id: 'weight-goal-tracker', title: 'Weight Goal Tracker', description: 'Track progress toward weight goals.', icon: 'fas fa-chart-line', action: 'Calculate Now' },
          { id: 'maintenance-calorie-calculator', title: 'Maintenance Calorie Calculator', description: 'Calculate calories to maintain weight.', icon: 'fas fa-equals', action: 'Calculate Now' },
        ]
      },
      'disease-risk-prevention': {
        name: '🔸 Disease Risk & Prevention',
        icon: 'fas fa-shield-virus',
        calculators: [
          { id: 'diabetes-risk-calculator', title: 'Diabetes Risk Calculator', description: 'Assess diabetes risk factors.', icon: 'fas fa-syringe', action: 'Calculate Now' },
          { id: 'cholesterol-ratio-calculator', title: 'Cholesterol Ratio Calculator', description: 'Calculate cholesterol ratios.', icon: 'fas fa-vial', action: 'Calculate Now' },
          { id: 'stroke-risk-calculator', title: 'Stroke Risk Calculator', description: 'Assess stroke risk factors.', icon: 'fas fa-brain', action: 'Calculate Now' },
          { id: 'metabolic-syndrome-calculator', title: 'Metabolic Syndrome Calculator', description: 'Check metabolic health indicators.', icon: 'fas fa-heartbeat', action: 'Calculate Now' },
          { id: 'bone-density-calculator', title: 'Bone Density Calculator', description: 'Assess osteoporosis risk.', icon: 'fas fa-bone', action: 'Calculate Now' },
          { id: 'kidney-function-calculator', title: 'Kidney Function Calculator', description: 'Calculate GFR and kidney health.', icon: 'fas fa-kidneys', action: 'Calculate Now' },
        ]
      }
    }
  },
  math: {
    subcategories: {
      'basic-arithmetic': {
        name: '🔸 Basic Arithmetic',
        icon: 'fas fa-calculator',
        calculators: [
          { id: 'basic-calculator', title: 'Basic Calculator', description: 'Perform basic arithmetic operations.', icon: 'fas fa-calculator', action: 'Calculate Now' },
          { id: 'percentage-calculator', title: 'Percentage Calculator', description: 'Solve various percentage problems.', icon: 'fas fa-percent', url: './math-geometry/percentage-calculator.html' },
          { id: 'fraction-calculator', title: 'Fraction Calculator', description: 'Add, subtract, multiply, and divide fractions.', icon: 'fas fa-divide', action: 'Calculate Now' },
          { id: 'decimal-calculator', title: 'Decimal Calculator', description: 'Perform operations with decimals.', icon: 'fas fa-sort-numeric-down', action: 'Calculate Now' },
          { id: 'ratio-calculator', title: 'Ratio Calculator', description: 'Simplify and solve ratios.', icon: 'fas fa-equals', action: 'Calculate Now' },
          { id: 'proportion-calculator', title: 'Proportion Calculator', description: 'Solve proportions and cross multiplication.', icon: 'fas fa-balance-scale', action: 'Calculate Now' },
          { id: 'average-calculator', title: 'Average Calculator', description: 'Calculate mean, median, mode.', icon: 'fas fa-chart-bar', action: 'Calculate Now' },
          { id: 'rounding-calculator', title: 'Rounding Calculator', description: 'Round numbers to specified decimals.', icon: 'fas fa-compress-arrows-alt', action: 'Calculate Now' },
        ]
      },
      'algebra-equations': {
        name: '🔸 Algebra & Equations',
        icon: 'fas fa-square-root-alt',
        calculators: [
          { id: 'quadratic-formula-calculator', title: 'Quadratic Formula Calculator', description: 'Solve quadratic equations.', icon: 'fas fa-square-root-alt', action: 'Calculate Now' },
          { id: 'linear-equation-solver', title: 'Linear Equation Solver', description: 'Solve linear equations and systems.', icon: 'fas fa-slash', action: 'Calculate Now' },
          { id: 'polynomial-calculator', title: 'Polynomial Calculator', description: 'Calculate and simplify polynomials.', icon: 'fas fa-subscript', action: 'Calculate Now' },
          { id: 'factoring-calculator', title: 'Factoring Calculator', description: 'Factor algebraic expressions.', icon: 'fas fa-code-branch', action: 'Calculate Now' },
          { id: 'exponent-calculator', title: 'Exponent Calculator', description: 'Solve expressions with exponents.', icon: 'fas fa-superscript', action: 'Calculate Now' },
          { id: 'logarithm-calculator', title: 'Logarithm Calculator', description: 'Calculate logarithms with any base.', icon: 'fas fa-wave-square', action: 'Calculate Now' },
          { id: 'inequalities-solver', title: 'Inequalities Solver', description: 'Solve algebraic inequalities.', icon: 'fas fa-not-equal', action: 'Calculate Now' },
          { id: 'simultaneous-equations', title: 'Simultaneous Equations Solver', description: 'Solve systems of equations.', icon: 'fas fa-layer-group', action: 'Calculate Now' },
        ]
      },
      'geometry-shapes': {
        name: '🔸 Geometry & Shapes',
        icon: 'fas fa-shapes',
        calculators: [
          { id: 'area-calculator', title: 'Area Calculator', description: 'Calculate area of 2D shapes.', icon: 'fas fa-square', action: 'Calculate Now' },
          { id: 'perimeter-calculator', title: 'Perimeter Calculator', description: 'Calculate perimeter of shapes.', icon: 'fas fa-border-all', action: 'Calculate Now' },
          { id: 'volume-calculator', title: 'Volume Calculator', description: 'Calculate volume of 3D shapes.', icon: 'fas fa-cube', action: 'Calculate Now' },
          { id: 'surface-area-calculator', title: 'Surface Area Calculator', description: 'Calculate surface area of 3D objects.', icon: 'fas fa-cubes', action: 'Calculate Now' },
          { id: 'triangle-calculator', title: 'Triangle Calculator', description: 'Solve for sides and angles of triangles.', icon: 'fas fa-drafting-compass', action: 'Calculate Now' },
          { id: 'circle-calculator', title: 'Circle Calculator', description: 'Calculate circle properties.', icon: 'fas fa-circle', action: 'Calculate Now' },
          { id: 'pythagorean-theorem', title: 'Pythagorean Theorem Calculator', description: 'Calculate right triangle sides.', icon: 'fas fa-ruler-combined', action: 'Calculate Now' },
          { id: 'polygon-calculator', title: 'Polygon Calculator', description: 'Calculate properties of polygons.', icon: 'fas fa-draw-polygon', action: 'Calculate Now' },
          { id: 'distance-calculator', title: 'Distance Calculator', description: 'Find distance between two points.', icon: 'fas fa-ruler-horizontal', action: 'Calculate Now' },
          { id: 'coordinate-geometry', title: 'Coordinate Geometry Calculator', description: 'Work with coordinate geometry.', icon: 'fas fa-map-marked', action: 'Calculate Now' },
        ]
      },
      'trigonometry': {
        name: '🔸 Trigonometry',
        icon: 'fas fa-wave-sine',
        calculators: [
          { id: 'trigonometry-calculator', title: 'Trigonometry Calculator', description: 'Calculate sine, cosine, tangent.', icon: 'fas fa-wave-sine', action: 'Calculate Now' },
          { id: 'inverse-trig-calculator', title: 'Inverse Trig Calculator', description: 'Calculate arcsin, arccos, arctan.', icon: 'fas fa-undo', action: 'Calculate Now' },
          { id: 'law-of-sines', title: 'Law of Sines Calculator', description: 'Solve triangles using law of sines.', icon: 'fas fa-angle-right', action: 'Calculate Now' },
          { id: 'law-of-cosines', title: 'Law of Cosines Calculator', description: 'Solve triangles using law of cosines.', icon: 'fas fa-angle-left', action: 'Calculate Now' },
          { id: 'unit-circle-calculator', title: 'Unit Circle Calculator', description: 'Find values on the unit circle.', icon: 'fas fa-circle-notch', action: 'Calculate Now' },
          { id: 'angle-converter', title: 'Angle Converter', description: 'Convert between degrees and radians.', icon: 'fas fa-sync-alt', action: 'Calculate Now' },
          { id: 'triangle-angle-calculator', title: 'Triangle Angle Calculator', description: 'Calculate missing triangle angles.', icon: 'fas fa-triangle', action: 'Calculate Now' },
        ]
      },
      'probability-statistics': {
        name: '🔸 Probability & Statistics',
        icon: 'fas fa-chart-pie',
        calculators: [
          { id: 'probability-calculator', title: 'Probability Calculator', description: 'Calculate probability of events.', icon: 'fas fa-dice', action: 'Calculate Now' },
          { id: 'standard-deviation-calculator', title: 'Standard Deviation Calculator', description: 'Calculate standard deviation.', icon: 'fas fa-chart-bar', action: 'Calculate Now' },
          { id: 'mean-median-mode', title: 'Mean, Median, Mode Calculator', description: 'Find central tendency of data.', icon: 'fas fa-sort-numeric-down', action: 'Calculate Now' },
          { id: 'variance-calculator', title: 'Variance Calculator', description: 'Calculate variance of dataset.', icon: 'fas fa-chart-area', action: 'Calculate Now' },
          { id: 'permutation-calculator', title: 'Permutation Calculator', description: 'Calculate permutations nPr.', icon: 'fas fa-list-ol', action: 'Calculate Now' },
          { id: 'combination-calculator', title: 'Combination Calculator', description: 'Calculate combinations nCr.', icon: 'fas fa-layer-group', action: 'Calculate Now' },
          { id: 'z-score-calculator', title: 'Z-Score Calculator', description: 'Calculate z-score for normal distribution.', icon: 'fas fa-chart-line', action: 'Calculate Now' },
          { id: 'correlation-coefficient', title: 'Correlation Coefficient Calculator', description: 'Calculate correlation between variables.', icon: 'fas fa-project-diagram', action: 'Calculate Now' },
          { id: 'regression-calculator', title: 'Regression Calculator', description: 'Perform linear regression analysis.', icon: 'fas fa-chart-scatter', action: 'Calculate Now' },
          { id: 'confidence-interval', title: 'Confidence Interval Calculator', description: 'Calculate confidence intervals.', icon: 'fas fa-percentage', action: 'Calculate Now' },
        ]
      },
      'unit-conversions': {
        name: '🔸 Unit Conversions',
        icon: 'fas fa-exchange-alt',
        calculators: [
          { id: 'length-converter', title: 'Length Converter', description: 'Convert between length units.', icon: 'fas fa-ruler', action: 'Calculate Now' },
          { id: 'weight-converter', title: 'Weight/Mass Converter', description: 'Convert between weight units.', icon: 'fas fa-weight', action: 'Calculate Now' },
          { id: 'volume-converter', title: 'Volume Converter', description: 'Convert between volume units.', icon: 'fas fa-flask', action: 'Calculate Now' },
          { id: 'temperature-converter', title: 'Temperature Converter', description: 'Convert Celsius, Fahrenheit, Kelvin.', icon: 'fas fa-thermometer-half', action: 'Calculate Now' },
          { id: 'area-converter', title: 'Area Converter', description: 'Convert between area units.', icon: 'fas fa-vector-square', action: 'Calculate Now' },
          { id: 'speed-converter', title: 'Speed Converter', description: 'Convert between speed units.', icon: 'fas fa-tachometer-alt', action: 'Calculate Now' },
          { id: 'time-converter', title: 'Time Converter', description: 'Convert between time units.', icon: 'fas fa-clock', action: 'Calculate Now' },
          { id: 'pressure-converter', title: 'Pressure Converter', description: 'Convert between pressure units.', icon: 'fas fa-compress', action: 'Calculate Now' },
          { id: 'energy-converter', title: 'Energy Converter', description: 'Convert between energy units.', icon: 'fas fa-battery-full', action: 'Calculate Now' },
          { id: 'power-converter', title: 'Power Converter', description: 'Convert between power units.', icon: 'fas fa-bolt', action: 'Calculate Now' },
        ]
      },
      'number-systems': {
        name: '🔸 Number Systems & Converters',
        icon: 'fas fa-microchip',
        calculators: [
          { id: 'binary-calculator', title: 'Binary Calculator', description: 'Perform calculations in binary.', icon: 'fas fa-microchip', action: 'Calculate Now' },
          { id: 'hex-calculator', title: 'Hexadecimal Calculator', description: 'Work with hexadecimal numbers.', icon: 'fas fa-hashtag', action: 'Calculate Now' },
          { id: 'octal-calculator', title: 'Octal Calculator', description: 'Perform octal calculations.', icon: 'fas fa-code', action: 'Calculate Now' },
          { id: 'base-converter', title: 'Number Base Converter', description: 'Convert between number bases.', icon: 'fas fa-exchange-alt', action: 'Calculate Now' },
          { id: 'roman-numeral-converter', title: 'Roman Numeral Converter', description: 'Convert to/from Roman numerals.', icon: 'fas fa-font', action: 'Calculate Now' },
          { id: 'scientific-notation-converter', title: 'Scientific Notation Converter', description: 'Convert to scientific notation.', icon: 'fas fa-superscript', action: 'Calculate Now' },
          { id: 'prime-number-checker', title: 'Prime Number Checker', description: 'Check if a number is prime.', icon: 'fas fa-check-circle', action: 'Calculate Now' },
          { id: 'factors-calculator', title: 'Factors Calculator', description: 'Find factors of a number.', icon: 'fas fa-list-ul', action: 'Calculate Now' },
          { id: 'lcm-gcf-calculator', title: 'LCM & GCF Calculator', description: 'Find LCM and GCF of numbers.', icon: 'fas fa-intersection', action: 'Calculate Now' },
        ]
      },
      'graphs-formulas': {
        name: '🔸 Graphs & Formulas',
        icon: 'fas fa-chart-line',
        calculators: [
          { id: 'graphing-calculator', title: 'Graphing Calculator', description: 'Graph mathematical functions.', icon: 'fas fa-chart-line', action: 'Calculate Now' },
          { id: 'slope-calculator', title: 'Slope Calculator', description: 'Calculate slope between two points.', icon: 'fas fa-slash', action: 'Calculate Now' },
          { id: 'midpoint-calculator', title: 'Midpoint Calculator', description: 'Find midpoint between two points.', icon: 'fas fa-dot-circle', action: 'Calculate Now' },
          { id: 'intercept-calculator', title: 'Intercept Calculator', description: 'Find x and y intercepts.', icon: 'fas fa-times', action: 'Calculate Now' },
          { id: 'sequence-calculator', title: 'Sequence Calculator', description: 'Calculate arithmetic & geometric sequences.', icon: 'fas fa-list-ol', action: 'Calculate Now' },
          { id: 'series-calculator', title: 'Series Calculator', description: 'Calculate series summations.', icon: 'fas fa-sigma', action: 'Calculate Now' },
          { id: 'function-calculator', title: 'Function Calculator', description: 'Evaluate mathematical functions.', icon: 'fas fa-function', action: 'Calculate Now' },
          { id: 'parabola-calculator', title: 'Parabola Calculator', description: 'Calculate parabola properties.', icon: 'fas fa-curve', action: 'Calculate Now' },
        ]
      },
      'matrices-vectors': {
        name: '🔸 Matrices & Vectors',
        icon: 'fas fa-th',
        calculators: [
          { id: 'matrix-calculator', title: 'Matrix Calculator', description: 'Add, multiply, inverse matrices.', icon: 'fas fa-th', action: 'Calculate Now' },
          { id: 'determinant-calculator', title: 'Determinant Calculator', description: 'Calculate matrix determinant.', icon: 'fas fa-grip', action: 'Calculate Now' },
          { id: 'vector-calculator', title: 'Vector Calculator', description: 'Vector operations and calculations.', icon: 'fas fa-arrows-alt', action: 'Calculate Now' },
          { id: 'dot-product-calculator', title: 'Dot Product Calculator', description: 'Calculate dot product of vectors.', icon: 'fas fa-circle', action: 'Calculate Now' },
          { id: 'cross-product-calculator', title: 'Cross Product Calculator', description: 'Calculate cross product of vectors.', icon: 'fas fa-times', action: 'Calculate Now' },
          { id: 'eigenvalue-calculator', title: 'Eigenvalue Calculator', description: 'Find eigenvalues and eigenvectors.', icon: 'fas fa-vector-square', action: 'Calculate Now' },
          { id: 'matrix-inverse', title: 'Matrix Inverse Calculator', description: 'Calculate inverse of a matrix.', icon: 'fas fa-undo', action: 'Calculate Now' },
        ]
      },
      'advanced-mathematics': {
        name: '🔸 Advanced Mathematics',
        icon: 'fas fa-infinity',
        calculators: [
          { id: 'scientific-calculator', title: 'Scientific Calculator', description: 'Perform advanced mathematical calculations.', icon: 'fas fa-flask', action: 'Calculate Now' },
          { id: 'derivative-calculator', title: 'Derivative Calculator', description: 'Calculate derivatives of functions.', icon: 'fas fa-chart-line', action: 'Calculate Now' },
          { id: 'integral-calculator', title: 'Integral Calculator', description: 'Calculate definite and indefinite integrals.', icon: 'fas fa-integral', action: 'Calculate Now' },
          { id: 'limit-calculator', title: 'Limit Calculator', description: 'Calculate limits of functions.', icon: 'fas fa-infinity', action: 'Calculate Now' },
          { id: 'differential-equation-solver', title: 'Differential Equation Solver', description: 'Solve differential equations.', icon: 'fas fa-wave-square', action: 'Calculate Now' },
          { id: 'fourier-series-calculator', title: 'Fourier Series Calculator', description: 'Calculate Fourier series.', icon: 'fas fa-wave-sine', action: 'Calculate Now' },
          { id: 'laplace-transform', title: 'Laplace Transform Calculator', description: 'Calculate Laplace transforms.', icon: 'fas fa-project-diagram', action: 'Calculate Now' },
          { id: 'complex-number-calculator', title: 'Complex Number Calculator', description: 'Work with complex numbers.', icon: 'fas fa-code', action: 'Calculate Now' },
          { id: 'partial-derivative', title: 'Partial Derivative Calculator', description: 'Calculate partial derivatives.', icon: 'fas fa-divide', action: 'Calculate Now' },
          { id: 'random-number-generator', title: 'Random Number Generator', description: 'Generate random numbers within a range.', icon: 'fas fa-random', action: 'Calculate Now' },
        ]
      }
    }
  },
  datetime: {
    subcategories: {
      'age-birthdate': {
        name: '🎂 Age & Birthdate Calculation',
        icon: 'fas fa-birthday-cake',
        calculators: [
          { id: 'age-calculator', title: 'Age Calculator', description: 'Calculate your exact age in years, months, and days.', icon: 'fas fa-birthday-cake', url: './date-time/age-calculator.html' },
          { id: 'exact-age-calculator', title: 'Exact Age Calculator', description: 'Calculate age with hours and minutes precision.', icon: 'fas fa-stopwatch', action: 'Calculate Now' },
          { id: 'zodiac-sign-calculator', title: 'Zodiac Sign Calculator', description: 'Find zodiac sign from birthdate.', icon: 'fas fa-star', action: 'Calculate Now' },
        ]
      },
      'date-arithmetic': {
        name: '📅 Date Arithmetic & Difference',
        icon: 'fas fa-calculator',
        calculators: [
          { id: 'date-difference-calculator', title: 'Date Difference Calculator', description: 'Calculate difference between two dates.', icon: 'fas fa-calendar-minus', action: 'Calculate Now' },
          { id: 'add-days-calculator', title: 'Add Days to Date', description: 'Add or subtract days from a date.', icon: 'fas fa-calendar-plus', action: 'Calculate Now' },
          { id: 'business-days-calculator', title: 'Business Days Calculator', description: 'Calculate working days between dates.', icon: 'fas fa-briefcase', action: 'Calculate Now' },
        ]
      },
      'time-management': {
        name: '⏱️ Time Management & Tracking',
        icon: 'fas fa-hourglass-half',
        calculators: [
          { id: 'countdown-timer', title: 'Countdown Timer', description: 'Set countdown for any event.', icon: 'fas fa-hourglass-half', action: 'Calculate Now' },
          { id: 'event-countdown', title: 'Event Countdown', description: 'Count down to special events.', icon: 'fas fa-calendar-check', action: 'Calculate Now' },
          { id: 'pomodoro-timer', title: 'Pomodoro Timer', description: 'Productivity timer with breaks.', icon: 'fas fa-clock', action: 'Calculate Now' },
        ]
      },
      'timezone-world': {
        name: '🌍 Time Zone & World Time',
        icon: 'fas fa-globe-americas',
        calculators: [
          { id: 'timezone-converter', title: 'Time Zone Converter', description: 'Convert time across different time zones.', icon: 'fas fa-globe', action: 'Calculate Now' },
          { id: 'world-clock', title: 'World Clock', description: 'View time in multiple time zones.', icon: 'fas fa-globe-americas', action: 'Calculate Now' },
          { id: 'utc-converter', title: 'UTC Time Converter', description: 'Convert to/from UTC time.', icon: 'fas fa-clock', action: 'Calculate Now' },
        ]
      },
    }
  },
  construction: {
    subcategories: {
      'structural-engineering': {
        name: '🏗️ Structural Engineering',
        icon: 'fas fa-building',
        calculators: [
          { id: 'load-calculator', title: 'Structural Load Calculator', description: 'Estimate structural loads for beams and columns.', icon: 'fas fa-ruler-combined', action: 'Calculate Now' },
          { id: 'beam-calculator', title: 'Beam Deflection Calculator', description: 'Calculate beam deflection and stress.', icon: 'fas fa-minus', action: 'Calculate Now' },
          { id: 'column-calculator', title: 'Column Design Calculator', description: 'Design concrete and steel columns.', icon: 'fas fa-grip-lines-vertical', action: 'Calculate Now' },
          { id: 'rebar-calculator', title: 'Rebar Calculator', description: 'Calculate reinforcement requirements.', icon: 'fas fa-bars', action: 'Calculate Now' },
        ]
      },
      'materials-quantity': {
        name: '📦 Materials & Quantity',
        icon: 'fas fa-cubes',
        calculators: [
          { id: 'concrete-calculator', title: 'Concrete Calculator', description: 'Calculate concrete volume for construction.', icon: 'fas fa-hard-hat', action: 'Calculate Now' },
          { id: 'brick-calculator', title: 'Brick Calculator', description: 'Calculate number of bricks needed.', icon: 'fas fa-cube', action: 'Calculate Now' },
          { id: 'cement-calculator', title: 'Cement Calculator', description: 'Calculate cement bags required.', icon: 'fas fa-box', action: 'Calculate Now' },
          { id: 'sand-calculator', title: 'Sand & Gravel Calculator', description: 'Calculate sand and gravel quantities.', icon: 'fas fa-layer-group', action: 'Calculate Now' },
        ]
      },
      'area-volume': {
        name: '📐 Area & Volume Calculation',
        icon: 'fas fa-ruler-combined',
        calculators: [
          { id: 'area-calculator', title: 'Area Calculator', description: 'Calculate area for various shapes.', icon: 'fas fa-square', action: 'Calculate Now' },
          { id: 'volume-calculator', title: 'Volume Calculator', description: 'Calculate volume for 3D shapes.', icon: 'fas fa-cube', action: 'Calculate Now' },
          { id: 'room-size-calculator', title: 'Room Size Calculator', description: 'Calculate room dimensions and area.', icon: 'fas fa-home', action: 'Calculate Now' },
          { id: 'excavation-calculator', title: 'Excavation Calculator', description: 'Calculate excavation volume.', icon: 'fas fa-industry', action: 'Calculate Now' },
        ]
      },
      'finishing-work': {
        name: '🎨 Finishing Work',
        icon: 'fas fa-paint-roller',
        calculators: [
          { id: 'paint-calculator', title: 'Paint Calculator', description: 'Estimate paint quantity needed.', icon: 'fas fa-paint-roller', action: 'Calculate Now' },
          { id: 'tile-calculator', title: 'Tile Calculator', description: 'Calculate tiles needed for flooring.', icon: 'fas fa-th', action: 'Calculate Now' },
          { id: 'wallpaper-calculator', title: 'Wallpaper Calculator', description: 'Calculate wallpaper rolls needed.', icon: 'fas fa-image', action: 'Calculate Now' },
          { id: 'flooring-calculator', title: 'Flooring Calculator', description: 'Calculate flooring materials needed.', icon: 'fas fa-grip-horizontal', action: 'Calculate Now' },
        ]
      },
    }
  },
  physics: {
    subcategories: {
      'mechanics-motion': {
        name: '⚡ Mechanics & Motion',
        icon: 'fas fa-tachometer-alt',
        calculators: [
          { id: 'velocity-calculator', title: 'Velocity Calculator', description: 'Calculate velocity from distance and time.', icon: 'fas fa-tachometer-alt', action: 'Calculate Now' },
          { id: 'force-calculator', title: 'Force Calculator', description: 'Calculate force using mass and acceleration.', icon: 'fas fa-atom', action: 'Calculate Now' },
          { id: 'acceleration-calculator', title: 'Acceleration Calculator', description: 'Calculate acceleration from velocity change.', icon: 'fas fa-rocket', action: 'Calculate Now' },
          { id: 'momentum-calculator', title: 'Momentum Calculator', description: 'Calculate momentum of objects.', icon: 'fas fa-car', action: 'Calculate Now' },
        ]
      },
      'energy-power': {
        name: '⚡ Energy & Power',
        icon: 'fas fa-bolt',
        calculators: [
          { id: 'kinetic-energy', title: 'Kinetic Energy Calculator', description: 'Calculate kinetic energy of moving objects.', icon: 'fas fa-running', action: 'Calculate Now' },
          { id: 'potential-energy', title: 'Potential Energy Calculator', description: 'Calculate gravitational potential energy.', icon: 'fas fa-mountain', action: 'Calculate Now' },
          { id: 'power-calculator', title: 'Power Calculator', description: 'Calculate power from work and time.', icon: 'fas fa-bolt', action: 'Calculate Now' },
          { id: 'work-calculator', title: 'Work Calculator', description: 'Calculate work done by force.', icon: 'fas fa-weight-hanging', action: 'Calculate Now' },
        ]
      },
      'electricity': {
        name: '🔌 Electricity & Electronics',
        icon: 'fas fa-plug',
        calculators: [
          { id: 'ohms-law', title: "Ohm's Law Calculator", description: 'Calculate voltage, current, and resistance.', icon: 'fas fa-bolt', action: 'Calculate Now' },
          { id: 'power-consumption', title: 'Power Consumption Calculator', description: 'Calculate electrical power usage.', icon: 'fas fa-lightbulb', action: 'Calculate Now' },
          { id: 'resistance-calculator', title: 'Resistance Calculator', description: 'Calculate series and parallel resistance.', icon: 'fas fa-minus-circle', action: 'Calculate Now' },
          { id: 'capacitance-calculator', title: 'Capacitance Calculator', description: 'Calculate capacitor values.', icon: 'fas fa-battery-full', action: 'Calculate Now' },
        ]
      },
    }
  },
  business: {
    subcategories: {
      'profit-analysis': {
        name: '💰 Profit & Margin Analysis',
        icon: 'fas fa-chart-line',
        calculators: [
          { id: 'profit-margin-calculator', title: 'Profit Margin Calculator', description: 'Calculate gross and net profit margins.', icon: 'fas fa-percentage', action: 'Calculate Now' },
          { id: 'break-even-calculator', title: 'Break-Even Point Calculator', description: 'Find when revenue equals costs.', icon: 'fas fa-balance-scale', action: 'Calculate Now' },
          { id: 'markup-margin-converter', title: 'Markup vs Margin Converter', description: 'Convert between markup and margin.', icon: 'fas fa-exchange-alt', action: 'Calculate Now' },
          { id: 'roi-calculator', title: 'ROI on Campaigns', description: 'Calculate return on investment.', icon: 'fas fa-bullseye', action: 'Calculate Now' },
        ]
      },
      'pricing-cost': {
        name: '💵 Pricing & Cost Management',
        icon: 'fas fa-dollar-sign',
        calculators: [
          { id: 'cost-vs-selling-price', title: 'Cost vs Selling Price Calculator', description: 'Calculate optimal selling prices.', icon: 'fas fa-tags', action: 'Calculate Now' },
          { id: 'inventory-cost-estimator', title: 'Inventory Cost Estimator', description: 'Estimate inventory holding costs.', icon: 'fas fa-boxes', action: 'Calculate Now' },
          { id: 'pricing-strategy-tool', title: 'Pricing Strategy Tool', description: 'Determine competitive pricing.', icon: 'fas fa-hand-holding-usd', action: 'Calculate Now' },
        ]
      },
      'valuation-equity': {
        name: '📊 Equity & Valuation',
        icon: 'fas fa-chart-pie',
        calculators: [
          { id: 'equity-valuation-calculator', title: 'Equity & Valuation Calculator', description: 'Calculate business equity value.', icon: 'fas fa-building', action: 'Calculate Now' },
          { id: 'company-valuation', title: 'Company Valuation Tool', description: 'Estimate company worth.', icon: 'fas fa-briefcase', action: 'Calculate Now' },
          { id: 'stock-valuation', title: 'Stock Valuation Calculator', description: 'Calculate stock fair value.', icon: 'fas fa-chart-area', action: 'Calculate Now' },
        ]
      },
      'freelance-rates': {
        name: '💼 Freelance & Consulting',
        icon: 'fas fa-user-tie',
        calculators: [
          { id: 'freelancer-hourly-rate', title: 'Freelancer Hourly Rate Tool', description: 'Calculate your ideal hourly rate.', icon: 'fas fa-clock', action: 'Calculate Now' },
          { id: 'project-pricing-calculator', title: 'Project Pricing Calculator', description: 'Price projects accurately.', icon: 'fas fa-file-invoice-dollar', action: 'Calculate Now' },
          { id: 'consultant-rate-calculator', title: 'Consultant Rate Calculator', description: 'Set consulting fees.', icon: 'fas fa-handshake', action: 'Calculate Now' },
        ]
      },
    }
  },
  everyday: {
    subcategories: {
      'food-dining': {
        name: '🍽️ Food & Dining',
        icon: 'fas fa-utensils',
        calculators: [
          { id: 'tip-calculator', title: 'Tip Calculator', description: 'Calculate tips and split bills.', icon: 'fas fa-hand-holding-heart', action: 'Calculate Now' },
          { id: 'recipe-converter', title: 'Recipe Converter', description: 'Convert recipe quantities.', icon: 'fas fa-book-open', action: 'Calculate Now' },
          { id: 'serving-size-calculator', title: 'Serving Size Calculator', description: 'Adjust recipe for different servings.', icon: 'fas fa-users', action: 'Calculate Now' },
          { id: 'cooking-time-calculator', title: 'Cooking Time Calculator', description: 'Calculate cooking times for recipes.', icon: 'fas fa-clock', action: 'Calculate Now' },
        ]
      },
      'conversion-tools': {
        name: '🔄 Conversion Tools',
        icon: 'fas fa-exchange-alt',
        calculators: [
          { id: 'unit-converter', title: 'Unit Converter', description: 'Convert between different units.', icon: 'fas fa-exchange-alt', action: 'Calculate Now' },
          { id: 'temperature-converter', title: 'Temperature Converter', description: 'Convert Celsius, Fahrenheit, Kelvin.', icon: 'fas fa-thermometer-half', action: 'Calculate Now' },
          { id: 'currency-converter', title: 'Currency Converter', description: 'Convert between currencies.', icon: 'fas fa-money-bill-wave', action: 'Calculate Now' },
          { id: 'length-converter', title: 'Length Converter', description: 'Convert meters, feet, inches, etc.', icon: 'fas fa-ruler', action: 'Calculate Now' },
        ]
      },
      'shopping-budgeting': {
        name: '🛒 Shopping & Budgeting',
        icon: 'fas fa-shopping-cart',
        calculators: [
          { id: 'discount-calculator', title: 'Discount Calculator', description: 'Calculate sale prices and savings.', icon: 'fas fa-tags', action: 'Calculate Now' },
          { id: 'sales-tax-calculator', title: 'Sales Tax Calculator', description: 'Calculate tax on purchases.', icon: 'fas fa-receipt', action: 'Calculate Now' },
          { id: 'price-comparison', title: 'Price Comparison Calculator', description: 'Compare unit prices.', icon: 'fas fa-balance-scale', action: 'Calculate Now' },
          { id: 'budget-calculator', title: 'Budget Calculator', description: 'Plan and track your budget.', icon: 'fas fa-wallet', action: 'Calculate Now' },
        ]
      },
    }
  },
  education: {
    subcategories: {
      'academic-grades': {
        name: '🎓 Academic & Grades',
        icon: 'fas fa-graduation-cap',
        calculators: [
          { id: 'gpa-calculator', title: 'GPA Calculator', description: 'Calculate your Grade Point Average.', icon: 'fas fa-graduation-cap', action: 'Calculate Now' },
          { id: 'grade-calculator', title: 'Grade Calculator', description: 'Calculate your final grade.', icon: 'fas fa-award', action: 'Calculate Now' },
          { id: 'percentage-calculator', title: 'Percentage Grade Calculator', description: 'Convert marks to percentage.', icon: 'fas fa-percent', action: 'Calculate Now' },
          { id: 'cgpa-calculator', title: 'CGPA Calculator', description: 'Calculate cumulative GPA.', icon: 'fas fa-chart-line', action: 'Calculate Now' },
        ]
      },
      'test-preparation': {
        name: '📝 Test & Preparation',
        icon: 'fas fa-clipboard-check',
        calculators: [
          { id: 'study-time-calculator', title: 'Study Time Calculator', description: 'Plan your study schedule.', icon: 'fas fa-clock', action: 'Calculate Now' },
          { id: 'exam-score-calculator', title: 'Exam Score Calculator', description: 'Calculate required exam scores.', icon: 'fas fa-file-alt', action: 'Calculate Now' },
          { id: 'reading-time-calculator', title: 'Reading Time Calculator', description: 'Estimate time to read books.', icon: 'fas fa-book-reader', action: 'Calculate Now' },
        ]
      },
    }
  },
  technology: {
    subcategories: {
      'networking': {
        name: '🌐 Networking & Internet',
        icon: 'fas fa-network-wired',
        calculators: [
          { id: 'bandwidth-calculator', title: 'Bandwidth Calculator', description: 'Calculate network bandwidth requirements.', icon: 'fas fa-wifi', action: 'Calculate Now' },
          { id: 'ip-subnet-calculator', title: 'IP Subnet Calculator', description: 'Calculate IP subnets and ranges.', icon: 'fas fa-server', action: 'Calculate Now' },
          { id: 'download-time-calculator', title: 'Download Time Calculator', description: 'Estimate file download time.', icon: 'fas fa-download', action: 'Calculate Now' },
        ]
      },
      'security': {
        name: '🔐 Security & Privacy',
        icon: 'fas fa-shield-alt',
        calculators: [
          { id: 'password-strength', title: 'Password Strength Checker', description: 'Check password security strength.', icon: 'fas fa-lock', action: 'Calculate Now' },
          { id: 'password-generator', title: 'Password Generator', description: 'Generate secure random passwords.', icon: 'fas fa-key', action: 'Calculate Now' },
          { id: 'encryption-calculator', title: 'Encryption Calculator', description: 'Calculate encryption strength.', icon: 'fas fa-user-secret', action: 'Calculate Now' },
        ]
      },
      'storage-data': {
        name: '💾 Storage & Data',
        icon: 'fas fa-hdd',
        calculators: [
          { id: 'file-size-converter', title: 'File Size Converter', description: 'Convert bytes, KB, MB, GB, TB.', icon: 'fas fa-file', action: 'Calculate Now' },
          { id: 'storage-calculator', title: 'Storage Calculator', description: 'Calculate storage requirements.', icon: 'fas fa-hdd', action: 'Calculate Now' },
          { id: 'data-transfer-calculator', title: 'Data Transfer Calculator', description: 'Calculate data transfer rates.', icon: 'fas fa-exchange-alt', action: 'Calculate Now' },
        ]
      },
    }
  },
  scientific: {
    subcategories: {
      'physics': {
        name: '⚛️ Physics Calculators',
        icon: 'fas fa-atom',
        calculators: [
          { id: 'velocity-calculator', title: 'Velocity Calculator', description: 'Calculate velocity and speed.', icon: 'fas fa-tachometer-alt', action: 'Calculate Now' },
          { id: 'acceleration-calculator', title: 'Acceleration Calculator', description: 'Calculate acceleration.', icon: 'fas fa-rocket', action: 'Calculate Now' },
          { id: 'force-calculator', title: 'Force Calculator', description: 'Calculate force (F = ma).', icon: 'fas fa-hand-rock', action: 'Calculate Now' },
          { id: 'kinetic-energy-calculator', title: 'Kinetic Energy Calculator', description: 'Calculate kinetic energy.', icon: 'fas fa-bolt', action: 'Calculate Now' },
          { id: 'potential-energy-calculator', title: 'Potential Energy Calculator', description: 'Calculate potential energy.', icon: 'fas fa-arrow-up', action: 'Calculate Now' },
          { id: 'work-calculator', title: 'Work Calculator', description: 'Calculate work done.', icon: 'fas fa-tools', action: 'Calculate Now' },
          { id: 'power-calculator', title: 'Power Calculator', description: 'Calculate power output.', icon: 'fas fa-plug', action: 'Calculate Now' },
          { id: 'momentum-calculator', title: 'Momentum Calculator', description: 'Calculate momentum.', icon: 'fas fa-running', action: 'Calculate Now' },
        ]
      },
      'chemistry': {
        name: '🧪 Chemistry Calculators',
        icon: 'fas fa-flask',
        calculators: [
          { id: 'mole-calculator', title: 'Mole Calculator', description: 'Calculate moles and molecular mass.', icon: 'fas fa-atom', action: 'Calculate Now' },
          { id: 'concentration-calculator', title: 'Concentration Calculator', description: 'Calculate solution concentrations.', icon: 'fas fa-flask', action: 'Calculate Now' },
          { id: 'ph-calculator', title: 'pH Calculator', description: 'Calculate pH and pOH values.', icon: 'fas fa-vial', action: 'Calculate Now' },
          { id: 'molarity-calculator', title: 'Molarity Calculator', description: 'Calculate molarity of solutions.', icon: 'fas fa-flask', action: 'Calculate Now' },
          { id: 'dilution-calculator', title: 'Dilution Calculator', description: 'Calculate dilution ratios.', icon: 'fas fa-tint', action: 'Calculate Now' },
          { id: 'stoichiometry-calculator', title: 'Stoichiometry Calculator', description: 'Calculate stoichiometric ratios.', icon: 'fas fa-balance-scale', action: 'Calculate Now' },
        ]
      },
      'astronomy-space': {
        name: '🚀 Astronomy & Space',
        icon: 'fas fa-rocket',
        calculators: [
          { id: 'astronomical-calculator', title: 'Astronomical Calculator', description: 'Calculate astronomical distances.', icon: 'fas fa-rocket', action: 'Calculate Now' },
          { id: 'light-year-calculator', title: 'Light Year Calculator', description: 'Convert light years to other units.', icon: 'fas fa-star', action: 'Calculate Now' },
          { id: 'planet-weight-calculator', title: 'Planet Weight Calculator', description: 'Calculate weight on different planets.', icon: 'fas fa-globe', action: 'Calculate Now' },
        ]
      },
      'scientific-notation': {
        name: '🔬 Scientific Notation & Units',
        icon: 'fas fa-microscope',
        calculators: [
          { id: 'scientific-notation-calculator', title: 'Scientific Notation Calculator', description: 'Convert to scientific notation.', icon: 'fas fa-microscope', action: 'Calculate Now' },
          { id: 'unit-converter', title: 'Unit Converter', description: 'Convert between different units.', icon: 'fas fa-exchange-alt', action: 'Calculate Now' },
        ]
      },
    }
  }
};
