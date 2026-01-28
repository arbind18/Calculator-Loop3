"use client";

import React, { useState, useMemo } from 'react';
import { FinancialCalculatorTemplate } from '@/components/templates/FinancialCalculatorTemplate';
import { LineChart, Target, TrendingUp, AlertTriangle, BarChart3, DollarSign } from 'lucide-react';

interface Scenario {
  volume: number;
  revenue: number;
  variableCosts: number;
  fixedCosts: number;
  totalCosts: number;
  profit: number;
  profitMargin: number;
}

interface CVPResults {
  breakEven: {
    units: number;
    revenue: number;
    contributionMargin: number;
    cmRatio: number;
  };
  current: {
    revenue: number;
    totalCosts: number;
    profit: number;
    profitMargin: number;
    marginOfSafety: number;
    mosPercent: number;
  };
  leverage: {
    operatingLeverage: number;
    dolPercent: number;
    profitSensitivity: string;
  };
  whatIf: {
    price10Increase: Scenario;
    price10Decrease: Scenario;
    volume20Increase: Scenario;
    volume20Decrease: Scenario;
    fixedCost15Increase: Scenario;
  };
  targetAnalysis: {
    unitsFor50kProfit: number;
    revenueFor50kProfit: number;
    unitsFor100kProfit: number;
    revenueFor100kProfit: number;
    unitsFor20MarginPercent: number;
    revenueFor20MarginPercent: number;
  };
}

