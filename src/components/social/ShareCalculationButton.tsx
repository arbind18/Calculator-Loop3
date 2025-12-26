'use client';

import { useState } from 'react';
import ShareButton from './ShareButton';
import { useSettings } from '@/components/providers/SettingsProvider';
import { formatCurrency, formatNumber } from '@/lib/localeUtils';

interface CalculationResult {
  [key: string]: string | number | boolean | null | undefined;
}

interface ShareCalculationButtonProps {
  calculatorName: string;
  calculatorUrl?: string;
  results: CalculationResult;
  inputs?: CalculationResult;
  customMessage?: string;
  hashtags?: string[];
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
}

export default function ShareCalculationButton({
  calculatorName,
  calculatorUrl,
  results,
  inputs,
  customMessage,
  hashtags = ['Calculator', 'Finance', 'Planning'],
  size = 'default',
  variant = 'outline',
  className = '',
}: ShareCalculationButtonProps) {
  const { language } = useSettings();

  const formatValue = (key: string, value: any): string => {
    if (typeof value === 'number') {
      // Check if it's a currency value (contains amount, emi, payment, etc.)
      if (
        key.toLowerCase().includes('amount') ||
        key.toLowerCase().includes('emi') ||
        key.toLowerCase().includes('payment') ||
        key.toLowerCase().includes('price') ||
        key.toLowerCase().includes('cost') ||
        key.toLowerCase().includes('total') ||
        key.toLowerCase().includes('interest')
      ) {
        return formatCurrency(value, language);
      }
      
      // Check if it's a percentage
      if (key.toLowerCase().includes('rate') || key.toLowerCase().includes('percent')) {
        return `${formatNumber(value, language, 2)}%`;
      }
      
      // Default number formatting
      return formatNumber(value, language, 2);
    }
    
    return String(value);
  };

  const generateShareText = (): string => {
    const lines: string[] = [];
    
    // Title
    lines.push(`📊 ${calculatorName}`);
    lines.push('');
    
    // Custom message
    if (customMessage) {
      lines.push(customMessage);
      lines.push('');
    }
    
    // Key results
    if (results && Object.keys(results).length > 0) {
      lines.push('✨ Results:');
      Object.entries(results).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          const label = key
            .replace(/([A-Z])/g, ' $1')
            .replace(/_/g, ' ')
            .trim()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          lines.push(`${label}: ${formatValue(key, value)}`);
        }
      });
      lines.push('');
    }
    
    // Call to action
    lines.push('💡 Calculate yours now!');
    
    return lines.join('\n');
  };

  const shareUrl = calculatorUrl || (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = generateShareText();

  return (
    <ShareButton
      title={`${calculatorName} - Results`}
      text={shareText}
      url={shareUrl}
      hashtags={hashtags}
      size={size}
      variant={variant}
      className={className}
    />
  );
}
