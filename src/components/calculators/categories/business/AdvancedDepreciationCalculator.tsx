"use client"

import { useState, useMemo } from "react"
import { TrendingDown, Calculator, DollarSign, Calendar, Percent, TrendingUp, Info, BarChart3, PieChart, AlertCircle } from "lucide-react"
import { FinancialCalculatorTemplate, InputGroup, ResultCard } from "@/components/calculators/templates/FinancialCalculatorTemplate"

type DepreciationMethod = 'straight-line' | 'declining-balance' | 'double-declining' | 'sum-of-years'

interface YearlyDepreciation {
  year: number
  depreciationExpense: number
  accumulatedDepreciation: number
  bookValue: number
  taxSavings: number
}

interface DepreciationResult {
  method: string
  totalDepreciation: number
  averageAnnualDepreciation: number
  yearlyBreakdown: YearlyDepreciation[]
  finalBookValue: number
  totalTaxSavings: number
}

export function AdvancedDepreciationCalculator() {
  const [assetCost, setAssetCost] = useState(100000)
  const [salvageValue, setSalvageValue] = useState(10000)
  const [usefulLife, setUsefulLife] = useState(5)
  const [taxRate, setTaxRate] = useState(30)
  const [selectedMethod, setSelectedMethod] = useState<DepreciationMethod>('straight-line')
  const [decliningRate, setDecliningRate] = useState(20)
  const [result, setResult] = useState<DepreciationResult | null>(null)
  const [allMethods, setAllMethods] = useState<DepreciationResult[]>([])

  const calculateStraightLine = (): DepreciationResult => {
    const depreciableAmount = assetCost - salvageValue
    const annualDepreciation = depreciableAmount / usefulLife
    const yearlyBreakdown: YearlyDepreciation[] = []
    
    let accumulatedDepreciation = 0
    
    for (let year = 1; year <= usefulLife; year++) {
      accumulatedDepreciation += annualDepreciation
      const bookValue = assetCost - accumulatedDepreciation
      const taxSavings = annualDepreciation * (taxRate / 100)
      
      yearlyBreakdown.push({
        year,
        depreciationExpense: annualDepreciation,
        accumulatedDepreciation,
        bookValue: Math.max(bookValue, salvageValue),
        taxSavings
      })
    }
    
    return {
      method: 'Straight-Line',
      totalDepreciation: depreciableAmount,
      averageAnnualDepreciation: annualDepreciation,
      yearlyBreakdown,
      finalBookValue: salvageValue,
      totalTaxSavings: depreciableAmount * (taxRate / 100)
    }
  }

  const calculateDecliningBalance = (rate: number): DepreciationResult => {
    const yearlyBreakdown: YearlyDepreciation[] = []
    let bookValue = assetCost
    let accumulatedDepreciation = 0
    const decimalRate = rate / 100
    
    for (let year = 1; year <= usefulLife; year++) {
      let depreciationExpense = bookValue * decimalRate
      
      // Don't depreciate below salvage value
      if (bookValue - depreciationExpense < salvageValue) {
        depreciationExpense = bookValue - salvageValue
      }
      
      accumulatedDepreciation += depreciationExpense
      bookValue -= depreciationExpense
      const taxSavings = depreciationExpense * (taxRate / 100)
      
      yearlyBreakdown.push({
        year,
        depreciationExpense,
        accumulatedDepreciation,
        bookValue: Math.max(bookValue, salvageValue),
        taxSavings
      })
      
      if (bookValue <= salvageValue) break
    }
    
    return {
      method: `Declining Balance (${rate}%)`,
      totalDepreciation: assetCost - salvageValue,
      averageAnnualDepreciation: (assetCost - salvageValue) / usefulLife,
      yearlyBreakdown,
      finalBookValue: bookValue,
      totalTaxSavings: accumulatedDepreciation * (taxRate / 100)
    }
  }

  const calculateDoubleDeclining = (): DepreciationResult => {
    const rate = (2 / usefulLife) * 100
    return {
      ...calculateDecliningBalance(rate),
      method: 'Double Declining Balance'
    }
  }

  const calculateSumOfYears = (): DepreciationResult => {
    const depreciableAmount = assetCost - salvageValue
    const sumOfYears = (usefulLife * (usefulLife + 1)) / 2
    const yearlyBreakdown: YearlyDepreciation[] = []
    let accumulatedDepreciation = 0
    
    for (let year = 1; year <= usefulLife; year++) {
      const remainingYears = usefulLife - year + 1
      const depreciationExpense = (remainingYears / sumOfYears) * depreciableAmount
      accumulatedDepreciation += depreciationExpense
      const bookValue = assetCost - accumulatedDepreciation
      const taxSavings = depreciationExpense * (taxRate / 100)
      
      yearlyBreakdown.push({
        year,
        depreciationExpense,
        accumulatedDepreciation,
        bookValue: Math.max(bookValue, salvageValue),
        taxSavings
      })
    }
    
    return {
      method: 'Sum of Years Digits',
      totalDepreciation: depreciableAmount,
      averageAnnualDepreciation: depreciableAmount / usefulLife,
      yearlyBreakdown,
      finalBookValue: salvageValue,
      totalTaxSavings: depreciableAmount * (taxRate / 100)
    }
  }

  const calculate = () => {
    let mainResult: DepreciationResult
    
    switch (selectedMethod) {
      case 'straight-line':
        mainResult = calculateStraightLine()
        break
      case 'declining-balance':
        mainResult = calculateDecliningBalance(decliningRate)
        break
      case 'double-declining':
        mainResult = calculateDoubleDeclining()
        break
      case 'sum-of-years':
        mainResult = calculateSumOfYears()
        break
      default:
        mainResult = calculateStraightLine()
    }
    
    setResult(mainResult)
    
    // Calculate all methods for comparison
    const allMethodsResults = [
      calculateStraightLine(),
      calculateDoubleDeclining(),
      calculateDecliningBalance(decliningRate),
      calculateSumOfYears()
    ]
    setAllMethods(allMethodsResults)
  }

  const depreciableAmount = assetCost - salvageValue

  const getMethodDescription = (method: DepreciationMethod) => {
    switch (method) {
      case 'straight-line':
        return 'Equal depreciation each year. Simple and widely used.'
      case 'declining-balance':
        return 'Higher depreciation in early years based on book value.'
      case 'double-declining':
        return 'Accelerated depreciation at double the straight-line rate.'
      case 'sum-of-years':
        return 'Accelerated method using sum of years digits fraction.'
    }
  }

  const getMethodRecommendation = () => {
    if (!result) return null
    
    const recommendations = {
      'straight-line': {
        icon: '📊',
        text: 'Best for assets that provide consistent value over time',
        color: 'text-blue-600 dark:text-blue-400'
      },
      'declining-balance': {
        icon: '📉',
        text: 'Good for assets that lose value quickly in early years',
        color: 'text-purple-600 dark:text-purple-400'
      },
      'double-declining': {
        icon: '⚡',
        text: 'Ideal for technology and equipment with rapid obsolescence',
        color: 'text-orange-600 dark:text-orange-400'
      },
      'sum-of-years': {
        icon: '🎯',
        text: 'Suitable for assets with declining productivity over time',
        color: 'text-green-600 dark:text-green-400'
      }
    }
    
    return recommendations[selectedMethod]
  }

  return (
    <FinancialCalculatorTemplate
      title="Advanced Depreciation Calculator"
      description="Calculate asset depreciation using multiple methods: Straight-Line, Declining Balance, Double Declining Balance, and Sum of Years Digits with tax savings analysis."
      icon={TrendingDown}
      calculate={calculate}
      values={[assetCost, salvageValue, usefulLife, taxRate, selectedMethod, decliningRate]}
      calculatorId="advanced-depreciation-calculator"
      category="Business"
      inputs={
        <div className="space-y-6">
          <InputGroup
            label="Asset Cost"
            value={assetCost}
            onChange={setAssetCost}
            min={10000}
            max={10000000}
            step={10000}
            prefix="₹"
            helpText="Initial purchase price of the asset"
          />
          
          <InputGroup
            label="Salvage Value"
            value={salvageValue}
            onChange={setSalvageValue}
            min={0}
            max={assetCost * 0.5}
            step={1000}
            prefix="₹"
            helpText="Estimated value at end of useful life"
          />
          
          <InputGroup
            label="Useful Life (Years)"
            value={usefulLife}
            onChange={setUsefulLife}
            min={1}
            max={30}
            step={1}
            suffix="years"
            helpText="Expected lifespan of the asset"
          />
          
          <InputGroup
            label="Tax Rate"
            value={taxRate}
            onChange={setTaxRate}
            min={0}
            max={50}
            step={1}
            suffix="%"
            helpText="Corporate tax rate for tax savings calculation"
          />

          <div className="space-y-3 p-4 rounded-xl bg-secondary/50 border border-border">
            <label className="text-sm font-medium flex items-center gap-2">
              <Calculator className="h-4 w-4 text-primary" />
              Depreciation Method
            </label>
            <div className="grid grid-cols-1 gap-2">
              {(['straight-line', 'declining-balance', 'double-declining', 'sum-of-years'] as DepreciationMethod[]).map((method) => (
                <button
                  key={method}
                  onClick={() => setSelectedMethod(method)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    selectedMethod === method
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50 bg-card'
                  }`}
                >
                  <div className="font-medium capitalize">
                    {method.replace('-', ' ')}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {getMethodDescription(method)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedMethod === 'declining-balance' && (
            <InputGroup
              label="Declining Balance Rate"
              value={decliningRate}
              onChange={setDecliningRate}
              min={10}
              max={50}
              step={5}
              suffix="%"
              helpText="Annual depreciation rate (typically 150% or 200% of straight-line)"
            />
          )}

          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
            <div className="flex gap-2 text-sm">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                  Depreciable Amount: ₹{depreciableAmount.toLocaleString('en-IN')}
                </p>
                <p className="text-blue-700 dark:text-blue-300 text-xs">
                  Asset Cost (₹{assetCost.toLocaleString('en-IN')}) - Salvage Value (₹{salvageValue.toLocaleString('en-IN')})
                </p>
              </div>
            </div>
          </div>
        </div>
      }
      result={result && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ResultCard
              label="Total Depreciation"
              value={result.totalDepreciation.toLocaleString('en-IN')}
              prefix="₹"
              type="highlight"
              icon={TrendingDown}
            />
            <ResultCard
              label="Avg Annual Depreciation"
              value={result.averageAnnualDepreciation.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              prefix="₹"
              type="default"
              icon={Calendar}
            />
            <ResultCard
              label="Final Book Value"
              value={result.finalBookValue.toLocaleString('en-IN')}
              prefix="₹"
              type="success"
              icon={DollarSign}
            />
            <ResultCard
              label="Total Tax Savings"
              value={result.totalTaxSavings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              prefix="₹"
              type="success"
              icon={Percent}
            />
          </div>

          {/* Method Info */}
          {getMethodRecommendation() && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20">
              <div className="flex gap-3">
                <span className="text-2xl">{getMethodRecommendation()?.icon}</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">
                    {result.method}
                  </h4>
                  <p className={`text-sm ${getMethodRecommendation()?.color}`}>
                    {getMethodRecommendation()?.text}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Yearly Breakdown Table */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4 bg-secondary/50 border-b border-border">
              <h3 className="font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Year-by-Year Breakdown
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/30">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Year</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">Depreciation</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">Accumulated</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">Book Value</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">Tax Savings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {result.yearlyBreakdown.map((year) => (
                    <tr key={year.year} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-3 font-medium">{year.year}</td>
                      <td className="px-4 py-3 text-right">
                        ₹{year.depreciationExpense.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        ₹{year.accumulatedDepreciation.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-primary">
                        ₹{year.bookValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="px-4 py-3 text-right text-green-600 dark:text-green-400">
                        ₹{year.taxSavings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Visual Depreciation Chart */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-primary" />
              Book Value Over Time
            </h3>
            <div className="space-y-3">
              {result.yearlyBreakdown.map((year) => {
                const percentage = (year.bookValue / assetCost) * 100
                return (
                  <div key={year.year} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Year {year.year}</span>
                      <span className="text-muted-foreground">
                        ₹{year.bookValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="h-3 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Method Comparison */}
          {allMethods.length > 0 && (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-4 bg-secondary/50 border-b border-border">
                <h3 className="font-semibold flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  Method Comparison
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/30">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Method</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold">Year 1 Depreciation</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold">Final Book Value</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold">Total Tax Savings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {allMethods.map((method, idx) => {
                      const isSelected = method.method === result.method
                      return (
                        <tr
                          key={idx}
                          className={`hover:bg-secondary/20 transition-colors ${
                            isSelected ? 'bg-primary/5' : ''
                          }`}
                        >
                          <td className={`px-4 py-3 ${isSelected ? 'font-semibold text-primary' : 'font-medium'}`}>
                            {method.method}
                            {isSelected && (
                              <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                                Selected
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            ₹{method.yearlyBreakdown[0]?.depreciationExpense.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                          </td>
                          <td className="px-4 py-3 text-right">
                            ₹{method.finalBookValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                          </td>
                          <td className="px-4 py-3 text-right text-green-600 dark:text-green-400">
                            ₹{method.totalTaxSavings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Key Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
              <div className="flex gap-2">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                    Tax Benefits
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    You'll save ₹{result.totalTaxSavings.toLocaleString('en-IN', { maximumFractionDigits: 0 })} in taxes over {usefulLife} years through depreciation deductions.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
              <div className="flex gap-2">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    First Year Impact
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Year 1 depreciation: ₹{result.yearlyBreakdown[0]?.depreciationExpense.toLocaleString('en-IN', { maximumFractionDigits: 0 })} 
                    ({((result.yearlyBreakdown[0]?.depreciationExpense / depreciableAmount) * 100).toFixed(1)}% of depreciable amount)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Warning for salvage value */}
          {salvageValue === 0 && (
            <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
              <div className="flex gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                    Zero Salvage Value
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Asset will fully depreciate to ₹0. Consider if the asset will have any residual value.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    />
  )
}
