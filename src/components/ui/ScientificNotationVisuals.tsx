'use client';

import React from 'react';

interface ScientificNotationVisualProps {
  mantissa: number;
  exponent: number;
  width?: number;
  height?: number;
  showExplanation?: boolean;
}

export function ScientificNotationVisual({
  mantissa,
  exponent,
  width = 400,
  height = 150,
  showExplanation = true
}: ScientificNotationVisualProps) {
  const isPositiveExponent = exponent >= 0;
  const color = isPositiveExponent ? '#3b82f6' : '#ef4444';
  const direction = isPositiveExponent ? 'right' : 'left';
  const arrowId = React.useId();
  
  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
      <svg width={width} height={height} className="mb-4">
        {/* Mantissa box */}
        <rect
          x={width / 2 - 50}
          y={20}
          width={100}
          height={50}
          fill="white"
          stroke="#9ca3af"
          strokeWidth="2"
          rx="8"
        />
        <text
          x={width / 2}
          y={52}
          textAnchor="middle"
          className="text-2xl font-bold fill-gray-800"
        >
          {mantissa.toFixed(2)}
        </text>
        
        {/* Multiplication symbol */}
        <text
          x={width / 2 + 70}
          y={52}
          textAnchor="middle"
          className="text-xl font-bold fill-gray-600"
        >
          ×
        </text>
        
        {/* Base 10 */}
        <text
          x={width / 2 + 110}
          y={52}
          textAnchor="middle"
          className="text-2xl font-bold fill-gray-800"
        >
          10
        </text>
        
        {/* Exponent */}
        <text
          x={width / 2 + 130}
          y={40}
          textAnchor="middle"
          className="text-lg font-bold"
          fill={color}
        >
          {exponent}
        </text>
        
        {/* Arrow indicating magnitude */}
        {exponent !== 0 && (
          <>
            <line
              x1={width / 2 - 80}
              y1={100}
              x2={direction === 'right' ? width / 2 + 150 : width / 2 - 150}
              y2={100}
              stroke={color}
              strokeWidth="3"
              markerEnd={`url(#${arrowId})`}
            />
            
            {/* Arrow definition */}
            <defs>
              <marker
                id={arrowId}
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill={color} />
              </marker>
            </defs>
            
            <text
              x={width / 2}
              y={130}
              textAnchor="middle"
              className="text-sm font-semibold"
              fill={color}
            >
              {isPositiveExponent ? `Move decimal ${Math.abs(exponent)} places right` : `Move decimal ${Math.abs(exponent)} places left`}
            </text>
          </>
        )}
      </svg>
      
      {showExplanation && (
        <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 w-full">
          <p className="text-sm text-gray-700">
            <strong>{mantissa.toFixed(2)} × 10<sup>{exponent}</sup></strong> means:
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {isPositiveExponent ? (
              <>
                Start with <strong>{mantissa.toFixed(2)}</strong> and move the decimal point{' '}
                <strong className="text-blue-600">{Math.abs(exponent)} places to the right</strong>
              </>
            ) : (
              <>
                Start with <strong>{mantissa.toFixed(2)}</strong> and move the decimal point{' '}
                <strong className="text-red-600">{Math.abs(exponent)} places to the left</strong>
              </>
            )}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Result: <strong className="text-lg">{(mantissa * Math.pow(10, exponent)).toExponential()}</strong>
          </p>
        </div>
      )}
    </div>
  );
}

interface MagnitudeComparisonProps {
  value1: number;
  value2: number;
  label1?: string;
  label2?: string;
  width?: number;
  height?: number;
}

