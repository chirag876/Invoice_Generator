import { PreviewHeader } from './PreviewHeader'
import { PreviewItems } from './PreviewItems'
import { PreviewFooter } from './PreviewFooter'

export function InvoicePreview({ invoice }) {
  const accent = invoice.accentColor || '#0ea5e9'

  return (
    <div
      id="invoice-preview-render"
      className="bg-white w-full min-h-[1050px] font-sans text-slate-800"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <PreviewHeader invoice={invoice} accent={accent} />
      <PreviewItems invoice={invoice} accent={accent} />
      <PreviewFooter invoice={invoice} accent={accent} />
    </div>
  )
}
