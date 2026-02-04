'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  text: string;
  label?: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showIcon?: boolean;
  successDuration?: number;
}

export function CopyButton({
  text,
  label = 'Copy',
  variant = 'outline',
  size = 'sm',
  className,
  showIcon = true,
  successDuration = 2000
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), successDuration);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={cn(
        'transition-all',
        copied && 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100',
        className
      )}
    >
      {showIcon && (
        copied ? (
          <Check className="h-4 w-4 mr-2" />
        ) : (
          <Copy className="h-4 w-4 mr-2" />
        )
      )}
      {copied ? 'Copied!' : label}
    </Button>
  );
}

// Icon-only version
interface CopyIconButtonProps {
  text: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  successDuration?: number;
}

export function CopyIconButton({
  text,
  variant = 'ghost',
  size = 'icon',
  className,
  successDuration = 2000
}: CopyIconButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), successDuration);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={cn(
        'transition-all',
        copied && 'text-green-600 hover:text-green-700',
        className
      )}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
    >
      {copied ? (
        <Check className="h-4 w-4" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );
}

// Inline version with result
interface CopyResultButtonProps {
  result: string;
  displayText?: string;
  className?: string;
}

export function CopyResultButton({
  result,
  displayText,
  className
}: CopyResultButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all',
        copied ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50',
        className
      )}
      onClick={handleCopy}
    >
      <div className="flex-1 min-w-0">
        <p className="text-2xl font-bold text-gray-900 truncate">
          {displayText || result}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'flex-shrink-0 transition-colors',
          copied && 'text-green-600 hover:text-green-700'
        )}
      >
        {copied ? (
          <Check className="h-5 w-5" />
        ) : (
          <Copy className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
}
