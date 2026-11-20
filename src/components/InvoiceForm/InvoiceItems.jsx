import { Plus, Trash2, ShoppingCart } from 'lucide-react'
import { Card, CardHeader, CardBody } from '../ui/Card'
import { Button } from '../ui/Button'
import { calculateTotals, formatCurrency } from '../../utils/calculateTotals'

function ItemRow({ item, sym, onChange, onRemove, canRemove }) {
  return (
    <div className="grid grid-cols-12 gap-2 items-center py-2 border-b border-slate-100 last:border-0">
      {/* Description */}
      <input
        value={item.description}
        onChange={(e) => onChange({ description: e.target.value })}
        placeholder="Item description"
        className="col-span-4 px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
      />
      {/* Quantity */}
      <input
        type="number"
        min="0"
        value={item.quantity}
        onChange={(e) => onChange({ quantity: parseFloat(e.target.value) || 0 })}
        className="col-span-2 px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent text-center"
      />
      {/* Rate */}
      <input
        type="number"
        min="0"
        value={item.rate}
        onChange={(e) => onChange({ rate: parseFloat(e.target.value) || 0 })}
        className="col-span-2 px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
      />
      {/* Tax */}
      <input
        type="number"
        min="0"
        max="100"
        value={item.taxPercent}
        onChange={(e) => onChange({ taxPercent: parseFloat(e.target.value) || 0 })}
        className="col-span-2 px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent text-center"
      />
      {/* Amount */}
      <div className="col-span-1 text-sm font-medium text-slate-700 text-right">
        {formatCurrency(item.quantity * item.rate, sym)}
      </div>
      {/* Remove */}
      <div className="col-span-1 flex justify-end">
        {canRemove && (
          <button
            onClick={onRemove}
            className="text-slate-300 hover:text-red-400 transition-colors p-1 rounded"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  )
}

export function InvoiceItems({ items, sym, onAdd, onUpdate, onRemove }) {
  const { subtotal, totalTax, grandTotal } = calculateTotals(items)

  return (
    <Card>
      <CardHeader
        title="Line Items"
        icon={<ShoppingCart size={16} />}
        action={
          <Button variant="accent" size="sm" onClick={onAdd}>
            <Plus size={13} /> Add Item
          </Button>
        }
      />
      <CardBody className="p-0">
        {/* Column headers */}
        <div className="grid grid-cols-12 gap-2 px-5 py-2 bg-slate-50 border-b border-slate-100">
          <span className="col-span-4 text-xs font-semibold text-slate-500 uppercase">Description</span>
          <span className="col-span-2 text-xs font-semibold text-slate-500 uppercase text-center">Qty</span>
          <span className="col-span-2 text-xs font-semibold text-slate-500 uppercase">Rate ({sym})</span>
          <span className="col-span-2 text-xs font-semibold text-slate-500 uppercase text-center">Tax %</span>
          <span className="col-span-1 text-xs font-semibold text-slate-500 uppercase text-right">Amt</span>
          <span className="col-span-1"></span>
        </div>

        <div className="px-5">
          {items.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              sym={sym}
              onChange={(updates) => onUpdate(item.id, updates)}
              onRemove={() => onRemove(item.id)}
              canRemove={items.length > 1}
            />
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-slate-100 px-5 py-4 flex flex-col items-end gap-1.5">
          <div className="flex gap-8 text-sm text-slate-600">
            <span>Subtotal</span>
            <span className="font-medium w-28 text-right">{formatCurrency(subtotal, sym)}</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-600">
            <span>Tax</span>
            <span className="font-medium w-28 text-right">{formatCurrency(totalTax, sym)}</span>
          </div>
          <div className="flex gap-8 text-base font-bold text-ink border-t border-slate-200 pt-2 mt-1">
            <span>Total</span>
            <span className="w-28 text-right" style={{ color: 'var(--accent, #0ea5e9)' }}>
              {formatCurrency(grandTotal, sym)}
            </span>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
