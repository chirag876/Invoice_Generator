import { Input } from '../ui/Input'

export function SenderTab({ invoice, onSender, onChange }) {
  const s = invoice.sender
  return (
    <div className="flex flex-col gap-4 p-4">
      <section>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Invoice Info</p>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Invoice No." value={invoice.invoiceNumber} onChange={(v) => onChange({ invoiceNumber: v })} placeholder="INV-001" />
          <Input label="Invoice Title" value={invoice.invoiceTitle} onChange={(v) => onChange({ invoiceTitle: v })} placeholder="INVOICE" />
          <Input label="Invoice Date" type="date" value={invoice.invoiceDate} onChange={(v) => onChange({ invoiceDate: v })} />
          <Input label="Due Date" type="date" value={invoice.dueDate} onChange={(v) => onChange({ dueDate: v })} />
        </div>
      </section>

      <div className="border-t border-slate-100" />

      <section>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Your Details</p>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Name / Company" value={s.name} onChange={(v) => onSender({ name: v })} placeholder="Your Name" className="col-span-2" />
          <Input label="Email" type="email" value={s.email} onChange={(v) => onSender({ email: v })} placeholder="you@example.com" />
          <Input label="Phone" value={s.phone} onChange={(v) => onSender({ phone: v })} placeholder="+91 98765 43210" />
          <Input label="Address" value={s.address} onChange={(v) => onSender({ address: v })} placeholder="Street address" className="col-span-2" />
          <Input label="City" value={s.city} onChange={(v) => onSender({ city: v })} placeholder="Jaipur" />
          <Input label="State" value={s.state} onChange={(v) => onSender({ state: v })} placeholder="Rajasthan" />
          <Input label="Pincode" value={s.pincode} onChange={(v) => onSender({ pincode: v })} placeholder="302001" />
          <Input label="GSTIN" value={s.gstin} onChange={(v) => onSender({ gstin: v })} placeholder="22AAAAA0000A1Z5" />
          <Input label="PAN" value={s.pan} onChange={(v) => onSender({ pan: v })} placeholder="AAAAA0000A" className="col-span-2" />
        </div>
      </section>
    </div>
  )
}
