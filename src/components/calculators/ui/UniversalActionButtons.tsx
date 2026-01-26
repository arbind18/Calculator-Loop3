"use client"

import { Button } from '@/components/ui/button'
import { Share2, RefreshCw, Trash2, Star, Bookmark, History, Printer, Download, Copy, Check, Undo } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { toast } from 'sonner'
import { useState } from 'react'

interface UniversalActionButtonsProps {
    onReset?: () => void
    title?: string
    result?: any
    showFavorite?: boolean
    showBookmark?: boolean
    showHistory?: boolean
    showUndo?: boolean
    showCopy?: boolean
    showPrint?: boolean
    showDownload?: boolean
    showShare?: boolean
    onFavorite?: () => void
    onBookmark?: () => void
    onHistory?: () => void
    onUndo?: () => void
    className?: string
}

export function UniversalActionButtons({
    onReset,
    title = 'Calculator',
    result,
    showFavorite = true,
    showBookmark = true,
    showHistory = true,
    showUndo = true,
    showCopy = true,
    showPrint = true,
    showDownload = true,
    showShare = true,
    onFavorite,
    onBookmark,
    onHistory,
    onUndo,
    className = ''
}: UniversalActionButtonsProps) {
    const [copied, setCopied] = useState(false)
    const [isFavorite, setIsFavorite] = useState(false)
    const [isBookmarked, setIsBookmarked] = useState(false)

    const handleShare = async () => {
        try {
            const shareData = {
                title: title,
                text: `Check out this ${title}!`,
                url: window.location.href,
            }

            if (navigator.share) {
                await navigator.share(shareData)
                toast.success("Shared successfully!")
            } else {
                await navigator.clipboard.writeText(window.location.href)
                toast.success("Link copied to clipboard!")
            }
        } catch (err) {
            // User cancelled or error
            if ((err as Error).name !== 'AbortError') {
                console.error("Error sharing:", err)
            }
        }
    }

    const handleCopy = async () => {
        if (!result) {
            await navigator.clipboard.writeText(window.location.href)
            toast.success("Link copied!")
            return
        }

        try {
            const text = typeof result === 'string' ? result : JSON.stringify(result, null, 2)
            await navigator.clipboard.writeText(text)
            setCopied(true)
            toast.success("Result copied to clipboard!")
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            toast.error("Failed to copy")
        }
    }

    const handlePrint = () => {
        window.print()
    }

    const handleDownload = () => {
        if (!result) {
            toast.error("No result to download")
            return
        }

        const content = typeof result === 'string' ? result : JSON.stringify(result, null, 2)
        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${title.replace(/\\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        toast.success("Downloaded successfully!")
    }

    const handleFavorite = () => {
        setIsFavorite(!isFavorite)
        if (onFavorite) {
            onFavorite()
        } else {
            toast.success(isFavorite ? "Removed from favorites" : "Added to favorites")
        }
    }

    const handleBookmark = () => {
        setIsBookmarked(!isBookmarked)
        if (onBookmark) {
            onBookmark()
        } else {
            toast.success(isBookmarked ? "Bookmark removed" : "Bookmarked")
        }
    }

    const handleHistory = () => {
        if (onHistory) {
            onHistory()
        } else {
            toast.info("History feature coming soon!")
        }
    }

    const handleUndo = () => {
        if (onUndo) {
            onUndo()
        } else {
            toast.info("Nothing to undo")
        }
    }

    const handleDelete = () => {
        if (onReset) {
            onReset()
            toast.success("Reset successfully!")
        }
    }

    return (
        <div className={`flex items-center gap-1.5 ${className}`}>
            <TooltipProvider delayDuration={300}>

                {/* Delete/Trash - Reset */}
                {onReset && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleDelete}
                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete/Reset</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Reset Calculator</p>
                        </TooltipContent>
                    </Tooltip>
                )}

                {/* Undo */}
                {showUndo && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleUndo}
                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                            >
                                <Undo className="h-4 w-4" />
                                <span className="sr-only">Undo</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Undo</p>
                        </TooltipContent>
                    </Tooltip>
                )}

                {/* Favorite/Star */}
                {showFavorite && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleFavorite}
                                className={`h-8 w-8 ${isFavorite ? 'text-yellow-500' : 'text-muted-foreground'} hover:text-yellow-500`}
                            >
                                <Star className={`h-4 w-4 ${isFavorite ? 'fill-yellow-500' : ''}`} />
                                <span className="sr-only">Favorite</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</p>
                        </TooltipContent>
                    </Tooltip>
                )}

                {/* Bookmark */}
                {showBookmark && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleBookmark}
                                className={`h-8 w-8 ${isBookmarked ? 'text-blue-500' : 'text-muted-foreground'} hover:text-blue-500`}
                            >
                                <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-blue-500' : ''}`} />
                                <span className="sr-only">Bookmark</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{isBookmarked ? 'Remove Bookmark' : 'Bookmark'}</p>
                        </TooltipContent>
                    </Tooltip>
                )}

                {/* History */}
                {showHistory && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleHistory}
                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                            >
                                <History className="h-4 w-4" />
                                <span className="sr-only">History</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>View History</p>
                        </TooltipContent>
                    </Tooltip>
                )}

                {/* Copy */}
                {showCopy && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleCopy}
                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                            >
                                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                <span className="sr-only">Copy</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Copy Result</p>
                        </TooltipContent>
                    </Tooltip>
                )}

                {/* Share */}
                {showShare && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleShare}
                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                            >
                                <Share2 className="h-4 w-4" />
                                <span className="sr-only">Share</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Share Calculator</p>
                        </TooltipContent>
                    </Tooltip>
                )}

                {/* Print */}
                {showPrint && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handlePrint}
                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                            >
                                <Printer className="h-4 w-4" />
                                <span className="sr-only">Print</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Print</p>
                        </TooltipContent>
                    </Tooltip>
                )}

                {/* Download */}
                {showDownload && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleDownload}
                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                            >
                                <Download className="h-4 w-4" />
                                <span className="sr-only">Download</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Download Result</p>
                        </TooltipContent>
                    </Tooltip>
                )}

            </TooltipProvider>
        </div>
    )
}

// Simplified version for backward compatibility
export function ActionButtons({ onReset }: { onReset: () => void }) {
    return (
        <UniversalActionButtons
            onReset={onReset}
            showFavorite={false}
            showBookmark={false}
            showHistory={false}
            showUndo={false}
            showCopy={false}
            showDownload={false}
            showPrint={false}
        />
    )
}
