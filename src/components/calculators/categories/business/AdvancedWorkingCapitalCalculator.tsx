"use client"

import { useState, useMemo } from "react"
import { DollarSign, TrendingUp, TrendingDown, Activity, Clock, Package, Users, CreditCard, AlertCircle, CheckCircle, Info, Wallet, BarChart3 } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"

interface WorkingCapitalResult {
  workingCapital: number
  currentRatio: number
  quickRatio: number
  cashRatio: number
  workingCapitalRatio: number
  daysInventoryOutstanding: number
  daysSalesOutstanding: number
  daysPayableOutstanding: number
  cashConversionCycle: number
  workingCapitalTurnover: number
  netWorkingCapital: number
  health: 'excellent' | 'good' | 'fair' | 'poor' | 'critical'
  insights: string[]
  warnings: string[]
}

export function AdvancedWorkingCapitalCalculator() {
  // Assets
  const [cash, setCash] = useState(50000)
  const [marketableSecurities, setMarketableSecurities] = useState(20000)
  const [accountsReceivable, setAccountsReceivable] = useState(80000)
  const [inventory, setInventory] = useState(100000)
  const [otherCurrentAssets, setOtherCurrentAssets] = useState(10000)

  // Liabilities
  const [accountsPayable, setAccountsPayable] = useState(60000)
  const [shortTermDebt, setShortTermDebt] = useState(30000)
  const [otherCurrentLiabilities, setOtherCurrentLiabilities] = useState(20000)

  // Operating metrics for cash conversion cycle
  const [annualRevenue, setAnnualRevenue] = useState(1200000)
  const [annualCOGS, setAnnualCOGS] = useState(800000)
  const [annualPurchases, setAnnualPurchases] = useState(700000)

  const [result, setResult] = useState<WorkingCapitalResult | null>(null)

  const calculate = () => {
    // Calculate totals
    const totalCurrentAssets = cash + marketableSecurities + accountsReceivable + inventory + otherCurrentAssets
    const totalCurrentLiabilities = accountsPayable + shortTermDebt + otherCurrentLiabilities
    const quickAssets = cash + marketableSecurities + accountsReceivable
    
    // Working Capital Metrics
    const workingCapital = totalCurrentAssets - totalCurrentLiabilities
    const netWorkingCapital = accountsReceivable + inventory - accountsPayable
    
    // Liquidity Ratios
    const currentRatio = totalCurrentLiabilities > 0 ? totalCurrentAssets / totalCurrentLiabilities : 0
    const quickRatio = totalCurrentLiabilities > 0 ? quickAssets / totalCurrentLiabilities : 0
    const cashRatio = totalCurrentLiabilities > 0 ? (cash + marketableSecurities) / totalCurrentLiabilities : 0
    const workingCapitalRatio = totalCurrentAssets > 0 ? (workingCapital / totalCurrentAssets) * 100 : 0
    
    // Cash Conversion Cycle Components
    const daysInventoryOutstanding = annualCOGS > 0 ? (inventory / annualCOGS) * 365 : 0
    const daysSalesOutstanding = annualRevenue > 0 ? (accountsReceivable / annualRevenue) * 365 : 0
    const daysPayableOutstanding = annualPurchases > 0 ? (accountsPayable / annualPurchases) * 365 : 0
    const cashConversionCycle = daysInventoryOutstanding + daysSalesOutstanding - daysPayableOutstanding
    
    // Working Capital Turnover
    const workingCapitalTurnover = workingCapital > 0 ? annualRevenue / workingCapital : 0
    
    // Health Assessment
    let health: 'excellent' | 'good' | 'fair' | 'poor' | 'critical' = 'good'
    if (currentRatio >= 2.0 && quickRatio >= 1.2 && cashConversionCycle < 40) health = 'excellent'
    else if (currentRatio >= 1.5 && quickRatio >= 1.0 && cashConversionCycle < 60) health = 'good'
    else if (currentRatio >= 1.2 && quickRatio >= 0.8 && cashConversionCycle < 90) health = 'fair'
    else if (currentRatio >= 1.0 && quickRatio >= 0.5) health = 'poor'
    else health = 'critical'
    
    // Generate Insights
    const insights: string[] = []
    const warnings: string[] = []
    
    // Current Ratio insights
    if (currentRatio >= 2.0) {
      insights.push(`Excellent current ratio of ${currentRatio.toFixed(2)}. Strong ability to cover short-term obligations.`)
    } else if (currentRatio >= 1.5) {
      insights.push(`Good current ratio of ${currentRatio.toFixed(2)}. Adequate liquidity for operations.`)
    } else if (currentRatio >= 1.0) {
      warnings.push(`Current ratio of ${currentRatio.toFixed(2)} is below ideal. Consider improving liquidity.`)
    } else {
      warnings.push(`Critical current ratio of ${currentRatio.toFixed(2)}. Immediate attention needed for liquidity.`)
    }
    
    // Quick Ratio insights
    if (quickRatio >= 1.0) {
      insights.push(`Strong quick ratio of ${quickRatio.toFixed(2)}. Can meet obligations without selling inventory.`)
    } else if (quickRatio >= 0.7) {
      insights.push(`Acceptable quick ratio of ${quickRatio.toFixed(2)}. Monitor closely.`)
    } else {
      warnings.push(`Low quick ratio of ${quickRatio.toFixed(2)}. May struggle with immediate obligations.`)
    }
    
    // Cash Conversion Cycle insights
    if (cashConversionCycle < 30) {
      insights.push(`Excellent cash conversion cycle of ${cashConversionCycle.toFixed(0)} days. Very efficient operations.`)
    } else if (cashConversionCycle < 60) {
      insights.push(`Good cash conversion cycle of ${cashConversionCycle.toFixed(0)} days. Efficient working capital management.`)
    } else if (cashConversionCycle < 90) {
      insights.push(`Average cash conversion cycle of ${cashConversionCycle.toFixed(0)} days. Room for improvement.`)
    } else {
      warnings.push(`High cash conversion cycle of ${cashConversionCycle.toFixed(0)} days. Consider ways to speed up cash flow.`)
    }
    
    // Working Capital insights
    if (workingCapital > totalCurrentAssets * 0.3) {
      insights.push(`Strong working capital position with ₹${workingCapital.toLocaleString('en-IN')} buffer.`)
    } else if (workingCapital > 0) {
      insights.push(`Positive working capital of ₹${workingCapital.toLocaleString('en-IN')}.`)
    } else {
      warnings.push(`Negative working capital of ₹${Math.abs(workingCapital).toLocaleString('en-IN')}. Urgent attention required.`)
    }
    
    // Inventory insights
    if (daysInventoryOutstanding > 90) {
      warnings.push(`High inventory holding period (${daysInventoryOutstanding.toFixed(0)} days). Consider inventory optimization.`)
    } else if (daysInventoryOutstanding < 30) {
      insights.push(`Efficient inventory management with ${daysInventoryOutstanding.toFixed(0)} days holding period.`)
    }
    
    // Receivables insights
    if (daysSalesOutstanding > 60) {
      warnings.push(`Long collection period (${daysSalesOutstanding.toFixed(0)} days). Review credit policies.`)
    } else if (daysSalesOutstanding < 30) {
      insights.push(`Fast collection cycle of ${daysSalesOutstanding.toFixed(0)} days. Excellent credit management.`)
    }
    
    // Payables insights
    if (daysPayableOutstanding < 30) {
      insights.push(`Quick payment to suppliers (${daysPayableOutstanding.toFixed(0)} days). Good supplier relationships.`)
    } else if (daysPayableOutstanding > 90) {
      warnings.push(`Extended payment period (${daysPayableOutstanding.toFixed(0)} days). May indicate cash flow constraints.`)
    }
    
    setResult({
      workingCapital,
      currentRatio,
      quickRatio,
      cashRatio,
      workingCapitalRatio,
      daysInventoryOutstanding,
      daysSalesOutstanding,
      daysPayableOutstanding,
      cashConversionCycle,
      workingCapitalTurnover,
      netWorkingCapital,
      health,
      insights,
      warnings
    })
  }

  const totalCurrentAssets = useMemo(() => 
    cash + marketableSecurities + accountsReceivable + inventory + otherCurrentAssets,
    [cash, marketableSecurities, accountsReceivable, inventory, otherCurrentAssets]
  )

  const totalCurrentLiabilities = useMemo(() => 
    accountsPayable + shortTermDebt + otherCurrentLiabilities,
    [accountsPayable, shortTermDebt, otherCurrentLiabilities]
  )

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-600 dark:text-green-400'
      case 'good': return 'text-blue-600 dark:text-blue-400'
      case 'fair': return 'text-yellow-600 dark:text-yellow-400'
      case 'poor': return 'text-orange-600 dark:text-orange-400'
      case 'critical': return 'text-red-600 dark:text-red-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'excellent':
      case 'good': return <CheckCircle className="h-6 w-6 text-green-500" />
      case 'fair': return <Info className="h-6 w-6 text-yellow-500" />
      case 'poor':
      case 'critical': return <AlertCircle className="h-6 w-6 text-red-500" />
      default: return <Activity className="h-6 w-6 text-gray-500" />
    }
  }

  return (
    <FinancialCalculatorTemplate
      title="Advanced Working Capital Calculator"
      description="Comprehensive working capital analysis with liquidity ratios, cash conversion cycle, and financial health assessment for business operations."
      icon={Wallet}
      calculate={calculate}
      values={[cash, marketableSecurities, accountsReceivable, inventory, otherCurrentAssets, accountsPayable, shortTermDebt, otherCurrentLiabilities, annualRevenue, annualCOGS, annualPurchases]}
      calculatorId="advanced-working-capital-calculator"
      category="Business"
      inputs={
        <div className="space-y-6">
          {/* Current Assets Section */}
          <div className="space-y-4 p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
            <h3 className="font-semibold text-green-900 dark:text-green-100 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Current Assets
            </h3>
            
            <InputGroup
              label="Cash & Cash Equivalents"
              value={cash}
              onChange={setCash}
              min={0}
              max={10000000}
              step={10000}
              prefix="₹"
              helpText="Cash on hand and bank balances"
            />
            
            <InputGroup
              label="Marketable Securities"
              value={marketableSecurities}
              onChange={setMarketableSecurities}
              min={0}
              max={5000000}
              step={10000}
              prefix="₹"
              helpText="Short-term investments easily convertible to cash"
            />
            
            <InputGroup
              label="Accounts Receivable"
              value={accountsReceivable}
              onChange={setAccountsReceivable}
              min={0}
              max={10000000}
              step={10000}
              prefix="₹"
              helpText="Money owed by customers"
            />
            
            <InputGroup
              label="Inventory"
              value={inventory}
              onChange={setInventory}
              min={0}
              max={10000000}
              step={10000}
              prefix="₹"
              helpText="Raw materials, WIP, and finished goods"
            />
            
            <InputGroup
              label="Other Current Assets"
              value={otherCurrentAssets}
              onChange={setOtherCurrentAssets}
              min={0}
              max={1000000}
              step={5000}
              prefix="₹"
              helpText="Prepaid expenses and other short-term assets"
            />
            
            <div className="pt-3 border-t border-green-300 dark:border-green-700">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-green-900 dark:text-green-100">Total Current Assets:</span>
                <span className="text-xl font-bold text-green-600 dark:text-green-400">
                  ₹{totalCurrentAssets.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Current Liabilities Section */}
          <div className="space-y-4 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
            <h3 className="font-semibold text-red-900 dark:text-red-100 flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Current Liabilities
            </h3>
            
            <InputGroup
              label="Accounts Payable"
              value={accountsPayable}
              onChange={setAccountsPayable}
              min={0}
              max={5000000}
              step={10000}
              prefix="₹"
              helpText="Money owed to suppliers"
            />
            
            <InputGroup
              label="Short-Term Debt"
              value={shortTermDebt}
              onChange={setShortTermDebt}
              min={0}
              max={5000000}
              step={10000}
              prefix="₹"
              helpText="Loans and credit due within one year"
            />
            
            <InputGroup
              label="Other Current Liabilities"
              value={otherCurrentLiabilities}
              onChange={setOtherCurrentLiabilities}
              min={0}
              max={1000000}
              step={5000}
              prefix="₹"
              helpText="Accrued expenses and other short-term obligations"
            />
            
            <div className="pt-3 border-t border-red-300 dark:border-red-700">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-red-900 dark:text-red-100">Total Current Liabilities:</span>
                <span className="text-xl font-bold text-red-600 dark:text-red-400">
                  ₹{totalCurrentLiabilities.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Operating Metrics Section */}
          <div className="space-y-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Annual Operating Metrics
            </h3>
            
            <InputGroup
              label="Annual Revenue"
              value={annualRevenue}
              onChange={setAnnualRevenue}
              min={100000}
              max={100000000}
              step={100000}
              prefix="₹"
              helpText="Total sales for the year"
            />
            
            <InputGroup
              label="Annual Cost of Goods Sold (COGS)"
              value={annualCOGS}
              onChange={setAnnualCOGS}
              min={50000}
              max={50000000}
              step={50000}
              prefix="₹"
              helpText="Direct costs of producing goods sold"
            />
            
            <InputGroup
              label="Annual Purchases"
              value={annualPurchases}
              onChange={setAnnualPurchases}
              min={50000}
              max={50000000}
              step={50000}
              prefix="₹"
              helpText="Total purchases from suppliers"
            />
          </div>
        </div>
      }
      result={result && (
        <div className="space-y-6">
          {/* Health Status Card */}
          <div className={`p-6 rounded-2xl border-2 bg-gradient-to-br ${
            result.health === 'excellent' ? 'from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-300 dark:border-green-700' :
            result.health === 'good' ? 'from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-300 dark:border-blue-700' :
            result.health === 'fair' ? 'from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 border-yellow-300 dark:border-yellow-700' :
            result.health === 'poor' ? 'from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-300 dark:border-orange-700' :
            'from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 border-red-300 dark:border-red-700'
          }`}>
            <div className="flex items-center gap-4">
              {getHealthIcon(result.health)}
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-1">
                  Working Capital Health: <span className={`capitalize ${getHealthColor(result.health)}`}>{result.health}</span>
                </h3>
                <p className="text-sm text-muted-foreground">
                  Overall financial health assessment based on liquidity and efficiency metrics
                </p>
              </div>
            </div>
          </div>

          {/* Primary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ResultCard
              label="Working Capital"
              value={result.workingCapital.toLocaleString('en-IN')}
              prefix="₹"
              type={result.workingCapital > 0 ? 'success' : 'warning'}
              icon={Wallet}
              subtext={`${result.workingCapitalRatio.toFixed(1)}% of current assets`}
            />
            <ResultCard
              label="Net Working Capital"
              value={result.netWorkingCapital.toLocaleString('en-IN')}
              prefix="₹"
              type="default"
              icon={DollarSign}
              subtext="AR + Inventory - AP"
            />
            <ResultCard
              label="Cash Conversion Cycle"
              value={result.cashConversionCycle.toFixed(0)}
              suffix=" days"
              type={result.cashConversionCycle < 60 ? 'success' : 'warning'}
              icon={Clock}
            />
          </div>

          {/* Liquidity Ratios */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4 bg-secondary/50 border-b border-border">
              <h3 className="font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Liquidity Ratios
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-secondary/30">
                <p className="text-sm text-muted-foreground mb-2">Current Ratio</p>
                <p className="text-3xl font-bold text-primary">{result.currentRatio.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-2">Target: ≥ 1.5</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-secondary/30">
                <p className="text-sm text-muted-foreground mb-2">Quick Ratio</p>
                <p className="text-3xl font-bold text-primary">{result.quickRatio.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-2">Target: ≥ 1.0</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-secondary/30">
                <p className="text-sm text-muted-foreground mb-2">Cash Ratio</p>
                <p className="text-3xl font-bold text-primary">{result.cashRatio.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-2">Target: ≥ 0.5</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-secondary/30">
                <p className="text-sm text-muted-foreground mb-2">WC Turnover</p>
                <p className="text-3xl font-bold text-primary">{result.workingCapitalTurnover.toFixed(2)}x</p>
                <p className="text-xs text-muted-foreground mt-2">Higher is better</p>
              </div>
            </div>
          </div>

          {/* Cash Conversion Cycle Breakdown */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4 bg-secondary/50 border-b border-border">
              <h3 className="font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Cash Conversion Cycle Breakdown
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="font-medium">Days Inventory Outstanding (DIO)</p>
                    <p className="text-xs text-muted-foreground">How long inventory sits before being sold</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {result.daysInventoryOutstanding.toFixed(0)} days
                </span>
              </div>

              <div className="flex items-center justify-center text-2xl font-bold text-muted-foreground">+</div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="font-medium">Days Sales Outstanding (DSO)</p>
                    <p className="text-xs text-muted-foreground">How long it takes to collect payment from customers</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {result.daysSalesOutstanding.toFixed(0)} days
                </span>
              </div>

              <div className="flex items-center justify-center text-2xl font-bold text-muted-foreground">−</div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  <div>
                    <p className="font-medium">Days Payable Outstanding (DPO)</p>
                    <p className="text-xs text-muted-foreground">How long it takes to pay suppliers</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {result.daysPayableOutstanding.toFixed(0)} days
                </span>
              </div>

              <div className="flex items-center justify-center text-2xl font-bold text-muted-foreground">=</div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border-2 border-primary">
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Cash Conversion Cycle (CCC)</p>
                    <p className="text-xs text-muted-foreground">Time between paying suppliers and receiving payment from customers</p>
                  </div>
                </div>
                <span className="text-3xl font-bold text-primary">
                  {result.cashConversionCycle.toFixed(0)} days
                </span>
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

          {/* Recommendations */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
              <Info className="h-5 w-5" />
              Improvement Strategies
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium text-blue-800 dark:text-blue-200">To Reduce DIO:</h4>
                <ul className="space-y-1 text-blue-700 dark:text-blue-300 pl-4">
                  <li>• Implement just-in-time inventory</li>
                  <li>• Improve demand forecasting</li>
                  <li>• Clear slow-moving inventory</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-blue-800 dark:text-blue-200">To Reduce DSO:</h4>
                <ul className="space-y-1 text-blue-700 dark:text-blue-300 pl-4">
                  <li>• Offer early payment discounts</li>
                  <li>• Tighten credit policies</li>
                  <li>• Send invoices promptly</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-blue-800 dark:text-blue-200">To Increase DPO:</h4>
                <ul className="space-y-1 text-blue-700 dark:text-blue-300 pl-4">
                  <li>• Negotiate better payment terms</li>
                  <li>• Build supplier relationships</li>
                  <li>• Use trade credit strategically</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-blue-800 dark:text-blue-200">To Improve Liquidity:</h4>
                <ul className="space-y-1 text-blue-700 dark:text-blue-300 pl-4">
                  <li>• Increase cash reserves</li>
                  <li>• Reduce short-term debt</li>
                  <li>• Optimize working capital</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    />
  )
}
