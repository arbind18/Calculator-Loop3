'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Download, X } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface CustomDownloadModalProps {
  open: boolean;
  onClose: () => void;
  data: any;
  title: string;
  format: string;
}

export function CustomDownloadModal({ open, onClose, data, title, format }: CustomDownloadModalProps) {
  const [includeSummary, setIncludeSummary] = useState(true);
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeDataTable, setIncludeDataTable] = useState(true);
  const [rowLimit, setRowLimit] = useState<'all' | '1year' | '5years' | 'custom'>('all');
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState(format === 'custom' ? 'pdf' : format);
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [accentColor, setAccentColor] = useState('#8b5cf6');
  const [fontSize, setFontSize] = useState('medium');
  const [includeWatermark, setIncludeWatermark] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      const downloadFormat = format === 'custom' ? selectedFormat : format;
      switch(downloadFormat.toLowerCase()) {
        case 'csv':
          await downloadCSV();
          break;
        case 'excel':
          await downloadExcel();
          break;
        case 'pdf':
          await downloadPDF();
          break;
        case 'json':
          downloadJSON();
          break;
        case 'png':
        case 'jpg':
          await downloadImage(downloadFormat);
          break;
        default:
          alert(`${downloadFormat} download coming soon!`);
      }
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
      onClose();
    }
  };

  const downloadCSV = async () => {
    let csv = '';
    
    if (includeSummary) {
      csv += 'Summary\n';
      csv += Object.entries(data).map(([key, value]) => `${key},${value}`).join('\n');
      csv += '\n\n';
    }
    
    if (includeDataTable && data.schedule) {
      csv += 'Data Table\n';
      const headers = Object.keys(data.schedule[0] || {});
      csv += headers.join(',') + '\n';
      
      const rows = getFilteredRows(data.schedule);
      csv += rows.map(row => headers.map(h => row[h]).join(',')).join('\n');
    }
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadExcel = async () => {
    const ExcelJS = await import('exceljs');
    const workbook = new ExcelJS.Workbook();

    if (includeSummary) {
      const summarySheet = workbook.addWorksheet('Summary');
      summarySheet.columns = [
        { header: 'Field', key: 'Field', width: 30 },
        { header: 'Value', key: 'Value', width: 40 }
      ];
      Object.entries(data).forEach(([key, value]) => {
        summarySheet.addRow({ Field: key, Value: value });
      });
    }

    if (includeDataTable && data.schedule) {
      const rows = getFilteredRows(data.schedule);
      const dataSheet = workbook.addWorksheet('Data');
      const headers = Object.keys(rows[0] || {});
      dataSheet.columns = headers.map((header) => ({ header, key: header, width: 18 }));
      rows.forEach((row) => dataSheet.addRow(row));
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}-${Date.now()}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadPDF = async () => {
    const doc = new jsPDF();
    let yPos = 20;
    
    // Apply custom colors
    const rgb = hexToRgb(primaryColor);
    const accentRgb = hexToRgb(accentColor);
    
    // Title with primary color
    doc.setTextColor(rgb.r, rgb.g, rgb.b);
    doc.setFontSize(fontSize === 'small' ? 16 : fontSize === 'large' ? 24 : 20);
    doc.text(title, 20, yPos);
    yPos += 15;
    
    // Reset to black for content
    doc.setTextColor(0, 0, 0);
    
    // Summary
    if (includeSummary) {
      doc.setTextColor(accentRgb.r, accentRgb.g, accentRgb.b);
      doc.setFontSize(fontSize === 'small' ? 12 : fontSize === 'large' ? 16 : 14);
      doc.text('Summary', 20, yPos);
      yPos += 10;
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(fontSize === 'small' ? 9 : fontSize === 'large' ? 11 : 10);
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value !== 'object') {
          doc.text(`${key}: ${value}`, 20, yPos);
          yPos += 7;
        }
      });
      yPos += 10;
    }
    
    // Data Table
    if (includeDataTable && data.schedule) {
      const rows = getFilteredRows(data.schedule);
      const headers = Object.keys(rows[0] || {});
      
      autoTable(doc, {
        startY: yPos,
        head: [headers],
        body: rows.map(row => headers.map(h => row[h])),
        headStyles: {
          fillColor: [rgb.r, rgb.g, rgb.b],
          fontSize: fontSize === 'small' ? 8 : fontSize === 'large' ? 11 : 9,
        },
        bodyStyles: {
          fontSize: fontSize === 'small' ? 7 : fontSize === 'large' ? 10 : 8,
        },
      });
    }
    
    // Add watermark if enabled
    if (includeWatermark) {
      doc.setFontSize(60);
      doc.setTextColor(220, 220, 220);
      doc.text('CALCULATOR', 105, 150, { align: 'center', angle: 45 });
    }
    
    doc.save(`${title}-${Date.now()}.pdf`);
  };
  
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const downloadJSON = () => {
    const exportData: any = {};
    
    if (includeSummary) {
      exportData.summary = data;
    }
    
    if (includeDataTable && data.schedule) {
      exportData.data = getFilteredRows(data.schedule);
    }
    
    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}-${Date.now()}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadImage = async (format: string) => {
    const html2canvas = (await import('html2canvas')).default;
    const element = document.querySelector('.calculator-result');
    if (element) {
      const canvas = await html2canvas(element as HTMLElement);
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const url = canvas.toDataURL(mimeType);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}-${Date.now()}.${format}`;
      a.click();
    }
  };

  const getFilteredRows = (schedule: any[]) => {
    if (!schedule || schedule.length === 0) return [];
    
    switch(rowLimit) {
      case '1year':
        return schedule.slice(0, 12);
      case '5years':
        return schedule.slice(0, 60);
      case 'custom':
        return schedule.slice(0, 120);
      default:
        return schedule;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">🎨 Customize Download</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Full control over your download ({format === 'custom' ? 'Select Format' : format.toUpperCase()})
          </p>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Format Selection (only for custom) */}
          {format === 'custom' && (
            <div className="space-y-3 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 rounded-lg border border-cyan-200 dark:border-cyan-800">
              <Label className="text-sm font-semibold text-cyan-900 dark:text-cyan-100">📄 SELECT FORMAT</Label>
              <div className="grid grid-cols-4 gap-2">
                {['pdf', 'excel', 'csv', 'json', 'png', 'jpg', 'html', 'word'].map((fmt) => (
                  <Button
                    key={fmt}
                    variant={selectedFormat === fmt ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedFormat(fmt)}
                    className="text-xs uppercase"
                  >
                    {fmt}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Style & Color Options */}
          <div className="space-y-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
            <Label className="text-sm font-semibold text-purple-900 dark:text-purple-100">🎨 STYLE & COLORS</Label>
            
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Primary Color</Label>
                <div className="flex gap-2 items-center">
                  <input 
                    type="color" 
                    value={primaryColor} 
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-10 w-20 rounded border cursor-pointer"
                  />
                  <span className="text-xs font-mono">{primaryColor}</span>
                </div>
              </div>
              
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Accent Color</Label>
                <div className="flex gap-2 items-center">
                  <input 
                    type="color" 
                    value={accentColor} 
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="h-10 w-20 rounded border cursor-pointer"
                  />
                  <span className="text-xs font-mono">{accentColor}</span>
                </div>
              </div>
              
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Font Size</Label>
                <div className="flex gap-2">
                  {['small', 'medium', 'large'].map((size) => (
                    <Button
                      key={size}
                      variant={fontSize === size ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFontSize(size)}
                      className="flex-1 text-xs capitalize"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Include Summary */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-semibold">Include Summary</Label>
              <p className="text-sm text-muted-foreground">Key metrics and input values</p>
            </div>
            <Switch
              checked={includeSummary}
              onCheckedChange={setIncludeSummary}
            />
          </div>

          {/* Include Charts */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-semibold">Include Charts</Label>
              <p className="text-sm text-muted-foreground">Visual graphs and diagrams</p>
            </div>
            <Switch
              checked={includeCharts}
              onCheckedChange={setIncludeCharts}
            />
          </div>

          {/* Include Data Table */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-semibold">Include Data Table</Label>
              <p className="text-sm text-muted-foreground">Full amortization schedule</p>
            </div>
            <Switch
              checked={includeDataTable}
              onCheckedChange={setIncludeDataTable}
            />
          </div>

          {/* Row Limit */}
          {includeDataTable && (
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-muted-foreground">ROW LIMIT</Label>
              <div className="flex gap-2">
                <Button
                  variant={rowLimit === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRowLimit('all')}
                  className="flex-1"
                >
                  All Rows
                </Button>
                <Button
                  variant={rowLimit === '1year' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRowLimit('1year')}
                  className="flex-1"
                >
                  1 Year
                </Button>
                <Button
                  variant={rowLimit === '5years' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRowLimit('5years')}
                  className="flex-1"
                >
                  5 Years
                </Button>
                <Button
                  variant={rowLimit === 'custom' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRowLimit('custom')}
                  className="flex-1"
                >
                  Custom
                </Button>
              </div>
            </div>
          )}
          
          {/* Watermark */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-semibold">Add Watermark</Label>
              <p className="text-sm text-muted-foreground">Brand your downloads</p>
            </div>
            <Switch
              checked={includeWatermark}
              onCheckedChange={setIncludeWatermark}
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={isDownloading}>
            Cancel
          </Button>
          <Button 
            onClick={handleDownload} 
            disabled={isDownloading} 
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold shadow-lg"
          >
            <Download className="mr-2 h-4 w-4" />
            {isDownloading ? 'Downloading...' : `Download ${format === 'custom' ? selectedFormat.toUpperCase() : format.toUpperCase()}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
