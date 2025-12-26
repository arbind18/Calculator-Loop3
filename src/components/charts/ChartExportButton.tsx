"use client"

import { Download, FileImage, FileType, Copy, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  exportToPNG,
  exportToPDF,
  exportToSVG,
  copyChartToClipboard
} from '@/lib/chartExport'

interface ChartExportButtonProps {
  chartId: string
  filename?: string
  showCopy?: boolean
  showPrint?: boolean
}

export function ChartExportButton({
  chartId,
  filename = 'chart',
  showCopy = true,
  showPrint = true
}: ChartExportButtonProps) {
  const handleExport = async (format: 'png' | 'pdf' | 'svg') => {
    const filenameWithExt = `${filename}.${format}`
    
    switch (format) {
      case 'png':
        await exportToPNG(chartId, filenameWithExt)
        break
      case 'pdf':
        await exportToPDF(chartId, filenameWithExt)
        break
      case 'svg':
        await exportToSVG(chartId, filenameWithExt)
        break
    }
  }

  const handleCopy = async () => {
    await copyChartToClipboard(chartId)
  }

  const handlePrint = () => {
    const element = document.getElementById(chartId)
    if (!element) return

    const printWindow = window.open('', '', 'height=600,width=800')
    if (!printWindow) return

    printWindow.document.write('<html><head><title>Print Chart</title>')
    printWindow.document.write('<style>body { margin: 0; padding: 20px; } img { max-width: 100%; }</style>')
    printWindow.document.write('</head><body>')
    printWindow.document.write(element.innerHTML)
    printWindow.document.write('</body></html>')
    printWindow.document.close()
    printWindow.focus()
    
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Chart
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Export Format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => handleExport('png')}>
          <FileImage className="h-4 w-4 mr-2" />
          Export as PNG
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          <FileType className="h-4 w-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleExport('svg')}>
          <FileImage className="h-4 w-4 mr-2" />
          Export as SVG
        </DropdownMenuItem>

        {(showCopy || showPrint) && <DropdownMenuSeparator />}
        
        {showCopy && (
          <DropdownMenuItem onClick={handleCopy}>
            <Copy className="h-4 w-4 mr-2" />
            Copy to Clipboard
          </DropdownMenuItem>
        )}
        
        {showPrint && (
          <DropdownMenuItem onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print Chart
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
