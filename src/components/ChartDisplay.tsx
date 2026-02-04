'use client';

import React from 'react';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartDisplayProps {
  data: any;
  type?: 'line' | 'bar' | 'pie' | 'doughnut';
  title?: string;
  height?: number;
}

export const ChartDisplay: React.FC<ChartDisplayProps> = ({ 
  data, 
  type = 'line',
  title = 'Data Visualization',
  height = 300
}) => {
  const normalizedData = React.useMemo(() => {
    if (!data) return null;
    if (Array.isArray(data)) {
      if (data.length === 0) return null;
      const labels = data.map((item: any, index: number) =>
        item.name ?? item.label ?? item.category ?? `Item ${index + 1}`
      );
      const values = data.map((item: any) => {
        const value = item.value ?? item.current ?? 0;
        return typeof value === 'number' ? value : Number(value) || 0;
      });
      const colors = data.map((item: any) => item.fill ?? item.color ?? 'rgba(59, 130, 246, 0.5)');
      return {
        labels,
        datasets: [
          {
            label: title,
            data: values,
            backgroundColor: colors,
            borderColor: colors,
            borderWidth: 2,
            fill: type === 'line'
          }
        ]
      };
    }

    return data;
  }, [data, title, type]);

  if (!normalizedData) return null;

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 12,
            family: 'Inter, sans-serif'
          },
          color: '#374151'
        }
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          family: 'Inter, sans-serif',
          weight: 'bold'
        },
        color: '#1f2937'
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          family: 'Inter, sans-serif'
        },
        bodyFont: {
          size: 13,
          family: 'Inter, sans-serif'
        },
        cornerRadius: 8
      }
    },
    scales: type === 'line' || type === 'bar' ? {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter, sans-serif'
          },
          color: '#6b7280'
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter, sans-serif'
          },
          color: '#6b7280'
        }
      }
    } : undefined
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <Bar data={normalizedData} options={chartOptions} height={height} />;
      case 'pie':
        return <Pie data={normalizedData} options={chartOptions} height={height} />;
      case 'doughnut':
        return <Doughnut data={normalizedData} options={chartOptions} height={height} />;
      case 'line':
      default:
        return <Line data={normalizedData} options={chartOptions} height={height} />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="relative" style={{ height: `${height}px` }}>
        {renderChart()}
      </div>
      <div className="mt-4 flex gap-2 justify-center flex-wrap">
        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
          📊 Interactive Chart
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
          🔄 Real-time Updates
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
          💾 Exportable
        </span>
      </div>
    </div>
  );
};
