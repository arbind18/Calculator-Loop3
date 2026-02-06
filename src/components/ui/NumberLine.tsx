'use client';

import * as React from 'react';

interface NumberLineProps {
  value: number;
  min?: number;
  max?: number;
  showTicks?: boolean;
  label?: string;
  color?: string;
  width?: number;
  height?: number;
}

export function NumberLine({
  value,
  min = 0,
  max = 100,
  showTicks = true,
  label,
  color = '#3b82f6',
  width = 400,
  height = 80
}: NumberLineProps) {
  const range = max - min;
  const position = ((value - min) / range) * (width - 40) + 20;

  // Generate tick marks
  const ticks = showTicks ? Array.from({ length: 11 }, (_, i) => {
    const tickValue = min + (range * i / 10);
    const tickPosition = ((tickValue - min) / range) * (width - 40) + 20;
    return { value: tickValue, position: tickPosition };
  }) : [];

  return (
    <div className="flex flex-col items-center">
      <svg width={width} height={height} className="overflow-visible">
        {/* Main line */}
        <line
          x1={20}
          y1={height / 2}
          x2={width - 20}
          y2={height / 2}
          stroke="#d1d5db"
          strokeWidth="3"
        />

        {/* Tick marks */}
        {ticks.map((tick, index) => (
          <g key={index}>
            <line
              x1={tick.position}
              y1={height / 2 - 8}
              x2={tick.position}
              y2={height / 2 + 8}
              stroke="#9ca3af"
              strokeWidth="2"
            />
            <text
              x={tick.position}
              y={height / 2 + 25}
              textAnchor="middle"
              className="text-xs fill-gray-500"
            >
              {tick.value.toFixed(0)}
            </text>
          </g>
        ))}

        {/* Value marker */}
        <g className="transition-transform duration-300" style={{ transform: `translateX(${position - 20}px)` }}>
          <circle
            cx={20}
            cy={height / 2}
            r="8"
            fill={color}
            className="drop-shadow-lg"
          />
          <line
            x1={20}
            y1={height / 2 - 15}
            x2={20}
            y2={height / 2 - 25}
            stroke={color}
            strokeWidth="2"
          />
          <text
            x={20}
            y={height / 2 - 30}
            textAnchor="middle"
            className="text-sm font-bold"
            fill={color}
          >
            {value.toFixed(2)}
          </text>
        </g>
      </svg>
      {label && (
        <p className="text-sm text-gray-600 mt-2 font-medium">{label}</p>
      )}
    </div>
  );
}

interface ComparisonNumberLineProps {
  value1: number;
  value2: number;
  label1?: string;
  label2?: string;
  min?: number;
  max?: number;
  color1?: string;
  color2?: string;
  width?: number;
  height?: number;
}

export function ComparisonNumberLine({
  value1,
  value2,
  label1 = 'Value 1',
  label2 = 'Value 2',
  min = 0,
  max = 100,
  color1 = '#3b82f6',
  color2 = '#10b981',
  width = 400,
  height = 100
}: ComparisonNumberLineProps) {
  const range = max - min;
  const position1 = ((value1 - min) / range) * (width - 40) + 20;
  const position2 = ((value2 - min) / range) * (width - 40) + 20;

  return (
    <div className="flex flex-col items-center">
      <svg width={width} height={height} className="overflow-visible">
        {/* Main line */}
        <line
          x1={20}
          y1={height / 2}
          x2={width - 20}
          y2={height / 2}
          stroke="#d1d5db"
          strokeWidth="3"
        />

        {/* Start and end markers */}
        <text x={20} y={height / 2 + 20} textAnchor="middle" className="text-xs fill-gray-500">
          {min}
        </text>
        <text x={width - 20} y={height / 2 + 20} textAnchor="middle" className="text-xs fill-gray-500">
          {max}
        </text>

        {/* Value 1 marker */}
        <g className="transition-transform duration-300" style={{ transform: `translateX(${position1 - 20}px)` }}>
          <circle cx={20} cy={height / 2 - 10} r="6" fill={color1} className="drop-shadow-lg" />
          <line x1={20} y1={height / 2 - 16} x2={20} y2={height / 2 - 26} stroke={color1} strokeWidth="2" />
          <text x={20} y={height / 2 - 30} textAnchor="middle" className="text-xs font-bold" fill={color1}>
            {value1.toFixed(2)}
          </text>
        </g>

        {/* Value 2 marker */}
        <g className="transition-transform duration-300" style={{ transform: `translateX(${position2 - 20}px)` }}>
          <circle cx={20} cy={height / 2 + 10} r="6" fill={color2} className="drop-shadow-lg" />
          <line x1={20} y1={height / 2 + 16} x2={20} y2={height / 2 + 26} stroke={color2} strokeWidth="2" />
          <text x={20} y={height / 2 + 40} textAnchor="middle" className="text-xs font-bold" fill={color2}>
            {value2.toFixed(2)}
          </text>
        </g>
      </svg>

      <div className="flex gap-4 mt-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color1 }} />
          <span className="text-sm text-gray-600">{label1}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color2 }} />
          <span className="text-sm text-gray-600">{label2}</span>
        </div>
      </div>
    </div>
  );
}

interface RangeNumberLineProps {
  startValue: number;
  endValue: number;
  label?: string;
  min?: number;
  max?: number;
  color?: string;
  width?: number;
  height?: number;
}

export function RangeNumberLine({
  startValue,
  endValue,
  label = 'Range',
  min = 0,
  max = 100,
  color = '#8b5cf6',
  width = 400,
  height = 80
}: RangeNumberLineProps) {
  const range = max - min;
  const position1 = ((startValue - min) / range) * (width - 40) + 20;
  const position2 = ((endValue - min) / range) * (width - 40) + 20;
  const rangeWidth = Math.abs(position2 - position1);
  const rangeStart = Math.min(position1, position2);

  return (
    <div className="flex flex-col items-center">
      <svg width={width} height={height} className="overflow-visible">
        {/* Main line */}
        <line
          x1={20}
          y1={height / 2}
          x2={width - 20}
          y2={height / 2}
          stroke="#d1d5db"
          strokeWidth="3"
        />

        {/* Range highlight */}
        <line
          x1={rangeStart}
          y1={height / 2}
          x2={rangeStart + rangeWidth}
          y2={height / 2}
          stroke={color}
          strokeWidth="6"
          className="transition-all duration-300"
        />

        {/* Start marker */}
        <circle cx={position1} cy={height / 2} r="6" fill={color} className="drop-shadow-lg" />
        <text
          x={position1}
          y={height / 2 - 15}
          textAnchor="middle"
          className="text-xs font-bold"
          fill={color}
        >
          {startValue.toFixed(1)}
        </text>

        {/* End marker */}
        <circle cx={position2} cy={height / 2} r="6" fill={color} className="drop-shadow-lg" />
        <text
          x={position2}
          y={height / 2 + 25}
          textAnchor="middle"
          className="text-xs font-bold"
          fill={color}
        >
          {endValue.toFixed(1)}
        </text>

        {/* Range label */}
        <text
          x={(position1 + position2) / 2}
          y={height / 2 - 25}
          textAnchor="middle"
          className="text-sm font-semibold fill-gray-700"
        >
          Δ = {Math.abs(endValue - startValue).toFixed(2)}
        </text>
      </svg>
      {label && (
        <p className="text-sm text-gray-600 mt-2 font-medium">{label}</p>
      )}
    </div>
  );
}
