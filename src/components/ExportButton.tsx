'use client';

import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Image as ImageIcon, FileJson, File, FileImage, Code, Database, Archive, Lock } from 'lucide-react';

interface ExportButtonProps {
  data: any;
  formats?: string[];
  filename?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ 
  data, 
  formats = ['PDF', 'CSV', 'Excel', 'JSON', 'PNG', 'JPG', 'SVG', 'HTML', 'Word', 'PowerPoint', 'XML', 'SQL', 'ZIP', 'Encrypted PDF'],
  filename = 'calculator-result'
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleExport = async (format: string) => {
    setIsExporting(true);
    setShowMenu(false);
    
    try {
      switch (format.toLowerCase()) {
        case 'pdf':
          await exportToPDF();
          break;
        case 'csv':
          await exportToCSV();
          break;
        case 'excel':
          await exportToExcel();
          break;
        case 'json':
          await exportToJSON();
          break;
        case 'png':
          await exportToImage('png');
          break;
        case 'jpg':
          await exportToImage('jpg');
          break;
        case 'svg':
          await exportToSVG();
          break;
        case 'html':
          await exportToHTML();
          break;
        case 'word':
          await exportToWord();
          break;
        case 'powerpoint':
          await exportToPowerPoint();
          break;
        case 'xml':
          await exportToXML();
          break;
        case 'sql':
          await exportToSQL();
          break;
        case 'zip':
          await exportToZIP();
          break;
        case 'encrypted pdf':
          await exportToEncryptedPDF();
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Calculator Result', 20, 20);
    doc.setFontSize(12);
    doc.text(JSON.stringify(data, null, 2), 20, 40);
    
    doc.save(`${filename}.pdf`);
  };

  const exportToCSV = () => {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToExcel = async () => {
    const XLSX = await import('xlsx');
    const ws = XLSX.utils.json_to_sheet([data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Results');
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  const exportToImage = async (format: 'png' | 'jpg') => {
    const html2canvas = (await import('html2canvas')).default;
    const element = document.querySelector('.calculator-result');
    if (element) {
      const canvas = await html2canvas(element as HTMLElement);
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const url = canvas.toDataURL(mimeType);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.${format}`;
      a.click();
    }
  };

  const exportToJSON = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToSVG = () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
      <text x="20" y="30" font-size="20">${filename}</text>
      <text x="20" y="60" font-size="14">${JSON.stringify(data)}</text>
    </svg>`;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.svg`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToHTML = () => {
    const html = `<!DOCTYPE html>
<html>
<head><title>${filename}</title></head>
<body>
  <h1>Calculator Result</h1>
  <pre>${JSON.stringify(data, null, 2)}</pre>
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.html`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToWord = () => {
    const doc = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>${filename}</title></head>
      <body><h1>Calculator Result</h1><pre>${JSON.stringify(data, null, 2)}</pre></body>
    </html>`;
    const blob = new Blob(['\ufeff', doc], { type: 'application/msword' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.doc`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToPowerPoint = () => {
    alert('PowerPoint export coming soon!');
  };

  const exportToXML = () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<result>
  ${Object.entries(data).map(([key, value]) => `<${key}>${value}</${key}>`).join('\n  ')}
</result>`;
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.xml`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToSQL = () => {
    const sql = `INSERT INTO calculator_results (data, created_at) VALUES ('${JSON.stringify(data)}', NOW());`;
    const blob = new Blob([sql], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.sql`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToZIP = async () => {
    alert('ZIP export - Will bundle all formats together!');
  };

  const exportToEncryptedPDF = async () => {
    const password = prompt('Enter password for PDF encryption:');
    if (password) {
      alert('Encrypted PDF export coming soon!');
    }
  };

  const convertToCSV = (obj: any): string => {
    const keys = Object.keys(obj);
    const values = Object.values(obj);
    return keys.join(',') + '\n' + values.join(',');
  };

  const getFormatIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case 'pdf':
      case 'encrypted pdf':
        return <FileText className="w-4 h-4" />;
      case 'csv':
      case 'excel':
        return <FileSpreadsheet className="w-4 h-4" />;
      case 'json':
        return <FileJson className="w-4 h-4" />;
      case 'png':
      case 'jpg':
      case 'svg':
        return <FileImage className="w-4 h-4" />;
      case 'html':
      case 'word':
      case 'powerpoint':
        return <File className="w-4 h-4" />;
      case 'xml':
      case 'sql':
        return <Code className="w-4 h-4" />;
      case 'zip':
        return <Archive className="w-4 h-4" />;
      default:
        return <Download className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={isExporting}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg shadow-md transition-all duration-200 disabled:opacity-50"
      >
        <Download className="w-4 h-4" />
        {isExporting ? 'Exporting...' : 'Export Results'}
      </button>

      {showMenu && (
        <div className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 min-w-[180px] z-50">
          {formats.map((format) => (
            <button
              key={format}
              onClick={() => handleExport(format)}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
            >
              {getFormatIcon(format)}
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Export as {format}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
