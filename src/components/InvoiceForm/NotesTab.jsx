import { Plus, X } from 'lucide-react'

function NumberedList({ title, items, onChange }) {
  const addItem = () => onChange([...items, ''])
  const removeItem = (i) => onChange(items.filter((_, idx) => idx !== i))
  const updateItem = (i, val) => onChange(items.map((it, idx) => (idx === i ? val : it)))

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{title}</p>
        <button
          onClick={addItem}
          className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 font-semibold transition-colors"
        >
          <Plus size={13} /> Add
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-xs font-bold text-slate-400 mt-2.5 w-5 flex-shrink-0 text-right">
              {i + 1}.
            </span>
            <textarea
              value={item}
              onChange={(e) => updateItem(i, e.target.value)}
              placeholder={`${title} item ${i + 1}`}
              rows={2}
              className="flex-1 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 resize-none transition-colors"
            />
            {items.length > 1 && (
              <button
                onClick={() => removeItem(i)}
                className="mt-2.5 text-slate-300 hover:text-red-400 transition-colors flex-shrink-0"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export function NotesTab({ invoice, onChange }) {
  const notes = Array.isArray(invoice.notes) ? invoice.notes : ['']
  const terms = Array.isArray(invoice.terms) ? invoice.terms : ['']

  return (
    <div className="flex flex-col gap-6 p-4">
      <NumberedList
        title="Notes"
        items={notes}
        onChange={(v) => onChange({ notes: v })}
      />
      <div className="border-t border-slate-100" />
      <NumberedList
        title="Terms & Conditions"
        items={terms}
        onChange={(v) => onChange({ terms: v })}
      />
    </div>
  )
}
