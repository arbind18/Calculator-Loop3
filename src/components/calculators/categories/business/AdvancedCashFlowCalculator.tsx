"use client"

import { useState } from "react"
import { DollarSign, TrendingUp, TrendingDown, Activity, AlertCircle, CheckCircle, Calendar, Zap, ArrowUpCircle, ArrowDownCircle, MinusCircle, BarChart3, Clock, Target } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"

interface CashFlowResult {
  // Operating Activities
  operatingCashFlow: number
  netIncome: number
  depreciation: number
  workingCapitalChange: number
  
  // Investing Activities
  investingCashFlow: number
  capex: number
  assetSales: number
  investmentActivity: number
  
  // Financing Activities
  financingCashFlow: number
  debtProceeds: number
  debtRepayment: number
  equityRaised: number
  dividendsPaid: number
  
  // Summary
  netCashFlow: number
  freeCashFlow: number
  cashFlowMargin: number
  
  // Analysis
  monthlyBurnRate: number
  runway: number
  breakEvenMonths: number
  cashFlowHealth: 'excellent' | 'good' | 'fair' | 'poor' | 'critical'
  insights: string[]
  warnings: string[]
}

export function AdvancedCashFlowCalculator() {
  // Operating Cash Flow Inputs
  const [netIncome, setNetIncome] = useState(500000)
  const [depreciation, setDepreciation] = useState(100000)
  const [amortization, setAmortization] = useState(20000)
  const [accountsReceivableChange, setAccountsReceivableChange] = useState(-50000)
  const [inventoryChange, setInventoryChange] = useState(-30000)
  const [accountsPayableChange, setAccountsPayableChange] = useState(40000)
  const [otherWorkingCapital, setOtherWorkingCapital] = useState(10000)
  
  // Investing Cash Flow Inputs
  const [capex, setCapex] = useState(150000)
  const [assetSales, setAssetSales] = useState(20000)
  const [acquisitions, setAcquisitions] = useState(0)
  const [investmentPurchases, setInvestmentPurchases] = useState(50000)
  const [investmentSales, setInvestmentSales] = useState(10000)
  
  // Financing Cash Flow Inputs
  const [debtProceeds, setDebtProceeds] = useState(200000)
  const [debtRepayment, setDebtRepayment] = useState(100000)
  const [equityRaised, setEquityRaised] = useState(300000)
  const [dividendsPaid, setDividendsPaid] = useState(50000)
  const [shareRepurchases, setShareRepurchases] = useState(0)
  
  // Additional Metrics
  const [currentCashBalance, setCurrentCashBalance] = useState(400000)
  const [monthlyRevenue, setMonthlyRevenue] = useState(200000)
  const [monthlyExpenses, setMonthlyExpenses] = useState(150000)
  
  const [result, setResult] = useState<CashFlowResult | null>(null)

  const calculate = () => {
    // Operating Cash Flow
    const workingCapitalChange = accountsReceivableChange + inventoryChange + accountsPayableChange + otherWorkingCapital
    const operatingCashFlow = netIncome + depreciation + amortization + workingCapitalChange
    
    // Investing Cash Flow (outflows are negative)
    const investmentActivity = investmentSales - investmentPurchases
    const investingCashFlow = -capex + assetSales - acquisitions + investmentActivity
    
    // Financing Cash Flow
    const netDebt = debtProceeds - debtRepayment
    const netEquity = equityRaised - shareRepurchases
    const financingCashFlow = netDebt + netEquity - dividendsPaid
    
    // Summary
    const netCashFlow = operatingCashFlow + investingCashFlow + financingCashFlow
    const freeCashFlow = operatingCashFlow - capex
    const cashFlowMargin = monthlyRevenue > 0 ? (freeCashFlow / (monthlyRevenue * 12)) * 100 : 0
    
    // Burn Rate & Runway
    const monthlyBurnRate = monthlyExpenses - monthlyRevenue
    const projectedEndingCash = currentCashBalance + netCashFlow
    const runway = monthlyBurnRate > 0 ? projectedEndingCash / monthlyBurnRate : 999
    const breakEvenMonths = monthlyBurnRate > 0 && freeCashFlow > 0 ? (currentCashBalance / freeCashFlow) * 12 : 0
    
    // Health Assessment
    let cashFlowHealth: 'excellent' | 'good' | 'fair' | 'poor' | 'critical' = 'good'
    if (freeCashFlow > netIncome * 0.8 && runway > 18 && operatingCashFlow > 0) {
      cashFlowHealth = 'excellent'
    } else if (freeCashFlow > 0 && runway > 12 && operatingCashFlow > 0) {
      cashFlowHealth = 'good'
    } else if (freeCashFlow > 0 && runway > 6) {
      cashFlowHealth = 'fair'
    } else if (operatingCashFlow > 0 && runway > 3) {
      cashFlowHealth = 'poor'
    } else {
      cashFlowHealth = 'critical'
    }
    
    // Generate Insights
    const insights: string[] = []
    const warnings: string[] = []
    
    // Operating Cash Flow insights
    if (operatingCashFlow > netIncome * 1.2) {
      insights.push(`Excellent operating cash flow of ₹${operatingCashFlow.toLocaleString('en-IN')}, exceeding net income by ${(((operatingCashFlow / netIncome) - 1) * 100).toFixed(0)}%.`)
    } else if (operatingCashFlow > netIncome) {
      insights.push(`Healthy operating cash flow of ₹${operatingCashFlow.toLocaleString('en-IN')}, ${(((operatingCashFlow / netIncome) - 1) * 100).toFixed(0)}% above net income.`)
    } else if (operatingCashFlow > 0) {
      warnings.push(`Operating cash flow (₹${operatingCashFlow.toLocaleString('en-IN')}) is below net income. Monitor working capital.`)
    } else {
      warnings.push(`Negative operating cash flow of ₹${Math.abs(operatingCashFlow).toLocaleString('en-IN')}. Urgent action needed.`)
    }
    
    // Free Cash Flow insights
    if (freeCashFlow > operatingCashFlow * 0.7) {
      insights.push(`Strong free cash flow of ₹${freeCashFlow.toLocaleString('en-IN')} after capex. Good capital efficiency.`)
    } else if (freeCashFlow > 0) {
      insights.push(`Positive free cash flow of ₹${freeCashFlow.toLocaleString('en-IN')}. CapEx is ${((capex / operatingCashFlow) * 100).toFixed(0)}% of operating cash flow.`)
    } else {
      warnings.push(`Negative free cash flow of ₹${Math.abs(freeCashFlow).toLocaleString('en-IN')}. CapEx exceeds operating cash flow.`)
    }
    
    // Runway insights
    if (runway > 24) {
      insights.push(`Excellent runway of ${runway.toFixed(0)} months. Strong financial cushion for growth.`)
    } else if (runway > 12) {
      insights.push(`Good runway of ${runway.toFixed(0)} months. Adequate time for strategic planning.`)
    } else if (runway > 6) {
      warnings.push(`Runway of ${runway.toFixed(0)} months. Consider cost reduction or revenue acceleration.`)
    } else if (runway > 0) {
      warnings.push(`Limited runway of ${runway.toFixed(0)} months. Immediate funding or profitability required.`)
    } else {
      insights.push(`Cash flow positive! No burn rate concerns.`)
    }
    
    // Working Capital insights
    if (workingCapitalChange > 0) {
      insights.push(`Working capital released ₹${Math.abs(workingCapitalChange).toLocaleString('en-IN')} cash.`)
    } else if (workingCapitalChange < -100000) {
      warnings.push(`Working capital consumed ₹${Math.abs(workingCapitalChange).toLocaleString('en-IN')} cash. Monitor AR and inventory.`)
    }
    
    // Investment insights
    if (investingCashFlow < -capex * 1.5) {
      insights.push(`Heavy investment phase with ₹${Math.abs(investingCashFlow).toLocaleString('en-IN')} deployed in growth.`)
    }
    
    // Financing insights
    if (financingCashFlow > 0 && equityRaised > 0) {
      insights.push(`Raised ₹${equityRaised.toLocaleString('en-IN')} in equity funding. Strengthens balance sheet.`)
    }
    if (netDebt > 0) {
      insights.push(`Net debt increase of ₹${netDebt.toLocaleString('en-IN')}. Monitor debt service coverage.`)
    } else if (netDebt < 0) {
      insights.push(`Paid down ₹${Math.abs(netDebt).toLocaleString('en-IN')} in debt. Improving leverage.`)
    }
    
    // Net Cash Flow
    if (netCashFlow > netIncome) {
      insights.push(`Net cash increased by ₹${netCashFlow.toLocaleString('en-IN')}, exceeding net income.`)
    } else if (netCashFlow < 0) {
      warnings.push(`Net cash decreased by ₹${Math.abs(netCashFlow).toLocaleString('en-IN')} despite net income.`)
    }
    
    setResult({
      operatingCashFlow,
      netIncome,
      depreciation: depreciation + amortization,
      workingCapitalChange,
      investingCashFlow,
      capex,
      assetSales,
      investmentActivity,
      financingCashFlow,
      debtProceeds,
      debtRepayment,
      equityRaised,
      dividendsPaid,
      netCashFlow,
      freeCashFlow,
      cashFlowMargin,
      monthlyBurnRate,
      runway,
      breakEvenMonths,
      cashFlowHealth,
      insights,
      warnings
    })
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-600 dark:text-green-400'
      case 'good': return 'text-blue-600 dark:text-blue-400'
      case 'fair': return 'text-yellow-600 dark:text-yellow-400'
      case 'poor': return 'text-orange-600 dark:text-orange-400'
      case 'critical': return 'text-red-600 dark:text-red-400'
      default: return 'text-gray-600'
    }
  }

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'excellent':
      case 'good': return <CheckCircle className="h-6 w-6 text-green-500" />
      case 'fair': return <Activity className="h-6 w-6 text-yellow-500" />
      case 'poor':
      case 'critical': return <AlertCircle className="h-6 w-6 text-red-500" />
      default: return <Activity className="h-6 w-6" />
    }
  }

  return (
    <FinancialCalculatorTemplate
      title="Advanced Cash Flow Calculator"
      description="Comprehensive cash flow analysis with operating, investing, and financing activities. Calculate free cash flow, burn rate, runway, and financial health."
      icon={Activity}
      calculate={calculate}
      values={[netIncome, depreciation, amortization, accountsReceivableChange, inventoryChange, accountsPayableChange, otherWorkingCapital, capex, assetSales, acquisitions, investmentPurchases, investmentSales, debtProceeds, debtRepayment, equityRaised, dividendsPaid, shareRepurchases, currentCashBalance, monthlyRevenue, monthlyExpenses]}
      calculatorId="advanced-cash-flow-calculator"
      category="Business"
      inputs={
        <div className="space-y-6">
          {/* Operating Activities */}
          <div className="space-y-4 p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
            <h3 className="font-semibold text-green-900 dark:text-green-100 flex items-center gap-2">
              <ArrowUpCircle className="h-5 w-5" />
              Operating Activities
            </h3>
            
            <InputGroup
              label="Net Income"
              value={netIncome}
              onChange={setNetIncome}
              min={-1000000}
              max={10000000}
              step={10000}
              prefix="₹"
              helpText="Profit after all expenses and taxes"
            />
            
            <InputGroup
              label="Depreciation & Amortization"
              value={depreciation}
              onChange={setDepreciation}
              min={0}
              max={1000000}
              step={10000}
              prefix="₹"
              helpText="Non-cash charges added back"
            />
            
            <InputGroup
              label="Amortization"
              value={amortization}
              onChange={setAmortization}
              min={0}
              max={500000}
              step={5000}
              prefix="₹"
              helpText="Intangible asset amortization"
            />
            
            <div className="pt-3 border-t border-green-300 dark:border-green-700">
              <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-3">Working Capital Changes</p>
              
              <InputGroup
                label="Accounts Receivable Change"
                value={accountsReceivableChange}
                onChange={setAccountsReceivableChange}
                min={-500000}
                max={500000}
                step={10000}
                prefix="₹"
                helpText="Negative = increase in AR (cash decrease)"
              />
              
              <InputGroup
                label="Inventory Change"
                value={inventoryChange}
                onChange={setInventoryChange}
                min={-500000}
                max={500000}
                step={10000}
                prefix="₹"
                helpText="Negative = increase in inventory (cash decrease)"
              />
              
              <InputGroup
                label="Accounts Payable Change"
                value={accountsPayableChange}
                onChange={setAccountsPayableChange}
                min={-500000}
                max={500000}
                step={10000}
                prefix="₹"
                helpText="Positive = increase in AP (cash increase)"
              />
              
              <InputGroup
                label="Other Working Capital"
                value={otherWorkingCapital}
                onChange={setOtherWorkingCapital}
                min={-200000}
                max={200000}
                step={5000}
                prefix="₹"
                helpText="Other current assets/liabilities changes"
              />
            </div>
          </div>

          {/* Investing Activities */}
          <div className="space-y-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <ArrowDownCircle className="h-5 w-5" />
              Investing Activities
            </h3>
            
            <InputGroup
              label="Capital Expenditures (CapEx)"
              value={capex}
              onChange={setCapex}
              min={0}
              max={5000000}
              step={10000}
              prefix="₹"
              helpText="Purchase of PP&E (cash outflow)"
            />
            
            <InputGroup
              label="Asset Sales"
              value={assetSales}
              onChange={setAssetSales}
              min={0}
              max={2000000}
              step={10000}
              prefix="₹"
              helpText="Sale of property, plant, equipment"
            />
            
            <InputGroup
              label="Acquisitions"
              value={acquisitions}
              onChange={setAcquisitions}
              min={0}
              max={5000000}
              step={50000}
              prefix="₹"
              helpText="Business acquisitions (cash outflow)"
            />
            
            <InputGroup
              label="Investment Purchases"
              value={investmentPurchases}
              onChange={setInvestmentPurchases}
              min={0}
              max={2000000}
              step={10000}
              prefix="₹"
              helpText="Purchase of securities/investments"
            />
            
            <InputGroup
              label="Investment Sales"
              value={investmentSales}
              onChange={setInvestmentSales}
              min={0}
              max={2000000}
              step={10000}
              prefix="₹"
              helpText="Sale of securities/investments"
            />
          </div>

          {/* Financing Activities */}
          <div className="space-y-4 p-4 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
            <h3 className="font-semibold text-purple-900 dark:text-purple-100 flex items-center gap-2">
              <MinusCircle className="h-5 w-5" />
              Financing Activities
            </h3>
            
            <InputGroup
              label="Debt Proceeds"
              value={debtProceeds}
              onChange={setDebtProceeds}
              min={0}
              max={5000000}
              step={50000}
              prefix="₹"
              helpText="New loans/bonds issued"
            />
            
            <InputGroup
              label="Debt Repayment"
              value={debtRepayment}
              onChange={setDebtRepayment}
              min={0}
              max={5000000}
              step={50000}
              prefix="₹"
              helpText="Loan principal repayments"
            />
            
            <InputGroup
              label="Equity Raised"
              value={equityRaised}
              onChange={setEquityRaised}
              min={0}
              max={10000000}
              step={100000}
              prefix="₹"
              helpText="Stock issuance/funding rounds"
            />
            
            <InputGroup
              label="Dividends Paid"
              value={dividendsPaid}
              onChange={setDividendsPaid}
              min={0}
              max={1000000}
              step={10000}
              prefix="₹"
              helpText="Cash dividends to shareholders"
            />
            
            <InputGroup
              label="Share Repurchases"
              value={shareRepurchases}
              onChange={setShareRepurchases}
              min={0}
              max={2000000}
              step={50000}
              prefix="₹"
              helpText="Buyback of company stock"
            />
          </div>

          {/* Business Metrics */}
          <div className="space-y-4 p-4 rounded-xl bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
            <h3 className="font-semibold text-orange-900 dark:text-orange-100 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Business Metrics
            </h3>
            
            <InputGroup
              label="Current Cash Balance"
              value={currentCashBalance}
              onChange={setCurrentCashBalance}
              min={0}
              max={10000000}
              step={50000}
              prefix="₹"
              helpText="Cash on hand at period start"
            />
            
            <InputGroup
              label="Monthly Revenue"
              value={monthlyRevenue}
              onChange={setMonthlyRevenue}
              min={0}
              max={5000000}
              step={10000}
              prefix="₹"
              helpText="Average monthly revenue"
            />
            
            <InputGroup
              label="Monthly Expenses"
              value={monthlyExpenses}
              onChange={setMonthlyExpenses}
              min={0}
              max={5000000}
              step={10000}
              prefix="₹"
              helpText="Average monthly operating expenses"
            />
          </div>
        </div>
      }
      result={result && (
        <div className="space-y-6">
          {/* Health Status */}
          <div className={`p-6 rounded-2xl border-2 bg-gradient-to-br ${
            result.cashFlowHealth === 'excellent' ? 'from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-300 dark:border-green-700' :
            result.cashFlowHealth === 'good' ? 'from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-300 dark:border-blue-700' :
            result.cashFlowHealth === 'fair' ? 'from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 border-yellow-300 dark:border-yellow-700' :
            result.cashFlowHealth === 'poor' ? 'from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-300 dark:border-orange-700' :
            'from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 border-red-300 dark:border-red-700'
          }`}>
            <div className="flex items-center gap-4">
              {getHealthIcon(result.cashFlowHealth)}
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-1">
                  Cash Flow Health: <span className={`capitalize ${getHealthColor(result.cashFlowHealth)}`}>{result.cashFlowHealth}</span>
                </h3>
                <p className="text-sm text-muted-foreground">
                  Overall assessment based on operating cash flow, free cash flow, and runway
                </p>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ResultCard
              label="Net Cash Flow"
              value={result.netCashFlow.toLocaleString('en-IN')}
              prefix="₹"
              type={result.netCashFlow > 0 ? 'success' : 'warning'}
              icon={Activity}
            />
            <ResultCard
              label="Free Cash Flow"
              value={result.freeCashFlow.toLocaleString('en-IN')}
              prefix="₹"
              type={result.freeCashFlow > 0 ? 'success' : 'warning'}
              icon={DollarSign}
            />
            <ResultCard
              label="Cash Runway"
              value={result.runway > 100 ? '∞' : result.runway.toFixed(0)}
              suffix={result.runway <= 100 ? ' months' : ''}
              type={result.runway > 12 ? 'success' : result.runway > 6 ? 'warning' : 'default'}
              icon={Clock}
            />
            <ResultCard
              label="Monthly Burn Rate"
              value={result.monthlyBurnRate.toLocaleString('en-IN')}
              prefix="₹"
              type={result.monthlyBurnRate < 0 ? 'success' : 'warning'}
              icon={Zap}
            />
          </div>

          {/* Cash Flow Statement */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4 bg-secondary/50 border-b border-border">
              <h3 className="font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Cash Flow Statement
              </h3>
            </div>
            <div className="divide-y divide-border">
              {/* Operating */}
              <div className="p-6 bg-green-50/50 dark:bg-green-950/10">
                <div className="flex items-center gap-2 mb-4">
                  <ArrowUpCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <h4 className="font-semibold text-green-900 dark:text-green-100">Operating Activities</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Net Income</span>
                    <span className="font-medium">₹{result.netIncome.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>+ Depreciation & Amortization</span>
                    <span className="font-medium">₹{result.depreciation.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{result.workingCapitalChange >= 0 ? '+' : ''} Working Capital Changes</span>
                    <span className="font-medium">₹{result.workingCapitalChange.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-green-200 dark:border-green-800 font-bold text-base">
                    <span>Operating Cash Flow</span>
                    <span className={result.operatingCashFlow >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      ₹{result.operatingCashFlow.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Investing */}
              <div className="p-6 bg-blue-50/50 dark:bg-blue-950/10">
                <div className="flex items-center gap-2 mb-4">
                  <ArrowDownCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100">Investing Activities</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Capital Expenditures</span>
                    <span className="font-medium text-red-600 dark:text-red-400">−₹{result.capex.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>+ Asset Sales</span>
                    <span className="font-medium">₹{result.assetSales.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{result.investmentActivity >= 0 ? '+' : ''} Net Investment Activity</span>
                    <span className="font-medium">₹{result.investmentActivity.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-blue-200 dark:border-blue-800 font-bold text-base">
                    <span>Investing Cash Flow</span>
                    <span className={result.investingCashFlow >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      ₹{result.investingCashFlow.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Financing */}
              <div className="p-6 bg-purple-50/50 dark:bg-purple-950/10">
                <div className="flex items-center gap-2 mb-4">
                  <MinusCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100">Financing Activities</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>+ Debt Proceeds</span>
                    <span className="font-medium">₹{result.debtProceeds.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>− Debt Repayment</span>
                    <span className="font-medium text-red-600 dark:text-red-400">−₹{result.debtRepayment.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>+ Equity Raised</span>
                    <span className="font-medium">₹{result.equityRaised.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>− Dividends Paid</span>
                    <span className="font-medium text-red-600 dark:text-red-400">−₹{result.dividendsPaid.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-purple-200 dark:border-purple-800 font-bold text-base">
                    <span>Financing Cash Flow</span>
                    <span className={result.financingCashFlow >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      ₹{result.financingCashFlow.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Net Cash Flow */}
              <div className="p-6 bg-primary/5">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Net Change in Cash</span>
                  <span className={`text-2xl font-bold ${result.netCashFlow >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    ₹{result.netCashFlow.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Free Cash Flow Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-xl p-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Free Cash Flow
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Operating Cash Flow</span>
                  <span className="font-medium">₹{result.operatingCashFlow.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>− Capital Expenditures</span>
                  <span className="font-medium text-red-600 dark:text-red-400">−₹{result.capex.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-border font-bold text-base">
                  <span>Free Cash Flow</span>
                  <span className={result.freeCashFlow >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                    ₹{result.freeCashFlow.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="pt-2 text-xs text-muted-foreground">
                  FCF Margin: {result.cashFlowMargin.toFixed(1)}% of annual revenue
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Runway Analysis
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Current Cash Balance</span>
                  <span className="font-medium">₹{currentCashBalance.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>+ Net Cash Flow</span>
                  <span className="font-medium">₹{result.netCashFlow.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-border font-bold text-base">
                  <span>Projected Cash</span>
                  <span className="text-primary">
                    ₹{(currentCashBalance + result.netCashFlow).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Monthly Burn</span>
                    <span className="font-medium">₹{result.monthlyBurnRate.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Runway</span>
                    <span className={`font-bold ${result.runway > 12 ? 'text-green-600 dark:text-green-400' : result.runway > 6 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                      {result.runway > 100 ? '∞ months' : `${result.runway.toFixed(0)} months`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Insights */}
          {result.insights.length > 0 && (
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Positive Insights
              </h3>
              <ul className="space-y-2">
                {result.insights.map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-green-700 dark:text-green-300">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Warnings */}
          {result.warnings.length > 0 && (
            <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6">
              <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Areas for Improvement
              </h3>
              <ul className="space-y-2">
                {result.warnings.map((warning, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-orange-700 dark:text-orange-300">
                    <span className="text-orange-500 mt-0.5">⚠</span>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    />
  )
}
