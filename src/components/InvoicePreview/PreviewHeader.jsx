export function PreviewHeader({ invoice, accent }) {
  const { sender, receiver, invoiceTitle, invoiceNumber, invoiceDate, dueDate, logoUrl, logoSize, logoRotation } = invoice

  return (
    <div>
      {/* Top bar */}
      <div className="px-10 py-6 flex items-start justify-between" style={{ borderBottom: `3px solid ${accent}` }}>
        {/* Left: logo (above name) + sender info */}
        <div className="flex flex-col gap-1.5">
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Logo"
              style={{
                width: `${logoSize || 80}px`,
                transform: `rotate(${logoRotation || 0}deg)`,
              }}
              className="object-contain mb-1"
            />
          )}
          <div className="text-xl font-bold tracking-tight" style={{ color: accent }}>
            {sender.name || 'Your Company'}
          </div>
          <div className="text-xs text-slate-500 leading-5">
            {sender.email && <div>{sender.email}</div>}
            {sender.phone && <div>{sender.phone}</div>}
          </div>
        </div>

        {/* Right: invoice title + number */}
        <div className="text-right">
          <h1 className="text-3xl font-black tracking-widest uppercase" style={{ color: accent }}>
            {invoiceTitle || 'INVOICE'}
          </h1>
          <div className="mt-2 text-sm text-slate-600 font-semibold">#{invoiceNumber}</div>
          <div className="text-xs text-slate-400 mt-1">Date: {invoiceDate || '—'}</div>
          {dueDate && <div className="text-xs text-slate-400">Due: {dueDate}</div>}
        </div>
      </div>

      {/* From / To */}
      <div className="px-10 py-6 grid grid-cols-2 gap-8">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>From</div>
          <div className="text-sm font-semibold text-slate-800">{sender.name || '—'}</div>
          <div className="text-xs text-slate-500 mt-1 leading-5">
            {sender.address && <div>{sender.address}</div>}
            {(sender.city || sender.state) && (
              <div>{[sender.city, sender.state, sender.pincode].filter(Boolean).join(', ')}</div>
            )}
            {sender.gstin && <div>GSTIN: {sender.gstin}</div>}
            {sender.pan && <div>PAN: {sender.pan}</div>}
          </div>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>Bill To</div>
          <div className="text-sm font-semibold text-slate-800">{receiver.name || '—'}</div>
          <div className="text-xs text-slate-500 mt-1 leading-5">
            {receiver.email && <div>{receiver.email}</div>}
            {receiver.phone && <div>{receiver.phone}</div>}
            {receiver.address && <div>{receiver.address}</div>}
            {(receiver.city || receiver.state) && (
              <div>{[receiver.city, receiver.state, receiver.pincode].filter(Boolean).join(', ')}</div>
            )}
            {receiver.gstin && <div>GSTIN: {receiver.gstin}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
