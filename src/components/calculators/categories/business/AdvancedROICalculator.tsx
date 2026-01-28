"use client"

import React, { useState } from 'react';
import { Calculator, TrendingUp, DollarSign, Calendar, BarChart3, PieChart } from 'lucide-react';

/**
 * Advanced ROI Calculator
 * 
 * Features:
 * - Simple ROI
 * - Net Present Value (NPV)
 * - Internal Rate of Return (IRR)
 * - Payback Period
 * - Cash flow analysis
 * - Multiple period tracking
 */

interface CashFlow {
  period: number;
  amount: number;
}

interface ROIResult {
  roi: number;
  npv?: number;
  irr?: number;
  paybackPeriod?: number;
  totalCashFlow: number;
  netProfit: number;
  steps: string[];
}

export function AdvancedROICalculator() {
  const [method, setMethod] = useState<'simple' | 'npv' | 'cashflow'>('simple');
  
  // Simple ROI
  const [initialInvestment, setInitialInvestment] = useState('10000');
  const [finalValue, setFinalValue] = useState('15000');
  const [timePeriod, setTimePeriod] = useState('2');
  
  // NPV Method
  const [discountRate, setDiscountRate] = useState('10');
  
  // Cash Flow Method
  const [cashFlows, setCashFlows] = useState<CashFlow[]>([
    { period: 0, amount: -10000 },
    { period: 1, amount: 3000 },
    { period: 2, amount: 4000 },
    { period: 3, amount: 5000 },
  ]);
  
  const [result, setResult] = useState<ROIResult | null>(null);

  const calculateSimpleROI = (): ROIResult => {
    const initial = parseFloat(initialInvestment) || 0;
    const final = parseFloat(finalValue) || 0;
    const years = parseFloat(timePeriod) || 1;

    const netProfit = final - initial;
    const roi = initial > 0 ? (netProfit / initial) * 100 : 0;
    const annualizedROI = years > 0 ? (Math.pow(final / initial, 1 / years) - 1) * 100 : roi;

    return {
      roi: annualizedROI,
      netProfit,
      totalCashFlow: final,
      steps: [
        `Initial Investment: $${initial.toFixed(2)}`,
        `Final Value: $${final.toFixed(2)}`,
        `Net Profit: $${netProfit.toFixed(2)}`,
        `Simple ROI: ${roi.toFixed(2)}%`,
        `Annualized ROI: ${annualizedROI.toFixed(2)}% (over ${years} years)`,
      ]
    };
  };

  const calculateNPV = (flows: CashFlow[], rate: number): number => {
    return flows.reduce((npv, flow) => {
      return npv + flow.amount / Math.pow(1 + rate / 100, flow.period);
    }, 0);
  };

  const calculateIRR = (flows: CashFlow[]): number => {
    // Newton-Raphson method for IRR
    let irr = 0.1; // Initial guess 10%
    const maxIterations = 100;
    const tolerance = 0.0001;

    for (let i = 0; i < maxIterations; i++) {
      let npv = 0;
      let dnpv = 0;

      flows.forEach(flow => {
        const factor = Math.pow(1 + irr, flow.period);
        npv += flow.amount / factor;
        dnpv -= flow.period * flow.amount / (factor * (1 + irr));
      });

      const newIrr = irr - npv / dnpv;
      
      if (Math.abs(newIrr - irr) < tolerance) {
        return newIrr * 100;
      }
      
      irr = newIrr;
    }

    return irr * 100;
  };

  const calculatePaybackPeriod = (flows: CashFlow[]): number => {
    let cumulative = 0;
    
    for (let i = 0; i < flows.length; i++) {
      cumulative += flows[i].amount;
      if (cumulative >= 0) {
        // Interpolate within the period
        const previousCumulative = cumulative - flows[i].amount;
        const fraction = -previousCumulative / flows[i].amount;
        return flows[i].period - 1 + fraction;
      }
    }
    
    return -1; // Investment not recovered
  };

  const calculateNPVMethod = (): ROIResult => {
    const rate = parseFloat(discountRate) || 10;
    const initial = parseFloat(initialInvestment) || 0;
    const final = parseFloat(finalValue) || 0;
    const years = parseFloat(timePeriod) || 1;

    // Generate simple cash flows
    const flows: CashFlow[] = [
      { period: 0, amount: -initial },
      { period: years, amount: final }
    ];

    const npv = calculateNPV(flows, rate);
    const netProfit = final - initial;
    const roi = initial > 0 ? (netProfit / initial) * 100 : 0;

    return {
      roi,
      npv,
      netProfit,
      totalCashFlow: final,
      steps: [
        `Initial Investment: $${initial.toFixed(2)} (Period 0)`,
        `Return: $${final.toFixed(2)} (Period ${years})`,
        `Discount Rate: ${rate}%`,
        `PV of Returns: $${(final / Math.pow(1 + rate / 100, years)).toFixed(2)}`,
        `NPV = PV of Returns - Initial Investment`,
        `NPV = $${npv.toFixed(2)}`,
        npv > 0 ? '✅ Positive NPV - Investment is worthwhile' : '❌ Negative NPV - Investment may not be worthwhile'
      ]
    };
  };

  const calculateCashFlowMethod = (): ROIResult => {
    const rate = parseFloat(discountRate) || 10;
    
    if (cashFlows.length === 0) {
      return {
        roi: 0,
        netProfit: 0,
        totalCashFlow: 0,
        steps: ['No cash flows defined']
      };
    }

    const npv = calculateNPV(cashFlows, rate);
    const irr = calculateIRR(cashFlows);
    const paybackPeriod = calculatePaybackPeriod(cashFlows);
    
    const initialInv = Math.abs(cashFlows[0].amount);
    const totalInflows = cashFlows.slice(1).reduce((sum, cf) => sum + Math.max(0, cf.amount), 0);
    const netProfit = totalInflows - initialInv;
    const roi = initialInv > 0 ? (netProfit / initialInv) * 100 : 0;

    const steps = [
      `Cash Flows Analysis:`,
      ...cashFlows.map(cf => `  Period ${cf.period}: $${cf.amount.toFixed(2)}`),
      ``,
      `NPV @ ${rate}%: $${npv.toFixed(2)}`,
      `IRR: ${irr.toFixed(2)}%`,
      paybackPeriod > 0 ? `Payback Period: ${paybackPeriod.toFixed(2)} periods` : 'Investment not recovered',
      `Simple ROI: ${roi.toFixed(2)}%`,
    ];

    return {
      roi,
      npv,
      irr,
      paybackPeriod: paybackPeriod > 0 ? paybackPeriod : undefined,
      netProfit,
      totalCashFlow: totalInflows,
      steps
    };
  };

  const calculate = () => {
    let res: ROIResult;
    
    if (method === 'simple') {
      res = calculateSimpleROI();
    } else if (method === 'npv') {
      res = calculateNPVMethod();
    } else {
      res = calculateCashFlowMethod();
    }
    
    setResult(res);
  };

  const addCashFlow = () => {
    const lastPeriod = cashFlows.length > 0 ? cashFlows[cashFlows.length - 1].period : -1;
    setCashFlows([...cashFlows, { period: lastPeriod + 1, amount: 0 }]);
  };

  const updateCashFlow = (index: number, field: 'period' | 'amount', value: string) => {
    const updated = [...cashFlows];
    updated[index][field] = parseFloat(value) || 0;
    setCashFlows(updated);
  };

  const removeCashFlow = (index: number) => {
    setCashFlows(cashFlows.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Method Selector */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Calculation Method
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { value: 'simple', label: 'Simple ROI', desc: 'Basic percentage return', icon: Calculator },
            { value: 'npv', label: 'NPV Analysis', desc: 'Time value of money', icon: DollarSign },
            { value: 'cashflow', label: 'Cash Flow (IRR)', desc: 'Multiple periods', icon: BarChart3 }
          ].map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.value}
                onClick={() => setMethod(m.value as any)}
                className={`p-3 rounded-lg text-left transition-all ${
                  method === m.value
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-purple-100 border border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-4 h-4" />
                  <div className="font-semibold">{m.label}</div>
                </div>
                <div className={`text-xs ${method === m.value ? 'text-purple-100' : 'text-gray-500'}`}>
                  {m.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Section */}
      {(method === 'simple' || method === 'npv') && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Initial Investment ($)
              </label>
              <input
                type="number"
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(e.target.value)}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500"
                placeholder="10000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Final Value ($)
              </label>
              <input
                type="number"
                value={finalValue}
                onChange={(e) => setFinalValue(e.target.value)}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500"
                placeholder="15000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Period (years)
              </label>
              <input
                type="number"
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500"
                placeholder="2"
              />
            </div>
            {method === 'npv' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Rate (%)
                </label>
                <input
                  type="number"
                  value={discountRate}
                  onChange={(e) => setDiscountRate(e.target.value)}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500"
                  placeholder="10"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {method === 'cashflow' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700">
              Cash Flows by Period
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={discountRate}
                onChange={(e) => setDiscountRate(e.target.value)}
                className="w-24 p-2 border rounded-md text-sm"
                placeholder="Rate %"
              />
              <button
                onClick={addCashFlow}
                className="px-3 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition"
              >
                + Add Period
              </button>
            </div>
          </div>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {cashFlows.map((cf, idx) => (
              <div key={idx} className="flex gap-2 items-center bg-gray-50 p-2 rounded-md">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={cf.period}
                    onChange={(e) => updateCashFlow(idx, 'period', e.target.value)}
                    className="p-2 border rounded-md text-sm"
                    placeholder="Period"
                  />
                  <input
                    type="number"
                    value={cf.amount}
                    onChange={(e) => updateCashFlow(idx, 'amount', e.target.value)}
                    className="p-2 border rounded-md text-sm"
                    placeholder="Amount"
                  />
                </div>
                {cashFlows.length > 1 && (
                  <button
                    onClick={() => removeCashFlow(idx)}
                    className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-sm"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calculate Button */}
      <button
        onClick={calculate}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold flex items-center justify-center gap-2 shadow-lg"
      >
        <Calculator className="w-5 h-5" />
        Calculate ROI
      </button>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Main Result */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-xl shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div>
                <div className="text-sm opacity-90">Return on Investment</div>
                <div className="text-4xl font-bold">{result.roi.toFixed(2)}%</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/20">
              {result.npv !== undefined && (
                <div>
                  <div className="text-xs opacity-75">NPV</div>
                  <div className="text-lg font-semibold">${result.npv.toFixed(2)}</div>
                </div>
              )}
              {result.irr !== undefined && (
                <div>
                  <div className="text-xs opacity-75">IRR</div>
                  <div className="text-lg font-semibold">{result.irr.toFixed(2)}%</div>
                </div>
              )}
              {result.paybackPeriod !== undefined && (
                <div>
                  <div className="text-xs opacity-75">Payback</div>
                  <div className="text-lg font-semibold">{result.paybackPeriod.toFixed(1)} yrs</div>
                </div>
              )}
              <div>
                <div className="text-xs opacity-75">Net Profit</div>
                <div className="text-lg font-semibold">${result.netProfit.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Calculation Steps */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Calculation Breakdown
            </h4>
            <div className="space-y-1 text-sm font-mono text-gray-700">
              {result.steps.map((step, idx) => (
                <div key={idx}>{step}</div>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-600" />
              Investment Analysis
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              {result.roi > 15 && (
                <li className="flex gap-2">
                  <span className="text-green-600">✅</span>
                  <span>Excellent ROI - significantly above average market returns</span>
                </li>
              )}
              {result.roi >= 8 && result.roi <= 15 && (
                <li className="flex gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>Good ROI - comparable to market average</span>
                </li>
              )}
              {result.roi > 0 && result.roi < 8 && (
                <li className="flex gap-2">
                  <span className="text-yellow-600">⚠️</span>
                  <span>Moderate ROI - consider alternative investments</span>
                </li>
              )}
              {result.roi <= 0 && (
                <li className="flex gap-2">
                  <span className="text-red-600">❌</span>
                  <span>Negative ROI - investment resulted in a loss</span>
                </li>
              )}
              
              {result.npv !== undefined && (
                <li className="flex gap-2">
                  <span className={result.npv > 0 ? 'text-green-600' : 'text-red-600'}>
                    {result.npv > 0 ? '✅' : '❌'}
                  </span>
                  <span>
                    NPV is {result.npv > 0 ? 'positive' : 'negative'} - 
                    investment {result.npv > 0 ? 'adds value' : 'destroys value'} in present terms
                  </span>
                </li>
              )}
              
              {result.irr !== undefined && result.irr > parseFloat(discountRate) && (
                <li className="flex gap-2">
                  <span className="text-green-600">✅</span>
                  <span>IRR ({result.irr.toFixed(1)}%) exceeds discount rate ({discountRate}%) - project is viable</span>
                </li>
              )}
              
              {result.paybackPeriod !== undefined && (
                <li className="flex gap-2">
                  <span className="text-blue-600">⏱️</span>
                  <span>
                    Investment recovered in {result.paybackPeriod.toFixed(1)} periods
                    {result.paybackPeriod < 3 ? ' - Quick payback' : result.paybackPeriod > 5 ? ' - Long payback period' : ''}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
