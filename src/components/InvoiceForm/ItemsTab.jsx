import { Plus, X, Package, Clock } from 'lucide-react'
import { formatCurrency, calculateTotals, getItemAmount } from '../../utils/calculateTotals'
import { CURRENCIES } from '../../constants/defaultInvoice'

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-indigo-600' : 'bg-slate-300'}`}
    >
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-1'}`} />
    </button>
  )
}

function ToggleRow({ label, checked, onChange, children }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">{checked ? 'Show' : 'Hide'}</span>
          <Toggle checked={checked} onChange={onChange} />
        </div>
      </div>
      {checked && children}
    </div>
  )
}

function CommodityRow({ item, sym, onChange, onRemove, canRemove }) {
  return (
    <div className="bg-slate-50 rounded-xl p-3 flex flex-col gap-2 border border-slate-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
          <Package size={11} /> Commodity
        </span>
        {canRemove && (
          <button onClick={onRemove} className="text-slate-300 hover:text-red-400 transition-colors">
            <X size={14} />
          </button>
        )}
      </div>
      <input
        value={item.description}
        onChange={(e) => onChange({ description: e.target.value })}
        placeholder="Item / Service name"
        className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
      />
      <input
        value={item.subDescription || ''}
        onChange={(e) => onChange({ subDescription: e.target.value })}
        placeholder="Short description (optional)"
        className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
      />
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-1">Qty</label>
          <input
            type="number" min="0"
            value={item.quantity}
            onChange={(e) => onChange({ quantity: parseFloat(e.target.value) || 0 })}
            className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded-lg bg-white text-center focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Rate ({sym})</label>
          <input
            type="number" min="0"
            value={item.rate}
            onChange={(e) => onChange({ rate: parseFloat(e.target.value) || 0 })}
            className="w-full px-2.5 py-1.5 text-sm border border-slate-200 rounded-lg bg-white text-center focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Amount</label>
          <div className="px-2.5 py-1.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg text-center">
            {formatCurrency(getItemAmount(item), sym)}
          </div>
        </div>
      </div>
    </div>
  )
}

