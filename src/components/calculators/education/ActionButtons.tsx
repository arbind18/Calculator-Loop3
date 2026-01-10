"use client"

import { Button } from '@/components/ui/button'
import { Share2, RefreshCw, Trash2 } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { toast } from 'sonner' // Using sonner for toasts as seen in package.json

interface ActionButtonsProps {
    onReset: () => void
}

export function ActionButtons({ onReset }: ActionButtonsProps) {

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'XAT Score Calculator 2026',
                    text: 'Check your XAT score and predicted percentile accurately!',
                    url: window.location.href,
                })
            } else {
                await navigator.clipboard.writeText(window.location.href)
                toast.success("Link copied to clipboard!")
            }
        } catch (err) {
            console.error("Error sharing:", err)
            // Fallback copy if share fails or cancelled
            // navigator.clipboard.writeText(window.location.href)
        }
    }

    const handleReload = () => {
        window.location.reload()
    }

    return (
        <div className="flex items-center gap-2 mb-4 justify-end">
            <TooltipProvider>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={handleShare} className="h-9 w-9 text-muted-foreground hover:text-primary">
                            <Share2 className="h-4 w-4" />
                            <span className="sr-only">Share Calculator</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Share Calculator</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={handleReload} className="h-9 w-9 text-muted-foreground hover:text-primary">
                            <RefreshCw className="h-4 w-4" />
                            <span className="sr-only">Reload Page</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Reload Page</p>
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={onReset} className="h-9 w-9 text-muted-foreground hover:text-destructive hover:border-destructive/50 hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Reset All</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Reset Inputs</p>
                    </TooltipContent>
                </Tooltip>

            </TooltipProvider>
        </div>
    )
}
