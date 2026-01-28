"use client"

import React, { useState } from 'react';
import { Calculator, TrendingUp, Users, DollarSign, Percent, PieChart } from 'lucide-react';

/**
 * Advanced Customer Lifetime Value (CLV) Calculator
 * 
 * Features:
 * - Multiple calculation methods (Simple, Retention-based, Cohort)
 * - Discount rate consideration
 * - Churn rate analysis
 * - Profit margin calculation
 * - Scenario comparison
 * - Visual breakdown
 */

interface CLVResult {
  clv: number;
  monthlyValue: number;
  lifetimeMonths: number;
  totalRevenue: number;
  totalProfit: number;
  steps: string[];
}

export function AdvancedCLVCalculator() {
  const [method, setMethod] = useState<'simple' | 'retention' | 'cohort'>('simple');
  
  // Simple Method Inputs
  const [avgPurchase, setAvgPurchase] = useState('50');
  const [purchaseFreq, setPurchaseFreq] = useState('4');
  const [customerLifespan, setCustomerLifespan] = useState('3');
  
  // Retention Method Inputs
  const [monthlyRevenue, setMonthlyRevenue] = useState('100');
  const [churnRate, setChurnRate] = useState('5');
  const [profitMargin, setProfitMargin] = useState('20');
  const [discountRate, setDiscountRate] = useState('10');
  
  const [result, setResult] = useState<CLVResult | null>(null);

  const calculateSimpleCLV = (): CLVResult => {
    const apv = parseFloat(avgPurchase) || 0;
    const freq = parseFloat(purchaseFreq) || 0;
    const lifespan = parseFloat(customerLifespan) || 0;
    const margin = parseFloat(profitMargin) / 100 || 0.2;

    const annualValue = apv * freq;
    const totalRevenue = annualValue * lifespan;
    const totalProfit = totalRevenue * margin;
    const clv = totalProfit;

    return {
      clv,
      monthlyValue: annualValue / 12,
      lifetimeMonths: lifespan * 12,
      totalRevenue,
      totalProfit,
      steps: [
        `Annual Customer Value = Avg Purchase × Frequency = $${apv} × ${freq} = $${annualValue.toFixed(2)}`,
        `Lifetime Revenue = Annual Value × Lifespan = $${annualValue.toFixed(2)} × ${lifespan} = $${totalRevenue.toFixed(2)}`,
        `Lifetime Profit = Revenue × Margin = $${totalRevenue.toFixed(2)} × ${(margin * 100).toFixed(0)}% = $${totalProfit.toFixed(2)}`,
        `CLV = $${clv.toFixed(2)}`
      ]
    };
  };

  const calculateRetentionCLV = (): CLVResult => {
    const monthRev = parseFloat(monthlyRevenue) || 0;
    const churn = parseFloat(churnRate) / 100 || 0.05;
    const margin = parseFloat(profitMargin) / 100 || 0.2;
    const discount = parseFloat(discountRate) / 100 / 12 || 0.008333; // Monthly discount

    // Lifetime in months = 1 / churn rate
    const lifetimeMonths = churn > 0 ? 1 / churn : 120;
    
    // Present Value of future cash flows
    let clv = 0;
    const monthlyProfit = monthRev * margin;
    
    for (let month = 1; month <= Math.min(lifetimeMonths, 120); month++) {
      const survivalProb = Math.pow(1 - churn, month);
      const discountFactor = Math.pow(1 + discount, -month);
      clv += monthlyProfit * survivalProb * discountFactor;
    }

    const totalRevenue = monthRev * lifetimeMonths;
    const totalProfit = totalRevenue * margin;

    return {
      clv,
      monthlyValue: monthRev,
      lifetimeMonths,
      totalRevenue,
      totalProfit,
      steps: [
        `Monthly Churn Rate: ${(churn * 100).toFixed(2)}%`,
        `Expected Lifetime: 1 / Churn = 1 / ${churn.toFixed(4)} = ${lifetimeMonths.toFixed(1)} months`,
        `Monthly Profit: $${monthRev} × ${(margin * 100).toFixed(0)}% = $${monthlyProfit.toFixed(2)}`,
        `Discount Rate (Monthly): ${(discount * 100).toFixed(2)}%`,
        `Present Value CLV (with churn & discount): $${clv.toFixed(2)}`
      ]
    };
  };

  const calculateCohortCLV = (): CLVResult => {
    const monthRev = parseFloat(monthlyRevenue) || 0;
    const churn = parseFloat(churnRate) / 100 || 0.05;
    const margin = parseFloat(profitMargin) / 100 || 0.2;
    
    // Cohort analysis: track customer value over 36 months
    let totalValue = 0;
    let remainingCustomers = 1.0;
    const monthlyProfit = monthRev * margin;
    
    for (let month = 1; month <= 36; month++) {
      remainingCustomers *= (1 - churn);
      totalValue += monthlyProfit * remainingCustomers;
    }

    const lifetimeMonths = churn > 0 ? 1 / churn : 36;
    const totalRevenue = monthRev * lifetimeMonths;
    const totalProfit = totalRevenue * margin;

    return {
      clv: totalValue,
      monthlyValue: monthRev,
      lifetimeMonths,
      totalRevenue,
      totalProfit,
      steps: [
        `Cohort Analysis (36 months)`,
        `Starting Customers: 100%`,
        `Monthly Churn: ${(churn * 100).toFixed(2)}%`,
        `Month 1 Value: $${(monthlyProfit * 1.0).toFixed(2)}`,
        `Month 6 Value: $${(monthlyProfit * Math.pow(1 - churn, 6)).toFixed(2)}`,
        `Month 12 Value: $${(monthlyProfit * Math.pow(1 - churn, 12)).toFixed(2)}`,
        `Cumulative CLV: $${totalValue.toFixed(2)}`
      ]
    };
  };

  const calculate = () => {
    let res: CLVResult;
    
    if (method === 'simple') {
      res = calculateSimpleCLV();
    } else if (method === 'retention') {
      res = calculateRetentionCLV();
    } else {
      res = calculateCohortCLV();
    }
    
    setResult(res);
  };

  return (
    <div className="space-y-6">
      {/* Method Selector */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Calculation Method
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { value: 'simple', label: 'Simple CLV', desc: 'Basic calculation' },
            { value: 'retention', label: 'Retention-Based', desc: 'With churn & discount' },
            { value: 'cohort', label: 'Cohort Analysis', desc: '36-month tracking' }
          ].map((m) => (
            <button
              key={m.value}
              onClick={() => setMethod(m.value as any)}
              className={`p-3 rounded-lg text-left transition-all ${
                method === m.value
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-blue-100 border border-gray-200'
              }`}
            >
              <div className="font-semibold">{m.label}</div>
              <div className={`text-xs mt-1 ${method === m.value ? 'text-blue-100' : 'text-gray-500'}`}>
                {m.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Input Section */}
      {method === 'simple' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Average Purchase Value ($)
            </label>
            <input
              type="number"
              value={avgPurchase}
              onChange={(e) => setAvgPurchase(e.target.value)}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Frequency (per year)
            </label>
            <input
              type="number"
              value={purchaseFreq}
              onChange={(e) => setPurchaseFreq(e.target.value)}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Lifespan (years)
            </label>
            <input
              type="number"
              value={customerLifespan}
              onChange={(e) => setCustomerLifespan(e.target.value)}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profit Margin (%)
            </label>
            <input
              type="number"
              value={profitMargin}
              onChange={(e) => setProfitMargin(e.target.value)}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="20"
            />
          </div>
        </div>
      )}

      {(method === 'retention' || method === 'cohort') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Revenue per Customer ($)
            </label>
            <input
              type="number"
              value={monthlyRevenue}
              onChange={(e) => setMonthlyRevenue(e.target.value)}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Churn Rate (%)
            </label>
            <input
              type="number"
              value={churnRate}
              onChange={(e) => setChurnRate(e.target.value)}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profit Margin (%)
            </label>
            <input
              type="number"
              value={profitMargin}
              onChange={(e) => setProfitMargin(e.target.value)}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="20"
            />
          </div>
          {method === 'retention' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Annual Discount Rate (%)
              </label>
              <input
                type="number"
                value={discountRate}
                onChange={(e) => setDiscountRate(e.target.value)}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="10"
              />
            </div>
          )}
        </div>
      )}

      {/* Calculate Button */}
      <button
        onClick={calculate}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold flex items-center justify-center gap-2 shadow-lg"
      >
        <Calculator className="w-5 h-5" />
        Calculate CLV
      </button>

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Main Result */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-xl shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <DollarSign className="w-8 h-8" />
              </div>
              <div>
                <div className="text-sm opacity-90">Customer Lifetime Value</div>
                <div className="text-4xl font-bold">${result.clv.toFixed(2)}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/20">
              <div>
                <div className="text-xs opacity-75">Monthly Value</div>
                <div className="text-lg font-semibold">${result.monthlyValue.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs opacity-75">Lifetime</div>
                <div className="text-lg font-semibold">{result.lifetimeMonths.toFixed(0)} mo</div>
              </div>
              <div>
                <div className="text-xs opacity-75">Total Profit</div>
                <div className="text-lg font-semibold">${result.totalProfit.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Calculation Steps */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Calculation Breakdown
            </h4>
            <div className="space-y-2">
              {result.steps.map((step, idx) => (
                <div key={idx} className="flex gap-2 text-sm">
                  <span className="text-blue-600 font-semibold">{idx + 1}.</span>
                  <span className="text-gray-700">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              Key Insights
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="text-green-600">•</span>
                <span>Target CAC should be &lt; ${(result.clv * 0.33).toFixed(2)} (33% of CLV)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600">•</span>
                <span>Payback period: ~{(result.lifetimeMonths / 3).toFixed(0)} months at 3× LTV:CAC ratio</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600">•</span>
                <span>Focus on retention - extending lifetime by 20% adds ${(result.clv * 0.2).toFixed(2)} per customer</span>
              </li>
              {method === 'retention' && (
                <li className="flex gap-2">
                  <span className="text-green-600">•</span>
                  <span>Reducing churn by 1% could increase CLV by ~${(result.clv * 0.15).toFixed(2)}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
