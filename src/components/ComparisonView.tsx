'use client';

import React, { useState, useEffect } from 'react';
import { GitCompare, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ComparisonViewProps {
  current: any;
  category: string;
  toolId: string;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ 
  current, 
  category, 
  toolId 
}) => {
  const [previousData, setPreviousData] = useState<any>(null);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    loadPreviousData();
  }, [category, toolId]);

  const loadPreviousData = () => {
    try {
      const key = `last_result_${category}_${toolId}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        setPreviousData(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load previous data:', error);
    }
  };

  const calculateChange = (currentValue: number, previousValue: number) => {
    if (!previousValue || previousValue === 0) return null;
    const change = ((currentValue - previousValue) / previousValue) * 100;
    return change;
  };

  const renderChangeIndicator = (change: number | null) => {
    if (change === null) return <Minus className="w-4 h-4 text-gray-400" />;
    
    if (change > 0) {
      return (
        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">+{change.toFixed(2)}%</span>
        </div>
      );
    } else if (change < 0) {
      return (
        <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
          <TrendingDown className="w-4 h-4" />
          <span className="text-sm font-medium">{change.toFixed(2)}%</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
        <Minus className="w-4 h-4" />
        <span className="text-sm font-medium">No change</span>
      </div>
    );
  };

  if (!previousData) return null;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg shadow-md border border-purple-200 dark:border-purple-800 overflow-hidden">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
        onClick={() => setShowComparison(!showComparison)}
      >
        <div className="flex items-center gap-3">
          <GitCompare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Compare with Previous
          </h3>
        </div>
        <span className="text-sm text-purple-600 dark:text-purple-400 font-medium">
          {showComparison ? 'Hide' : 'Show'} Comparison
        </span>
      </div>

      {showComparison && (
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Previous Result</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {previousData.main || 'N/A'}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Current Result</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {current.main || 'N/A'}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Change</p>
              <div className="flex items-center h-8">
                {renderChangeIndicator(
                  calculateChange(
                    parseFloat(String(current.main).replace(/[^0-9.-]/g, '')),
                    parseFloat(String(previousData.main).replace(/[^0-9.-]/g, ''))
                  )
                )}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              💡 <strong>Insight:</strong> Your results show a{' '}
              {calculateChange(
                parseFloat(String(current.main).replace(/[^0-9.-]/g, '')),
                parseFloat(String(previousData.main).replace(/[^0-9.-]/g, ''))
              ) && calculateChange(
                parseFloat(String(current.main).replace(/[^0-9.-]/g, '')),
                parseFloat(String(previousData.main).replace(/[^0-9.-]/g, ''))
              )! > 0 ? 'positive' : 'negative'} trend compared to your last calculation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
