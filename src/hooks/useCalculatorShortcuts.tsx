'use client';

import { useKeyboardShortcuts, KeyboardShortcut } from './useKeyboardShortcuts';

/**
 * Common calculator keyboard shortcuts configuration
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
