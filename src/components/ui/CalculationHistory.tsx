'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from './scroll-area';
import { Clock, Copy, Trash2, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './sheet';

export interface CalculationEntry {
  id: string;
  timestamp: Date;
  expression: string;
  result: string;
  details?: string;
}

interface CalculationHistoryProps {
  history: CalculationEntry[];
  onClear: () => void;
  onDelete: (id: string) => void;
  onReuse: (entry: CalculationEntry) => void;
  maxHeight?: string;
}

export function CalculationHistory({
  history,
  onClear,
  onDelete,
  onReuse,
  maxHeight = '400px'
}: CalculationHistoryProps) {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (history.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Clock className="h-12 w-12 text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">No calculations yet</p>
          <p className="text-gray-400 text-xs mt-1">Your calculation history will appear here</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            History ({history.length})
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea style={{ height: maxHeight }} className="px-4 pb-4">
          <div className="space-y-2">
            {[...history].reverse().map((entry) => (
              <div
                key={entry.id}
                className="group border rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onReuse(entry)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-1">{formatTime(entry.timestamp)}</p>
                    <p className="text-sm font-medium text-gray-700 truncate">{entry.expression}</p>
                    <p className="text-lg font-bold text-blue-600 mt-1">{entry.result}</p>
                    {entry.details && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{entry.details}</p>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(entry.result);
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(entry.id);
                      }}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// Mobile-optimized sidebar version
interface CalculationHistorySidebarProps extends CalculationHistoryProps {
  triggerText?: string;
}

export function CalculationHistorySidebar({
  history,
  onClear,
  onDelete,
  onReuse,
  triggerText = 'History'
}: CalculationHistorySidebarProps) {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <Clock className="mr-2 h-4 w-4" />
          {triggerText}
          {history.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {history.length > 9 ? '9+' : history.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-96">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Calculation History
            </span>
            {history.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClear}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Clock className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-500">No calculations yet</p>
              <p className="text-gray-400 text-sm mt-2">
                Your calculation history will appear here
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-150px)]">
              <div className="space-y-3 pr-4">
                {[...history].reverse().map((entry) => (
                  <div
                    key={entry.id}
                    className="group border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => onReuse(entry)}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-xs text-gray-500">{formatTime(entry.timestamp)}</p>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(entry.result);
                          }}
                          className="h-7 w-7 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(entry.id);
                          }}
                          className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-1">{entry.expression}</p>
                    <p className="text-xl font-bold text-blue-600">{entry.result}</p>
                    {entry.details && (
                      <p className="text-xs text-gray-500 mt-2">{entry.details}</p>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
