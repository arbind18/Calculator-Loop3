"use client"

import { useState } from 'react'
import { InteractivePieChart } from './InteractivePieChart'
import { InteractiveLineChart } from './InteractiveLineChart'
import { InteractiveBarChart } from './InteractiveBarChart'
import { ChartExportButton } from './ChartExportButton'
import { Card } from '@/components/ui/card'

// Example usage component showcasing all chart types
export function ChartShowcase() {
  // Pie Chart Data
  const pieData = [
    { name: 'Principal', value: 3000000, color: '#8b5cf6' },
    { name: 'Interest', value: 2150000, color: '#ec4899' },
  ]

  // Line Chart Data
  const lineData = [
    { name: 'Year 1', principal: 3000000, interest: 240000, total: 3240000 },
    { name: 'Year 5', principal: 2500000, interest: 1050000, total: 3550000 },
    { name: 'Year 10', principal: 1800000, interest: 1720000, total: 3520000 },
    { name: 'Year 15', principal: 950000, interest: 2100000, total: 3050000 },
    { name: 'Year 20', principal: 0, interest: 2150000, total: 2150000 },
  ]

  const lineConfig = [
    { dataKey: 'principal', name: 'Principal', color: '#8b5cf6', strokeWidth: 3 },
    { dataKey: 'interest', name: 'Interest', color: '#ec4899', strokeWidth: 3 },
  ]

  // Bar Chart Data
  const barData = [
    { name: 'Jan', emi: 35000, prepayment: 0 },
    { name: 'Feb', emi: 35000, prepayment: 0 },
    { name: 'Mar', emi: 35000, prepayment: 50000 },
    { name: 'Apr', emi: 35000, prepayment: 0 },
    { name: 'May', emi: 35000, prepayment: 0 },
    { name: 'Jun', emi: 35000, prepayment: 100000 },
  ]

  const barConfig = [
    { dataKey: 'emi', name: 'Regular EMI', color: '#8b5cf6' },
    { dataKey: 'prepayment', name: 'Prepayment', color: '#10b981' },
  ]

  return (
    <div className="space-y-8">
      {/* Pie Chart Example */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Loan Breakdown</h2>
          <ChartExportButton chartId="pie-chart-example" filename="loan-breakdown" />
        </div>
        <div id="pie-chart-example">
          <InteractivePieChart
            data={pieData}
            title="Principal vs Interest"
            innerRadius={70}
            outerRadius={120}
            showLegend={true}
            showValues={true}
          />
        </div>
      </Card>

      {/* Line Chart Example */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Loan Progress Over Time</h2>
          <ChartExportButton chartId="line-chart-example" filename="loan-progress" />
        </div>
        <div id="line-chart-example">
          <InteractiveLineChart
            data={lineData}
            lines={lineConfig}
            title="Principal & Interest Trend"
            xAxisLabel="Years"
            yAxisLabel="Amount (₹)"
            showArea={true}
            showGrid={true}
            showTrend={true}
            height={350}
          />
        </div>
      </Card>

      {/* Bar Chart Example */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Monthly Payments</h2>
          <ChartExportButton chartId="bar-chart-example" filename="monthly-payments" />
        </div>
        <div id="bar-chart-example">
          <InteractiveBarChart
            data={barData}
            bars={barConfig}
            title="EMI & Prepayments"
            xAxisLabel="Month"
            yAxisLabel="Amount (₹)"
            stacked={true}
            showGrid={true}
            height={350}
          />
        </div>
      </Card>
    </div>
  )
}