function TaskRow({ item, sym, onChange, onRemove, canRemove }) {
  const descLen = (item.taskDescription || '').length
  return (
    <div className="bg-indigo-50/60 rounded-xl p-3 flex flex-col gap-2 border border-indigo-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
          <Clock size={11} /> Task
        </span>
        {canRemove && (
          <button onClick={onRemove} className="text-slate-300 hover:text-red-400 transition-colors">
            <X size={14} />
          </button>
        )}
      </div>
      <input
        value={item.taskName || ''}
        onChange={(e) => onChange({ taskName: e.target.value })}
        placeholder="Task name"
        className="w-full px-2.5 py-1.5 text-sm border border-indigo-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
      />
      <div className="relative">
        <textarea
          value={item.taskDescription || ''}
          onChange={(e) => {
            if (e.target.value.length <= 500) onChange({ taskDescription: e.target.value })
          }}
          placeholder="Short description of the task (max 500 chars)"
          rows={2}
          maxLength={500}
          className="w-full px-2.5 py-1.5 text-xs border border-indigo-200 rounded-lg bg-white text-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
        />
        <span className={`absolute bottom-2 right-2 text-xs ${descLen > 450 ? 'text-orange-400' : 'text-slate-300'}`}>
          {descLen}/500
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-xs text-slate-400 block mb-1">Hours</label>
          <input
            type="number" min="0" step="0.5"
            value={item.hours || 0}
            onChange={(e) => onChange({ hours: parseFloat(e.target.value) || 0 })}
            className="w-full px-2.5 py-1.5 text-sm border border-indigo-200 rounded-lg bg-white text-center focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Rate/hr ({sym})</label>
          <input
            type="number" min="0"
            value={item.rate}
            onChange={(e) => onChange({ rate: parseFloat(e.target.value) || 0 })}
            className="w-full px-2.5 py-1.5 text-sm border border-indigo-200 rounded-lg bg-white text-center focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 block mb-1">Amount</label>
          <div className="px-2.5 py-1.5 text-sm font-semibold text-indigo-700 bg-white border border-indigo-200 rounded-lg text-center">
            {formatCurrency(getItemAmount(item), sym)}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ItemsTab({ invoice, onChange, onAdd, onUpdate, onRemove }) {
  const sym = invoice.currencySymbol
  const totals = calculateTotals(invoice)

  return (
    <div className="flex flex-col gap-5 p-4">

      {/* Currency */}
      <div>
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Currency</label>
        <select
          value={invoice.currency}
          onChange={(e) => {
            const found = CURRENCIES.find((c) => c.code === e.target.value)
            if (found) onChange({ currency: found.code, currencySymbol: found.symbol })
          }}
          className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
        >
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>{c.code} — {c.label}</option>
          ))}
        </select>
      </div>

      {/* Line Items */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Line Items</p>
        <div className="flex flex-col gap-3">
          {invoice.items.map((item) => (
            item.type === 'task'
              ? <TaskRow key={item.id} item={item} sym={sym}
                  onChange={(u) => onUpdate(item.id, u)}
                  onRemove={() => onRemove(item.id)}
                  canRemove={invoice.items.length > 1} />
              : <CommodityRow key={item.id} item={item} sym={sym}
                  onChange={(u) => onUpdate(item.id, u)}
                  onRemove={() => onRemove(item.id)}
                  canRemove={invoice.items.length > 1} />
          ))}
        </div>

        {/* Add buttons */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => onAdd('commodity')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            <Plus size={12} /><Package size={12} /> Add Commodity
          </button>
          <button
            onClick={() => onAdd('task')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            <Plus size={12} /><Clock size={12} /> Add Task
          </button>
        </div>
      </div>

      <div className="border-t border-slate-100" />

      {/* Charges & Taxes */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Charges &amp; Taxes</p>
        <div className="flex flex-col gap-4">
          <ToggleRow label="Tax" checked={invoice.taxEnabled} onChange={(v) => onChange({ taxEnabled: v })}>
            <div className="grid grid-cols-2 gap-2">
              <input value={invoice.taxLabel} onChange={(e) => onChange({ taxLabel: e.target.value })} placeholder="GST"
                className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400/40" />
              <input type="number" min="0" max="100" value={invoice.taxPercent} onChange={(e) => onChange({ taxPercent: parseFloat(e.target.value) || 0 })}
                className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400/40" />
            </div>
          </ToggleRow>
          <ToggleRow label="Discount" checked={invoice.discountEnabled} onChange={(v) => onChange({ discountEnabled: v })}>
            <div className="grid grid-cols-2 gap-2">
              <select value={invoice.discountType} onChange={(e) => onChange({ discountType: e.target.value })}
                className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400/40">
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount</option>
              </select>
              <input type="number" min="0" value={invoice.discountValue} onChange={(e) => onChange({ discountValue: parseFloat(e.target.value) || 0 })}
                className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400/40" />
            </div>
          </ToggleRow>
          <ToggleRow label="Shipping" checked={invoice.shippingEnabled} onChange={(v) => onChange({ shippingEnabled: v })}>
            <input type="number" min="0" value={invoice.shippingValue} onChange={(e) => onChange({ shippingValue: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400/40" />
          </ToggleRow>
        </div>
      </div>

      <div className="border-t border-slate-100" />

      {/* Totals */}
      <div className="flex flex-col gap-1.5 text-sm">
        <div className="flex justify-between text-slate-500">
          <span>Subtotal</span><span className="font-medium">{formatCurrency(totals.subtotal, sym)}</span>
        </div>
        {invoice.discountEnabled && totals.discountAmount > 0 && (
          <div className="flex justify-between text-slate-500">
            <span>Discount</span><span className="text-red-500 font-medium">− {formatCurrency(totals.discountAmount, sym)}</span>
          </div>
        )}
        {invoice.taxEnabled && (
          <div className="flex justify-between text-slate-500">
            <span>{invoice.taxLabel || 'Tax'} ({invoice.taxPercent}%)</span>
            <span className="font-medium">{formatCurrency(totals.taxAmount, sym)}</span>
          </div>
        )}
        {invoice.shippingEnabled && totals.shipping > 0 && (
          <div className="flex justify-between text-slate-500">
            <span>Shipping</span><span className="font-medium">{formatCurrency(totals.shipping, sym)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-base text-indigo-600 border-t border-slate-200 pt-2 mt-1">
          <span>Total</span><span>{formatCurrency(totals.grandTotal, sym)}</span>
        </div>
      </div>
    </div>
  )
}
