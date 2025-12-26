'use client';

import { useSettings } from '@/components/providers/SettingsProvider';
import { translations, LanguageCode, getTranslation } from '@/lib/translations';
import { formatCurrency, formatNumber, formatDate, formatCompactNumber } from '@/lib/localeUtils';

export default function LocaleExample() {
  const { language } = useSettings();
  
  const sampleData = {
    loanAmount: 2500000,
    emi: 23178,
    totalInterest: 788400,
    date: new Date(),
    percentage: 8.5,
  };

  return (
    <div className="space-y-6 p-6 bg-card rounded-lg">
      <h2 className="text-2xl font-bold">
        {getTranslation(language as LanguageCode, 'common.example')}
      </h2>
      
      <div className="grid gap-4">
        <div className="p-4 bg-background rounded border">
          <p className="text-sm text-muted-foreground mb-2">Loan Amount</p>
          <p className="text-2xl font-bold">{formatCurrency(sampleData.loanAmount, language)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Compact: {formatCompactNumber(sampleData.loanAmount, language)}
          </p>
        </div>

        <div className="p-4 bg-background rounded border">
          <p className="text-sm text-muted-foreground mb-2">Monthly EMI</p>
          <p className="text-2xl font-bold">{formatCurrency(sampleData.emi, language)}</p>
        </div>

        <div className="p-4 bg-background rounded border">
          <p className="text-sm text-muted-foreground mb-2">Interest Rate</p>
          <p className="text-2xl font-bold">{formatNumber(sampleData.percentage, language, 2)}%</p>
        </div>

        <div className="p-4 bg-background rounded border">
          <p className="text-sm text-muted-foreground mb-2">Date</p>
          <p className="text-xl font-semibold">{formatDate(sampleData.date, language)}</p>
        </div>
      </div>

      <div className="p-4 bg-primary/5 rounded border border-primary/20">
        <p className="text-sm font-medium mb-2">Current Language: {language}</p>
        <p className="text-xs text-muted-foreground">
          All numbers are formatted according to {language === 'en' ? 'Indian' : 'local'} conventions.
          Currency symbol: ₹ (Indian Rupee)
        </p>
      </div>
    </div>
  );
}
