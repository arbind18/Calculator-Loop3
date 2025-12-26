"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Facebook, Linkedin, Mail, Twitter } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

export function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(description ? `${title} — ${description}` : title);

  const links = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`,
  };

  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="outline" size="icon" aria-label="Share on Facebook">
        <Link href={links.facebook} target="_blank" rel="noopener noreferrer">
          <Facebook className="h-4 w-4" />
        </Link>
      </Button>
      <Button asChild variant="outline" size="icon" aria-label="Share on Twitter">
        <Link href={links.twitter} target="_blank" rel="noopener noreferrer">
          <Twitter className="h-4 w-4" />
        </Link>
      </Button>
      <Button asChild variant="outline" size="icon" aria-label="Share on LinkedIn">
        <Link href={links.linkedin} target="_blank" rel="noopener noreferrer">
          <Linkedin className="h-4 w-4" />
        </Link>
      </Button>
      <Button asChild variant="outline" size="icon" aria-label="Share via Email">
        <Link href={links.email} target="_blank" rel="noopener noreferrer">
          <Mail className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
