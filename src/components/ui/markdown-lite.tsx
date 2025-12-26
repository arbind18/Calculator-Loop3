'use client';

import React from 'react';
import Link from 'next/link';

export const MarkdownLite = ({ content }: { content: string }) => {
  if (!content) return null;

  // Split by newlines to handle structure line-by-line
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!line.trim()) {
      elements.push(<div key={i} className="h-2" />); // Spacer
      continue;
    }

    // Header
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="font-bold text-base mt-3 mb-1 text-foreground">
          {line.replace('### ', '')}
        </h3>
      );
      continue;
    }

    // List Item
    if (line.trim().startsWith('- ')) {
      elements.push(
        <div key={i} className="flex gap-2 ml-1 mb-1">
          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
          <div className="text-sm leading-relaxed">{parseText(line.replace('- ', ''))}</div>
        </div>
      );
      continue;
    }

    // Regular Text
    elements.push(
      <div key={i} className="text-sm leading-relaxed mb-1">
        {parseText(line)}
      </div>
    );
  }

  return <div className="space-y-0.5">{elements}</div>;
};

const parseText = (text: string) => {
  // Split by bold (**...**), links ([...](...)), and italics (_..._)
  const parts = text.split(/(\*\*.*?\*\*)|(\[.*?\]\(.*?\))|(_.*?_)/g).filter(Boolean);

  return parts.map((part, index) => {
    // Handle Link
    if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
      const match = part.match(/\[(.*?)\]\((.*?)\)/);
      if (match) {
        const [_, label, url] = match;
        return (
          <Link 
            key={index} 
            href={url} 
            className="text-primary font-medium hover:underline underline-offset-4"
          >
            {label}
          </Link>
        );
      }
    }

    // Handle Bold
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-semibold">{part.slice(2, -2)}</strong>;
    }

    // Handle Italic (simple _..._)
    if (part.startsWith('_') && part.endsWith('_')) {
        return <em key={index} className="text-muted-foreground">{part.slice(1, -1)}</em>;
    }

    return <span key={index}>{part}</span>;
  });
};
