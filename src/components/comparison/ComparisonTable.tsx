'use client';

import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Scenario,
  compareScenarios,
  formatComparisonValue,
} from '@/lib/comparisonUtils';
import { TrendingUp, TrendingDown, Award } from 'lucide-react';

interface ComparisonTableProps {
  scenarios: Scenario[];
  metricKeys?: string[];
  preferLower?: Record<string, boolean>;
  showInputs?: boolean;
  showDifference?: boolean;
}

export default function ComparisonTable({
  scenarios,
  metricKeys,
  preferLower = {},
  showInputs = true,
  showDifference = true,
}: ComparisonTableProps) {
  // Get all unique metric keys if not provided
  const allMetricKeys = useMemo(() => {
    if (metricKeys) return metricKeys;

    const keys = new Set<string>();
    scenarios.forEach((scenario) => {
      if (showInputs) {
        Object.keys(scenario.inputs).forEach((key) => keys.add(`input_${key}`));
      }
      Object.keys(scenario.results).forEach((key) => keys.add(`result_${key}`));
    });
    return Array.from(keys);
  }, [scenarios, metricKeys, showInputs]);

  // Compare scenarios for each metric
  const comparisons = useMemo(() => {
    return allMetricKeys.map((key) => {
      const isInput = key.startsWith('input_');
      const actualKey = isInput ? key.replace('input_', '') : key.replace('result_', '');
      const data = isInput
        ? scenarios.map((s) => ({ ...s, results: s.inputs }))
        : scenarios;

      return {
        key,
        label: formatLabel(actualKey),
        isInput,
        comparison: compareScenarios(data, actualKey, preferLower[actualKey] ?? true),
      };
    });
  }, [scenarios, allMetricKeys, preferLower]);

  if (scenarios.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">
          No scenarios to compare. Add at least one scenario to get started.
        </p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px] font-semibold sticky left-0 bg-background z-10">
                Metric
              </TableHead>
              {scenarios.map((scenario) => (
                <TableHead key={scenario.id} className="text-center min-w-[150px]">
                  <div className="flex items-center justify-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: scenario.color }}
                    />
                    <span className="font-semibold">{scenario.name}</span>
                  </div>
                </TableHead>
              ))}
              {showDifference && scenarios.length > 1 && (
                <TableHead className="text-center min-w-[120px] font-semibold">
                  Difference
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {comparisons.map(({ key, label, isInput, comparison }) => (
              <TableRow key={key} className={isInput ? 'bg-muted/30' : ''}>
                <TableCell className="font-medium sticky left-0 bg-background z-10">
                  <div className="flex items-center gap-2">
                    {isInput && (
                      <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded">
                        Input
                      </span>
                    )}
                    {label}
                  </div>
                </TableCell>
                {comparison.scenarios.map((scenarioData) => {
                  const isBest = scenarioData.scenarioId === comparison.best;
                  const isWorst = scenarioData.scenarioId === comparison.worst;

                  return (
                    <TableCell
                      key={scenarioData.scenarioId}
                      className={`text-center ${
                        isBest
                          ? 'bg-green-50 dark:bg-green-900/20 font-semibold'
                          : isWorst
                          ? 'bg-red-50 dark:bg-red-900/20'
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {isBest && <Award className="h-4 w-4 text-green-600" />}
                        <span>{scenarioData.formattedValue}</span>
                      </div>
                    </TableCell>
                  );
                })}
                {showDifference && scenarios.length > 1 && (
                  <TableCell className="text-center">
                    {comparison.difference ? (
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1">
                          {comparison.difference.percentage > 0 ? (
                            <TrendingUp className="h-3.5 w-3.5 text-red-500" />
                          ) : (
                            <TrendingDown className="h-3.5 w-3.5 text-green-500" />
                          )}
                          <span className="font-medium">
                            {comparison.difference.percentage.toFixed(1)}%
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatComparisonValue(comparison.difference.absolute)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .trim()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
