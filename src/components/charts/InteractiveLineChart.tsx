"use client"

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts'
import { useState } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface DataPoint {
  name: string
  [key: string]: number | string
}

interface LineConfig {
  dataKey: string
  name: string
  color: string
  strokeWidth?: number
}

interface InteractiveLineChartProps {
  data: DataPoint[]
  lines: LineConfig[]
  title?: string
  xAxisLabel?: string
  yAxisLabel?: string
  showArea?: boolean
  showGrid?: boolean
  showTrend?: boolean
  height?: number
  formatYAxis?: (value: number) => string
  formatTooltip?: (value: number) => string
}

export function InteractiveLineChart({
  data,
  lines,
  title,
  xAxisLabel,
  yAxisLabel,
  showArea = false,
  showGrid = true,
  showTrend = false,
  height = 300,
  formatYAxis = (value) => value.toLocaleString('en-IN'),
  formatTooltip = (value) => `₹${value.toLocaleString('en-IN')}`
}: InteractiveLineChartProps) {
  const [hiddenLines, setHiddenLines] = useState<Set<string>>(new Set())

  const toggleLine = (dataKey: string) => {
    setHiddenLines(prev => {
      const newSet = new Set(prev)
      if (newSet.has(dataKey)) {
        newSet.delete(dataKey)
      } else {
        newSet.add(dataKey)
      }
      return newSet
    })
  }

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
              className="w-3 h-3 rounded-full"
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

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap gap-4 justify-center mt-4">
        {payload.map((entry: any, index: number) => {
          const isHidden = hiddenLines.has(entry.dataKey)
          return (
            <button
              key={index}
              onClick={() => toggleLine(entry.dataKey)}
              className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all ${
                isHidden
                  ? 'opacity-40 bg-gray-100 dark:bg-gray-800'
                  : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {entry.value}
              </span>
            </button>
          )
        })}
      </div>
    )
  }

  // Calculate trend
  const calculateTrend = (dataKey: string) => {
    if (data.length < 2) return null
    const firstValue = data[0][dataKey] as number
    const lastValue = data[data.length - 1][dataKey] as number
    const change = ((lastValue - firstValue) / firstValue) * 100
    return { change, isPositive: change >= 0 }
  }

  const ChartComponent = showArea ? AreaChart : LineChart

  return (
    <div>
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
          {showTrend && lines.map(line => {
            const trend = calculateTrend(line.dataKey)
            if (!trend) return null
            return (
              <div key={line.dataKey} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: line.color }}
                />
                <span>{line.name}:</span>
                <span className={`flex items-center gap-1 font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trend.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {Math.abs(trend.change).toFixed(1)}%
                </span>
              </div>
            )
          })}
        </div>
      )}

      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
          )}
          <XAxis
            dataKey="name"
            stroke="#9ca3af"
            tick={{ fill: '#6b7280' }}
            label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5 } : undefined}
          />
          <YAxis
            stroke="#9ca3af"
            tick={{ fill: '#6b7280' }}
            tickFormatter={formatYAxis}
            label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
          
          {lines.map((line) => {
            if (hiddenLines.has(line.dataKey)) return null
            
            if (showArea) {
              return (
                <Area
                  key={line.dataKey}
                  type="monotone"
                  dataKey={line.dataKey}
                  name={line.name}
                  stroke={line.color}
                  fill={line.color}
                  fillOpacity={0.2}
                  strokeWidth={line.strokeWidth || 2}
                  animationDuration={1000}
                  dot={{ fill: line.color, r: 4 }}
                  activeDot={{ r: 6, fill: line.color }}
                />
              )
            }
            
            return (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                name={line.name}
                stroke={line.color}
                strokeWidth={line.strokeWidth || 2}
                animationDuration={1000}
                dot={{ fill: line.color, r: 4 }}
                activeDot={{ r: 6, fill: line.color }}
              />
            )
          })}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  )
}
