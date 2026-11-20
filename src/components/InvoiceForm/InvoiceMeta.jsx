import { FileText } from 'lucide-react'
import { Card, CardHeader, CardBody } from '../ui/Card'
import { Input } from '../ui/Input'
import { CURRENCIES } from '../../constants/defaultInvoice'

export function InvoiceMeta({ invoice, onChange }) {
  return (
    <Card>
      <CardHeader title="Invoice Details" icon={<FileText size={16} />} />
      <CardBody>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Invoice Title"
            value={invoice.invoiceTitle}
            onChange={(v) => onChange({ invoiceTitle: v })}
            placeholder="INVOICE"
            className="col-span-2"
          />
          <Input
            label="Invoice Number"
            value={invoice.invoiceNumber}
            onChange={(v) => onChange({ invoiceNumber: v })}
            placeholder="INV-001"
            required
          />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Currency</label>
            <select
              value={invoice.currency}
              onChange={(e) => {
                const found = CURRENCIES.find((c) => c.code === e.target.value)
                if (found) onChange({ currency: found.code, currencySymbol: found.symbol })
              }}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} — {c.label}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Invoice Date"
            value={invoice.invoiceDate}
            onChange={(v) => onChange({ invoiceDate: v })}
            type="date"
          />
          <Input
            label="Due Date"
            value={invoice.dueDate}
            onChange={(v) => onChange({ dueDate: v })}
            type="date"
          />
        </div>
      </CardBody>
    </Card>
  )
}
