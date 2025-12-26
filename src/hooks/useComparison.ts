'use client';

import { useState, useCallback } from 'react';
import {
  Scenario,
  generateScenarioId,
  getScenarioColor,
  validateScenario,
  exportScenariosToCSV,
} from '@/lib/comparisonUtils';
import { toast } from 'sonner';

export function useComparison() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);

  /**
   * Add a new scenario
   */
  const addScenario = useCallback((
    name: string,
    inputs: Record<string, any>,
    results: Record<string, any>
  ) => {
    const scenario: Scenario = {
      id: generateScenarioId(),
      name,
      inputs,
      results,
      color: getScenarioColor(scenarios.length),
      createdAt: new Date(),
    };

    if (!validateScenario(scenario)) {
      toast.error('Invalid scenario data');
      return null;
    }

    setScenarios((prev) => [...prev, scenario]);
    setActiveScenarioId(scenario.id);
    toast.success(`Scenario "${name}" added`);
    return scenario.id;
  }, [scenarios.length]);

  /**
   * Update an existing scenario
   */
  const updateScenario = useCallback((
    id: string,
    updates: Partial<Omit<Scenario, 'id' | 'createdAt'>>
  ) => {
    setScenarios((prev) =>
      prev.map((scenario) =>
        scenario.id === id ? { ...scenario, ...updates } : scenario
      )
    );
    toast.success('Scenario updated');
  }, []);

  /**
   * Remove a scenario
   */
  const removeScenario = useCallback((id: string) => {
    setScenarios((prev) => prev.filter((s) => s.id !== id));
    if (activeScenarioId === id) {
      setActiveScenarioId(null);
    }
    toast.success('Scenario removed');
  }, [activeScenarioId]);

  /**
   * Clear all scenarios
   */
  const clearScenarios = useCallback(() => {
    setScenarios([]);
    setActiveScenarioId(null);
    toast.success('All scenarios cleared');
  }, []);

  /**
   * Duplicate a scenario
   */
  const duplicateScenario = useCallback((id: string) => {
    const scenario = scenarios.find((s) => s.id === id);
    if (!scenario) return null;

    const newScenario: Scenario = {
      ...scenario,
      id: generateScenarioId(),
      name: `${scenario.name} (Copy)`,
      color: getScenarioColor(scenarios.length),
      createdAt: new Date(),
    };

    setScenarios((prev) => [...prev, newScenario]);
    setActiveScenarioId(newScenario.id);
    toast.success('Scenario duplicated');
    return newScenario.id;
  }, [scenarios]);

  /**
   * Rename a scenario
   */
  const renameScenario = useCallback((id: string, newName: string) => {
    updateScenario(id, { name: newName });
  }, [updateScenario]);

  /**
   * Export scenarios to CSV
   */
  const exportToCSV = useCallback(() => {
    if (scenarios.length === 0) {
      toast.error('No scenarios to export');
      return;
    }

    const csv = exportScenariosToCSV(scenarios);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `scenario-comparison-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Scenarios exported to CSV');
  }, [scenarios]);

  /**
   * Get scenario by ID
   */
  const getScenario = useCallback((id: string) => {
    return scenarios.find((s) => s.id === id);
  }, [scenarios]);

  /**
   * Get active scenario
   */
  const activeScenario = activeScenarioId 
    ? scenarios.find((s) => s.id === activeScenarioId) 
    : null;

  return {
    scenarios,
    activeScenarioId,
    activeScenario,
    setActiveScenarioId,
    addScenario,
    updateScenario,
    removeScenario,
    clearScenarios,
    duplicateScenario,
    renameScenario,
    exportToCSV,
    getScenario,
  };
}
