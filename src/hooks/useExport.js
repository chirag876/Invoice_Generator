import { useState, useCallback } from 'react'
import { exportToPDF } from '../utils/exportPDF'

export function useExport(invoice) {
  const [exporting, setExporting] = useState(false)

  const fileName = `${invoice.invoiceNumber || 'invoice'}-${invoice.receiver.name || 'client'}`
    .replace(/\s+/g, '-').toLowerCase()

  const downloadPDF = useCallback(async () => {
    try {
      setExporting(true)
      await exportToPDF('invoice-preview-render', `${fileName}.pdf`)
    } catch (err) {
      console.error('PDF export failed:', err)
      alert('PDF export failed. Please try again.')
    } finally {
      setExporting(false)
    }
  }, [invoice, fileName])

  return { downloadPDF, exporting }
}
