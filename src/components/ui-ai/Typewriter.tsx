'use client';

import React, { useState, useEffect } from 'react';
import { MarkdownLite } from '@/components/ui/markdown-lite';

interface TypewriterProps {
  content: string;
  speed?: number;
  onComplete?: () => void;
}

export const Typewriter = ({ content, speed = 10, onComplete }: TypewriterProps) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Reset if content changes drastically (new message)
    setDisplayedContent('');
    setIsComplete(false);
    
    let i = 0;
    const timer = setInterval(() => {
      if (i < content.length) {
        // Add chunks for speed
        const chunk = content.slice(i, i + 3);
        setDisplayedContent((prev) => prev + chunk);
        i += 3;
      } else {
        clearInterval(timer);
        setDisplayedContent(content); // Ensure full content
        setIsComplete(true);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [content, speed, onComplete]);

  // If complete, just render the full markdown to avoid re-typing on re-renders
  if (isComplete) {
    return <MarkdownLite content={content} />;
  }

  return <MarkdownLite content={displayedContent} />;
};
