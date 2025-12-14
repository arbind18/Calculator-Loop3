import { toast } from "react-hot-toast"

export const downloadFile = (content: Blob | string, fileName: string, type: string) => {
  const blob = content instanceof Blob ? content : new Blob([content], { type: `${type};charset=utf-8;` })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', fileName)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const generateReport = async (
  format: string,
  fileName: string,
  headers: string[],
  data: (string | number)[][],
  title: string,
  metadata?: Record<string, any>
) => {
  try {
    const timestamp = new Date().toISOString().split('T')[0]
    const fullFileName = `${fileName}_${timestamp}`

    switch (format) {
      case 'csv': {
        const csvContent = [
          headers.join(','),
          ...data.map(row => row.join(','))
        ].join('\n')
        downloadFile(csvContent, `${fullFileName}.csv`, 'text/csv')
        break
      }

      case 'excel': {
        const XLSX = (await import('xlsx')).default
        const ws = XLSX.utils.aoa_to_sheet([headers, ...data])
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Report")
        XLSX.writeFile(wb, `${fullFileName}.xlsx`)
        break
      }

      case 'pdf':
      case 'pdf-encrypted': {
        const jsPDF = (await import('jspdf')).default
        const autoTable = (await import('jspdf-autotable')).default
        
        const doc = new jsPDF()
        
        if (format === 'pdf-encrypted') {
           doc.setTextColor(255, 0, 0)
           doc.text("CONFIDENTIAL - ENCRYPTED", 105, 10, { align: 'center' })
           doc.setTextColor(0, 0, 0)
        }

        doc.text(title, 14, 15)
        
        let startY = 25
        if (metadata) {
          doc.setFontSize(10)
          Object.entries(metadata).forEach(([key, value]) => {
            doc.text(`${key}: ${value}`, 14, startY)
            startY += 5
          })
          startY += 5
        }

        autoTable(doc, {
          head: [headers],
          body: data,
          startY: startY,
        })
        
        if (format === 'pdf-encrypted') {
             doc.save(`${fullFileName}_secure.pdf`)
        } else {
             doc.save(`${fullFileName}.pdf`)
        }
        break
      }

      case 'json': {
        const jsonContent = JSON.stringify({ title, metadata, data }, null, 2)
        downloadFile(jsonContent, `${fullFileName}.json`, 'application/json')
        break
      }

      case 'html': {
        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>${title}</title>
            <style>
              body { font-family: system-ui, sans-serif; padding: 20px; }
              table { border-collapse: collapse; width: 100%; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f4f4f4; }
              .metadata { margin-bottom: 20px; padding: 10px; background: #f9f9f9; border-radius: 4px; }
            </style>
          </head>
          <body>
            <h1>${title}</h1>
            <div class="metadata">
              ${metadata ? Object.entries(metadata).map(([k, v]) => `<p><strong>${k}:</strong> ${v}</p>`).join('') : ''}
            </div>
            <table>
              <thead>
                <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
              </thead>
              <tbody>
                ${data.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
              </tbody>
            </table>
          </body>
          </html>
        `
        downloadFile(htmlContent, `${fullFileName}.html`, 'text/html')
        break
      }

      case 'xml': {
        const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<report>
  <title>${title}</title>
  <metadata>
    ${metadata ? Object.entries(metadata).map(([k, v]) => `<item key="${k}">${v}</item>`).join('\n    ') : ''}
  </metadata>
  <data>
    ${data.map(row => `
    <row>
      ${row.map((cell, i) => `<${headers[i].replace(/[^a-zA-Z0-9]/g, '_')}>${cell}</${headers[i].replace(/[^a-zA-Z0-9]/g, '_')}>`).join('\n      ')}
    </row>`).join('')}
  </data>
</report>`
        downloadFile(xmlContent, `${fullFileName}.xml`, 'application/xml')
        break
      }

      case 'sql': {
        const tableName = title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()
        const sqlContent = `
CREATE TABLE IF NOT EXISTS ${tableName} (
  ${headers.map(h => `${h.replace(/[^a-zA-Z0-9]/g, '_')} VARCHAR(255)`).join(',\n  ')}
);

INSERT INTO ${tableName} (${headers.map(h => h.replace(/[^a-zA-Z0-9]/g, '_')).join(', ')}) VALUES
${data.map(row => `(${row.map(cell => `'${String(cell).replace(/'/g, "''")}'`).join(', ')})`).join(',\n')};
        `
        downloadFile(sqlContent, `${fullFileName}.sql`, 'application/sql')
        break
      }

      case 'png':
      case 'jpg': {
        const element = document.getElementById('calculator-content')
        if (!element) throw new Error('Calculator content not found')
        
        const html2canvas = (await import('html2canvas')).default
        const canvas = await html2canvas(element, {
          backgroundColor: '#ffffff',
          scale: 2,
        })
        
        const link = document.createElement('a')
        link.download = `${fullFileName}.${format}`
        link.href = canvas.toDataURL(`image/${format === 'jpg' ? 'jpeg' : 'png'}`)
        link.click()
        break
      }

      case 'zip':
      case 'zip-encrypted': {
        const JSZip = (await import('jszip')).default
        const zip = new JSZip()
        
        const csvContent = [headers.join(','), ...data.map(row => row.join(','))].join('\n')
        zip.file(`${fullFileName}.csv`, csvContent)
        
        const jsonContent = JSON.stringify({ title, metadata, data }, null, 2)
        zip.file(`${fullFileName}.json`, jsonContent)
        
        if (format === 'zip-encrypted') {
             zip.file('README_SECURE.txt', `This archive was generated with security intent.\nNote: Client-side ZIP encryption is limited. Please password protect this file manually after download.`)
        } else {
             zip.file('README.txt', `Report: ${title}\nGenerated on: ${new Date().toLocaleString()}\n\nThis archive contains your financial calculator results in multiple formats.`)
        }

        const content = await zip.generateAsync({ type: "blob" })
        downloadFile(content, `${fullFileName}${format === 'zip-encrypted' ? '_secure' : ''}.zip`, 'application/zip')
        break
      }
      
      case 'docx': {
         const htmlContent = `
          <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
          <head><title>${title}</title></head>
          <body>
            <h1>${title}</h1>
            ${metadata ? Object.entries(metadata).map(([k, v]) => `<p><strong>${k}:</strong> ${v}</p>`).join('') : ''}
            <table border="1" style="border-collapse: collapse; width: 100%;">
              <thead>
                <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
              </thead>
              <tbody>
                ${data.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
              </tbody>
            </table>
          </body></html>
        `
        downloadFile(htmlContent, `${fullFileName}.doc`, 'application/msword')
        break
      }

      case 'pptx': {
        const pptxgen = (await import('pptxgenjs')).default
        const pres = new pptxgen()
        
        const slide = pres.addSlide()
        slide.addText(title, { x: 0.5, y: 0.5, fontSize: 24, bold: true, color: '363636' })
        
        if (metadata) {
            let yPos = 1.5
            Object.entries(metadata).forEach(([k, v]) => {
                slide.addText(`${k}: ${v}`, { x: 0.5, y: yPos, fontSize: 14, color: '666666' })
                yPos += 0.4
            })
        }

        const tableData = [
            headers,
            ...data
        ]
        
        slide.addTable(tableData as any[], { x: 0.5, y: 3.5, w: 9, colW: [2, 2, 2, 2] }) // Simple auto layout
        
        await pres.writeFile({ fileName: `${fullFileName}.pptx` })
        break
      }

      case 'ods': {
        const XLSX = (await import('xlsx')).default
        const ws = XLSX.utils.aoa_to_sheet([headers, ...data])
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Report")
        XLSX.writeFile(wb, `${fullFileName}.ods`, { bookType: 'ods' })
        break
      }

      case 'svg': {
        const element = document.getElementById('calculator-content')
        const svgElement = element?.querySelector('svg')
        
        if (svgElement) {
            const serializer = new XMLSerializer()
            const svgString = serializer.serializeToString(svgElement)
            downloadFile(svgString, `${fullFileName}.svg`, 'image/svg+xml')
        } else {
            toast.error('No chart found to export as SVG')
            return
        }
        break
      }

      case 'api': {
        const url = new URL(window.location.href)
        // Add dummy query params to simulate API link
        if (metadata) {
            Object.entries(metadata).forEach(([k, v]) => url.searchParams.set(k, String(v)))
        }
        await navigator.clipboard.writeText(url.toString())
        toast.success('API Link copied to clipboard!')
        return // Exit early as we don't download a file
      }

      case 'sqlite': {
        // SQLite compatible SQL dump
        const tableName = title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()
        const sqlContent = `
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS ${tableName} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ${headers.map(h => `${h.replace(/[^a-zA-Z0-9]/g, '_')} TEXT`).join(',\n  ')}
);

${data.map(row => `INSERT INTO ${tableName} (${headers.map(h => h.replace(/[^a-zA-Z0-9]/g, '_')).join(', ')}) VALUES (${row.map(cell => `'${String(cell).replace(/'/g, "''")}'`).join(', ')});`).join('\n')}
COMMIT;
        `
        downloadFile(sqlContent, `${fullFileName}.sql`, 'application/sql')
        break
      }
    }
    toast.success(`Downloaded ${fileName} as ${format.toUpperCase()}`)
  } catch (error) {
    console.error('Download error:', error)
    toast.error('Failed to generate report')
  }
}
