"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts'
import { useState } from 'react'

interface DataPoint {
  name: string
  [key: string]: number | string
}

interface BarConfig {
  dataKey: string
  name: string
  color: string
}

interface InteractiveBarChartProps {
  data: DataPoint[]
  bars: BarConfig[]
  title?: string
  xAxisLabel?: string
  yAxisLabel?: string
  stacked?: boolean
  horizontal?: boolean
  showGrid?: boolean
  height?: number
  formatYAxis?: (value: number) => string
  formatTooltip?: (value: number) => string
}

export function InteractiveBarChart({
  data,
  bars,
  title,
  xAxisLabel,
  yAxisLabel,
  stacked = false,
  horizontal = false,
  showGrid = true,
  height = 300,
  formatYAxis = (value) => value.toLocaleString('en-IN'),
  formatTooltip = (value) => `₹${value.toLocaleString('en-IN')}`
}: InteractiveBarChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null

    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
        <p className="font-semibold text-gray-900 dark:text-white mb-2">
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600 dark:text-gray-400">
              {entry.name}:
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {formatTooltip(entry.value)}
            </span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
      )}

      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout={horizontal ? 'vertical' : 'horizontal'}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          onMouseMove={(state: any) => {
            if (state.activeTooltipIndex !== undefined) {
              setActiveIndex(state.activeTooltipIndex)
            }
          }}
          onMouseLeave={() => setActiveIndex(null)}
        >
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
          )}
          
          {horizontal ? (
            <>
              <XAxis type="number" stroke="#9ca3af" tick={{ fill: '#6b7280' }} tickFormatter={formatYAxis} />
              <YAxis dataKey="name" type="category" stroke="#9ca3af" tick={{ fill: '#6b7280' }} />
            </>
          ) : (
            <>
              <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: '#6b7280' }} />
              <YAxis stroke="#9ca3af" tick={{ fill: '#6b7280' }} tickFormatter={formatYAxis} />
            </>
          )}
          
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {bars.map((bar, barIndex) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              name={bar.name}
              fill={bar.color}
              stackId={stacked ? 'stack' : undefined}
              animationDuration={1000}
              radius={[8, 8, 0, 0]}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={bar.color}
                  opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                  style={{
                    filter: activeIndex === index ? 'brightness(1.1)' : 'none',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
