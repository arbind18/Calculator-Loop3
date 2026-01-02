"use client"

import { VoiceNumberButton } from "@/components/ui/VoiceNumberButton"

import React, { useState, useEffect, useMemo } from 'react';
import { Calculator, TrendingUp, DollarSign, PieChart, BarChart, Activity, Users, Briefcase, Zap, Copy, Check, Lightbulb, RefreshCw, Sparkles, BarChart3 } from 'lucide-react';
import { FinancialCalculatorTemplate } from '@/components/calculators/templates/FinancialCalculatorTemplate';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FAQSection, getBusinessFAQs } from '@/components/calculators/ui/FAQSection';
import { SeoContentGenerator } from "@/components/seo/SeoContentGenerator"

interface BusinessInput {
  name: string;
  label: string;
  type: 'number' | 'text' | 'select' | 'slider';
  options?: string[];
  defaultValue?: number | string;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  helpText?: string;
}

interface CalculationResult {
  result: string | number;
  explanation?: string;
  steps?: string[];
  tips?: string[];
  formula?: string;
  visualData?: Array<{ label: string; value: number }>;
}

interface BusinessToolConfig {
  title: string;
  description: string;
  inputs: BusinessInput[];
  calculate: (inputs: Record<string, any>) => CalculationResult;
  presetScenarios?: Array<{ name: string; icon?: string; values: Record<string, any> }>;
}

// Helper for safe number parsing
const safeFloat = (val: any) => {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
};

