'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ScenarioCard from './ScenarioCard';
import ComparisonTable from './ComparisonTable';
import { useComparison } from '@/hooks/useComparison';
import {
  Plus,
  Download,
  Trash2,
  BarChart3,
  Table as TableIcon,
  Save,
} from 'lucide-react';
import { toast } from 'sonner';

interface ComparisonPanelProps {
  calculatorName: string;
  currentInputs: Record<string, any>;
  currentResults: Record<string, any>;
  preferLower?: Record<string, boolean>;
  onLoadScenario?: (inputs: Record<string, any>) => void;
}

export default function ComparisonPanel({
  calculatorName,
  currentInputs,
  currentResults,
  preferLower,
  onLoadScenario,
}: ComparisonPanelProps) {
  const {
    scenarios,
    activeScenarioId,
    setActiveScenarioId,
    addScenario,
    removeScenario,
    clearScenarios,
    duplicateScenario,
    renameScenario,
    exportToCSV,
  } = useComparison();

  const [scenarioName, setScenarioName] = useState('');
  const [view, setView] = useState<'cards' | 'table'>('cards');

  const handleAddScenario = () => {
    if (!scenarioName.trim()) {
      toast.error('Please enter a scenario name');
      return;
    }

    addScenario(scenarioName, currentInputs, currentResults);
    setScenarioName('');
  };

  const handleQuickAdd = () => {
    const name = `Scenario ${scenarios.length + 1}`;
    addScenario(name, currentInputs, currentResults);
  };

  const handleLoadScenario = (scenarioId: string) => {
    const scenario = scenarios.find((s) => s.id === scenarioId);
    if (scenario && onLoadScenario) {
      onLoadScenario(scenario.inputs);
      setActiveScenarioId(scenarioId);
      toast.success(`Loaded "${scenario.name}"`);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Scenario Comparison</h3>
            <p className="text-sm text-muted-foreground">
              Compare multiple {calculatorName.toLowerCase()} scenarios side-by-side
            </p>
          </div>
          <div className="flex gap-2">
            {scenarios.length > 0 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportToCSV}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearScenarios}
                  className="gap-2 text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear All
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Add Scenario */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="scenario-name" className="sr-only">
              Scenario Name
            </Label>
            <Input
              id="scenario-name"
              placeholder="Enter scenario name..."
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddScenario();
              }}
            />
          </div>
          <Button onClick={handleAddScenario} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Scenario
          </Button>
          <Button
            variant="outline"
            onClick={handleQuickAdd}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            Quick Add
          </Button>
        </div>

        {scenarios.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
            <h4 className="text-lg font-semibold mb-2">No Scenarios Yet</h4>
            <p className="text-muted-foreground mb-4">
              Calculate results and save them as scenarios to compare different options
            </p>
            <Button onClick={handleQuickAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Scenario
            </Button>
          </div>
        ) : (
          <Tabs value={view} onValueChange={(v) => setView(v as 'cards' | 'table')}>
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="cards" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Cards
                </TabsTrigger>
                <TabsTrigger value="table" className="gap-2">
                  <TableIcon className="h-4 w-4" />
                  Table
                </TabsTrigger>
              </TabsList>
              <p className="text-sm text-muted-foreground">
                {scenarios.length} scenario{scenarios.length !== 1 ? 's' : ''}
              </p>
            </div>

            <TabsContent value="cards" className="space-y-3 mt-0">
              <div className="grid gap-3">
                {scenarios.map((scenario) => (
                  <ScenarioCard
                    key={scenario.id}
                    scenario={scenario}
                    isActive={scenario.id === activeScenarioId}
                    onSelect={handleLoadScenario}
                    onRename={renameScenario}
                    onDuplicate={duplicateScenario}
                    onRemove={removeScenario}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="table" className="mt-0">
              <ComparisonTable
                scenarios={scenarios}
                preferLower={preferLower}
                showInputs={true}
                showDifference={true}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Card>
  );
}