export default function AdvancedCVPCalculator() {
  const [sellingPrice, setSellingPrice] = useState<string>('100');
  const [variableCost, setVariableCost] = useState<string>('60');
  const [fixedCosts, setFixedCosts] = useState<string>('50000');
  const [currentVolume, setCurrentVolume] = useState<string>('2000');

  const calculateScenario = (
    price: number,
    varCost: number,
    fixed: number,
    volume: number
  ): Scenario => {
    const revenue = price * volume;
    const variableCosts = varCost * volume;
    const totalCosts = fixed + variableCosts;
    const profit = revenue - totalCosts;
    const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;

    return {
      volume,
      revenue,
      variableCosts,
      fixedCosts: fixed,
      totalCosts,
      profit,
      profitMargin
    };
  };

  const results: CVPResults = useMemo(() => {
    const price = parseFloat(sellingPrice) || 0;
    const varCost = parseFloat(variableCost) || 0;
    const fixed = parseFloat(fixedCosts) || 0;
    const volume = parseFloat(currentVolume) || 0;

    // Break-even analysis
    const cm = price - varCost;
    const cmRatio = price > 0 ? (cm / price) * 100 : 0;
    const beUnits = cm > 0 ? fixed / cm : 0;
    const beRevenue = beUnits * price;

    // Current scenario
    const current = calculateScenario(price, varCost, fixed, volume);
    const mos = current.revenue - beRevenue;
    const mosPercent = current.revenue > 0 ? (mos / current.revenue) * 100 : 0;

    // Operating leverage
    const totalCM = cm * volume;
    const operatingLeverage = current.profit !== 0 ? totalCM / current.profit : 0;
    const dolPercent = operatingLeverage * 100;

    let profitSensitivity = '';
    if (operatingLeverage > 5) {
      profitSensitivity = 'Very High - Small sales changes cause dramatic profit swings';
    } else if (operatingLeverage > 3) {
      profitSensitivity = 'High - Profits highly sensitive to volume changes';
    } else if (operatingLeverage > 1.5) {
      profitSensitivity = 'Moderate - Balanced risk/reward profile';
    } else {
      profitSensitivity = 'Low - Stable profits, less sensitive to volume';
    }

    // What-if scenarios
    const price10Increase = calculateScenario(price * 1.1, varCost, fixed, volume);
    const price10Decrease = calculateScenario(price * 0.9, varCost, fixed, volume);
    const volume20Increase = calculateScenario(price, varCost, fixed, volume * 1.2);
    const volume20Decrease = calculateScenario(price, varCost, fixed, volume * 0.8);
    const fixedCost15Increase = calculateScenario(price, varCost, fixed * 1.15, volume);

    // Target analysis
    const unitsForProfit = (targetProfit: number) => 
      cm > 0 ? (fixed + targetProfit) / cm : 0;
    
    const unitsFor50k = unitsForProfit(50000);
    const unitsFor100k = unitsForProfit(100000);

    // Units needed for 20% profit margin
    // Profit Margin = (Revenue - Total Costs) / Revenue = 0.20
    // (P*Q - FC - VC*Q) / P*Q = 0.20
    // P*Q - FC - VC*Q = 0.20*P*Q
    // 0.80*P*Q = FC + VC*Q
    // Q = FC / (0.80*P - VC)
    const unitsFor20Margin = (0.80 * price - varCost) > 0 
      ? fixed / (0.80 * price - varCost)
      : 0;

    return {
      breakEven: {
        units: Math.round(beUnits),
        revenue: beRevenue,
        contributionMargin: cm,
        cmRatio
      },
      current: {
        revenue: current.revenue,
        totalCosts: current.totalCosts,
        profit: current.profit,
        profitMargin: current.profitMargin,
        marginOfSafety: mos,
        mosPercent
      },
      leverage: {
        operatingLeverage,
        dolPercent,
        profitSensitivity
      },
      whatIf: {
        price10Increase,
        price10Decrease,
        volume20Increase,
        volume20Decrease,
        fixedCost15Increase
      },
      targetAnalysis: {
        unitsFor50kProfit: Math.round(unitsFor50k),
        revenueFor50kProfit: unitsFor50k * price,
        unitsFor100kProfit: Math.round(unitsFor100k),
        revenueFor100kProfit: unitsFor100k * price,
        unitsFor20MarginPercent: Math.round(unitsFor20Margin),
        revenueFor20MarginPercent: unitsFor20Margin * price
      }
    };
  }, [sellingPrice, variableCost, fixedCosts, currentVolume]);

  const insights = useMemo(() => {
    const items: string[] = [];
    const { breakEven, current, leverage, whatIf } = results;

    if (current.profitMargin > 20) {
      items.push(`✓ Strong profit margin of ${current.profitMargin.toFixed(1)}% indicates healthy profitability`);
    } else if (current.profitMargin > 0 && current.profitMargin <= 10) {
      items.push(`⚠ Thin profit margin of ${current.profitMargin.toFixed(1)}% - limited room for error`);
    }

    if (current.mosPercent > 30) {
      items.push(`✓ Comfortable ${current.mosPercent.toFixed(1)}% margin of safety - good cushion above break-even`);
    } else if (current.mosPercent > 0 && current.mosPercent < 15) {
      items.push(`⚠ Low margin of safety at ${current.mosPercent.toFixed(1)}% - vulnerable to sales decline`);
    }

    const priceImpact = ((whatIf.price10Increase.profit - current.profit) / current.profit) * 100;
    const volumeImpact = ((whatIf.volume20Increase.profit - current.profit) / current.profit) * 100;

    if (priceImpact > volumeImpact) {
      items.push(`ℹ Price changes have stronger profit impact (${priceImpact.toFixed(0)}%) than volume changes (${volumeImpact.toFixed(0)}%)`);
    } else {
      items.push(`ℹ Volume changes drive more profit impact (${volumeImpact.toFixed(0)}%) than pricing (${priceImpact.toFixed(0)}%)`);
    }

    if (leverage.operatingLeverage > 3) {
      items.push(`⚠ High operating leverage (${leverage.operatingLeverage.toFixed(2)}x) - ${leverage.profitSensitivity}`);
    } else if (leverage.operatingLeverage < 1.5) {
      items.push(`ℹ Low operating leverage (${leverage.operatingLeverage.toFixed(2)}x) - more stable but limited profit growth potential`);
    }

    if (breakEven.cmRatio > 40) {
      items.push(`✓ Strong ${breakEven.cmRatio.toFixed(1)}% contribution margin ratio provides good profit leverage`);
    }

    return items;
  }, [results]);

  const warnings = useMemo(() => {
    const items: string[] = [];
    const { breakEven, current, whatIf } = results;

    if (breakEven.contributionMargin <= 0) {
      items.push('⚠ CRITICAL: Negative contribution margin - product cannot be profitable at any volume');
    }

    if (current.profit < 0) {
      items.push('⚠ Currently operating at a loss - need to increase volume, price, or reduce costs');
    }

    if (current.mosPercent < 0) {
      items.push('⚠ Sales below break-even point - immediate action needed to avoid continued losses');
    }

    if (whatIf.volume20Decrease.profit < 0) {
      items.push('⚠ A 20% volume drop would result in losses - consider cost reduction strategies');
    }

    if (whatIf.fixedCost15Increase.profit < current.profit * 0.5) {
      items.push('⚠ 15% fixed cost increase would cut profits by >50% - monitor fixed expenses carefully');
    }

    return items;
  }, [results]);

  const inputFields = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selling Price per Unit
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="number"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Variable Cost per Unit
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="number"
              value={variableCost}
              onChange={(e) => setVariableCost(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="60"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Fixed Costs (Monthly)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="number"
              value={fixedCosts}
              onChange={(e) => setFixedCosts(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="50000"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Sales Volume (Units)
          </label>
          <input
            type="number"
            value={currentVolume}
            onChange={(e) => setCurrentVolume(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="2000"
          />
        </div>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Cost-Volume-Profit Analysis</p>
            <p>This tool analyzes the relationships between costs, volume, and profits to help with pricing, volume, and cost management decisions.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const resultCards = [
    {
      title: 'Break-Even Analysis',
      icon: Target,
      color: 'blue',
      data: [
        { label: 'Break-Even Units', value: results.breakEven.units.toLocaleString(), subValue: 'units to cover all costs' },
        { label: 'Break-Even Revenue', value: `$${results.breakEven.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, subValue: 'revenue at break-even' },
        { label: 'Contribution Margin', value: `$${results.breakEven.contributionMargin.toFixed(2)}`, subValue: `${results.breakEven.cmRatio.toFixed(1)}% ratio` }
      ]
    },
    {
      title: 'Current Performance',
      icon: BarChart3,
      color: results.current.profit >= 0 ? 'green' : 'red',
      data: [
        { label: 'Revenue', value: `$${results.current.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, subValue: 'total sales' },
        { label: 'Total Costs', value: `$${results.current.totalCosts.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, subValue: 'fixed + variable' },
        { label: 'Net Profit', value: `$${results.current.profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, subValue: `${results.current.profitMargin.toFixed(1)}% margin` },
        { label: 'Margin of Safety', value: `$${results.current.marginOfSafety.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, subValue: `${results.current.mosPercent.toFixed(1)}% cushion` }
      ]
    },
    {
      title: 'Operating Leverage',
      icon: TrendingUp,
      color: 'purple',
      data: [
        { label: 'Degree of Operating Leverage', value: `${results.leverage.operatingLeverage.toFixed(2)}x`, subValue: results.leverage.profitSensitivity },
        { label: 'DOL Percentage', value: `${results.leverage.dolPercent.toFixed(0)}%`, subValue: 'profit change per 1% volume change' }
      ]
    },
    {
      title: 'What-If Scenarios',
      icon: LineChart,
      color: 'orange',
      data: [
        { label: 'Price +10%', value: `$${results.whatIf.price10Increase.profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, subValue: `${results.whatIf.price10Increase.profitMargin.toFixed(1)}% margin` },
        { label: 'Price -10%', value: `$${results.whatIf.price10Decrease.profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, subValue: `${results.whatIf.price10Decrease.profitMargin.toFixed(1)}% margin` },
        { label: 'Volume +20%', value: `$${results.whatIf.volume20Increase.profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, subValue: `${results.whatIf.volume20Increase.profitMargin.toFixed(1)}% margin` },
        { label: 'Volume -20%', value: `$${results.whatIf.volume20Decrease.profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, subValue: `${results.whatIf.volume20Decrease.profitMargin.toFixed(1)}% margin` },
        { label: 'Fixed Costs +15%', value: `$${results.whatIf.fixedCost15Increase.profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, subValue: `${results.whatIf.fixedCost15Increase.profitMargin.toFixed(1)}% margin` }
      ]
    },
    {
      title: 'Target Achievement',
      icon: Target,
      color: 'green',
      data: [
        { label: 'For $50,000 Profit', value: `${results.targetAnalysis.unitsFor50kProfit.toLocaleString()} units`, subValue: `$${results.targetAnalysis.revenueFor50kProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })} revenue` },
        { label: 'For $100,000 Profit', value: `${results.targetAnalysis.unitsFor100kProfit.toLocaleString()} units`, subValue: `$${results.targetAnalysis.revenueFor100kProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })} revenue` },
        { label: 'For 20% Profit Margin', value: `${results.targetAnalysis.unitsFor20MarginPercent.toLocaleString()} units`, subValue: `$${results.targetAnalysis.revenueFor20MarginPercent.toLocaleString(undefined, { maximumFractionDigits: 0 })} revenue` }
      ]
    }
  ];

  return (
    <FinancialCalculatorTemplate
      title="Advanced Cost-Volume-Profit (CVP) Analysis"
      description="Comprehensive CVP analysis with operating leverage, what-if scenarios, and target profit calculations"
      icon={LineChart}
      color="blue"
      inputFields={inputFields}
      resultCards={resultCards}
      insights={insights}
      warnings={warnings}
    />
  );
}
