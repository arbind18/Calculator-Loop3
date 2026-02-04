import { useEffect, useCallback, useRef } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  callback: () => void;
  description?: string;
  preventDefault?: boolean;
}

/**
 * Hook to add keyboard shortcuts to a component
 * @param shortcuts - Array of keyboard shortcut configurations
 * @param enabled - Whether shortcuts are enabled (default: true)
 */
export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcut[],
  enabled: boolean = true
) {
  const shortcutsRef = useRef(shortcuts);

  // Update ref when shortcuts change
  useEffect(() => {
    shortcutsRef.current = shortcuts;
  }, [shortcuts]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Don't trigger if user is typing in an input/textarea
      const target = event.target as HTMLElement;
      const isInputField = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
      
      // Allow some shortcuts even in input fields
      const allowInInput = event.key === 'Enter' || event.key === 'Escape';
      
      if (isInputField && !allowInInput) return;

      for (const shortcut of shortcutsRef.current) {
        const keyMatch = event.key === shortcut.key || event.code === shortcut.key;
        const ctrlMatch = shortcut.ctrl === undefined || event.ctrlKey === shortcut.ctrl;
        const shiftMatch = shortcut.shift === undefined || event.shiftKey === shortcut.shift;
        const altMatch = shortcut.alt === undefined || event.altKey === shortcut.alt;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          if (shortcut.preventDefault !== false) {
            event.preventDefault();
          }
          shortcut.callback();
          break;
        }
      }
    },
    [enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);
}

/**
 * Common calculator keyboard shortcuts
 */
export const createCalculatorShortcuts = ({
  onCalculate,
  onClear,
  onCopy,
  onHistory
}: {
  onCalculate: () => void;
  onClear: () => void;
  onCopy?: () => void;
  onHistory?: () => void;
}): KeyboardShortcut[] => {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'Enter',
      callback: onCalculate,
      description: 'Calculate result'
    },
    {
      key: 'Escape',
      callback: onClear,
      description: 'Clear all inputs'
    }
  ];

  if (onCopy) {
    shortcuts.push({
      key: 'c',
      ctrl: true,
      callback: onCopy,
      description: 'Copy result',
      preventDefault: false // Let default copy work too
    });
  }

  if (onHistory) {
    shortcuts.push({
      key: 'h',
      ctrl: true,
      callback: onHistory,
      description: 'Open history',
      preventDefault: true
    });
  }

  return shortcuts;
};

/**
 * Hook specifically for calculator components
 */
export function useCalculatorShortcuts({
  onCalculate,
  onClear,
  onCopy,
  onHistory,
  enabled = true
}: {
  onCalculate: () => void;
  onClear: () => void;
  onCopy?: () => void;
  onHistory?: () => void;
  enabled?: boolean;
}) {
  const shortcuts = createCalculatorShortcuts({
    onCalculate,
    onClear,
    onCopy,
    onHistory
  });

  useKeyboardShortcuts(shortcuts, enabled);

  return shortcuts;
}

/**
 * Component to display available keyboard shortcuts
 */
export function KeyboardShortcutsHelp({
  shortcuts
}: {
  shortcuts: KeyboardShortcut[];
}) {
  const formatShortcut = (shortcut: KeyboardShortcut) => {
    const keys: string[] = [];
    if (shortcut.ctrl) keys.push('Ctrl');
    if (shortcut.shift) keys.push('Shift');
    if (shortcut.alt) keys.push('Alt');
    keys.push(shortcut.key.toUpperCase());
    return keys.join(' + ');
  };

  return (
    <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
      <h4 className="font-semibold mb-2">⌨️ Keyboard Shortcuts:</h4>
      <div className="space-y-1">
        {shortcuts
          .filter(s => s.description)
          .map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between">
              <span>{shortcut.description}</span>
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono">
                {formatShortcut(shortcut)}
              </kbd>
            </div>
          ))}
      </div>
    </div>
  );
}