export function MagnitudeComparison({
  value1,
  value2,
  label1 = 'Value 1',
  label2 = 'Value 2',
  width = 400,
  height = 200
}: MagnitudeComparisonProps) {
  const exp1 = value1 === 0 ? 0 : Math.floor(Math.log10(Math.abs(value1)));
  const exp2 = value2 === 0 ? 0 : Math.floor(Math.log10(Math.abs(value2)));
  
  const maxExp = Math.max(exp1, exp2);
  const minExp = Math.min(exp1, exp2);
  const range = maxExp - minExp + 2;
  
  const height1 = ((exp1 - minExp + 1) / range) * (height - 60) + 20;
  const height2 = ((exp2 - minExp + 1) / range) * (height - 60) + 20;
  
  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Order of Magnitude Comparison</h3>
      <svg width={width} height={height}>
        {/* Bar 1 */}
        <rect
          x={80}
          y={height - height1 - 30}
          width={80}
          height={height1}
          fill="#3b82f6"
          rx="4"
          className="transition-all duration-500"
        />
        <text
          x={120}
          y={height - height1 - 35}
          textAnchor="middle"
          className="text-sm font-bold fill-blue-600"
        >
          10<tspan baselineShift="super" fontSize="0.7em">{exp1}</tspan>
        </text>
        <text
          x={120}
          y={height - 10}
          textAnchor="middle"
          className="text-sm font-medium fill-gray-700"
        >
          {label1}
        </text>
        
        {/* Bar 2 */}
        <rect
          x={240}
          y={height - height2 - 30}
          width={80}
          height={height2}
          fill="#10b981"
          rx="4"
          className="transition-all duration-500"
        />
        <text
          x={280}
          y={height - height2 - 35}
          textAnchor="middle"
          className="text-sm font-bold fill-green-600"
        >
          10<tspan baselineShift="super" fontSize="0.7em">{exp2}</tspan>
        </text>
        <text
          x={280}
          y={height - 10}
          textAnchor="middle"
          className="text-sm font-medium fill-gray-700"
        >
          {label2}
        </text>
        
        {/* Baseline */}
        <line
          x1={60}
          y1={height - 30}
          x2={340}
          y2={height - 30}
          stroke="#9ca3af"
          strokeWidth="2"
        />
      </svg>
      
      <div className="mt-4 text-sm text-gray-600 text-center">
        <p>
          {Math.abs(exp1 - exp2) === 0 ? (
            'Both values are in the same order of magnitude'
          ) : (
            <>
              {label1} is <strong>{Math.abs(exp1 - exp2)} orders of magnitude</strong>{' '}
              {exp1 > exp2 ? 'larger' : 'smaller'} than {label2}
            </>
          )}
        </p>
      </div>
    </div>
  );
}

interface DecimalPlacesVisualProps {
  number: number;
  width?: number;
  height?: number;
}

export function DecimalPlacesVisual({
  number,
  width = 500,
  height = 150
}: DecimalPlacesVisualProps) {
  let numStr = number.toString();
  if (numStr.includes('e')) {
    numStr = number.toFixed(20).replace(/\.?0+$/, "");
  }
  const [integerPart, decimalPart] = numStr.split('.');
  const hasDecimal = decimalPart !== undefined;
  
  const totalDigits = integerPart.length + (hasDecimal ? decimalPart.length : 0);
  const digitWidth = Math.min(40, (width - 100) / totalDigits);
  
  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Decimal Place Analysis</h3>
      <svg width={width} height={height}>
        <g>
          {/* Integer part */}
          {integerPart.split('').map((digit, index) => {
            const x = 50 + index * digitWidth;
            const placeValue = integerPart.length - 1 - index;
            
            return (
              <g key={`int-${index}`}>
                <rect
                  x={x}
                  y={40}
                  width={digitWidth - 4}
                  height={40}
                  fill="#dbeafe"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  rx="4"
                />
                <text
                  x={x + digitWidth / 2 - 2}
                  y={65}
                  textAnchor="middle"
                  className="text-xl font-bold fill-blue-700"
                >
                  {digit}
                </text>
                <text
                  x={x + digitWidth / 2 - 2}
                  y={100}
                  textAnchor="middle"
                  className="text-xs fill-gray-600"
                >
                  10<tspan baselineShift="super" fontSize="0.7em">{placeValue}</tspan>
                </text>
              </g>
            );
          })}
          
          {/* Decimal point */}
          {hasDecimal && (
            <>
              <circle
                cx={50 + integerPart.length * digitWidth}
                cy={65}
                r="4"
                fill="#6b7280"
              />
              
              {/* Decimal part */}
              {decimalPart.split('').map((digit, index) => {
                const x = 50 + (integerPart.length + index + 0.5) * digitWidth;
                const placeValue = -(index + 1);
                
                return (
                  <g key={`dec-${index}`}>
                    <rect
                      x={x}
                      y={40}
                      width={digitWidth - 4}
                      height={40}
                      fill="#fef3c7"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      rx="4"
                    />
                    <text
                      x={x + digitWidth / 2 - 2}
                      y={65}
                      textAnchor="middle"
                      className="text-xl font-bold fill-amber-700"
                    >
                      {digit}
                    </text>
                    <text
                      x={x + digitWidth / 2 - 2}
                      y={100}
                      textAnchor="middle"
                      className="text-xs fill-gray-600"
                    >
                      10<tspan baselineShift="super" fontSize="0.7em">{placeValue}</tspan>
                    </text>
                  </g>
                );
              })}
            </>
          )}
        </g>
      </svg>
      
      <div className="mt-4 flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-200 border-2 border-blue-600 rounded"></div>
          <span className="text-gray-700">Integer places</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-amber-100 border-2 border-amber-600 rounded"></div>
          <span className="text-gray-700">Decimal places</span>
        </div>
      </div>
    </div>
  );
}
