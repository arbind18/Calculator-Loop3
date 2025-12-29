'use client';

import { Toaster as Sonner } from 'sonner';
import { useTheme } from 'next-themes';
import { Toaster as HotToaster } from 'react-hot-toast';

export default function ToastProvider() {
  const { theme } = useTheme();

  return (
    <>
      <Sonner
        theme={theme as 'light' | 'dark'}
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
          },
          className: 'toast',
          duration: 3000,
        }}
      />
      <HotToaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
          },
          duration: 3000,
        }}
      />
    </>
  );
}