const getToolConfig = (id: string | undefined): BusinessToolConfig => {
  if (!id) return {
    title: 'Calculator Not Found',
    description: 'This calculator configuration is missing.',
    inputs: [],
    calculate: () => ({ result: 'Error' })
  };
  
  // --- Profit & Margin ---
  if (
    id === 'profit-margin' ||
    id === 'gross-profit-calculator' ||
    id === 'net-profit-calculator' ||
    id === 'gross-margin-calculator' ||
    id === 'net-margin-calculator'
  ) {
    return {
      title: id === 'gross-margin-calculator'
        ? 'Gross Margin Calculator'
        : id === 'net-margin-calculator'
          ? 'Net Margin Calculator'
          : 'Profit Margin Calculator',
      description: 'Calculate Gross and Net Profit Margins.',
      presetScenarios: [
        { name: 'Retail', icon: '🏪', values: { revenue: 10000, cogs: 6000, expenses: 2000 } },
        { name: 'Service', icon: '💼', values: { revenue: 5000, cogs: 1000, expenses: 1500 } },
        { name: 'Startup', icon: '🚀', values: { revenue: 50000, cogs: 20000, expenses: 15000 } },
      ],
      inputs: [
        { name: 'revenue', label: 'Revenue / Sales Price', type: 'slider', defaultValue: 1000, prefix: '$', min: 0, max: 100000, step: 100, helpText: 'Total sales revenue' },
        { name: 'cogs', label: 'Cost of Goods Sold (COGS)', type: 'slider', defaultValue: 400, prefix: '$', min: 0, max: 50000, step: 100, helpText: 'Direct production costs' },
        { name: 'expenses', label: 'Operating Expenses', type: 'slider', defaultValue: 200, prefix: '$', min: 0, max: 50000, step: 100, helpText: 'Overhead and operational costs' },
      ],
      calculate: (inputs) => {
        const rev = safeFloat(inputs.revenue);
        const cogs = safeFloat(inputs.cogs);
        const exp = safeFloat(inputs.expenses);
        
        if (rev <= 0) return { result: 'Error', explanation: 'Revenue must be greater than 0.' };

        const grossProfit = rev - cogs;
        const grossMargin = (grossProfit / rev) * 100;
        const netProfit = grossProfit - exp;
        const netMargin = (netProfit / rev) * 100;

        const tips: string[] = [];
        if (grossMargin > 50) tips.push('💎 Excellent gross margin! You have strong pricing power');
        else if (grossMargin > 30) tips.push('✅ Healthy gross margin for most businesses');
        else if (grossMargin > 10) tips.push('⚠️ Low gross margin - consider reducing COGS or increasing prices');
        else tips.push('🚨 Very low gross margin - immediate action needed');

        if (netMargin > 20) tips.push('🎯 Outstanding net profit margin!');
        else if (netMargin < 5) tips.push('💡 Tip: Reduce operating expenses to improve net margin');

        tips.push(`📊 Gross profit covers ${((grossProfit/exp) * 100).toFixed(0)}% of your operating expenses`);

        const resultText = id === 'gross-margin-calculator'
          ? `Gross Margin: ${grossMargin.toFixed(2)}%`
          : id === 'net-margin-calculator'
            ? `Net Margin: ${netMargin.toFixed(2)}%`
            : `Gross Margin: ${grossMargin.toFixed(2)}% | Net Margin: ${netMargin.toFixed(2)}%`;

        return {
          result: resultText,
          explanation: `Gross Profit: $${grossProfit.toFixed(2)}, Net Profit: $${netProfit.toFixed(2)}`,
          steps: [
            `Gross Profit = Revenue - COGS = $${rev} - $${cogs} = $${grossProfit.toFixed(2)}`,
            `Gross Margin = (Gross Profit / Revenue) × 100 = (${grossProfit.toFixed(2)} / ${rev}) × 100 = ${grossMargin.toFixed(2)}%`,
            `Net Profit = Gross Profit - Expenses = $${grossProfit.toFixed(2)} - $${exp} = $${netProfit.toFixed(2)}`,
            `Net Margin = (Net Profit / Revenue) × 100 = (${netProfit.toFixed(2)} / ${rev}) × 100 = ${netMargin.toFixed(2)}%`
          ],
          tips,
          formula: 'Gross Margin = ((Revenue - COGS) ÷ Revenue) × 100',
          visualData: [
            { label: 'Revenue', value: rev },
            { label: 'COGS', value: cogs },
            { label: 'Gross Profit', value: grossProfit },
            { label: 'Operating Expenses', value: exp },
            { label: 'Net Profit', value: netProfit }
          ]
        };
      }
    };
  }

  // --- Costs & Pricing ---
  if (id === 'cost-of-goods-sold') {
    return {
      title: 'COGS (Cost of Goods Sold) Calculator',
      description: 'Estimate cost of goods sold using the inventory method.',
      presetScenarios: [
        { name: 'Retail', icon: '🛒', values: { beginningInventory: 20000, purchases: 80000, endingInventory: 25000 } },
        { name: 'Manufacturing', icon: '🏭', values: { beginningInventory: 50000, purchases: 200000, endingInventory: 60000 } },
        { name: 'E-commerce', icon: '📦', values: { beginningInventory: 15000, purchases: 120000, endingInventory: 18000 } },
      ],
      inputs: [
        { name: 'beginningInventory', label: 'Beginning Inventory', type: 'number', defaultValue: 20000, prefix: '$' },
        { name: 'purchases', label: 'Purchases (During Period)', type: 'number', defaultValue: 80000, prefix: '$' },
        { name: 'endingInventory', label: 'Ending Inventory', type: 'number', defaultValue: 25000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const bi = safeFloat(inputs.beginningInventory);
        const p = safeFloat(inputs.purchases);
        const ei = safeFloat(inputs.endingInventory);

        const cogs = bi + p - ei;

        return {
          result: `$${cogs.toFixed(2)}`,
          explanation: `COGS = Beginning Inventory + Purchases − Ending Inventory`,
          steps: [
            `COGS = BI + Purchases - EI = ${bi} + ${p} - ${ei} = ${cogs.toFixed(2)}`,
          ],
          tips: [
            'Use the same inventory valuation method (FIFO/LIFO/Weighted Avg) throughout the period.',
            'COGS feeds directly into Gross Profit = Revenue - COGS.',
          ],
          formula: 'COGS = Beginning Inventory + Purchases − Ending Inventory',
          visualData: [
            { label: 'Beginning Inventory', value: bi },
            { label: 'Purchases', value: p },
            { label: 'Ending Inventory', value: ei },
            { label: 'COGS', value: cogs },
          ]
        };
      }
    };
  }

  if (id === 'manufacturing-cost') {
    return {
      title: 'Manufacturing Cost Calculator',
      description: 'Calculate total manufacturing cost from direct materials, direct labor, and overhead.',
      inputs: [
        { name: 'directMaterials', label: 'Direct Materials', type: 'number', defaultValue: 50000, prefix: '$' },
        { name: 'directLabor', label: 'Direct Labor', type: 'number', defaultValue: 35000, prefix: '$' },
        { name: 'manufacturingOverhead', label: 'Manufacturing Overhead', type: 'number', defaultValue: 20000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const dm = safeFloat(inputs.directMaterials);
        const dl = safeFloat(inputs.directLabor);
        const moh = safeFloat(inputs.manufacturingOverhead);
        const total = dm + dl + moh;
        return {
          result: `$${total.toFixed(2)}`,
          explanation: 'Total manufacturing cost for the period.',
          steps: [
            `Total = Direct Materials + Direct Labor + Manufacturing Overhead`,
            `Total = ${dm} + ${dl} + ${moh} = ${total.toFixed(2)}`,
          ],
          tips: [
            'Manufacturing overhead includes indirect labor, factory rent, utilities, depreciation, etc.',
            'If you want unit cost, divide total by units produced (not sold).',
          ],
          formula: 'Total Manufacturing Cost = DM + DL + MOH',
          visualData: [
            { label: 'Direct Materials', value: dm },
            { label: 'Direct Labor', value: dl },
            { label: 'Overhead', value: moh },
            { label: 'Total', value: total },
          ]
        };
      }
    };
  }

  if (id === 'overhead-rate') {
    return {
      title: 'Overhead Rate Calculator',
      description: 'Compute overhead rate using an allocation base (labor hours, machine hours, etc.).',
      inputs: [
        { name: 'totalOverhead', label: 'Total Overhead Cost', type: 'number', defaultValue: 25000, prefix: '$' },
        { name: 'baseType', label: 'Allocation Base', type: 'select', options: ['Labor Hours', 'Machine Hours', 'Direct Labor Cost', 'Direct Material Cost'], defaultValue: 'Labor Hours' },
        { name: 'baseAmount', label: 'Base Amount', type: 'number', defaultValue: 500, helpText: 'For costs, enter the total $ for the period' },
      ],
      calculate: (inputs) => {
        const overhead = safeFloat(inputs.totalOverhead);
        const baseType = String(inputs.baseType || 'Labor Hours');
        const baseAmount = safeFloat(inputs.baseAmount);
        if (baseAmount <= 0) return { result: 'Error', explanation: 'Base amount must be greater than 0.' };

        const rate = overhead / baseAmount;
        const unit = baseType.includes('Hours') ? 'per hour' : 'per $ of base';

        return {
          result: `${rate.toFixed(4)} ${unit}`,
          explanation: `Overhead Rate = Total Overhead / Base Amount`,
          steps: [
            `Overhead Rate = ${overhead} / ${baseAmount} = ${rate.toFixed(4)} ${unit}`,
          ],
          tips: [
            'Choose a base that best drives overhead in your process (e.g., machine hours for automation-heavy shops).',
            'Rates can vary by department; consider separate pools if overhead is heterogeneous.',
          ],
          formula: 'Overhead Rate = Total Overhead / Allocation Base',
          visualData: [
            { label: 'Total Overhead', value: overhead },
            { label: 'Base Amount', value: baseAmount },
          ]
        };
      }
    };
  }

  if (id === 'price-elasticity') {
    return {
      title: 'Price Elasticity of Demand',
      description: 'Estimate elasticity using %ΔQuantity / %ΔPrice (simple method).',
      inputs: [
        { name: 'initialPrice', label: 'Initial Price', type: 'number', defaultValue: 100, prefix: '$' },
        { name: 'newPrice', label: 'New Price', type: 'number', defaultValue: 110, prefix: '$' },
        { name: 'initialQuantity', label: 'Initial Quantity', type: 'number', defaultValue: 1000 },
        { name: 'newQuantity', label: 'New Quantity', type: 'number', defaultValue: 950 },
      ],
      calculate: (inputs) => {
        const p1 = safeFloat(inputs.initialPrice);
        const p2 = safeFloat(inputs.newPrice);
        const q1 = safeFloat(inputs.initialQuantity);
        const q2 = safeFloat(inputs.newQuantity);
        if (p1 === 0 || q1 === 0) return { result: 'Error', explanation: 'Initial price and quantity must be non-zero.' };

        const pctPrice = ((p2 - p1) / p1) * 100;
        const pctQty = ((q2 - q1) / q1) * 100;
        if (pctPrice === 0) return { result: 'Error', explanation: 'Price change is zero; elasticity is undefined.' };
        const elasticity = pctQty / pctPrice;

        const interpretation = Math.abs(elasticity) > 1
          ? 'Elastic (demand is sensitive to price changes)'
          : Math.abs(elasticity) < 1
            ? 'Inelastic (demand is less sensitive to price changes)'
            : 'Unit elastic (proportional response)';

        return {
          result: elasticity.toFixed(3),
          explanation: `${interpretation}. %ΔQ=${pctQty.toFixed(2)}%, %ΔP=${pctPrice.toFixed(2)}%`,
          steps: [
            `%ΔPrice = ((P2 - P1) / P1) × 100 = ((${p2} - ${p1}) / ${p1}) × 100 = ${pctPrice.toFixed(2)}%`,
            `%ΔQuantity = ((Q2 - Q1) / Q1) × 100 = ((${q2} - ${q1}) / ${q1}) × 100 = ${pctQty.toFixed(2)}%`,
            `Elasticity = %ΔQ / %ΔP = ${pctQty.toFixed(2)} / ${pctPrice.toFixed(2)} = ${elasticity.toFixed(3)}`,
          ],
          tips: [
            'Elasticity estimates depend heavily on context (seasonality, competitors, promotions, etc.).',
            'Use more data points for stronger conclusions (regression on price vs quantity).'
          ],
          formula: 'Elasticity = (%ΔQuantity) / (%ΔPrice)'
        };
      }
    };
  }

  if (id === 'customer-profitability') {
    return {
      title: 'Customer Profitability Calculator',
      description: 'Estimate profit per customer and total customer profit.',
      inputs: [
        { name: 'revenuePerCustomer', label: 'Revenue per Customer', type: 'number', defaultValue: 250, prefix: '$' },
        { name: 'costPerCustomer', label: 'Cost to Serve per Customer', type: 'number', defaultValue: 150, prefix: '$' },
        { name: 'customers', label: 'Number of Customers', type: 'number', defaultValue: 1000 },
      ],
      calculate: (inputs) => {
        const rpc = safeFloat(inputs.revenuePerCustomer);
        const cpc = safeFloat(inputs.costPerCustomer);
        const customers = safeFloat(inputs.customers);
        if (customers < 0) return { result: 'Error', explanation: 'Customers cannot be negative.' };

        const profitPerCustomer = rpc - cpc;
        const totalProfit = profitPerCustomer * customers;
        const margin = rpc === 0 ? 0 : (profitPerCustomer / rpc) * 100;

        return {
          result: `$${profitPerCustomer.toFixed(2)} / customer`,
          explanation: `Total profit: $${totalProfit.toFixed(2)} | Margin: ${margin.toFixed(2)}%`,
          steps: [
            `Profit/Customer = Revenue/Customer - Cost/Customer = ${rpc} - ${cpc} = ${profitPerCustomer.toFixed(2)}`,
            `Total Profit = Profit/Customer × Customers = ${profitPerCustomer.toFixed(2)} × ${customers} = ${totalProfit.toFixed(2)}`,
          ],
          tips: [
            'Segment customers: profitability often varies by cohort, channel, and geography.',
            'Include churn/retention effects if you are analyzing over time (CLV-style).'
          ],
          formula: 'Profit per Customer = Revenue per Customer - Cost per Customer',
          visualData: [
            { label: 'Revenue/Customer', value: rpc },
            { label: 'Cost/Customer', value: cpc },
            { label: 'Profit/Customer', value: profitPerCustomer },
          ]
        };
      }
    };
  }

  if (id === 'product-profitability') {
    return {
      title: 'Product Profitability Calculator',
      description: 'Estimate profit from price, unit cost, fixed costs, and volume.',
      inputs: [
        { name: 'price', label: 'Selling Price (per unit)', type: 'number', defaultValue: 50, prefix: '$' },
        { name: 'unitVariableCost', label: 'Variable Cost (per unit)', type: 'number', defaultValue: 30, prefix: '$' },
        { name: 'unitsSold', label: 'Units Sold', type: 'number', defaultValue: 1000 },
        { name: 'fixedCosts', label: 'Fixed Costs (period)', type: 'number', defaultValue: 10000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const p = safeFloat(inputs.price);
        const v = safeFloat(inputs.unitVariableCost);
        const q = safeFloat(inputs.unitsSold);
        const fc = safeFloat(inputs.fixedCosts);

        const contributionPerUnit = p - v;
        const revenue = p * q;
        const variableCosts = v * q;
        const contribution = contributionPerUnit * q;
        const profit = contribution - fc;
        const margin = revenue === 0 ? 0 : (profit / revenue) * 100;

        return {
          result: `$${profit.toFixed(2)}`,
          explanation: `Revenue: $${revenue.toFixed(2)} | Contribution: $${contribution.toFixed(2)} | Margin: ${margin.toFixed(2)}%`,
          steps: [
            `Contribution/Unit = Price - Variable Cost = ${p} - ${v} = ${contributionPerUnit.toFixed(2)}`,
            `Contribution = Contribution/Unit × Units = ${contributionPerUnit.toFixed(2)} × ${q} = ${contribution.toFixed(2)}`,
            `Profit = Contribution - Fixed Costs = ${contribution.toFixed(2)} - ${fc} = ${profit.toFixed(2)}`,
          ],
          tips: [
            profit >= 0 ? '✅ Product is profitable at this volume.' : '⚠️ Product is not covering fixed costs at this volume.',
            'Use scenarios (price, volume, costs) to test sensitivity.'
          ],
          formula: 'Profit = (Price - VariableCost)×Units - FixedCosts',
          visualData: [
            { label: 'Revenue', value: revenue },
            { label: 'Variable Costs', value: variableCosts },
            { label: 'Fixed Costs', value: fc },
            { label: 'Profit', value: profit },
          ]
        };
      }
    };
  }

  if (id === 'target-profit') {
    return {
      title: 'Target Profit Analysis',
      description: 'Calculate sales volume needed to achieve a target profit.',
      inputs: [
        { name: 'price', label: 'Selling Price (per unit)', type: 'number', defaultValue: 50, prefix: '$' },
        { name: 'variableCost', label: 'Variable Cost (per unit)', type: 'number', defaultValue: 30, prefix: '$' },
        { name: 'fixedCosts', label: 'Fixed Costs', type: 'number', defaultValue: 20000, prefix: '$' },
        { name: 'targetProfit', label: 'Target Profit', type: 'number', defaultValue: 15000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const p = safeFloat(inputs.price);
        const v = safeFloat(inputs.variableCost);
        const fc = safeFloat(inputs.fixedCosts);
        const tp = safeFloat(inputs.targetProfit);
        const contribution = p - v;
        if (contribution <= 0) return { result: 'Error', explanation: 'Price must be greater than variable cost.' };

        const requiredUnits = (fc + tp) / contribution;
        const requiredSales = requiredUnits * p;

        return {
          result: `${requiredUnits.toFixed(0)} units`,
          explanation: `Required sales: $${requiredSales.toFixed(2)}`,
          steps: [
            `Contribution/Unit = Price - Variable Cost = ${p} - ${v} = ${contribution.toFixed(2)}`,
            `Required Units = (Fixed Costs + Target Profit) / Contribution per Unit = (${fc} + ${tp}) / ${contribution.toFixed(2)} = ${requiredUnits.toFixed(2)}`,
            `Required Sales = Required Units × Price = ${requiredUnits.toFixed(2)} × ${p} = ${requiredSales.toFixed(2)}`,
          ],
          tips: [
            'If required units feel unrealistic, adjust price, reduce variable costs, or reduce fixed costs.',
            'Combine with break-even analysis to understand downside risk.'
          ],
          formula: 'Units = (FixedCosts + TargetProfit) / (Price - VariableCost)',
          visualData: [
            { label: 'Fixed Costs + Target Profit', value: fc + tp },
            { label: 'Contribution/Unit', value: contribution },
            { label: 'Required Sales', value: requiredSales },
          ]
        };
      }
    };
  }

  // --- Inventory Planning ---
  if (id === 'stock-turnover') {
    return {
      title: 'Stock Turnover Ratio (Inventory Turnover)',
      description: 'Measure how many times inventory is sold and replaced in a period.',
      inputs: [
        { name: 'cogs', label: 'COGS (Annual)', type: 'number', defaultValue: 300000, prefix: '$' },
        { name: 'avgInventory', label: 'Average Inventory', type: 'number', defaultValue: 50000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const cogs = safeFloat(inputs.cogs);
        const inv = safeFloat(inputs.avgInventory);
        if (inv <= 0) return { result: 'Error', explanation: 'Average inventory must be greater than 0.' };
        const turnover = cogs / inv;
        return {
          result: `${turnover.toFixed(2)}x`,
          explanation: 'Higher turnover can indicate efficient inventory management (industry-dependent).',
          steps: [`Turnover = COGS / Avg Inventory = ${cogs} / ${inv} = ${turnover.toFixed(2)}`],
          tips: ['Compare turnover to industry benchmarks; too high may risk stock-outs.'],
          formula: 'Inventory Turnover = COGS / Average Inventory'
        };
      }
    };
  }

  if (id === 'eoq-calculator') {
    return {
      title: 'EOQ Calculator (Economic Order Quantity)',
      description: 'Compute the optimal order quantity to minimize ordering + holding costs.',
      inputs: [
        { name: 'annualDemand', label: 'Annual Demand (units)', type: 'number', defaultValue: 12000 },
        { name: 'orderCost', label: 'Ordering Cost per Order', type: 'number', defaultValue: 50, prefix: '$' },
        { name: 'holdingCost', label: 'Holding Cost per Unit per Year', type: 'number', defaultValue: 2, prefix: '$' },
      ],
      calculate: (inputs) => {
        const d = safeFloat(inputs.annualDemand);
        const s = safeFloat(inputs.orderCost);
        const h = safeFloat(inputs.holdingCost);
        if (d <= 0 || s < 0 || h <= 0) return { result: 'Error', explanation: 'Annual demand and holding cost must be > 0.' };

        const eoq = Math.sqrt((2 * d * s) / h);
        const ordersPerYear = d / eoq;
        const annualOrderingCost = ordersPerYear * s;
        const annualHoldingCost = (eoq / 2) * h;

        return {
          result: `${eoq.toFixed(0)} units`,
          explanation: `Orders/year: ${ordersPerYear.toFixed(1)} | Ordering: $${annualOrderingCost.toFixed(2)} | Holding: $${annualHoldingCost.toFixed(2)}`,
          steps: [
            `EOQ = sqrt((2DS)/H) = sqrt((2×${d}×${s})/${h}) = ${eoq.toFixed(2)}`,
            `Orders/year = D/EOQ = ${d}/${eoq.toFixed(2)} = ${ordersPerYear.toFixed(2)}`,
          ],
          tips: [
            'EOQ assumes steady demand and constant lead time; adjust if demand is seasonal.',
            'Use safety stock/reorder point alongside EOQ.'
          ],
          formula: 'EOQ = √((2×Demand×OrderCost)/HoldingCost)'
        };
      }
    };
  }

  if (id === 'ordering-cost') {
    return {
      title: 'Ordering Cost Calculator',
      description: 'Estimate annual ordering cost based on demand, order quantity, and cost per order.',
      inputs: [
        { name: 'annualDemand', label: 'Annual Demand (units)', type: 'number', defaultValue: 12000 },
        { name: 'orderQuantity', label: 'Order Quantity (units)', type: 'number', defaultValue: 500 },
        { name: 'orderCost', label: 'Cost per Order', type: 'number', defaultValue: 50, prefix: '$' },
      ],
      calculate: (inputs) => {
        const d = safeFloat(inputs.annualDemand);
        const q = safeFloat(inputs.orderQuantity);
        const s = safeFloat(inputs.orderCost);
        if (d <= 0 || q <= 0) return { result: 'Error', explanation: 'Annual demand and order quantity must be > 0.' };
        const orders = d / q;
        const annual = orders * s;
        return {
          result: `$${annual.toFixed(2)} / year`,
          explanation: `Orders/year: ${orders.toFixed(2)}`,
          steps: [
            `Orders/year = D/Q = ${d}/${q} = ${orders.toFixed(2)}`,
            `Ordering Cost = Orders/year × Cost/order = ${orders.toFixed(2)} × ${s} = ${annual.toFixed(2)}`,
          ],
          tips: ['Use with holding costs to find a balanced order quantity (EOQ).'],
          formula: 'Annual Ordering Cost = (D/Q) × S'
        };
      }
    };
  }

  if (id === 'inventory-holding-cost') {
    return {
      title: 'Inventory Holding Cost Calculator',
      description: 'Estimate annual holding cost from average inventory value and holding rate.',
      inputs: [
        { name: 'avgInventoryValue', label: 'Average Inventory Value', type: 'number', defaultValue: 50000, prefix: '$' },
        { name: 'holdingRate', label: 'Holding Rate (annual)', type: 'number', defaultValue: 20, suffix: '%', helpText: 'Includes storage, insurance, shrinkage, and cost of capital' },
      ],
      calculate: (inputs) => {
        const v = safeFloat(inputs.avgInventoryValue);
        const r = safeFloat(inputs.holdingRate) / 100;
        const cost = v * r;
        return {
          result: `$${cost.toFixed(2)} / year`,
          explanation: `Holding cost rate: ${(r * 100).toFixed(2)}%`,
          steps: [`Holding Cost = Avg Inventory Value × Rate = ${v} × ${r.toFixed(4)} = ${cost.toFixed(2)}`],
          tips: ['Typical holding rates range ~15–30% depending on industry and capital costs.'],
          formula: 'Holding Cost = Average Inventory Value × Holding Rate'
        };
      }
    };
  }

  if (id === 'safety-stock') {
    return {
      title: 'Safety Stock Calculator',
      description: 'Estimate safety stock using a simple max/avg demand & lead-time method.',
      inputs: [
        { name: 'avgDailyDemand', label: 'Average Daily Demand', type: 'number', defaultValue: 100 },
        { name: 'maxDailyDemand', label: 'Max Daily Demand', type: 'number', defaultValue: 150 },
        { name: 'avgLeadTime', label: 'Average Lead Time (days)', type: 'number', defaultValue: 10 },
        { name: 'maxLeadTime', label: 'Max Lead Time (days)', type: 'number', defaultValue: 14 },
      ],
      calculate: (inputs) => {
        const avgD = safeFloat(inputs.avgDailyDemand);
        const maxD = safeFloat(inputs.maxDailyDemand);
        const avgL = safeFloat(inputs.avgLeadTime);
        const maxL = safeFloat(inputs.maxLeadTime);
        const safety = Math.max(0, (maxD * maxL) - (avgD * avgL));
        return {
          result: `${safety.toFixed(0)} units`,
          explanation: 'Safety stock buffers variability in demand and lead time.',
          steps: [
            `Safety Stock = (Max Demand×Max Lead Time) - (Avg Demand×Avg Lead Time)`,
            `= (${maxD}×${maxL}) - (${avgD}×${avgL}) = ${safety.toFixed(2)}`,
          ],
          tips: ['For more accuracy, use service level + demand/lead-time variability (statistical model).'],
          formula: 'Safety Stock = (MaxD×MaxLT) − (AvgD×AvgLT)'
        };
      }
    };
  }

  if (id === 'reorder-point') {
    return {
      title: 'Reorder Point (ROP) Calculator',
      description: 'Estimate the inventory level at which you should place a new order.',
      inputs: [
        { name: 'avgDailyDemand', label: 'Average Daily Demand', type: 'number', defaultValue: 100 },
        { name: 'leadTime', label: 'Lead Time (days)', type: 'number', defaultValue: 10 },
        { name: 'safetyStock', label: 'Safety Stock (units)', type: 'number', defaultValue: 200 },
      ],
      calculate: (inputs) => {
        const d = safeFloat(inputs.avgDailyDemand);
        const lt = safeFloat(inputs.leadTime);
        const ss = safeFloat(inputs.safetyStock);
        const rop = (d * lt) + ss;
        return {
          result: `${rop.toFixed(0)} units`,
          explanation: `Demand during lead time: ${(d * lt).toFixed(0)} units`,
          steps: [
            `ROP = (Avg Daily Demand × Lead Time) + Safety Stock`,
            `= (${d}×${lt}) + ${ss} = ${rop.toFixed(2)}`,
          ],
          tips: ['If lead time varies, increase safety stock to reduce stock-out risk.'],
          formula: 'ROP = (Demand during lead time) + Safety Stock'
        };
      }
    };
  }

  // --- Sales Tax ---
  if (id === 'sales-tax-calculator') {
    return {
      title: 'Sales Tax Calculator',
      description: 'Calculate sales tax amount and total including tax.',
      presetScenarios: [
        { name: 'Low Tax', icon: '🧾', values: { subtotal: 1000, taxRate: 5 } },
        { name: 'Typical', icon: '🏷️', values: { subtotal: 1000, taxRate: 8 } },
        { name: 'High Tax', icon: '🏙️', values: { subtotal: 1000, taxRate: 10 } },
      ],
      inputs: [
        { name: 'subtotal', label: 'Subtotal (Before Tax)', type: 'number', defaultValue: 1000, prefix: '$' },
        { name: 'taxRate', label: 'Tax Rate', type: 'number', defaultValue: 8, suffix: '%' },
      ],
      calculate: (inputs) => {
        const subtotal = safeFloat(inputs.subtotal);
        const taxRate = safeFloat(inputs.taxRate);

        const tax = subtotal * (taxRate / 100);
        const total = subtotal + tax;

        return {
          result: `$${total.toFixed(2)}`,
          explanation: `Tax: $${tax.toFixed(2)} (Rate: ${taxRate.toFixed(2)}%)`,
          steps: [
            `Tax = Subtotal × (Tax Rate/100) = ${subtotal} × (${taxRate}/100) = ${tax.toFixed(2)}`,
            `Total = Subtotal + Tax = ${subtotal} + ${tax.toFixed(2)} = ${total.toFixed(2)}`,
          ],
          tips: [
            'If your price is tax-inclusive, divide by (1 + taxRate) to find the pre-tax amount.',
            'For B2B invoices, track tax separately for reconciliation.'
          ],
          formula: 'Total = Subtotal × (1 + TaxRate)',
          visualData: [
            { label: 'Subtotal', value: subtotal },
            { label: 'Tax', value: tax },
            { label: 'Total', value: total },
          ]
        };
      }
    };
  }

  // --- Payroll & Overtime ---
  if (id === 'payroll-calculator') {
    return {
      title: 'Payroll Calculator',
      description: 'Estimate gross pay, taxes, deductions, and net pay per pay period.',
      inputs: [
        { name: 'payType', label: 'Pay Type', type: 'select', options: ['Hourly', 'Salary'], defaultValue: 'Hourly' },
        { name: 'hourlyRate', label: 'Hourly Rate', type: 'number', defaultValue: 20, prefix: '$' },
        { name: 'regularHours', label: 'Regular Hours', type: 'number', defaultValue: 40, helpText: 'Hours at base hourly rate' },
        { name: 'overtimeHours', label: 'Overtime Hours', type: 'number', defaultValue: 5, helpText: 'Hours paid at overtime rate' },
        { name: 'overtimeMultiplier', label: 'Overtime Multiplier', type: 'number', defaultValue: 1.5, helpText: 'Commonly 1.5×' },
        { name: 'annualSalary', label: 'Annual Salary (if Salary)', type: 'number', defaultValue: 60000, prefix: '$' },
        { name: 'payPeriods', label: 'Pay Periods / Year', type: 'select', options: ['52 (Weekly)', '26 (Bi-weekly)', '12 (Monthly)'], defaultValue: '26 (Bi-weekly)' },
        { name: 'taxRate', label: 'Estimated Tax Rate', type: 'number', defaultValue: 20, suffix: '%' },
        { name: 'deductions', label: 'Other Deductions (Per Period)', type: 'number', defaultValue: 0, prefix: '$' },
      ],
      calculate: (inputs) => {
        const payType = String(inputs.payType || 'Hourly');
        const hourlyRate = safeFloat(inputs.hourlyRate);
        const regularHours = safeFloat(inputs.regularHours);
        const overtimeHours = safeFloat(inputs.overtimeHours);
        const overtimeMultiplier = safeFloat(inputs.overtimeMultiplier) || 1.5;
        const annualSalary = safeFloat(inputs.annualSalary);
        const payPeriodsRaw = String(inputs.payPeriods || '26 (Bi-weekly)');
        const payPeriods = safeFloat(payPeriodsRaw.split(' ')[0]) || 26;
        const taxRate = safeFloat(inputs.taxRate);
        const deductions = safeFloat(inputs.deductions);

        const gross = payType === 'Salary'
          ? (payPeriods > 0 ? (annualSalary / payPeriods) : 0)
          : (hourlyRate * regularHours) + (hourlyRate * overtimeMultiplier * overtimeHours);

        const taxes = gross * (taxRate / 100);
        const net = gross - taxes - deductions;

        const tips: string[] = [];
        if (payType === 'Hourly' && overtimeHours > 0) tips.push('Overtime can significantly increase gross pay, but also increases tax withholding in many payroll systems.');
        if (taxRate > 30) tips.push('High estimated tax rate — consider verifying withholding assumptions.');
        if (deductions > 0) tips.push('Deductions shown here are per pay period; confirm whether yours are pre-tax or post-tax.');

        return {
          result: `$${net.toFixed(2)}`,
          explanation: `Gross: $${gross.toFixed(2)} | Taxes: $${taxes.toFixed(2)} | Deductions: $${deductions.toFixed(2)}`,
          steps: [
            payType === 'Salary'
              ? `Gross Pay (Salary) = Annual Salary / Pay Periods = ${annualSalary} / ${payPeriods} = ${gross.toFixed(2)}`
              : `Gross Pay (Hourly) = (Rate×Regular) + (Rate×OT Multiplier×OT Hours) = (${hourlyRate}×${regularHours}) + (${hourlyRate}×${overtimeMultiplier}×${overtimeHours}) = ${gross.toFixed(2)}`,
            `Taxes = Gross × (Tax Rate/100) = ${gross.toFixed(2)} × (${taxRate}/100) = ${taxes.toFixed(2)}`,
            `Net Pay = Gross - Taxes - Deductions = ${gross.toFixed(2)} - ${taxes.toFixed(2)} - ${deductions.toFixed(2)} = ${net.toFixed(2)}`,
          ],
          tips,
          formula: 'Net Pay = Gross Pay - Taxes - Deductions',
          visualData: [
            { label: 'Gross Pay', value: gross },
            { label: 'Taxes', value: taxes },
            { label: 'Deductions', value: deductions },
            { label: 'Net Pay', value: Math.max(0, net) },
          ]
        };
      }
    };
  }

  if (id === 'overtime-calculator') {
    return {
      title: 'Overtime Pay Calculator',
      description: 'Calculate total pay including overtime hours and multiplier.',
      inputs: [
        { name: 'hourlyRate', label: 'Hourly Rate', type: 'number', defaultValue: 20, prefix: '$' },
        { name: 'regularHours', label: 'Regular Hours', type: 'number', defaultValue: 40 },
        { name: 'overtimeHours', label: 'Overtime Hours', type: 'number', defaultValue: 10 },
        { name: 'overtimeMultiplier', label: 'Overtime Multiplier', type: 'number', defaultValue: 1.5 },
      ],
      calculate: (inputs) => {
        const rate = safeFloat(inputs.hourlyRate);
        const regH = safeFloat(inputs.regularHours);
        const otH = safeFloat(inputs.overtimeHours);
        const otM = safeFloat(inputs.overtimeMultiplier) || 1.5;

        const regularPay = rate * regH;
        const overtimePay = rate * otM * otH;
        const totalPay = regularPay + overtimePay;

        return {
          result: `$${totalPay.toFixed(2)}`,
          explanation: `Regular: $${regularPay.toFixed(2)} | Overtime: $${overtimePay.toFixed(2)}`,
          steps: [
            `Regular Pay = Rate × Regular Hours = ${rate} × ${regH} = ${regularPay.toFixed(2)}`,
            `Overtime Pay = Rate × Multiplier × Overtime Hours = ${rate} × ${otM} × ${otH} = ${overtimePay.toFixed(2)}`,
            `Total Pay = Regular + Overtime = ${regularPay.toFixed(2)} + ${overtimePay.toFixed(2)} = ${totalPay.toFixed(2)}`,
          ],
          tips: [
            'If you have multiple overtime tiers (e.g., 2× for holidays), calculate each tier separately and add them.',
          ],
          formula: 'Total = (Rate×RegularHours) + (Rate×OTMultiplier×OTHours)',
          visualData: [
            { label: 'Regular Pay', value: regularPay },
            { label: 'Overtime Pay', value: overtimePay },
            { label: 'Total Pay', value: totalPay },
          ]
        };
      }
    };
  }

  // --- Profit Split ---
  if (id === 'profit-split-calculator') {
    return {
      title: 'Profit Split Calculator',
      description: 'Split profit between partners by percentage allocation.',
      inputs: [
        { name: 'totalProfit', label: 'Total Profit to Split', type: 'number', defaultValue: 10000, prefix: '$' },
        { name: 'partnerA', label: 'Partner A Share', type: 'number', defaultValue: 50, suffix: '%' },
        { name: 'partnerB', label: 'Partner B Share', type: 'number', defaultValue: 30, suffix: '%' },
        { name: 'partnerC', label: 'Partner C Share', type: 'number', defaultValue: 20, suffix: '%' },
      ],
      calculate: (inputs) => {
        const total = safeFloat(inputs.totalProfit);
        const aPct = safeFloat(inputs.partnerA);
        const bPct = safeFloat(inputs.partnerB);
        const cPct = safeFloat(inputs.partnerC);

        const sum = aPct + bPct + cPct;
        if (sum <= 0) return { result: 'Error', explanation: 'Enter at least one partner percentage.' };
        if (sum > 100.0001) return { result: 'Error', explanation: 'Partner shares must total 100% or less.' };

        const a = total * (aPct / 100);
        const b = total * (bPct / 100);
        const c = total * (cPct / 100);
        const remainder = total - (a + b + c);

        const tips: string[] = [];
        if (Math.abs(sum - 100) > 0.01) tips.push(`Shares sum to ${sum.toFixed(2)}%. Remainder $${remainder.toFixed(2)} is unallocated.`);

        return {
          result: `A: $${a.toFixed(2)} | B: $${b.toFixed(2)} | C: $${c.toFixed(2)}`,
          explanation: remainder > 0 ? `Unallocated remainder: $${remainder.toFixed(2)}` : undefined,
          steps: [
            `Partner A = Total × (A%/100) = ${total} × (${aPct}/100) = ${a.toFixed(2)}`,
            `Partner B = Total × (B%/100) = ${total} × (${bPct}/100) = ${b.toFixed(2)}`,
            `Partner C = Total × (C%/100) = ${total} × (${cPct}/100) = ${c.toFixed(2)}`,
          ],
          tips,
          formula: 'Partner Share = Total Profit × Allocation %',
          visualData: [
            { label: 'Partner A', value: a },
            { label: 'Partner B', value: b },
            { label: 'Partner C', value: c },
          ]
        };
      }
    };
  }

  // --- ROI & Growth ---
  if (id === 'roi-percentage' || id === 'roi-calculator-business') {
    return {
      title: id === 'roi-calculator-business' ? 'ROI Calculator' : 'ROI Percentage Calculator',
      description: 'Calculate Return on Investment (ROI) as a percentage.',
      inputs: [
        { name: 'investment', label: 'Initial Investment', type: 'number', defaultValue: 10000, prefix: '$' },
        { name: 'finalValue', label: 'Final Value', type: 'number', defaultValue: 12500, prefix: '$' },
      ],
      calculate: (inputs) => {
        const inv = safeFloat(inputs.investment);
        const fv = safeFloat(inputs.finalValue);
        if (inv <= 0) return { result: 'Error', explanation: 'Initial investment must be greater than 0.' };

        const profit = fv - inv;
        const roi = (profit / inv) * 100;

        return {
          result: `${roi.toFixed(2)}%`,
          explanation: `Profit: $${profit.toFixed(2)}`,
          steps: [
            `Profit = Final Value - Investment = ${fv} - ${inv} = ${profit.toFixed(2)}`,
            `ROI% = (Profit / Investment) × 100 = (${profit.toFixed(2)} / ${inv}) × 100 = ${roi.toFixed(2)}%`
          ],
          tips: [
            roi >= 0 ? 'Positive ROI indicates profit.' : 'Negative ROI indicates a loss.',
            'Compare ROI across options, but also consider risk and time.'
          ],
          formula: 'ROI% = ((Final - Initial) / Initial) × 100',
          visualData: [
            { label: 'Investment', value: inv },
            { label: 'Final Value', value: fv },
            { label: 'Profit', value: profit },
          ]
        };
      }
    };
  }

  if (id === 'revenue-growth-rate' || id === 'cagr-calculator-business') {
    return {
      title: id === 'cagr-calculator-business' ? 'CAGR Calculator' : 'Revenue Growth Rate Calculator',
      description: 'Measure period-over-period growth and optional CAGR over multiple years.',
      inputs: [
        { name: 'previousRevenue', label: 'Previous Revenue', type: 'number', defaultValue: 100000, prefix: '$' },
        { name: 'currentRevenue', label: 'Current Revenue', type: 'number', defaultValue: 120000, prefix: '$' },
        { name: 'years', label: 'Years (for CAGR)', type: 'number', defaultValue: 1, helpText: 'Set > 1 to compute CAGR' },
      ],
      calculate: (inputs) => {
        const prev = safeFloat(inputs.previousRevenue);
        const curr = safeFloat(inputs.currentRevenue);
        const years = Math.max(1, safeFloat(inputs.years) || 1);
        if (prev <= 0) return { result: 'Error', explanation: 'Previous revenue must be greater than 0.' };

        const growth = ((curr - prev) / prev) * 100;
        const cagr = years > 1 ? (Math.pow(curr / prev, 1 / years) - 1) * 100 : growth;

        const primary = id === 'cagr-calculator-business' ? cagr : growth;

        return {
          result: `${primary.toFixed(2)}%`,
          explanation: years > 1
            ? `Growth: ${growth.toFixed(2)}% | CAGR (${years}y): ${cagr.toFixed(2)}%`
            : 'Single-period growth rate',
          steps: [
            `Growth% = ((Current - Previous) / Previous) × 100 = ((${curr} - ${prev}) / ${prev}) × 100 = ${growth.toFixed(2)}%`,
            years > 1
              ? `CAGR% = ((Current/Previous)^(1/Years) - 1) × 100 = ((${curr}/${prev})^(1/${years}) - 1) × 100 = ${cagr.toFixed(2)}%`
              : 'CAGR not applied (Years = 1)'
          ].filter(Boolean) as string[],
          tips: [
            'Use CAGR when comparing multi-year growth trends.',
            'If growth is volatile, consider using rolling averages.'
          ],
          formula: 'Growth% = ((Current - Previous) / Previous) × 100',
          visualData: [
            { label: 'Previous Revenue', value: prev },
            { label: 'Current Revenue', value: curr },
          ]
        };
      }
    };
  }

  // --- Startup Cash Management ---
  if (id === 'burn-rate') {
    return {
      title: 'Burn Rate Calculator',
      description: 'Estimate monthly burn rate from revenue and expenses.',
      presetScenarios: [
        { name: 'Bootstrapped', icon: '🧩', values: { monthlyRevenue: 15000, monthlyExpenses: 20000, cashOnHand: 60000 } },
        { name: 'Seed Stage', icon: '🌱', values: { monthlyRevenue: 20000, monthlyExpenses: 60000, cashOnHand: 450000 } },
        { name: 'Growth', icon: '📈', values: { monthlyRevenue: 150000, monthlyExpenses: 220000, cashOnHand: 1200000 } },
      ],
      inputs: [
        { name: 'monthlyRevenue', label: 'Monthly Revenue', type: 'number', defaultValue: 20000, prefix: '$' },
        { name: 'monthlyExpenses', label: 'Monthly Expenses', type: 'number', defaultValue: 60000, prefix: '$' },
        { name: 'cashOnHand', label: 'Cash on Hand (optional)', type: 'number', defaultValue: 0, prefix: '$', helpText: 'If provided, we will also estimate runway.' },
      ],
      calculate: (inputs) => {
        const rev = safeFloat(inputs.monthlyRevenue);
        const exp = safeFloat(inputs.monthlyExpenses);
        const cash = safeFloat(inputs.cashOnHand);

        const grossBurn = exp;
        const netBurn = exp - rev;

        let runwayText: string | undefined;
        if (cash > 0) {
          if (netBurn > 0) runwayText = `${(cash / netBurn).toFixed(1)} months runway (at current net burn)`;
          else runwayText = 'No net burn (expenses ≤ revenue) — runway is not limited by cash burn.';
        }

        return {
          result: netBurn > 0 ? `$${netBurn.toFixed(2)} / month` : `$${Math.abs(netBurn).toFixed(2)} / month surplus`,
          explanation: `Gross burn: $${grossBurn.toFixed(2)} | Net burn: $${netBurn.toFixed(2)}${runwayText ? ' | ' + runwayText : ''}`,
          steps: [
            `Gross Burn = Monthly Expenses = ${exp} = ${grossBurn.toFixed(2)}`,
            `Net Burn = Monthly Expenses - Monthly Revenue = ${exp} - ${rev} = ${netBurn.toFixed(2)}`,
            ...(cash > 0 && netBurn > 0 ? [`Runway (months) = Cash / Net Burn = ${cash} / ${netBurn.toFixed(2)} = ${(cash / netBurn).toFixed(2)}`] : [])
          ],
          tips: [
            'Track burn rate monthly and separate one-time costs from recurring spend.',
            'Combine burn + pipeline metrics to plan hiring and growth.'
          ],
          formula: 'Net Burn = Expenses − Revenue'
        };
      }
    };
  }

  if (id === 'runway-calculator') {
    return {
      title: 'Runway Calculator',
      description: 'Estimate how many months you can operate before cash runs out.',
      inputs: [
        { name: 'cashOnHand', label: 'Cash on Hand', type: 'number', defaultValue: 450000, prefix: '$' },
        { name: 'monthlyRevenue', label: 'Monthly Revenue', type: 'number', defaultValue: 20000, prefix: '$' },
        { name: 'monthlyExpenses', label: 'Monthly Expenses', type: 'number', defaultValue: 60000, prefix: '$' },
        { name: 'buffer', label: 'Safety Buffer', type: 'number', defaultValue: 10, suffix: '%', helpText: 'Adds buffer to net burn to be conservative' },
      ],
      calculate: (inputs) => {
        const cash = safeFloat(inputs.cashOnHand);
        const rev = safeFloat(inputs.monthlyRevenue);
        const exp = safeFloat(inputs.monthlyExpenses);
        const bufferPct = Math.max(0, safeFloat(inputs.buffer));

        const netBurn = exp - rev;
        if (cash <= 0) return { result: 'Error', explanation: 'Cash on hand must be greater than 0.' };

        if (netBurn <= 0) {
          return {
            result: 'Unlimited (no net burn)',
            explanation: `Net burn is $${netBurn.toFixed(2)} (expenses ≤ revenue).`,
            steps: [`Net Burn = Expenses - Revenue = ${exp} - ${rev} = ${netBurn.toFixed(2)}`],
            tips: ['If expenses rise (hiring/marketing), re-check runway with updated projections.'],
            formula: 'Runway = Cash / Net Burn'
          };
        }

        const effectiveBurn = netBurn * (1 + bufferPct / 100);
        const runway = cash / effectiveBurn;

        return {
          result: `${runway.toFixed(1)} months`,
          explanation: `Net burn: $${netBurn.toFixed(2)} | Buffered burn: $${effectiveBurn.toFixed(2)} (${bufferPct.toFixed(0)}% buffer)`,
          steps: [
            `Net Burn = ${exp} - ${rev} = ${netBurn.toFixed(2)}`,
            `Buffered Burn = Net Burn × (1 + Buffer) = ${netBurn.toFixed(2)} × (1 + ${bufferPct.toFixed(0)}%) = ${effectiveBurn.toFixed(2)}`,
            `Runway = Cash / Buffered Burn = ${cash} / ${effectiveBurn.toFixed(2)} = ${runway.toFixed(2)} months`
          ],
          tips: ['Consider fundraising and cost reductions well before runway hits 0.'],
          formula: 'Runway (months) = Cash / Net Burn'
        };
      }
    };
  }

  // --- Funnel & Revenue Metrics ---
  if (id === 'conversion-rate') {
    return {
      title: 'Conversion Rate Calculator',
      description: 'Calculate conversion rate from visitors and conversions.',
      inputs: [
        { name: 'visitors', label: 'Total Visitors / Leads', type: 'number', defaultValue: 1000 },
        { name: 'conversions', label: 'Conversions / Purchases', type: 'number', defaultValue: 50 },
      ],
      calculate: (inputs) => {
        const visitors = safeFloat(inputs.visitors);
        const conversions = safeFloat(inputs.conversions);
        if (visitors <= 0) return { result: 'Error', explanation: 'Visitors must be greater than 0.' };

        const rate = (conversions / visitors) * 100;
        return {
          result: `${rate.toFixed(2)}%`,
          explanation: `${conversions.toFixed(0)} conversions out of ${visitors.toFixed(0)} visitors`,
          steps: [
            `Conversion Rate% = (Conversions / Visitors) × 100 = (${conversions} / ${visitors}) × 100 = ${rate.toFixed(2)}%`
          ],
          tips: [
            rate >= 5 ? 'Strong conversion rate for many funnels.' : 'Consider improving landing pages, offer clarity, and checkout flow.',
          ],
          formula: 'CR% = (Conversions / Visitors) × 100'
        };
      }
    };
  }

  if (id === 'click-through-rate') {
    return {
      title: 'Click-Through Rate (CTR) Calculator',
      description: 'Calculate CTR from clicks and impressions.',
      inputs: [
        { name: 'clicks', label: 'Clicks', type: 'number', defaultValue: 500 },
        { name: 'impressions', label: 'Impressions', type: 'number', defaultValue: 20000 },
      ],
      calculate: (inputs) => {
        const clicks = safeFloat(inputs.clicks);
        const impressions = safeFloat(inputs.impressions);
        if (impressions <= 0) return { result: 'Error', explanation: 'Impressions must be greater than 0.' };
        const ctr = (clicks / impressions) * 100;
        return {
          result: `${ctr.toFixed(2)}%`,
          explanation: `${clicks.toFixed(0)} clicks out of ${impressions.toFixed(0)} impressions`,
          steps: [
            `CTR% = (Clicks / Impressions) × 100 = (${clicks} / ${impressions}) × 100 = ${ctr.toFixed(2)}%`
          ],
          tips: [
            'Improve CTR with clearer messaging, stronger offers, and better targeting.',
            'Always compare CTR within the same channel and audience segment.'
          ],
          formula: 'CTR% = (Clicks / Impressions) × 100'
        };
      }
    };
  }

  if (id === 'bounce-rate') {
    return {
      title: 'Bounce Rate Calculator',
      description: 'Calculate bounce rate from bounces and sessions.',
      inputs: [
        { name: 'bounces', label: 'Bounces', type: 'number', defaultValue: 3000 },
        { name: 'sessions', label: 'Total Sessions', type: 'number', defaultValue: 10000 },
      ],
      calculate: (inputs) => {
        const bounces = safeFloat(inputs.bounces);
        const sessions = safeFloat(inputs.sessions);
        if (sessions <= 0) return { result: 'Error', explanation: 'Sessions must be greater than 0.' };
        const rate = (bounces / sessions) * 100;
        return {
          result: `${rate.toFixed(2)}%`,
          explanation: `${bounces.toFixed(0)} bounces out of ${sessions.toFixed(0)} sessions`,
          steps: [
            `Bounce Rate% = (Bounces / Sessions) × 100 = (${bounces} / ${sessions}) × 100 = ${rate.toFixed(2)}%`
          ],
          tips: [
            'High bounce rate can mean mismatched intent, slow pages, or unclear next steps.',
            'Check bounce rate by landing page and traffic source.'
          ],
          formula: 'Bounce Rate% = (Bounces / Sessions) × 100'
        };
      }
    };
  }

  if (id === 'cart-abandonment') {
    return {
      title: 'Cart Abandonment Rate',
      description: 'Calculate cart abandonment rate from initiated checkouts and completed purchases.',
      inputs: [
        { name: 'initiated', label: 'Initiated Checkouts', type: 'number', defaultValue: 2000 },
        { name: 'completed', label: 'Completed Purchases', type: 'number', defaultValue: 1200 },
      ],
      calculate: (inputs) => {
        const initiated = safeFloat(inputs.initiated);
        const completed = safeFloat(inputs.completed);
        if (initiated <= 0) return { result: 'Error', explanation: 'Initiated checkouts must be greater than 0.' };
        const abandoned = Math.max(0, initiated - completed);
        const rate = (abandoned / initiated) * 100;
        return {
          result: `${rate.toFixed(2)}%`,
          explanation: `${abandoned.toFixed(0)} abandoned out of ${initiated.toFixed(0)} initiated`,
          steps: [
            `Abandoned = Initiated - Completed = ${initiated} - ${completed} = ${abandoned.toFixed(0)}`,
            `Abandonment% = (Abandoned / Initiated) × 100 = (${abandoned.toFixed(0)} / ${initiated}) × 100 = ${rate.toFixed(2)}%`
          ],
          tips: [
            'Reduce abandonment with transparent shipping costs, guest checkout, and trust signals.',
            'Use cart recovery emails/SMS and retargeting.'
          ],
          formula: 'Cart Abandonment% = ((Initiated - Completed) / Initiated) × 100'
        };
      }
    };
  }

  if (id === 'email-open-rate') {
    return {
      title: 'Email Open Rate',
      description: 'Calculate email open rate from opens and delivered emails.',
      inputs: [
        { name: 'opens', label: 'Email Opens', type: 'number', defaultValue: 1500 },
        { name: 'delivered', label: 'Delivered Emails', type: 'number', defaultValue: 10000 },
      ],
      calculate: (inputs) => {
        const opens = safeFloat(inputs.opens);
        const delivered = safeFloat(inputs.delivered);
        if (delivered <= 0) return { result: 'Error', explanation: 'Delivered emails must be greater than 0.' };
        const rate = (opens / delivered) * 100;
        return {
          result: `${rate.toFixed(2)}%`,
          explanation: `${opens.toFixed(0)} opens out of ${delivered.toFixed(0)} delivered`,
          steps: [`Open Rate% = (Opens / Delivered) × 100 = (${opens} / ${delivered}) × 100 = ${rate.toFixed(2)}%`],
          tips: ['Subject lines and send-time testing usually move open rate the most.'],
          formula: 'Open Rate% = (Opens / Delivered) × 100'
        };
      }
    };
  }

  if (id === 'cpc-calculator') {
    return {
      title: 'CPC Calculator (Cost Per Click)',
      description: 'Calculate cost per click from ad spend and clicks.',
      inputs: [
        { name: 'spend', label: 'Ad Spend', type: 'number', defaultValue: 2000, prefix: '$' },
        { name: 'clicks', label: 'Clicks', type: 'number', defaultValue: 1000 },
      ],
      calculate: (inputs) => {
        const spend = safeFloat(inputs.spend);
        const clicks = safeFloat(inputs.clicks);
        if (clicks <= 0) return { result: 'Error', explanation: 'Clicks must be greater than 0.' };
        const cpc = spend / clicks;
        return {
          result: `$${cpc.toFixed(4)}`,
          explanation: `Cost per click from $${spend.toFixed(2)} / ${clicks.toFixed(0)} clicks`,
          steps: [`CPC = Spend / Clicks = ${spend} / ${clicks} = ${cpc.toFixed(4)}`],
          tips: ['Use CPC together with conversion rate to estimate CPA.'],
          formula: 'CPC = Spend / Clicks'
        };
      }
    };
  }

  if (id === 'cpm-calculator') {
    return {
      title: 'CPM Calculator (Cost Per 1,000 Impressions)',
      description: 'Calculate CPM from ad spend and impressions.',
      inputs: [
        { name: 'spend', label: 'Ad Spend', type: 'number', defaultValue: 2000, prefix: '$' },
        { name: 'impressions', label: 'Impressions', type: 'number', defaultValue: 250000 },
      ],
      calculate: (inputs) => {
        const spend = safeFloat(inputs.spend);
        const impressions = safeFloat(inputs.impressions);
        if (impressions <= 0) return { result: 'Error', explanation: 'Impressions must be greater than 0.' };
        const cpm = (spend / impressions) * 1000;
        return {
          result: `$${cpm.toFixed(2)}`,
          explanation: `Cost per 1,000 impressions from $${spend.toFixed(2)} and ${impressions.toFixed(0)} impressions`,
          steps: [`CPM = (Spend / Impressions) × 1000 = (${spend} / ${impressions}) × 1000 = ${cpm.toFixed(2)}`],
          tips: ['Use CPM for awareness campaigns; evaluate downstream clicks/conversions too.'],
          formula: 'CPM = (Spend / Impressions) × 1000'
        };
      }
    };
  }

  if (id === 'cpl-calculator') {
    return {
      title: 'CPL Calculator (Cost Per Lead)',
      description: 'Calculate cost per lead from spend and leads.',
      inputs: [
        { name: 'spend', label: 'Campaign Spend', type: 'number', defaultValue: 3000, prefix: '$' },
        { name: 'leads', label: 'Leads Generated', type: 'number', defaultValue: 250 },
      ],
      calculate: (inputs) => {
        const spend = safeFloat(inputs.spend);
        const leads = safeFloat(inputs.leads);
        if (leads <= 0) return { result: 'Error', explanation: 'Leads must be greater than 0.' };
        const cpl = spend / leads;
        return {
          result: `$${cpl.toFixed(2)}`,
          explanation: `Cost per lead from $${spend.toFixed(2)} / ${leads.toFixed(0)} leads`,
          steps: [`CPL = Spend / Leads = ${spend} / ${leads} = ${cpl.toFixed(2)}`],
          tips: ['Pair CPL with lead-to-customer conversion rate to estimate CAC.'],
          formula: 'CPL = Spend / Leads'
        };
      }
    };
  }

  if (id === 'cpa-calculator') {
    return {
      title: 'CPA Calculator (Cost Per Acquisition)',
      description: 'Calculate cost per acquisition from spend and conversions/customers.',
      inputs: [
        { name: 'spend', label: 'Total Spend', type: 'number', defaultValue: 5000, prefix: '$' },
        { name: 'acquisitions', label: 'Acquisitions (Customers/Conversions)', type: 'number', defaultValue: 100 },
      ],
      calculate: (inputs) => {
        const spend = safeFloat(inputs.spend);
        const acq = safeFloat(inputs.acquisitions);
        if (acq <= 0) return { result: 'Error', explanation: 'Acquisitions must be greater than 0.' };
        const cpa = spend / acq;
        return {
          result: `$${cpa.toFixed(2)}`,
          explanation: `Cost per acquisition from $${spend.toFixed(2)} / ${acq.toFixed(0)} acquisitions`,
          steps: [`CPA = Spend / Acquisitions = ${spend} / ${acq} = ${cpa.toFixed(2)}`],
          tips: ['Compare CPA to contribution margin and LTV to ensure profitability.'],
          formula: 'CPA = Spend / Acquisitions'
        };
      }
    };
  }

  if (id === 'lead-conversion-rate') {
    return {
      title: 'Lead Conversion Rate',
      description: 'Calculate lead-to-customer conversion rate.',
      inputs: [
        { name: 'leads', label: 'Leads', type: 'number', defaultValue: 2000 },
        { name: 'customers', label: 'Customers (Converted)', type: 'number', defaultValue: 200 },
      ],
      calculate: (inputs) => {
        const leads = safeFloat(inputs.leads);
        const customers = safeFloat(inputs.customers);
        if (leads <= 0) return { result: 'Error', explanation: 'Leads must be greater than 0.' };
        const rate = (customers / leads) * 100;
        return {
          result: `${rate.toFixed(2)}%`,
          explanation: `${customers.toFixed(0)} customers from ${leads.toFixed(0)} leads`,
          steps: [`Conversion% = (Customers / Leads) × 100 = (${customers} / ${leads}) × 100 = ${rate.toFixed(2)}%`],
          tips: ['Track by lead source; fix quality and follow-up process where conversion is low.'],
          formula: 'Lead Conversion% = (Customers / Leads) × 100'
        };
      }
    };
  }

  if (id === 'lead-velocity') {
    return {
      title: 'Lead Velocity Rate (LVR)',
      description: 'Measure growth in qualified leads from previous period to current period.',
      inputs: [
        { name: 'previousLeads', label: 'Qualified Leads (Previous Period)', type: 'number', defaultValue: 400 },
        { name: 'currentLeads', label: 'Qualified Leads (Current Period)', type: 'number', defaultValue: 520 },
      ],
      calculate: (inputs) => {
        const prev = safeFloat(inputs.previousLeads);
        const current = safeFloat(inputs.currentLeads);
        if (prev <= 0) return { result: 'Error', explanation: 'Previous period leads must be greater than 0.' };
        const lvr = ((current - prev) / prev) * 100;
        return {
          result: `${lvr.toFixed(2)}%`,
          explanation: `Leads changed from ${prev.toFixed(0)} to ${current.toFixed(0)}`,
          steps: [`LVR% = ((Current - Previous) / Previous) × 100 = ((${current} - ${prev}) / ${prev}) × 100 = ${lvr.toFixed(2)}%`],
          tips: ['Use LVR alongside win rate and sales cycle to forecast pipeline growth.'],
          formula: 'LVR% = ((CurrentLeads - PreviousLeads) / PreviousLeads) × 100'
        };
      }
    };
  }

  if (id === 'marketing-roi') {
    return {
      title: 'Marketing ROI',
      description: 'Calculate ROI from marketing revenue and marketing cost.',
      inputs: [
        { name: 'revenue', label: 'Revenue Attributed to Marketing', type: 'number', defaultValue: 25000, prefix: '$' },
        { name: 'cost', label: 'Marketing Cost', type: 'number', defaultValue: 8000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const revenue = safeFloat(inputs.revenue);
        const cost = safeFloat(inputs.cost);
        if (cost <= 0) return { result: 'Error', explanation: 'Marketing cost must be greater than 0.' };
        const roi = ((revenue - cost) / cost) * 100;
        return {
          result: `${roi.toFixed(2)}%`,
          explanation: `ROI from ($${revenue.toFixed(2)} - $${cost.toFixed(2)}) / $${cost.toFixed(2)}`,
          steps: [`ROI% = ((Revenue - Cost) / Cost) × 100 = ((${revenue} - ${cost}) / ${cost}) × 100 = ${roi.toFixed(2)}%`],
          tips: ['Ensure attribution model is consistent before comparing ROI across channels.'],
          formula: 'Marketing ROI% = ((Revenue - Cost) / Cost) × 100'
        };
      }
    };
  }

  if (id === 'market-share') {
    return {
      title: 'Market Share Calculator',
      description: 'Calculate market share from your sales and total market sales.',
      inputs: [
        { name: 'yourSales', label: 'Your Sales', type: 'number', defaultValue: 120000, prefix: '$' },
        { name: 'marketSales', label: 'Total Market Sales', type: 'number', defaultValue: 2000000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const your = safeFloat(inputs.yourSales);
        const market = safeFloat(inputs.marketSales);
        if (market <= 0) return { result: 'Error', explanation: 'Total market sales must be greater than 0.' };
        const share = (your / market) * 100;
        return {
          result: `${share.toFixed(2)}%`,
          explanation: `Market share from $${your.toFixed(2)} / $${market.toFixed(2)}`,
          steps: [`Share% = (Your Sales / Market Sales) × 100 = (${your} / ${market}) × 100 = ${share.toFixed(2)}%`],
          tips: ['Use the same time period and market definition for both numbers.'],
          formula: 'Market Share% = (YourSales / MarketSales) × 100'
        };
      }
    };
  }

  if (id === 'social-media-engagement') {
    return {
      title: 'Engagement Rate',
      description: 'Calculate engagement rate from engagements and impressions (or reach).',
      inputs: [
        { name: 'engagements', label: 'Engagements (likes + comments + shares)', type: 'number', defaultValue: 1200 },
        { name: 'impressions', label: 'Impressions / Reach', type: 'number', defaultValue: 50000 },
      ],
      calculate: (inputs) => {
        const engagements = safeFloat(inputs.engagements);
        const impressions = safeFloat(inputs.impressions);
        if (impressions <= 0) return { result: 'Error', explanation: 'Impressions/reach must be greater than 0.' };
        const rate = (engagements / impressions) * 100;
        return {
          result: `${rate.toFixed(2)}%`,
          explanation: `${engagements.toFixed(0)} engagements out of ${impressions.toFixed(0)} impressions`,
          steps: [`Engagement% = (Engagements / Impressions) × 100 = (${engagements} / ${impressions}) × 100 = ${rate.toFixed(2)}%`],
          tips: ['Benchmark engagement within the same platform and content format.'],
          formula: 'Engagement% = (Engagements / Impressions) × 100'
        };
      }
    };
  }

  if (id === 'share-of-wallet') {
    return {
      title: 'Share of Wallet',
      description: 'Estimate what share of a customer’s total category spend goes to you.',
      inputs: [
        { name: 'yourSpend', label: 'Customer Spend with You', type: 'number', defaultValue: 1200, prefix: '$' },
        { name: 'totalSpend', label: 'Customer Total Category Spend', type: 'number', defaultValue: 3000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const your = safeFloat(inputs.yourSpend);
        const total = safeFloat(inputs.totalSpend);
        if (total <= 0) return { result: 'Error', explanation: 'Total category spend must be greater than 0.' };
        const share = (your / total) * 100;
        return {
          result: `${share.toFixed(2)}%`,
          explanation: `Share of wallet from $${your.toFixed(2)} / $${total.toFixed(2)}`,
          steps: [`Share% = (Your / Total) × 100 = (${your} / ${total}) × 100 = ${share.toFixed(2)}%`],
          tips: ['Increase share of wallet through bundles, cross-sells, and loyalty programs.'],
          formula: 'Share of Wallet% = (YourSpend / TotalSpend) × 100'
        };
      }
    };
  }

  if (id === 'profit-per-order') {
    return {
      title: 'Profit Per Order',
      description: 'Calculate profit per order from total profit and number of orders.',
      inputs: [
        { name: 'profit', label: 'Total Profit', type: 'number', defaultValue: 2000, prefix: '$' },
        { name: 'orders', label: 'Orders', type: 'number', defaultValue: 100 },
      ],
      calculate: (inputs) => {
        const profit = safeFloat(inputs.profit);
        const orders = safeFloat(inputs.orders);
        if (orders <= 0) return { result: 'Error', explanation: 'Orders must be greater than 0.' };
        const ppo = profit / orders;
        return {
          result: `$${ppo.toFixed(2)}`,
          explanation: `Profit per order from $${profit.toFixed(2)} / ${orders.toFixed(0)} orders`,
          steps: [`Profit/Order = Profit / Orders = ${profit} / ${orders} = ${ppo.toFixed(2)}`],
          tips: ['Improve profit per order via pricing, mix, AOV, and variable cost reductions.'],
          formula: 'Profit per Order = Total Profit / Orders'
        };
      }
    };
  }

  if (id === 'purchase-frequency') {
    return {
      title: 'Purchase Frequency',
      description: 'Calculate average purchases per customer in a period.',
      inputs: [
        { name: 'orders', label: 'Total Orders', type: 'number', defaultValue: 1200 },
        { name: 'customers', label: 'Unique Customers', type: 'number', defaultValue: 400 },
      ],
      calculate: (inputs) => {
        const orders = safeFloat(inputs.orders);
        const customers = safeFloat(inputs.customers);
        if (customers <= 0) return { result: 'Error', explanation: 'Unique customers must be greater than 0.' };
        const freq = orders / customers;
        return {
          result: `${freq.toFixed(2)} orders/customer`,
          explanation: `${orders.toFixed(0)} orders across ${customers.toFixed(0)} customers`,
          steps: [`Frequency = Orders / Customers = ${orders} / ${customers} = ${freq.toFixed(2)}`],
          tips: ['Increase frequency with retention campaigns, replenishment reminders, and loyalty rewards.'],
          formula: 'Purchase Frequency = Orders / Unique Customers'
        };
      }
    };
  }

  if (id === 'repeat-purchase-rate') {
    return {
      title: 'Repeat Purchase Rate',
      description: 'Calculate percent of customers who purchased more than once.',
      inputs: [
        { name: 'repeatCustomers', label: 'Repeat Customers', type: 'number', defaultValue: 120 },
        { name: 'totalCustomers', label: 'Total Customers', type: 'number', defaultValue: 400 },
      ],
      calculate: (inputs) => {
        const repeat = safeFloat(inputs.repeatCustomers);
        const total = safeFloat(inputs.totalCustomers);
        if (total <= 0) return { result: 'Error', explanation: 'Total customers must be greater than 0.' };
        const rate = (repeat / total) * 100;
        return {
          result: `${rate.toFixed(2)}%`,
          explanation: `${repeat.toFixed(0)} repeat customers out of ${total.toFixed(0)}`,
          steps: [`Repeat Rate% = (Repeat / Total) × 100 = (${repeat} / ${total}) × 100 = ${rate.toFixed(2)}%`],
          tips: ['Repeat rate improves with product quality, post-purchase experience, and targeted offers.'],
          formula: 'Repeat Purchase Rate% = (RepeatCustomers / TotalCustomers) × 100'
        };
      }
    };
  }

  if (id === 'cross-sell-rate') {
    return {
      title: 'Cross-Sell Rate',
      description: 'Calculate cross-sell rate from cross-sell purchases and total orders.',
      inputs: [
        { name: 'crossSellOrders', label: 'Orders with Cross-Sell', type: 'number', defaultValue: 180 },
        { name: 'totalOrders', label: 'Total Orders', type: 'number', defaultValue: 1200 },
      ],
      calculate: (inputs) => {
        const cross = safeFloat(inputs.crossSellOrders);
        const total = safeFloat(inputs.totalOrders);
        if (total <= 0) return { result: 'Error', explanation: 'Total orders must be greater than 0.' };
        const rate = (cross / total) * 100;
        return {
          result: `${rate.toFixed(2)}%`,
          explanation: `${cross.toFixed(0)} cross-sell orders out of ${total.toFixed(0)} orders`,
          steps: [`Cross-Sell% = (Cross-sell Orders / Total Orders) × 100 = (${cross} / ${total}) × 100 = ${rate.toFixed(2)}%`],
          tips: ['Bundles and “frequently bought together” placements typically increase cross-sell rate.'],
          formula: 'Cross-Sell Rate% = (CrossSellOrders / TotalOrders) × 100'
        };
      }
    };
  }

  if (id === 'upsell-rate') {
    return {
      title: 'Upsell Rate',
      description: 'Calculate upsell rate from upsells and total opportunities/customers.',
      inputs: [
        { name: 'upsells', label: 'Upsells', type: 'number', defaultValue: 60 },
        { name: 'base', label: 'Total Customers / Opportunities', type: 'number', defaultValue: 400 },
      ],
      calculate: (inputs) => {
        const upsells = safeFloat(inputs.upsells);
        const base = safeFloat(inputs.base);
        if (base <= 0) return { result: 'Error', explanation: 'Total customers/opportunities must be greater than 0.' };
        const rate = (upsells / base) * 100;
        return {
          result: `${rate.toFixed(2)}%`,
          explanation: `${upsells.toFixed(0)} upsells out of ${base.toFixed(0)}`,
          steps: [`Upsell% = (Upsells / Base) × 100 = (${upsells} / ${base}) × 100 = ${rate.toFixed(2)}%`],
          tips: ['Upsells work best when value is clear and timing is right (post-activation).'],
          formula: 'Upsell Rate% = (Upsells / Base) × 100'
        };
      }
    };
  }

  if (id === 'referral-rate') {
    return {
      title: 'Referral Rate',
      description: 'Calculate referral rate from referrals and total customers/users.',
      inputs: [
        { name: 'referrals', label: 'Referrals Generated', type: 'number', defaultValue: 80 },
        { name: 'customers', label: 'Total Customers / Users', type: 'number', defaultValue: 400 },
      ],
      calculate: (inputs) => {
        const referrals = safeFloat(inputs.referrals);
        const customers = safeFloat(inputs.customers);
        if (customers <= 0) return { result: 'Error', explanation: 'Total customers/users must be greater than 0.' };
        const rate = (referrals / customers) * 100;
        return {
          result: `${rate.toFixed(2)}%`,
          explanation: `${referrals.toFixed(0)} referrals from ${customers.toFixed(0)} customers`,
          steps: [`Referral% = (Referrals / Customers) × 100 = (${referrals} / ${customers}) × 100 = ${rate.toFixed(2)}%`],
          tips: ['Track referral rate by cohort; strong retention typically drives more referrals.'],
          formula: 'Referral Rate% = (Referrals / Customers) × 100'
        };
      }
    };
  }

  if (id === 'viral-coefficient') {
    return {
      title: 'Viral Coefficient',
      description: 'Estimate viral coefficient from invites per user and invite conversion rate.',
      inputs: [
        { name: 'invitesPerUser', label: 'Invites per User', type: 'number', defaultValue: 2 },
        { name: 'inviteConversionRate', label: 'Invite Conversion Rate', type: 'number', defaultValue: 25, suffix: '%' },
      ],
      calculate: (inputs) => {
        const invites = safeFloat(inputs.invitesPerUser);
        const conv = safeFloat(inputs.inviteConversionRate) / 100;
        const k = invites * Math.max(0, Math.min(1, conv));
        return {
          result: `${k.toFixed(2)}`,
          explanation: 'k ≥ 1 implies self-sustaining viral growth (in theory).',
          steps: [`k = Invites/User × ConversionRate = ${invites} × ${conv.toFixed(4)} = ${k.toFixed(2)}`],
          tips: ['In practice, keep measuring retention too—viral growth without retention still churns out.'],
          formula: 'Viral Coefficient (k) = InvitesPerUser × InviteConversionRate'
        };
      }
    };
  }

  if (id === 'customer-satisfaction') {
    return {
      title: 'CSAT Score',
      description: 'Calculate CSAT as % of satisfied responses.',
      inputs: [
        { name: 'satisfied', label: 'Satisfied Responses', type: 'number', defaultValue: 120 },
        { name: 'total', label: 'Total Responses', type: 'number', defaultValue: 150 },
      ],
      calculate: (inputs) => {
        const satisfied = safeFloat(inputs.satisfied);
        const total = safeFloat(inputs.total);
        if (total <= 0) return { result: 'Error', explanation: 'Total responses must be greater than 0.' };
        const csat = (satisfied / total) * 100;
        return {
          result: `${csat.toFixed(2)}%`,
          explanation: `${satisfied.toFixed(0)} satisfied out of ${total.toFixed(0)}`,
          steps: [`CSAT% = (Satisfied / Total) × 100 = (${satisfied} / ${total}) × 100 = ${csat.toFixed(2)}%`],
          tips: ['Define “satisfied” consistently (e.g., 4–5 on a 5-point scale).'],
          formula: 'CSAT% = (SatisfiedResponses / TotalResponses) × 100'
        };
      }
    };
  }

  if (id === 'customer-effort') {
    return {
      title: 'CES Score (Customer Effort Score)',
      description: 'Calculate CES as average score across responses.',
      inputs: [
        { name: 'totalScore', label: 'Total Score (sum of responses)', type: 'number', defaultValue: 480 },
        { name: 'responses', label: 'Number of Responses', type: 'number', defaultValue: 100 },
        { name: 'scaleMax', label: 'Max Scale Value', type: 'number', defaultValue: 7 },
      ],
      calculate: (inputs) => {
        const totalScore = safeFloat(inputs.totalScore);
        const responses = safeFloat(inputs.responses);
        const max = safeFloat(inputs.scaleMax);
        if (responses <= 0) return { result: 'Error', explanation: 'Responses must be greater than 0.' };
        const avg = totalScore / responses;
        return {
          result: `${avg.toFixed(2)} / ${max.toFixed(0)}`,
          explanation: `Average effort score from ${responses.toFixed(0)} responses`,
          steps: [`CES (avg) = Total Score / Responses = ${totalScore} / ${responses} = ${avg.toFixed(2)}`],
          tips: ['Lower effort (higher score if scale is “easy”) typically correlates with better retention.'],
          formula: 'CES (avg) = TotalScore / Responses'
        };
      }
    };
  }

  if (id === 'net-promoter-score') {
    return {
      title: 'Net Promoter Score (NPS)',
      description: 'Calculate NPS = %Promoters − %Detractors.',
      inputs: [
        { name: 'promoters', label: 'Promoters (9–10)', type: 'number', defaultValue: 70 },
        { name: 'detractors', label: 'Detractors (0–6)', type: 'number', defaultValue: 15 },
        { name: 'total', label: 'Total Responses', type: 'number', defaultValue: 100 },
      ],
      calculate: (inputs) => {
        const promoters = safeFloat(inputs.promoters);
        const detractors = safeFloat(inputs.detractors);
        const total = safeFloat(inputs.total);
        if (total <= 0) return { result: 'Error', explanation: 'Total responses must be greater than 0.' };
        const pctPromoters = (promoters / total) * 100;
        const pctDetractors = (detractors / total) * 100;
        const nps = pctPromoters - pctDetractors;
        return {
          result: `${nps.toFixed(0)}`,
          explanation: `%Promoters ${pctPromoters.toFixed(1)} − %Detractors ${pctDetractors.toFixed(1)}`,
          steps: [
            `%Promoters = ${promoters} / ${total} × 100 = ${pctPromoters.toFixed(1)}%`,
            `%Detractors = ${detractors} / ${total} × 100 = ${pctDetractors.toFixed(1)}%`,
            `NPS = %Promoters − %Detractors = ${pctPromoters.toFixed(1)} − ${pctDetractors.toFixed(1)} = ${nps.toFixed(1)}`
          ],
          tips: ['NPS ranges from -100 to 100; track trend over time and segment by cohort.'],
          formula: 'NPS = (%Promoters − %Detractors)'
        };
      }
    };
  }

  if (id === 'retention-rate') {
    return {
      title: 'Customer Retention Rate',
      description: 'Calculate retention rate: (End − New) / Start.',
      inputs: [
        { name: 'customersStart', label: 'Customers at Start', type: 'number', defaultValue: 1000 },
        { name: 'customersEnd', label: 'Customers at End', type: 'number', defaultValue: 1100 },
        { name: 'newCustomers', label: 'New Customers Acquired', type: 'number', defaultValue: 200 },
      ],
      calculate: (inputs) => {
        const start = safeFloat(inputs.customersStart);
        const end = safeFloat(inputs.customersEnd);
        const newCustomers = safeFloat(inputs.newCustomers);
        if (start <= 0) return { result: 'Error', explanation: 'Customers at start must be greater than 0.' };
        const retained = end - newCustomers;
        const rate = (retained / start) * 100;
        return {
          result: `${rate.toFixed(2)}%`,
          explanation: `Retained customers: ${retained.toFixed(0)} (End ${end.toFixed(0)} − New ${newCustomers.toFixed(0)})`,
          steps: [
            `Retained = End − New = ${end} − ${newCustomers} = ${retained.toFixed(0)}`,
            `Retention% = (Retained / Start) × 100 = (${retained.toFixed(0)} / ${start}) × 100 = ${rate.toFixed(2)}%`
          ],
          tips: ['If retention rate is low, focus on onboarding, support, product quality, and churn prevention.'],
          formula: 'Retention% = ((CustomersEnd − NewCustomers) / CustomersStart) × 100'
        };
      }
    };
  }

  if (id === 'sales-cycle-length') {
    return {
      title: 'Sales Cycle Length',
      description: 'Calculate average sales cycle length from total days and deals won.',
      inputs: [
        { name: 'totalDays', label: 'Total Days (sum across deals)', type: 'number', defaultValue: 900 },
        { name: 'dealsWon', label: 'Deals Won', type: 'number', defaultValue: 20 },
      ],
      calculate: (inputs) => {
        const totalDays = safeFloat(inputs.totalDays);
        const deals = safeFloat(inputs.dealsWon);
        if (deals <= 0) return { result: 'Error', explanation: 'Deals won must be greater than 0.' };
        const avg = totalDays / deals;
        return {
          result: `${avg.toFixed(1)} days`,
          explanation: `${totalDays.toFixed(0)} total days across ${deals.toFixed(0)} deals`,
          steps: [`Avg Cycle = Total Days / Deals Won = ${totalDays} / ${deals} = ${avg.toFixed(1)} days`],
          tips: ['Shorter cycles usually improve cash flow; qualify leads and remove friction in the sales process.'],
          formula: 'Average Sales Cycle (days) = TotalDays / DealsWon'
        };
      }
    };
  }

  if (id === 'quota-attainment') {
    return {
      title: 'Quota Attainment',
      description: 'Calculate quota attainment from actual sales and quota.',
      inputs: [
        { name: 'actual', label: 'Actual Sales', type: 'number', defaultValue: 95000, prefix: '$' },
        { name: 'quota', label: 'Sales Quota', type: 'number', defaultValue: 100000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const actual = safeFloat(inputs.actual);
        const quota = safeFloat(inputs.quota);
        if (quota <= 0) return { result: 'Error', explanation: 'Quota must be greater than 0.' };
        const pct = (actual / quota) * 100;
        return {
          result: `${pct.toFixed(2)}%`,
          explanation: `Attainment from $${actual.toFixed(2)} / $${quota.toFixed(2)}`,
          steps: [`Attainment% = (Actual / Quota) × 100 = (${actual} / ${quota}) × 100 = ${pct.toFixed(2)}%`],
          tips: ['Use quota attainment to diagnose pipeline coverage and execution issues.'],
          formula: 'Quota Attainment% = (ActualSales / Quota) × 100'
        };
      }
    };
  }

  if (id === 'sales-growth') {
    return {
      title: 'Sales Growth Rate',
      description: 'Calculate sales growth rate from previous period sales and current period sales.',
      inputs: [
        { name: 'previous', label: 'Previous Period Sales', type: 'number', defaultValue: 80000, prefix: '$' },
        { name: 'current', label: 'Current Period Sales', type: 'number', defaultValue: 95000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const prev = safeFloat(inputs.previous);
        const current = safeFloat(inputs.current);
        if (prev <= 0) return { result: 'Error', explanation: 'Previous period sales must be greater than 0.' };
        const growth = ((current - prev) / prev) * 100;
        return {
          result: `${growth.toFixed(2)}%`,
          explanation: `Sales changed from $${prev.toFixed(2)} to $${current.toFixed(2)}`,
          steps: [`Growth% = ((Current - Previous) / Previous) × 100 = ((${current} - ${prev}) / ${prev}) × 100 = ${growth.toFixed(2)}%`],
          tips: ['Compare sales growth with gross margin to ensure growth is profitable.'],
          formula: 'Sales Growth% = ((Current - Previous) / Previous) × 100'
        };
      }
    };
  }

  if (id === 'sales-efficiency') {
    return {
      title: 'Sales Efficiency',
      description: 'Calculate sales efficiency as net new revenue divided by sales & marketing spend.',
      inputs: [
        { name: 'netNewRevenue', label: 'Net New Revenue', type: 'number', defaultValue: 50000, prefix: '$' },
        { name: 'salesMarketingSpend', label: 'Sales & Marketing Spend', type: 'number', defaultValue: 40000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const netNew = safeFloat(inputs.netNewRevenue);
        const spend = safeFloat(inputs.salesMarketingSpend);
        if (spend <= 0) return { result: 'Error', explanation: 'Sales & marketing spend must be greater than 0.' };
        const efficiency = netNew / spend;
        return {
          result: `${efficiency.toFixed(2)}x`,
          explanation: `Net new revenue $${netNew.toFixed(2)} per $1 spent`,
          steps: [`Sales Efficiency = Net New Revenue / Spend = ${netNew} / ${spend} = ${efficiency.toFixed(2)}x`],
          tips: ['Use consistent time windows (e.g., quarterly net new revenue vs quarterly S&M spend).'],
          formula: 'Sales Efficiency = NetNewRevenue / SalesMarketingSpend'
        };
      }
    };
  }

  if (id === 'average-order-value') {
    return {
      title: 'Average Order Value (AOV) Calculator',
      description: 'Calculate average order value from revenue and orders.',
      inputs: [
        { name: 'revenue', label: 'Total Revenue', type: 'number', defaultValue: 5000, prefix: '$' },
        { name: 'orders', label: 'Total Orders', type: 'number', defaultValue: 100 },
      ],
      calculate: (inputs) => {
        const revenue = safeFloat(inputs.revenue);
        const orders = safeFloat(inputs.orders);
        if (orders <= 0) return { result: 'Error', explanation: 'Orders must be greater than 0.' };

        const aov = revenue / orders;
        return {
          result: `$${aov.toFixed(2)}`,
          explanation: `AOV from $${revenue.toFixed(2)} across ${orders.toFixed(0)} orders`,
          steps: [
            `AOV = Revenue / Orders = ${revenue} / ${orders} = ${aov.toFixed(2)}`
          ],
          tips: [
            'Increase AOV using bundles, upsells, and free shipping thresholds.',
          ],
          formula: 'AOV = Revenue / Orders'
        };
      }
    };
  }

  if (id === 'monthly-recurring-revenue' || id === 'mrr-calculator') {
    return {
      title: 'Monthly Recurring Revenue (MRR)',
      description: 'Estimate MRR using customers and average monthly revenue per customer.',
      inputs: [
        { name: 'customers', label: 'Active Customers', type: 'number', defaultValue: 200 },
        { name: 'arpu', label: 'Average Revenue Per User (Monthly)', type: 'number', defaultValue: 25, prefix: '$' },
      ],
      calculate: (inputs) => {
        const customers = safeFloat(inputs.customers);
        const arpu = safeFloat(inputs.arpu);
        const mrr = customers * arpu;

        return {
          result: `$${mrr.toFixed(2)}`,
          explanation: `MRR = ${customers.toFixed(0)} × $${arpu.toFixed(2)}`,
          steps: [
            `MRR = Customers × ARPU = ${customers} × ${arpu} = ${mrr.toFixed(2)}`
          ],
          tips: [
            'Track MRR alongside churn and expansion revenue for a clearer picture.',
          ],
          formula: 'MRR = Customers × ARPU',
          visualData: [
            { label: 'Customers', value: customers },
            { label: 'MRR', value: mrr },
          ]
        };
      }
    };
  }

  if (id === 'annual-recurring-revenue' || id === 'arr-calculator') {
    return {
      title: 'Annual Recurring Revenue (ARR)',
      description: 'Convert MRR to ARR.',
      inputs: [
        { name: 'mrr', label: 'Monthly Recurring Revenue (MRR)', type: 'number', defaultValue: 5000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const mrr = safeFloat(inputs.mrr);
        const arr = mrr * 12;
        return {
          result: `$${arr.toFixed(2)}`,
          explanation: `ARR = $${mrr.toFixed(2)} × 12`,
          steps: [`ARR = MRR × 12 = ${mrr.toFixed(2)} × 12 = ${arr.toFixed(2)}`],
          tips: ['ARR is most useful for subscription businesses with consistent recurring revenue.'],
          formula: 'ARR = MRR × 12'
        };
      }
    };
  }

  if (id === 'arpu-calculator') {
    return {
      title: 'ARPU Calculator (Average Revenue Per User)',
      description: 'Calculate ARPU as revenue divided by total users/customers.',
      inputs: [
        { name: 'revenue', label: 'Total Revenue', type: 'number', defaultValue: 50000, prefix: '$' },
        { name: 'users', label: 'Total Users / Customers', type: 'number', defaultValue: 1000 },
        { name: 'period', label: 'Period', type: 'select', options: ['Monthly', 'Quarterly', 'Annual'], defaultValue: 'Monthly' },
      ],
      calculate: (inputs) => {
        const revenue = safeFloat(inputs.revenue);
        const users = safeFloat(inputs.users);
        const period = String(inputs.period || 'Monthly');
        if (users <= 0) return { result: 'Error', explanation: 'Users must be greater than 0.' };
        const arpu = revenue / users;
        return {
          result: `$${arpu.toFixed(2)}`,
          explanation: `ARPU (${period.toLowerCase()}) from $${revenue.toFixed(2)} / ${users.toFixed(0)} users`,
          steps: [
            `ARPU = Revenue / Users = ${revenue} / ${users} = ${arpu.toFixed(2)}`
          ],
          tips: [
            'Track ARPU by cohort, plan, or channel to find where monetization is strongest.',
            'Pair ARPU with gross margin and churn to estimate LTV.'
          ],
          formula: 'ARPU = Revenue / Users',
          visualData: [
            { label: 'Revenue', value: revenue },
            { label: 'Users', value: users },
          ]
        };
      }
    };
  }

  if (id === 'arppu-calculator') {
    return {
      title: 'ARPPU Calculator (Average Revenue Per Paying User)',
      description: 'Calculate ARPPU as revenue divided by paying users.',
      inputs: [
        { name: 'revenue', label: 'Revenue from Paying Users', type: 'number', defaultValue: 40000, prefix: '$' },
        { name: 'payingUsers', label: 'Paying Users', type: 'number', defaultValue: 250 },
        { name: 'period', label: 'Period', type: 'select', options: ['Monthly', 'Quarterly', 'Annual'], defaultValue: 'Monthly' },
      ],
      calculate: (inputs) => {
        const revenue = safeFloat(inputs.revenue);
        const paying = safeFloat(inputs.payingUsers);
        const period = String(inputs.period || 'Monthly');
        if (paying <= 0) return { result: 'Error', explanation: 'Paying users must be greater than 0.' };
        const arppu = revenue / paying;
        return {
          result: `$${arppu.toFixed(2)}`,
          explanation: `ARPPU (${period.toLowerCase()}) from $${revenue.toFixed(2)} / ${paying.toFixed(0)} paying users`,
          steps: [`ARPPU = Revenue / Paying Users = ${revenue} / ${paying} = ${arppu.toFixed(2)}`],
          tips: [
            'ARPPU is especially useful for freemium models where many users pay $0.',
            'Also track payer conversion rate (paying users / total users).'
          ],
          formula: 'ARPPU = Revenue / Paying Users'
        };
      }
    };
  }

  if (id === 'average-deal-size') {
    return {
      title: 'Average Deal Size',
      description: 'Calculate average deal size from revenue and number of deals.',
      inputs: [
        { name: 'revenue', label: 'Revenue from Closed Deals', type: 'number', defaultValue: 250000, prefix: '$' },
        { name: 'deals', label: 'Number of Deals Closed', type: 'number', defaultValue: 25 },
      ],
      calculate: (inputs) => {
        const revenue = safeFloat(inputs.revenue);
        const deals = safeFloat(inputs.deals);
        if (deals <= 0) return { result: 'Error', explanation: 'Deals must be greater than 0.' };
        const avg = revenue / deals;
        return {
          result: `$${avg.toFixed(2)}`,
          explanation: `Average deal size from $${revenue.toFixed(2)} across ${deals.toFixed(0)} deals`,
          steps: [`Avg Deal Size = Revenue / Deals = ${revenue} / ${deals} = ${avg.toFixed(2)}`],
          tips: ['Segment by product line, region, or sales team to find where deal size is highest.'],
          formula: 'Average Deal Size = Revenue / Deals'
        };
      }
    };
  }

  if (id === 'sales-pipeline') {
    return {
      title: 'Sales Pipeline Value',
      description: 'Estimate total pipeline value and win-adjusted value.',
      inputs: [
        { name: 'opportunities', label: 'Open Opportunities', type: 'number', defaultValue: 50 },
        { name: 'avgDealSize', label: 'Average Deal Size', type: 'number', defaultValue: 10000, prefix: '$' },
        { name: 'winRate', label: 'Win Rate', type: 'number', defaultValue: 20, suffix: '%' },
      ],
      calculate: (inputs) => {
        const opps = safeFloat(inputs.opportunities);
        const deal = safeFloat(inputs.avgDealSize);
        const win = safeFloat(inputs.winRate) / 100;

        const pipeline = opps * deal;
        const weighted = pipeline * Math.max(0, Math.min(1, win));

        return {
          result: `$${pipeline.toFixed(2)}`,
          explanation: `Win-adjusted pipeline: $${weighted.toFixed(2)}`,
          steps: [
            `Pipeline = Opportunities × Avg Deal Size = ${opps} × ${deal} = ${pipeline.toFixed(2)}`,
            `Weighted Pipeline = Pipeline × Win Rate = ${pipeline.toFixed(2)} × ${win.toFixed(4)} = ${weighted.toFixed(2)}`
          ],
          tips: [
            'Compare pipeline coverage to quota (e.g., 3–5×) depending on your sales cycle and win rate.',
            'Keep win rate realistic (use last 3–6 months actuals).'
          ],
          formula: 'Weighted Pipeline = Opportunities × AvgDealSize × WinRate'
        };
      }
    };
  }

  if (id === 'pipeline-velocity') {
    return {
      title: 'Pipeline Velocity',
      description: 'Estimate revenue velocity: (opps × avg deal × win rate) / sales cycle length.',
      inputs: [
        { name: 'opportunities', label: 'Qualified Opportunities', type: 'number', defaultValue: 50 },
        { name: 'avgDealSize', label: 'Average Deal Size', type: 'number', defaultValue: 10000, prefix: '$' },
        { name: 'winRate', label: 'Win Rate', type: 'number', defaultValue: 20, suffix: '%' },
        { name: 'salesCycleDays', label: 'Sales Cycle Length (days)', type: 'number', defaultValue: 45 },
      ],
      calculate: (inputs) => {
        const opps = safeFloat(inputs.opportunities);
        const deal = safeFloat(inputs.avgDealSize);
        const win = safeFloat(inputs.winRate) / 100;
        const days = safeFloat(inputs.salesCycleDays);
        if (days <= 0) return { result: 'Error', explanation: 'Sales cycle days must be greater than 0.' };
        const velocity = (opps * deal * Math.max(0, Math.min(1, win))) / days;
        return {
          result: `$${velocity.toFixed(2)} / day`,
          explanation: 'Higher velocity means revenue moves faster through the pipeline.',
          steps: [
            `Velocity = (Opps × Deal × WinRate) / Days = (${opps} × ${deal} × ${win.toFixed(4)}) / ${days} = ${velocity.toFixed(2)}`
          ],
          tips: [
            'You can increase velocity by improving win rate, reducing cycle time, increasing deal size, or adding more qualified opps.',
          ],
          formula: 'Velocity = (Opps × AvgDeal × WinRate) / SalesCycleDays'
        };
      }
    };
  }

  if (id === 'win-rate') {
    return {
      title: 'Win Rate Calculator',
      description: 'Calculate win rate from deals won and total opportunities.',
      inputs: [
        { name: 'won', label: 'Deals Won', type: 'number', defaultValue: 20 },
        { name: 'total', label: 'Total Opportunities', type: 'number', defaultValue: 100 },
      ],
      calculate: (inputs) => {
        const won = safeFloat(inputs.won);
        const total = safeFloat(inputs.total);
        if (total <= 0) return { result: 'Error', explanation: 'Total opportunities must be greater than 0.' };
        const rate = (won / total) * 100;
        return {
          result: `${rate.toFixed(2)}%`,
          explanation: `${won.toFixed(0)} wins out of ${total.toFixed(0)} opportunities`,
          steps: [`Win Rate% = (Won / Total) × 100 = (${won} / ${total}) × 100 = ${rate.toFixed(2)}%`],
          tips: ['Track win rate by segment (industry, deal size, lead source) to find where you win most.'],
          formula: 'Win Rate% = (Won / Total) × 100'
        };
      }
    };
  }

  // --- Retention & Unit Economics ---
  if (id === 'churn-rate' || id === 'churn-rate-calculator') {
    return {
      title: 'Churn Rate Calculator',
      description: 'Calculate churn rate over a period.',
      inputs: [
        { name: 'customersStart', label: 'Customers at Start', type: 'number', defaultValue: 1000 },
        { name: 'customersLost', label: 'Customers Lost', type: 'number', defaultValue: 50 },
      ],
      calculate: (inputs) => {
        const start = safeFloat(inputs.customersStart);
        const lost = safeFloat(inputs.customersLost);
        if (start <= 0) return { result: 'Error', explanation: 'Customers at start must be greater than 0.' };
        const churn = (lost / start) * 100;
        return {
          result: `${churn.toFixed(2)}%`,
          explanation: `${lost.toFixed(0)} lost out of ${start.toFixed(0)}`,
          steps: [`Churn% = (Lost / Start) × 100 = (${lost} / ${start}) × 100 = ${churn.toFixed(2)}%`],
          tips: [
            churn <= 2 ? 'Excellent churn for many subscription models.' : 'Reduce churn via onboarding, support, and product improvements.',
          ],
          formula: 'Churn% = (CustomersLost / CustomersStart) × 100'
        };
      }
    };
  }

  if (id === 'ltv-cac-ratio') {
    return {
      title: 'LTV:CAC Ratio Calculator',
      description: 'Estimate customer lifetime value (LTV) and compare it to customer acquisition cost (CAC).',
      inputs: [
        { name: 'arpu', label: 'ARPU (Monthly)', type: 'number', defaultValue: 50, prefix: '$' },
        { name: 'grossMargin', label: 'Gross Margin', type: 'number', defaultValue: 70, suffix: '%' },
        { name: 'churnRate', label: 'Monthly Churn Rate', type: 'number', defaultValue: 5, suffix: '%' },
        { name: 'cac', label: 'CAC', type: 'number', defaultValue: 200, prefix: '$' },
      ],
      calculate: (inputs) => {
        const arpu = safeFloat(inputs.arpu);
        const gm = safeFloat(inputs.grossMargin) / 100;
        const churn = safeFloat(inputs.churnRate) / 100;
        const cac = safeFloat(inputs.cac);

        if (cac <= 0) return { result: 'Error', explanation: 'CAC must be greater than 0.' };
        if (churn <= 0) return { result: 'Error', explanation: 'Churn rate must be greater than 0.' };

        const lifetimeMonths = 1 / churn;
        const ltv = arpu * gm * lifetimeMonths;
        const ratio = ltv / cac;

        const tips: string[] = [];
        if (ratio >= 3) tips.push('✅ Strong unit economics (commonly LTV:CAC ≥ 3).');
        else if (ratio >= 1) tips.push('⚠️ Borderline unit economics — work on retention, pricing, or CAC efficiency.');
        else tips.push('🚨 LTV below CAC — likely not sustainable without improvements.');

        return {
          result: `${ratio.toFixed(2)}x`,
          explanation: `Estimated LTV: $${ltv.toFixed(2)} | Lifetime: ${lifetimeMonths.toFixed(1)} months`,
          steps: [
            `Lifetime (months) ≈ 1 / Churn = 1 / ${churn.toFixed(4)} = ${lifetimeMonths.toFixed(2)}`,
            `LTV ≈ ARPU × Gross Margin × Lifetime = ${arpu} × ${gm.toFixed(2)} × ${lifetimeMonths.toFixed(2)} = ${ltv.toFixed(2)}`,
            `LTV:CAC = LTV / CAC = ${ltv.toFixed(2)} / ${cac.toFixed(2)} = ${ratio.toFixed(2)}x`,
          ],
          tips,
          formula: 'LTV:CAC = (ARPU × GrossMargin × (1/Churn)) / CAC',
          visualData: [
            { label: 'LTV', value: ltv },
            { label: 'CAC', value: cac },
          ]
        };
      }
    };
  }

  // --- Hiring ---
  if (id === 'cost-per-hire') {
    return {
      title: 'Cost Per Hire Calculator',
      description: 'Calculate hiring cost per new employee.',
      inputs: [
        { name: 'recruitingCosts', label: 'Recruiting & Ads Costs', type: 'number', defaultValue: 2000, prefix: '$' },
        { name: 'agencyFees', label: 'Agency Fees', type: 'number', defaultValue: 0, prefix: '$' },
        { name: 'interviewTimeCost', label: 'Interview Time Cost', type: 'number', defaultValue: 500, prefix: '$' },
        { name: 'hires', label: 'Number of Hires', type: 'number', defaultValue: 1 },
      ],
      calculate: (inputs) => {
        const recruiting = safeFloat(inputs.recruitingCosts);
        const agency = safeFloat(inputs.agencyFees);
        const interview = safeFloat(inputs.interviewTimeCost);
        const hires = safeFloat(inputs.hires);
        if (hires <= 0) return { result: 'Error', explanation: 'Number of hires must be greater than 0.' };

        const total = recruiting + agency + interview;
        const cph = total / hires;
        return {
          result: `$${cph.toFixed(2)}`,
          explanation: `Total hiring cost: $${total.toFixed(2)}`,
          steps: [
            `Total Cost = Recruiting + Agency + Interview Time = ${recruiting} + ${agency} + ${interview} = ${total.toFixed(2)}`,
            `Cost Per Hire = Total / Hires = ${total.toFixed(2)} / ${hires} = ${cph.toFixed(2)}`
          ],
          tips: ['Include internal recruiter time and referral bonuses for a more accurate number.'],
          formula: 'CPH = Total Hiring Costs / Number of Hires'
        };
      }
    };
  }

  // --- Efficiency & Operations ---
  if (id === 'employee-productivity') {
    return {
      title: 'Employee Productivity Calculator',
      description: 'Estimate revenue per employee (a common productivity metric).',
      inputs: [
        { name: 'revenue', label: 'Revenue', type: 'number', defaultValue: 1000000, prefix: '$' },
        { name: 'employees', label: 'Number of Employees', type: 'number', defaultValue: 10 },
      ],
      calculate: (inputs) => {
        const revenue = safeFloat(inputs.revenue);
        const employees = safeFloat(inputs.employees);
        if (employees <= 0) return { result: 'Error', explanation: 'Employees must be greater than 0.' };
        const rpe = revenue / employees;
        return {
          result: `$${rpe.toFixed(2)}`,
          explanation: `Revenue per employee`,
          steps: [`Revenue/Employee = Revenue / Employees = ${revenue} / ${employees} = ${rpe.toFixed(2)}`],
          tips: ['Compare revenue/employee with peers in your industry for best insights.'],
          formula: 'Revenue per Employee = Revenue / Employees'
        };
      }
    };
  }

  // --- Working Capital & Cash Cycle ---
  if (id === 'inventory-days' || id === 'days-sales-inventory') {
    return {
      title: 'Inventory Days (DIO) Calculator',
      description: 'Calculate Days Inventory Outstanding (DIO).',
      inputs: [
        { name: 'avgInventory', label: 'Average Inventory', type: 'number', defaultValue: 50000, prefix: '$' },
        { name: 'cogs', label: 'COGS (Annual)', type: 'number', defaultValue: 300000, prefix: '$' },
        { name: 'days', label: 'Days in Period', type: 'number', defaultValue: 365 },
      ],
      calculate: (inputs) => {
        const inv = safeFloat(inputs.avgInventory);
        const cogs = safeFloat(inputs.cogs);
        const days = safeFloat(inputs.days) || 365;
        if (cogs <= 0) return { result: 'Error', explanation: 'COGS must be greater than 0.' };
        const dio = (inv / cogs) * days;
        return {
          result: `${dio.toFixed(1)} days`,
          explanation: 'Average days inventory is held before being sold.',
          steps: [`DIO = (Avg Inventory / COGS) × Days = (${inv} / ${cogs}) × ${days} = ${dio.toFixed(2)}`],
          tips: ['Lower DIO often indicates better inventory efficiency (but depends on industry).'],
          formula: 'DIO = (Average Inventory / COGS) × Days'
        };
      }
    };
  }

  if (id === 'accounts-receivable-days' || id === 'days-sales-outstanding') {
    return {
      title: 'Accounts Receivable Days (DSO) Calculator',
      description: 'Calculate Days Sales Outstanding (DSO).',
      inputs: [
        { name: 'avgAR', label: 'Average Accounts Receivable', type: 'number', defaultValue: 40000, prefix: '$' },
        { name: 'creditSales', label: 'Credit Sales (Annual)', type: 'number', defaultValue: 500000, prefix: '$' },
        { name: 'days', label: 'Days in Period', type: 'number', defaultValue: 365 },
      ],
      calculate: (inputs) => {
        const ar = safeFloat(inputs.avgAR);
        const sales = safeFloat(inputs.creditSales);
        const days = safeFloat(inputs.days) || 365;
        if (sales <= 0) return { result: 'Error', explanation: 'Credit sales must be greater than 0.' };
        const dso = (ar / sales) * days;
        return {
          result: `${dso.toFixed(1)} days`,
          explanation: 'Average days to collect cash after a sale.',
          steps: [`DSO = (Avg AR / Credit Sales) × Days = (${ar} / ${sales}) × ${days} = ${dso.toFixed(2)}`],
          tips: ['Reduce DSO via faster invoicing, clear payment terms, and follow-ups.'],
          formula: 'DSO = (Average AR / Credit Sales) × Days'
        };
      }
    };
  }

  if (id === 'accounts-payable-days' || id === 'days-payable-outstanding') {
    return {
      title: 'Accounts Payable Days (DPO) Calculator',
      description: 'Calculate Days Payable Outstanding (DPO).',
      inputs: [
        { name: 'avgAP', label: 'Average Accounts Payable', type: 'number', defaultValue: 30000, prefix: '$' },
        { name: 'cogs', label: 'COGS (Annual)', type: 'number', defaultValue: 300000, prefix: '$' },
        { name: 'days', label: 'Days in Period', type: 'number', defaultValue: 365 },
      ],
      calculate: (inputs) => {
        const ap = safeFloat(inputs.avgAP);
        const cogs = safeFloat(inputs.cogs);
        const days = safeFloat(inputs.days) || 365;
        if (cogs <= 0) return { result: 'Error', explanation: 'COGS must be greater than 0.' };
        const dpo = (ap / cogs) * days;
        return {
          result: `${dpo.toFixed(1)} days`,
          explanation: 'Average days to pay suppliers.',
          steps: [`DPO = (Avg AP / COGS) × Days = (${ap} / ${cogs}) × ${days} = ${dpo.toFixed(2)}`],
          tips: ['Balance DPO: paying too late can harm supplier relationships; too early can strain cash.'],
          formula: 'DPO = (Average AP / COGS) × Days'
        };
      }
    };
  }

  if (id === 'cash-conversion-cycle') {
    return {
      title: 'Cash Conversion Cycle (CCC)',
      description: 'Calculate how long cash is tied up in operations (CCC = DIO + DSO - DPO).',
      inputs: [
        { name: 'dio', label: 'DIO (Inventory Days)', type: 'number', defaultValue: 60 },
        { name: 'dso', label: 'DSO (Receivable Days)', type: 'number', defaultValue: 45 },
        { name: 'dpo', label: 'DPO (Payable Days)', type: 'number', defaultValue: 30 },
      ],
      calculate: (inputs) => {
        const dio = safeFloat(inputs.dio);
        const dso = safeFloat(inputs.dso);
        const dpo = safeFloat(inputs.dpo);
        const ccc = dio + dso - dpo;
        return {
          result: `${ccc.toFixed(1)} days`,
          explanation: ccc <= 0 ? 'Great: you may receive cash before paying suppliers.' : 'Cash is tied up during this cycle.',
          steps: [`CCC = DIO + DSO - DPO = ${dio} + ${dso} - ${dpo} = ${ccc.toFixed(1)}`],
          tips: ['Improve CCC by reducing DIO/DSO or increasing DPO responsibly.'],
          formula: 'CCC = DIO + DSO - DPO'
        };
      }
    };
  }

  // --- Profitability & Coverage ---
  if (id === 'ebitda-calculator') {
    return {
      title: 'EBITDA Calculator',
      description: 'Calculate EBITDA from net income by adding back interest, taxes, depreciation, and amortization.',
      inputs: [
        { name: 'netIncome', label: 'Net Income', type: 'number', defaultValue: 50000, prefix: '$' },
        { name: 'interest', label: 'Interest Expense', type: 'number', defaultValue: 10000, prefix: '$' },
        { name: 'taxes', label: 'Taxes', type: 'number', defaultValue: 15000, prefix: '$' },
        { name: 'depreciation', label: 'Depreciation', type: 'number', defaultValue: 8000, prefix: '$' },
        { name: 'amortization', label: 'Amortization', type: 'number', defaultValue: 2000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const ni = safeFloat(inputs.netIncome);
        const i = safeFloat(inputs.interest);
        const t = safeFloat(inputs.taxes);
        const d = safeFloat(inputs.depreciation);
        const a = safeFloat(inputs.amortization);
        const ebitda = ni + i + t + d + a;

        return {
          result: `$${ebitda.toFixed(2)}`,
          explanation: 'Earnings before interest, taxes, depreciation, and amortization.',
          steps: [
            `EBITDA = Net Income + Interest + Taxes + Depreciation + Amortization`,
            `EBITDA = ${ni} + ${i} + ${t} + ${d} + ${a} = ${ebitda.toFixed(2)}`
          ],
          tips: ['EBITDA is useful for comparing operating performance, but it is not cash flow.'],
          formula: 'EBITDA = NI + I + T + D + A',
          visualData: [
            { label: 'Net Income', value: ni },
            { label: 'Add-backs (I+T+D+A)', value: i + t + d + a },
            { label: 'EBITDA', value: ebitda },
          ]
        };
      }
    };
  }

  if (id === 'times-interest-earned') {
    return {
      title: 'Times Interest Earned (Interest Coverage)',
      description: 'Measure how easily a company can pay interest on outstanding debt.',
      inputs: [
        { name: 'ebit', label: 'EBIT', type: 'number', defaultValue: 100000, prefix: '$' },
        { name: 'interest', label: 'Interest Expense', type: 'number', defaultValue: 20000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const ebit = safeFloat(inputs.ebit);
        const interest = safeFloat(inputs.interest);
        if (interest <= 0) return { result: 'Error', explanation: 'Interest expense must be greater than 0.' };
        const tie = ebit / interest;
        return {
          result: `${tie.toFixed(2)}x`,
          explanation: tie >= 3 ? 'Generally healthy coverage.' : 'Potential risk: low interest coverage.',
          steps: [`TIE = EBIT / Interest = ${ebit} / ${interest} = ${tie.toFixed(2)}`],
          tips: ['Higher is better; compare with lender covenants.'],
          formula: 'TIE = EBIT / Interest Expense'
        };
      }
    };
  }

  if (id === 'operating-cash-flow') {
    return {
      title: 'Operating Cash Flow (OCF) Calculator',
      description: 'Estimate operating cash flow from net income and common non-cash adjustments.',
      inputs: [
        { name: 'netIncome', label: 'Net Income', type: 'number', defaultValue: 100000, prefix: '$' },
        { name: 'depreciation', label: 'Depreciation & Amortization', type: 'number', defaultValue: 25000, prefix: '$' },
        { name: 'changeWorkingCapital', label: 'Change in Working Capital', type: 'number', defaultValue: 10000, prefix: '$', helpText: 'Increase in working capital reduces cash (enter positive for increase)' },
      ],
      calculate: (inputs) => {
        const ni = safeFloat(inputs.netIncome);
        const da = safeFloat(inputs.depreciation);
        const dWC = safeFloat(inputs.changeWorkingCapital);

        const ocf = ni + da - dWC;

        return {
          result: `$${ocf.toFixed(2)}`,
          explanation: 'Simple OCF estimate (indirect method).',
          steps: [
            `OCF = Net Income + D&A - ΔWorking Capital`,
            `OCF = ${ni} + ${da} - ${dWC} = ${ocf.toFixed(2)}`,
          ],
          tips: [
            'Working capital increases (more receivables/inventory) reduce cash; decreases increase cash.',
            'For accuracy, include other non-cash items and specific WC line items.'
          ],
          formula: 'OCF = Net Income + Non-cash charges − ΔWorking Capital',
          visualData: [
            { label: 'Net Income', value: ni },
            { label: 'Add: D&A', value: da },
            { label: 'Less: ΔWC', value: dWC },
            { label: 'OCF', value: ocf },
          ]
        };
      }
    };
  }

  if (id === 'free-cash-flow') {
    return {
      title: 'Free Cash Flow (FCF) Calculator',
      description: 'Calculate free cash flow as operating cash flow minus capital expenditures.',
      inputs: [
        { name: 'operatingCashFlow', label: 'Operating Cash Flow', type: 'number', defaultValue: 120000, prefix: '$' },
        { name: 'capex', label: 'Capital Expenditures (CapEx)', type: 'number', defaultValue: 30000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const ocf = safeFloat(inputs.operatingCashFlow);
        const capex = safeFloat(inputs.capex);
        const fcf = ocf - capex;
        return {
          result: `$${fcf.toFixed(2)}`,
          explanation: fcf >= 0 ? 'Positive FCF supports growth and debt repayment.' : 'Negative FCF may be okay during heavy investment phases.',
          steps: [`FCF = Operating Cash Flow - CapEx = ${ocf} - ${capex} = ${fcf.toFixed(2)}`],
          tips: ['Use consistent definitions of CapEx when comparing periods.'],
          formula: 'FCF = OCF - CapEx'
        };
      }
    };
  }

  // --- Asset & Equity Returns ---
  if (id === 'return-on-assets' || id === 'roa-calculator') {
    return {
      title: 'Return on Assets (ROA)',
      description: 'Measure profitability relative to total assets.',
      inputs: [
        { name: 'netIncome', label: 'Net Income', type: 'number', defaultValue: 50000, prefix: '$' },
        { name: 'avgAssets', label: 'Average Total Assets', type: 'number', defaultValue: 500000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const ni = safeFloat(inputs.netIncome);
        const assets = safeFloat(inputs.avgAssets);
        if (assets <= 0) return { result: 'Error', explanation: 'Average assets must be greater than 0.' };
        const roa = (ni / assets) * 100;
        return {
          result: `${roa.toFixed(2)}%`,
          explanation: 'Higher ROA indicates more efficient asset use.',
          steps: [`ROA% = (Net Income / Avg Assets) × 100 = (${ni} / ${assets}) × 100 = ${roa.toFixed(2)}%`],
          formula: 'ROA% = (Net Income / Average Assets) × 100'
        };
      }
    };
  }

  if (id === 'return-on-equity' || id === 'roe-calculator') {
    return {
      title: 'Return on Equity (ROE)',
      description: 'Measure profitability relative to shareholder equity.',
      inputs: [
        { name: 'netIncome', label: 'Net Income', type: 'number', defaultValue: 50000, prefix: '$' },
        { name: 'avgEquity', label: 'Average Shareholder Equity', type: 'number', defaultValue: 250000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const ni = safeFloat(inputs.netIncome);
        const eq = safeFloat(inputs.avgEquity);
        if (eq <= 0) return { result: 'Error', explanation: 'Average equity must be greater than 0.' };
        const roe = (ni / eq) * 100;
        return {
          result: `${roe.toFixed(2)}%`,
          explanation: 'Higher ROE indicates stronger returns on shareholder capital.',
          steps: [`ROE% = (Net Income / Avg Equity) × 100 = (${ni} / ${eq}) × 100 = ${roe.toFixed(2)}%`],
          formula: 'ROE% = (Net Income / Average Equity) × 100'
        };
      }
    };
  }

  if (id === 'roce-calculator') {
    return {
      title: 'Return on Capital Employed (ROCE)',
      description: 'Measure operating profit generated per dollar of capital employed.',
      inputs: [
        { name: 'ebit', label: 'EBIT', type: 'number', defaultValue: 150000, prefix: '$' },
        { name: 'capitalEmployed', label: 'Capital Employed', type: 'number', defaultValue: 750000, prefix: '$', helpText: 'Often Total Assets - Current Liabilities' },
      ],
      calculate: (inputs) => {
        const ebit = safeFloat(inputs.ebit);
        const cap = safeFloat(inputs.capitalEmployed);
        if (cap <= 0) return { result: 'Error', explanation: 'Capital employed must be greater than 0.' };
        const roce = (ebit / cap) * 100;
        return {
          result: `${roce.toFixed(2)}%`,
          explanation: `ROCE = EBIT / Capital Employed`,
          steps: [
            `ROCE% = (EBIT / Capital Employed) × 100 = (${ebit} / ${cap}) × 100 = ${roce.toFixed(2)}%`
          ],
          tips: [
            'Use consistent definitions of capital employed when comparing across periods or companies.',
            'Compare ROCE to cost of capital to assess value creation.'
          ],
          formula: 'ROCE% = (EBIT / Capital Employed) × 100'
        };
      }
    };
  }

  if (id === 'asset-turnover-ratio') {
    return {
      title: 'Asset Turnover Ratio',
      description: 'Measure how efficiently assets generate sales.',
      inputs: [
        { name: 'netSales', label: 'Net Sales', type: 'number', defaultValue: 800000, prefix: '$' },
        { name: 'avgAssets', label: 'Average Total Assets', type: 'number', defaultValue: 500000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const sales = safeFloat(inputs.netSales);
        const assets = safeFloat(inputs.avgAssets);
        if (assets <= 0) return { result: 'Error', explanation: 'Average assets must be greater than 0.' };
        const ratio = sales / assets;
        return {
          result: ratio.toFixed(2),
          explanation: 'Higher indicates more sales generated per $1 of assets.',
          steps: [`Asset Turnover = Net Sales / Avg Assets = ${sales} / ${assets} = ${ratio.toFixed(2)}`],
          formula: 'Asset Turnover = Net Sales / Average Assets'
        };
      }
    };
  }

  if (id === 'equity-multiplier') {
    return {
      title: 'Equity Multiplier',
      description: 'Measure financial leverage (Avg Assets / Avg Equity).',
      inputs: [
        { name: 'avgAssets', label: 'Average Total Assets', type: 'number', defaultValue: 500000, prefix: '$' },
        { name: 'avgEquity', label: 'Average Equity', type: 'number', defaultValue: 250000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const assets = safeFloat(inputs.avgAssets);
        const equity = safeFloat(inputs.avgEquity);
        if (equity <= 0) return { result: 'Error', explanation: 'Average equity must be greater than 0.' };
        const em = assets / equity;
        return {
          result: em.toFixed(2),
          explanation: em > 2 ? 'Higher leverage (more assets financed by debt).' : 'Lower leverage.',
          steps: [`Equity Multiplier = Avg Assets / Avg Equity = ${assets} / ${equity} = ${em.toFixed(2)}`],
          formula: 'Equity Multiplier = Average Assets / Average Equity'
        };
      }
    };
  }

  // --- Cost Structure ---
  if (id === 'variable-cost-per-unit') {
    return {
      title: 'Variable Cost Per Unit',
      description: 'Calculate variable cost per unit from total variable cost and units produced/sold.',
      inputs: [
        { name: 'totalVariableCosts', label: 'Total Variable Costs', type: 'number', defaultValue: 25000, prefix: '$' },
        { name: 'units', label: 'Total Units', type: 'number', defaultValue: 1000 },
      ],
      calculate: (inputs) => {
        const tvc = safeFloat(inputs.totalVariableCosts);
        const units = safeFloat(inputs.units);
        if (units <= 0) return { result: 'Error', explanation: 'Units must be greater than 0.' };
        const vcpu = tvc / units;
        return {
          result: `$${vcpu.toFixed(4)}`,
          explanation: 'Variable cost per unit.',
          steps: [`Variable Cost/Unit = Total Variable Costs / Units = ${tvc} / ${units} = ${vcpu.toFixed(4)}`],
          formula: 'VC per Unit = Total Variable Costs / Units'
        };
      }
    };
  }

  if (id === 'contribution-margin') {
    return {
      title: 'Contribution Margin Calculator',
      description: 'Calculate contribution margin and contribution margin ratio.',
      inputs: [
        { name: 'revenue', label: 'Revenue', type: 'number', defaultValue: 100000, prefix: '$' },
        { name: 'variableCosts', label: 'Variable Costs', type: 'number', defaultValue: 60000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const revenue = safeFloat(inputs.revenue);
        const vc = safeFloat(inputs.variableCosts);
        if (revenue <= 0) return { result: 'Error', explanation: 'Revenue must be greater than 0.' };
        const cm = revenue - vc;
        const cmr = (cm / revenue) * 100;
        return {
          result: `$${cm.toFixed(2)} (${cmr.toFixed(2)}%)`,
          explanation: 'Contribution margin available to cover fixed costs and profit.',
          steps: [
            `Contribution Margin = Revenue - Variable Costs = ${revenue} - ${vc} = ${cm.toFixed(2)}`,
            `CM Ratio% = (CM / Revenue) × 100 = (${cm.toFixed(2)} / ${revenue}) × 100 = ${cmr.toFixed(2)}%`,
          ],
          tips: ['Higher contribution margin gives more flexibility for fixed costs and growth spending.'],
          formula: 'CM = Revenue - Variable Costs'
        };
      }
    };
  }

  if (id === 'fixed-cost-analysis') {
    return {
      title: 'Fixed Cost Analysis',
      description: 'Analyze fixed and variable costs and estimate break-even units.',
      inputs: [
        { name: 'fixedCosts', label: 'Fixed Costs (per period)', type: 'number', defaultValue: 20000, prefix: '$' },
        { name: 'pricePerUnit', label: 'Price per Unit', type: 'number', defaultValue: 50, prefix: '$' },
        { name: 'variableCostPerUnit', label: 'Variable Cost per Unit', type: 'number', defaultValue: 30, prefix: '$' },
        { name: 'units', label: 'Expected Units Sold', type: 'number', defaultValue: 1000 },
      ],
      calculate: (inputs) => {
        const fc = safeFloat(inputs.fixedCosts);
        const p = safeFloat(inputs.pricePerUnit);
        const v = safeFloat(inputs.variableCostPerUnit);
        const units = safeFloat(inputs.units);

        if (p <= v) return { result: 'Error', explanation: 'Price per unit must be greater than variable cost per unit.' };

        const revenue = p * units;
        const totalVariable = v * units;
        const contribution = revenue - totalVariable;
        const profit = contribution - fc;
        const contributionPerUnit = p - v;
        const breakEvenUnits = fc / contributionPerUnit;
        const breakEvenRevenue = breakEvenUnits * p;

        return {
          result: `Profit: $${profit.toFixed(2)}`,
          explanation: `Break-even: ${Math.ceil(breakEvenUnits)} units ($${breakEvenRevenue.toFixed(2)})`,
          steps: [
            `Contribution/Unit = Price - Variable Cost = ${p} - ${v} = ${contributionPerUnit.toFixed(2)}`,
            `Break-even Units = Fixed Costs / Contribution per Unit = ${fc} / ${contributionPerUnit.toFixed(2)} = ${breakEvenUnits.toFixed(2)}`,
            `Profit = (Revenue - Variable Costs) - Fixed Costs = (${revenue.toFixed(2)} - ${totalVariable.toFixed(2)}) - ${fc.toFixed(2)} = ${profit.toFixed(2)}`,
          ],
          tips: [
            profit >= 0 ? 'Your expected volume covers fixed costs.' : 'Increase price, volume, or reduce costs to reach profitability.',
          ],
          formula: 'Profit = (Price×Units - Variable×Units) - Fixed',
          visualData: [
            { label: 'Revenue', value: revenue },
            { label: 'Variable Costs', value: totalVariable },
            { label: 'Fixed Costs', value: fc },
            { label: 'Profit', value: profit },
          ]
        };
      }
    };
  }

  // --- Leverage & Safety ---
  if (id === 'operating-leverage' || id === 'degree-operating-leverage') {
    return {
      title: 'Operating Leverage (DOL)',
      description: 'Calculate Degree of Operating Leverage (sensitivity of EBIT to sales).',
      inputs: [
        { name: 'sales', label: 'Sales', type: 'number', defaultValue: 200000, prefix: '$' },
        { name: 'variableCosts', label: 'Variable Costs', type: 'number', defaultValue: 120000, prefix: '$' },
        { name: 'fixedCosts', label: 'Fixed Costs', type: 'number', defaultValue: 50000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const sales = safeFloat(inputs.sales);
        const vc = safeFloat(inputs.variableCosts);
        const fc = safeFloat(inputs.fixedCosts);
        const cm = sales - vc;
        const ebit = cm - fc;
        if (ebit === 0) return { result: 'Error', explanation: 'EBIT is zero; DOL is undefined.' };
        const dol = cm / ebit;
        return {
          result: dol.toFixed(2),
          explanation: `Contribution Margin: $${cm.toFixed(2)} | EBIT: $${ebit.toFixed(2)}`,
          steps: [
            `Contribution Margin = Sales - Variable Costs = ${sales} - ${vc} = ${cm.toFixed(2)}`,
            `EBIT = Contribution Margin - Fixed Costs = ${cm.toFixed(2)} - ${fc} = ${ebit.toFixed(2)}`,
            `DOL = Contribution Margin / EBIT = ${cm.toFixed(2)} / ${ebit.toFixed(2)} = ${dol.toFixed(2)}`
          ],
          tips: ['Higher DOL means profits can grow faster with sales — but declines can also hurt more.'],
          formula: 'DOL = (Sales - VariableCosts) / EBIT'
        };
      }
    };
  }

  if (id === 'financial-leverage' || id === 'degree-financial-leverage') {
    return {
      title: 'Financial Leverage (DFL)',
      description: 'Calculate Degree of Financial Leverage (sensitivity of net income to EBIT).',
      inputs: [
        { name: 'ebit', label: 'EBIT', type: 'number', defaultValue: 100000, prefix: '$' },
        { name: 'interest', label: 'Interest Expense', type: 'number', defaultValue: 20000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const ebit = safeFloat(inputs.ebit);
        const interest = safeFloat(inputs.interest);
        const denom = ebit - interest;
        if (denom === 0) return { result: 'Error', explanation: 'EBIT equals interest; DFL is undefined.' };
        const dfl = ebit / denom;
        return {
          result: dfl.toFixed(2),
          explanation: denom > 0 ? 'Higher DFL means more sensitivity due to fixed interest costs.' : 'EBIT is not covering interest (high risk).',
          steps: [
            `DFL = EBIT / (EBIT - Interest) = ${ebit} / (${ebit} - ${interest}) = ${dfl.toFixed(2)}`
          ],
          tips: ['If EBIT is close to interest, small sales drops can cause big profit changes.'],
          formula: 'DFL = EBIT / (EBIT - Interest)'
        };
      }
    };
  }

  if (id === 'safety-margin' || id === 'margin-of-safety') {
    return {
      title: 'Margin of Safety',
      description: 'Calculate how much sales can drop before hitting break-even.',
      inputs: [
        { name: 'actualSales', label: 'Actual Sales', type: 'number', defaultValue: 150000, prefix: '$' },
        { name: 'breakEvenSales', label: 'Break-even Sales', type: 'number', defaultValue: 100000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const actual = safeFloat(inputs.actualSales);
        const be = safeFloat(inputs.breakEvenSales);
        if (actual <= 0) return { result: 'Error', explanation: 'Actual sales must be greater than 0.' };
        const mos = ((actual - be) / actual) * 100;
        return {
          result: `${mos.toFixed(2)}%`,
          explanation: mos >= 0 ? 'Higher is safer.' : 'Actual sales are below break-even.',
          steps: [`MOS% = ((Actual - Break-even) / Actual) × 100 = ((${actual} - ${be}) / ${actual}) × 100 = ${mos.toFixed(2)}%`],
          formula: 'MOS% = ((Actual Sales - Break-even Sales) / Actual Sales) × 100'
        };
      }
    };
  }

  if (id === 'combined-leverage') {
    return {
      title: 'Combined Leverage (DCL)',
      description: 'Calculate Degree of Combined Leverage (DCL = DOL × DFL).',
      inputs: [
        { name: 'sales', label: 'Sales', type: 'number', defaultValue: 200000, prefix: '$' },
        { name: 'variableCosts', label: 'Variable Costs', type: 'number', defaultValue: 120000, prefix: '$' },
        { name: 'fixedCosts', label: 'Fixed Costs', type: 'number', defaultValue: 50000, prefix: '$' },
        { name: 'interest', label: 'Interest Expense', type: 'number', defaultValue: 20000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const sales = safeFloat(inputs.sales);
        const vc = safeFloat(inputs.variableCosts);
        const fc = safeFloat(inputs.fixedCosts);
        const interest = safeFloat(inputs.interest);

        const cm = sales - vc;
        const ebit = cm - fc;
        const denomDFL = ebit - interest;

        if (ebit === 0) return { result: 'Error', explanation: 'EBIT is zero; DOL is undefined.' };
        if (denomDFL === 0) return { result: 'Error', explanation: 'EBIT equals interest; DFL is undefined.' };

        const dol = cm / ebit;
        const dfl = ebit / denomDFL;
        const dcl = dol * dfl;

        return {
          result: dcl.toFixed(2),
          explanation: `DOL: ${dol.toFixed(2)} | DFL: ${dfl.toFixed(2)} | EBIT: $${ebit.toFixed(2)}`,
          steps: [
            `Contribution Margin = Sales - Variable Costs = ${sales} - ${vc} = ${cm.toFixed(2)}`,
            `EBIT = CM - Fixed Costs = ${cm.toFixed(2)} - ${fc} = ${ebit.toFixed(2)}`,
            `DOL = CM / EBIT = ${cm.toFixed(2)} / ${ebit.toFixed(2)} = ${dol.toFixed(2)}`,
            `DFL = EBIT / (EBIT - Interest) = ${ebit.toFixed(2)} / (${ebit.toFixed(2)} - ${interest}) = ${dfl.toFixed(2)}`,
            `DCL = DOL × DFL = ${dol.toFixed(2)} × ${dfl.toFixed(2)} = ${dcl.toFixed(2)}`,
          ],
          tips: ['Higher DCL means profits are very sensitive to sales changes (both operating + financial leverage).'],
          formula: 'DCL = DOL × DFL'
        };
      }
    };
  }

  // --- Capital Budgeting ---
  if (id === 'payback-period') {
    return {
      title: 'Payback Period Calculator',
      description: 'Estimate the time required to recover an initial investment from periodic cash inflows.',
      inputs: [
        { name: 'initialInvestment', label: 'Initial Investment', type: 'number', defaultValue: 100000, prefix: '$' },
        { name: 'cashInflow', label: 'Cash Inflow per Period', type: 'number', defaultValue: 10000, prefix: '$' },
        { name: 'period', label: 'Period Unit', type: 'select', options: ['Months', 'Years'], defaultValue: 'Months' },
      ],
      calculate: (inputs) => {
        const inv = safeFloat(inputs.initialInvestment);
        const inflow = safeFloat(inputs.cashInflow);
        const period = String(inputs.period || 'Months');
        if (inflow <= 0) return { result: 'Error', explanation: 'Cash inflow must be greater than 0.' };
        const payback = inv / inflow;
        return {
          result: `${payback.toFixed(2)} ${period.toLowerCase()}`,
          explanation: `Investment recovered after ~${payback.toFixed(2)} ${period.toLowerCase()}.`,
          steps: [`Payback = Initial Investment / Cash Inflow = ${inv} / ${inflow} = ${payback.toFixed(2)} ${period.toLowerCase()}`],
          tips: ['Payback ignores the time value of money; use NPV/IRR for better decisions.'],
          formula: 'Payback Period = Initial Investment / Cash Inflow'
        };
      }
    };
  }

  const computeNPV = (rate: number, cashflows: number[]) => {
    let total = 0;
    for (let t = 0; t < cashflows.length; t++) {
      total += cashflows[t] / Math.pow(1 + rate, t);
    }
    return total;
  };

  const computeIRR = (cashflows: number[]) => {
    // Binary search for NPV=0
    let low = -0.9999;
    let high = 10;
    let npvLow = computeNPV(low, cashflows);
    let npvHigh = computeNPV(high, cashflows);

    // Expand high if needed
    let expand = 0;
    while (npvLow * npvHigh > 0 && expand < 10) {
      high *= 2;
      npvHigh = computeNPV(high, cashflows);
      expand += 1;
    }
    if (npvLow * npvHigh > 0) return null;

    for (let i = 0; i < 80; i++) {
      const mid = (low + high) / 2;
      const npvMid = computeNPV(mid, cashflows);
      if (Math.abs(npvMid) < 1e-8) return mid;
      if (npvLow * npvMid <= 0) {
        high = mid;
        npvHigh = npvMid;
      } else {
        low = mid;
        npvLow = npvMid;
      }
    }
    return (low + high) / 2;
  };

  if (id === 'internal-rate-return' || id === 'irr-calculator') {
    return {
      title: 'Internal Rate of Return (IRR)',
      description: 'Estimate IRR for an investment using yearly cash inflows (simple model).',
      inputs: [
        { name: 'initialInvestment', label: 'Initial Investment (Outflow)', type: 'number', defaultValue: 100000, prefix: '$' },
        { name: 'cf1', label: 'Year 1 Cash Flow', type: 'number', defaultValue: 30000, prefix: '$' },
        { name: 'cf2', label: 'Year 2 Cash Flow', type: 'number', defaultValue: 30000, prefix: '$' },
        { name: 'cf3', label: 'Year 3 Cash Flow', type: 'number', defaultValue: 30000, prefix: '$' },
        { name: 'cf4', label: 'Year 4 Cash Flow', type: 'number', defaultValue: 30000, prefix: '$' },
        { name: 'cf5', label: 'Year 5 Cash Flow', type: 'number', defaultValue: 30000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const inv = safeFloat(inputs.initialInvestment);
        const cashflows = [
          -inv,
          safeFloat(inputs.cf1),
          safeFloat(inputs.cf2),
          safeFloat(inputs.cf3),
          safeFloat(inputs.cf4),
          safeFloat(inputs.cf5),
        ];
        const irr = computeIRR(cashflows);
        if (irr === null) {
          return {
            result: 'No IRR',
            explanation: 'Unable to find an IRR for these cash flows (NPV may not cross zero).',
            steps: ['Try adjusting cash flows or using a different time horizon.']
          };
        }
        const irrPct = irr * 100;
        return {
          result: `${irrPct.toFixed(2)}%`,
          explanation: `IRR is the discount rate where NPV = 0.`,
          steps: [
            `Cash Flows: [${cashflows.map(v => v.toFixed(2)).join(', ')}]`,
            `IRR found by searching for rate where NPV(rate) = 0`,
          ],
          tips: ['IRR can be misleading for unconventional cash flows; use NPV alongside IRR.'],
          formula: 'Find r such that Σ CF_t/(1+r)^t = 0'
        };
      }
    };
  }

  if (id === 'npv-calculator-business') {
    return {
      title: 'Net Present Value (NPV) Calculator',
      description: 'Calculate NPV using a discount rate, initial investment, and future cash inflows.',
      inputs: [
        { name: 'discountRate', label: 'Discount Rate', type: 'number', defaultValue: 12, suffix: '%' },
        { name: 'initialInvestment', label: 'Initial Investment (Outflow)', type: 'number', defaultValue: 100000, prefix: '$' },
        { name: 'cf1', label: 'Year 1 Cash Flow', type: 'number', defaultValue: 30000, prefix: '$' },
        { name: 'cf2', label: 'Year 2 Cash Flow', type: 'number', defaultValue: 30000, prefix: '$' },
        { name: 'cf3', label: 'Year 3 Cash Flow', type: 'number', defaultValue: 30000, prefix: '$' },
        { name: 'cf4', label: 'Year 4 Cash Flow', type: 'number', defaultValue: 30000, prefix: '$' },
        { name: 'cf5', label: 'Year 5 Cash Flow', type: 'number', defaultValue: 30000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const r = safeFloat(inputs.discountRate) / 100;
        const inv = safeFloat(inputs.initialInvestment);
        const cashflows = [
          -inv,
          safeFloat(inputs.cf1),
          safeFloat(inputs.cf2),
          safeFloat(inputs.cf3),
          safeFloat(inputs.cf4),
          safeFloat(inputs.cf5),
        ];
        const npv = computeNPV(r, cashflows);

        return {
          result: `$${npv.toFixed(2)}`,
          explanation: npv >= 0 ? '✅ Positive NPV indicates value creation at this discount rate.' : '⚠️ Negative NPV indicates value destruction at this discount rate.',
          steps: [
            `NPV = Σ CF_t/(1+r)^t, with r=${(r * 100).toFixed(2)}%`,
            `Cash Flows: [${cashflows.map(v => v.toFixed(2)).join(', ')}]`,
            `NPV = ${npv.toFixed(2)}`,
          ],
          tips: [
            'Choose a discount rate consistent with risk (often WACC for corporate projects).',
            'Use IRR and NPV together; NPV is generally more reliable for value.'
          ],
          formula: 'NPV = Σ CF_t/(1+r)^t'
        };
      }
    };
  }

  if (id === 'profitability-index') {
    return {
      title: 'Profitability Index (PI)',
      description: 'Calculate PI = PV of future cash inflows / Initial Investment.',
      inputs: [
        { name: 'discountRate', label: 'Discount Rate', type: 'number', defaultValue: 12, suffix: '%' },
        { name: 'initialInvestment', label: 'Initial Investment (Outflow)', type: 'number', defaultValue: 100000, prefix: '$' },
        { name: 'cf1', label: 'Year 1 Cash Flow', type: 'number', defaultValue: 30000, prefix: '$' },
        { name: 'cf2', label: 'Year 2 Cash Flow', type: 'number', defaultValue: 30000, prefix: '$' },
        { name: 'cf3', label: 'Year 3 Cash Flow', type: 'number', defaultValue: 30000, prefix: '$' },
        { name: 'cf4', label: 'Year 4 Cash Flow', type: 'number', defaultValue: 30000, prefix: '$' },
        { name: 'cf5', label: 'Year 5 Cash Flow', type: 'number', defaultValue: 30000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const r = safeFloat(inputs.discountRate) / 100;
        const inv = safeFloat(inputs.initialInvestment);
        if (inv <= 0) return { result: 'Error', explanation: 'Initial investment must be greater than 0.' };

        const inflows = [
          safeFloat(inputs.cf1),
          safeFloat(inputs.cf2),
          safeFloat(inputs.cf3),
          safeFloat(inputs.cf4),
          safeFloat(inputs.cf5),
        ];
        const pvInflows = inflows.reduce((sum, cf, idx) => sum + (cf / Math.pow(1 + r, idx + 1)), 0);
        const pi = pvInflows / inv;
        const npv = pvInflows - inv;

        return {
          result: pi.toFixed(3),
          explanation: `PV inflows: $${pvInflows.toFixed(2)} | NPV: $${npv.toFixed(2)}`,
          steps: [
            `PV Inflows = Σ CF_t/(1+r)^t, r=${(r * 100).toFixed(2)}%`,
            `PI = PV Inflows / Initial Investment = ${pvInflows.toFixed(2)} / ${inv.toFixed(2)} = ${pi.toFixed(3)}`,
          ],
          tips: [
            pi >= 1 ? '✅ PI ≥ 1 indicates value creation (positive NPV).' : '⚠️ PI < 1 indicates negative NPV at this discount rate.'
          ],
          formula: 'PI = PV(Inflows) / Initial Investment'
        };
      }
    };
  }

  if (id === 'economic-value-added') {
    return {
      title: 'Economic Value Added (EVA)',
      description: 'Estimate EVA = NOPAT - (Invested Capital × WACC).',
      inputs: [
        { name: 'ebit', label: 'EBIT (Operating Profit)', type: 'number', defaultValue: 150000, prefix: '$' },
        { name: 'taxRate', label: 'Tax Rate', type: 'number', defaultValue: 25, suffix: '%' },
        { name: 'investedCapital', label: 'Invested Capital', type: 'number', defaultValue: 1000000, prefix: '$' },
        { name: 'wacc', label: 'WACC', type: 'number', defaultValue: 10, suffix: '%' },
      ],
      calculate: (inputs) => {
        const ebit = safeFloat(inputs.ebit);
        const taxRate = safeFloat(inputs.taxRate) / 100;
        const capital = safeFloat(inputs.investedCapital);
        const wacc = safeFloat(inputs.wacc) / 100;

        const nopat = ebit * (1 - taxRate);
        const capitalCharge = capital * wacc;
        const eva = nopat - capitalCharge;

        const tips: string[] = [];
        if (eva > 0) tips.push('✅ Positive EVA means value is being created above the cost of capital.');
        else if (eva < 0) tips.push('⚠️ Negative EVA means returns are below the cost of capital.');
        tips.push('Use consistent definitions for invested capital and WACC across periods.');

        return {
          result: `$${eva.toFixed(2)}`,
          explanation: `NOPAT: $${nopat.toFixed(2)} | Capital Charge: $${capitalCharge.toFixed(2)}`,
          steps: [
            `NOPAT = EBIT × (1 - Tax Rate) = ${ebit} × (1 - ${taxRate.toFixed(4)}) = ${nopat.toFixed(2)}`,
            `Capital Charge = Invested Capital × WACC = ${capital} × ${wacc.toFixed(4)} = ${capitalCharge.toFixed(2)}`,
            `EVA = NOPAT - Capital Charge = ${nopat.toFixed(2)} - ${capitalCharge.toFixed(2)} = ${eva.toFixed(2)}`
          ],
          tips,
          formula: 'EVA = EBIT×(1-TaxRate) - (InvestedCapital×WACC)',
          visualData: [
            { label: 'NOPAT', value: nopat },
            { label: 'Capital Charge', value: capitalCharge },
            { label: 'EVA', value: eva },
          ]
        };
      }
    };
  }

  if (id === 'break-even-calculator') {
    return {
      title: 'Break-Even Point Calculator',
      description: 'Calculate the sales volume needed to cover costs.',
      inputs: [
        { name: 'fixedCosts', label: 'Fixed Costs', type: 'number', defaultValue: 5000, prefix: '$' },
        { name: 'pricePerUnit', label: 'Price Per Unit', type: 'number', defaultValue: 50, prefix: '$' },
        { name: 'variableCostPerUnit', label: 'Variable Cost Per Unit', type: 'number', defaultValue: 30, prefix: '$' },
      ],
      calculate: (inputs) => {
        const fc = safeFloat(inputs.fixedCosts);
        const p = safeFloat(inputs.pricePerUnit);
        const vc = safeFloat(inputs.variableCostPerUnit);
        
        if (p <= vc) return { result: 'Error', explanation: 'Price must be greater than variable cost per unit.' };

        const contributionMargin = p - vc;
        const breakEvenUnits = fc / contributionMargin;
        const breakEvenRevenue = breakEvenUnits * p;

        return {
          result: `${Math.ceil(breakEvenUnits)} Units`,
          explanation: `Revenue needed: $${breakEvenRevenue.toFixed(2)}`,
          steps: [
            `Contribution Margin = Price - Variable Cost = ${p} - ${vc} = ${contributionMargin}`,
            `Break-Even Units = Fixed Costs / Contribution Margin = ${fc} / ${contributionMargin} = ${breakEvenUnits.toFixed(2)}`,
            `Break-Even Revenue = Break-Even Units * Price = ${breakEvenUnits.toFixed(2)} * ${p} = ${breakEvenRevenue.toFixed(2)}`
          ]
        };
      }
    };
  }

  if (id === 'markup-calculator') {
    return {
      title: 'Markup Calculator',
      description: 'Calculate selling price based on cost and markup percentage.',
      inputs: [
        { name: 'cost', label: 'Cost', type: 'number', defaultValue: 100, prefix: '$' },
        { name: 'markup', label: 'Markup Percentage', type: 'number', defaultValue: 20, suffix: '%' },
      ],
      calculate: (inputs) => {
        const cost = safeFloat(inputs.cost);
        const markup = safeFloat(inputs.markup);
        
        const sellingPrice = cost * (1 + markup / 100);
        const profit = sellingPrice - cost;

        return {
          result: `$${sellingPrice.toFixed(2)}`,
          explanation: `Profit: $${profit.toFixed(2)}`,
          steps: [
            `Selling Price = Cost * (1 + Markup/100) = ${cost} * (1 + ${markup}/100) = ${sellingPrice.toFixed(2)}`
          ]
        };
      }
    };
  }

  // --- Customer Metrics ---
  if (id === 'clv-calculator') {
    return {
      title: 'Customer Lifetime Value (CLV)',
      description: 'Calculate the total revenue a business can expect from a single customer account.',
      inputs: [
        { name: 'avgPurchaseValue', label: 'Average Purchase Value', type: 'number', defaultValue: 50, prefix: '$' },
        { name: 'purchaseFreq', label: 'Purchase Frequency (per year)', type: 'number', defaultValue: 4 },
        { name: 'customerLifespan', label: 'Customer Lifespan (years)', type: 'number', defaultValue: 3 },
      ],
      calculate: (inputs) => {
        const apv = safeFloat(inputs.avgPurchaseValue);
        const pf = safeFloat(inputs.purchaseFreq);
        const cl = safeFloat(inputs.customerLifespan);
        
        const clv = apv * pf * cl;

        return {
          result: `$${clv.toFixed(2)}`,
          explanation: 'Total expected revenue from customer.',
          steps: [
            `CLV = Avg Purchase Value * Frequency * Lifespan`,
            `CLV = ${apv} * ${pf} * ${cl} = ${clv}`
          ]
        };
      }
    };
  }

  if (id === 'cac-calculator') {
    return {
      title: 'Customer Acquisition Cost (CAC)',
      description: 'Calculate the cost of winning a customer to purchase a product/service.',
      inputs: [
        { name: 'marketingSpend', label: 'Total Marketing Spend', type: 'number', defaultValue: 10000, prefix: '$' },
        { name: 'salesSpend', label: 'Total Sales Spend', type: 'number', defaultValue: 5000, prefix: '$' },
        { name: 'newCustomers', label: 'New Customers Acquired', type: 'number', defaultValue: 100 },
      ],
      calculate: (inputs) => {
        const ms = safeFloat(inputs.marketingSpend);
        const ss = safeFloat(inputs.salesSpend);
        const nc = safeFloat(inputs.newCustomers);
        
        if (nc === 0) return { result: 'Error', explanation: 'New customers cannot be zero.' };

        const cac = (ms + ss) / nc;

        return {
          result: `$${cac.toFixed(2)}`,
          explanation: 'Cost per new customer.',
          steps: [
            `Total Spend = Marketing + Sales = ${ms} + ${ss} = ${ms + ss}`,
            `CAC = Total Spend / New Customers = ${(ms + ss)} / ${nc} = ${cac.toFixed(2)}`
          ]
        };
      }
    };
  }

  // --- Financial Ratios ---
  if (id === 'quick-ratio') {
    return {
      title: 'Quick Ratio (Acid Test)',
      description: 'Measure a company\'s ability to meet short-term obligations with its most liquid assets.',
      inputs: [
        { name: 'cash', label: 'Cash & Equivalents', type: 'number', defaultValue: 50000, prefix: '$' },
        { name: 'securities', label: 'Marketable Securities', type: 'number', defaultValue: 20000, prefix: '$' },
        { name: 'receivables', label: 'Accounts Receivable', type: 'number', defaultValue: 30000, prefix: '$' },
        { name: 'liabilities', label: 'Current Liabilities', type: 'number', defaultValue: 60000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const c = safeFloat(inputs.cash);
        const s = safeFloat(inputs.securities);
        const r = safeFloat(inputs.receivables);
        const l = safeFloat(inputs.liabilities);
        
        if (l === 0) return { result: 'Error', explanation: 'Liabilities cannot be zero.' };

        const quickAssets = c + s + r;
        const ratio = quickAssets / l;

        return {
          result: ratio.toFixed(2),
          explanation: ratio > 1 ? 'Healthy liquidity position.' : 'Potential liquidity issues.',
          steps: [
            `Quick Assets = Cash + Securities + Receivables = ${c} + ${s} + ${r} = ${quickAssets}`,
            `Quick Ratio = Quick Assets / Current Liabilities = ${quickAssets} / ${l} = ${ratio.toFixed(2)}`
          ]
        };
      }
    };
  }

  if (id === 'debt-to-equity') {
    return {
      title: 'Debt to Equity Ratio',
      description: 'Calculate the ratio of total debt to total shareholder equity.',
      inputs: [
        { name: 'totalDebt', label: 'Total Liabilities', type: 'number', defaultValue: 500000, prefix: '$' },
        { name: 'totalEquity', label: 'Total Shareholder Equity', type: 'number', defaultValue: 250000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const d = safeFloat(inputs.totalDebt);
        const e = safeFloat(inputs.totalEquity);
        
        if (e === 0) return { result: 'Error', explanation: 'Equity cannot be zero.' };

        const ratio = d / e;

        return {
          result: ratio.toFixed(2),
          explanation: 'A higher ratio generally means more risk.',
          steps: [
            `Debt to Equity = Total Debt / Total Equity = ${d} / ${e} = ${ratio.toFixed(2)}`
          ],
          tips: ['Lower D/E is generally safer; acceptable levels vary by industry.'],
          formula: 'D/E = Total Debt / Total Equity'
        };
      }
    };
  }

  if (id === 'current-ratio') {
    return {
      title: 'Current Ratio',
      description: 'Measure ability to pay short-term obligations with current assets.',
      inputs: [
        { name: 'currentAssets', label: 'Current Assets', type: 'number', defaultValue: 150000, prefix: '$' },
        { name: 'currentLiabilities', label: 'Current Liabilities', type: 'number', defaultValue: 100000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const assets = safeFloat(inputs.currentAssets);
        const liabilities = safeFloat(inputs.currentLiabilities);
        if (liabilities === 0) return { result: 'Error', explanation: 'Current liabilities cannot be zero.' };
        const ratio = assets / liabilities;
        return {
          result: ratio.toFixed(2),
          explanation: ratio >= 1.5 ? 'Strong short-term liquidity.' : ratio >= 1 ? 'Acceptable liquidity.' : 'Potential liquidity concern.',
          steps: [`Current Ratio = Current Assets / Current Liabilities = ${assets} / ${liabilities} = ${ratio.toFixed(2)}`],
          tips: ['A ratio above 1 means assets exceed liabilities; above 1.5–2 is often considered healthy.'],
          formula: 'Current Ratio = Current Assets / Current Liabilities'
        };
      }
    };
  }

  if (id === 'cash-ratio') {
    return {
      title: 'Cash Ratio',
      description: 'Most conservative liquidity ratio: cash + marketable securities / current liabilities.',
      inputs: [
        { name: 'cash', label: 'Cash & Cash Equivalents', type: 'number', defaultValue: 30000, prefix: '$' },
        { name: 'securities', label: 'Marketable Securities', type: 'number', defaultValue: 10000, prefix: '$' },
        { name: 'liabilities', label: 'Current Liabilities', type: 'number', defaultValue: 50000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const cash = safeFloat(inputs.cash);
        const securities = safeFloat(inputs.securities);
        const liabilities = safeFloat(inputs.liabilities);
        if (liabilities === 0) return { result: 'Error', explanation: 'Liabilities cannot be zero.' };
        const cashAssets = cash + securities;
        const ratio = cashAssets / liabilities;
        return {
          result: ratio.toFixed(2),
          explanation: `${(ratio * 100).toFixed(0)}% of current liabilities can be covered by cash.`,
          steps: [
            `Cash + Securities = ${cash} + ${securities} = ${cashAssets}`,
            `Cash Ratio = ${cashAssets} / ${liabilities} = ${ratio.toFixed(2)}`
          ],
          tips: ['Very conservative; most businesses have cash ratio < 1.'],
          formula: 'Cash Ratio = (Cash + Marketable Securities) / Current Liabilities'
        };
      }
    };
  }

  if (id === 'debt-ratio') {
    return {
      title: 'Debt Ratio',
      description: 'Total debt divided by total assets.',
      inputs: [
        { name: 'totalDebt', label: 'Total Debt', type: 'number', defaultValue: 200000, prefix: '$' },
        { name: 'totalAssets', label: 'Total Assets', type: 'number', defaultValue: 500000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const debt = safeFloat(inputs.totalDebt);
        const assets = safeFloat(inputs.totalAssets);
        if (assets === 0) return { result: 'Error', explanation: 'Total assets cannot be zero.' };
        const ratio = debt / assets;
        return {
          result: `${(ratio * 100).toFixed(2)}%`,
          explanation: `${(ratio * 100).toFixed(0)}% of assets are financed by debt.`,
          steps: [`Debt Ratio = Total Debt / Total Assets = ${debt} / ${assets} = ${ratio.toFixed(4)} = ${(ratio * 100).toFixed(2)}%`],
          tips: ['Lower is generally safer; capital-intensive industries may have higher ratios.'],
          formula: 'Debt Ratio = Total Debt / Total Assets'
        };
      }
    };
  }

  if (id === 'debt-to-asset') {
    return {
      title: 'Debt to Asset Ratio',
      description: 'Same as debt ratio: total liabilities / total assets.',
      inputs: [
        { name: 'totalLiabilities', label: 'Total Liabilities', type: 'number', defaultValue: 300000, prefix: '$' },
        { name: 'totalAssets', label: 'Total Assets', type: 'number', defaultValue: 600000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const liabilities = safeFloat(inputs.totalLiabilities);
        const assets = safeFloat(inputs.totalAssets);
        if (assets === 0) return { result: 'Error', explanation: 'Total assets cannot be zero.' };
        const ratio = liabilities / assets;
        return {
          result: `${(ratio * 100).toFixed(2)}%`,
          explanation: `${(ratio * 100).toFixed(0)}% of assets funded by liabilities.`,
          steps: [`Debt-to-Asset = Liabilities / Assets = ${liabilities} / ${assets} = ${(ratio * 100).toFixed(2)}%`],
          formula: 'Debt-to-Asset = Total Liabilities / Total Assets'
        };
      }
    };
  }

  if (id === 'equity-ratio') {
    return {
      title: 'Equity Ratio',
      description: 'Total equity / total assets.',
      inputs: [
        { name: 'totalEquity', label: 'Total Shareholder Equity', type: 'number', defaultValue: 400000, prefix: '$' },
        { name: 'totalAssets', label: 'Total Assets', type: 'number', defaultValue: 600000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const equity = safeFloat(inputs.totalEquity);
        const assets = safeFloat(inputs.totalAssets);
        if (assets === 0) return { result: 'Error', explanation: 'Total assets cannot be zero.' };
        const ratio = equity / assets;
        return {
          result: `${(ratio * 100).toFixed(2)}%`,
          explanation: `${(ratio * 100).toFixed(0)}% of assets are owned by shareholders.`,
          steps: [`Equity Ratio = Total Equity / Total Assets = ${equity} / ${assets} = ${(ratio * 100).toFixed(2)}%`],
          tips: ['Higher equity ratio = less leverage; Equity Ratio + Debt Ratio = 1.'],
          formula: 'Equity Ratio = Total Equity / Total Assets'
        };
      }
    };
  }

  if (id === 'interest-coverage' || id === 'times-interest-earned') {
    return {
      title: 'Interest Coverage Ratio (Times Interest Earned)',
      description: 'EBIT divided by interest expense.',
      inputs: [
        { name: 'ebit', label: 'EBIT (Earnings Before Interest & Tax)', type: 'number', defaultValue: 120000, prefix: '$' },
        { name: 'interestExpense', label: 'Interest Expense', type: 'number', defaultValue: 20000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const ebit = safeFloat(inputs.ebit);
        const interest = safeFloat(inputs.interestExpense);
        if (interest === 0) return { result: 'Error', explanation: 'Interest expense cannot be zero.' };
        const ratio = ebit / interest;
        return {
          result: `${ratio.toFixed(2)}x`,
          explanation: ratio >= 2.5 ? 'Strong coverage.' : ratio >= 1.5 ? 'Acceptable.' : 'Weak coverage—may struggle to service debt.',
          steps: [`Interest Coverage = EBIT / Interest Expense = ${ebit} / ${interest} = ${ratio.toFixed(2)}x`],
          tips: ['Generally >2.5 is safe; <1.5 is risky.'],
          formula: 'Interest Coverage = EBIT / Interest Expense'
        };
      }
    };
  }

  if (id === 'dscr-calculator') {
    return {
      title: 'Debt Service Coverage Ratio (DSCR)',
      description: 'Net operating income / total debt service (principal + interest).',
      inputs: [
        { name: 'netOperatingIncome', label: 'Net Operating Income', type: 'number', defaultValue: 150000, prefix: '$' },
        { name: 'debtService', label: 'Total Debt Service (Principal + Interest)', type: 'number', defaultValue: 100000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const noi = safeFloat(inputs.netOperatingIncome);
        const ds = safeFloat(inputs.debtService);
        if (ds === 0) return { result: 'Error', explanation: 'Debt service cannot be zero.' };
        const dscr = noi / ds;
        return {
          result: dscr.toFixed(2),
          explanation: dscr >= 1.25 ? 'Strong DSCR (lenders typically want ≥1.25).' : dscr >= 1 ? 'Barely covering debt.' : 'Insufficient income to cover debt.',
          steps: [`DSCR = Net Operating Income / Debt Service = ${noi} / ${ds} = ${dscr.toFixed(2)}`],
          tips: ['Lenders often require DSCR ≥ 1.20–1.25.'],
          formula: 'DSCR = Net Operating Income / Debt Service'
        };
      }
    };
  }

  if (id === 'defensive-interval') {
    return {
      title: 'Defensive Interval Ratio',
      description: 'Days the company can operate using only liquid assets.',
      inputs: [
        { name: 'cash', label: 'Cash & Equivalents', type: 'number', defaultValue: 50000, prefix: '$' },
        { name: 'securities', label: 'Marketable Securities', type: 'number', defaultValue: 20000, prefix: '$' },
        { name: 'receivables', label: 'Receivables', type: 'number', defaultValue: 30000, prefix: '$' },
        { name: 'dailyExpenses', label: 'Daily Operating Expenses', type: 'number', defaultValue: 2000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const cash = safeFloat(inputs.cash);
        const securities = safeFloat(inputs.securities);
        const receivables = safeFloat(inputs.receivables);
        const daily = safeFloat(inputs.dailyExpenses);
        if (daily === 0) return { result: 'Error', explanation: 'Daily expenses cannot be zero.' };
        const defensive = cash + securities + receivables;
        const days = defensive / daily;
        return {
          result: `${days.toFixed(1)} days`,
          explanation: `Can operate for ${days.toFixed(0)} days using liquid assets.`,
          steps: [
            `Defensive Assets = Cash + Securities + Receivables = ${cash} + ${securities} + ${receivables} = ${defensive}`,
            `Days = ${defensive} / ${daily} = ${days.toFixed(1)} days`
          ],
          tips: ['Higher is safer; compare with industry norms.'],
          formula: 'Defensive Interval (days) = (Cash + Securities + Receivables) / Daily Operating Expenses'
        };
      }
    };
  }

  if (id === 'gross-margin-ratio') {
    return {
      title: 'Gross Margin Ratio',
      description: 'Gross profit as percentage of revenue.',
      inputs: [
        { name: 'revenue', label: 'Revenue', type: 'number', defaultValue: 500000, prefix: '$' },
        { name: 'cogs', label: 'COGS', type: 'number', defaultValue: 300000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const revenue = safeFloat(inputs.revenue);
        const cogs = safeFloat(inputs.cogs);
        if (revenue === 0) return { result: 'Error', explanation: 'Revenue cannot be zero.' };
        const gp = revenue - cogs;
        const ratio = (gp / revenue) * 100;
        return {
          result: `${ratio.toFixed(2)}%`,
          explanation: `Gross profit margin is ${ratio.toFixed(1)}%.`,
          steps: [
            `Gross Profit = Revenue - COGS = ${revenue} - ${cogs} = ${gp}`,
            `Gross Margin% = (GP / Revenue) × 100 = (${gp} / ${revenue}) × 100 = ${ratio.toFixed(2)}%`
          ],
          tips: ['Higher gross margin means more money to cover operating expenses and profit.'],
          formula: 'Gross Margin% = ((Revenue - COGS) / Revenue) × 100'
        };
      }
    };
  }

  if (id === 'operating-margin-ratio') {
    return {
      title: 'Operating Margin Ratio',
      description: 'Operating income as percentage of revenue.',
      inputs: [
        { name: 'revenue', label: 'Revenue', type: 'number', defaultValue: 500000, prefix: '$' },
        { name: 'operatingIncome', label: 'Operating Income (EBIT)', type: 'number', defaultValue: 80000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const revenue = safeFloat(inputs.revenue);
        const opIncome = safeFloat(inputs.operatingIncome);
        if (revenue === 0) return { result: 'Error', explanation: 'Revenue cannot be zero.' };
        const ratio = (opIncome / revenue) * 100;
        return {
          result: `${ratio.toFixed(2)}%`,
          explanation: `Operating margin is ${ratio.toFixed(1)}%.`,
          steps: [`Operating Margin% = (Operating Income / Revenue) × 100 = (${opIncome} / ${revenue}) × 100 = ${ratio.toFixed(2)}%`],
          tips: ['Shows profitability before interest and taxes; higher is better.'],
          formula: 'Operating Margin% = (Operating Income / Revenue) × 100'
        };
      }
    };
  }

  if (id === 'net-profit-margin') {
    return {
      title: 'Net Profit Margin',
      description: 'Net income as percentage of revenue.',
      inputs: [
        { name: 'netIncome', label: 'Net Income', type: 'number', defaultValue: 50000, prefix: '$' },
        { name: 'revenue', label: 'Revenue', type: 'number', defaultValue: 500000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const net = safeFloat(inputs.netIncome);
        const revenue = safeFloat(inputs.revenue);
        if (revenue === 0) return { result: 'Error', explanation: 'Revenue cannot be zero.' };
        const ratio = (net / revenue) * 100;
        return {
          result: `${ratio.toFixed(2)}%`,
          explanation: `Net profit margin is ${ratio.toFixed(1)}%.`,
          steps: [`Net Profit Margin% = (Net Income / Revenue) × 100 = (${net} / ${revenue}) × 100 = ${ratio.toFixed(2)}%`],
          tips: ['Bottom-line profitability; compare with industry peers.'],
          formula: 'Net Profit Margin% = (Net Income / Revenue) × 100'
        };
      }
    };
  }

  if (id === 'return-on-investment') {
    return {
      title: 'Return on Investment (ROI)',
      description: 'Gain from investment relative to cost.',
      inputs: [
        { name: 'gain', label: 'Gain from Investment', type: 'number', defaultValue: 15000, prefix: '$' },
        { name: 'cost', label: 'Cost of Investment', type: 'number', defaultValue: 100000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const gain = safeFloat(inputs.gain);
        const cost = safeFloat(inputs.cost);
        if (cost === 0) return { result: 'Error', explanation: 'Cost cannot be zero.' };
        const roi = (gain / cost) * 100;
        return {
          result: `${roi.toFixed(2)}%`,
          explanation: roi > 0 ? 'Positive return.' : 'Negative return.',
          steps: [`ROI% = (Gain / Cost) × 100 = (${gain} / ${cost}) × 100 = ${roi.toFixed(2)}%`],
          tips: ['Use for comparing investment alternatives.'],
          formula: 'ROI% = (Gain / Cost) × 100'
        };
      }
    };
  }

  if (id === 'return-on-capital-employed') {
    return {
      title: 'ROCE (Return on Capital Employed)',
      description: 'EBIT / (Total Assets - Current Liabilities).',
      inputs: [
        { name: 'ebit', label: 'EBIT', type: 'number', defaultValue: 120000, prefix: '$' },
        { name: 'totalAssets', label: 'Total Assets', type: 'number', defaultValue: 600000, prefix: '$' },
        { name: 'currentLiabilities', label: 'Current Liabilities', type: 'number', defaultValue: 100000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const ebit = safeFloat(inputs.ebit);
        const assets = safeFloat(inputs.totalAssets);
        const liabilities = safeFloat(inputs.currentLiabilities);
        const capital = assets - liabilities;
        if (capital === 0) return { result: 'Error', explanation: 'Capital employed cannot be zero.' };
        const roce = (ebit / capital) * 100;
        return {
          result: `${roce.toFixed(2)}%`,
          explanation: `Return on capital employed is ${roce.toFixed(1)}%.`,
          steps: [
            `Capital Employed = Total Assets - Current Liabilities = ${assets} - ${liabilities} = ${capital}`,
            `ROCE% = (EBIT / Capital Employed) × 100 = (${ebit} / ${capital}) × 100 = ${roce.toFixed(2)}%`
          ],
          tips: ['Higher ROCE means more efficient use of capital.'],
          formula: 'ROCE% = (EBIT / (Total Assets - Current Liabilities)) × 100'
        };
      }
    };
  }

  if (id === 'earnings-per-share') {
    return {
      title: 'Earnings Per Share (EPS)',
      description: 'Net income divided by outstanding shares.',
      inputs: [
        { name: 'netIncome', label: 'Net Income', type: 'number', defaultValue: 200000, prefix: '$' },
        { name: 'shares', label: 'Outstanding Shares', type: 'number', defaultValue: 50000 },
      ],
      calculate: (inputs) => {
        const net = safeFloat(inputs.netIncome);
        const shares = safeFloat(inputs.shares);
        if (shares === 0) return { result: 'Error', explanation: 'Shares cannot be zero.' };
        const eps = net / shares;
        return {
          result: `$${eps.toFixed(2)}`,
          explanation: `Each share earned $${eps.toFixed(2)} this period.`,
          steps: [`EPS = Net Income / Shares = ${net} / ${shares} = ${eps.toFixed(2)}`],
          tips: ['Higher EPS typically valued by investors; compare with P/E.'],
          formula: 'EPS = Net Income / Outstanding Shares'
        };
      }
    };
  }

  if (id === 'book-value-share') {
    return {
      title: 'Book Value Per Share',
      description: 'Total equity divided by outstanding shares.',
      inputs: [
        { name: 'totalEquity', label: 'Total Shareholder Equity', type: 'number', defaultValue: 500000, prefix: '$' },
        { name: 'shares', label: 'Outstanding Shares', type: 'number', defaultValue: 100000 },
      ],
      calculate: (inputs) => {
        const equity = safeFloat(inputs.totalEquity);
        const shares = safeFloat(inputs.shares);
        if (shares === 0) return { result: 'Error', explanation: 'Shares cannot be zero.' };
        const bvps = equity / shares;
        return {
          result: `$${bvps.toFixed(2)}`,
          explanation: `Book value per share is $${bvps.toFixed(2)}.`,
          steps: [`BVPS = Total Equity / Shares = ${equity} / ${shares} = ${bvps.toFixed(2)}`],
          tips: ['Compare BVPS to market price for valuation insights.'],
          formula: 'BVPS = Total Equity / Outstanding Shares'
        };
      }
    };
  }

  if (id === 'cash-flow-share') {
    return {
      title: 'Cash Flow Per Share',
      description: 'Operating cash flow / outstanding shares.',
      inputs: [
        { name: 'operatingCashFlow', label: 'Operating Cash Flow', type: 'number', defaultValue: 300000, prefix: '$' },
        { name: 'shares', label: 'Outstanding Shares', type: 'number', defaultValue: 100000 },
      ],
      calculate: (inputs) => {
        const ocf = safeFloat(inputs.operatingCashFlow);
        const shares = safeFloat(inputs.shares);
        if (shares === 0) return { result: 'Error', explanation: 'Shares cannot be zero.' };
        const cfps = ocf / shares;
        return {
          result: `$${cfps.toFixed(2)}`,
          explanation: `Cash flow per share is $${cfps.toFixed(2)}.`,
          steps: [`CFPS = Operating Cash Flow / Shares = ${ocf} / ${shares} = ${cfps.toFixed(2)}`],
          formula: 'CFPS = Operating Cash Flow / Shares'
        };
      }
    };
  }

  if (id === 'price-earnings-ratio') {
    return {
      title: 'P/E Ratio (Price-to-Earnings)',
      description: 'Share price / earnings per share.',
      inputs: [
        { name: 'sharePrice', label: 'Share Price', type: 'number', defaultValue: 50, prefix: '$' },
        { name: 'eps', label: 'EPS', type: 'number', defaultValue: 4, prefix: '$' },
      ],
      calculate: (inputs) => {
        const price = safeFloat(inputs.sharePrice);
        const eps = safeFloat(inputs.eps);
        if (eps === 0) return { result: 'Error', explanation: 'EPS cannot be zero.' };
        const pe = price / eps;
        return {
          result: pe.toFixed(2),
          explanation: `Investors pay ${pe.toFixed(1)}× earnings.`,
          steps: [`P/E = Share Price / EPS = ${price} / ${eps} = ${pe.toFixed(2)}`],
          tips: ['Compare P/E within same industry; high P/E may imply growth expectations.'],
          formula: 'P/E = Share Price / EPS'
        };
      }
    };
  }

  if (id === 'price-book-ratio') {
    return {
      title: 'P/B Ratio (Price-to-Book)',
      description: 'Market price / book value per share.',
      inputs: [
        { name: 'sharePrice', label: 'Share Price', type: 'number', defaultValue: 60, prefix: '$' },
        { name: 'bookValue', label: 'Book Value Per Share', type: 'number', defaultValue: 40, prefix: '$' },
      ],
      calculate: (inputs) => {
        const price = safeFloat(inputs.sharePrice);
        const book = safeFloat(inputs.bookValue);
        if (book === 0) return { result: 'Error', explanation: 'Book value cannot be zero.' };
        const pb = price / book;
        return {
          result: pb.toFixed(2),
          explanation: pb < 1 ? 'Trading below book value (potential undervaluation or distress).' : `Trading at ${pb.toFixed(1)}× book.`,
          steps: [`P/B = Share Price / BVPS = ${price} / ${book} = ${pb.toFixed(2)}`],
          formula: 'P/B = Share Price / Book Value Per Share'
        };
      }
    };
  }

  if (id === 'price-sales-ratio') {
    return {
      title: 'P/S Ratio (Price-to-Sales)',
      description: 'Market cap / total revenue.',
      inputs: [
        { name: 'marketCap', label: 'Market Capitalization', type: 'number', defaultValue: 1000000, prefix: '$' },
        { name: 'revenue', label: 'Total Revenue', type: 'number', defaultValue: 500000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const cap = safeFloat(inputs.marketCap);
        const revenue = safeFloat(inputs.revenue);
        if (revenue === 0) return { result: 'Error', explanation: 'Revenue cannot be zero.' };
        const ps = cap / revenue;
        return {
          result: ps.toFixed(2),
          explanation: `Market cap is ${ps.toFixed(1)}× revenue.`,
          steps: [`P/S = Market Cap / Revenue = ${cap} / ${revenue} = ${ps.toFixed(2)}`],
          tips: ['Useful for valuing early-stage or unprofitable companies.'],
          formula: 'P/S = Market Cap / Revenue'
        };
      }
    };
  }

  if (id === 'price-cash-flow') {
    return {
      title: 'Price to Cash Flow',
      description: 'Market cap / operating cash flow.',
      inputs: [
        { name: 'marketCap', label: 'Market Cap', type: 'number', defaultValue: 800000, prefix: '$' },
        { name: 'cashFlow', label: 'Operating Cash Flow', type: 'number', defaultValue: 100000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const cap = safeFloat(inputs.marketCap);
        const cf = safeFloat(inputs.cashFlow);
        if (cf === 0) return { result: 'Error', explanation: 'Cash flow cannot be zero.' };
        const pcf = cap / cf;
        return {
          result: pcf.toFixed(2),
          explanation: `Market cap is ${pcf.toFixed(1)}× cash flow.`,
          steps: [`P/CF = Market Cap / Cash Flow = ${cap} / ${cf} = ${pcf.toFixed(2)}`],
          formula: 'P/CF = Market Cap / Operating Cash Flow'
        };
      }
    };
  }

  if (id === 'peg-ratio') {
    return {
      title: 'PEG Ratio',
      description: 'P/E ratio / annual EPS growth rate.',
      inputs: [
        { name: 'pe', label: 'P/E Ratio', type: 'number', defaultValue: 20 },
        { name: 'growth', label: 'Annual EPS Growth Rate', type: 'number', defaultValue: 15, suffix: '%' },
      ],
      calculate: (inputs) => {
        const pe = safeFloat(inputs.pe);
        const growth = safeFloat(inputs.growth);
        if (growth === 0) return { result: 'Error', explanation: 'Growth rate cannot be zero.' };
        const peg = pe / growth;
        return {
          result: peg.toFixed(2),
          explanation: peg < 1 ? 'Potentially undervalued (PEG < 1).' : peg <= 2 ? 'Fair value.' : 'Possibly overvalued.',
          steps: [`PEG = P/E / Growth% = ${pe} / ${growth} = ${peg.toFixed(2)}`],
          tips: ['PEG < 1 often considered attractive; > 2 may be expensive.'],
          formula: 'PEG = P/E Ratio / Annual EPS Growth Rate'
        };
      }
    };
  }

  if (id === 'ev-ebitda') {
    return {
      title: 'EV/EBITDA',
      description: 'Enterprise value / EBITDA.',
      inputs: [
        { name: 'ev', label: 'Enterprise Value', type: 'number', defaultValue: 1200000, prefix: '$' },
        { name: 'ebitda', label: 'EBITDA', type: 'number', defaultValue: 150000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const ev = safeFloat(inputs.ev);
        const ebitda = safeFloat(inputs.ebitda);
        if (ebitda === 0) return { result: 'Error', explanation: 'EBITDA cannot be zero.' };
        const ratio = ev / ebitda;
        return {
          result: `${ratio.toFixed(2)}x`,
          explanation: `EV is ${ratio.toFixed(1)}× EBITDA.`,
          steps: [`EV/EBITDA = ${ev} / ${ebitda} = ${ratio.toFixed(2)}`],
          tips: ['Used widely in M&A; lower is generally cheaper.'],
          formula: 'EV/EBITDA = Enterprise Value / EBITDA'
        };
      }
    };
  }

  if (id === 'ev-sales') {
    return {
      title: 'EV/Sales',
      description: 'Enterprise value / revenue.',
      inputs: [
        { name: 'ev', label: 'Enterprise Value', type: 'number', defaultValue: 1000000, prefix: '$' },
        { name: 'revenue', label: 'Revenue', type: 'number', defaultValue: 500000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const ev = safeFloat(inputs.ev);
        const revenue = safeFloat(inputs.revenue);
        if (revenue === 0) return { result: 'Error', explanation: 'Revenue cannot be zero.' };
        const ratio = ev / revenue;
        return {
          result: `${ratio.toFixed(2)}x`,
          explanation: `EV is ${ratio.toFixed(1)}× sales.`,
          steps: [`EV/Sales = ${ev} / ${revenue} = ${ratio.toFixed(2)}`],
          formula: 'EV/Sales = Enterprise Value / Revenue'
        };
      }
    };
  }

  if (id === 'free-cash-flow-yield') {
    return {
      title: 'Free Cash Flow Yield',
      description: 'Free cash flow / market cap.',
      inputs: [
        { name: 'fcf', label: 'Free Cash Flow', type: 'number', defaultValue: 80000, prefix: '$' },
        { name: 'marketCap', label: 'Market Capitalization', type: 'number', defaultValue: 800000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const fcf = safeFloat(inputs.fcf);
        const cap = safeFloat(inputs.marketCap);
        if (cap === 0) return { result: 'Error', explanation: 'Market cap cannot be zero.' };
        const yield_ = (fcf / cap) * 100;
        return {
          result: `${yield_.toFixed(2)}%`,
          explanation: `Free cash flow yield is ${yield_.toFixed(1)}%.`,
          steps: [`FCF Yield% = (FCF / Market Cap) × 100 = (${fcf} / ${cap}) × 100 = ${yield_.toFixed(2)}%`],
          tips: ['Higher yield often better for value investors.'],
          formula: 'FCF Yield% = (Free Cash Flow / Market Cap) × 100'
        };
      }
    };
  }

  if (id === 'receivables-turnover') {
    return {
      title: 'Receivables Turnover',
      description: 'Net credit sales / average accounts receivable.',
      inputs: [
        { name: 'creditSales', label: 'Net Credit Sales', type: 'number', defaultValue: 500000, prefix: '$' },
        { name: 'avgReceivables', label: 'Average Accounts Receivable', type: 'number', defaultValue: 50000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const sales = safeFloat(inputs.creditSales);
        const ar = safeFloat(inputs.avgReceivables);
        if (ar === 0) return { result: 'Error', explanation: 'Receivables cannot be zero.' };
        const turnover = sales / ar;
        return {
          result: `${turnover.toFixed(2)}x`,
          explanation: `Receivables turn over ${turnover.toFixed(1)}× per period.`,
          steps: [`Receivables Turnover = Credit Sales / Avg AR = ${sales} / ${ar} = ${turnover.toFixed(2)}`],
          tips: ['Higher turnover = faster collection; track trend over time.'],
          formula: 'Receivables Turnover = Net Credit Sales / Avg Accounts Receivable'
        };
      }
    };
  }

  if (id === 'payables-turnover') {
    return {
      title: 'Payables Turnover',
      description: 'COGS / average accounts payable.',
      inputs: [
        { name: 'cogs', label: 'Cost of Goods Sold', type: 'number', defaultValue: 400000, prefix: '$' },
        { name: 'avgPayables', label: 'Average Accounts Payable', type: 'number', defaultValue: 50000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const cogs = safeFloat(inputs.cogs);
        const ap = safeFloat(inputs.avgPayables);
        if (ap === 0) return { result: 'Error', explanation: 'Payables cannot be zero.' };
        const turnover = cogs / ap;
        return {
          result: `${turnover.toFixed(2)}x`,
          explanation: `Payables turn over ${turnover.toFixed(1)}× per period.`,
          steps: [`Payables Turnover = COGS / Avg AP = ${cogs} / ${ap} = ${turnover.toFixed(2)}`],
          tips: ['Lower turnover may mean favorable payment terms or cash conservation.'],
          formula: 'Payables Turnover = COGS / Avg Accounts Payable'
        };
      }
    };
  }

  if (id === 'fixed-asset-turnover') {
    return {
      title: 'Fixed Asset Turnover',
      description: 'Revenue / net fixed assets.',
      inputs: [
        { name: 'revenue', label: 'Revenue', type: 'number', defaultValue: 600000, prefix: '$' },
        { name: 'fixedAssets', label: 'Net Fixed Assets', type: 'number', defaultValue: 200000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const revenue = safeFloat(inputs.revenue);
        const assets = safeFloat(inputs.fixedAssets);
        if (assets === 0) return { result: 'Error', explanation: 'Fixed assets cannot be zero.' };
        const turnover = revenue / assets;
        return {
          result: `${turnover.toFixed(2)}x`,
          explanation: `Generates $${turnover.toFixed(2)} revenue per $1 of fixed assets.`,
          steps: [`Fixed Asset Turnover = Revenue / Fixed Assets = ${revenue} / ${assets} = ${turnover.toFixed(2)}`],
          tips: ['Higher is more efficient; capital-intensive industries have lower turnover.'],
          formula: 'Fixed Asset Turnover = Revenue / Net Fixed Assets'
        };
      }
    };
  }

  if (id === 'working-capital-turnover') {
    return {
      title: 'Working Capital Turnover',
      description: 'Revenue / working capital.',
      inputs: [
        { name: 'revenue', label: 'Revenue', type: 'number', defaultValue: 500000, prefix: '$' },
        { name: 'workingCapital', label: 'Working Capital (Current Assets - Current Liabilities)', type: 'number', defaultValue: 100000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const revenue = safeFloat(inputs.revenue);
        const wc = safeFloat(inputs.workingCapital);
        if (wc === 0) return { result: 'Error', explanation: 'Working capital cannot be zero.' };
        const turnover = revenue / wc;
        return {
          result: `${turnover.toFixed(2)}x`,
          explanation: `Generates $${turnover.toFixed(2)} revenue per $1 of working capital.`,
          steps: [`WC Turnover = Revenue / WC = ${revenue} / ${wc} = ${turnover.toFixed(2)}`],
          formula: 'Working Capital Turnover = Revenue / Working Capital'
        };
      }
    };
  }

  if (id === 'capex-ratio') {
    return {
      title: 'Capex Ratio',
      description: 'Capex / revenue (or capex / operating cash flow).',
      inputs: [
        { name: 'capex', label: 'Capital Expenditure', type: 'number', defaultValue: 50000, prefix: '$' },
        { name: 'revenue', label: 'Revenue (or OCF)', type: 'number', defaultValue: 500000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const capex = safeFloat(inputs.capex);
        const revenue = safeFloat(inputs.revenue);
        if (revenue === 0) return { result: 'Error', explanation: 'Revenue/OCF cannot be zero.' };
        const ratio = (capex / revenue) * 100;
        return {
          result: `${ratio.toFixed(2)}%`,
          explanation: `Capex is ${ratio.toFixed(1)}% of revenue.`,
          steps: [`Capex Ratio% = (Capex / Revenue) × 100 = (${capex} / ${revenue}) × 100 = ${ratio.toFixed(2)}%`],
          tips: ['Capital-intensive businesses have higher capex ratios.'],
          formula: 'Capex Ratio% = (Capex / Revenue) × 100'
        };
      }
    };
  }

  if (id === 'internal-growth') {
    return {
      title: 'Internal Growth Rate',
      description: 'ROA × retention ratio.',
      inputs: [
        { name: 'roa', label: 'ROA (Return on Assets)', type: 'number', defaultValue: 10, suffix: '%' },
        { name: 'retention', label: 'Retention Ratio (% earnings retained)', type: 'number', defaultValue: 60, suffix: '%' },
      ],
      calculate: (inputs) => {
        const roa = safeFloat(inputs.roa) / 100;
        const ret = safeFloat(inputs.retention) / 100;
        const igr = roa * ret;
        return {
          result: `${(igr * 100).toFixed(2)}%`,
          explanation: `Internal growth rate is ${(igr * 100).toFixed(1)}% (no external financing).`,
          steps: [`IGR = ROA × Retention = ${roa.toFixed(4)} × ${ret.toFixed(4)} = ${igr.toFixed(4)} = ${(igr * 100).toFixed(2)}%`],
          tips: ['Shows sustainable growth without external equity or debt.'],
          formula: 'IGR = ROA × Retention Ratio'
        };
      }
    };
  }

  if (id === 'reinvestment-rate') {
    return {
      title: 'Reinvestment Rate',
      description: '(Capex - Depreciation + change in WC) / EBIT.',
      inputs: [
        { name: 'capex', label: 'Capex', type: 'number', defaultValue: 50000, prefix: '$' },
        { name: 'depreciation', label: 'Depreciation', type: 'number', defaultValue: 20000, prefix: '$' },
        { name: 'changeWC', label: 'Change in Working Capital', type: 'number', defaultValue: 5000, prefix: '$' },
        { name: 'ebit', label: 'EBIT', type: 'number', defaultValue: 120000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const capex = safeFloat(inputs.capex);
        const dep = safeFloat(inputs.depreciation);
        const wc = safeFloat(inputs.changeWC);
        const ebit = safeFloat(inputs.ebit);
        if (ebit === 0) return { result: 'Error', explanation: 'EBIT cannot be zero.' };
        const reinvest = capex - dep + wc;
        const rate = (reinvest / ebit) * 100;
        return {
          result: `${rate.toFixed(2)}%`,
          explanation: `Reinvesting ${rate.toFixed(1)}% of EBIT.`,
          steps: [
            `Reinvestment = Capex - Depreciation + ΔWC = ${capex} - ${dep} + ${wc} = ${reinvest}`,
            `Reinvestment Rate% = (${reinvest} / ${ebit}) × 100 = ${rate.toFixed(2)}%`
          ],
          formula: 'Reinvestment Rate = (Capex - Depreciation + ΔWC) / EBIT'
        };
      }
    };
  }

  if (id === 'altman-z-score') {
    return {
      title: 'Altman Z-Score',
      description: 'Bankruptcy predictor: Z = 1.2×WC/TA + 1.4×RE/TA + 3.3×EBIT/TA + 0.6×ME/TL + 1.0×Sales/TA.',
      inputs: [
        { name: 'workingCapital', label: 'Working Capital', type: 'number', defaultValue: 50000, prefix: '$' },
        { name: 'retainedEarnings', label: 'Retained Earnings', type: 'number', defaultValue: 80000, prefix: '$' },
        { name: 'ebit', label: 'EBIT', type: 'number', defaultValue: 100000, prefix: '$' },
        { name: 'marketEquity', label: 'Market Value of Equity', type: 'number', defaultValue: 500000, prefix: '$' },
        { name: 'sales', label: 'Sales', type: 'number', defaultValue: 600000, prefix: '$' },
        { name: 'totalAssets', label: 'Total Assets', type: 'number', defaultValue: 1000000, prefix: '$' },
        { name: 'totalLiabilities', label: 'Total Liabilities', type: 'number', defaultValue: 400000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const wc = safeFloat(inputs.workingCapital);
        const re = safeFloat(inputs.retainedEarnings);
        const ebit = safeFloat(inputs.ebit);
        const me = safeFloat(inputs.marketEquity);
        const sales = safeFloat(inputs.sales);
        const ta = safeFloat(inputs.totalAssets);
        const tl = safeFloat(inputs.totalLiabilities);

        if (ta === 0 || tl === 0) return { result: 'Error', explanation: 'Total assets and liabilities cannot be zero.' };

        const t1 = 1.2 * (wc / ta);
        const t2 = 1.4 * (re / ta);
        const t3 = 3.3 * (ebit / ta);
        const t4 = 0.6 * (me / tl);
        const t5 = 1.0 * (sales / ta);
        const z = t1 + t2 + t3 + t4 + t5;

        let interpretation = '';
        if (z > 2.99) interpretation = 'Safe Zone (low bankruptcy risk).';
        else if (z >= 1.81) interpretation = 'Grey Zone (some risk).';
        else interpretation = 'Distress Zone (high bankruptcy risk).';

        return {
          result: z.toFixed(2),
          explanation: interpretation,
          steps: [
            `T1 = 1.2×(WC/TA) = 1.2×(${wc}/${ta}) = ${t1.toFixed(4)}`,
            `T2 = 1.4×(RE/TA) = 1.4×(${re}/${ta}) = ${t2.toFixed(4)}`,
            `T3 = 3.3×(EBIT/TA) = 3.3×(${ebit}/${ta}) = ${t3.toFixed(4)}`,
            `T4 = 0.6×(ME/TL) = 0.6×(${me}/${tl}) = ${t4.toFixed(4)}`,
            `T5 = 1.0×(Sales/TA) = 1.0×(${sales}/${ta}) = ${t5.toFixed(4)}`,
            `Z-Score = ${t1.toFixed(4)} + ${t2.toFixed(4)} + ${t3.toFixed(4)} + ${t4.toFixed(4)} + ${t5.toFixed(4)} = ${z.toFixed(2)}`
          ],
          tips: ['Z > 2.99 → Safe; 1.81–2.99 → Grey; < 1.81 → Distress.'],
          formula: 'Z = 1.2×WC/TA + 1.4×RE/TA + 3.3×EBIT/TA + 0.6×ME/TL + 1.0×Sales/TA'
        };
      }
    };
  }

  if (id === 'piotroski-f-score') {
    return {
      title: 'Piotroski F-Score',
      description: 'Simple 9-point score (0–9) for financial strength (profitability, leverage, efficiency).',
      inputs: [
        { name: 'netIncomePositive', label: 'Net Income > 0?', type: 'select', options: ['Yes', 'No'], defaultValue: 'Yes' },
        { name: 'ocfPositive', label: 'Operating CF > 0?', type: 'select', options: ['Yes', 'No'], defaultValue: 'Yes' },
        { name: 'roaIncreased', label: 'ROA increased YoY?', type: 'select', options: ['Yes', 'No'], defaultValue: 'Yes' },
        { name: 'ocfGtNetIncome', label: 'OCF > Net Income?', type: 'select', options: ['Yes', 'No'], defaultValue: 'Yes' },
        { name: 'leverageDecreased', label: 'Leverage decreased?', type: 'select', options: ['Yes', 'No'], defaultValue: 'Yes' },
        { name: 'currentRatioIncreased', label: 'Current Ratio increased?', type: 'select', options: ['Yes', 'No'], defaultValue: 'Yes' },
        { name: 'noNewShares', label: 'No new shares issued?', type: 'select', options: ['Yes', 'No'], defaultValue: 'Yes' },
        { name: 'grossMarginIncreased', label: 'Gross Margin increased?', type: 'select', options: ['Yes', 'No'], defaultValue: 'Yes' },
        { name: 'assetTurnoverIncreased', label: 'Asset Turnover increased?', type: 'select', options: ['Yes', 'No'], defaultValue: 'Yes' },
      ],
      calculate: (inputs) => {
        let score = 0;
        if (inputs.netIncomePositive === 'Yes') score++;
        if (inputs.ocfPositive === 'Yes') score++;
        if (inputs.roaIncreased === 'Yes') score++;
        if (inputs.ocfGtNetIncome === 'Yes') score++;
        if (inputs.leverageDecreased === 'Yes') score++;
        if (inputs.currentRatioIncreased === 'Yes') score++;
        if (inputs.noNewShares === 'Yes') score++;
        if (inputs.grossMarginIncreased === 'Yes') score++;
        if (inputs.assetTurnoverIncreased === 'Yes') score++;

        let interp = '';
        if (score >= 7) interp = 'Strong financial health.';
        else if (score >= 4) interp = 'Average.';
        else interp = 'Weak financials.';

        return {
          result: `${score} / 9`,
          explanation: interp,
          steps: [`Each "Yes" = 1 point. Total = ${score}`],
          tips: ['High score (7–9) generally indicates strong fundamentals.'],
          formula: 'F-Score = sum of 9 binary checks (0 or 1 each)'
        };
      }
    };
  }

  if (id === 'beneish-m-score') {
    return {
      title: 'Beneish M-Score',
      description: 'Earnings manipulation detector (simplified version).',
      inputs: [
        { name: 'daysReceivablesIndex', label: 'Days Receivables Index (DSRI)', type: 'number', defaultValue: 1.1 },
        { name: 'grossMarginIndex', label: 'Gross Margin Index (GMI)', type: 'number', defaultValue: 1.0 },
        { name: 'assetQualityIndex', label: 'Asset Quality Index (AQI)', type: 'number', defaultValue: 1.05 },
        { name: 'salesGrowthIndex', label: 'Sales Growth Index (SGI)', type: 'number', defaultValue: 1.2 },
        { name: 'depreciationIndex', label: 'Depreciation Index (DEPI)', type: 'number', defaultValue: 0.95 },
        { name: 'sgaiIndex', label: 'SG&A Index (SGAI)', type: 'number', defaultValue: 1.0 },
        { name: 'leverageIndex', label: 'Leverage Index (LVGI)', type: 'number', defaultValue: 1.05 },
        { name: 'totalAccruals', label: 'Total Accruals to Assets (TATA)', type: 'number', defaultValue: 0.02 },
      ],
      calculate: (inputs) => {
        const dsri = safeFloat(inputs.daysReceivablesIndex);
        const gmi = safeFloat(inputs.grossMarginIndex);
        const aqi = safeFloat(inputs.assetQualityIndex);
        const sgi = safeFloat(inputs.salesGrowthIndex);
        const depi = safeFloat(inputs.depreciationIndex);
        const sgai = safeFloat(inputs.sgaiIndex);
        const lvgi = safeFloat(inputs.leverageIndex);
        const tata = safeFloat(inputs.totalAccruals);

        const m = -4.84 + 0.92 * dsri + 0.528 * gmi + 0.404 * aqi + 0.892 * sgi + 0.115 * depi - 0.172 * sgai + 4.679 * tata - 0.327 * lvgi;

        let interp = '';
        if (m > -1.78) interp = 'Potential earnings manipulation (M > -1.78).';
        else interp = 'Less likely to be manipulating earnings.';

        return {
          result: m.toFixed(2),
          explanation: interp,
          steps: [
            `M = -4.84 + 0.92×DSRI + 0.528×GMI + 0.404×AQI + 0.892×SGI + 0.115×DEPI - 0.172×SGAI + 4.679×TATA - 0.327×LVGI`,
            `M = ${m.toFixed(2)}`
          ],
          tips: ['M-Score > -1.78 suggests possible manipulation; use as red flag, not proof.'],
          formula: 'M-Score = -4.84 + 0.92×DSRI + 0.528×GMI + ... (8-variable model)'
        };
      }
    };
  }

  // --- Valuation ---
  if (id === 'pe-ratio') {
    return {
      title: 'Price-to-Earnings (P/E) Ratio',
      description: 'Calculate the P/E ratio to value a company.',
      inputs: [
        { name: 'sharePrice', label: 'Share Price', type: 'number', defaultValue: 150, prefix: '$' },
        { name: 'eps', label: 'Earnings Per Share (EPS)', type: 'number', defaultValue: 5, prefix: '$' },
      ],
      calculate: (inputs) => {
        const p = safeFloat(inputs.sharePrice);
        const e = safeFloat(inputs.eps);
        
        if (e === 0) return { result: 'Error', explanation: 'EPS cannot be zero.' };

        const pe = p / e;

        return {
          result: pe.toFixed(2),
          explanation: 'Investors are paying $' + pe.toFixed(2) + ' for every $1 of earnings.',
          steps: [
            `P/E Ratio = Share Price / EPS = ${p} / ${e} = ${pe.toFixed(2)}`
          ],
          tips: ['Compare P/E within the same industry; high P/E may signal growth expectations.'],
          formula: 'P/E = Share Price / EPS'
        };
      }
    };
  }

  if (id === 'book-value-per-share') {
    return {
      title: 'Book Value Per Share',
      description: 'Total shareholder equity / outstanding shares.',
      inputs: [
        { name: 'totalEquity', label: 'Total Shareholder Equity', type: 'number', defaultValue: 800000, prefix: '$' },
        { name: 'shares', label: 'Outstanding Shares', type: 'number', defaultValue: 200000 },
      ],
      calculate: (inputs) => {
        const equity = safeFloat(inputs.totalEquity);
        const shares = safeFloat(inputs.shares);
        if (shares === 0) return { result: 'Error', explanation: 'Shares cannot be zero.' };
        const bvps = equity / shares;
        return {
          result: `$${bvps.toFixed(2)}`,
          explanation: `Book value per share is $${bvps.toFixed(2)}.`,
          steps: [`BVPS = Equity / Shares = ${equity} / ${shares} = ${bvps.toFixed(2)}`],
          tips: ['Compare BVPS to market price for valuation insight.'],
          formula: 'BVPS = Total Equity / Outstanding Shares'
        };
      }
    };
  }

  if (id === 'pb-ratio') {
    return {
      title: 'P/B Ratio Calculator',
      description: 'Market price per share / book value per share.',
      inputs: [
        { name: 'marketPrice', label: 'Market Price Per Share', type: 'number', defaultValue: 50, prefix: '$' },
        { name: 'bookValue', label: 'Book Value Per Share', type: 'number', defaultValue: 40, prefix: '$' },
      ],
      calculate: (inputs) => {
        const price = safeFloat(inputs.marketPrice);
        const book = safeFloat(inputs.bookValue);
        if (book === 0) return { result: 'Error', explanation: 'Book value cannot be zero.' };
        const pb = price / book;
        return {
          result: pb.toFixed(2),
          explanation: pb < 1 ? 'Trading below book value (possible undervaluation or distress).' : `Trading at ${pb.toFixed(1)}× book.`,
          steps: [`P/B = Market Price / BVPS = ${price} / ${book} = ${pb.toFixed(2)}`],
          tips: ['P/B < 1 may indicate undervaluation or fundamental issues.'],
          formula: 'P/B = Market Price / Book Value Per Share'
        };
      }
    };
  }

  if (id === 'enterprise-value') {
    return {
      title: 'Enterprise Value (EV)',
      description: 'EV = Market Cap + Total Debt − Cash.',
      inputs: [
        { name: 'marketCap', label: 'Market Capitalization', type: 'number', defaultValue: 1000000, prefix: '$' },
        { name: 'totalDebt', label: 'Total Debt', type: 'number', defaultValue: 300000, prefix: '$' },
        { name: 'cash', label: 'Cash & Cash Equivalents', type: 'number', defaultValue: 100000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const cap = safeFloat(inputs.marketCap);
        const debt = safeFloat(inputs.totalDebt);
        const cash = safeFloat(inputs.cash);
        const ev = cap + debt - cash;
        return {
          result: `$${ev.toFixed(2)}`,
          explanation: `Enterprise value is $${ev.toLocaleString()}.`,
          steps: [`EV = Market Cap + Debt − Cash = ${cap} + ${debt} − ${cash} = ${ev.toFixed(2)}`],
          tips: ['EV represents total company value for M&A or valuation multiples.'],
          formula: 'EV = Market Cap + Total Debt − Cash'
        };
      }
    };
  }

  if (id === 'dividend-payout') {
    return {
      title: 'Dividend Payout Ratio',
      description: 'Dividends / net income.',
      inputs: [
        { name: 'dividends', label: 'Dividends Paid', type: 'number', defaultValue: 50000, prefix: '$' },
        { name: 'netIncome', label: 'Net Income', type: 'number', defaultValue: 100000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const div = safeFloat(inputs.dividends);
        const net = safeFloat(inputs.netIncome);
        if (net === 0) return { result: 'Error', explanation: 'Net income cannot be zero.' };
        const payout = (div / net) * 100;
        return {
          result: `${payout.toFixed(2)}%`,
          explanation: `Paying out ${payout.toFixed(0)}% of net income as dividends.`,
          steps: [`Payout% = (Dividends / Net Income) × 100 = (${div} / ${net}) × 100 = ${payout.toFixed(2)}%`],
          tips: ['Higher payout = less retained for growth; varies by industry.'],
          formula: 'Dividend Payout% = (Dividends / Net Income) × 100'
        };
      }
    };
  }

  if (id === 'retention-ratio') {
    return {
      title: 'Retention Ratio',
      description: '(Net Income − Dividends) / Net Income.',
      inputs: [
        { name: 'netIncome', label: 'Net Income', type: 'number', defaultValue: 100000, prefix: '$' },
        { name: 'dividends', label: 'Dividends Paid', type: 'number', defaultValue: 30000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const net = safeFloat(inputs.netIncome);
        const div = safeFloat(inputs.dividends);
        if (net === 0) return { result: 'Error', explanation: 'Net income cannot be zero.' };
        const retained = net - div;
        const ratio = (retained / net) * 100;
        return {
          result: `${ratio.toFixed(2)}%`,
          explanation: `Retaining ${ratio.toFixed(0)}% of earnings.`,
          steps: [
            `Retained Earnings = Net Income − Dividends = ${net} − ${div} = ${retained}`,
            `Retention Ratio% = (${retained} / ${net}) × 100 = ${ratio.toFixed(2)}%`
          ],
          tips: ['Retention Ratio + Dividend Payout = 100%.'],
          formula: 'Retention Ratio% = ((Net Income − Dividends) / Net Income) × 100'
        };
      }
    };
  }

  if (id === 'sustainable-growth') {
    return {
      title: 'Sustainable Growth Rate',
      description: 'ROE × Retention Ratio.',
      inputs: [
        { name: 'roe', label: 'ROE (Return on Equity)', type: 'number', defaultValue: 15, suffix: '%' },
        { name: 'retention', label: 'Retention Ratio (% earnings retained)', type: 'number', defaultValue: 70, suffix: '%' },
      ],
      calculate: (inputs) => {
        const roe = safeFloat(inputs.roe) / 100;
        const ret = safeFloat(inputs.retention) / 100;
        const sgr = roe * ret;
        return {
          result: `${(sgr * 100).toFixed(2)}%`,
          explanation: `Sustainable growth rate is ${(sgr * 100).toFixed(1)}% (without external financing).`,
          steps: [`SGR = ROE × Retention = ${roe.toFixed(4)} × ${ret.toFixed(4)} = ${sgr.toFixed(4)} = ${(sgr * 100).toFixed(2)}%`],
          tips: ['Shows max growth using retained earnings; higher ROE or retention boosts SGR.'],
          formula: 'SGR = ROE × Retention Ratio'
        };
      }
    };
  }

  // --- Operational Metrics ---
  if (id === 'ap-turnover') {
    return {
      title: 'Accounts Payable Turnover',
      description: 'COGS / average accounts payable.',
      inputs: [
        { name: 'cogs', label: 'Cost of Goods Sold', type: 'number', defaultValue: 400000, prefix: '$' },
        { name: 'avgPayables', label: 'Average Accounts Payable', type: 'number', defaultValue: 50000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const cogs = safeFloat(inputs.cogs);
        const ap = safeFloat(inputs.avgPayables);
        if (ap === 0) return { result: 'Error', explanation: 'Average payables cannot be zero.' };
        const turnover = cogs / ap;
        return {
          result: `${turnover.toFixed(2)}x`,
          explanation: `Payables turn over ${turnover.toFixed(1)}× per period.`,
          steps: [`AP Turnover = COGS / Avg AP = ${cogs} / ${ap} = ${turnover.toFixed(2)}`],
          tips: ['Lower turnover may indicate favorable payment terms or cash conservation.'],
          formula: 'AP Turnover = COGS / Avg Accounts Payable'
        };
      }
    };
  }

  if (id === 'ar-turnover') {
    return {
      title: 'Accounts Receivable Turnover',
      description: 'Net credit sales / average accounts receivable.',
      inputs: [
        { name: 'creditSales', label: 'Net Credit Sales', type: 'number', defaultValue: 500000, prefix: '$' },
        { name: 'avgReceivables', label: 'Average Accounts Receivable', type: 'number', defaultValue: 50000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const sales = safeFloat(inputs.creditSales);
        const ar = safeFloat(inputs.avgReceivables);
        if (ar === 0) return { result: 'Error', explanation: 'Average receivables cannot be zero.' };
        const turnover = sales / ar;
        return {
          result: `${turnover.toFixed(2)}x`,
          explanation: `Receivables turn over ${turnover.toFixed(1)}× per period.`,
          steps: [`AR Turnover = Credit Sales / Avg AR = ${sales} / ${ar} = ${turnover.toFixed(2)}`],
          tips: ['Higher turnover = faster collection; compare with industry.'],
          formula: 'AR Turnover = Net Credit Sales / Avg Accounts Receivable'
        };
      }
    };
  }

  if (id === 'asset-turnover') {
    return {
      title: 'Asset Turnover Ratio',
      description: 'Revenue / total assets.',
      inputs: [
        { name: 'revenue', label: 'Revenue', type: 'number', defaultValue: 600000, prefix: '$' },
        { name: 'totalAssets', label: 'Total Assets', type: 'number', defaultValue: 500000, prefix: '$' },
      ],
      calculate: (inputs) => {
        const revenue = safeFloat(inputs.revenue);
        const assets = safeFloat(inputs.totalAssets);
        if (assets === 0) return { result: 'Error', explanation: 'Total assets cannot be zero.' };
        const turnover = revenue / assets;
        return {
          result: `${turnover.toFixed(2)}x`,
          explanation: `Generates $${turnover.toFixed(2)} revenue per $1 of assets.`,
          steps: [`Asset Turnover = Revenue / Total Assets = ${revenue} / ${assets} = ${turnover.toFixed(2)}`],
          tips: ['Higher is more efficient; varies by industry.'],
          formula: 'Asset Turnover = Revenue / Total Assets'
        };
      }
    };
  }

  if (id === 'employee-turnover') {
    return {
      title: 'Employee Turnover Rate',
      description: 'Number of separations / average employees.',
      inputs: [
        { name: 'separations', label: 'Number of Separations (leavers)', type: 'number', defaultValue: 15 },
        { name: 'avgEmployees', label: 'Average Number of Employees', type: 'number', defaultValue: 100 },
      ],
      calculate: (inputs) => {
        const separations = safeFloat(inputs.separations);
        const avg = safeFloat(inputs.avgEmployees);
        if (avg === 0) return { result: 'Error', explanation: 'Average employees cannot be zero.' };
        const rate = (separations / avg) * 100;
        return {
          result: `${rate.toFixed(2)}%`,
          explanation: rate <= 10 ? 'Low turnover.' : rate <= 20 ? 'Moderate turnover.' : 'High turnover—consider retention strategies.',
          steps: [`Turnover% = (Separations / Avg Employees) × 100 = (${separations} / ${avg}) × 100 = ${rate.toFixed(2)}%`],
          tips: ['Track by department and role; high turnover increases hiring costs.'],
          formula: 'Employee Turnover% = (Separations / Avg Employees) × 100'
        };
      }
    };
  }

  if (id === 'revenue-per-employee') {
    return {
      title: 'Revenue Per Employee',
      description: 'Total revenue / number of employees.',
      inputs: [
        { name: 'revenue', label: 'Total Revenue', type: 'number', defaultValue: 1000000, prefix: '$' },
        { name: 'employees', label: 'Number of Employees', type: 'number', defaultValue: 50 },
      ],
      calculate: (inputs) => {
        const revenue = safeFloat(inputs.revenue);
        const emp = safeFloat(inputs.employees);
        if (emp === 0) return { result: 'Error', explanation: 'Employees cannot be zero.' };
        const rpe = revenue / emp;
        return {
          result: `$${rpe.toFixed(2)}`,
          explanation: `Revenue per employee is $${rpe.toLocaleString()}.`,
          steps: [`Revenue/Employee = Revenue / Employees = ${revenue} / ${emp} = ${rpe.toFixed(2)}`],
          tips: ['Higher typically means better productivity; compare with industry benchmarks.'],
          formula: 'Revenue/Employee = Total Revenue / # Employees'
        };
      }
    };
  }

  // --- Time & Payroll (unknown category) ---
  if (id === 'annual-to-hourly') {
    return {
      title: 'Annual to Hourly Salary Converter',
      description: 'Convert annual salary to hourly rate.',
      inputs: [
        { name: 'annualSalary', label: 'Annual Salary', type: 'number', defaultValue: 60000, prefix: '$' },
        { name: 'hoursPerWeek', label: 'Hours per Week', type: 'number', defaultValue: 40 },
        { name: 'weeksPerYear', label: 'Weeks per Year', type: 'number', defaultValue: 52 },
      ],
      calculate: (inputs) => {
        const annual = safeFloat(inputs.annualSalary);
        const hours = safeFloat(inputs.hoursPerWeek);
        const weeks = safeFloat(inputs.weeksPerYear);
        const totalHours = hours * weeks;
        if (totalHours === 0) return { result: 'Error', explanation: 'Total hours cannot be zero.' };
        const hourly = annual / totalHours;
        return {
          result: `$${hourly.toFixed(2)}/hr`,
          explanation: `Hourly rate is $${hourly.toFixed(2)}.`,
          steps: [
            `Total Hours = ${hours} hrs/week × ${weeks} weeks = ${totalHours}`,
            `Hourly Rate = ${annual} / ${totalHours} = ${hourly.toFixed(2)}`
          ],
          tips: ['Excludes benefits and taxes; for gross salary comparison.'],
          formula: 'Hourly Rate = Annual Salary / (Hours/Week × Weeks/Year)'
        };
      }
    };
  }

  if (id === 'hourly-to-annual') {
    return {
      title: 'Hourly to Annual Salary Converter',
      description: 'Convert hourly rate to annual salary.',
      inputs: [
        { name: 'hourlyRate', label: 'Hourly Rate', type: 'number', defaultValue: 25, prefix: '$' },
        { name: 'hoursPerWeek', label: 'Hours per Week', type: 'number', defaultValue: 40 },
        { name: 'weeksPerYear', label: 'Weeks per Year', type: 'number', defaultValue: 52 },
      ],
      calculate: (inputs) => {
        const hourly = safeFloat(inputs.hourlyRate);
        const hours = safeFloat(inputs.hoursPerWeek);
        const weeks = safeFloat(inputs.weeksPerYear);
        const annual = hourly * hours * weeks;
        return {
          result: `$${annual.toFixed(2)}`,
          explanation: `Annual salary is $${annual.toLocaleString()}.`,
          steps: [`Annual = Hourly × Hours/Week × Weeks/Year = ${hourly} × ${hours} × ${weeks} = ${annual.toFixed(2)}`],
          tips: ['Assumes consistent hours; exclude overtime/bonuses for baseline.'],
          formula: 'Annual Salary = Hourly Rate × Hours/Week × Weeks/Year'
        };
      }
    };
  }

  if (id === 'compound-time') {
    return {
      title: 'Compound Interest Time Calculator',
      description: 'Estimate years to reach target with compound interest.',
      inputs: [
        { name: 'principal', label: 'Principal', type: 'number', defaultValue: 10000, prefix: '$' },
        { name: 'target', label: 'Target Amount', type: 'number', defaultValue: 20000, prefix: '$' },
        { name: 'rate', label: 'Annual Interest Rate', type: 'number', defaultValue: 7, suffix: '%' },
      ],
      calculate: (inputs) => {
        const p = safeFloat(inputs.principal);
        const target = safeFloat(inputs.target);
        const r = safeFloat(inputs.rate) / 100;
        if (p === 0 || r === 0) return { result: 'Error', explanation: 'Principal and rate must be > 0.' };
        if (target <= p) return { result: 'Error', explanation: 'Target must be greater than principal.' };
        const years = Math.log(target / p) / Math.log(1 + r);
        return {
          result: `${years.toFixed(2)} years`,
          explanation: `It takes ~${years.toFixed(1)} years to grow $${p.toLocaleString()} to $${target.toLocaleString()} at ${(r * 100).toFixed(1)}%.`,
          steps: [`Years = ln(Target/Principal) / ln(1 + Rate) = ln(${target}/${p}) / ln(1 + ${r.toFixed(4)}) = ${years.toFixed(2)}`],
          tips: ['Assumes annual compounding; adjust for different compounding frequencies.'],
          formula: 'Years = ln(Target / Principal) / ln(1 + Rate)'
        };
      }
    };
  }

  if (id === 'contract-duration') {
    return {
      title: 'Contract Duration Calculator',
      description: 'Calculate days/months between contract start and end.',
      inputs: [
        { name: 'startDate', label: 'Start Date (YYYY-MM-DD)', type: 'text', defaultValue: '2026-01-01' },
        { name: 'endDate', label: 'End Date (YYYY-MM-DD)', type: 'text', defaultValue: '2026-12-31' },
      ],
      calculate: (inputs) => {
        const start = new Date(String(inputs.startDate));
        const end = new Date(String(inputs.endDate));
        if (isNaN(start.getTime()) || isNaN(end.getTime())) return { result: 'Error', explanation: 'Invalid date format.' };
        const diff = end.getTime() - start.getTime();
        const days = diff / (1000 * 60 * 60 * 24);
        const months = days / 30.44; // average
        return {
          result: `${Math.round(days)} days`,
          explanation: `Contract duration: ~${months.toFixed(1)} months.`,
          steps: [`Days = (End − Start) = ${Math.round(days)} days`],
          tips: ['Use actual calendar days; adjust for business days if needed.'],
          formula: 'Duration (days) = End Date − Start Date'
        };
      }
    };
  }

  if (id === 'pay-period-calculator') {
    return {
      title: 'Pay Period Calculator',
      description: 'Calculate pay per period from annual salary.',
      inputs: [
        { name: 'annualSalary', label: 'Annual Salary', type: 'number', defaultValue: 60000, prefix: '$' },
        { name: 'payFrequency', label: 'Pay Frequency', type: 'select', options: ['Weekly', 'Bi-Weekly', 'Semi-Monthly', 'Monthly'], defaultValue: 'Bi-Weekly' },
      ],
      calculate: (inputs) => {
        const annual = safeFloat(inputs.annualSalary);
        const freq = String(inputs.payFrequency);
        let periods = 12;
        if (freq === 'Weekly') periods = 52;
        else if (freq === 'Bi-Weekly') periods = 26;
        else if (freq === 'Semi-Monthly') periods = 24;
        else if (freq === 'Monthly') periods = 12;

        const payPerPeriod = annual / periods;
        return {
          result: `$${payPerPeriod.toFixed(2)}`,
          explanation: `${freq} pay is $${payPerPeriod.toFixed(2)}.`,
          steps: [`Pay/Period = Annual / Periods = ${annual} / ${periods} = ${payPerPeriod.toFixed(2)}`],
          tips: ['Excludes taxes and deductions.'],
          formula: 'Pay per Period = Annual Salary / # Periods'
        };
      }
    };
  }

  if (id === 'payroll-hours') {
    return {
      title: 'Payroll Hours Calculator',
      description: 'Calculate total payroll hours from daily logs.',
      inputs: [
        { name: 'regularHours', label: 'Regular Hours Worked', type: 'number', defaultValue: 40 },
        { name: 'overtimeHours', label: 'Overtime Hours', type: 'number', defaultValue: 5 },
      ],
      calculate: (inputs) => {
        const reg = safeFloat(inputs.regularHours);
        const ot = safeFloat(inputs.overtimeHours);
        const total = reg + ot;
        return {
          result: `${total} hours`,
          explanation: `Total payroll hours: ${total} (${reg} regular + ${ot} OT).`,
          steps: [`Total = Regular + Overtime = ${reg} + ${ot} = ${total}`],
          tips: ['Track overtime separately for pay rate differences.'],
          formula: 'Total Hours = Regular + Overtime'
        };
      }
    };
  }

  if (id === 'sick-leave-calculator') {
    return {
      title: 'Sick Leave Accrual Calculator',
      description: 'Calculate accrued sick leave hours.',
      inputs: [
        { name: 'hoursPerPayPeriod', label: 'Sick Hours per Pay Period', type: 'number', defaultValue: 4 },
        { name: 'payPeriods', label: 'Pay Periods Worked', type: 'number', defaultValue: 12 },
      ],
      calculate: (inputs) => {
        const hrs = safeFloat(inputs.hoursPerPayPeriod);
        const periods = safeFloat(inputs.payPeriods);
        const accrued = hrs * periods;
        return {
          result: `${accrued} hours`,
          explanation: `Accrued ${accrued} sick leave hours.`,
          steps: [`Accrued = Hours/Period × Periods = ${hrs} × ${periods} = ${accrued}`],
          tips: ['Check company policy for accrual caps.'],
          formula: 'Accrued Hours = Hours/Period × Periods Worked'
        };
      }
    };
  }

  if (id === 'subscription-cost-time') {
    return {
      title: 'Subscription Cost Over Time',
      description: 'Calculate total subscription cost over a period.',
      inputs: [
        { name: 'monthlyCost', label: 'Monthly Cost', type: 'number', defaultValue: 19.99, prefix: '$' },
        { name: 'months', label: 'Number of Months', type: 'number', defaultValue: 12 },
      ],
      calculate: (inputs) => {
        const monthly = safeFloat(inputs.monthlyCost);
        const months = safeFloat(inputs.months);
        const total = monthly * months;
        return {
          result: `$${total.toFixed(2)}`,
          explanation: `Total cost over ${months} months is $${total.toFixed(2)}.`,
          steps: [`Total = Monthly × Months = ${monthly} × ${months} = ${total.toFixed(2)}`],
          tips: ['Compare annual vs monthly plans for savings.'],
          formula: 'Total Cost = Monthly Cost × Months'
        };
      }
    };
  }

  if (id === 'time-off-accrual') {
    return {
      title: 'Time Off Accrual Calculator',
      description: 'Calculate vacation/PTO hours accrued.',
      inputs: [
        { name: 'hoursPerPayPeriod', label: 'Hours Accrued per Pay Period', type: 'number', defaultValue: 3.33 },
        { name: 'payPeriods', label: 'Pay Periods Worked', type: 'number', defaultValue: 24 },
      ],
      calculate: (inputs) => {
        const hrs = safeFloat(inputs.hoursPerPayPeriod);
        const periods = safeFloat(inputs.payPeriods);
        const accrued = hrs * periods;
        return {
          result: `${accrued.toFixed(2)} hours`,
          explanation: `Accrued ${accrued.toFixed(1)} hours of PTO.`,
          steps: [`Accrued = Hours/Period × Periods = ${hrs} × ${periods} = ${accrued.toFixed(2)}`],
          tips: ['Many companies cap accrual; check your policy.'],
          formula: 'Accrued PTO = Hours/Period × Periods Worked'
        };
      }
    };
  }

  if (id === 'time-value-money') {
    return {
      title: 'Time Value of Money (PV)',
      description: 'Calculate present value of future amount.',
      inputs: [
        { name: 'futureValue', label: 'Future Value', type: 'number', defaultValue: 10000, prefix: '$' },
        { name: 'rate', label: 'Discount Rate (annual)', type: 'number', defaultValue: 5, suffix: '%' },
        { name: 'years', label: 'Years', type: 'number', defaultValue: 10 },
      ],
      calculate: (inputs) => {
        const fv = safeFloat(inputs.futureValue);
        const r = safeFloat(inputs.rate) / 100;
        const years = safeFloat(inputs.years);
        const pv = fv / Math.pow(1 + r, years);
        return {
          result: `$${pv.toFixed(2)}`,
          explanation: `Present value of $${fv.toLocaleString()} in ${years} years at ${(r * 100).toFixed(1)}% is $${pv.toFixed(2)}.`,
          steps: [`PV = FV / (1 + r)^n = ${fv} / (1 + ${r.toFixed(4)})^${years} = ${pv.toFixed(2)}`],
          tips: ['Higher discount rate = lower PV.'],
          formula: 'PV = FV / (1 + r)^n'
        };
      }
    };
  }

  // --- Default Fallback ---
  return {
    title: id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    description: 'This business calculator is not configured yet.',
    inputs: [],
    calculate: (inputs) => {
      return {
        result: 'Not Configured',
        explanation: `Missing calculator configuration for id: ${id}`,
        steps: []
      };
    }
  };
};

const getCategoryTheme = () => ({
  gradient: 'from-amber-500/10 via-yellow-500/10 to-orange-500/10',
  icon: Briefcase,
  emoji: '💼',
  accentColor: 'text-amber-600 dark:text-amber-400'
});

export const GenericBusinessTool = ({ id }: { id: string }) => {
  if (!id) return <div className="p-8 text-center text-muted-foreground">Calculator configuration not found</div>;

  const config = useMemo(() => getToolConfig(id), [id]);
  const theme = getCategoryTheme();
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [autoCalculate, setAutoCalculate] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    const defaults: Record<string, any> = {};
    config.inputs.forEach(input => {
      defaults[input.name] = input.defaultValue;
    });
    setInputs(defaults);
    setResult(null);
  }, [id, config]);

  // Auto-calculate with debounce
  useEffect(() => {
    if (!autoCalculate) return;
    
    const timer = setTimeout(() => {
      handleCalculate();
    }, 500);

    return () => clearTimeout(timer);
  }, [inputs, autoCalculate]);

  const handleCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setResult(config.calculate(inputs));
      setIsCalculating(false);
    }, 150);
  };

  const handleCopy = async () => {
    if (!result) return;
    const text = `Result: ${result.result}${result.explanation ? '\nExplanation: ' + result.explanation : ''}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const applyPreset = (values: Record<string, any>) => {
    setInputs(prev => ({ ...prev, ...values }));
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.gradient} p-4 md:p-8`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
              <theme.icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
                {config.title}
              </h1>
              <p className="text-muted-foreground mt-1">{config.description}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Preset Scenarios */}
            {config.presetScenarios && config.presetScenarios.length > 0 && (
              <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl animate-in fade-in slide-in-from-left-4 duration-700">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <h3 className="font-semibold">Quick Scenarios</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {config.presetScenarios.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => applyPreset(preset.values)}
                      className="group p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border-2 border-transparent hover:border-amber-500 hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{preset.icon}</div>
                      <div className="text-xs font-medium text-center">{preset.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Inputs */}
            <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
              <div className="space-y-5">
                {config.inputs.map((input, idx) => (
                  <div key={input.name} className="space-y-2 animate-in fade-in slide-in-from-left-3 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium flex items-center gap-2">
                        {input.label}
                        {input.helpText && (
                          <div className="group relative">
                            <Lightbulb className="w-4 h-4 text-amber-500 cursor-help" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                              {input.helpText}
                            </div>
                          </div>
                        )}
                      </label>
                    </div>

                    {input.type === 'select' && input.options ? (
                      <select
                        value={inputs[input.name] ?? input.options[0]}
                        onChange={(e) => setInputs(prev => ({ ...prev, [input.name]: e.target.value }))}
                        className="w-full p-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-amber-500 outline-none transition-all duration-300 hover:shadow-md"
                      >
                        {input.options.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : input.type === 'slider' ? (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{input.prefix || ''}{input.min || 0}</span>
                          <span className="font-semibold text-amber-600 dark:text-amber-400">{input.prefix || ''}{inputs[input.name]}{input.suffix || ''}</span>
                          <span>{input.prefix || ''}{input.max || 100}</span>
                        </div>
                        <input
                          type="range"
                          value={inputs[input.name] ?? 0}
                          onChange={(e) => setInputs(prev => ({ ...prev, [input.name]: parseFloat(e.target.value) }))}
                          min={input.min || 0}
                          max={input.max || 100}
                          step={input.step || 1}
                          className="w-full h-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg appearance-none cursor-pointer slider-thumb"
                          style={{
                            background: `linear-gradient(to right, rgb(245 158 11) 0%, rgb(245 158 11) ${((Number(inputs[input.name] ?? 0) - (input.min || 0)) / ((input.max || 100) - (input.min || 0))) * 100}%, rgb(229 231 235) ${((Number(inputs[input.name] ?? 0) - (input.min || 0)) / ((input.max || 100) - (input.min || 0))) * 100}%, rgb(229 231 235) 100%)`
                          }}
                        />
                      </div>
                    ) : (
                      <div className="relative">
                        {input.prefix && (
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium z-10">
                            {input.prefix}
                          </span>
                        )}
                        <Input
                          type={input.type}
                          value={inputs[input.name] ?? ''}
                          onChange={(e) => setInputs(prev => ({ ...prev, [input.name]: input.type === 'number' ? Number(e.target.value) : e.target.value }))}
                          placeholder={input.placeholder || 'Enter value...'}
                          className={`${input.prefix ? 'pl-8' : ''} ${input.type === 'number' ? (input.suffix ? 'pr-20' : 'pr-12') : (input.suffix ? 'pr-12' : '')} focus:ring-2 focus:ring-amber-500`}
                          min={input.type === 'number' ? 0 : undefined}
                          step={input.type === 'number' ? 'any' : undefined}
                        />
                        {input.suffix && (
                          <span className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground font-medium ${input.type === 'number' ? 'right-10' : 'right-3'}`}>
                            {input.suffix}
                          </span>
                        )}
                        {input.type === 'number' ? (
                          <VoiceNumberButton
                            label={input.label}
                            onValueAction={(v) => setInputs(prev => ({ ...prev, [input.name]: v }))}
                            min={typeof input.min === 'number' ? input.min : undefined}
                            max={typeof input.max === 'number' ? input.max : undefined}
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                          />
                        ) : null}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Controls */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={autoCalculate}
                    onChange={(e) => setAutoCalculate(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-sm group-hover:text-amber-600 transition-colors">Auto-calculate</span>
                </label>

                {!autoCalculate && (
                  <button
                    onClick={handleCalculate}
                    disabled={isCalculating}
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isCalculating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Calculator className="w-4 h-4" />}
                    Calculate
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Result Section */}
          <div className="space-y-6">
            {result && (
              <>
                {/* Main Result */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 backdrop-blur-sm p-8 rounded-2xl border-2 border-amber-200 dark:border-amber-800 shadow-xl animate-in fade-in slide-in-from-right-4 duration-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      Result
                    </div>
                    <button
                      onClick={handleCopy}
                      className="p-2 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
                      title="Copy result"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
                    </button>
                  </div>
                  <div className="text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent mb-2">
                    {result.result.toString()}
                  </div>
                  {result.explanation && (
                    <div className="text-sm text-muted-foreground mt-2">{result.explanation}</div>
                  )}
                  {result.formula && (
                    <div className="mt-4 p-3 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                      <div className="text-xs font-medium text-muted-foreground mb-1">Formula</div>
                      <div className="text-sm font-mono text-amber-600 dark:text-amber-400">{result.formula}</div>
                    </div>
                  )}
                </div>

                {/* Steps */}
                {result.steps && result.steps.length > 0 && (
                  <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl animate-in fade-in slide-in-from-right-4 duration-700 delay-100">
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                      <Activity className="w-5 h-5 text-amber-500" />
                      Calculation Steps
                    </h3>
                    <div className="space-y-3">
                      {result.steps.map((step, idx) => (
                        <div key={idx} className="flex gap-3 animate-in fade-in slide-in-from-right-3 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white text-xs flex items-center justify-center font-bold">
                            {idx + 1}
                          </div>
                          <div className="flex-1 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg text-sm">
                            {step}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tips */}
                {result.tips && result.tips.length > 0 && (
                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 backdrop-blur-sm p-6 rounded-2xl border border-yellow-200 dark:border-yellow-800 shadow-xl animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      Business Insights
                    </h3>
                    <ul className="space-y-2">
                      {result.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm animate-in fade-in slide-in-from-right-2 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                          <TrendingUp className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Visual Data */}
                {result.visualData && result.visualData.length > 0 && (
                  <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl animate-in fade-in slide-in-from-right-4 duration-700 delay-300">
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                      <BarChart3 className="w-5 h-5 text-amber-500" />
                      Financial Breakdown
                    </h3>
                    <div className="space-y-3">
                      {result.visualData.map((item, idx) => {
                        const maxVal = Math.max(...result.visualData!.map(d => d.value));
                        const percentage = (item.value / maxVal) * 100;
                        return (
                          <div key={idx} className="animate-in fade-in slide-in-from-left-3 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium">{item.label}</span>
                              <span className="text-amber-600 dark:text-amber-400 font-bold">${item.value.toFixed(2)}</span>
                            </div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}

            {!result && (
              <div className="bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm p-12 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 text-center animate-in fade-in duration-700">
                <theme.icon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-muted-foreground">
                  {autoCalculate ? 'Adjust values to see results' : 'Click Calculate to see results'}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl">
          <SeoContentGenerator 
            title={config.title} 
            description={config.description} 
            categoryName="Business" 
          />
        </div>
      </div>

      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgb(245 158 11), rgb(249 115 22));
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          transition: all 0.2s;
        }
        .slider-thumb::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
        }
        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgb(245 158 11), rgb(249 115 22));
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};
