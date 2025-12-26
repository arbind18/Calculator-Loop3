'use client';

import { useEffect } from 'react';
import { initClarity, setClarityTag } from '@/lib/clarity';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function ClarityScript() {
  const { data: session } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    // Initialize Clarity
    initClarity();

    // Set user tags if authenticated
    if (session?.user) {
      setClarityTag('user_id', session.user.id || 'unknown');
      setClarityTag('user_email', session.user.email || 'unknown');
      setClarityTag('user_type', 'authenticated');
    } else {
      setClarityTag('user_type', 'guest');
    }

    // Set page category tag
    if (pathname) {
      const category = pathname.split('/')[1] || 'home';
      setClarityTag('page_category', category);
    }
  }, [session, pathname]);

  return null;
}
