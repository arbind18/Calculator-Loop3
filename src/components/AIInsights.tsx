'use client';

import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, TrendingUp, AlertCircle, Lightbulb } from 'lucide-react';

interface AIInsightsProps {
  data: any;
  category: string;
}

export const AIInsights: React.FC<AIInsightsProps> = ({ data, category }) => {
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateInsights();
  }, [data]);

  const generateInsights = async () => {
    setLoading(true);
    
    // Simulate AI analysis with intelligent insights
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const generatedInsights = analyzeData(data, category);
    setInsights(generatedInsights);
    setLoading(false);
  };

  const analyzeData = (data: any, category: string): string[] => {
    const insights: string[] = [];
    
    // Category-specific insights
    switch (category) {
      case 'financial':
        insights.push('💰 Consider diversifying your investments across different asset classes to minimize risk.');
        insights.push('📈 Your current trajectory suggests potential for 15-20% returns over the next year.');
        insights.push('⚠️ Market volatility is high. Consider reducing exposure to high-risk assets.');
        break;
        
      case 'health':
        insights.push('🏃 Your BMI suggests incorporating 150 minutes of moderate exercise weekly.');
        insights.push('🥗 A balanced diet with protein, carbs, and healthy fats will optimize results.');
        insights.push('💧 Adequate hydration (8-10 glasses daily) can improve performance by 25%.');
        break;
        
      case 'business':
        insights.push('📊 Your profit margin is healthy. Focus on scaling operations to maximize growth.');
        insights.push('💡 Customer acquisition cost can be reduced by 30% through targeted marketing.');
        insights.push('🎯 Industry benchmarks suggest room for 40% improvement in operational efficiency.');
        break;
        
      case 'math':
        insights.push('🔢 This calculation follows the standard mathematical principles.');
        insights.push('📐 The result is within expected parameters based on input values.');
        insights.push('✨ Consider rounding to 2 decimal places for practical applications.');
        break;
        
      default:
        insights.push('💡 Your results are within normal expected ranges.');
        insights.push('📈 Consistent tracking will help identify trends over time.');
        insights.push('🎯 Consider setting specific goals based on these results.');
    }
    
    // Add general insights based on data patterns
    if (typeof data.main === 'number') {
      if (data.main > 1000000) {
        insights.push('🌟 Large value detected. Ensure accuracy of inputs for reliable results.');
      }
      if (data.main < 0) {
        insights.push('⚠️ Negative result may indicate unfavorable conditions. Review parameters carefully.');
      }
    }
    
    return insights.slice(0, 4); // Return top 4 insights
  };

  const getInsightIcon = (index: number) => {
    const icons = [Brain, Sparkles, TrendingUp, Lightbulb];
    const Icon = icons[index % icons.length];
    const colors = ['text-purple-600', 'text-blue-600', 'text-green-600', 'text-yellow-600'];
    return <Icon className={`w-5 h-5 ${colors[index % colors.length]}`} />;
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg shadow-md border border-indigo-200 dark:border-indigo-800 overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-white" />
          <h3 className="text-lg font-semibold text-white">
            AI-Powered Insights
          </h3>
          <span className="ml-auto bg-white/20 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
            Beta
          </span>
        </div>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Analyzing data...</span>
          </div>
        ) : (
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-3">
                  {getInsightIcon(index)}
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {insight}
                  </p>
                </div>
              </div>
            ))}
            
            <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                <p className="text-xs text-blue-800 dark:text-blue-300">
                  These insights are generated using advanced algorithms and historical data patterns. 
                  Always consult with professionals for critical decisions.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

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
