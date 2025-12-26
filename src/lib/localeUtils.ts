// Locale-specific utilities for number, currency, and date formatting

export interface LocaleConfig {
  code: string;
  currencySymbol: string;
  currencyPosition: 'before' | 'after';
  numberFormat: 'indian' | 'western';
  dateFormat: string;
  decimalSeparator: string;
  thousandsSeparator: string;
}

export const localeConfigs: Record<string, LocaleConfig> = {
  en: {
    code: 'en-IN',
    currencySymbol: '₹',
    currencyPosition: 'before',
    numberFormat: 'indian',
    dateFormat: 'DD/MM/YYYY',
    decimalSeparator: '.',
    thousandsSeparator: ',',
  },
  hi: {
    code: 'hi-IN',
    currencySymbol: '₹',
    currencyPosition: 'before',
    numberFormat: 'indian',
    dateFormat: 'DD/MM/YYYY',
    decimalSeparator: '.',
    thousandsSeparator: ',',
  },
  ta: {
    code: 'ta-IN',
    currencySymbol: '₹',
    currencyPosition: 'before',
    numberFormat: 'indian',
    dateFormat: 'DD/MM/YYYY',
    decimalSeparator: '.',
    thousandsSeparator: ',',
  },
  te: {
    code: 'te-IN',
    currencySymbol: '₹',
    currencyPosition: 'before',
    numberFormat: 'indian',
    dateFormat: 'DD/MM/YYYY',
    decimalSeparator: '.',
    thousandsSeparator: ',',
  },
  bn: {
    code: 'bn-IN',
    currencySymbol: '₹',
    currencyPosition: 'before',
    numberFormat: 'indian',
    dateFormat: 'DD/MM/YYYY',
    decimalSeparator: '.',
    thousandsSeparator: ',',
  },
  mr: {
    code: 'mr-IN',
    currencySymbol: '₹',
    currencyPosition: 'before',
    numberFormat: 'indian',
    dateFormat: 'DD/MM/YYYY',
    decimalSeparator: '.',
    thousandsSeparator: ',',
  },
  gu: {
    code: 'gu-IN',
    currencySymbol: '₹',
    currencyPosition: 'before',
    numberFormat: 'indian',
    dateFormat: 'DD/MM/YYYY',
    decimalSeparator: '.',
    thousandsSeparator: ',',
  },
};

/**
 * Format a number according to Indian or Western notation
 * Indian: 1,00,000 (lakhs and crores)
 * Western: 100,000
 */
export function formatNumber(
  value: number,
  locale: string = 'en',
  decimals: number = 0
): string {
  const config = localeConfigs[locale] || localeConfigs.en;
  
  if (config.numberFormat === 'indian') {
    return formatIndianNumber(value, decimals);
  }
  
  return value.toLocaleString(config.code, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format number in Indian numbering system (lakhs and crores)
 */
function formatIndianNumber(value: number, decimals: number = 0): string {
  const parts = value.toFixed(decimals).split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1];
  
  // Handle negative numbers
  const isNegative = integerPart.startsWith('-');
  if (isNegative) {
    integerPart = integerPart.substring(1);
  }
  
  // Add commas in Indian format
  let lastThree = integerPart.substring(integerPart.length - 3);
  const otherNumbers = integerPart.substring(0, integerPart.length - 3);
  
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  
  return (
    (isNegative ? '-' : '') +
    formatted +
    (decimalPart ? '.' + decimalPart : '')
  );
}

/**
 * Format currency with symbol and locale-specific formatting
 */
export function formatCurrency(
  value: number,
  locale: string = 'en',
  decimals: number = 0
): string {
  const config = localeConfigs[locale] || localeConfigs.en;
  const formattedNumber = formatNumber(value, locale, decimals);
  
  if (config.currencyPosition === 'before') {
    return `${config.currencySymbol}${formattedNumber}`;
  }
  
  return `${formattedNumber} ${config.currencySymbol}`;
}

/**
 * Format date according to locale
 */
export function formatDate(
  date: Date | string,
  locale: string = 'en',
  format?: string
): string {
  const config = localeConfigs[locale] || localeConfigs.en;
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const formatToUse = format || config.dateFormat;
  
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  
  return formatToUse
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', String(year));
}

/**
 * Get compact number format (e.g., 1.5L, 2.3Cr for Indian)
 */
export function formatCompactNumber(
  value: number,
  locale: string = 'en'
): string {
  const config = localeConfigs[locale] || localeConfigs.en;
  
  if (config.numberFormat === 'indian') {
    if (value >= 10000000) {
      // Crores
      return `${(value / 10000000).toFixed(2)}Cr`;
    } else if (value >= 100000) {
      // Lakhs
      return `${(value / 100000).toFixed(2)}L`;
    } else if (value >= 1000) {
      // Thousands
      return `${(value / 1000).toFixed(2)}K`;
    }
    return value.toString();
  }
  
  // Western format (K, M, B)
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(2)}B`;
  } else if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(2)}K`;
  }
  
  return value.toString();
}

/**
 * Parse number from localized string
 */
export function parseLocalizedNumber(
  value: string,
  locale: string = 'en'
): number {
  const config = localeConfigs[locale] || localeConfigs.en;
  
  // Remove thousands separators and replace decimal separator
  const normalized = value
    .replace(new RegExp(`\\${config.thousandsSeparator}`, 'g'), '')
    .replace(config.decimalSeparator, '.');
  
  return parseFloat(normalized) || 0;
}

/**
 * Get percentage format
 */
export function formatPercentage(
  value: number,
  locale: string = 'en',
  decimals: number = 2
): string {
  return `${formatNumber(value, locale, decimals)}%`;
}

/**
 * Convert number to words (Indian numbering system)
 */
export function numberToWords(num: number, locale: string = 'en'): string {
  if (locale === 'en' || locale === 'hi') {
    return numberToIndianWords(num);
  }
  return num.toString();
}

function numberToIndianWords(num: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  
  if (num === 0) return 'Zero';
  if (num < 0) return 'Minus ' + numberToIndianWords(-num);
  
  let words = '';
  
  // Crores
  if (num >= 10000000) {
    words += numberToIndianWords(Math.floor(num / 10000000)) + ' Crore ';
    num %= 10000000;
  }
  
  // Lakhs
  if (num >= 100000) {
    words += numberToIndianWords(Math.floor(num / 100000)) + ' Lakh ';
    num %= 100000;
  }
  
  // Thousands
  if (num >= 1000) {
    words += numberToIndianWords(Math.floor(num / 1000)) + ' Thousand ';
    num %= 1000;
  }
  
  // Hundreds
  if (num >= 100) {
    words += ones[Math.floor(num / 100)] + ' Hundred ';
    num %= 100;
  }
  
  // Tens and Ones
  if (num >= 20) {
    words += tens[Math.floor(num / 10)] + ' ';
    num %= 10;
  } else if (num >= 10) {
    words += teens[num - 10] + ' ';
    num = 0;
  }
  
  if (num > 0) {
    words += ones[num] + ' ';
  }
  
  return words.trim();
}
