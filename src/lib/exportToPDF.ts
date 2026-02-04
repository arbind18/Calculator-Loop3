import jsPDF from 'jspdf';

export interface PDFExportOptions {
  title: string;
  subtitle?: string;
  sections: PDFSection[];
  footer?: string;
  filename?: string;
}

export interface PDFSection {
  heading: string;
  content: string | string[];
  type?: 'text' | 'table' | 'calculation';
}

export async function exportCalculationToPDF(options: PDFExportOptions) {
  const {
    title,
    subtitle,
    sections,
    footer = `Generated on ${new Date().toLocaleString()}`,
    filename = `calculation-${Date.now()}.pdf`
  } = options;

  // Create new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // Helper function to add new page if needed
  const checkPageBreak = (requiredHeight: number) => {
    if (yPosition + requiredHeight > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Helper function to wrap text
  const wrapText = (text: string, maxWidth: number): string[] => {
    return doc.splitTextToSize(text, maxWidth);
  };

  // Add header/title
  doc.setFontSize(20);
  doc.setTextColor(31, 41, 55); // gray-800
  doc.text(title, margin, yPosition);
  yPosition += 10;

  // Add subtitle if provided
  if (subtitle) {
    doc.setFontSize(12);
    doc.setTextColor(107, 114, 128); // gray-500
    doc.text(subtitle, margin, yPosition);
    yPosition += 8;
  }

  // Add horizontal line
  doc.setDrawColor(229, 231, 235); // gray-200
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Add sections
  for (const section of sections) {
    checkPageBreak(20);

    // Section heading
    doc.setFontSize(14);
    doc.setTextColor(37, 99, 235); // blue-600
    doc.text(section.heading, margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setTextColor(55, 65, 81); // gray-700

    if (Array.isArray(section.content)) {
      // Multiple lines of content
      for (const line of section.content) {
        checkPageBreak(7);
        const wrappedLines = wrapText(line, pageWidth - 2 * margin);
        for (const wrappedLine of wrappedLines) {
          checkPageBreak(5);
          doc.text(wrappedLine, margin + 5, yPosition);
          yPosition += 5;
        }
      }
    } else {
      // Single content block
      const wrappedLines = wrapText(section.content, pageWidth - 2 * margin);
      for (const wrappedLine of wrappedLines) {
        checkPageBreak(5);
        doc.text(wrappedLine, margin + 5, yPosition);
        yPosition += 5;
      }
    }

    yPosition += 5; // Space between sections
  }

  // Add footer
  const footerY = pageHeight - 15;
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175); // gray-400
  doc.text(footer, margin, footerY);
  doc.text(
    `Page ${doc.getCurrentPageInfo().pageNumber}`,
    pageWidth - margin - 15,
    footerY
  );

  // Save the PDF
  doc.save(filename);
}

// Specialized export for calculation results
export async function exportCalculationResult({
  calculatorName,
  inputs,
  result,
  steps,
  additionalInfo
}: {
  calculatorName: string;
  inputs: Array<{ label: string; value: string }>;
  result: string;
  steps?: string[];
  additionalInfo?: Array<{ label: string; value: string }>;
}) {
  const sections: PDFSection[] = [];

  // Input values section
  sections.push({
    heading: 'Input Values',
    content: inputs.map(input => `${input.label}: ${input.value}`)
  });

  // Result section
  sections.push({
    heading: 'Result',
    content: result,
    type: 'calculation'
  });

  // Steps section if provided
  if (steps && steps.length > 0) {
    sections.push({
      heading: 'Step-by-Step Solution',
      content: steps
    });
  }

  // Additional information if provided
  if (additionalInfo && additionalInfo.length > 0) {
    sections.push({
      heading: 'Additional Information',
      content: additionalInfo.map(info => `${info.label}: ${info.value}`)
    });
  }

  await exportCalculationToPDF({
    title: calculatorName,
    subtitle: 'Calculation Report',
    sections,
    filename: `${calculatorName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`
  });
}

// Export multiple calculations
export async function exportCalculationHistory({
  calculatorName,
  history
}: {
  calculatorName: string;
  history: Array<{
    timestamp: Date;
    expression: string;
    result: string;
    details?: string;
  }>;
}) {
  const sections: PDFSection[] = history.map((entry, index) => ({
    heading: `Calculation ${index + 1} - ${entry.timestamp.toLocaleString()}`,
    content: [
      `Expression: ${entry.expression}`,
      `Result: ${entry.result}`,
      ...(entry.details ? [`Details: ${entry.details}`] : [])
    ]
  }));

  await exportCalculationToPDF({
    title: `${calculatorName} - History`,
    subtitle: `${history.length} calculation(s)`,
    sections,
    filename: `${calculatorName.toLowerCase().replace(/\s+/g, '-')}-history-${Date.now()}.pdf`
  });
}
