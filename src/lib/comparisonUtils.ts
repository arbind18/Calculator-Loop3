// Comparison utilities for scenario analysis

export interface Scenario {
  id: string;
  name: string;
  inputs: Record<string, any>;
  results: Record<string, any>;
  color?: string;
  createdAt: Date;
}

export interface ComparisonMetrics {
  metric: string;
  scenarios: Array<{
    scenarioId: string;
    value: any;
    formattedValue: string;
  }>;
  best?: string; // ID of scenario with best value
  worst?: string; // ID of scenario with worst value
  difference?: {
    absolute: number;
    percentage: number;
  };
}

/**
 * Generate unique scenario ID
 */
export function generateScenarioId(): string {
  return `scenario-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Default scenario colors
 */
export const SCENARIO_COLORS = [
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#10B981', // Green
  '#F59E0B', // Amber
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#14B8A6', // Teal
  '#F97316', // Orange
];

/**
 * Get color for scenario by index
 */
export function getScenarioColor(index: number): string {
  return SCENARIO_COLORS[index % SCENARIO_COLORS.length];
}

/**
 * Format value for display
 */
export function formatComparisonValue(value: any, type?: 'currency' | 'percentage' | 'number'): string {
  if (value === null || value === undefined) return 'N/A';

  if (typeof value === 'number') {
    if (type === 'currency') {
      return `₹${value.toLocaleString('en-IN')}`;
    }
    if (type === 'percentage') {
      return `${value.toFixed(2)}%`;
    }
    return value.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  }

  return String(value);
}

/**
 * Compare scenarios and find best/worst
 */
export function compareScenarios(
  scenarios: Scenario[],
  metricKey: string,
  preferLower: boolean = true
): ComparisonMetrics {
  const metrics: ComparisonMetrics = {
    metric: metricKey,
    scenarios: [],
  };

  // Extract values for this metric
  const values = scenarios.map((scenario) => ({
    scenarioId: scenario.id,
    value: scenario.results[metricKey],
    formattedValue: formatComparisonValue(scenario.results[metricKey]),
  }));

  metrics.scenarios = values;

  // Find best and worst (only for numeric values)
  const numericValues = values.filter((v) => typeof v.value === 'number');
  if (numericValues.length > 0) {
    const sorted = [...numericValues].sort((a, b) => 
      preferLower ? a.value - b.value : b.value - a.value
    );

    metrics.best = sorted[0].scenarioId;
    metrics.worst = sorted[sorted.length - 1].scenarioId;

    // Calculate difference between best and worst
    if (sorted.length > 1) {
      const bestValue = sorted[0].value;
      const worstValue = sorted[sorted.length - 1].value;
      metrics.difference = {
        absolute: Math.abs(worstValue - bestValue),
        percentage: ((Math.abs(worstValue - bestValue) / worstValue) * 100),
      };
    }
  }

  return metrics;
}

/**
 * Export scenarios to CSV
 */
export function exportScenariosToCSV(scenarios: Scenario[]): string {
  if (scenarios.length === 0) return '';

  // Get all unique keys from inputs and results
  const inputKeys = new Set<string>();
  const resultKeys = new Set<string>();

  scenarios.forEach((scenario) => {
    Object.keys(scenario.inputs).forEach((key) => inputKeys.add(key));
    Object.keys(scenario.results).forEach((key) => resultKeys.add(key));
  });

  // Create CSV header
  const headers = [
    'Scenario Name',
    ...Array.from(inputKeys).map((key) => `Input: ${formatLabel(key)}`),
    ...Array.from(resultKeys).map((key) => `Result: ${formatLabel(key)}`),
  ];

  // Create CSV rows
  const rows = scenarios.map((scenario) => {
    return [
      scenario.name,
      ...Array.from(inputKeys).map((key) => scenario.inputs[key] ?? ''),
      ...Array.from(resultKeys).map((key) => scenario.results[key] ?? ''),
    ].map((value) => `"${value}"`);
  });

  // Combine header and rows
  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}

/**
 * Calculate percentage difference between two values
 */
export function calculatePercentageDifference(value1: number, value2: number): number {
  if (value2 === 0) return 0;
  return ((value1 - value2) / value2) * 100;
}

/**
 * Find optimal scenario based on multiple criteria
 */
export function findOptimalScenario(
  scenarios: Scenario[],
  criteria: Array<{ key: string; weight: number; preferLower: boolean }>
): string | null {
  if (scenarios.length === 0) return null;

  // Normalize weights
  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
  const normalizedCriteria = criteria.map((c) => ({
    ...c,
    weight: c.weight / totalWeight,
  }));

  // Calculate scores for each scenario
  const scores = scenarios.map((scenario) => {
    let score = 0;

    normalizedCriteria.forEach((criterion) => {
      const value = scenario.results[criterion.key];
      if (typeof value !== 'number') return;

      // Get min and max values for this criterion
      const values = scenarios
        .map((s) => s.results[criterion.key])
        .filter((v) => typeof v === 'number');
      const min = Math.min(...values);
      const max = Math.max(...values);

      // Normalize value to 0-1 range
      let normalized = max === min ? 1 : (value - min) / (max - min);

      // Invert if we prefer lower values
      if (criterion.preferLower) {
        normalized = 1 - normalized;
      }

      score += normalized * criterion.weight;
    });

    return { scenarioId: scenario.id, score };
  });

  // Find scenario with highest score
  const best = scores.reduce((prev, current) =>
    current.score > prev.score ? current : prev
  );

  return best.scenarioId;
}

/**
 * Format label for display
 */
function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .trim()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Generate comparison summary
 */
export function generateComparisonSummary(scenarios: Scenario[]): string {
  if (scenarios.length === 0) return 'No scenarios to compare';
  if (scenarios.length === 1) return '1 scenario';
  return `${scenarios.length} scenarios compared`;
}

/**
 * Validate scenario data
 */
export function validateScenario(scenario: Partial<Scenario>): boolean {
  return !!(
    scenario.name &&
    scenario.inputs &&
    scenario.results &&
    Object.keys(scenario.inputs).length > 0 &&
    Object.keys(scenario.results).length > 0
  );
}
