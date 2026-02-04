'use client';

import React from 'react';

interface FractionBarProps {
  numerator: number;
  denominator: number;
  color?: string;
  width?: number;
  height?: number;
  showLabel?: boolean;
}

export function FractionBar({
  numerator,
  denominator,
  color = '#8b5cf6',
  width = 300,
  height = 60,
  showLabel = true
}: FractionBarProps) {
  const percentage = Math.min(100, Math.max(0, (numerator / denominator) * 100));
  const filledWidth = (percentage / 100) * (width - 4);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width, height }}>
        {/* Background bar */}
        <div 
          className="absolute inset-0 bg-gray-200 rounded-lg border-2 border-gray-300"
        />
        
        {/* Filled portion */}
        <div
          className="absolute top-0.5 left-0.5 rounded-l-md transition-all duration-500 ease-out"
          style={{
            width: filledWidth,
            height: height - 4,
            backgroundColor: color
          }}
        />
        
        {/* Fraction label in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-800 drop-shadow-sm">
            {numerator}/{denominator}
          </span>
        </div>
      </div>
      
      {showLabel && (
        <p className="text-sm text-gray-600 mt-2">
          {percentage.toFixed(1)}% filled
        </p>
      )}
    </div>
  );
}

interface SegmentedFractionBarProps {
  numerator: number;
  denominator: number;
  color?: string;
  emptyColor?: string;
  width?: number;
  height?: number;
  showLabel?: boolean;
}

export function SegmentedFractionBar({
  numerator,
  denominator,
  color = '#3b82f6',
  emptyColor = '#e5e7eb',
  width = 400,
  height = 60,
  showLabel = true
}: SegmentedFractionBarProps) {
  const segmentWidth = (width - (denominator + 1) * 4) / denominator;
  
  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-1" style={{ width, height }}>
        {Array.from({ length: denominator }).map((_, index) => (
          <div
            key={index}
            className="rounded transition-all duration-300"
            style={{
              width: segmentWidth,
              height: '100%',
              backgroundColor: index < numerator ? color : emptyColor,
              border: `2px solid ${index < numerator ? color : '#d1d5db'}`
            }}
          />
        ))}
      </div>
      
      {showLabel && (
        <p className="text-sm text-gray-600 mt-2 font-medium">
          {numerator} of {denominator} parts filled
        </p>
      )}
    </div>
  );
}

interface FractionGridProps {
  numerator: number;
  denominator: number;
  color?: string;
  emptyColor?: string;
  size?: number;
  showLabel?: boolean;
}

export function FractionGrid({
  numerator,
  denominator,
  color = '#10b981',
  emptyColor = '#e5e7eb',
  size = 200,
  showLabel = true
}: FractionGridProps) {
  // Determine grid dimensions (try to make it as square as possible)
  const cols = Math.ceil(Math.sqrt(denominator));
  const rows = Math.ceil(denominator / cols);
  const cellSize = (size - (cols + 1) * 4) / cols;

  return (
    <div className="flex flex-col items-center">
      <div 
        className="grid gap-1 p-2 bg-gray-100 rounded-lg"
        style={{ 
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          width: size,
          height: size * (rows / cols)
        }}
      >
        {Array.from({ length: denominator }).map((_, index) => (
          <div
            key={index}
            className="rounded transition-all duration-300"
            style={{
              width: cellSize,
              height: cellSize,
              backgroundColor: index < numerator ? color : emptyColor,
              border: `2px solid ${index < numerator ? color : '#d1d5db'}`
            }}
          />
        ))}
      </div>
      
      {showLabel && (
        <p className="text-sm text-gray-600 mt-3 font-medium">
          {numerator}/{denominator} = {((numerator / denominator) * 100).toFixed(1)}%
        </p>
      )}
    </div>
  );
}

interface FractionCircleProps {
  numerator: number;
  denominator: number;
  color?: string;
  emptyColor?: string;
  size?: number;
  showLabel?: boolean;
}

export function FractionCircle({
  numerator,
  denominator,
  color = '#f59e0b',
  emptyColor = '#fef3c7',
  size = 200,
  showLabel = true
}: FractionCircleProps) {
  const radius = size / 2 - 10;
  const centerX = size / 2;
  const centerY = size / 2;
  const anglePerSegment = (2 * Math.PI) / denominator;

  const createSlicePath = (index: number): string => {
    const startAngle = index * anglePerSegment - Math.PI / 2;
    const endAngle = (index + 1) * anglePerSegment - Math.PI / 2;
    
    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);

    const largeArcFlag = anglePerSegment > Math.PI ? 1 : 0;

    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill={emptyColor}
          stroke="#d1d5db"
          strokeWidth="2"
        />
        
        {/* Filled slices */}
        {Array.from({ length: numerator }).map((_, index) => (
          <path
            key={index}
            d={createSlicePath(index)}
            fill={color}
            stroke="white"
            strokeWidth="2"
            className="transition-all duration-300"
          />
        ))}
        
        {/* Division lines */}
        {Array.from({ length: denominator }).map((_, index) => {
          const angle = index * anglePerSegment - Math.PI / 2;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          
          return (
            <line
              key={`line-${index}`}
              x1={centerX}
              y1={centerY}
              x2={x}
              y2={y}
              stroke="#9ca3af"
              strokeWidth="1"
            />
          );
        })}
        
        {/* Center label */}
        <text
          x={centerX}
          y={centerY}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xl font-bold fill-gray-800"
        >
          {numerator}/{denominator}
        </text>
      </svg>
      
      {showLabel && (
        <p className="text-sm text-gray-600 mt-2 font-medium">
          {((numerator / denominator) * 100).toFixed(1)}% of the whole
        </p>
      )}
    </div>
  );
}
