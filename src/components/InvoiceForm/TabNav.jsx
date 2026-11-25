
import {
  User,
  Building2,
  ShoppingCart,
  Palette,
  FileText,
  Wallet,
} from 'lucide-react'

const TABS = [
  { id: 'sender', label: 'Sender', icon: User },
  { id: 'client', label: 'Client', icon: Building2 },
  { id: 'items', label: 'Items', icon: ShoppingCart },
  { id: 'notes', label: 'Notes & Terms', icon: FileText },
  { id: 'payment', label: 'Payment', icon: Wallet },
  { id: 'style', label: 'Style', icon: Palette },
]

export function TabNav({ active, onChange }) {
  return (
    <div className="flex border-b border-slate-200 bg-white overflow-x-auto flex-shrink-0">
      {TABS.map(({ id, label, icon: Icon }) => {
        const isActive = active === id

        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`flex-1 min-w-[70px] flex flex-col items-center gap-1 py-3 px-1 text-[11px] font-medium transition-colors relative whitespace-nowrap ${
              isActive
                ? 'text-indigo-600'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Icon size={15} />
            <span>{label}</span>

            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t" />
            )}
          </button>
        )
      })}
    </div>
  )
}
