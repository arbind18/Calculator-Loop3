'use client';

import React from 'react';
import { ChartDisplay } from './ChartDisplay';
import { ExportButton } from './ExportButton';
import { HistoryPanel } from './HistoryPanel';
import { ComparisonView } from './ComparisonView';
import { AIInsights } from './AIInsights';

interface AdvancedCalculatorFeaturesProps {
  result: any;
  category: string;
  toolId: string;
  chartType?: 'line' | 'bar' | 'pie' | 'doughnut';
  showChart?: boolean;
  showExport?: boolean;
  showComparison?: boolean;
  showInsights?: boolean;
  showHistory?: boolean;
}

/**
 * Advanced Calculator Features Wrapper
 * 
 * Easily add advanced features to any calculator by wrapping your results:
 * 
 * @example
 * ```tsx
 * <AdvancedCalculatorFeatures 
 *   result={result}
 *   category="health"
 *   toolId="bmi-calculator"
 *   chartType="bar"
 * />
 * ```
 */
export const AdvancedCalculatorFeatures: React.FC<AdvancedCalculatorFeaturesProps> = ({ 
  result, 
  category, 
  toolId,
  chartType = 'bar',
  showChart = true,
  showExport = true,
  showComparison = true,
  showInsights = true,
  showHistory = true
}) => {
  if (!result) return null;

  return (
    <div className="mt-8 space-y-6 calculator-result">
      {/* Premium Badge */}
      <div className="flex items-center gap-2 justify-center">
        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Advanced Features Enabled
        </span>
      </div>

      {/* Interactive Chart */}
      {showChart && result.chartData && (
        <div className="animate-fadeIn">
          <ChartDisplay 
            data={result.chartData} 
            type={chartType}
            title="Visual Analysis"
            height={300}
          />
        </div>
      )}

      {/* Export Options */}
      {showExport && (
        <div className="flex justify-center animate-fadeIn" style={{ animationDelay: '100ms' }}>
          <ExportButton 
            data={result}
            formats={['PDF', 'CSV', 'Excel', 'Image']}
            filename={`${toolId}-result`}
          />
        </div>
      )}

      {/* Comparison with Previous */}
      {showComparison && (
        <div className="animate-fadeIn" style={{ animationDelay: '200ms' }}>
          <ComparisonView 
            current={result}
            category={category}
            toolId={toolId}
          />
        </div>
      )}

      {/* AI Insights */}
      {showInsights && (
        <div className="animate-fadeIn" style={{ animationDelay: '300ms' }}>
          <AIInsights 
            data={result}
            category={category}
          />
        </div>
      )}

      {/* History Panel */}
      {showHistory && (
        <div className="animate-fadeIn" style={{ animationDelay: '400ms' }}>
          <HistoryPanel 
            category={category}
            toolId={toolId}
            maxItems={10}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AdvancedCalculatorFeatures;
