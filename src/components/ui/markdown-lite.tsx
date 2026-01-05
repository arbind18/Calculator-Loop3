'use client';

import React from 'react';
import Link from 'next/link';

export const MarkdownLite = ({ content }: { content: string }) => {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Table detection
    if (line.trim().startsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      elements.push(<TableRenderer key={`table-${i}`} lines={tableLines} />);
      continue;
    }

    if (!line.trim()) {
      elements.push(<div key={i} className="h-2" />); // Spacer
      i++;
      continue;
    }

    // Header
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="font-bold text-base mt-3 mb-1 text-foreground">
          {line.replace('### ', '')}
        </h3>
      );
      i++;
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
      i++;
      continue;
    }

    // Regular Text
    elements.push(
      <div key={i} className="text-sm leading-relaxed mb-1">
        {parseText(line)}
      </div>
    );
    i++;
  }

  return <div className="space-y-0.5">{elements}</div>;
};

const TableRenderer = ({ lines }: { lines: string[] }) => {
  if (lines.length < 2) return null;

  const headers = lines[0]
    .split('|')
    .filter((cell) => cell.trim() !== '')
    .map((cell) => cell.trim());

  // Skip the separator line (e.g., |---|---|)
  const rows = lines.slice(2).map((line) =>
    line
      .split('|')
      .filter((cell, index, arr) => {
        // Filter out empty start/end splits if the line starts/ends with |
        if (index === 0 && cell === '') return false;
        if (index === arr.length - 1 && cell === '') return false;
        return true;
      })
      .map((cell) => cell.trim())
  );

  return (
    <div className="my-4 w-full overflow-y-auto rounded-lg border bg-card text-card-foreground shadow-sm">
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
              >
                {parseText(header)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {rows.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
            >
              {row.map((cell, cellIdx) => (
                <td
                  key={cellIdx}
                  className="p-4 align-middle [&:has([role=checkbox])]:pr-0"
                >
                  {parseText(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
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
