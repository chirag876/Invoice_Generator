import { calculateTotals, formatCurrency, getItemAmount } from '../../utils/calculateTotals'

export function PreviewItems({ invoice, accent }) {
  const { items, currencySymbol: sym } = invoice
  const totals = calculateTotals(invoice)

  return (
    <div className="px-10">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr style={{ backgroundColor: accent }}>
            <th className="text-left text-white font-semibold text-xs uppercase tracking-wide px-3 py-2.5 rounded-tl">Description</th>
            <th className="text-center text-white font-semibold text-xs uppercase tracking-wide px-3 py-2.5 w-16">Qty / Hrs</th>
            <th className="text-right text-white font-semibold text-xs uppercase tracking-wide px-3 py-2.5 w-24">Rate</th>
            <th className="text-right text-white font-semibold text-xs uppercase tracking-wide px-3 py-2.5 w-24 rounded-tr">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => {
            const isTask = item.type === 'task'
            const name = isTask ? item.taskName : item.description
            const sub = isTask ? item.taskDescription : item.subDescription
            const qtyLabel = isTask ? item.hours : item.quantity
            return (
              <tr key={item.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <td className="px-3 py-2.5 text-slate-700">
                  <div className="font-medium">{name || <span className="text-slate-300 italic">—</span>}</div>
                  {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
                </td>
                <td className="px-3 py-2.5 text-slate-600 text-center">{qtyLabel}</td>
                <td className="px-3 py-2.5 text-slate-600 text-right">{formatCurrency(item.rate, sym)}</td>
                <td className="px-3 py-2.5 font-medium text-slate-700 text-right">{formatCurrency(getItemAmount(item), sym)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mt-4">
        <div className="w-60">
          <div className="flex justify-between text-sm text-slate-500 py-1">
            <span>Subtotal</span><span>{formatCurrency(totals.subtotal, sym)}</span>
          </div>
          {invoice.discountEnabled && totals.discountAmount > 0 && (
            <div className="flex justify-between text-sm text-slate-500 py-1">
              <span>Discount</span><span className="text-red-500">− {formatCurrency(totals.discountAmount, sym)}</span>
            </div>
          )}
          {invoice.taxEnabled && (
            <div className="flex justify-between text-sm text-slate-500 py-1">
              <span>{invoice.taxLabel || 'Tax'} ({invoice.taxPercent}%)</span>
              <span>{formatCurrency(totals.taxAmount, sym)}</span>
            </div>
          )}
          {invoice.shippingEnabled && totals.shipping > 0 && (
            <div className="flex justify-between text-sm text-slate-500 py-1">
              <span>Shipping</span><span>{formatCurrency(totals.shipping, sym)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold py-2 mt-1 border-t-2" style={{ borderColor: accent, color: accent }}>
            <span>Total</span><span>{formatCurrency(totals.grandTotal, sym)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
