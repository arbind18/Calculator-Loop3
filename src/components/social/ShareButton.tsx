'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Check, MessageCircle, Facebook, Linkedin, Twitter } from 'lucide-react';
import { toast } from 'sonner';
import { useAnalytics } from '@/hooks/useAnalytics';

interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
  hashtags?: string[];
  image?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
}

export default function ShareButton({
  title,
  text,
  url,
  hashtags = [],
  image,
  size = 'default',
  variant = 'outline',
  className = '',
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const hasNativeShare = typeof navigator !== 'undefined' && typeof (navigator as any).share === 'function';
  const { trackShareEvent } = useAnalytics();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
        toast.success('Shared successfully!');
      } catch (error: any) {
        // User cancelled share or error occurred
        if (error.name !== 'AbortError') {
          toast.error('Failed to share');
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const shareToWhatsApp = () => {
    const whatsappText = encodeURIComponent(`${title}\n\n${text}\n\n${shareUrl}`);
    const whatsappUrl = `https://wa.me/?text=${whatsappText}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    trackShareEvent('whatsapp', 'general', shareUrl);
    toast.success('Opening WhatsApp...');
  };

  const shareToTwitter = () => {
    const twitterText = encodeURIComponent(text);
    const twitterUrl = encodeURIComponent(shareUrl);
    const hashtagString = hashtags.join(',');
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${twitterText}&url=${twitterUrl}${
      hashtags.length > 0 ? `&hashtags=${hashtagString}` : ''
    }`;
    window.open(twitterShareUrl, '_blank', 'noopener,noreferrer');
    trackShareEvent('twitter', 'general', shareUrl);
    toast.success('Opening Twitter...');
  };

  const shareToFacebook = () => {
    const facebookUrl = encodeURIComponent(shareUrl);
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${facebookUrl}`;
    window.open(facebookShareUrl, '_blank', 'noopener,noreferrer');
    trackShareEvent('facebook', 'general', shareUrl);
    toast.success('Opening Facebook...');
  };

  const shareToLinkedIn = () => {
    const linkedInUrl = encodeURIComponent(shareUrl);
    const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${linkedInUrl}`;
    window.open(linkedInShareUrl, '_blank', 'noopener,noreferrer');
    trackShareEvent('linkedin', 'general', shareUrl);
    toast.success('Opening LinkedIn...');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={`gap-2 ${className}`}
          aria-label="Share"
        >
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Share</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {/* Native Share (Mobile) */}
        {hasNativeShare && (
          <>
            <DropdownMenuItem onClick={handleNativeShare} className="gap-2 cursor-pointer">
              <Share2 className="h-4 w-4" />
              <span>Share via...</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {/* WhatsApp */}
        <DropdownMenuItem onClick={shareToWhatsApp} className="gap-2 cursor-pointer">
          <MessageCircle className="h-4 w-4 text-green-600" />
          <span>WhatsApp</span>
        </DropdownMenuItem>

        {/* Twitter */}
        <DropdownMenuItem onClick={shareToTwitter} className="gap-2 cursor-pointer">
          <Twitter className="h-4 w-4 text-blue-400" />
          <span>Twitter / X</span>
        </DropdownMenuItem>

        {/* Facebook */}
        <DropdownMenuItem onClick={shareToFacebook} className="gap-2 cursor-pointer">
          <Facebook className="h-4 w-4 text-blue-600" />
          <span>Facebook</span>
        </DropdownMenuItem>

        {/* LinkedIn */}
        <DropdownMenuItem onClick={shareToLinkedIn} className="gap-2 cursor-pointer">
          <Linkedin className="h-4 w-4 text-blue-700" />
          <span>LinkedIn</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Copy Link */}
        <DropdownMenuItem onClick={handleCopyLink} className="gap-2 cursor-pointer">
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-600" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>Copy Link</span>
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
