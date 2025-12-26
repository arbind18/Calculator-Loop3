'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Scenario } from '@/lib/comparisonUtils';
import { Copy, Trash2, Edit2, Check, X } from 'lucide-react';

interface ScenarioCardProps {
  scenario: Scenario;
  isActive?: boolean;
  onSelect?: (id: string) => void;
  onRename?: (id: string, newName: string) => void;
  onDuplicate?: (id: string) => void;
  onRemove?: (id: string) => void;
  compact?: boolean;
}

export default function ScenarioCard({
  scenario,
  isActive,
  onSelect,
  onRename,
  onDuplicate,
  onRemove,
  compact = false,
}: ScenarioCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(scenario.name);

  const handleSaveRename = () => {
    if (editName.trim() && editName !== scenario.name) {
      onRename?.(scenario.id, editName.trim());
    }
    setIsEditing(false);
  };

  const handleCancelRename = () => {
    setEditName(scenario.name);
    setIsEditing(false);
  };

  return (
    <Card
      className={`p-4 cursor-pointer transition-all ${
        isActive
          ? 'ring-2 ring-primary shadow-lg'
          : 'hover:shadow-md'
      }`}
      onClick={() => !isEditing && onSelect?.(scenario.id)}
    >
      <div className="flex items-start gap-3">
        {/* Color indicator */}
        <div
          className="w-1 h-full rounded-full flex-shrink-0"
          style={{ backgroundColor: scenario.color }}
        />

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            {isEditing ? (
              <div className="flex items-center gap-2 flex-1" onClick={(e) => e.stopPropagation()}>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveRename();
                    if (e.key === 'Escape') handleCancelRename();
                  }}
                  className="h-8"
                  autoFocus
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSaveRename}
                  className="h-8 w-8 p-0"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancelRename}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <h3 className="font-semibold truncate flex-1">{scenario.name}</h3>
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  {onRename && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditing(true)}
                      className="h-7 w-7 p-0"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  {onDuplicate && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDuplicate(scenario.id)}
                      className="h-7 w-7 p-0"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  {onRemove && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRemove(scenario.id)}
                      className="h-7 w-7 p-0 text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Content */}
          {!compact && (
            <div className="space-y-3">
              {/* Key Results */}
              <div className="space-y-1">
                {Object.entries(scenario.results)
                  .slice(0, 3)
                  .map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-muted-foreground truncate">
                        {formatLabel(key)}:
                      </span>
                      <span className="font-medium ml-2">
                        {formatValue(value)}
                      </span>
                    </div>
                  ))}
              </div>

              {/* Timestamp */}
              <p className="text-xs text-muted-foreground">
                Created {new Date(scenario.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
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

function formatValue(value: any): string {
  if (typeof value === 'number') {
    if (value >= 1000) {
      return `₹${value.toLocaleString('en-IN')}`;
    }
    return value.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  }
  return String(value);
}
