'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Trash2, Download, ChevronDown, ChevronUp } from 'lucide-react';

interface HistoryItem {
  id: string;
  timestamp: string;
  inputs: Record<string, any>;
  result: Record<string, any>;
}

interface HistoryPanelProps {
  category: string;
  toolId: string;
  maxItems?: number;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ 
  category, 
  toolId,
  maxItems = 10
}) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    loadHistory();
  }, [category, toolId]);

  const loadHistory = () => {
    try {
      const key = `history_${category}_${toolId}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        const items = JSON.parse(stored);
        setHistory(items.slice(0, maxItems));
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all history?')) {
      const key = `history_${category}_${toolId}`;
      localStorage.removeItem(key);
      setHistory([]);
    }
  };

  const deleteItem = (id: string) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    const key = `history_${category}_${toolId}`;
    localStorage.setItem(key, JSON.stringify(updated));
  };

  const exportHistory = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${category}-${toolId}-history.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (history.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Calculation History
          </h3>
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {history.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              exportHistory();
            }}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Export History"
          >
            <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              clearHistory();
            }}
            className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
            title="Clear History"
          >
            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
          </button>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
          {history.map((item, index) => (
            <div 
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(item.timestamp).toLocaleString()}
                </span>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Inputs</p>
                  <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    {Object.entries(item.inputs).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="font-medium">{key}:</span>
                        <span>{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Result</p>
                  <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    {Object.entries(item.result).slice(0, 3).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="font-medium">{key}:</span>
                        <span>{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
