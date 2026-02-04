'use client';

import React from 'react';

interface PercentagePieChartProps {
  percentage: number;
  label?: string;
  size?: number;
  showLabel?: boolean;
  color?: string;
}

export function PercentagePieChart({
  percentage,
  label = 'Percentage',
  size = 200,
  showLabel = true,
  color = '#3b82f6'
}: PercentagePieChartProps) {
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedPercentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="20"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="20"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
        {/* Center text */}
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          className="transform rotate-90 text-2xl font-bold fill-gray-800"
          style={{ fontSize: size / 6 }}
        >
          {clampedPercentage.toFixed(1)}%
        </text>
      </svg>
      {showLabel && (
        <p className="text-sm text-gray-600 mt-2 font-medium">{label}</p>
      )}
    </div>
  );
}

interface FractionPieChartProps {
  numerator: number;
  denominator: number;
  size?: number;
  showLabel?: boolean;
  color?: string;
}

export function FractionPieChart({
  numerator,
  denominator,
  size = 200,
  showLabel = true,
  color = '#8b5cf6'
}: FractionPieChartProps) {
  const percentage = (numerator / denominator) * 100;
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedPercentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="20"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="20"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
        {/* Center text */}
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          className="transform rotate-90 font-bold fill-gray-800"
          style={{ fontSize: size / 8 }}
        >
          {numerator}/{denominator}
        </text>
      </svg>
      {showLabel && (
        <p className="text-sm text-gray-600 mt-2 font-medium">
          {percentage.toFixed(1)}% of whole
        </p>
      )}
    </div>
  );
}

interface ComparisonPieChartProps {
  value1: number;
  value2: number;
  label1?: string;
  label2?: string;
  size?: number;
  color1?: string;
  color2?: string;
}

export function ComparisonPieChart({
  value1,
  value2,
  label1 = 'Value 1',
  label2 = 'Value 2',
  size = 200,
  color1 = '#3b82f6',
  color2 = '#10b981'
}: ComparisonPieChartProps) {
  const total = value1 + value2;
  const percentage1 = (value1 / total) * 100;
  const percentage2 = (value2 / total) * 100;

  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  
  const offset1 = 0;
  const offset2 = (percentage1 / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* First segment */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color1}
          strokeWidth="20"
          strokeDasharray={`${(percentage1 / 100) * circumference} ${circumference}`}
          strokeDashoffset={0}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
        {/* Second segment */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color2}
          strokeWidth="20"
          strokeDasharray={`${(percentage2 / 100) * circumference} ${circumference}`}
          strokeDashoffset={-offset2}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="flex gap-4 mt-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color1 }} />
          <span className="text-sm text-gray-600">{label1}: {percentage1.toFixed(1)}%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color2 }} />
          <span className="text-sm text-gray-600">{label2}: {percentage2.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}
