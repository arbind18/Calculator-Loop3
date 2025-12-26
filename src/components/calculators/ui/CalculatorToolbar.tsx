import React from 'react'
import { Zap, ZapOff, RotateCcw, Share2, Printer, FileType, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface CalculatorToolbarProps {
  isAutoCalculate?: boolean
  onAutoCalculateChange?: (value: boolean) => void
  onReset?: () => void
  onPrint?: () => void
  onShare?: () => void
  onDownload?: (format: string) => void
  hasResult?: boolean
  title?: string
  description?: string
}

export function CalculatorToolbar({
  isAutoCalculate,
  onAutoCalculateChange,
  onReset,
  onPrint,
  onShare,
  onDownload,
  hasResult = true,
  title = 'Calculator',
  description = '',
}: CalculatorToolbarProps) {
  
  const handlePrint = () => {
    if (onPrint) {
      onPrint()
    } else {
      window.print()
    }
  }

  const handleShare = async () => {
    if (onShare) {
      onShare()
      return
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: window.location.href,
        })
      } catch (err) {
        console.error("Error sharing:", err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard!")
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 p-2 rounded-2xl bg-secondary/10 border border-border/50 print:hidden">
      
      {/* Left Side: Auto Calculate Toggle */}
      {onAutoCalculateChange && (
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl w-full sm:w-auto justify-between sm:justify-start">
           <div className="flex items-center gap-2.5">
              <div className={cn("p-2 rounded-lg transition-colors", isAutoCalculate ? "bg-yellow-500/10 text-yellow-600" : "bg-muted text-muted-foreground")}>
                {isAutoCalculate ? <Zap className="h-4 w-4 fill-current" /> : <ZapOff className="h-4 w-4" />}
              </div>
              <Label htmlFor="auto-calculate" className="text-sm font-medium cursor-pointer select-none">
                Auto Calculate
              </Label>
           </div>
           <Switch 
              id="auto-calculate" 
              checked={isAutoCalculate}
              onCheckedChange={onAutoCalculateChange}
              className="data-[state=checked]:bg-yellow-500 ml-2"
            />
        </div>
      )}

      {/* Right Side: Actions */}
      <div className={cn("flex items-center gap-2 w-full sm:w-auto justify-end px-2", !onAutoCalculateChange && "w-full justify-end")}>
        {onReset && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onReset} 
            className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
            title="Reset"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}
        
        <div className="h-6 w-px bg-border mx-2 hidden sm:block" />

        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleShare} 
          className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"
          title="Share"
        >
          <Share2 className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handlePrint} 
          className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"
          title="Print"
        >
          <Printer className="h-4 w-4" />
        </Button>
        
        {hasResult && onDownload && (
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary shadow-sm rounded-xl px-4 h-10"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Download</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Download As</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onDownload('pdf')}>
                  <FileType className="mr-2 h-4 w-4" />
                  <span>PDF</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDownload('png')}>
                  <FileType className="mr-2 h-4 w-4" />
                  <span>Image (PNG)</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  )
}
