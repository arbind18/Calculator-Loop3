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

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      switch(format.toLowerCase()) {
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
          await downloadImage(format);
          break;
        default:
          alert(`${format} download coming soon!`);
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
    const XLSX = await import('xlsx');
    const wb = XLSX.utils.book_new();
    
    if (includeSummary) {
      const summaryData = Object.entries(data).map(([key, value]) => ({ Field: key, Value: value }));
      const ws = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, ws, 'Summary');
    }
    
    if (includeDataTable && data.schedule) {
      const rows = getFilteredRows(data.schedule);
      const ws = XLSX.utils.json_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, 'Data');
    }
    
    XLSX.writeFile(wb, `${title}-${Date.now()}.xlsx`);
  };

  const downloadPDF = async () => {
    const doc = new jsPDF();
    let yPos = 20;
    
    // Title
    doc.setFontSize(20);
    doc.text(title, 20, yPos);
    yPos += 15;
    
    // Summary
    if (includeSummary) {
      doc.setFontSize(14);
      doc.text('Summary', 20, yPos);
      yPos += 10;
      
      doc.setFontSize(10);
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
      });
    }
    
    doc.save(`${title}-${Date.now()}.pdf`);
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
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">Customize Download</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">Select what to include ({format.toUpperCase()})</p>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
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
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={isDownloading}>
            Cancel
          </Button>
          <Button onClick={handleDownload} disabled={isDownloading} className="bg-cyan-500 hover:bg-cyan-600">
            <Download className="mr-2 h-4 w-4" />
            {isDownloading ? 'Downloading...' : 'Download Now'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
