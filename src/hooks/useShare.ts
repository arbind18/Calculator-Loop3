'use client';

import { useState } from 'react';
import { toast } from 'sonner';

interface ShareOptions {
  title: string;
  text: string;
  url?: string;
}

interface UseShareReturn {
  share: (options: ShareOptions) => Promise<void>;
  isSharing: boolean;
  canShare: boolean;
  copyToClipboard: (text: string) => Promise<void>;
  shareToWhatsApp: (text: string) => void;
  shareToTwitter: (text: string, url: string, hashtags?: string[]) => void;
  shareToFacebook: (url: string) => void;
  shareToLinkedIn: (url: string) => void;
  shareToEmail: (subject: string, body: string) => void;
}

/**
 * Custom hook for sharing functionality
 * Provides multiple sharing methods and utilities
 */
export function useShare(): UseShareReturn {
  const [isSharing, setIsSharing] = useState(false);
  const canShare = typeof navigator !== 'undefined' && !!navigator.share;

  const share = async (options: ShareOptions): Promise<void> => {
    const { title, text, url } = options;
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

    if (canShare) {
      setIsSharing(true);
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
        toast.success('Shared successfully!');
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          toast.error('Failed to share');
          console.error('Share error:', error);
        }
      } finally {
        setIsSharing(false);
      }
    } else {
      // Fallback to copy link
      await copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        toast.success('Copied to clipboard!');
      } catch (err) {
        toast.error('Failed to copy');
      }
      document.body.removeChild(textArea);
    }
  };

  const shareToWhatsApp = (text: string): void => {
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    toast.success('Opening WhatsApp...');
  };

  const shareToTwitter = (text: string, url: string, hashtags: string[] = []): void => {
    const hashtagString = hashtags.join(',');
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(url)}${hashtags.length > 0 ? `&hashtags=${hashtagString}` : ''}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
    toast.success('Opening Twitter...');
  };

  const shareToFacebook = (url: string): void => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'noopener,noreferrer');
    toast.success('Opening Facebook...');
  };

  const shareToLinkedIn = (url: string): void => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`;
    window.open(linkedInUrl, '_blank', 'noopener,noreferrer');
    toast.success('Opening LinkedIn...');
  };

  const shareToEmail = (subject: string, body: string): void => {
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      body
    )}`;
    window.location.href = mailtoUrl;
    toast.success('Opening email client...');
  };

  return {
    share,
    isSharing,
    canShare,
    copyToClipboard,
    shareToWhatsApp,
    shareToTwitter,
    shareToFacebook,
    shareToLinkedIn,
    shareToEmail,
  };
}
