'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChatWindow } from './ChatWindow';

const PREFERRED_LOGO_SRC = '/logo.svg';
const FALLBACK_LOGO_SRC = '/logo.svg';

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative rounded-full h-12 w-12 shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95"
          size="icon"
          aria-label={isOpen ? 'Close AI chat' : 'Open AI chat'}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-primary animate-pulse"
          />
          <Image
            src={PREFERRED_LOGO_SRC}
            alt="Calculator Loop"
            width={24}
            height={24}
            onError={(e) => {
              const img = e.currentTarget as unknown as HTMLImageElement
              img.src = FALLBACK_LOGO_SRC
            }}
          />
        </Button>
      </div>
      <ChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
